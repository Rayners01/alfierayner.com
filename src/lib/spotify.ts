import "server-only";
import type { NowPlaying } from "./spotify.types";

export type { NowPlaying };

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

type CurrentlyPlayingResponse = {
  is_playing: boolean;
  item: SpotifyTrack | null;
  progress_ms: number;
};

type RecentlyPlayedResponse = {
  items: { track: SpotifyTrack }[];
};

function credentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Spotify credentials. See .env.example for the required variables.",
    );
  }

  return { clientId, clientSecret, refreshToken };
}

/**
 * Access tokens last an hour, so cache one in module scope. Without this every
 * poll from every visitor costs an extra round trip to Spotify's token
 * endpoint. Refreshed a minute early to avoid racing the expiry.
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const { clientId, clientSecret, refreshToken } = credentials();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`);
  }

  const { access_token, expires_in } = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!access_token) {
    throw new Error("Spotify token response contained no access token");
  }

  cachedToken = {
    value: access_token,
    expiresAt: Date.now() + ((expires_in ?? 3600) - 60) * 1000,
  };

  return access_token;
}

function toNowPlaying(
  track: SpotifyTrack,
  { isPlaying, progressMs }: { isPlaying: boolean; progressMs: number },
): NowPlaying {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    albumArtUrl: track.album.images[0]?.url ?? "",
    trackUrl: track.external_urls.spotify,
    progressMs,
    durationMs: track.duration_ms,
  };
}

/**
 * What I'm listening to, falling back to the last track I played.
 *
 * Returns `null` rather than throwing or leaking an error payload — this value
 * is serialised straight to the browser, so it must never carry token or
 * diagnostic data.
 */
export async function getNowPlaying(): Promise<NowPlaying | null> {
  try {
    const accessToken = await getAccessToken();
    const auth = { Authorization: `Bearer ${accessToken}` };

    const current = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: auth,
      cache: "no-store",
    });

    // 204 means nothing is playing; anything >= 400 means we cannot tell.
    if (current.ok && current.status !== 204) {
      const data = (await current.json()) as CurrentlyPlayingResponse;
      if (data?.item) {
        return toNowPlaying(data.item, {
          isPlaying: data.is_playing,
          progressMs: data.progress_ms,
        });
      }
    }

    const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: auth,
      cache: "no-store",
    });

    if (!recent.ok) return null;

    const data = (await recent.json()) as RecentlyPlayedResponse;
    const track = data.items?.[0]?.track;
    if (!track) return null;

    return toNowPlaying(track, { isPlaying: false, progressMs: 0 });
  } catch (error) {
    console.error("[spotify] failed to resolve now playing:", error);
    return null;
  }
}

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

interface Artist {
  name: string;
}

interface AlbumImage {
  url: string;
}

interface Album {
  name: string;
  images: AlbumImage[];
}

interface Track {
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: { spotify: string };
}

interface CurrentlyPlayingTrack extends Track {
  duration_ms: number;
}

interface CurrentlyPlayingResponse {
  is_playing: boolean;
  item: CurrentlyPlayingTrack;
  progress_ms: number;
}

interface RecentlyPlayedItem {
  track: Track;
}

interface RecentlyPlayedResponse {
  items: RecentlyPlayedItem[];
}



export const getAccessToken = async () => {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + basic
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  });

  return res.json();
};

export const getNowPlaying = async () => {
  const access = await getAccessToken();

  const access_token = access.access_token;

  try {
    const currentlyPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (currentlyPlayingRes.status === 204 || currentlyPlayingRes.status > 400) {
      // fallback to recently played
      const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const recentData: RecentlyPlayedResponse = await recentRes.json();
      const song = recentData.items[0].track;

      return {
        isPlaying: false,
        title: song.name,
        artist: song.artists.map(artist => artist.name).join(', '),
        album: song.album.name,
        albumImageUrl: song.album.images[0].url,
        songUrl: song.external_urls.spotify,
        progress: 0,
        duration: 0
      };
    }

    const song: CurrentlyPlayingResponse = await currentlyPlayingRes.json();

    return {
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map(artist => artist.name).join(', '),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0].url,
      songUrl: song.item.external_urls.spotify,
      progress: song.progress_ms,
      duration: song.item.duration_ms
    };
  } catch (err: unknown) {
    console.error('Error fetching currently playing:', err);
    return access;
  }
};
/**
 * The only Spotify shape that crosses the server/client boundary.
 *
 * Kept apart from `spotify.ts` so client components can import the type
 * without pulling a `server-only` module into their import graph.
 */
export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  trackUrl: string;
  progressMs: number;
  durationMs: number;
};

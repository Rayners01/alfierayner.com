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

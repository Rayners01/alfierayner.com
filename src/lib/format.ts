/** Formats a millisecond duration as `m:ss`. */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

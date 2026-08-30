/** Downward arrow onto a baseline. Inherits the surrounding text colour. */
export function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v11" />
      <path d="m7 9.5 5 5 5-5" />
      <path d="M4.5 20h15" />
    </svg>
  );
}

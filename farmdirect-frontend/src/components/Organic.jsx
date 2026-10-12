export function Blob({ className = "", tone = "moss" }) {
  return <span className={`blob blob-${tone} ${className}`} aria-hidden="true" />;
}

export function Wave({ fill = "var(--paper-deep)", flip = false, className = "" }) {
  return (
    <svg
      className={`wave ${flip ? "wave-flip" : ""} ${className}`}
      viewBox="0 0 1440 74"
      preserveAspectRatio="none"
      style={{ fill }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 44c150-34 289 22 442 22 165 0 213-44 372-40 152 4 232 44 372 34 110-8 168-30 254-30v44H0z" />
    </svg>
  );
}

export function SprigDivider({ className = "" }) {
  return (
    <svg
      className={`sprig ${className}`}
      viewBox="0 0 220 34"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 22c46-14 92-16 138-8 34 6 60 8 74 4"
        fill="none"
        stroke="#8ea478"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse cx="52" cy="16" rx="11" ry="5" fill="#8ea478" transform="rotate(-24 52 16)" />
      <ellipse cx="86" cy="12" rx="10" ry="4.6" fill="#a8b892" transform="rotate(-12 86 12)" />
      <ellipse cx="122" cy="12" rx="10" ry="4.6" fill="#8ea478" transform="rotate(10 122 12)" />
      <ellipse cx="158" cy="15" rx="9" ry="4.2" fill="#a8b892" transform="rotate(20 158 15)" />
      <circle cx="206" cy="19" r="3" fill="#c99433" />
      <circle cx="6" cy="21" r="3" fill="#c99433" />
    </svg>
  );
}
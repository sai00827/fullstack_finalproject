const palette = {
  leaf: "#4c9a2a",
  leafLight: "#5cb53a",
  leafDark: "#3a7a1e",
  tan: "#d9a05b",
  tanDark: "#b8763a",
  orange: "#f0913a",
  orangeLight: "#f7ad5e",
  amber: "#e0b83a",
  red: "#d1483f",
  redDark: "#b03a33",
  violet: "#7d5ba6",
  violetDark: "#68488d",
  steel: "#4a90b8",
  cream: "#fdf6e3",
};

function Vegetables() {
  return (
    <>
      <path d="M36 58c-4-20 7-34 21-36 2 18-6 30-21 36z" fill={palette.leaf} />
      <path d="M60 54c0-22 13-35 28-35 0 20-11 33-28 35z" fill={palette.leafLight} />
      <path d="M82 58c7-17 20-25 32-21-7 15-18 22-32 21z" fill={palette.leafDark} />
      <path d="M30 58h60l-7 40a9 9 0 0 1-9 8H46a9 9 0 0 1-9-8z" fill={palette.tan} />
      <rect x="25" y="51" width="70" height="13" rx="6.5" fill={palette.tanDark} />
      <path
        d="M44 72v26M60 72v30M76 72v26"
        stroke={palette.tanDark}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function Fruits() {
  return (
    <>
      <circle cx="38" cy="70" r="25" fill={palette.orange} />
      <path
        d="M24 54a25 25 0 0 1 22-9 30 30 0 0 0-14 24 30 30 0 0 0 8 16 25 25 0 0 1-16-31z"
        fill={palette.orangeLight}
      />
      <circle cx="76" cy="68" r="24" fill={palette.red} />
      <circle cx="96" cy="68" r="24" fill={palette.red} />
      <rect x="72" y="52" width="28" height="18" fill={palette.red} />
      <path d="M86 50c0-11 2-17 9-22" stroke="#7a5230" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M95 30c9-4 17-1 19 5-9 4-16 1-19-5z" fill={palette.leafLight} />
      <path d="M62 84a24 24 0 0 0 8 8 24 24 0 0 1-10-22 24 24 0 0 0-6-6 24 24 0 0 0 8 20z" fill={palette.redDark} />
    </>
  );
}

function Grains() {
  const pairs = [0, 1, 2, 3].map((i) => {
    const leftX = 53 - i;
    const rightX = 67 + i;
    const y = 48 + i * 13;
    return { leftX, rightX, y };
  });
  return (
    <>
      <path d="M60 108V40" stroke="#c9a227" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M42 108V62M78 108V62" stroke="#c9a227" strokeWidth="3" strokeLinecap="round" fill="none" />
      {pairs.map(({ leftX, rightX, y }) => (
        <g key={y}>
          <ellipse
            cx={leftX}
            cy={y}
            rx="5.5"
            ry="10"
            fill={palette.amber}
            transform={`rotate(-24 ${leftX} ${y})`}
          />
          <ellipse
            cx={rightX}
            cy={y}
            rx="5.5"
            ry="10"
            fill={palette.amber}
            transform={`rotate(24 ${rightX} ${y})`}
          />
        </g>
      ))}
      <ellipse cx="60" cy="33" rx="5.5" ry="11" fill={palette.amber} />
      <ellipse cx="42" cy="56" rx="4.5" ry="8.5" fill="#d3ab33" />
      <ellipse cx="78" cy="56" rx="4.5" ry="8.5" fill="#d3ab33" />
    </>
  );
}

function Pulses() {
  return (
    <>
      <circle cx="42" cy="53" r="8" fill={palette.orange} />
      <circle cx="59" cy="47" r="8" fill={palette.red} />
      <circle cx="76" cy="53" r="8" fill={palette.amber} />
      <circle cx="50" cy="41" r="7" fill="#7fae3f" />
      <circle cx="67" cy="41" r="7" fill={palette.orange} />
      <circle cx="60" cy="35" r="6" fill="#7fae3f" />
      <path d="M22 62h76c0 24-17 40-38 40s-38-16-38-40z" fill={palette.violet} />
      <rect x="16" y="55" width="88" height="11" rx="5.5" fill={palette.violetDark} />
      <path d="M34 74c4 12 13 20 26 22-14-6-22-16-26-22z" fill={palette.violetDark} />
    </>
  );
}

function Oils() {
  return (
    <>
      <rect x="50" y="6" width="20" height="11" rx="4" fill={palette.leafDark} />
      <rect x="53" y="17" width="14" height="11" fill={palette.leafDark} />
      <path
        d="M54 28h12v10c0 8 10 12 10 24v34a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8V62c0-12 10-16 10-24z"
        fill={palette.leafLight}
      />
      <rect x="50" y="68" width="20" height="19" rx="3" fill={palette.cream} />
      <path d="M92 38c-9 7-13 18-13 31" stroke={palette.leafDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="88" cy="46" rx="8" ry="4" fill={palette.leafLight} transform="rotate(-32 88 46)" />
      <ellipse cx="83" cy="58" rx="8" ry="4" fill={palette.leaf} transform="rotate(18 83 58)" />
      <circle cx="79" cy="69" r="6.5" fill={palette.leafDark} />
    </>
  );
}

function Dairy() {
  return (
    <>
      <rect x="50" y="10" width="20" height="13" rx="4" fill={palette.steel} />
      <rect x="53" y="23" width="14" height="10" fill="#3d7a9c" />
      <path
        d="M54 33h12v10c0 8 10 12 10 24v34a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8V67c0-12 10-16 10-24z"
        fill="#f6fafc"
        stroke="#c3d3dc"
        strokeWidth="2.5"
      />
      <rect x="48" y="58" width="24" height="15" rx="3" fill={palette.steel} />
      <path d="M52 63h16M52 68h10" stroke="#eaf4f9" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Groceries() {
  return (
    <>
      <rect x="39" y="20" width="13" height="26" rx="3.5" fill={palette.red} />
      <rect x="39" y="20" width="13" height="7" rx="3" fill="#e8e2d8" />
      <rect x="57" y="13" width="11" height="33" rx="3.5" fill={palette.leafLight} />
      <rect x="57" y="13" width="11" height="6" rx="3" fill={palette.leafDark} />
      <circle cx="78" cy="35" r="10" fill={palette.orange} />
      <path d="M31 46h58l6 56a7 7 0 0 1-7 8H32a7 7 0 0 1-7-8z" fill={palette.tan} />
      <rect x="29" y="42" width="62" height="11" rx="4" fill={palette.tanDark} />
      <path d="M40 62h40l4 40H36z" fill={palette.tanDark} opacity="0.18" />
      <path d="M48 44c0-11 24-11 24 0" stroke="#8a6a45" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  );
}

const art = {
  vegetables: Vegetables,
  fruits: Fruits,
  grains: Grains,
  pulses: Pulses,
  oils: Oils,
  dairy: Dairy,
  groceries: Groceries,
};

export function ProduceArt({ name, className, title }) {
  const Art = art[name] || Groceries;
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      <Art />
    </svg>
  );
}

export function SproutArt({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="60" cy="98" rx="38" ry="9" fill="#c9b189" />
      <path d="M60 96V44" stroke={palette.leafDark} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M60 66c-18 0-28-10-28-24 16-2 27 8 28 24z" fill={palette.leaf} />
      <path d="M60 58c0-16 11-26 27-25-1 16-12 25-27 25z" fill={palette.leafLight} />
      <path d="M60 40c-9 0-15-6-15-14 8-1 14 5 15 14z" fill={palette.leafLight} />
      <path d="M42 96h36l-3 8a5 5 0 0 1-5 4H50a5 5 0 0 1-5-4z" fill="#b8763a" />
    </svg>
  );
}

export function LeafSprig({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 108C44 96 66 70 92 22" stroke={palette.leafDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="92" rx="15" ry="7" fill={palette.leaf} transform="rotate(-34 34 92)" />
      <ellipse cx="56" cy="76" rx="14" ry="6.5" fill={palette.leafLight} transform="rotate(-40 56 76)" />
      <ellipse cx="76" cy="52" rx="13" ry="6" fill={palette.leaf} transform="rotate(-46 76 52)" />
      <ellipse cx="92" cy="26" rx="11" ry="5" fill={palette.leafLight} transform="rotate(-56 92 26)" />
    </svg>
  );
}

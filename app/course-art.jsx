const flagProps = {
  viewBox: "0 0 90 60",
  preserveAspectRatio: "xMidYMid slice",
};

const art = {
  "turk-tili": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#e30a17" />
      <circle cx="30" cy="30" r="15" fill="#fff" />
      <circle cx="33.75" cy="30" r="12" fill="#e30a17" />
      <polygon fill="#fff" points="38.00,30.00 43.18,28.31 43.18,22.87 46.39,27.27 51.57,25.59 48.37,30.00 51.57,34.41 46.39,32.73 43.18,37.13 43.18,31.69" />
    </svg>
  ),
  "nemis-tili": (
    <svg {...flagProps}>
      <rect width="90" height="20" fill="#000" />
      <rect y="20" width="90" height="20" fill="#dd0000" />
      <rect y="40" width="90" height="20" fill="#ffce00" />
    </svg>
  ),
  "koreys-tili": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g transform="translate(45 30) rotate(33.69)">
        <path d="M-15 0A15 15 0 0 1 15 0Z" fill="#cd2e3a" />
        <path d="M-15 0A15 15 0 0 0 15 0Z" fill="#0047a0" />
        <circle cx="-7.5" r="7.5" fill="#cd2e3a" />
        <circle cx="7.5" r="7.5" fill="#0047a0" />
      </g>
      <g transform="translate(45 30) rotate(33.69) translate(-33 -7.5)">
        <rect x="0.0" y="0" width="2.5" height="15" />
        <rect x="3.75" y="0" width="2.5" height="15" />
        <rect x="7.5" y="0" width="2.5" height="15" />
      </g>
      <g transform="translate(45 30) rotate(33.69) translate(23 -7.5)">
        <rect x="0.0" y="0" width="2.5" height="6.9" />
        <rect x="0.0" y="8.1" width="2.5" height="6.9" />
        <rect x="3.75" y="0" width="2.5" height="6.9" />
        <rect x="3.75" y="8.1" width="2.5" height="6.9" />
        <rect x="7.5" y="0" width="2.5" height="6.9" />
        <rect x="7.5" y="8.1" width="2.5" height="6.9" />
      </g>
      <g transform="translate(45 30) rotate(-33.69) translate(-33 -7.5)">
        <rect x="0.0" y="0" width="2.5" height="15" />
        <rect x="3.75" y="0" width="2.5" height="6.9" />
        <rect x="3.75" y="8.1" width="2.5" height="6.9" />
        <rect x="7.5" y="0" width="2.5" height="15" />
      </g>
      <g transform="translate(45 30) rotate(-33.69) translate(23 -7.5)">
        <rect x="0.0" y="0" width="2.5" height="6.9" />
        <rect x="0.0" y="8.1" width="2.5" height="6.9" />
        <rect x="3.75" y="0" width="2.5" height="15" />
        <rect x="7.5" y="0" width="2.5" height="6.9" />
        <rect x="7.5" y="8.1" width="2.5" height="6.9" />
      </g>
    </svg>
  ),
  matematika: (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <g fill="none" stroke="#2a1211" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 50h70M10 50V8" />
        <path d="M14 14c8 44 26 44 34 0" stroke="#a70e07" />
        <path d="M56 46h24V22z" />
        <path d="M74 46v-6h6" strokeWidth="1" />
      </g>
      <text x="52" y="16" fontSize="7.5" fontWeight="800" fill="#a70e07">
        a² + b² = c²
      </text>
    </svg>
  ),
  "rus-tili": (
    <svg {...flagProps}>
      <rect width="90" height="20" fill="#fff" />
      <rect y="20" width="90" height="20" fill="#0039a6" />
      <rect y="40" width="90" height="20" fill="#d52b1e" />
    </svg>
  ),
  "ingliz-tili": (
    <svg {...flagProps}>
      <svg viewBox="0 0 60 30" width="90" height="60" preserveAspectRatio="xMidYMid slice">
        <clipPath id="uk-t">
          <path d="M30 15h30v15zv15h-30zh-30v-15zv-15h30z" />
        </clipPath>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30M60 0L0 30" clipPath="url(#uk-t)" stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
      </svg>
    </svg>
  ),
  "xitoy-tili": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#ee1c25" />
      <g fill="#ffff00">
      <polygon points="15.00,6.00 17.02,12.22 23.56,12.22 18.27,16.06 20.29,22.28 15.00,18.44 9.71,22.28 11.73,16.06 6.44,12.22 12.98,12.22" />
      <polygon points="27.43,7.54 28.86,5.90 27.74,4.03 29.74,4.88 31.17,3.24 30.98,5.41 32.99,6.26 30.86,6.75 30.67,8.92 29.55,7.05" />
      <polygon points="33.03,12.42 34.99,11.46 34.68,9.31 36.20,10.87 38.15,9.91 37.13,11.84 38.65,13.40 36.50,13.03 35.49,14.96 35.18,12.80" />
      <polygon points="33.12,20.18 35.29,20.10 35.89,18.00 36.64,20.05 38.82,19.97 37.10,21.31 37.85,23.36 36.04,22.15 34.32,23.49 34.92,21.39" />
      <polygon points="27.66,25.13 29.70,25.89 31.06,24.19 30.96,26.37 33.00,27.14 30.89,27.72 30.79,29.89 29.60,28.07 27.49,28.65 28.86,26.95" />
      </g>
    </svg>
  ),
  "yapon-tili": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <circle cx="45" cy="30" r="18" fill="#bc002d" />
    </svg>
  ),
  fizika: (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="45" cy="30" rx="30" ry="11" />
        <ellipse cx="45" cy="30" rx="30" ry="11" transform="rotate(60 45 30)" />
        <ellipse cx="45" cy="30" rx="30" ry="11" transform="rotate(-60 45 30)" />
      </g>
      <circle cx="45" cy="30" r="5" fill="#a70e07" />
    </svg>
  ),
  kimyo: (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <path d="M33 38 27 50a3 3 0 0 0 3 4h30a3 3 0 0 0 3-4l-6-12z" fill="#a70e07" />
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M39 8h12M41 8v16L27 50a3 3 0 0 0 3 4h30a3 3 0 0 0 3-4L49 24V8" />
      </g>
      <g fill="#a70e07">
        <circle cx="62" cy="20" r="3" />
        <circle cx="70" cy="11" r="2" />
        <circle cx="58" cy="9" r="1.5" />
      </g>
    </svg>
  ),
  biologiya: (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 8c16 10 16 34 0 44" />
        <path d="M34 8C18 18 18 42 34 52" />
        <path d="M16 16h16M19 24h10M19 36h10M16 44h16" strokeWidth="1.3" />
        <path d="M48 46c0-20 12-32 32-34 0 20-10 34-32 34z" stroke="#a70e07" />
        <path d="M48 46 70 22" stroke="#a70e07" strokeWidth="1.3" />
      </g>
    </svg>
  ),
  "ona-tili": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <text x="8" y="38" fontSize="34" fontWeight="800" fill="#1b100e">
        A
      </text>
      <text x="34" y="38" fontSize="34" fontWeight="800" fill="#a70e07">
        a
      </text>
      <text x="60" y="24" fontSize="11" fontWeight="800" fill="#1b100e">
        Oʻ Gʻ
      </text>
      <text x="60" y="40" fontSize="11" fontWeight="800" fill="#1b100e">
        Sh Ch
      </text>
      <path d="M8 48h74" stroke="#a70e07" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  tarix: (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <path d="M30 28c0-12 30-12 30 0z" fill="#a70e07" />
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 52h74M14 52V16l3-6 3 6v36M70 52V16l3-6 3 6v36" />
        <path d="M28 52V28h34v24M30 28c0-12 30-12 30 0M45 15v-6" />
        <path d="M38 52V42c0-8 14-8 14 0v10" />
      </g>
    </svg>
  ),
  "mental-arifmetika": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="8" width="70" height="44" />
        <path d="M10 22h70M24 8v44M38 8v44M52 8v44M66 8v44" strokeWidth="1.2" />
      </g>
      <g fill="#a70e07" stroke="#1b100e" strokeWidth="1">
        <ellipse cx="24" cy="15" rx="5" ry="3.2" />
        <ellipse cx="52" cy="15" rx="5" ry="3.2" />
        <ellipse cx="24" cy="30" rx="5" ry="3.2" />
        <ellipse cx="38" cy="27" rx="5" ry="3.2" />
        <ellipse cx="38" cy="34" rx="5" ry="3.2" />
        <ellipse cx="52" cy="44" rx="5" ry="3.2" />
        <ellipse cx="66" cy="27" rx="5" ry="3.2" />
        <ellipse cx="66" cy="34" rx="5" ry="3.2" />
        <ellipse cx="66" cy="41" rx="5" ry="3.2" />
      </g>
    </svg>
  ),
  "kompyuter-savodxonligi": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="16" y="8" width="58" height="34" fill="#fff" />
        <path d="M38 42v7M52 42v7M30 50h30" />
        <path d="M24 16h22M24 22h34M24 28h16" stroke="#a70e07" strokeWidth="1.5" />
      </g>
      <path d="M56 24l10 9-5 .5 3 5-2.5 1.3-3-5-3.5 3.5z" fill="#1b100e" stroke="#fff" strokeWidth="0.8" />
    </svg>
  ),
  "it-kurslari": (
    <svg {...flagProps}>
      <rect width="90" height="60" fill="#fff" />
      <g stroke="#f0dcd6" strokeWidth="0.5">
        <path d="M0 10h90M0 20h90M0 30h90M0 40h90M0 50h90" />
        <path d="M10 0v60M20 0v60M30 0v60M40 0v60M50 0v60M60 0v60M70 0v60M80 0v60" />
      </g>
      <g fill="none" stroke="#1b100e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="7" width="62" height="38" fill="#fff" />
        <path d="M14 16h62M6 52h78l-8-7H14z" fill="#fff" />
      </g>
      <g fill="#1b100e">
        <circle cx="19.5" cy="11.5" r="1.6" fill="#a70e07" />
        <circle cx="25" cy="11.5" r="1.6" />
        <circle cx="30.5" cy="11.5" r="1.6" />
      </g>
      <g fill="none" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20 23h12" stroke="#a70e07" />
        <path d="M26 29h26M26 35h16" stroke="#1b100e" />
        <path d="M48 35h8" stroke="#a70e07" />
        <path d="M20 41h8" stroke="#a70e07" />
      </g>
      <rect x="60" y="20" width="10" height="12" fill="#a70e07" />
    </svg>
  ),
};

export default function Stamp({ course, className = "" }) {
  if (!art[course]) return null;

  return (
    <span className={`stamp ${className}`} aria-hidden="true">
      <span className="stamp-inner">{art[course]}</span>
    </span>
  );
}

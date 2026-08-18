/**
 * SHAHD KHAIRY identity — "Sliced SK".
 *
 * Heavy SK letterforms cut into three horizontal bands: ivory top and
 * bottom, with the middle band shifted sideways and struck in electric
 * lime. Monochrome + one signal color.
 */

export const INK = '#F4F1EA';   // warm ivory
export const SIGNAL = '#C6FF4A'; // electric lime

export function SKMonogram({
  size = 48,
  drawable = false,
}: {
  size?: number | string;
  strokeWidth?: number;
  drawable?: boolean;
}) {
  const id = drawable ? 'ld' : 'hd';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 132 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <clipPath id={`sk-top-${id}`}>
          <rect x="-10" y="0" width="152" height="36" />
        </clipPath>
        <clipPath id={`sk-mid-${id}`}>
          <rect x="-10" y="36" width="152" height="14" />
        </clipPath>
        <clipPath id={`sk-bot-${id}`}>
          <rect x="-10" y="50" width="152" height="38" />
        </clipPath>
      </defs>

      {/* top band */}
      <g className={drawable ? 'logo-band logo-band--top' : undefined} clipPath={`url(#sk-top-${id})`}>
        <text
          x="66" y="70" textAnchor="middle"
          fontFamily="'Inter Tight', sans-serif" fontWeight="800" fontSize="82"
          letterSpacing="-4" fill={INK}
        >SK</text>
      </g>

      {/* middle band — shifted, signal lime */}
      <g className={drawable ? 'logo-band logo-band--mid' : undefined} clipPath={`url(#sk-mid-${id})`}>
        <text
          x="74" y="70" textAnchor="middle"
          fontFamily="'Inter Tight', sans-serif" fontWeight="800" fontSize="82"
          letterSpacing="-4" fill={SIGNAL}
        >SK</text>
      </g>

      {/* bottom band */}
      <g className={drawable ? 'logo-band logo-band--bot' : undefined} clipPath={`url(#sk-bot-${id})`}>
        <text
          x="66" y="70" textAnchor="middle"
          fontFamily="'Inter Tight', sans-serif" fontWeight="800" fontSize="82"
          letterSpacing="-4" fill={INK}
        >SK</text>
      </g>
    </svg>
  );
}

/** Header / menu lockup */
export default function LogoMark() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1.3rem' }}>
      <span style={{ width: '4.2rem', height: 'auto', display: 'inline-flex' }}>
        <SKMonogram size="100%" />
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '0.55em',
          fontSize: '1.5rem',
          lineHeight: 1,
          color: INK,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 800, letterSpacing: '0.12em' }}>SHAHD</span>
        <span style={{ fontWeight: 300, letterSpacing: '0.22em', opacity: 0.85 }}>KHAIRY</span>
        <span style={{ fontSize: '0.6em', fontWeight: 600, color: SIGNAL, transform: 'translateY(-0.6em)' }}>®</span>
      </span>
    </span>
  );
}

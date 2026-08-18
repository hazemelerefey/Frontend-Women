/**
 * SHAHD KHAIRY brand identity.
 *
 * The mark is an "SK" ligature drawn as continuous gradient strokes
 * (sky -> lavender, round caps) with the brand's four-pointed star set
 * as a spark at the K's joint — the same star that drives the site's
 * section transitions.
 */

export function SKMonogram({
  size = 48,
  strokeWidth = 5,
  drawable = false,
}: {
  size?: number | string;
  strokeWidth?: number;
  drawable?: boolean;
}) {
  const cls = drawable ? 'logo-stroke' : undefined;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="sk-grad" x1="0" y1="0" x2="76" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#94BDF7" />
          <stop offset="1" stopColor="#D2BDF8" />
        </linearGradient>
      </defs>

      {/* S — two-bowl calligraphic stroke */}
      <path
        className={cls}
        d="M29 10 C29 3.5, 8 3.5, 8 11.5 C8 20, 29 17.5, 29 26.5 C29 35.5, 7 35.5, 7 28.5"
        stroke="url(#sk-grad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* K — spine */}
      <path
        className={cls}
        d="M42 5.5 L42 42.5"
        stroke="url(#sk-grad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* K — upper arm */}
      <path
        className={cls}
        d="M66 5.5 L42.5 25.5"
        stroke="url(#sk-grad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* K — lower leg */}
      <path
        className={cls}
        d="M50 19 L68 42.5"
        stroke="url(#sk-grad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />

      {/* Star spark at the joint */}
      <g className={drawable ? 'logo-spark' : undefined} transform="translate(50.5, 12)">
        <path
          d="M0 -7 L1.4 -1.4 L7 0 L1.4 1.4 L0 7 L-1.4 1.4 L-7 0 L-1.4 -1.4 Z"
          fill="#D2BDF8"
        />
      </g>
    </svg>
  );
}

/** Header / menu lockup: monogram + two-weight wordmark */
export default function LogoMark() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1.2rem' }}>
      <span style={{ width: '3.6rem', height: 'auto', display: 'inline-flex' }}>
        <SKMonogram size="100%" strokeWidth={5.5} />
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '0.55em',
          fontSize: '1.5rem',
          lineHeight: 1,
          color: '#ffffff',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 800, letterSpacing: '0.12em' }}>SHAHD</span>
        <span style={{ fontWeight: 300, letterSpacing: '0.22em', opacity: 0.85 }}>KHAIRY</span>
      </span>
    </span>
  );
}

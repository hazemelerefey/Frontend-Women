/**
 * SHAHD KHAIRY identity — engineered logotype.
 *
 * SHAHD set in the site's own display face (Inter Tight 800), shipped as
 * raw vector paths, tracked tight so the letters interlock. One signature
 * mutation: a 24-degree slash cuts the A and is struck in electric lime —
 * the ownable mark of the brand.
 */

import { LOGO_LETTERS, LOGO_WIDTH, LOGO_HEIGHT } from './logo-paths';

export const INK = '#F4F1EA';    // warm ivory
export const SIGNAL = '#C6FF4A'; // electric lime

/* Slash geometry — the 24° cut across the A (viewBox units) */
const CUT_CX = 161;
const CUT_CY = 38;
const CUT_ANGLE = -24;

/**
 * The SHAHD wordmark. `id` must be unique per instance (SVG defs).
 * When `drawable`, letters/slash get classes for GSAP (used by the loader).
 */
export function Wordmark({
  id,
  color = INK,
  drawable = false,
}: {
  id: string;
  color?: string;
  drawable?: boolean;
}) {
  return (
    <svg
      viewBox={`0 -6 ${LOGO_WIDTH} ${LOGO_HEIGHT + 12}`}
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="SHAHD"
      role="img"
    >
      <defs>
        {/* clip: the A glyph — lime slash only lives inside the letter */}
        <clipPath id={`${id}-aclip`}>
          <path d={LOGO_LETTERS[2].d} transform={`translate(0, ${LOGO_HEIGHT})`} />
        </clipPath>
        {/* mask: opens the cut channel through the A */}
        <mask id={`${id}-cut`}>
          <rect x="-20" y="-20" width={LOGO_WIDTH + 40} height={LOGO_HEIGHT + 40} fill="white" />
          <g transform={`rotate(${CUT_ANGLE} ${CUT_CX} ${CUT_CY})`}>
            <rect
              className={drawable ? 'wm-cutrect' : undefined}
              x="127" y="32.5" width="66" height="11" fill="black"
            />
          </g>
        </mask>
      </defs>

      {/* letterforms */}
      <g mask={`url(#${id}-cut)`}>
        {LOGO_LETTERS.map((l, i) => (
          <path
            key={i}
            className={drawable ? `wm-letter wm-letter--${i}` : undefined}
            d={l.d}
            transform={`translate(0, ${LOGO_HEIGHT})`}
            fill={color}
          />
        ))}
      </g>

      {/* the lime slash — clipped to the A, sits inside the cut channel */}
      <g clipPath={`url(#${id}-aclip)`}>
        <g transform={`rotate(${CUT_ANGLE} ${CUT_CX} ${CUT_CY})`}>
          <rect
            className={drawable ? 'wm-slash' : undefined}
            x="118" y="34.5" width="86" height="7" fill={SIGNAL}
          />
        </g>
      </g>
    </svg>
  );
}

/** Header / menu lockup — wordmark over a letterspaced KHAIRY sub-line */
export default function LogoMark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '0.45rem',
        width: '10.5rem',
      }}
    >
      <Wordmark id="hdr" />
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.95rem',
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: '0.94em',
          textIndent: '0.2em',
          color: INK,
          opacity: 0.75,
          textAlign: 'center',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        KHAIRY
      </span>
    </span>
  );
}

/**
 * SHAHD KHAIRY identity — engineered logotype.
 *
 * Both words set in the site's own display face (Inter Tight 800) and shipped
 * as raw vector paths, tracked tight so the letters interlock. The signature
 * device is the KEYSTONE: the enclosed counter of the A filled solid in the
 * hero violet, so the accent lives inside the letterform instead of cutting
 * across it.
 *
 * Palette is drawn straight from the hero gradient.
 */

import {
  SHAHD_LETTERS,
  SHAHD_WIDTH,
  KHAIRY_LETTERS,
  KHAIRY_WIDTH,
  LOGO_HEIGHT,
} from './logo-paths';

/** The A — the axis of the word — carries the accent */
const KEYSTONE_INDEX = 2;

export const INK = '#F4F1EA';    // warm ivory
export const SIGNAL = '#BE8FFF'; // hero violet — hsl(265 100% 78%)
export const SIGNAL_2 = '#3D9EFF'; // hero blue — hsl(210 100% 62%)

/** SHAHD — with the violet keystone set into the A */
export function Wordmark({
  color = INK,
  drawable = false,
}: {
  color?: string;
  drawable?: boolean;
}) {
  return (
    <svg
      viewBox={`0 -4 ${SHAHD_WIDTH} ${LOGO_HEIGHT + 8}`}
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="SHAHD"
      role="img"
    >

      {SHAHD_LETTERS.map((l, i) => {
        const isKeystone = i === KEYSTONE_INDEX;
        return (
          <path
            key={i}
            className={
              drawable
                ? `wm-letter wm-letter--${i}${isKeystone ? ' wm-key' : ''}`
                : undefined
            }
            d={l.d}
            transform={`translate(0, ${LOGO_HEIGHT})`}
            fill={isKeystone ? SIGNAL : color}
          />
        );
      })}
    </svg>
  );
}

/** KHAIRY — same letterforms, no keystone */
export function WordmarkSecond({ color = INK }: { color?: string }) {
  return (
    <svg
      viewBox={`0 -4 ${KHAIRY_WIDTH} ${LOGO_HEIGHT + 8}`}
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="KHAIRY"
      role="img"
    >
      {KHAIRY_LETTERS.map((l, i) => (
        <path key={i} d={l.d} transform={`translate(0, ${LOGO_HEIGHT})`} fill={color} />
      ))}
    </svg>
  );
}

/**
 * Header / menu lockup — two justified vector lines, SHAHD over KHAIRY.
 * Both lines are width-matched, so the block reads as one solid mark.
 */
export default function LogoMark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '0.18rem',
        width: '10rem',
      }}
    >
      <Wordmark />
      <WordmarkSecond />
    </span>
  );
}

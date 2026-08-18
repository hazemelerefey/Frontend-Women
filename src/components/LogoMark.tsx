/**
 * SHAHD KHAIRY identity — "The Name Is the Logo".
 *
 * A premium serif wordmark: SHAHD KHAIRY set in Cormorant Garamond,
 * uppercase, generously letterspaced, closed by an electric-lime
 * diamond accent. Monochrome + one signal color.
 */

export const INK = '#F4F1EA';    // warm ivory
export const SIGNAL = '#C6FF4A'; // electric lime
export const SERIF = "'Cormorant Garamond', 'Times New Roman', serif";

/** Lime diamond accent that closes the wordmark */
export function LogoAccent({ size = '0.32em' }: { size?: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundColor: SIGNAL,
        transform: 'rotate(45deg)',
        flexShrink: 0,
      }}
    />
  );
}

/** Header / menu lockup — premium serif name wordmark */
export default function LogoMark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.5em',
        fontFamily: SERIF,
        fontSize: '2.2rem',
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: INK,
        whiteSpace: 'nowrap',
      }}
    >
      <span>Shahd</span>
      <span style={{ fontWeight: 500, opacity: 0.85 }}>Khairy</span>
      <LogoAccent />
    </span>
  );
}

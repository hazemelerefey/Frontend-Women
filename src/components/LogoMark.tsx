/** Original brand mark for Shahd — four-pointed star + wordmark */
export default function LogoMark({ inverted = false }: { inverted?: boolean }) {
  const color = inverted ? '#0C0C0C' : '#ffffff';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
      <svg width="30" height="30" viewBox="0 0 974 974" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '3rem', height: '3rem' }}>
        <path
          d="M487 0L516.266 420.607C517.651 440.51 533.49 456.349 553.393 457.734L974 487L553.393 516.266C533.49 517.651 517.651 533.49 516.266 553.393L487 974L457.734 553.393C456.349 533.49 440.51 517.651 420.607 516.266L0 487L420.607 457.734C440.51 456.349 456.349 440.51 457.734 420.607L487 0Z"
          fill="#D2BDF8"
        />
      </svg>
      <span
        style={{
          fontSize: '1.7rem',
          fontWeight: 800,
          letterSpacing: '0.06em',
          color,
          lineHeight: 1,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        SHAHD.K
      </span>
    </span>
  );
}

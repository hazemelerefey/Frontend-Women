'use client';

import { useState } from 'react';

const links = [
  { label: 'WhatsApp', href: 'https://wa.me/380000000000' },
  { label: 'LinkedIn Account', href: 'https://linkedin.com' },
  { label: 'alina@frontend-w.com', href: 'mailto:alina@frontend-w.com' },
];

export default function LinksBar() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section 
      style={{ 
        backgroundColor: 'var(--black)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div 
        className="center-wrap" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {links.map((link, idx) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: 'block',
              fontSize: 'clamp(4rem, 9.5vw, 13.5rem)',
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: hoveredIdx === idx ? 'var(--sky)' : 'var(--white)',
              textDecoration: 'none',
              transition: 'color 0.3s ease, transform 0.3s ease',
              transform: hoveredIdx === idx ? 'scale(1.02)' : 'scale(1)',
              fontFamily: 'inherit',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

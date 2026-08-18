'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** Four-pointed brand star (same geometry as public/images/svg/star.svg) */
function Star({ size, color, className, style }: { size: number | string; color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 974 974"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M487 0L516.266 420.607C517.651 440.51 533.49 456.349 553.393 457.734L974 487L553.393 516.266C533.49 517.651 517.651 533.49 516.266 553.393L487 974L457.734 553.393C456.349 533.49 440.51 517.651 420.607 516.266L0 487L420.607 457.734C440.51 456.349 456.349 440.51 457.734 420.607L487 0Z"
        fill={color}
      />
    </svg>
  );
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** One rolling digit column (slot-machine strip) */
function DigitColumn({ colRef, chars }: { colRef: (el: HTMLDivElement | null) => void; chars: string[] }) {
  return (
    <div style={{ overflow: 'hidden', height: '1em', display: 'inline-block' }}>
      <div ref={colRef} style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}>
        {chars.map((c, i) => (
          <span key={i} style={{ height: '1em', lineHeight: 1, display: 'block' }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const hundredsRef = useRef<HTMLDivElement | null>(null);
  const tensRef = useRef<HTMLDivElement | null>(null);
  const onesRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!rootRef.current) return;

    const progress = { v: 0 };

    const setCounter = () => {
      const v = Math.round(progress.v);
      const hundreds = Math.floor(v / 100);
      const tens = Math.floor((v % 100) / 10);
      const ones = v % 10;
      if (hundredsRef.current) hundredsRef.current.style.transform = `translateY(${-hundreds}em)`;
      if (tensRef.current) tensRef.current.style.transform = `translateY(${-tens}em)`;
      if (onesRef.current) onesRef.current.style.transform = `translateY(${-ones}em)`;
    };

    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });

    /* ============ ACT 1 — IGNITION ============ */
    tl.fromTo('.forge__star',
      { scale: 0, rotation: -90, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)' }, 0.15)
      .fromTo('.forge__glow',
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0.15);

    /* Star breathing + slow spin for the whole forge phase */
    tl.to('.forge__star', { rotation: 150, duration: 2.6, ease: 'none' }, 0.9)
      .to('.forge__star', { scale: 1.12, duration: 0.65, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0.9);

    /* ============ ACT 2 — FORGE ============ */
    // Star-shaped shockwave rings
    tl.fromTo('.forge__wave',
      { scale: 0.4, opacity: 0.7 },
      { scale: 7, opacity: 0, rotation: 45, duration: 1.7, ease: 'power1.out', stagger: 0.55 }, 0.9);

    // Orbiting particles: ring fades in and rotates
    tl.fromTo('.forge__orbit',
      { opacity: 0, rotation: 0 },
      { opacity: 1, rotation: 240, duration: 2.6, ease: 'power1.inOut' }, 0.9)
      .to('.forge__orbit', { opacity: 0, duration: 0.3 }, 3.1);

    // Labels letter-stagger in
    tl.fromTo('.forge__label .forge-letter',
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.025, ease: 'power2.out' }, 1.0);

    // Counter 0 -> 100 with rolling digit strips
    tl.fromTo('.forge__counter', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.9);
    tl.to(progress, { v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate: setCounter }, 1.05);

    // Progress hairline
    tl.fromTo('.forge__bar', { scaleX: 0 }, { scaleX: 1, duration: 2.25, ease: 'power2.inOut' }, 1.0);

    /* ============ ACT 3 — SUPERNOVA EXIT ============ */
    tl.to('.forge__label .forge-letter',
      { yPercent: -120, opacity: 0, duration: 0.35, stagger: 0.015, ease: 'power2.in' }, 3.2)
      .to('.forge__counter', { y: -40, opacity: 0, duration: 0.35, ease: 'power2.in' }, 3.2)
      .to('.forge__bar', { opacity: 0, duration: 0.25 }, 3.25)
      .to('.forge__glow', { opacity: 0, duration: 0.4 }, 3.3)
      // the star detonates
      .to('.forge__star', { scale: 34, rotation: 225, duration: 0.75, ease: 'power4.in' }, 3.3)
      .fromTo('.forge__flash', { opacity: 0 }, { opacity: 0.9, duration: 0.28, ease: 'power2.in' }, 3.62)
      .to('.forge__flash', { opacity: 0, duration: 0.35, ease: 'power2.out' }, 3.9)
      .to(rootRef.current, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 3.85);

  }, { scope: rootRef });

  if (!visible) return null;

  const label1 = 'SHAHD KHAIRY — FULL STACK';
  const label2 = 'PORTFOLIO ©2026';

  return (
    <div
      ref={rootRef}
      className="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0a0a0c',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient gradient glow behind the star */}
      <div
        className="forge__glow"
        style={{
          position: 'absolute',
          width: '110rem',
          height: '110rem',
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%,
            hsla(265, 100%, 78%, 0.28) 0%,
            hsla(240, 100%, 70%, 0.14) 30%,
            hsla(210, 100%, 62%, 0.08) 55%,
            transparent 75%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
          backgroundSize: '200px 200px',
          opacity: 0.16,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Star-shaped shockwave rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="forge__wave"
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            filter: 'blur(1px)',
          }}
        >
          <Star size="16rem" color="rgba(210, 189, 248, 0.35)" />
        </div>
      ))}

      {/* Orbiting particles */}
      <div
        className="forge__orbit"
        style={{
          position: 'absolute',
          width: '44rem',
          height: '44rem',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: i % 2 ? '0.5rem' : '0.8rem',
              height: i % 2 ? '0.5rem' : '0.8rem',
              borderRadius: '50%',
              backgroundColor: i % 3 ? 'var(--sky)' : 'var(--pink)',
              transform: `rotate(${deg}deg) translateX(${i % 2 ? 19 : 22}rem)`,
              boxShadow: '0 0 1.2rem currentColor',
            }}
          />
        ))}
      </div>

      {/* The star */}
      <div className="forge__star" style={{ position: 'relative', willChange: 'transform', filter: 'drop-shadow(0 0 3rem rgba(210, 189, 248, 0.55))' }}>
        <Star size="14rem" color="#D2BDF8" />
      </div>

      {/* Top-left identity label */}
      <div
        className="forge__label"
        style={{
          position: 'absolute',
          top: '4rem',
          left: '4rem',
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: 'var(--gray)',
          overflow: 'hidden',
        }}
      >
        {label1.split('').map((c, i) => (
          <span key={i} className="forge-letter" style={{ display: 'inline-block', whiteSpace: 'pre' }}>{c}</span>
        ))}
      </div>

      {/* Bottom-left label */}
      <div
        className="forge__label"
        style={{
          position: 'absolute',
          bottom: '4rem',
          left: '4rem',
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: 'var(--gray)',
          overflow: 'hidden',
        }}
      >
        {label2.split('').map((c, i) => (
          <span key={i} className="forge-letter" style={{ display: 'inline-block', whiteSpace: 'pre' }}>{c}</span>
        ))}
      </div>

      {/* Giant rolling counter — bottom right */}
      <div
        className="forge__counter"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '4rem',
          display: 'flex',
          alignItems: 'baseline',
          fontSize: 'clamp(8rem, 14vw, 17rem)',
          fontWeight: 500,
          letterSpacing: '-0.05em',
          lineHeight: 1,
          color: 'var(--gray)',
          opacity: 0,
        }}
      >
        <DigitColumn colRef={(el) => { hundredsRef.current = el; }} chars={[' ', '1']} />
        <DigitColumn colRef={(el) => { tensRef.current = el; }} chars={DIGITS} />
        <DigitColumn colRef={(el) => { onesRef.current = el; }} chars={DIGITS} />
        <span style={{ fontSize: '0.35em', fontWeight: 600, marginLeft: '0.8rem', color: 'var(--pink)' }}>%</span>
      </div>

      {/* Bottom progress hairline */}
      <div
        className="forge__bar"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '2px',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          background: 'linear-gradient(90deg, var(--sky), var(--pink))',
        }}
      />

      {/* Detonation flash */}
      <div
        className="forge__flash"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(210,189,248,0.6) 40%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

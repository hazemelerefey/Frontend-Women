'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Wordmark, INK, SIGNAL } from './LogoMark';

gsap.registerPlugin(useGSAP);

const MONO = "'IBM Plex Mono', monospace";
const COLUMNS = [0, 1, 2, 3, 4];
const GRID = Array.from({ length: 12 }, (_, i) => i);

/**
 * Marquee bands — mixed filled / outlined type, one lime accent band.
 * Alternating scroll direction builds the kinetic poster.
 */
const BANDS = [
  { text: 'REACT · NODE · MONGO', style: 'outline' as const, dir: -1 },
  { text: 'FULLSTACK', style: 'fill' as const, dir: 1 },
  { text: 'DESIGN · CODE · SHIP', style: 'signal' as const, dir: -1 },
  { text: 'GSAP · THREE · R3F', style: 'outline' as const, dir: 1 },
  { text: 'CAIRO — 2026', style: 'faint' as const, dir: -1 },
];

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current) return;

    const progress = { v: 0 };
    const setCount = () => {
      const n = Math.round(progress.v);
      if (ghostRef.current) ghostRef.current.textContent = String(n);
      if (pctRef.current) pctRef.current.textContent = `${String(n).padStart(3, '0')}%`;
    };
    setCount();

    const tl = gsap.timeline({ onComplete: () => setVisible(false) });

    /* ═══════ PHASE 1 — REGISTRATION (the press aligns its plates) ═══════ */
    tl.fromTo('.pl-grid-line',
      { scaleY: 0, transformOrigin: '50% 0%' },
      { scaleY: 1, duration: 0.5, stagger: 0.025, ease: 'expo.inOut' }, 0)
      .fromTo('.pl-cross',
        { scale: 0, rotate: -90, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }, 0.15)
      .fromTo('.pl-label',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'expo.out' }, 0.3);

    /* ═══════ PHASE 2 — KINETIC CASCADE (bands fly in, alternating) ═══════ */
    BANDS.forEach((b, i) => {
      tl.fromTo(`.pl-band--${i} .pl-band__inner`,
        { xPercent: b.dir * 55, filter: 'blur(14px)' },
        { xPercent: b.dir * -6, filter: 'blur(0px)', duration: 1.15, ease: 'expo.out' }, 0.72 + i * 0.11)
        .fromTo(`.pl-band--${i}`,
          { opacity: 0, scaleY: 0.3, transformOrigin: '50% 50%' },
          { opacity: 1, scaleY: 1, duration: 0.55, ease: 'expo.out' }, 0.72 + i * 0.11);
    });
    // slow drift while they hold — keeps the frame alive
    tl.to('.pl-band__inner', { xPercent: (i) => BANDS[i].dir * -11, duration: 0.9, ease: 'none' }, 1.9);

    /* ═══════ PHASE 3 — COLLAPSE (bands crush into a single lime line) ═══════ */
    tl.to('.pl-band', {
      yPercent: (i) => (2 - i) * 115,
      scaleY: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.inOut',
      stagger: { each: 0.03, from: 'edges' },
    }, 2.62)
      .to('.pl-grid-line', { opacity: 0, duration: 0.35 }, 2.62)
      // the impact line
      .fromTo('.pl-line',
        { scaleX: 0, opacity: 1 },
        { scaleX: 1, duration: 0.45, ease: 'expo.out' }, 2.72)
      // soft flash on impact — two frames
      .to('.pl-flash', { opacity: 0.22, duration: 0.05, ease: 'none' }, 3.04)
      .to('.pl-flash', { opacity: 0, duration: 0.18, ease: 'none' }, 3.09);

    /* ═══════ PHASE 4 — IGNITION (logotype unmasks out of the line) ═══════ */
    tl.fromTo('.pl-mark-wrap',
      { clipPath: 'inset(50% 0% 50% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' }, 3.1)
      .fromTo('.pl-mark-wrap',
        { scale: 1.12 },
        { scale: 1, duration: 0.9, ease: 'expo.out' }, 3.1)
      // the line retracts as the mark takes over
      .to('.pl-line', { scaleX: 0, opacity: 0, duration: 0.5, ease: 'expo.inOut' }, 3.3)
      // signature slash strikes through the A
      .fromTo('.wm-cutrect',
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 0.3, ease: 'expo.inOut' }, 3.75)
      .fromTo('.wm-slash',
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 0.3, ease: 'expo.inOut' }, 3.82)
      .set('.wm-slash', { opacity: 0 }, 4.16)
      .set('.wm-slash', { opacity: 1 }, 4.21)
      .set('.wm-slash', { opacity: 0 }, 4.26)
      .set('.wm-slash', { opacity: 1 }, 4.31)
      // sub-line + role
      .fromTo('.pl-sub span',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.035, ease: 'expo.out' }, 3.95)
      .fromTo('.pl-role span',
        { opacity: 0 },
        { opacity: 1, duration: 0.04, stagger: 0.028, ease: 'none' }, 4.3);

    /* ═══════ COUNTER — ghost outline + corner readout ═══════ */
    tl.fromTo('.pl-ghost', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.8)
      .to(progress, { v: 100, duration: 3.5, ease: 'power2.inOut', onUpdate: setCount }, 0.8)
      .to('.pl-ghost', { opacity: 0, duration: 0.5 }, 4.6);

    /* ═══════ PHASE 5 — PORTAL EXIT (mark pushes past the frame) ═══════ */
    tl.to('.pl-mark-wrap', { scale: 1.45, duration: 0.85, ease: 'expo.in' }, 5.6)
      .to('.pl-sub, .pl-role, .pl-label', { opacity: 0, y: -18, duration: 0.3, ease: 'expo.in' }, 5.6)
      .to('.pl-mark-wrap', { opacity: 0, duration: 0.35, ease: 'none' }, 6.07)
      .to('.pl-mark, .pl-frame', { opacity: 0, duration: 0.3 }, 6.07)
      .to('.pl-col', {
        yPercent: -100,
        duration: 0.7,
        ease: 'expo.inOut',
        stagger: { each: 0.06, from: 'center' },
      }, 6.15);

  }, { scope: rootRef });

  if (!visible) return null;

  const bandStyle = (s: 'fill' | 'outline' | 'signal' | 'faint') => {
    if (s === 'fill') return { color: INK };
    if (s === 'signal') return { color: SIGNAL };
    if (s === 'faint') return { color: 'rgba(244, 241, 234, 0.16)' };
    return {
      color: 'transparent',
      WebkitTextStroke: '1.5px rgba(244, 241, 234, 0.55)',
    };
  };

  return (
    <div
      ref={rootRef}
      className="preloader"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* Canvas columns — wipe away at the very end */}
      {COLUMNS.map((i) => (
        <div
          key={i}
          className="pl-col"
          style={{
            position: 'absolute',
            top: '-1px',
            bottom: '-1px',
            left: `${i * 20}%`,
            width: '20.5%',
            backgroundColor: '#08080A',
          }}
        />
      ))}

      {/* ── Registration frame: grid + corner marks + labels ── */}
      <div className="pl-frame" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {GRID.map((i) => (
          <div
            key={i}
            className="pl-grid-line"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(i + 1) * (100 / 13)}%`,
              width: '1px',
              backgroundColor: 'rgba(244, 241, 234, 0.055)',
            }}
          />
        ))}

        {/* corner crosshairs */}
        {[
          { top: '2.4rem', left: '2.4rem' },
          { top: '2.4rem', right: '2.4rem' },
          { bottom: '2.4rem', left: '2.4rem' },
          { bottom: '2.4rem', right: '2.4rem' },
        ].map((pos, i) => (
          <div key={i} className="pl-cross" style={{ position: 'absolute', width: '1.4rem', height: '1.4rem', ...pos }}>
            <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: SIGNAL }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '1px', backgroundColor: SIGNAL }} />
          </div>
        ))}
      </div>

      {/* ── Corner labels ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', fontFamily: MONO, fontSize: '1.05rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244, 241, 234, 0.45)' }}>
        <div className="pl-label" style={{ position: 'absolute', top: '2.2rem', left: '5.2rem' }}>Shahd Khairy</div>
        <div className="pl-label" style={{ position: 'absolute', top: '2.2rem', right: '5.2rem' }}>Portfolio / 2026</div>
        <div className="pl-label" style={{ position: 'absolute', bottom: '2.2rem', left: '5.2rem' }}>Cairo — EG</div>
        <div ref={pctRef} className="pl-label" style={{ position: 'absolute', bottom: '2.2rem', right: '5.2rem', color: SIGNAL, fontVariantNumeric: 'tabular-nums' }}>000%</div>
      </div>

      {/* ── Ghost counter ── */}
      <div
        ref={ghostRef}
        className="pl-ghost"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(24rem, 48vw, 66rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(244, 241, 234, 0.075)',
          lineHeight: 1,
          zIndex: 1,
          pointerEvents: 'none',
          fontVariantNumeric: 'tabular-nums',
          opacity: 0,
        }}
      >
        0
      </div>

      {/* ── Kinetic marquee bands ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        {BANDS.map((b, i) => (
          <div
            key={i}
            className={`pl-band pl-band--${i}`}
            style={{
              position: 'absolute',
              left: '-10%',
              width: '120%',
              top: `${13.5 + i * 15}%`,
              height: '13%',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            <div
              className="pl-band__inner"
              style={{
                display: 'flex',
                gap: '3ch',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(3.6rem, 8.4vw, 10rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                textTransform: 'uppercase',
                ...bandStyle(b.style),
              }}
            >
              <span>{b.text}</span>
              <span>{b.text}</span>
              <span>{b.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Impact line ── */}
      <div
        className="pl-line"
        style={{
          position: 'absolute',
          top: '50%',
          left: '8%',
          width: '84%',
          height: '2px',
          backgroundColor: SIGNAL,
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          opacity: 0,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* ── Logotype end-card ── */}
      <div
        className="pl-mark"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.6rem',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      >
        <div
          className="pl-mark-wrap"
          style={{ width: 'min(56rem, 72vw)', clipPath: 'inset(50% 0% 50% 0%)' }}
        >
          <Wordmark id="ldr" drawable />
        </div>

        <div
          className="pl-sub"
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: '1.6rem',
            letterSpacing: '1.5em',
            textIndent: '0.4em',
            color: INK,
            opacity: 0.9,
            textTransform: 'uppercase',
          }}
        >
          {'KHAIRY'.split('').map((c, i) => (
            <span key={i} style={{ opacity: 0 }}>{c}</span>
          ))}
        </div>

        <div
          className="pl-role"
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: '1.25rem',
            letterSpacing: '0.4em',
            color: SIGNAL,
            textTransform: 'uppercase',
          }}
        >
          {'FULL STACK DEVELOPER'.split('').map((c, i) => (
            <span key={i} style={{ opacity: 0, whiteSpace: 'pre' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── Impact flash ── */}
      <div
        className="pl-flash"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: INK,
          opacity: 0,
          zIndex: 7,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

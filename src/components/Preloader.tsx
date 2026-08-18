'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Wordmark, INK } from './LogoMark';
import { SHAHD_LETTERS, SHAHD_WIDTH, LOGO_HEIGHT } from './logo-paths';

gsap.registerPlugin(useGSAP);

const MONO = "'IBM Plex Mono', monospace";
const COLUMNS = [0, 1, 2, 3, 4];
const GRID = Array.from({ length: 12 }, (_, i) => i);
const CANVAS = '#0C0C0C';

/**
 * Marquee bands — mixed filled / outlined type, monochrome ivory.
 * Alternating scroll direction builds the kinetic poster.
 */
const BANDS = [
  { text: 'REACT · NODE · MONGO', style: 'outline' as const, dir: -1 },
  { text: 'FULLSTACK', style: 'fill' as const, dir: 1 },
  { text: 'DESIGN · CODE · SHIP', style: 'soft' as const, dir: -1 },
  { text: 'GSAP · THREE · R3F', style: 'hairline' as const, dir: 1 },
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
      { scaleY: 1, duration: 0.55, stagger: 0.025, ease: 'power2.inOut' }, 0)
      .fromTo('.pl-cross',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.15)
      .fromTo('.pl-label',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, 0.3);

    /* ═══════ PHASE 2 — KINETIC CASCADE (bands drift in, alternating) ═══════ */
    BANDS.forEach((b, i) => {
      tl.fromTo(`.pl-band--${i} .pl-band__inner`,
        { xPercent: b.dir * 55, filter: 'blur(16px)' },
        { xPercent: b.dir * -6, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out' }, 0.72 + i * 0.11)
        .fromTo(`.pl-band--${i}`,
          { opacity: 0, scaleY: 0.4, transformOrigin: '50% 50%' },
          { opacity: 1, scaleY: 1, duration: 0.7, ease: 'power2.out' }, 0.72 + i * 0.11);
    });
    tl.to('.pl-band__inner', { xPercent: (i) => BANDS[i].dir * -12, duration: 1.1, ease: 'none' }, 1.9);

    /* ═══════ PHASE 3 — FLUID GATHER ═══════
       No hard line, no snap. The bands soften, swell and drift together into
       the middle, dissolving into light as the name grows out of them.        */
    tl.to('.pl-band', {
      y: (i) => (2 - i) * -6 + 'vh',
      scaleY: 1.35,
      scaleX: 1.06,
      filter: 'blur(26px)',
      opacity: 0,
      duration: 1.1,
      ease: 'power2.inOut',
      stagger: { each: 0.055, from: 'edges' },
    }, 2.6)
      .to('.pl-grid-line', { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 2.7)
      // a slow bloom breathes through the middle of the gather
      .to('.pl-bloom', { opacity: 0.5, duration: 0.75, ease: 'sine.inOut' }, 2.75)
      .to('.pl-bloom', { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 3.5);

    /* ═══════ COUNTER ═══════ */
    tl.fromTo('.pl-ghost', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.8)
      .to(progress, { v: 100, duration: 3.6, ease: 'power2.inOut', onUpdate: setCount }, 0.8)
      .to('.pl-ghost', { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 4.3);

    /* ═══════ PHASE 5 — THE PORTAL ═══════
       The letters stop being ivory and become windows: the same SHAHD is cut
       out of the cover, so the hero shows through the letterforms. Then the
       cut-out swells until the hero has opened all the way out.              */

    // Cut the letters out of a full-viewport panel, lined up pixel-for-pixel
    // with the ivory mark it replaces. even-odd turns the letterforms into
    // holes, so the hero shows through them like windows.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const markSvg = rootRef.current.querySelector<SVGSVGElement>('.pl-mark-wrap svg');
    const place = rootRef.current.querySelector<SVGGElement>('.pl-portal-place');
    const cut = rootRef.current.querySelector<SVGPathElement>('.pl-portal-cut');

    if (markSvg && place && cut) {
      const r = markSvg.getBoundingClientRect();
      const s = r.width / SHAHD_WIDTH;
      // the wordmark viewBox starts at y=-4, so the glyph box starts 4 units in
      const tx = r.left;
      const ty = r.top + 4 * s;

      place.setAttribute('transform', `translate(${tx}, ${ty + LOGO_HEIGHT * s}) scale(${s})`);

      // viewport rectangle expressed in glyph units, generously oversized
      const x0 = (0 - tx) / s - vw / s;
      const x1 = (vw - tx) / s + vw / s;
      const y0 = (0 - ty - LOGO_HEIGHT * s) / s - vh / s;
      const y1 = (vh - ty - LOGO_HEIGHT * s) / s + vh / s;

      const panel = `M${x0},${y0} L${x1},${y0} L${x1},${y1} L${x0},${y1} Z`;
      cut.setAttribute('d', `${panel} ${SHAHD_LETTERS.map((l) => l.d).join(' ')}`);
    }

    // The terms dissolve directly into the transparent SHAHD. The solid
    // wordmark remains invisible and exists only to provide exact geometry.
    tl.set('.pl-scrim', { opacity: 0.72 }, 2.85)
      .to('.pl-portal', { opacity: 1, duration: 0.95, ease: 'sine.inOut' }, 2.85)
      .to('.pl-col, .pl-glow', { opacity: 0, duration: 0.95, ease: 'sine.inOut' }, 2.85)
      // Normal-speed breathing hold: let the transparent name read clearly.
      .to('.pl-portal-zoom', {
        scale: 1.07,
        svgOrigin: `${vw / 2} ${vh / 2}`,
        duration: 1.45,
        ease: 'sine.inOut',
      }, 3.8)
      .to('.pl-label, .pl-cross', { opacity: 0, duration: 0.65, ease: 'power2.inOut' }, 4.55)
      // Then accelerate hard: short, fast and cinematic.
      .to('.pl-portal-outline', { opacity: 0, duration: 0.25, ease: 'power2.in' }, 5.0)
      .to('.pl-scrim', { opacity: 0, duration: 0.65, ease: 'power2.out' }, 5.18)
      .to('.pl-portal-zoom', {
        scale: 34,
        svgOrigin: `${vw / 2} ${vh / 2}`,
        duration: 0.82,
        ease: 'expo.in',
      }, 5.25);

  }, { scope: rootRef });

  if (!visible) return null;

  const bandStyle = (s: 'fill' | 'outline' | 'soft' | 'hairline' | 'faint') => {
    if (s === 'fill') return { color: INK };
    if (s === 'soft') return { color: 'rgba(244, 241, 234, 0.72)' };
    if (s === 'faint') return { color: 'rgba(244, 241, 234, 0.13)' };
    if (s === 'hairline') {
      return { color: 'transparent', WebkitTextStroke: '1.5px rgba(244, 241, 234, 0.28)' };
    }
    return { color: 'transparent', WebkitTextStroke: '1.5px rgba(244, 241, 234, 0.45)' };
  };

  return (
    <div
      ref={rootRef}
      className="preloader"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* Canvas columns */}
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
            backgroundColor: CANVAS,
          }}
        />
      ))}

      {/* Hero-derived ambient light, so the loader shares the hero's air */}
      <div
        className="pl-glow"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 60% 55% at 50% -15%, hsla(265, 100%, 78%, 0.22) 0%, hsla(265, 100%, 78%, 0.09) 45%, rgba(12,12,12,0) 100%),
            radial-gradient(ellipse 60% 55% at 50% 115%, hsla(210, 100%, 62%, 0.18) 0%, hsla(210, 100%, 62%, 0.07) 45%, rgba(12,12,12,0) 100%)
          `,
        }}
      />

      {/* ── Registration frame ── */}
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
              backgroundColor: 'rgba(244, 241, 234, 0.06)',
            }}
          />
        ))}

        {[
          { top: '2.4rem', left: '2.4rem' },
          { top: '2.4rem', right: '2.4rem' },
          { bottom: '2.4rem', left: '2.4rem' },
          { bottom: '2.4rem', right: '2.4rem' },
        ].map((pos, i) => (
          <div key={i} className="pl-cross" style={{ position: 'absolute', width: '1.4rem', height: '1.4rem', ...pos }}>
            <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: 'rgba(244,241,234,0.55)' }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '1px', backgroundColor: 'rgba(244,241,234,0.55)' }} />
          </div>
        ))}
      </div>

      {/* ── Corner labels ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', fontFamily: MONO, fontSize: '1.05rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244, 241, 234, 0.42)' }}>
        <div className="pl-label" style={{ position: 'absolute', top: '2.2rem', left: '5.2rem' }}>Shahd Khairy</div>
        <div className="pl-label" style={{ position: 'absolute', top: '2.2rem', right: '5.2rem' }}>Portfolio / 2026</div>
        <div className="pl-label" style={{ position: 'absolute', bottom: '2.2rem', left: '5.2rem' }}>Cairo — EG</div>
        <div ref={pctRef} className="pl-label" style={{ position: 'absolute', bottom: '2.2rem', right: '5.2rem', color: 'rgba(244,241,234,0.7)', fontVariantNumeric: 'tabular-nums' }}>000%</div>
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
          WebkitTextStroke: '1px rgba(244, 241, 234, 0.08)',
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

      {/* ── Soft bloom that breathes through the gather ── */}
      <div
        className="pl-bloom"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          opacity: 0,
          background:
            'radial-gradient(ellipse 78% 42% at 50% 50%, rgba(244,241,234,0.16) 0%, rgba(244,241,234,0.05) 45%, rgba(12,12,12,0) 100%)',
        }}
      />

      {/* ── The name — big ── */}
      <div
        className="pl-mark"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      >
        <div className="pl-mark-wrap" style={{ width: 'min(78rem, 86vw)', opacity: 0 }}>
          <Wordmark drawable />
        </div>
      </div>

      {/* ── Scrim: below the cut-out, so it only tints what the holes reveal ── */}
      <div
        className="pl-scrim"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: CANVAS,
          opacity: 0,
          zIndex: 7,
          pointerEvents: 'none',
        }}
      />

      {/* ── The portal: the cover with SHAHD cut clean out of it ── */}
      <svg
        className="pl-portal"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 8,
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        <g className="pl-portal-zoom">
          <g className="pl-portal-place">
            {/* d is built at runtime: viewport rect minus the letterforms */}
            <path className="pl-portal-cut" fillRule="evenodd" fill={CANVAS} />
            <g
              className="pl-portal-outline"
              fill="none"
              stroke={INK}
              strokeWidth="0.72"
              opacity="0.52"
            >
              {SHAHD_LETTERS.map((l, i) => (
                <path key={i} d={l.d} />
              ))}
            </g>
          </g>
        </g>
      </svg>

    </div>
  );
}

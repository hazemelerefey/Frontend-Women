'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SKMonogram, INK, SIGNAL } from './LogoMark';

gsap.registerPlugin(useGSAP);

const MONO = "'IBM Plex Mono', monospace";
const WORDS = ['DESIGN', 'CODE', 'SHIP'];
const COLUMNS = [0, 1, 2, 3, 4];

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current) return;

    const progress = { v: 0 };
    const setGhost = () => {
      if (ghostRef.current) ghostRef.current.textContent = String(Math.round(progress.v));
    };
    setGhost();

    const tl = gsap.timeline({ onComplete: () => setVisible(false) });

    /* ============ ACT 1 — KINETIC WORD MONTAGE (hard slam cuts) ============ */
    WORDS.forEach((_, i) => {
      const t = 0.25 + i * 0.42;
      tl.fromTo(`.title__word--${i}`,
        { opacity: 0, scale: 1.18, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'expo.out' }, t)
        .to(`.title__word--${i}`,
          { opacity: 0, duration: 0.08, ease: 'none' }, t + 0.34);
    });
    // tiny caption ticks along with the montage
    tl.fromTo('.title__caption',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none' }, 0.25);

    /* ============ ACT 2 — MARK ASSEMBLY (bands slide + lime flicker) ============ */
    tl.fromTo('.logo-band--top', { xPercent: -120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, 1.7)
      .fromTo('.logo-band--bot', { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, 1.82)
      .fromTo('.logo-band--mid', { xPercent: -200, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }, 2.0)
      // two-frame signal flicker on the lime band
      .set('.logo-band--mid', { opacity: 0 }, 2.46)
      .set('.logo-band--mid', { opacity: 1 }, 2.52)
      .set('.logo-band--mid', { opacity: 0 }, 2.58)
      .set('.logo-band--mid', { opacity: 1 }, 2.64);

    /* ============ ACT 3 — NAME (letters flip in) + baseline rule ============ */
    tl.fromTo('.title__name .title-letter',
      { rotateX: -92, opacity: 0, transformOrigin: '50% 100%' },
      { rotateX: 0, opacity: 1, duration: 0.55, stagger: 0.035, ease: 'expo.out' }, 2.3)
      .fromTo('.title__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 2.7)
      .fromTo('.title__role span',
        { opacity: 0 },
        { opacity: 1, duration: 0.04, stagger: 0.03, ease: 'none' }, 2.9);

    /* ============ GHOST COUNTER (giant outline number behind) ============ */
    tl.fromTo('.title__ghost', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5)
      .to(progress, { v: 100, duration: 2.5, ease: 'expo.inOut', onUpdate: setGhost }, 1.5);

    /* ============ ACT 4 — LOUVER EXIT (five columns drop away) ============ */
    tl.to('.title__content, .title__ghost, .title__caption',
      { opacity: 0, y: -24, duration: 0.35, ease: 'expo.in', stagger: 0.05 }, 4.25)
      .to('.title__col', {
        yPercent: 100,
        duration: 0.65,
        ease: 'expo.inOut',
        stagger: { each: 0.07, from: 'start' },
      }, 4.6);

  }, { scope: rootRef });

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="preloader"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* Louver background columns (the actual canvas) */}
      {COLUMNS.map((i) => (
        <div
          key={i}
          className="title__col"
          style={{
            position: 'absolute',
            top: 0,
            bottom: '-1px',
            left: `${i * 20}%`,
            width: '20.5%',
            backgroundColor: '#080809',
          }}
        />
      ))}

      {/* Giant ghost percentage — outlined, behind everything */}
      <div
        ref={ghostRef}
        className="title__ghost"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(24rem, 46vw, 64rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(244, 241, 234, 0.10)',
          lineHeight: 1,
          zIndex: 1,
          pointerEvents: 'none',
          fontVariantNumeric: 'tabular-nums',
          opacity: 0,
        }}
      >
        0
      </div>

      {/* Kinetic word montage — stacked, hard cuts */}
      {WORDS.map((w, i) => (
        <div
          key={w}
          className={`title__word title__word--${i}`}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(6rem, 14vw, 18rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: INK,
            opacity: 0,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          {w}
          <span style={{ color: SIGNAL }}>.</span>
        </div>
      ))}

      {/* Caption — top center, mono */}
      <div
        className="title__caption"
        style={{
          position: 'absolute',
          top: '3.4rem',
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: '1.2rem',
          letterSpacing: '0.3em',
          color: 'rgba(244, 241, 234, 0.5)',
          textTransform: 'uppercase',
          zIndex: 3,
          opacity: 0,
        }}
      >
        LOADING — PORTFOLIO 2026
      </div>

      {/* Main composition */}
      <div
        className="title__content"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3.4rem',
          zIndex: 2,
          perspective: '900px',
        }}
      >
        {/* Sliced SK mark */}
        <div style={{ width: '16rem' }}>
          <SKMonogram size="100%" drawable />
        </div>

        {/* Name — letters flip in on X axis */}
        <h1
          className="title__name"
          style={{
            margin: 0,
            display: 'flex',
            fontSize: 'clamp(3.4rem, 6.5vw, 7.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
            color: INK,
            whiteSpace: 'pre',
            perspective: '900px',
          }}
        >
          {'SHAHD KHAIRY'.split('').map((c, i) => (
            <span key={i} className="title-letter" style={{ display: 'inline-block', opacity: 0, whiteSpace: 'pre' }}>{c}</span>
          ))}
        </h1>

        {/* Baseline rule */}
        <div
          className="title__rule"
          style={{
            width: 'min(52rem, 72vw)',
            height: '1px',
            backgroundColor: 'rgba(244, 241, 234, 0.25)',
            transform: 'scaleX(0)',
            transformOrigin: 'center',
          }}
        />

        {/* Role — mono type-on */}
        <div
          className="title__role"
          style={{
            fontFamily: MONO,
            fontSize: '1.3rem',
            letterSpacing: '0.4em',
            color: SIGNAL,
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {'FULL STACK DEVELOPER'.split('').map((c, i) => (
            <span key={i} style={{ opacity: 0, whiteSpace: 'pre' }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

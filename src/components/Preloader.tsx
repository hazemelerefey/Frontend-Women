'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Wordmark, INK, SIGNAL } from './LogoMark';

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
    tl.fromTo('.title__caption',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none' }, 0.25);

    /* ============ ACT 2 — LOGOTYPE STAMP (letters slam in, brand ident) ============ */
    tl.fromTo('.wm-letter',
      { scale: 1.7, opacity: 0, transformOrigin: '50% 50%' },
      { scale: 1, opacity: 1, duration: 0.38, stagger: 0.09, ease: 'expo.out' }, 1.75)
      // impact shake as the last letter lands
      .to('.title__mark', { x: 3, duration: 0.04 }, 2.2)
      .to('.title__mark', { x: -2, duration: 0.04 }, 2.24)
      .to('.title__mark', { x: 0, duration: 0.05 }, 2.28);

    /* ============ ACT 3 — THE SLASH (24° lime cut strikes the A) ============ */
    tl.fromTo('.wm-cutrect',
      { scaleX: 0, transformOrigin: '0% 50%' },
      { scaleX: 1, duration: 0.32, ease: 'expo.inOut' }, 2.55)
      .fromTo('.wm-slash',
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 0.32, ease: 'expo.inOut' }, 2.62)
      // two-frame flicker on the slash — signal locked
      .set('.wm-slash', { opacity: 0 }, 3.02)
      .set('.wm-slash', { opacity: 1 }, 3.08)
      .set('.wm-slash', { opacity: 0 }, 3.14)
      .set('.wm-slash', { opacity: 1 }, 3.2)
      // sub-line + rule + role
      .fromTo('.title__sub span',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'expo.out' }, 3.0)
      .fromTo('.title__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 3.15)
      .fromTo('.title__role span',
        { opacity: 0 },
        { opacity: 1, duration: 0.04, stagger: 0.03, ease: 'none' }, 3.35);

    /* ============ GHOST COUNTER (giant outline number behind) ============ */
    tl.fromTo('.title__ghost', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5)
      .to(progress, { v: 100, duration: 2.5, ease: 'expo.inOut', onUpdate: setGhost }, 1.5);

    /* ============ ACT 4 — LOUVER EXIT (five columns drop away) ============ */
    tl.to('.title__content, .title__ghost, .title__caption',
      { opacity: 0, y: -24, duration: 0.35, ease: 'expo.in', stagger: 0.05 }, 4.35)
      .to('.title__col', {
        yPercent: 100,
        duration: 0.65,
        ease: 'expo.inOut',
        stagger: { each: 0.07, from: 'start' },
      }, 4.7);

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
          gap: '3rem',
          zIndex: 2,
        }}
      >
        {/* SHAHD logotype — vector, stamps in letter by letter */}
        <div className="title__mark" style={{ width: 'min(58rem, 74vw)' }}>
          <Wordmark id="ldr" drawable />
        </div>

        {/* KHAIRY sub-line — letterspaced mono */}
        <div
          className="title__sub"
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: '1.7rem',
            letterSpacing: '1.6em',
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

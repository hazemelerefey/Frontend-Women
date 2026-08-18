'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SKMonogram } from './LogoMark';

gsap.registerPlugin(useGSAP);

const MONO = "'IBM Plex Mono', monospace";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!rootRef.current) return;

    const progress = { v: 0 };
    const setCounter = () => {
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(progress.v)).padStart(3, '0') + '%';
      }
    };
    setCounter();

    const tl = gsap.timeline({ onComplete: () => setVisible(false) });

    /* ============ PHASE 1 — RIG (structure cuts in) ============ */
    tl.fromTo('.boot__hairline--v', { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'expo.inOut' }, 0.1)
      .fromTo('.boot__hairline--h', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0.18)
      .fromTo('.boot__bracket', { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out', stagger: 0.06 }, 0.35)
      .fromTo('.boot__hud', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08 }, 0.55);

    /* ============ PHASE 2 — MARK ASSEMBLY (pieces cut in) ============ */
    // The monogram's six vector pieces wipe on sequentially — blue arc
    // system first, then the pink wedge system.
    tl.fromTo('.logo-piece',
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.45, stagger: 0.16, ease: 'expo.inOut' }, 0.7)
      // shine sweep across the assembled mark — a single hard cut of light
      .fromTo('.boot__shine', { xPercent: -160 }, { xPercent: 160, duration: 0.6, ease: 'power2.inOut' }, 1.85);

    /* ============ PHASE 3 — NAME (panel wipe) ============ */
    // solid panel wipes over, the name appears behind it, panel wipes off
    tl.fromTo('.boot__wipe', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.45, ease: 'expo.inOut' }, 1.6)
      .set('.boot__name', { opacity: 1 }, 2.05)
      .set('.boot__wipe', { transformOrigin: 'right center' }, 2.05)
      .to('.boot__wipe', { scaleX: 0, duration: 0.45, ease: 'expo.inOut' }, 2.08)
      .fromTo('.boot__role',
        { opacity: 0 },
        { opacity: 1, duration: 0.05, stagger: 0.035, ease: 'none' }, 2.35);

    /* ============ PHASE 4 — LOAD (progress ticks) ============ */
    tl.fromTo('.boot__progress', { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: 'expo.inOut' }, 1.2)
      .to(progress, { v: 100, duration: 1.9, ease: 'expo.inOut', onUpdate: setCounter }, 1.2);

    /* ============ PHASE 5 — CUT (curtain split exit) ============ */
    tl.to('.boot__content > *', { y: -30, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'expo.in' }, 3.5)
      .to('.boot__hud, .boot__bracket, .boot__hairline--v, .boot__hairline--h, .boot__progress',
        { opacity: 0, duration: 0.25, ease: 'power1.in' }, 3.65)
      .to('.boot__panel--top', { yPercent: -100, duration: 0.75, ease: 'expo.inOut' }, 3.95)
      .to('.boot__panel--bottom', { yPercent: 100, duration: 0.75, ease: 'expo.inOut' }, 3.95);

  }, { scope: rootRef });

  if (!visible) return null;

  const hud: React.CSSProperties = {
    position: 'absolute',
    fontFamily: MONO,
    fontSize: '1.2rem',
    letterSpacing: '0.12em',
    color: 'rgba(180, 195, 217, 0.75)',
    textTransform: 'uppercase',
    zIndex: 3,
  };

  const bracket = (pos: React.CSSProperties, borders: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    width: '2.4rem',
    height: '2.4rem',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderStyle: 'solid',
    borderWidth: 0,
    zIndex: 3,
    ...pos,
    ...borders,
  });

  return (
    <div
      ref={rootRef}
      className="preloader"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* Curtain panels (the actual background) */}
      <div className="boot__panel--top" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '50.2%', backgroundColor: '#0a0a0c' }} />
      <div className="boot__panel--bottom" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '50.2%', backgroundColor: '#0a0a0c' }} />

      {/* Hairline crosshairs */}
      <div className="boot__hairline--v" style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', backgroundColor: 'rgba(255,255,255,0.07)', zIndex: 2 }} />
      <div className="boot__hairline--h" style={{ position: 'absolute', top: '50%', left: 0, height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.07)', zIndex: 2 }} />

      {/* Corner brackets — viewfinder frame */}
      <div className="boot__bracket" style={bracket({ top: '3rem', left: '3rem' }, { borderTopWidth: '1px', borderLeftWidth: '1px' })} />
      <div className="boot__bracket" style={bracket({ top: '3rem', right: '3rem' }, { borderTopWidth: '1px', borderRightWidth: '1px' })} />
      <div className="boot__bracket" style={bracket({ bottom: '3rem', left: '3rem' }, { borderBottomWidth: '1px', borderLeftWidth: '1px' })} />
      <div className="boot__bracket" style={bracket({ bottom: '3rem', right: '3rem' }, { borderBottomWidth: '1px', borderRightWidth: '1px' })} />

      {/* HUD labels — mono, technical */}
      <div className="boot__hud" style={{ ...hud, top: '3.2rem', left: '6.5rem' }}>SHAHD KHAIRY — PORTFOLIO</div>
      <div className="boot__hud" style={{ ...hud, top: '3.2rem', right: '6.5rem' }}>©2026</div>
      <div className="boot__hud" style={{ ...hud, bottom: '3.2rem', left: '6.5rem' }}>CAIRO.EG / 30.0444°N</div>
      <div className="boot__hud" style={{ ...hud, bottom: '3.2rem', right: '6.5rem', color: 'var(--white)' }}>
        <span ref={counterRef} style={{ fontVariantNumeric: 'tabular-nums' }}>000%</span>
      </div>

      {/* Progress hairline — center horizontal, drawn over the crosshair */}
      <div
        className="boot__progress"
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '1px',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          background: 'linear-gradient(90deg, #94BDF7, #D2BDF8)',
          zIndex: 2,
        }}
      />

      {/* Center content */}
      <div
        className="boot__content"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3.2rem',
          zIndex: 4,
        }}
      >
        {/* Monogram with shine sweep */}
        <div style={{ position: 'relative', width: '15rem', overflow: 'visible' }}>
          <SKMonogram size="100%" strokeWidth={4.5} drawable />
          <div style={{ position: 'absolute', inset: '-1rem', overflow: 'hidden', pointerEvents: 'none' }}>
            <div
              className="boot__shine"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                left: '30%',
                background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                transform: 'translateX(-160%) skewX(-18deg)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </div>

        {/* Name — revealed by a solid panel wipe */}
        <div style={{ position: 'relative', padding: '0.4rem 1.2rem' }}>
          <h1
            className="boot__name"
            style={{
              margin: 0,
              opacity: 0,
              fontSize: 'clamp(3.2rem, 6vw, 7rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              color: 'var(--white)',
              whiteSpace: 'nowrap',
            }}
          >
            Shahd Khairy
          </h1>
          <div
            className="boot__wipe"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#D2BDF8',
              transform: 'scaleX(0)',
              zIndex: 2,
            }}
          />
        </div>

        {/* Role — mono, typed on */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: '1.3rem',
            letterSpacing: '0.38em',
            color: 'rgba(180, 195, 217, 0.85)',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {'FULL STACK DEVELOPER'.split('').map((c, i) => (
            <span key={i} className="boot__role" style={{ opacity: 0, whiteSpace: 'pre' }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

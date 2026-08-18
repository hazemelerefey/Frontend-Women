'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TitleReveal from './TitleReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const shahdItems = [
  'Bugless',
  'PixelPerfect',
  'On-time deadlines',
  'Fixed Price Only',
  'Free Light Animations',
  'Better than Figma',
  'Weekly Updates',
  'Stable Support',
  'Fast Replies',
  'Creativity',
  'hassle-free',
];

const freelancerItems = [
  'Full of bugs',
  'Near Layout',
  'Deadline shame',
  'Post-launch costs',
  'Hovers Not Always',
  'Worse than Figma',
  'Strage Silence',
  'Dev Rotation',
  'Hours of Silence',
  'Passivity',
  'Headaches',
];

const TOTAL = shahdItems.length; // 11

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  useGSAP(() => {
    // === Row activation, 1:1 synced with scroll ===
    // Each of the 11 row pairs owns an equal slice of the scroll through the
    // grid; the badge number IS the active row index.
    const rows = gsap.utils.toArray<HTMLElement>('.compare__row--left');
    rows.forEach((row, idx) => {
      ScrollTrigger.create({
        trigger: row,
        start: 'center-=60 center',
        end: 'center+=160 center',
        onEnter: () => setActiveRow(idx),
        onEnterBack: () => setActiveRow(idx),
      });
    });

    // === Zip effect: badge shrinks while scrolling, springs back on stop ===
    const badge = badgeRef.current;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (!badge) return;
      gsap.to(badge, { scale: 0.82, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        gsap.to(badge, { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });
      }, 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Gentle idle float so the badge always feels alive
    gsap.to('.compare__badge-inner', {
      y: '-0.6rem',
      duration: 1.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // === 3D fold: halves tilt toward the seam, mouse adds micro-parallax ===
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop) {
      gsap.set(leftHalfRef.current, { rotateY: 7, transformOrigin: 'right center' });
      gsap.set(rightHalfRef.current, { rotateY: -7, transformOrigin: 'left center' });

      const grid = document.querySelector<HTMLElement>('.compare-grid');
      const handleMove = (e: MouseEvent) => {
        if (!grid) return;
        const rect = grid.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(leftHalfRef.current, { rotateY: 7 + px * 3, rotateX: -py * 3, duration: 0.6, ease: 'power2.out' });
        gsap.to(rightHalfRef.current, { rotateY: -7 + px * 3, rotateX: -py * 3, duration: 0.6, ease: 'power2.out' });
      };
      const handleLeave = () => {
        gsap.to(leftHalfRef.current, { rotateY: 7, rotateX: 0, duration: 0.8, ease: 'power2.out' });
        gsap.to(rightHalfRef.current, { rotateY: -7, rotateX: 0, duration: 0.8, ease: 'power2.out' });
      };
      grid?.addEventListener('mousemove', handleMove);
      grid?.addEventListener('mouseleave', handleLeave);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, { scope: sectionRef });

  const highlight = hoverRow ?? activeRow;
  const shown = (hoverRow ?? activeRow) + 1;

  const rowStyle = (idx: number, side: 'left' | 'right'): React.CSSProperties => ({
    fontSize: highlight === idx ? 'clamp(2.4rem, 2.8vw, 3.6rem)' : 'clamp(1.9rem, 2.1vw, 2.6rem)',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    padding: '1.8rem 0',
    textAlign: side === 'left' ? 'right' : 'left',
    cursor: 'pointer',
    opacity: highlight === idx ? 1 : 0.45,
    transform: highlight === idx ? 'translateZ(3.5rem)' : 'translateZ(0)',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  });

  return (
    <section
      ref={sectionRef}
      id="compare"
      style={{
        backgroundColor: 'var(--black)',
        paddingTop: '10rem',
        paddingBottom: '12rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Section Title */}
        <TitleReveal
          text="Approach"
          style={{ 
            fontSize: 'clamp(5rem, 16vw, 24rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '4rem',
          }}
        />

        {/* Split card with 3D fold + zip badge on the seam */}
        <div className="compare-grid" style={{ position: 'relative', perspective: '160rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.6rem',
              transformStyle: 'preserve-3d',
            }}
            className="compare-grid__inner"
          >
            {/* Left half: SHAHD */}
            <div
              ref={leftHalfRef}
              className="compare__half"
              style={{
                background: 'linear-gradient(180deg, #94bdf7 0%, #a8c4f8 100%)',
                borderRadius: '1.2rem 0 0 1.2rem',
                padding: '6rem 0 6rem 3rem',
                color: '#000',
                display: 'grid',
                gridTemplateColumns: '10rem 1fr',
                alignItems: 'center',
                transformStyle: 'preserve-3d',
                boxShadow: '0 3rem 8rem rgba(0,0,0,0.45)',
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                SHAHD
              </div>
              <div style={{ paddingRight: '10rem', transformStyle: 'preserve-3d' }}>
                {shahdItems.map((item, idx) => (
                  <div
                    key={item}
                    className="compare__row--left"
                    onMouseEnter={() => setHoverRow(idx)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={rowStyle(idx, 'left')}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right half: FREELANCER */}
            <div
              ref={rightHalfRef}
              className="compare__half"
              style={{
                background: 'linear-gradient(180deg, #d4bdf8 0%, #cdb2f6 100%)',
                borderRadius: '0 1.2rem 1.2rem 0',
                padding: '6rem 3rem 6rem 0',
                color: '#000',
                display: 'grid',
                gridTemplateColumns: '1fr 10rem',
                alignItems: 'center',
                transformStyle: 'preserve-3d',
                boxShadow: '0 3rem 8rem rgba(0,0,0,0.45)',
                willChange: 'transform',
              }}
            >
              <div style={{ paddingLeft: '10rem', transformStyle: 'preserve-3d' }}>
                {freelancerItems.map((item, idx) => (
                  <div
                    key={item}
                    onMouseEnter={() => setHoverRow(idx)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={rowStyle(idx, 'right')}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'right',
                }}
              >
                FREELANCER
              </div>
            </div>
          </div>

          {/* Zip badge — small, alive, riding the seam. The number IS the
              active advantage index, perfectly synced with the scroll. */}
          <div
            className="compare__badge-col"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              height: '100%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div style={{ position: 'sticky', top: 'calc(50vh - 6.5rem)' }}>
              <div
                ref={badgeRef}
                style={{ willChange: 'transform' }}
              >
                <div
                  className="compare__badge-inner"
                  style={{
                    width: '13rem',
                    height: '13rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 16, 20, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                    boxShadow: '0 1.5rem 5rem rgba(0, 0, 0, 0.6), inset 0 0 3rem rgba(148, 189, 247, 0.08)',
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      letterSpacing: '0.14em', 
                      color: 'var(--gray)',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    ADVANTAGE
                  </span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', lineHeight: 1 }}>
                    <span 
                      style={{ 
                        fontSize: '4.4rem', 
                        fontWeight: 600, 
                        color: 'var(--white)',
                        letterSpacing: '-0.03em',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {String(shown).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--sky)' }}>
                      /{TOTAL}
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--pink)',
                      letterSpacing: '0.04em',
                      maxWidth: '10rem',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {shahdItems[highlight ?? 0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .compare-grid__inner {
            grid-template-columns: 1fr !important;
          }
          .compare__half {
            grid-template-columns: 1fr !important;
            border-radius: 1.2rem !important;
            padding: 4rem 2.5rem !important;
          }
          .compare__half > div {
            padding: 0 !important;
          }
          .compare__badge-col {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

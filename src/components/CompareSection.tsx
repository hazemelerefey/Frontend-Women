'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const alinaItems = [
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

const swapLabels = ['IDEAS', 'HOURS', 'BUGS'];

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const [swapIdx, setSwapIdx] = useState(0);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSwapIdx((i) => (i + 1) % swapLabels.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    // 3D tilt effect on mousemove across each card
    const setupTilt = (element: HTMLElement | null) => {
      if (!element) return;
      const handleMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotY = (x / rect.width - 0.5) * 10;
        const rotX = (y / rect.height - 0.5) * -10;

        gsap.to(element, {
          rotationX: rotX,
          rotationY: rotY,
          ease: 'power2.out',
          duration: 0.4,
          transformPerspective: 1000,
        });
      };

      const handleLeave = () => {
        gsap.to(element, { rotationX: 0, rotationY: 0, ease: 'power2.out', duration: 0.5 });
      };

      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseleave', handleLeave);
    };

    setupTilt(leftCardRef.current);
    setupTilt(rightCardRef.current);

  }, { scope: sectionRef });

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
        <h2 
          className="simple-title" 
          style={{ 
            fontSize: 'clamp(5rem, 16vw, 24rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '4rem',
          }}
        >
          <span>Approach</span>
        </h2>

        {/* Compare Content (Side-by-Side 2 Cards with Center Floating Badge) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.6rem',
            position: 'relative',
          }}
          className="compare-grid"
        >
          {/* Left Column: ALINA (Sky Blue) */}
          <div
            ref={leftCardRef}
            style={{
              background: 'linear-gradient(180deg, #94bdf7 0%, #a4cdf8 100%)',
              borderRadius: '2.4rem',
              padding: '6rem 5rem 6rem 6rem',
              color: '#000',
              position: 'relative',
              boxShadow: '0 2rem 5rem rgba(0,0,0,0.3)',
              transformStyle: 'preserve-3d',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Header: ALINA */}
            <div
              style={{
                fontSize: 'clamp(2.4rem, 3.5vw, 4.2rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>ALINA</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.04em' }}>POSITIVE</span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              {alinaItems.map((item, idx) => (
                <div
                  key={item}
                  onMouseEnter={() => setActiveRow(idx)}
                  onMouseLeave={() => setActiveRow(null)}
                  style={{
                    fontSize: activeRow === idx ? 'clamp(2.2rem, 2.6vw, 3.4rem)' : 'clamp(1.8rem, 2vw, 2.4rem)',
                    fontWeight: activeRow === idx ? 800 : 500,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    paddingBottom: '1.2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{item}</span>
                  <span style={{ fontSize: '1.4rem', opacity: activeRow === idx ? 1 : 0.3 }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FREELANCER (Lavender) */}
          <div
            ref={rightCardRef}
            style={{
              background: 'linear-gradient(180deg, #d4bdf8 0%, #c4adf5 100%)',
              borderRadius: '2.4rem',
              padding: '6rem 6rem 6rem 5rem',
              color: '#000',
              position: 'relative',
              boxShadow: '0 2rem 5rem rgba(0,0,0,0.3)',
              transformStyle: 'preserve-3d',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Header: FREELANCER */}
            <div
              style={{
                fontSize: 'clamp(2.4rem, 3.5vw, 4.2rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>FREELANCER</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.04em' }}>NEGATIVE</span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              {freelancerItems.map((item, idx) => (
                <div
                  key={item}
                  onMouseEnter={() => setActiveRow(idx)}
                  onMouseLeave={() => setActiveRow(null)}
                  style={{
                    fontSize: activeRow === idx ? 'clamp(2.2rem, 2.6vw, 3.4rem)' : 'clamp(1.8rem, 2vw, 2.4rem)',
                    fontWeight: activeRow === idx ? 800 : 500,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    paddingBottom: '1.2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{item}</span>
                  <span style={{ fontSize: '1.4rem', opacity: activeRow === idx ? 1 : 0.3 }}>✕</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Center Black Circle Badge */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18rem',
              height: '18rem',
              borderRadius: '50%',
              backgroundColor: '#121214',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0 1.5rem 4rem rgba(0, 0, 0, 0.45)',
              border: '2px solid rgba(255, 255, 255, 0.08)',
              pointerEvents: 'none',
            }}
          >
            <span 
              style={{ 
                fontSize: '1.4rem', 
                fontWeight: 700, 
                letterSpacing: '0.06em', 
                color: 'var(--gray)',
                textTransform: 'uppercase',
                marginBottom: '0.2rem',
                transition: 'opacity 0.2s ease',
              }}
            >
              {swapLabels[swapIdx]}
            </span>
            <span 
              style={{ 
                fontSize: '6.2rem', 
                fontWeight: 800, 
                lineHeight: 1, 
                color: 'var(--sky)',
                letterSpacing: '-0.03em',
              }}
            >
              89
            </span>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .compare-grid {
            grid-template-columns: 1fr !important;
          }
          .compare-grid > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FeaturesBar from './FeaturesBar';
import TitleReveal from './TitleReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    // Card entrance stagger
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
      }
    })
    .fromTo('.about .simple-title, .about .features', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.about__card:nth-child(2n-1)', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
    .fromTo('.about__card:nth-child(2n)', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1);

    // 3D Tilt Effect on cards
    const cards = gsap.utils.toArray('.about__card');
    cards.forEach((card: any) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width - 0.5) * 14;
        const yPercent = (y / rect.height - 0.5) * -14;

        gsap.to(card, {
          rotationX: yPercent,
          rotationY: xPercent,
          ease: 'power2.out',
          duration: 0.4,
          transformPerspective: 1000,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, ease: 'power2.out', duration: 0.5 });
      });
    });

    // Mission text slider: pinned so the words flip while the viewer is held in place
    gsap.timeline({
      scrollTrigger: {
        trigger: '.mission__giant',
        start: 'center center',
        end: '+=1000',
        scrub: true,
        pin: true,
      },
    })
    .to('.mission-slide-1', { yPercent: -100, opacity: 0 }, 0.15)
    .fromTo('.mission-slide-2', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1 }, 0.15);

    // Mission giant lines drift in from the sides as they enter
    gsap.utils.toArray<HTMLElement>('.mission__row').forEach((row, i) => {
      gsap.fromTo(
        row,
        { x: i % 2 === 0 ? 120 : -120, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: row,
            start: 'top bottom',
            end: 'center 70%',
            scrub: 2,
          },
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="about" 
      id="about" 
      style={{ 
        backgroundColor: 'var(--black)', 
        color: 'var(--white)',
        paddingTop: '12rem',
        paddingBottom: '10rem',
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Title */}
        <TitleReveal
          text="SIMPLY ABOUT"
          style={{ 
            fontSize: 'clamp(5rem, 20vw, 30.8rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 400,
            marginBottom: '4rem',
            color: 'var(--gray)'
          }}
        />

        {/* Subheader Feature Row */}
        <div style={{ marginBottom: '15rem' }}>
          <FeaturesBar 
            title="PIXEL-PERFECT" 
            items={['SUPPORT ∞', '/CODE-QUALITY', '//HASSLE-FREE']} 
          />
        </div>

        {/* 2x2 About Cards Grid with Scraped Gradient Colors */}
        <div 
          className="about__grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.6rem',
            marginBottom: '15rem',
          }}
        >
          {/* Card 1: Top-Left (#94bdf7 -> #b4bdf7) */}
          <a
            href="https://artydevs.com"
            target="_blank"
            rel="noreferrer"
            className="about__card"
            style={{
              background: 'linear-gradient(180deg, #94bdf7 0%, #b4bdf7 100%)',
              borderRadius: '0.8rem',
              padding: '6rem 5.7rem',
              minHeight: '44rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              LEAD
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                Projects at ArtyDevs
              </div>
              <div className="btn btn--black" style={{ display: 'inline-flex' }}>
                <div className="btn__text link-hover">artydevs.com</div>
              </div>
            </div>
          </a>

          {/* Card 2: Top-Right (#94bdf7 -> #b4bdf7) */}
          <div
            className="about__card"
            style={{
              background: 'linear-gradient(180deg, #94bdf7 0%, #b4bdf7 100%)',
              borderRadius: '0.8rem',
              padding: '6rem 5.7rem',
              minHeight: '44rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#000',
            }}
          >
            <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              AWARDS 12+
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                Won with Partners
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['FWA', 'CSS DESIGN', 'AWWWARDS'].map((badge) => (
                  <div key={badge} className="btn btn--black btn--none" style={{ display: 'inline-flex' }}>
                    <div className="btn__text link-hover">{badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Bottom-Left (#b4bdf7 -> #d4bdf8) */}
          <div
            className="about__card"
            style={{
              background: 'linear-gradient(180deg, #b4bdf7 0%, #d4bdf8 100%)',
              borderRadius: '0.8rem',
              padding: '6rem 5.7rem',
              minHeight: '44rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#000',
            }}
          >
            <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              98%
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                Upwork Job Success
              </div>
              <div className="btn btn--black btn--none" style={{ display: 'inline-flex' }}>
                <div className="btn__text link-hover">TOP RATED</div>
              </div>
            </div>
          </div>

          {/* Card 4: Bottom-Right (#b4bdf7 -> #d4bdf8) */}
          <a
            href="https://clutch.co/profile/artydevs"
            target="_blank"
            rel="noreferrer"
            className="about__card"
            style={{
              background: 'linear-gradient(180deg, #b4bdf7 0%, #d4bdf8 100%)',
              borderRadius: '0.8rem',
              padding: '6rem 5.7rem',
              minHeight: '44rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              I AM HUMAN ツ
            </div>
            <div>
              <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                I ♡ Code, Humor & Designers
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['10+ REVIEWS', 'SATISFIED CUSTOMERS'].map((badge) => (
                  <div key={badge} className="btn btn--black" style={{ display: 'inline-flex' }}>
                    <div className="btn__text link-hover">{badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </a>
        </div>

        {/* Mission Section */}
        <section 
          className="mission" 
          id="mission" 
          style={{ 
            marginTop: '10rem', 
            paddingTop: '5rem',
            paddingBottom: '5rem',
          }}
        >
          <div style={{ marginBottom: '10rem' }}>
            <FeaturesBar 
              title="2025" 
              items={['MY', 'MISSION', 'IS']} 
              reverse={true}
            />
          </div>

          {/* Giant Typography Lines */}
          <div className="mission__giant" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            {/* Row 1: INCREASE YOUR */}
            <div 
              className="mission__row"
              style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                fontSize: '21rem', 
                fontWeight: 400, 
                lineHeight: 0.85, 
                letterSpacing: '-0.03em', 
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              <span>Increase</span>
            </div>

            {/* Row 2: YOUR + SLIDER */}
            <div 
              className="mission__row"
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'baseline',
                fontSize: '21rem', 
                fontWeight: 400, 
                lineHeight: 0.85, 
                letterSpacing: '-0.03em', 
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: 'var(--gray)' }}>Your</span>
              <div style={{ position: 'relative', overflow: 'hidden', height: '1em', color: 'var(--pink)' }}>
                <div className="mission-slide-1" style={{ display: 'block' }}>Design Value</div>
                <div className="mission-slide-2" style={{ position: 'absolute', top: 0, right: 0, opacity: 0 }}>Design Profit</div>
              </div>
            </div>

            {/* Row 3: WITH */}
            <div 
              className="mission__row"
              style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                fontSize: '21rem', 
                fontWeight: 400, 
                lineHeight: 0.85, 
                letterSpacing: '-0.03em', 
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              <span>With</span>
            </div>

            {/* Row 4: SLIDER */}
            <div 
              className="mission__row"
              style={{ 
                display: 'flex', 
                fontSize: '21rem', 
                fontWeight: 400, 
                lineHeight: 0.85, 
                letterSpacing: '-0.03em', 
                textTransform: 'uppercase',
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', height: '1em', color: 'var(--sky)' }}>
                <div className="mission-slide-1" style={{ display: 'block' }}>High Standard</div>
                <div className="mission-slide-2" style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}>Cost Effective</div>
              </div>
            </div>

            {/* Row 5: DEVELOPMENT */}
            <div 
              className="mission__row"
              style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                fontSize: '21rem', 
                fontWeight: 400, 
                lineHeight: 0.85, 
                letterSpacing: '-0.03em', 
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              <span>Development</span>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .about__grid {
            grid-template-columns: 1fr !important;
          }
          .about__card {
            min-height: 32rem !important;
            padding: 4rem 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}

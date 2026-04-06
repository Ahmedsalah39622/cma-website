"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, Code, Zap, BarChart3, ChevronDown,
  Mail, Phone, Instagram, Linkedin, MessageCircle,
  Star, Shield, Target, TrendingUp, Users, Sparkles,
  Quote, Calendar, Clock, ExternalLink, ArrowUpRight,
  MapPin, ChevronRight, X
} from 'lucide-react';

import { useServices, ServiceIcons } from '@/context/ServicesContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useFAQs } from '@/context/FAQContext';
import { useBrands } from '@/context/BrandsContext';
import { useTestimonials } from '@/context/TestimonialsContext';
import { useBlog } from '@/context/BlogContext';
import { useSiteData } from '@/context/SiteDataContext';

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Portfolio Auto-Scroll Carousel ─── */
function PortfolioCarousel({ projects }: { projects: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = projects.slice(0, 6);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % items.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [items.length]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 20, behavior: 'smooth' });
    }
  };

  // Track scroll position to update dots
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.children[0]?.clientWidth || 1;
      const idx = Math.round(scrollLeft / (cardWidth + 12));
      setActiveIndex(Math.min(idx, items.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [items.length]);

  // Pause auto-scroll on touch
  const pauseAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };
  const resumeAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % items.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
  };

  const { ref: sectionRef, visible } = useInView(0.1);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{
        padding: '56px 0 48px',
        background: '#f8fafc',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center" style={{ marginBottom: 24, padding: '0 24px' }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ background: '#fff', border: '1px solid #f1f5f9', marginBottom: 12 }}
        >
          <Sparkles size={12} style={{ color: '#D4AF37' }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#94a3b8' }}>Our Gallery</span>
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 10 }}>
          Our{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #64748b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Portfolio</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, maxWidth: 280, lineHeight: 1.6 }}>
          Showcasing our finest projects that blend art with strategy
        </p>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onTouchStart={pauseAutoScroll}
        onTouchEnd={resumeAutoScroll}
        className="flex gap-3 overflow-x-auto"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 4,
        }}
      >
        {items.map((p, i) => (
          <a
            key={i}
            href={`/mobile/portfolio/${p.id || i}`}
            className="flex-shrink-0 group"
            style={{
              width: 'calc(100vw - 48px)',
              scrollSnapAlign: 'center',
            }}
          >
            {/* Card */}
            <div
              className="overflow-hidden relative"
              style={{
                aspectRatio: '4/5',
                borderRadius: 24,
                marginBottom: 14,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.7s ease' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none' }} />

              {/* Year badge */}
              <div
                className="absolute"
                style={{
                  top: 14,
                  right: 14,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(12px)',
                  padding: '6px 14px',
                  borderRadius: 14,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#0f172a',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                {p.year}
              </div>

              {/* Category tag */}
              <div className="absolute w-full flex justify-center" style={{ bottom: 16, left: 0, padding: '0 16px' }}>
                <span
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '7px 18px',
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {p.category}
                </span>
              </div>
            </div>

            <h4 className="text-center" style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{p.title}</h4>
          </a>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2" style={{ marginTop: 20 }}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { scrollToIndex(i); setActiveIndex(i); }}
            className="transition-all duration-300"
            style={{
              width: activeIndex === i ? 24 : 8,
              height: 8,
              borderRadius: 100,
              background: activeIndex === i ? '#D4AF37' : '#e2e8f0',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center" style={{ marginTop: 28 }}>
        <a
          href="/mobile/portfolio"
          className="inline-flex items-center gap-3 active:scale-[0.97] transition-all"
          style={{
            background: '#0f172a',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: 100,
            fontWeight: 700,
            fontSize: 14,
            boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
          }}
        >
          View All Projects <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

export default function MobilePage() {
  const { services: dynamicServices } = useServices();
  const { items: dynamicProjects } = usePortfolio();
  const { faqs: dynamicFaqs } = useFAQs();
  const { brands: dynamicBrands } = useBrands();
  const { testimonials: dynamicTestimonials } = useTestimonials();
  const { posts: dynamicPosts } = useBlog();
  const { teamMembers: dynamicTeam, contactInfo, visibility } = useSiteData();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stats = [
    { label: "Active Clients", value: "230+", icon: <Users size={18} /> },
    { label: "Projects Done", value: "420+", icon: <Target size={18} /> },
    { label: "Success Rate", value: "98%", icon: <TrendingUp size={18} /> }
  ];

  if (!visibility) return null;

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: '#FAFBFC', color: '#0f172a' }}>

      {/* ═══════════════════════════
          NAVBAR
      ═══════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-400"
        style={{
          padding: '0',
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: scrolled
            ? '0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)'
            : '0 1px 0 rgba(0,0,0,0.04)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ padding: '14px 20px' }}
        >
          <div className="flex items-center gap-2.5">
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              border: '1px solid #e2e8f0',
            }}>
              <img src="/logo.png" alt="CMA" className="w-full h-full object-contain" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em', color: '#0f172a' }}>CMA</span>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Toggle Menu"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
            }}
          >
            <div className="flex flex-col gap-[5px]">
              <span className={`block w-[18px] h-[2.5px] rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`} style={{ background: menuOpen ? '#D4AF37' : '#334155' }} />
              <span className={`block w-[18px] h-[2.5px] rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} style={{ background: '#334155' }} />
              <span className={`block w-[18px] h-[2.5px] rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`} style={{ background: menuOpen ? '#D4AF37' : '#334155' }} />
            </div>
          </button>
        </div>
      </nav>

      {/* ═══ Sidebar Overlay ═══ */}
      <div
        className={`fixed inset-0 z-[150] transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        onClick={() => setMenuOpen(false)}
      />

      {/* ═══ Sidebar ═══ */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] z-[200] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, #0c1222 0%, #080d17 100%)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '20px 24px' }}>
          <div className="flex items-center gap-2.5">
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <img src="/logo.png" alt="CMA" className="w-full h-full object-contain" style={{ filter: 'brightness(2)' }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '-0.03em' }}>CMA</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center active:scale-90 transition-all"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />

        {/* Nav Items */}
        <div className="flex flex-col" style={{ padding: '24px 16px', gap: 4 }}>
          {[
            { href: '#services', icon: <Zap size={18} />, label: 'Services' },
            { href: '#portfolio', icon: <Target size={18} />, label: 'Portfolio' },
            { href: '#testimonials', icon: <Star size={18} />, label: 'Testimonials' },
            { href: '#team', icon: <Users size={18} />, label: 'Team' },
            { href: '#blog', icon: <Calendar size={18} />, label: 'Blog' },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 active:scale-[0.97] transition-all"
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                color: '#e2e8f0',
                background: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.12)',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />

        {/* Extra links */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>Get in touch</p>
          {contactInfo?.phone && (
            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3" style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 10, textDecoration: 'none' }}>
              <Phone size={14} style={{ color: '#D4AF37' }} />
              {contactInfo.phone}
            </a>
          )}
          {contactInfo?.email && (
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3" style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 10, textDecoration: 'none' }}>
              <Mail size={14} style={{ color: '#D4AF37' }} />
              {contactInfo.email}
            </a>
          )}
        </div>

        {/* CTA Button (pinned to bottom) */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: '0 20px 32px' }}>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-3 active:scale-[0.97] transition-all w-full"
            style={{
              padding: '16px 24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 100%)',
              fontWeight: 700,
              fontSize: 15,
              color: '#0f172a',
              boxShadow: '0 8px 24px rgba(212,175,55,0.25)',
            }}
          >
            <MessageCircle size={18} />
            Contact Us
          </a>
        </div>
      </div>

      {/* ═══════════════════════════
          HERO SECTION
      ═══════════════════════════ */}
      {visibility.hero !== false && (
        <section className="relative overflow-hidden" style={{ padding: '120px 24px 60px' }}>
          {/* Decorative gradient orbs */}
          <div className="absolute top-8 -left-16 w-64 h-64 rounded-full animate-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
          <div className="absolute top-32 -right-16 w-72 h-72 rounded-full animate-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)', animationDelay: '1.5s' }} />

          <div className="relative z-10 flex flex-col items-center text-center">
            <Reveal>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
              >
                <Sparkles size={13} style={{ color: '#D4AF37' }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8' }}>The Gold Standard Agency</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#0f172a',
                marginBottom: 20,
              }}>
                Design <br />
                <span style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Your Future
                </span>
                <br />
                <span className="inline-flex items-center gap-3 justify-center" style={{ marginTop: 4 }}>
                  <span style={{ color: '#D4AF37', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 400 }}>with</span>
                  <span>CMA</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p style={{
                color: '#64748b',
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 320,
                marginBottom: 28,
                fontWeight: 500,
              }}>
                We don't just market; we build <span style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'underline', textDecorationColor: 'rgba(212,175,55,0.4)', textUnderlineOffset: 5 }}>legacies</span> for brands that dare to lead.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <a
                href="#contact"
                className="flex items-center justify-center gap-3 active:scale-[0.96] transition-all"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  padding: '18px 32px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#fff',
                  borderRadius: 20,
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: '0 12px 40px rgba(15,23,42,0.25)',
                }}
              >
                Ignite Growth <ArrowRight size={18} style={{ color: '#D4AF37' }} />
              </a>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          BRANDS MARQUEE
      ═══════════════════════════ */}
      {visibility.brands !== false && dynamicBrands.length > 0 && (
        <section style={{ padding: '32px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
          <Reveal>
            <div className="text-center" style={{ marginBottom: 20, padding: '0 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Trusted Partners</p>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Brands We Worked With</h2>
            </div>
          </Reveal>

          <div className="flex animate-marquee gap-16 whitespace-nowrap" style={{ paddingTop: 8 }}>
            {[...dynamicBrands, ...dynamicBrands].map((brand, i) => (
              <div key={i} className="flex items-center justify-center" style={{ opacity: 0.4, filter: 'grayscale(100%)', transition: 'all 0.5s' }}>
                <img src={brand.image} alt={brand.name} className="h-14 w-auto object-contain" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          STATS SECTION
      ═══════════════════════════ */}
      <section style={{ padding: '48px 20px', background: '#f8fafc' }}>
        <Reveal>
          <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 420, margin: '0 auto' }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center"
                style={{
                  background: '#fff',
                  padding: '20px 8px',
                  borderRadius: 20,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)',
                    marginBottom: 10,
                    color: '#D4AF37',
                  }}
                >
                  {stat.icon}
                </div>
                <h4 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: 4 }}>{stat.value}</h4>
                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════
          SERVICES SECTION
      ═══════════════════════════ */}
      {visibility.services !== false && (
        <section id="services" className="relative overflow-hidden" style={{ padding: '56px 20px', background: '#fff' }}>
          {/* Subtle background decoration */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.03) 0%, transparent 70%)' }} />

          <Reveal>
            <div className="text-center relative z-10" style={{ marginBottom: 32 }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mx-auto"
                style={{ background: '#f8fafc', border: '1px solid #f1f5f9', marginBottom: 12 }}
              >
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37' }}>Our Services</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f172a' }}>
                Elite solutions for <br />
                <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#D4AF37', fontWeight: 400 }}>modern</span> brands.
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 relative z-10" style={{ maxWidth: 380, margin: '0 auto' }}>
            {dynamicServices.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  className="group active:scale-[0.98] transition-all"
                  style={{
                    background: '#fafbfc',
                    border: '1px solid #f1f5f9',
                    borderRadius: 24,
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                  }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: '#fff',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    {ServiceIcons[s.iconType] || <Code size={22} style={{ color: '#D4AF37' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, marginBottom: 10 }}>{s.count}</p>
                    <div
                      className="inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37' }}
                    >
                      Learn More <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          PORTFOLIO SECTION
      ═══════════════════════════ */}
      {visibility.portfolio !== false && (
        <PortfolioCarousel projects={dynamicProjects} />
      )}

      {/* ═══════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════ */}
      {visibility.testimonials !== false && dynamicTestimonials.length > 0 && (
        <section id="testimonials" className="relative overflow-hidden" style={{ padding: '56px 20px', background: '#fff' }}>
          {/* Subtle decorations */}
          <div className="absolute top-10 left-4 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
          <div className="absolute bottom-10 right-4 w-52 h-52 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />

          <Reveal>
            <div className="text-center relative z-10" style={{ marginBottom: 28 }}>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 8 }}>
                Success Stories
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.15, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>
                What Our Clients Say
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 260, margin: '0 auto', lineHeight: 1.5 }}>
                Real feedback from clients we helped achieve results
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 relative z-10" style={{ maxWidth: 380, margin: '0 auto' }}>
            {dynamicTestimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #fafbfc 0%, #f8f9fb 100%)',
                    padding: 24,
                    borderRadius: 24,
                    border: '1px solid #f1f5f9',
                    position: 'relative',
                  }}
                >
                  {/* Quote decoration */}
                  <div style={{ position: 'absolute', top: 16, right: 20, opacity: 0.06 }}>
                    <Quote size={40} />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1" style={{ marginBottom: 14 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill="#D4AF37" color="#D4AF37" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 18 }}>
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                        background: '#e2e8f0',
                      }}
                    >
                      <img src={t.image || '/avatar-placeholder.png'} alt={t.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{t.author}</h5>
                      <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          TEAM SECTION
      ═══════════════════════════ */}
      {visibility.team !== false && dynamicTeam.length > 0 && (
        <section id="team" style={{ padding: '56px 20px', background: '#f8fafc' }}>
          <Reveal>
            <div className="text-center" style={{ marginBottom: 32 }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mx-auto"
                style={{ background: '#fff', border: '1px solid #f1f5f9', marginBottom: 12 }}
              >
                <Users size={12} style={{ color: '#D4AF37' }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#94a3b8' }}>Meet The Team</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#0f172a' }}>
                The minds <br />
                <span style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #64748b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>behind elite</span> designs.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 380, margin: '0 auto' }}>
            {dynamicTeam.map((member, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group flex flex-col items-center">
                  <div
                    className="overflow-hidden relative w-full"
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: 24,
                      marginBottom: 12,
                      boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                      border: '4px solid #fff',
                      backgroundColor: member.bgColor || '#F5F5F5',
                    }}
                  >
                    <img
                      src={member.image || '/team-placeholder.png'}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      style={{ filter: 'grayscale(30%)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.15) 100%)' }} />
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2, textAlign: 'center' }}>{member.name}</h4>
                  <p style={{ color: '#D4AF37', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center' }}>{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          BLOG SECTION
      ═══════════════════════════ */}
      {visibility.blog !== false && dynamicPosts.length > 0 && (
        <section id="blog" style={{ padding: '56px 20px', background: '#fff' }}>
          <Reveal>
            <div className="text-center" style={{ marginBottom: 32 }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mx-auto"
                style={{ background: '#f8fafc', border: '1px solid #f1f5f9', marginBottom: 12 }}
              >
                <Calendar size={12} style={{ color: '#D4AF37' }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#0f172a' }}>Daily Insights</span>
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f172a' }}>
                Fuel your <br />
                <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#D4AF37', fontWeight: 400 }}>digital</span> wisdom.
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5" style={{ maxWidth: 380, margin: '0 auto' }}>
            {dynamicPosts.slice(0, 3).map((post, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className="group cursor-pointer active:scale-[0.98] transition-all"
                  style={{
                    background: '#fafbfc',
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Thumbnail */}
                  <div className="overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={post.imageUrl || '/blog-placeholder.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute flex items-center gap-1.5"
                      style={{
                        top: 12,
                        left: 12,
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        padding: '5px 12px',
                        borderRadius: 100,
                      }}
                    >
                      <Clock size={11} style={{ color: '#D4AF37' }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px 20px 20px' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 6, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{post.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div
                      className="inline-flex items-center gap-2 cursor-pointer"
                      style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37' }}
                    >
                      Read Article <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          FOOTER
      ═══════════════════════════ */}
      <footer
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0c1222 0%, #0a0f1a 100%)',
          color: '#fff',
          padding: '48px 24px 28px',
          marginTop: 0,
        }}
      >
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 8,
              }}
            >
              <img src="/logo.png" alt="CMA" className="w-full h-full object-contain" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>CMA</span>
          </div>

          <p className="text-center" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
            We offer a comprehensive suite of digital marketing services. Your partner in digital growth.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col items-center gap-2" style={{ marginBottom: 24 }}>
            {contactInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin size={13} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{contactInfo.address}</p>
              </div>
            )}
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
                <Phone size={13} style={{ color: '#D4AF37' }} />
                {contactInfo.phone}
              </a>
            )}
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
                <Mail size={13} style={{ color: '#D4AF37' }} />
                {contactInfo.email}
              </a>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3" style={{ marginBottom: 28 }}>
            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="flex items-center justify-center transition-all active:scale-90"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <img
                  src={`https://cdn.simpleicons.org/${social === 'twitter' ? 'x' : social}/64748b`}
                  alt={social}
                  className="w-4 h-4"
                  style={{ opacity: 0.7 }}
                />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '100%', maxWidth: 280, height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

          {/* Bottom */}
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginBottom: 10 }}>
            © {new Date().getFullYear()} CMA Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>Privacy Policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

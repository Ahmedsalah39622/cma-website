'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Grid, LayoutList, Sparkles, ArrowUpRight, Search } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useInView(threshold = 0.1) {
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

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.6s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function MobilePortfolioPage() {
  const { items: projects } = usePortfolio();
  const safeProjects = projects || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filter
  const filteredProjects = selectedCategory === 'All'
    ? safeProjects
    : safeProjects.filter((p: any) => p.category === selectedCategory);

  // Categories
  const categories = ['All', ...Array.from(new Set(safeProjects.map((p: any) => p.category))).filter(Boolean)];

  return (
    <div style={{ background: '#FAFBFC', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ═══ Header ═══ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
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
          className="flex items-center justify-between"
          style={{ padding: '12px 20px' }}
        >
          <Link
            href="/mobile"
            className="flex items-center justify-center active:scale-90 transition-transform"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#f1f5f9',
              color: '#0f172a',
            }}
          >
            <ArrowLeft size={18} />
          </Link>

          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0f172a' }}>
            Portfolio
          </span>

          <div className="flex" style={{ background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
            <button
              onClick={() => setViewMode('grid')}
              className="flex items-center justify-center transition-all"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: viewMode === 'grid' ? '#fff' : 'transparent',
                color: viewMode === 'grid' ? '#0f172a' : '#94a3b8',
                boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center justify-center transition-all"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: viewMode === 'list' ? '#fff' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#94a3b8',
                boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <div style={{ paddingTop: 100, paddingBottom: 8, paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
        <Reveal>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', marginBottom: 14 }}
          >
            <Sparkles size={12} style={{ color: '#D4AF37' }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#94a3b8' }}>Our Work</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 style={{ fontSize: 36, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#0f172a', marginBottom: 10 }}>
            Selected <br />
            <span style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Portfolio.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, maxWidth: 260, margin: '0 auto', lineHeight: 1.6 }}>
            Crafting digital experiences that leave a lasting impression.
          </p>
        </Reveal>
      </div>

      {/* ═══ Filter Bar ═══ */}
      <Reveal delay={0.15}>
        <div style={{ padding: '16px 0 12px', marginBottom: 4 }}>
          <div
            className="flex items-center gap-2 overflow-x-auto"
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 transition-all duration-300 active:scale-95"
                style={{
                  padding: '8px 18px',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  background: selectedCategory === cat ? '#0f172a' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#64748b',
                  border: selectedCategory === cat ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  boxShadow: selectedCategory === cat ? '0 4px 16px rgba(15,23,42,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══ Project Count ═══ */}
      <div style={{ padding: '0 24px', marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 800,
          color: '#94a3b8',
          background: '#f1f5f9',
          padding: '4px 10px',
          borderRadius: 8,
          letterSpacing: '0.1em',
        }}>
          {filteredProjects.length} PROJECTS
        </span>
      </div>

      {/* ═══ Content ═══ */}
      <div style={{ padding: '0 16px', minHeight: '50vh' }}>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredProjects.map((project: any, index: number) => (
              <Reveal key={project.id || index} delay={index * 0.04}>
                <Link
                  href={`/mobile/portfolio/${project.id || index}`}
                  className="group block"
                >
                  <div
                    className="overflow-hidden relative active:scale-[0.97] transition-transform duration-300"
                    style={{
                      aspectRatio: '3/4',
                      borderRadius: 20,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)',
                    }} />

                    {/* Year badge */}
                    {project.year && (
                      <div
                        className="absolute"
                        style={{
                          top: 10,
                          right: 10,
                          background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(12px)',
                          borderRadius: 10,
                          padding: '4px 10px',
                          fontSize: 10,
                          fontWeight: 800,
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {project.year}
                      </div>
                    )}

                    {/* Bottom info */}
                    <div className="absolute w-full" style={{ bottom: 0, left: 0, padding: 14 }}>
                      <span style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        padding: '3px 10px',
                        borderRadius: 100,
                        fontSize: 8,
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {project.category}
                      </span>
                      <h3 style={{
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 14,
                        lineHeight: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project: any, index: number) => (
              <Reveal key={project.id || index} delay={index * 0.04}>
                <Link
                  href={`/mobile/portfolio/${project.id || index}`}
                  className="group block active:scale-[0.98] transition-all"
                  style={{
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Thumbnail */}
                  <div className="overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute"
                      style={{
                        top: 10,
                        left: 10,
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        padding: '5px 12px',
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#0f172a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {project.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between" style={{ padding: '14px 16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 3, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.description || project.year || 'View project details'}
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: '#f8fafc',
                        color: '#64748b',
                        marginLeft: 12,
                      }}
                    >
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: '#f8fafc',
                marginBottom: 16,
                color: '#cbd5e1',
              }}
            >
              <Search size={28} />
            </div>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 4 }}>No Projects Found</p>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Try changing the category filter</p>
          </div>
        )}
      </div>

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          background: 'linear-gradient(180deg, #0c1222 0%, #0a0f1a 100%)',
          color: '#fff',
          padding: '40px 24px 28px',
          marginTop: 48,
          textAlign: 'center',
        }}
      >
        <div className="flex items-center justify-center gap-2.5" style={{ marginBottom: 14 }}>
          <div
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', padding: 6 }}
          >
            <img src="/logo.png" alt="CMA" className="w-full h-full object-contain" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>CMA</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.6, maxWidth: 260, margin: '0 auto 20px' }}>
          Your trusted partner in creative digital marketing solutions.
        </p>
        <div style={{ width: '100%', maxWidth: 180, height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
          © {new Date().getFullYear()} CMA Agency. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

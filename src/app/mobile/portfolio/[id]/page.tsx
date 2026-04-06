'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Star, Globe, Play, ChevronRight, Share2, Heart } from 'lucide-react';
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

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { items: projects } = usePortfolio();
  const safeProjects = projects || [];
  const [project, setProject] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const foundProject = safeProjects.find((p: any, index: number) =>
      p.id === projectId || p.id === parseInt(projectId) || index === parseInt(projectId)
    );
    setProject(foundProject || null);
  }, [projectId, safeProjects]);

  if (!project) {
    return (
      <div style={{ background: '#FAFBFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="text-center" style={{ padding: 40 }}>
          <div
            className="flex items-center justify-center mx-auto"
            style={{ width: 64, height: 64, borderRadius: 20, background: '#f1f5f9', marginBottom: 16, color: '#cbd5e1' }}
          >
            <Star size={28} />
          </div>
          <p style={{ color: '#64748b', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Project not found</p>
          <Link
            href="/mobile/portfolio"
            className="inline-flex items-center gap-2"
            style={{ color: '#D4AF37', fontWeight: 700, fontSize: 14 }}
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  // Combine main image with gallery images
  const allImages = [
    project.image,
    ...(project.gallery || [])
  ].filter(Boolean);

  // Get related projects (same category, different project)
  const relatedProjects = safeProjects
    .filter((p: any) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <div style={{ background: '#FAFBFC', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0f172a' }}>

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
            href="/mobile/portfolio"
            className="flex items-center gap-2 active:scale-90 transition-transform"
            style={{ color: '#0f172a' }}
          >
            <div
              className="flex items-center justify-center"
              style={{ width: 36, height: 36, borderRadius: 12, background: '#f1f5f9' }}
            >
              <ArrowLeft size={17} />
            </div>
          </Link>

          <span style={{
            fontWeight: 800,
            fontSize: 13,
            color: '#0f172a',
            maxWidth: 160,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {project.title}
          </span>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{ width: 36, height: 36, borderRadius: 12, background: '#f1f5f9', color: '#64748b' }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main style={{ paddingTop: 88 }}>

        {/* Hero Image */}
        <Reveal>
          <div style={{ padding: '0 16px', marginBottom: 24 }}>
            <div
              className="overflow-hidden relative"
              style={{
                borderRadius: 24,
                boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                border: '1px solid #f1f5f9',
              }}
            >
              <img
                src={allImages[activeImageIndex] || project.image}
                alt={project.title}
                className="w-full"
                style={{ aspectRatio: '4/3', objectFit: 'cover' }}
              />

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)',
                pointerEvents: 'none',
              }} />

              {/* Category badge */}
              <div
                className="absolute"
                style={{
                  top: 14,
                  left: 14,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(12px)',
                  padding: '6px 14px',
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {project.category}
              </div>

              {/* Year badge */}
              {project.year && (
                <div
                  className="absolute"
                  style={{
                    top: 14,
                    right: 14,
                    background: 'rgba(15,23,42,0.7)',
                    backdropFilter: 'blur(12px)',
                    padding: '6px 14px',
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {project.year}
                </div>
              )}

              {/* Image pagination dots */}
              {allImages.length > 1 && (
                <div className="absolute flex items-center justify-center gap-1.5" style={{ bottom: 14, left: 0, right: 0 }}>
                  {allImages.map((_: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className="transition-all"
                      style={{
                        width: activeImageIndex === i ? 20 : 6,
                        height: 6,
                        borderRadius: 100,
                        background: activeImageIndex === i ? '#fff' : 'rgba(255,255,255,0.4)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Project Info */}
        <Reveal delay={0.05}>
          <div style={{ padding: '0 24px', marginBottom: 24 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8' }}>Portfolio</span>
              <ChevronRight size={12} style={{ color: '#cbd5e1' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37' }}>{project.category}</span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: 12 }}>
              {project.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-1.5">
                <Star size={14} fill="#D4AF37" color="#D4AF37" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{project.category}</span>
              </div>
              {project.year && (
                <>
                  <span style={{ color: '#e2e8f0' }}>•</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{project.year}</span>
                </>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                {project.description}
              </p>
            )}

            {/* External Link */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#fff',
                  borderRadius: 18,
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
                  textDecoration: 'none',
                }}
              >
                <Globe size={17} />
                Visit Project
                <ExternalLink size={15} style={{ opacity: 0.6 }} />
              </a>
            )}
          </div>
        </Reveal>

        {/* ═══ Gallery ═══ */}
        {allImages.length > 1 && (
          <Reveal delay={0.1}>
            <div style={{ padding: '0 20px', marginBottom: 32 }}>
              {/* Section header */}
              <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                <div style={{ width: 24, height: 3, borderRadius: 100, background: '#D4AF37' }} />
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Project Gallery</h2>
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-2 gap-3">
                {allImages.map((img: string, index: number) => (
                  <div
                    key={index}
                    className={`overflow-hidden cursor-pointer active:scale-[0.97] transition-transform ${index === 0 ? 'col-span-2' : ''}`}
                    style={{
                      borderRadius: 18,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      border: '1px solid #f1f5f9',
                    }}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: index === 0 ? '16/10' : '1/1' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ═══ Social Links ═══ */}
        {project.socialLinks && project.socialLinks.length > 0 && (
          <Reveal delay={0.15}>
            <div style={{ padding: '0 24px', marginBottom: 32 }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                <div style={{ width: 24, height: 3, borderRadius: 100, background: '#D4AF37' }} />
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Follow Project</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.socialLinks.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 active:scale-95 transition-all"
                    style={{
                      background: '#fff',
                      border: '1px solid #f1f5f9',
                      padding: '10px 16px',
                      borderRadius: 14,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      textDecoration: 'none',
                    }}
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${social.platform}/64748b`}
                      alt={social.platform}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>
                      {social.platform}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ═══ Video Section ═══ */}
        {project.videoUrl && (
          <Reveal delay={0.15}>
            <div style={{ padding: '0 20px', marginBottom: 32 }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                <div style={{ width: 24, height: 3, borderRadius: 100, background: '#D4AF37' }} />
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Project Video</h2>
              </div>
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  aspectRatio: '16/9',
                  border: '1px solid #f1f5f9',
                }}
              >
                {project.videoType === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{ border: 'none' }}
                  />
                ) : project.videoType === 'vimeo' ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${extractVimeoId(project.videoUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                ) : (
                  <video
                    src={project.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* ═══ Related Projects ═══ */}
        {relatedProjects.length > 0 && (
          <Reveal delay={0.2}>
            <div style={{ padding: '24px 20px 0', marginBottom: 0, borderTop: '1px solid #f1f5f9' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 24, height: 3, borderRadius: 100, background: '#D4AF37' }} />
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Related Projects</h2>
                </div>
                <Link
                  href="/mobile/portfolio"
                  style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37', textDecoration: 'none' }}
                >
                  View All
                </Link>
              </div>

              <div
                className="flex gap-3 overflow-x-auto"
                style={{
                  paddingBottom: 20,
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {relatedProjects.map((rp: any, i: number) => (
                  <Link
                    key={rp.id || i}
                    href={`/mobile/portfolio/${rp.id || i}`}
                    className="flex-shrink-0 group"
                    style={{ width: 200 }}
                  >
                    <div
                      className="overflow-hidden relative"
                      style={{
                        aspectRatio: '3/4',
                        borderRadius: 18,
                        marginBottom: 10,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                        border: '1px solid #f1f5f9',
                      }}
                    >
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                      <div className="absolute" style={{ bottom: 12, left: 12, right: 12 }}>
                        <span style={{
                          display: 'inline-block',
                          background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(6px)',
                          padding: '3px 10px',
                          borderRadius: 100,
                          fontSize: 8,
                          fontWeight: 800,
                          color: '#fff',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}>
                          {rp.category}
                        </span>
                        <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 13, lineHeight: 1.3 }}>{rp.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          background: 'linear-gradient(180deg, #0c1222 0%, #0a0f1a 100%)',
          color: '#fff',
          padding: '40px 24px 28px',
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

// Helper functions
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\\d+)/);
  return match ? match[1] : '';
}

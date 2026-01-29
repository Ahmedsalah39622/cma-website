'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';
import { PortfolioItem } from '@/context/PortfolioContext';

// Social Icon Components
const SocialIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'youtube':
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33A29 29 0 0022.54 6.42zM9.75 15.02l5.75-3.27-5.75-3.27v6.54z" /></svg>;
        case 'instagram':
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
        case 'twitter':
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
        case 'linkedin':
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
        case 'facebook':
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
        case 'website':
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
        default:
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
    }
};

interface PortfolioProps {
    projects?: PortfolioItem[];
}

export default function Portfolio({ projects = [] }: PortfolioProps) {
    // Normalize props to expected format if needed, but assuming Drizzle returns compatible shape or we map it
    const items = projects.map(p => ({
        ...p,
        image: (p as any).imageUrl || p.image, // Ensure image URL is found
        id: p.id
    }));

    const [activeCategory, setActiveCategory] = useState('All Work');
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    // Extract unique categories from items
    const categories = React.useMemo(() => {
        const cats = new Set(items.map(item => item.category));
        return ['All Work', ...Array.from(cats)];
    }, [items]);

    // Filter projects based on active category
    const filteredProjects = activeCategory === 'All Work'
        ? items
        : items.filter(p => p.category === activeCategory);

    // Get category counts
    const categoryCounts = React.useMemo(() => {
        const counts: Record<string, number> = { 'All Work': items.length };
        items.forEach(item => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    }, [items]);

    function centerItemAt(index: number) {
        const el = trackRef.current;
        if (!el) return;
        const cards = Array.from(el.querySelectorAll('.portfolio-card')) as HTMLElement[];
        const item = cards[index];
        if (!item) return;
        const rect = el.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const offset = (itemRect.left + itemRect.width / 2) - (rect.left + rect.width / 2);
        el.scrollBy({ left: offset, behavior: 'smooth' });
    }

    function onScroll() {
        const el = trackRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const percent = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;
        setProgress(percent);

        const cards = Array.from(el.querySelectorAll('.portfolio-card')) as HTMLElement[];
        if (cards.length === 0) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((it, i) => {
            const r = it.getBoundingClientRect();
            const itemCenter = r.left + r.width / 2;
            const dist = Math.abs(itemCenter - centerX);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });
        setActiveIndex(closest);
    }

    function scrollBy(direction: number) {
        const el = trackRef.current;
        if (!el) return;
        const item = el.querySelector('.portfolio-card');
        const itemWidth = (item as HTMLElement)?.offsetWidth || Math.round(el.clientWidth * 0.8);
        const gap = 32;
        const amount = (itemWidth + gap) * direction;
        const maxScroll = el.scrollWidth - el.clientWidth;
        let target = el.scrollLeft + amount;
        if (target < 0) target = 0;
        if (target > maxScroll) target = maxScroll;
        el.scrollTo({ left: target, behavior: 'smooth' });
    }

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const ro = new ResizeObserver(() => onScroll());
        ro.observe(el);

        return () => {
            el.removeEventListener('scroll', onScroll);
            ro.disconnect();
        };
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        setTimeout(() => {
            el.scrollTo({ left: 0, behavior: 'smooth' });
            setActiveIndex(0);
        }, 80);
    }, [activeCategory]);

    const handleCardClick = (project: PortfolioItem, index: number) => {
        // Force active index to update immediately for visual feedback
        setActiveIndex(index);
        centerItemAt(index);

        // Small delay to let the centering animation start, then navigate
        setTimeout(() => {
            router.push(`/project/${project.id}`);
        }, 100);
    };

    // Helper to get YouTube ID
    const getYoutubeId = (url: string) => {
        try {
            if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0];
            if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
            if (url.includes('/shorts/')) return url.split('/shorts/')[1]?.split('?')[0];
            if (url.includes('/embed/')) return url.split('/embed/')[1]?.split('?')[0];
            const cleanUrl = url.split('?')[0];
            return cleanUrl.split('/').pop() || '';
        } catch (e) {
            console.error('Error extracting YouTube ID:', e);
            return '';
        }
    };

    return (
        <section id="portfolio" className="py-8 lg:py-12 section-wrapper section-offset-xl">
            <div className="mx-4 card card-dark rounded-[30px] relative overflow-hidden">
                <GeometricBackground pattern="hexagon" position="right" opacity={0.05} color="#fff" />

                {/* Background Effect */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-[2000px] h-[1400px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl -right-[400px] -top-[400px] rotate-[115deg]"></div>
                </div>

                <div className="absolute top-0 right-0 w-[500px] h-full opacity-[0.08] pointer-events-none">
                    <svg viewBox="0 0 200 400" className="w-full h-full" preserveAspectRatio="xMaxYMid slice">
                        <defs>
                            <pattern id="hexagons" width="30" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                                <polygon points="15,0 30,8.66 30,26 15,34.64 0,26 0,8.66" fill="none" stroke="white" strokeWidth="0.8" />
                                <polygon points="15,17.32 30,25.98 30,43.3 15,51.96 0,43.3 0,25.98" fill="none" stroke="white" strokeWidth="0.8" transform="translate(15, 0)" />
                            </pattern>
                        </defs>
                        <rect width="200" height="400" fill="url(#hexagons)" />
                    </svg>
                </div>

                <ScrollReveal className="container-custom relative z-10 py-16 lg:py-24">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-12 mb-20 lg:mb-28">
                        <h2 className="scroll-visible animate-fade-in-up text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-center leading-[1.3] tracking-[-0.03em] max-w-[900px]">
                            Real-world examples of how we have helped companies achieve their marketing objectives.
                        </h2>

                        {/* Category Tabs */}
                        <div className="scroll-visible animate-fade-in-up delay-200 flex flex-wrap justify-center gap-4 md:gap-5">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    aria-pressed={activeCategory === cat}
                                    className={`pill ${activeCategory === cat ? 'pill--active' : ''}`}
                                >
                                    {cat} [{categoryCounts[cat] || 0}]
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Projects Carousel */}
                    <div className="relative w-full mt-8">
                        {/* Left Navigation Button */}
                        <button
                            aria-label="Previous"
                            className="carousel-btn left-4 lg:left-8"
                            onClick={() => scrollBy(-1)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Carousel Track */}
                        <div
                            ref={trackRef}
                            onScroll={onScroll}
                            className="carousel-track mt-6 lg:mt-0 flex items-center"
                        >
                            {items.length === 0 ? (
                                <div className="w-full text-center text-white/60 py-20 flex-shrink-0">
                                    <p className="text-lg">No portfolio items found.</p>
                                    <p className="text-sm mt-2">Add items from the admin panel.</p>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="w-full text-center text-white/60 py-20 flex-shrink-0">
                                    <p className="text-lg">No portfolio items in this category.</p>
                                    <p className="text-sm mt-2">Try a different filter.</p>
                                </div>
                            ) : (
                                filteredProjects.map((project, idx) => {
                                    const isReel = project.videoType === 'instagram';
                                    const cardDimensions = isReel
                                        ? 'w-[280px] h-[480px] lg:w-[320px] lg:h-[560px]'
                                        : 'w-[280px] h-[280px] lg:w-[380px] lg:h-[400px]';

                                    let displayImage = project.image;
                                    if (!displayImage && project.videoType === 'youtube' && project.videoUrl) {
                                        const ytid = getYoutubeId(project.videoUrl);
                                        if (ytid) {
                                            displayImage = `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`;
                                        }
                                    }

                                    return (
                                        <div
                                            key={project.id}
                                            className={`portfolio-card flex-shrink-0 ${activeIndex === idx ? 'active' : 'inactive'}`}
                                            onClick={() => handleCardClick(project, idx)}
                                        >
                                            <div className={`${cardDimensions} rounded-[24px] lg:rounded-[30px] relative overflow-hidden group cursor-pointer transition-all duration-300`}>
                                                <div className="absolute inset-0">
                                                    {displayImage ? (
                                                        <img
                                                            src={displayImage}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                if (target.src.includes('maxresdefault')) {
                                                                    target.src = target.src.replace('maxresdefault', 'hqdefault');
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-[#E8E8E8] to-[#D5D5D5]" />
                                                    )}
                                                </div>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute inset-0 rounded-[24px] lg:rounded-[30px] border-[8px] lg:border-[10px] border-white/20"></div>

                                                {project.videoUrl && (
                                                    <div className="absolute inset-0 flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-300">
                                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg hover:bg-white/30 transition-colors cursor-pointer">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute top-6 lg:top-8 left-6 lg:left-8 flex items-center gap-3 z-10 w-full pr-16 text-left">
                                                    <div className="w-[40px] lg:w-[54px] h-[1px] bg-white/50 shrink-0"></div>
                                                    <span className="text-white/90 font-semibold text-xs lg:text-sm tracking-[-0.02em] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {project.company}. {project.year}
                                                    </span>
                                                </div>

                                                <div className="absolute top-6 lg:top-8 right-6 lg:right-8 z-10">
                                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-medium">
                                                        {project.category}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 right-6 lg:right-8 z-10">
                                                    <h3 className="text-white font-semibold text-lg lg:text-xl leading-[1.35] mb-2 pr-8 text-left">
                                                        {project.title}
                                                    </h3>
                                                    {project.description && (
                                                        <p className="text-white/60 text-sm mb-3 line-clamp-2 text-left">
                                                            {project.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                        {(project.socialLinks || []).map((link, i) => (
                                                            <a
                                                                key={i}
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-[#FFD700] transition-colors"
                                                                title={link.type}
                                                            >
                                                                <SocialIcon type={link.type} />
                                                            </a>
                                                        ))}
                                                        {!project.videoUrl && project.link && (
                                                            <div className="flex items-center gap-2 text-[#FFD700] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span>View Project</span>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                                                    <polyline points="15 3 21 3 21 9" />
                                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-[24px] lg:rounded-[30px]"></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Right Navigation Button */}
                        <button
                            aria-label="Next"
                            className="carousel-btn right-4 lg:right-8"
                            onClick={() => scrollBy(1)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Progress Bar */}
                        <div className="carousel-progress mt-8 lg:mt-12 h-2 bg-white/20 rounded-full overflow-hidden max-w-[500px] mx-auto">
                            <div
                                style={{
                                    width: `${Math.max(progress, 8)}%`,
                                    background: 'linear-gradient(90deg, #FFD700, #D4AF37, #FFD700)',
                                    backgroundSize: '200% 100%',
                                    animation: 'gold-progress 2s linear infinite'
                                }}
                                className="h-full transition-all duration-300 rounded-full"
                            ></div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

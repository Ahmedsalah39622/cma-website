'use client';

import React, { useState, useRef, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';
import { usePortfolio } from '@/context/PortfolioContext';

export default function Portfolio() {
    const { items, categories, isLoaded } = usePortfolio();
    const [activeCategory, setActiveCategory] = useState('All Work');
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

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

    return (
        <section id="portfolio" className="py-8 lg:py-12 section-wrapper section-offset-xl">
            <div className="mx-4 card card-dark rounded-[30px] relative overflow-hidden">
                <GeometricBackground pattern="hexagon" position="right" opacity={0.05} color="#fff" />

                {/* Background Effect */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-[2000px] h-[1400px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl -right-[400px] -top-[400px] rotate-[115deg]"></div>
                </div>

                {/* Hexagon Pattern Overlay - Right Side */}
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
                            className="carousel-track mt-6 lg:mt-0"
                        >
                            {!isLoaded ? (
                                // Skeleton loading placeholders
                                [...Array(4)].map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="portfolio-card flex-shrink-0 w-[280px] h-[280px] lg:w-[380px] lg:h-[400px] rounded-[24px] lg:rounded-[30px] bg-gradient-to-br from-[#E8E8E8] to-[#D5D5D5] animate-pulse"
                                    />
                                ))
                            ) : filteredProjects.length === 0 ? (
                                // Empty state
                                <div className="w-full text-center text-white/60 py-20">
                                    <p className="text-lg">No portfolio items in this category.</p>
                                    <p className="text-sm mt-2">Add items from the admin panel.</p>
                                </div>
                            ) : (
                                // Portfolio Cards
                                filteredProjects.map((project, idx) => (
                                    <div
                                        key={project.id}
                                        className={`portfolio-card flex-shrink-0 ${activeIndex === idx ? 'active' : 'inactive'}`}
                                        onClick={() => centerItemAt(idx)}
                                    >
                                        <div className="w-[280px] h-[280px] lg:w-[380px] lg:h-[400px] rounded-[24px] lg:rounded-[30px] relative overflow-hidden group cursor-pointer transition-all duration-300">
                                            {/* Background Image or Gradient */}
                                            <div className="absolute inset-0">
                                                {project.image ? (
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-[#E8E8E8] to-[#D5D5D5]" />
                                                )}
                                            </div>

                                            {/* Overlay gradient for text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Border */}
                                            <div className="absolute inset-0 rounded-[24px] lg:rounded-[30px] border-[8px] lg:border-[10px] border-white/20"></div>

                                            {/* Company Label */}
                                            <div className="absolute top-6 lg:top-8 left-6 lg:left-8 flex items-center gap-3 z-10">
                                                <div className="w-[40px] lg:w-[54px] h-[1px] bg-white/50"></div>
                                                <span className="text-white/90 font-semibold text-xs lg:text-sm tracking-[-0.02em]">
                                                    {project.company}. {project.year}
                                                </span>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-6 lg:top-8 right-6 lg:right-8 z-10">
                                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-medium">
                                                    {project.category}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 right-6 lg:right-8 z-10">
                                                <h3 className="text-white font-semibold text-lg lg:text-xl leading-[1.35]">
                                                    {project.title}
                                                </h3>
                                                {project.description && (
                                                    <p className="text-white/60 text-sm mt-2 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-[24px] lg:rounded-[30px]"></div>
                                        </div>
                                    </div>
                                ))
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

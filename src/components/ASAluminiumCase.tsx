'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ASAluminiumCaseProps {
    project: {
        id: string;
        title: string;
        company: string;
        category: string;
        image: string;
        year: string;
        description?: string;
        gallery?: string[];
        link?: string;
    };
    isMobileView?: boolean;
}

export default function ASAluminiumCase({ project, isMobileView = false }: ASAluminiumCaseProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [activeSpec, setActiveSpec] = useState(0);
    const [animateDials, setAnimateDials] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Before/After Image references
    const galleryImages = project.gallery || [];
    const beforeImage = galleryImages[0] || project.image;
    const afterImage = galleryImages[1] || galleryImages[2] || project.image;

    useEffect(() => {
        setAnimateDials(true);
    }, []);

    // Drag handlers for the comparison slider
    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(percentage);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        if (e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    const specs = [
        { title: "Page Speed", before: "4.2s", after: "0.8s", percent: 80, color: "var(--md-sys-color-primary)", suffix: " Faster" },
        { title: "Brand Identity", before: "Legacy", after: "Upgraded", percent: 95, color: "var(--md-sys-color-tertiary)", suffix: " Modernized" },
        { title: "Mobile Traffic", before: "30%", after: "75%", percent: 150, color: "var(--md-sys-color-secondary)", suffix: " Increase" },
        { title: "Conversion Rate", before: "1.5%", after: "5.2%", percent: 246, color: "#22c55e", suffix: " Growth" },
    ];

    return (
        <div className="min-h-screen bg-[#07080B] text-[#F5F5F7] font-sans selection:bg-[var(--md-sys-color-primary)] selection:text-white pb-24">

            {/* Ambient metallic lighting */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/5 to-transparent rounded-full blur-[160px] pointer-events-none"></div>

            {/* Custom Header Back button */}
            <div className="container-custom pt-8 relative z-10 flex justify-between items-center">
                <Link
                    href={isMobileView ? "/mobile" : "/#portfolio"}
                    className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                    <span className="group-hover:-translate-x-1 transition-transform duration-300">&larr;</span>
                    <span className="text-sm font-semibold tracking-wide uppercase">Back to Portfolio</span>
                </Link>
                <div className="px-4 py-1.5 rounded-full bg-[var(--md-sys-color-primary)]/10 border border-[var(--md-sys-color-primary)]/20 text-[var(--md-sys-color-primary)] text-xs font-bold uppercase tracking-widest">
                    CMA UPGRADE SYSTEM
                </div>
            </div>

            {/* Immersive Hero Section */}
            <section className="container-custom pt-16 lg:pt-24 relative z-10">
                <div className="flex flex-col gap-8 max-w-4xl text-left">
                    <span className="text-[var(--md-sys-color-tertiary)] font-bold uppercase tracking-widest text-sm">
                        {project.category} &bull; CASE SHOWCASE
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] text-white">
                        AS For <span className="bg-gradient-to-r from-slate-200 via-slate-400 to-slate-100 bg-clip-text text-transparent">Aluminium</span>
                    </h1>
                    <p className="text-xl text-[var(--md-sys-color-on-surface-variant)] leading-relaxed max-w-3xl border-l-4 border-slate-500/40 pl-6 mt-4">
                        A comprehensive visual upgrade representing structural engineering excellence. We transformed AS For Aluminium's identity, digital catalog, and user interface into a sleek, metallic, high-performance experience, mirroring their premium product quality.
                    </p>
                </div>
            </section>

            {/* BEFORE/AFTER DRAG COMPARE SLIDER */}
            <section className="container-custom mt-20 lg:mt-28 relative z-10">
                <div className="flex flex-col gap-6 mb-10 text-left">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-white">Interactive Design Upgrade</h2>
                    <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm max-w-xl">
                        Drag the center slider handle left and right to compare the legacy layout with our brand-new sleek upgrade.
                    </p>
                </div>

                <div
                    ref={containerRef}
                    className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl select-none cursor-ew-resize"
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                >
                    {/* Before Image (Left Layer - bottom) */}
                    <div className="absolute inset-0">
                        <img
                            src={beforeImage}
                            alt="Before Upgrade"
                            className="w-full h-full object-cover filter grayscale brightness-50"
                        />
                        <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur rounded-lg text-xs font-bold text-slate-400 border border-white/5 uppercase tracking-widest">
                            Legacy Layout
                        </div>
                    </div>

                    {/* After Image (Right Layer - cropped top) */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPos}%` }}
                    >
                        <img
                            src={afterImage}
                            alt="After Upgrade"
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            style={{ width: containerRef.current ? containerRef.current.getBoundingClientRect().width : '100%' }}
                        />
                        <div className="absolute top-6 left-6 px-4 py-2 bg-[var(--md-sys-color-primary)]/80 backdrop-blur rounded-lg text-xs font-bold text-white border border-white/10 uppercase tracking-widest whitespace-nowrap shadow-lg">
                            New Upgrade
                        </div>
                    </div>

                    {/* Slider Line & Handle */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-white/60 cursor-ew-resize"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M17 12H7M7 12l4-4M7 12l4 4M17 12l-4-4M17 12l-4 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* UPGRADED PERFORMANCE SPECIFICATIONS GRID */}
            <section className="container-custom mt-24 lg:mt-36 relative z-10">
                <div className="flex flex-col gap-6 mb-16 text-left">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-white">Upgrade Metrics</h2>
                    <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm max-w-xl">
                        Performance optimizations applied during the redesign phase have vastly improved metrics across all channels.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {specs.map((spec, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveSpec(i)}
                            className={`glass-card hover-glow-border p-8 rounded-[28px] cursor-pointer text-left transition-all duration-300 ${activeSpec === i ? 'bg-white/5 border-[var(--md-sys-color-primary)]/40 shadow-xl scale-[1.03]' : 'bg-transparent'
                                }`}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
                                {spec.title}
                            </span>
                            <div className="flex items-baseline gap-2 mt-4">
                                <span className="text-4xl font-bold text-white">{spec.after}</span>
                                <span className="text-sm font-semibold line-through text-slate-500">{spec.before}</span>
                            </div>

                            {/* Meter Bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: animateDials ? `${Math.min(spec.percent, 100)}%` : '0%',
                                        backgroundColor: spec.color
                                    }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold block mt-3" style={{ color: spec.color }}>
                                {spec.suffix}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* GALLERY GRID */}
            {galleryImages.length > 2 && (
                <section className="container-custom mt-24 lg:mt-36 relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-12 text-left">Redesigned Asset Gallery</h2>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
                        {galleryImages.slice(2).map((img, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid glass-card hover-glow-border rounded-[24px] overflow-hidden p-3 bg-white/5 mb-8 group cursor-pointer transition-all duration-300"
                            >
                                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                                    <img
                                        src={img}
                                        alt={`AS Upgrade asset ${idx}`}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* TESTIMONIAL QUOTE */}
            <section className="container-custom mt-24 lg:mt-36 relative z-10">
                <div className="glass-card hover-glow-border rounded-[32px] p-8 lg:p-16 relative overflow-hidden bg-gradient-to-br from-slate-800/10 via-black/40 to-slate-900/10 border border-white/5 max-w-4xl mx-auto">
                    <div className="relative z-10 flex flex-col gap-6 text-center">
                        <span className="text-[var(--md-sys-color-primary)] text-6xl font-serif leading-none">“</span>
                        <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed italic">
                            The visual overhaul created by CMA completely redefined our presence. It reflects the structural precision and high performance of our aluminium designs. Customer response has been outstanding.
                        </p>
                        <div className="w-[80px] h-[1.5px] bg-slate-500/40 mx-auto mt-4"></div>
                        <div>
                            <h4 className="font-bold text-white text-lg">AS For Aluminium Board</h4>
                            <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm mt-1">Upgraded Identity Case Study</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

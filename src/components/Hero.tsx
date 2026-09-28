'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GeometricBackground from './GeometricBackground';
import MagneticButton from '@/components/MagneticButton';

// Custom hook for animated counting
const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTime: number | null = null;

                    const animate = (currentTime: number) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);

                        // Easing function for smooth animation (ease-out cubic)
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                        setCount(Math.floor(easeOutCubic * end));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return { count, ref };
};

const Hero = () => {
    const { count, ref: countRef } = useCountUp(230, 2000);
    return (
        <section className="bg-transparent pt-40 pb-24 relative overflow-hidden section-wrapper">
            {/* Ambient drifting background orbs */}
            <div className="ambient-orb ambient-orb-blue w-[500px] h-[500px] -left-32 -top-16 opacity-15"></div>
            <div className="ambient-orb ambient-orb-gold w-[400px] h-[400px] -right-32 bottom-8 opacity-10"></div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">

                    {/* Left Content */}
                    <div className="flex flex-col gap-8 pt-8 items-center text-center xl:items-start xl:text-left">
                        <h1 className="animate-on-load animate-fade-in-up text-5xl md:text-6xl lg:text-[72px] font-semibold text-[var(--md-sys-color-on-background)] leading-[1.15] tracking-[-0.03em] font-sans">
                            Stay Ahead with <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-secondary)] bg-clip-text text-transparent font-bold">Forward-Thinking</span> Digital Marketing
                        </h1>

                        <p className="animate-on-load animate-fade-in-up delay-200 text-white/70 text-base leading-[1.8] max-w-[557px] mx-auto xl:mx-0 font-sans">
                            Grow your brand faster with smart, data-driven strategies designed to keep you ahead of the competition and highlight your evolution.
                        </p>

                        {/* CTA Buttons */}
                        <div className="animate-on-load animate-fade-in-up delay-300 flex flex-wrap items-center justify-center xl:justify-start gap-4">
                            <Link
                                href="#contact"
                                className="bg-[var(--md-sys-color-primary)] text-white hover:bg-[var(--md-sys-color-primary)]/90 hover:scale-[1.05] active:scale-[0.97] transition-all duration-300 font-semibold px-8 py-3.5 rounded-full flex items-center gap-2.5 text-sm shadow-lg shadow-[var(--md-sys-color-primary)]/20 focus:outline-none"
                            >
                                <span>Schedule Call</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform duration-300">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <Link
                                href="#portfolio"
                                className="border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.05] active:scale-[0.97] transition-all duration-300 font-semibold px-8 py-3.5 rounded-full flex items-center gap-2.5 text-sm focus:outline-none"
                            >
                                <span>View Case Study</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Right Content - Cards Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">

                            {/* Top Left - Glass Card */}
                            <div className="animate-on-load animate-fade-in-scale delay-200 rounded-[28px] glass-card hover-glow-border h-[275px] relative overflow-hidden flex items-center justify-center">
                                <GeometricBackground pattern="marketing" position="center" opacity={0.6} className="w-[85%] h-[85%] text-[var(--md-sys-color-primary)]" />
                            </div>

                            {/* Top Right - Stats Card */}
                            <div className="animate-on-load animate-fade-in-scale delay-300 rounded-[28px] glass-card hover-glow-border p-8 flex flex-col justify-between h-[281px]">
                                <div className="flex flex-col gap-4">
                                    <span ref={countRef} className="text-[76px] font-bold text-white leading-none tracking-[-0.03em]">{count}+</span>
                                    <p className="text-white/60 text-sm leading-[1.6]">
                                        More than 230 businesses rely on us to grow their online presence.
                                    </p>
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="h-[6px] bg-white/10 rounded-full">
                                        <div className="h-full w-[67%] bg-[var(--md-sys-color-primary)] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom - Dark Card with Chart */}
                            <div className="animate-on-load animate-fade-in-up delay-400 col-span-2 rounded-[28px] glass-card hover-glow-border p-8 h-[216px] relative overflow-hidden">
                                <div className="relative z-10 flex justify-between h-full items-center">
                                    {/* Left Content */}
                                    <div className="flex flex-col justify-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-[40px] h-[1.5px] bg-[var(--md-sys-color-primary)]"></div>
                                            <span className="text-[var(--md-sys-color-primary)] text-xs font-bold uppercase tracking-wider">Growth Analytics</span>
                                        </div>
                                        <h3 className="text-white text-2xl font-semibold leading-[1.3] tracking-tight max-w-[280px]">
                                            Drive more traffic and product sales
                                        </h3>
                                    </div>

                                    {/* Right - Bar Chart */}
                                    <div className="flex items-end gap-3 pb-2 shrink-0">
                                        <div className="w-14 h-[80px] bg-[var(--md-sys-color-tertiary)] rounded-t-lg" style={{ animation: 'bar-bounce-1 4.5s ease-in-out infinite', transformOrigin: 'bottom' }}></div>
                                        <div className="w-14 h-[120px] bg-[var(--md-sys-color-primary)] rounded-t-lg" style={{ animation: 'bar-bounce-2 3.8s ease-in-out infinite', transformOrigin: 'bottom' }}></div>
                                        <div className="w-14 h-[150px] bg-[var(--md-sys-color-secondary)] rounded-t-lg" style={{ animation: 'bar-bounce-3 4.2s ease-in-out infinite', transformOrigin: 'bottom' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

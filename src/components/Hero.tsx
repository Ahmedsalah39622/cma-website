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
        <section className="bg-white pt-48 pb-28 relative overflow-hidden section-wrapper hero-offset">
            <GeometricBackground pattern="mesh" position="right" opacity={0.06} className="text-[#183B73]" />
            <div className="container-custom">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">

                    {/* Left Content */}
                    <div className="flex flex-col gap-8 pt-8 items-center text-center xl:items-start xl:text-left">
                        <h1 className="animate-on-load animate-fade-in-up text-5xl md:text-6xl lg:text-[72px] font-semibold text-[#020B1C] leading-[1.1] tracking-[-0.03em]">
                            Stay Ahead with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#183B73] to-[#FFB800]">Forward-Thinking</span> Digital Marketing
                        </h1>

                        <p className="animate-on-load animate-fade-in-up delay-200 text-[#183B73]/70 text-base leading-[1.8] max-w-[557px] mx-auto xl:mx-0">
                            Grow your brand faster with smart, data-driven strategies designed to keep you ahead of the competition. </p>

                        {/* CTA Buttons */}
                        {/* CTA Buttons */}
                        {/* Added padding and negative margin to prevent glow clipping without affecting layout */}
                        <div className="animate-on-load animate-fade-in-up delay-300 flex flex-wrap items-center justify-center xl:justify-start gap-8 md:gap-14 p-8 -m-8">
                            <MagneticButton>
                                <div className="relative group/btn z-10">
                                    {/* Rotating Border Beam - increased size */}
                                    <div className="absolute -inset-1 rounded-full overflow-hidden">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#FFB800_360deg)] animate-spin-slow opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    {/* Static Glow Backing - Larger and stronger */}
                                    <div className="absolute -inset-4 rounded-full bg-[#FFB800] blur-2xl opacity-0 group-hover/btn:opacity-50 transition duration-500 will-change-transform"></div>

                                    <Link
                                        href="#contact"
                                        className="relative btn bg-[#020B1C] text-white hover:bg-[#183B73] btn-lg inline-flex items-center gap-3 shadow-xl hover:shadow-[#FFB800]/20 transition-all duration-300 pointer-events-none overflow-hidden"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            Schedule Call
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
                                    </Link>
                                </div>
                            </MagneticButton>

                            <Link href="#portfolio" className="group flex items-center gap-2 text-[#020B1C] font-semibold hover:text-[#FFB800] transition-colors">
                                <span className="border-b border-[#020B1C] group-hover:border-[#FFB800] transition-colors">View Case Study</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>


                    </div>

                    {/* Right Content - Cards Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">

                            {/* Top Left - Glass Card */}
                            <div className="animate-on-load animate-fade-in-scale delay-200 card card-glass rounded-[1000px_20px_20px_20px] h-[275px] relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-300/30"></div>
                                <GeometricBackground pattern="marketing" position="center" opacity={0.8} className="w-[80%] h-[80%] text-[#183B73]" />
                            </div>

                            {/* Top Right - Stats Card */}
                            <div className="animate-on-load animate-fade-in-scale delay-300 card card-glass rounded-[20px] flex flex-col justify-between h-[281px]">
                                <div className="flex flex-col gap-4">
                                    <span ref={countRef} className="text-[84px] font-bold text-[#010205] leading-none tracking-[-0.03em]">{count}+</span>
                                    <p className="text-[#5C5D5F] text-base leading-[1.5]">
                                        More than 230 businesses rely on us to grow their online presence.
                                    </p>
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="h-[6px] bg-[#D9D9D9] rounded-full">
                                        <div className="h-full w-[67%] bg-[#010205] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom - Dark Card with Chart */}
                            <div className="animate-on-load animate-fade-in-up delay-400 col-span-2 card card-dark rounded-[20px] h-[216px] relative overflow-hidden">
                                {/* Background Effect */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl -right-40 -top-40 rotate-[115deg]"></div>
                                </div>

                                <div className="relative z-10 flex justify-between h-full">
                                    {/* Left Content */}
                                    <div className="flex flex-col justify-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-[54px] h-[1px] bg-white"></div>
                                            <span className="text-white text-sm font-semibold tracking-[-0.03em]">Drive More Traffic and Sales</span>
                                        </div>
                                        <h3 className="text-white text-[32px] font-semibold leading-[1.3] tracking-[-0.02em] max-w-[280px]">
                                            Drive more traffic and product sales
                                        </h3>
                                    </div>

                                    {/* Right - Bar Chart */}
                                    <div className="flex items-end gap-2.5 pb-4">
                                        <div className="w-[69px] h-[95px] bg-gradient-to-t from-[#B8860B] to-[#E6C35C] rounded-t-lg" style={{ animation: 'bar-bounce-1 4.5s ease-in-out infinite', transformOrigin: 'bottom' }}></div>
                                        <div className="w-[69px] h-[136px] bg-gradient-to-t from-[#D4AF37] to-[#FFD700] rounded-t-lg" style={{ animation: 'bar-bounce-2 3.8s ease-in-out infinite', transformOrigin: 'bottom' }}></div>
                                        <div className="w-[69px] h-[166px] bg-gradient-to-t from-[#B8860B] to-[#D4AF37] rounded-t-lg" style={{ animation: 'bar-bounce-3 4.2s ease-in-out infinite', transformOrigin: 'bottom' }}></div>
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

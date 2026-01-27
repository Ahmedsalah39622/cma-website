'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GeometricBackground from './GeometricBackground';

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
        <section className="bg-white pt-36 pb-28 relative overflow-hidden section-wrapper hero-offset">
            <GeometricBackground pattern="mesh" position="right" opacity={0.06} className="text-[#183B73]" />
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Content */}
                    <div className="flex flex-col gap-8 pt-8">
                        <h1 className="animate-on-load animate-fade-in-up text-5xl md:text-6xl lg:text-[72px] font-semibold text-[#020B1C] leading-[1.1] tracking-[-0.03em]">
                            Stay Ahead with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#183B73] to-[#FFB800]">Forward-Thinking</span> Digital Marketing
                        </h1>

                        <p className="animate-on-load animate-fade-in-up delay-200 text-[#183B73]/70 text-base leading-[1.8] max-w-[557px]">
                            Grow your brand faster with smart, data-driven strategies designed to keep you ahead of the competition. </p>

                        {/* CTA Buttons */}
                        <div className="animate-on-load animate-fade-in-up delay-300 flex flex-wrap items-center gap-8 md:gap-14">
                            <Link
                                href="#contact"
                                className="btn bg-[#020B1C] text-white hover:bg-[#183B73] btn-lg inline-flex items-center gap-3 shadow-xl hover:shadow-[#FFB800]/20 transition-all duration-300"
                            >
                                Schedule Call
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <Link href="#portfolio" className="group flex items-center gap-2 text-[#020B1C] font-semibold hover:text-[#FFB800] transition-colors">
                                <span className="border-b border-[#020B1C] group-hover:border-[#FFB800] transition-colors">View Case Study</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>

                        {/* Trusted By */}
                        <div className="animate-on-load animate-fade-in-up delay-400 flex flex-wrap items-center gap-8 md:gap-16 mt-8 pt-8 border-t border-gray-100">
                            <span className="text-[#010205] font-semibold text-sm leading-[1.6] max-w-[150px]">
                                Trusted by the world&apos;s biggest brands
                            </span>
                            <div className="trusted-brands">
                                {[
                                    {
                                        name: 'Facebook', svg: (
                                            <svg viewBox="0 0 24 24" className="brand-icon" role="img" aria-hidden="true">
                                                <path fill="#1877F2" d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.406.593 24 1.325 24H12.82v-9.294H9.692V11.08h3.128V8.414c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.463.1 2.795.144v3.24l-1.918.001c-1.504 0-1.795.714-1.795 1.762v2.313h3.587l-.467 3.626h-3.12V24h6.116C23.407 24 24 23.406 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'TikTok', svg: (
                                            <Image src="https://th.bing.com/th/id/OIP.yzq8Fw2yOTB8dZqdvdbNQQHaEn?w=303&h=189&c=7&r=0&o=7&pid=1.7&rm=3" alt="TikTok" width={32} height={32} className="brand-icon" />
                                        )
                                    },
                                    {
                                        name: 'YouTube', svg: (
                                            <svg viewBox="0 0 24 24" className="brand-icon" role="img" aria-hidden="true">
                                                <path d="M23.498 6.186a3.04 3.04 0 0 0-2.14-2.15C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.358.536A3.04 3.04 0 0 0 .502 6.186 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .502 5.814 3.04 3.04 0 0 0 2.14 2.15C4.4 20.5 12 20.5 12 20.5s7.6 0 9.358-.536a3.04 3.04 0 0 0 2.14-2.15A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.502-5.814z" fill="#FF0000" />
                                                <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'Google', svg: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" className="brand-icon" role="img" aria-hidden="true">
                                                <path fill="#4285F4" d="M21.35 11.1h-9.1v2.8h5.36c-.46 2.17-2.24 3.73-4.6 3.73-2.77 0-5.02-2.22-5.02-4.97 0-2.76 2.25-4.98 5.02-4.98 1.38 0 2.63.52 3.58 1.39l2.03-2.03C16.2 5.4 14.28 4.5 12 4.5 7.6 4.5 4 8.1 4 12.9s3.6 8.4 8 8.4c4.8 0 7.5-3.4 7.5-8.2 0-.55-.05-1.06-.15-1.99z" />
                                                <path fill="#34A853" d="M6.4 14.8c-.4-1.4-.4-2.9 0-4.3L4.1 8.1C3.2 9.9 2.8 11.9 2.8 13.9c0 2 .4 4 1.3 5.8l2.3-3z" />
                                                <path fill="#FBBC05" d="M12 4.5c1.4 0 2.7.5 3.7 1.4l-2.7 2.7C13.8 8 13 7.6 12 7.6c-2.6 0-4.8 1.8-5.6 4.2l-2.3-1.8C5 6.9 8.6 4.5 12 4.5z" />
                                                <path fill="#EA4335" d="M17.6 18.4c-1.1.9-2.6 1.5-4.6 1.5-3.4 0-6.2-2.1-7.3-5.1l-2.3 1.8C5.9 21 9.3 23 13 23c3.9 0 6.9-1.9 8.9-4.6l-4.3-0.0z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'Twitter', svg: (
                                            <svg viewBox="0 0 24 24" className="brand-icon" role="img" aria-hidden="true">
                                                <path d="M23 4.56c-.77.34-1.6.57-2.46.67a4.3 4.3 0 0 0 1.88-2.37 8.66 8.66 0 0 1-2.73 1.05 4.31 4.31 0 0 0-7.36 3.93A12.22 12.22 0 0 1 3.15 3.15a4.31 4.31 0 0 0 1.33 5.74 4.27 4.27 0 0 1-1.95-.54v.05a4.31 4.31 0 0 0 3.46 4.22 4.34 4.34 0 0 1-1.95.07 4.32 4.32 0 0 0 4.03 2.99A8.64 8.64 0 0 1 1.5 19.54 12.18 12.18 0 0 0 7.29 21c8.69 0 13.45-7.2 13.45-13.45v-.61A9.6 9.6 0 0 0 23 4.56z" fill="#1DA1F2" />
                                            </svg>
                                        )
                                    }
                                ].map(b => (
                                    <div key={b.name} className="brand-item">
                                        {b.svg}
                                        <div className="text-2xl font-bold text-black/80">{b.name}</div>
                                    </div>
                                ))}

                            </div>
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

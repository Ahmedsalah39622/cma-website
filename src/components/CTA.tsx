'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';
import MagneticButton from '@/components/MagneticButton';

export default function CTA() {
    return (
        <section className="py-8 lg:py-12 section-wrapper">
            <div className="mx-4 bg-gradient-to-br from-[#020B1C] via-[#0A1A38] to-[#183B73] rounded-[30px] py-16 lg:py-24 relative overflow-hidden group">
                <GeometricBackground pattern="lines" position="full" opacity={0.1} color="#FFB800" />

                {/* Background Effect - Animated Pulse */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute w-[2000px] h-[1400px] bg-gradient-to-tl from-[#FFB800]/20 to-[#183B73]/30 rounded-full blur-3xl -right-[400px] -top-[400px] animate-pulse-soft"></div>
                </div>

                {/* Animated Gold Accent Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFB800] to-transparent rounded-full shadow-[0_0_20px_rgba(255,184,0,0.8)] animate-pulse"></div>

                <ScrollReveal className="container-custom relative z-10">
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
                        <div className="relative">
                            <h2 className="scroll-visible animate-fade-in-left text-4xl md:text-5xl lg:text-7xl xl:text-[80px] font-semibold text-white leading-[1.3] tracking-[-0.03em] text-center xl:text-left drop-shadow-2xl">
                                Ready to work with us ?
                            </h2>
                            {/* Subtle text underline decoration */}
                            <div className="hidden xl:block absolute -bottom-4 left-0 w-24 h-2 bg-[#FFB800] rounded-full animate-width-grow"></div>
                        </div>

                        <MagneticButton strength={40} className="relative z-20">
                            <div className="relative group/btn">
                                {/* Button Glow Effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB800] to-[#D4AF37] rounded-full blur opacity-40 group-hover/btn:opacity-75 transition duration-500 group-hover/btn:duration-200 animate-tilt"></div>

                                <Link
                                    href="#contact"
                                    className="relative scroll-visible animate-fade-in-right delay-200 btn bg-gradient-to-r from-[#FFB800] to-[#D4AF37] text-[#020B1C] font-bold btn-lg inline-flex items-center gap-3 flex-shrink-0 shadow-[0_0_30px_rgba(255,184,0,0.3)] transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Get Started
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>

                                    {/* Shimmer Effect Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
                                </Link>
                            </div>
                        </MagneticButton>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}


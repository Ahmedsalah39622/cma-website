'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';
import { ServiceIcons } from '@/context/ServicesContext';

interface Service {
    id: string;
    title: string;
    count: string;
    iconType: string;
}

interface ServicesProps {
    services?: Service[];
    moreCount?: number;
    moreOptionsText?: string;
}

export default function Services({ services = [], moreCount = 0, moreOptionsText = 'More Options' }: ServicesProps) {
    // No loading state needed as data is passed from server

    return (
        <section id="services" className="py-20 lg:py-40 mt-16 lg:mt-32 bg-transparent relative overflow-hidden section-wrapper pb-24 lg:pb-32">
            {/* Geometric Background Shape */}
            <GeometricBackground pattern="waves" position="right" opacity={0.05} color="#fff" />
            <div className="ambient-orb ambient-orb-blue w-[400px] h-[400px] -right-32 top-16 opacity-10"></div>

            <ScrollReveal className="site-container content relative z-10">
                <div className="text-center mb-12 lg:mb-24">
                    <h5 className="scroll-visible animate-fade-in-up text-sm font-bold tracking-[0.2em] uppercase mb-4 text-[var(--md-sys-color-tertiary)]">OUR SERVICES</h5>
                    <h2 className="scroll-visible animate-fade-in-up delay-200 text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--md-sys-color-on-background)] leading-tight">
                        Save Time Managing Your Business<br />
                        With Our <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] via-[var(--md-sys-color-secondary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent font-bold">Best Services</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-10">
                    {services.map((service, idx) => (
                        <div key={service.id} className="scroll-visible animate-fade-in-up group glass-card hover-glow-border p-8 rounded-[28px] text-center xl:text-left flex flex-col items-center xl:items-start h-full" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[var(--md-sys-color-primary)] mb-8 group-hover:bg-[var(--md-sys-color-primary)] group-hover:text-white group-hover:scale-110 transition-all duration-300 border border-white/10 shadow-sm">
                                {ServiceIcons[service.iconType as keyof typeof ServiceIcons] || ServiceIcons['grid']}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--md-sys-color-on-surface)] mb-3 leading-tight group-hover:text-[var(--md-sys-color-primary)] transition-colors">{service.title}</h3>
                            <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm mt-auto font-medium">{service.count}</p>
                        </div>
                    ))}

                    {/* '+More' Card - M3 Tonal Card with Apple HIG glass */}
                    {moreCount > 0 && (
                        <div className="glass-card hover-glow-border text-white flex flex-col justify-center items-center text-center p-8 h-full cursor-pointer relative overflow-hidden group rounded-[28px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--md-sys-color-tertiary)]/10 rounded-bl-full transition-transform group-hover:scale-110 duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--md-sys-color-tertiary)]/10 rounded-tr-full transition-transform group-hover:scale-110 duration-500"></div>

                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                <h3 className="text-6xl font-bold mb-2 bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent">+{moreCount}</h3>
                                <h3 className="text-3xl font-bold mb-4">More</h3>
                                <p className="text-[var(--md-sys-color-on-tertiary-container)] text-sm font-medium bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">{moreOptionsText}</p>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollReveal>
        </section>
    );
}

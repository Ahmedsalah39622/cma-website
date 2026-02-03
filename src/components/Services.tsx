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
        <section id="services" className="py-20 lg:py-40 mt-16 lg:mt-32 bg-white relative overflow-hidden section-wrapper pb-24 lg:pb-32">
            {/* Geometric Background Shape */}
            <GeometricBackground pattern="waves" position="right" opacity={0.05} color="#000" />

            <ScrollReveal className="site-container content relative z-10">
                <div className="text-center mb-12 lg:mb-24">
                    <h5 className="scroll-visible animate-fade-in-up text-sm font-bold tracking-[0.2em] uppercase mb-4 text-[#D4AF37]">OUR SERVICES</h5>
                    <h2 className="scroll-visible animate-fade-in-up delay-200 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Save Time Managing Your Business<br />
                        With Our Best Services
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-10">
                    {services.map((service, idx) => (
                        <div key={service.id} className="scroll-visible animate-fade-in-up group card service-card hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 text-center xl:text-left flex flex-col items-center xl:items-start h-full" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-800 mb-8 group-hover:bg-[#4169E1] group-hover:text-white transition-colors duration-300 shadow-sm">
                                {ServiceIcons[service.iconType as keyof typeof ServiceIcons] || ServiceIcons['grid']}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#4169E1] transition-colors">{service.title}</h3>
                            <p className="text-gray-400 text-sm mt-auto font-medium">{service.count}</p>
                        </div>
                    ))}

                    {/* '+More' Card */}
                    {moreCount > 0 && (
                        <div className="card card-accent text-white flex flex-col justify-center items-center text-center h-full cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full transition-transform group-hover:scale-110 duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-tr-full transition-transform group-hover:scale-110 duration-500"></div>

                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                <h3 className="text-6xl font-bold mb-2">+{moreCount}</h3>
                                <h3 className="text-3xl font-bold mb-4">More</h3>
                                <p className="text-white/80 text-sm font-medium bg-white/20 px-4 py-1 rounded-full">{moreOptionsText}</p>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollReveal>
        </section>
    );
}

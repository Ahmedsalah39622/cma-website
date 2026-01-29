'use client';

import React from 'react';
import GeometricBackground from './GeometricBackground';
import ScrollReveal from './ScrollReveal';

interface Brand {
    id: string;
    name: string;
    image: string;
    imageUrl?: string;
}

interface BrandsProps {
    brands?: Brand[];
}

export default function Brands({ brands = [] }: BrandsProps) {
    // Normalization if needed, though simple map works
    const brandList = brands.map(b => ({
        ...b,
        image: b.imageUrl || b.image
    }));
    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden section-wrapper">
            {/* Geometric Background Shape - Subtle */}
            <GeometricBackground pattern="circles" position="left" opacity={0.03} color="#000" />

            <ScrollReveal className="site-container relative z-10">
                <div className="text-center mb-16">
                    <h5 className="scroll-visible animate-fade-in-up text-sm font-bold tracking-[0.2em] uppercase mb-4 text-[#D4AF37]">TRUSTED PARTNERS</h5>
                    <h2 className="scroll-visible animate-fade-in-up delay-200 text-4xl md:text-5xl lg:text-6xl font-bold text-[#010205] leading-tight">
                        Brands We Worked With
                    </h2>
                </div>

                <div className="relative fade-mask-x pause-on-hover group">
                    {/* Marquee Container */}
                    <div className="flex gap-12 md:gap-24 overflow-hidden py-10">
                        {/* First Loop */}
                        <div className="flex gap-12 md:gap-24 animate-marquee min-w-full items-center justify-around">
                            {brandList.map((brand, idx) => (
                                <div key={`${brand.id}-1`} className="flex flex-col items-center gap-4 group cursor-default select-none transition-transform hover:scale-110 duration-300">
                                    <div className="relative w-12 h-12 md:w-20 md:h-20 filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500">
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-full object-contain pointer-events-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Second Loop (Duplicate for seamless scroll) */}
                        <div className="flex gap-12 md:gap-24 animate-marquee min-w-full items-center justify-around" aria-hidden="true">
                            {brandList.map((brand, idx) => (
                                <div key={`${brand.id}-2`} className="flex flex-col items-center gap-4 group cursor-default select-none transition-transform hover:scale-110 duration-300">
                                    <div className="relative w-12 h-12 md:w-20 md:h-20 filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500">
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-full object-contain pointer-events-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Third Loop (To ensure coverage on large screens) */}
                        <div className="flex gap-12 md:gap-24 animate-marquee min-w-full items-center justify-around" aria-hidden="true">
                            {brands.map((brand, idx) => (
                                <div key={`${brand.id}-3`} className="flex flex-col items-center gap-4 group cursor-default select-none transition-transform hover:scale-110 duration-300">
                                    <div className="relative w-12 h-12 md:w-20 md:h-20 filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500">
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-full object-contain pointer-events-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}

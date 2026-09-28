'use client';

import React, { useState } from 'react';
import GeometricBackground from './GeometricBackground';

import { useFAQs } from '@/context/FAQContext';

export default function FAQ() {
    const { faqs } = useFAQs();
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-8 lg:py-12 section-wrapper">
            <div className="mx-4 glass-card hover-glow-border py-20 lg:py-24 px-8 lg:px-20 relative overflow-hidden rounded-[32px] bg-[rgba(10,12,18,0.5)]">
                <GeometricBackground pattern="marketing" position="right" opacity={0.04} className="text-white" />
                <div className="flex flex-col xl:flex-row gap-16 lg:gap-24 relative z-10">

                    {/* Left Column */}
                    <div className="lg:w-[531px] flex flex-col gap-12 items-center text-center xl:items-start xl:text-left mx-auto xl:mx-0">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl md:text-5xl font-semibold text-[var(--md-sys-color-on-background)] leading-[1.3] tracking-[-0.03em]">
                                Digital Marketing <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-secondary)] bg-clip-text text-transparent font-bold">FAQs</span>
                            </h2>
                            <p className="text-[var(--md-sys-color-on-surface-variant)]/80 text-base leading-[1.8]">
                                As a leading digital marketing agency, we are dedicated to providing comprehensive educational resources and answering frequently asked questions to help our clients.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-6">
                            <a href="#contact" className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 font-semibold px-6 py-3 rounded-full flex items-center gap-2.5 text-sm focus:outline-none text-white hover:scale-105 active:scale-[0.97]">
                                More Questions
                            </a>
                            <a href="#contact" className="text-[var(--md-sys-color-primary)] font-semibold hover:text-[var(--md-sys-color-primary)]/80 hover:translate-x-1 transition-all duration-300">
                                Contact Us &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Accordion */}
                    <div className="flex-1">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border-b border-[var(--md-sys-color-outline-variant)] ${index === 0 ? 'border-t' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="w-full flex justify-between items-center py-6 px-4 text-left gap-8 cursor-pointer group"
                                >
                                    <span className="text-[var(--md-sys-color-on-surface)] font-semibold text-lg lg:text-xl leading-[1.5] tracking-[-0.02em] group-hover:text-[var(--md-sys-color-primary)] transition-colors">
                                        {faq.question}
                                    </span>
                                    <span className={`transition-transform duration-200 text-white/50 group-hover:text-white shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </button>

                                {openIndex === index && (
                                    <div className="px-4 pb-6 animate-fade-in-down">
                                        <p className="text-[var(--md-sys-color-on-surface-variant)]/70 text-base leading-[1.8]">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

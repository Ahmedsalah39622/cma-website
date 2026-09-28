'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';

import { useBlog } from '@/context/BlogContext';

export default function Blog() {
    const { posts } = useBlog();
    return (
        <section className="py-24 lg:py-32 bg-transparent section-wrapper relative overflow-hidden">
            <GeometricBackground pattern="waves" position="right" opacity={0.05} color="#4169E1" />
            <ScrollReveal className="container-custom relative z-10">
                {/* Header */}
                <div className="flex flex-col xl:flex-row justify-between items-center xl:items-start gap-8 lg:gap-[73px] mb-16 text-center xl:text-left">
                    <h2 className="scroll-visible animate-fade-in-up text-4xl md:text-5xl font-semibold text-[var(--md-sys-color-on-background)] leading-[1.3] tracking-[-0.03em] max-w-[684px]">
                        Digital Marketing & SEO Services That <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-secondary)] bg-clip-text text-transparent font-bold">Grow Traffic</span>
                    </h2>
                    <div className="scroll-visible animate-fade-in-up delay-200 flex flex-col gap-6 max-w-[557px]">
                        <p className="text-[var(--md-sys-color-on-surface-variant)] text-base leading-[1.8]">
                            We are the top digital marketing agency for branding corp. We offer a full range of services to help clients improve their search rankings, drive more traffic, and highlight their evolution.
                        </p>
                        <a href="#portfolio" className="self-center xl:self-start bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.05] active:scale-[0.97] transition-all duration-300 font-semibold px-6 py-3 rounded-full flex items-center gap-2.5 text-sm focus:outline-none text-white">
                            See more
                        </a>
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((article, idx) => (
                        <div
                            key={article.id}
                            className="scroll-visible animate-fade-in-up glass-card hover-glow-border rounded-[28px] p-8 flex flex-col gap-8 bg-[rgba(18,20,26,0.6)] text-left"
                            style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
                        >
                            {/* Meta */}
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div
                                        className="w-[14px] h-[14px] rounded-full animate-pulse"
                                        style={{ backgroundColor: article.color }}
                                    ></div>
                                    <span className="text-[var(--md-sys-color-on-surface-variant)] text-sm">{article.readTime}</span>
                                </div>

                                <h3 className="text-[var(--md-sys-color-on-surface)] font-semibold text-2xl leading-[1.5] tracking-[-0.03em] group-hover:text-[var(--md-sys-color-primary)] transition-colors">
                                    {article.title}
                                </h3>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center gap-4 mt-auto">
                                <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm leading-[1.6] flex-1">
                                    {article.excerpt}
                                </p>
                                <Link
                                    href="#"
                                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border border-white/10 bg-white/5 text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)] hover:text-white hover:scale-110"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollReveal>
        </section>
    );
}

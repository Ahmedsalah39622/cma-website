'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';

import { useBlog } from '@/context/BlogContext';

export default function Blog() {
    const { posts } = useBlog();
    return (
        <section className="py-24 lg:py-32 bg-[#FFFFFF] section-wrapper relative overflow-hidden">
            <GeometricBackground pattern="waves" position="right" opacity={0.05} color="#4169E1" />
            <ScrollReveal className="container-custom relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-[73px] mb-16">
                    <h2 className="scroll-visible animate-fade-in-up text-4xl md:text-5xl font-semibold text-[#010205] leading-[1.3] tracking-[-0.03em] max-w-[684px]">
                        Digital Marketing & SEO Services That Grow Traffic & Increase Revenue
                    </h2>
                    <div className="scroll-visible animate-fade-in-up delay-200 flex flex-col gap-6 max-w-[557px]">
                        <p className="text-[#878C91] text-base leading-[1.8]">
                            We are the top digital marketing agency for branding corp. We offer a full range of services to help clients improve their search engine rankings and drive more traffic to their websites.
                        </p>
                        <button className="self-start px-6 py-4 border border-[#010205] rounded-full font-bold text-base font-[Manrope] hover:bg-[#010205] hover:text-white transition-all">
                            See more
                        </button>
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((article, idx) => (
                        <div
                            key={article.id}
                            className="scroll-visible animate-fade-in-up bg-white rounded-[20px] p-8 flex flex-col gap-8"
                            style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
                        >
                            {/* Meta */}
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div
                                        className="w-[14px] h-[14px] rounded-full"
                                        style={{ backgroundColor: article.color }}
                                    ></div>
                                    <span className="text-[#878C91] text-sm">{article.readTime}</span>
                                </div>

                                <h3 className="text-[#010205] font-semibold text-2xl leading-[1.5] tracking-[-0.03em]">
                                    {article.title}
                                </h3>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center gap-4 mt-auto">
                                <p className="text-[#878C91] text-sm leading-[1.6] flex-1">
                                    {article.excerpt}
                                </p>
                                <Link
                                    href="#"
                                    className="w-[56px] h-[56px] lg:w-[88px] lg:h-[56px] rounded-full flex items-center justify-center transition-all flex-shrink-0 border border-[#010205] hover:bg-[#010205] hover:text-white"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:stroke-white">
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

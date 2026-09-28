'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    imageUrl?: string; // Handle both
    bgColor?: string;
}

interface TeamProps {
    teamMembers?: TeamMember[];
}

export default function Team({ teamMembers = [] }: TeamProps) {
    // If no data is passed (e.g. loading or empty), we can show skeletons or return null
    // But since we will fetch on server, we expect data.
    // Normalized members for render
    const members = teamMembers.map(m => ({
        ...m,
        image: m.imageUrl || m.image, // Prefer imageUrl if consistent with DB
        id: m.id
    }));

    return (
        <section id="team" className="py-24 lg:py-32 bg-transparent section-wrapper overflow-hidden">
            <ScrollReveal className="container-custom">
                {/* Header */}
                <div className="scroll-visible animate-fade-in-up text-center mb-20 lg:mb-28">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--md-sys-color-on-background)] tracking-tight">
                        Meet Our <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-secondary)] bg-clip-text text-transparent font-bold">Creative Mindset</span>
                    </h2>
                    <p className="text-[var(--md-sys-color-on-surface-variant)] text-lg mt-6 max-w-2xl mx-auto">
                        The talented people behind our success and continuous upgrade
                    </p>
                </div>

                {/* Team Grid */}
                <div className="scroll-visible animate-fade-in-up delay-200 flex flex-wrap justify-center gap-8 lg:gap-12">
                    {members.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No team members added yet.</p>
                            <p className="text-gray-300 text-sm mt-2">Add members from the admin panel.</p>
                        </div>
                    ) : (
                        members.map((member, index) => (
                            <div
                                key={member.id}
                                className="group flex flex-col items-center"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card with curved bottom - M3 styled */}
                                <div
                                    className="relative w-[200px] lg:w-[240px] h-[280px] lg:h-[340px] rounded-t-full rounded-b-[28px] overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:-translate-y-2 shadow-[0_8px_24px_rgba(0,0,0,0.3)] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] border border-white/5"
                                    style={{ backgroundColor: member.bgColor || '#1E1F22' }}
                                >
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-30">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Name & Role */}
                                <div className="mt-6 text-center">
                                    <h3 className="text-[var(--md-sys-color-on-background)] font-semibold text-lg lg:text-xl group-hover:text-[var(--md-sys-color-primary)] transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm lg:text-base mt-1">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollReveal>
        </section>
    );
}

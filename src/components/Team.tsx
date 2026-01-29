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
        <section id="team" className="py-24 lg:py-32 bg-white section-wrapper overflow-hidden">
            <ScrollReveal className="container-custom">
                {/* Header */}
                <div className="scroll-visible animate-fade-in-up text-center mb-20 lg:mb-28">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#010205] tracking-tight">
                        Meet Our Team
                    </h2>
                    <p className="text-[#666] text-lg mt-6 max-w-2xl mx-auto">
                        The talented people behind our success
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
                                {/* Card with curved bottom */}
                                <div
                                    className="relative w-[200px] lg:w-[240px] h-[280px] lg:h-[340px] rounded-t-[100px] rounded-b-[40px] overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2"
                                    style={{ backgroundColor: member.bgColor || '#FFE4C4' }}
                                >
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover object-top"
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Name & Role */}
                                <div className="mt-6 text-center">
                                    <h3 className="text-[#010205] font-semibold text-lg lg:text-xl">
                                        {member.name}
                                    </h3>
                                    <p className="text-[#888] text-sm lg:text-base mt-1">
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

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MobileNotice() {
    const [isMobile, setIsMobile] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // Check screen width (under 1024px is considered mobile/tablet)
            setIsMobile(window.innerWidth < 1024);
            setIsChecked(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Don't render anything until we've checked
    if (!isChecked) return null;

    // Show notice only on mobile
    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] flex items-center justify-center p-6">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative text-center max-w-md">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-[12px_12px_40px_12px] flex items-center justify-center shadow-2xl shadow-[#FFD700]/20">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/logo.png"
                                alt="CMA Logo"
                                fill
                                className="object-contain brightness-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                    Mobile Version
                    <span className="block text-[#FFD700] mt-1">Coming Soon</span>
                </h1>

                {/* Message */}
                <p className="text-white/60 text-lg leading-relaxed mb-8">
                    We&apos;re working hard to bring you an amazing mobile experience.
                    For now, please visit us from a <span className="text-white font-semibold">laptop</span> or <span className="text-white font-semibold">desktop computer</span>.
                </p>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
                    <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                    <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                    <span className="text-white/50 text-sm font-medium">In Development</span>
                </div>
            </div>
        </div>
    );
}

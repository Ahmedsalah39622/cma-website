'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function MobileNotice() {
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

    useEffect(() => {
        const checkAndRedirect = () => {
            // Skip if user explicitly requested desktop
            if (searchParams?.get('force') === 'desktop') {
                return;
            }

            // Skip if already on mobile page, admin pages, OR project pages
            if (pathname.startsWith('/mobile') || pathname.startsWith('/admin') || pathname.startsWith('/project')) {
                return;
            }

            // Check if device is mobile (screen width under 1024px)
            const isMobileScreen = window.innerWidth < 1024;

            // Check user agent for mobile devices
            const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Also check for touch capability as additional signal
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            // Redirect if:
            // 1. Mobile user agent detected (definitely a mobile device)
            // 2. OR small screen + touch device (likely a tablet or mobile)
            if (mobileUserAgent || (isMobileScreen && isTouchDevice)) {
                router.replace('/mobile');
            }
        };

        // Small delay to ensure proper detection
        const timer = setTimeout(checkAndRedirect, 100);

        return () => clearTimeout(timer);
    }, [pathname, router]);

    // Don't render anything - this component only handles redirection
    return null;
}

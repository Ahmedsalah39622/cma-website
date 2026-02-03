'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(pointer: fine)');
        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsVisible(e.matches);
        };

        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaChange);

        const cursor = cursorRef.current;

        // Direct position update for instant, zero-lag response (144Hz feel)
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                // Centering the 40px circle (radius 20)
                // Using transform3d forces GPU acceleration
                cursorRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer');

            if (isInteractable) {
                cursorRef.current?.classList.add('scale-150');
                cursorRef.current?.classList.add('border-2');
                cursorRef.current?.classList.add('bg-white/10');
                cursorRef.current?.classList.remove('mix-blend-difference');
                cursorRef.current?.classList.add('border-[#FFB800]'); // Gold tint
            } else {
                cursorRef.current?.classList.remove('scale-150');
                cursorRef.current?.classList.remove('border-2');
                cursorRef.current?.classList.remove('bg-white/10');
                cursorRef.current?.classList.add('mix-blend-difference');
                cursorRef.current?.classList.remove('border-[#FFB800]');
            }
        };

        if (isVisible) {
            // "passive: true" improves scroll performance
            // We use direct event listener instead of requestAnimationFrame loop for lowest latency
            window.addEventListener('mousemove', moveCursor, { passive: true });
            window.addEventListener('mouseover', handleMouseOver, { passive: true });
        }

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-10 h-10 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-100 ease-out"
            style={{
                willChange: 'transform',
                // Start off-screen
                transform: 'translate3d(-100px, -100px, 0)',
                // Ensure transition only applies to scale/color, not position (for instant movement)
                transitionProperty: 'width, height, background-color, border-color, transform'
            }}
        >
            {/* Inner dot for precision */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-50"></div>
        </div>
    );
}

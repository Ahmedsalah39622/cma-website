'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Add visible class after delay
                    setTimeout(() => {
                        element.classList.remove('scroll-hidden');
                        element.classList.add('scroll-visible');
                    }, delay * 1000);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`scroll-hidden ${className}`}>
            {children}
        </div>
    );
}

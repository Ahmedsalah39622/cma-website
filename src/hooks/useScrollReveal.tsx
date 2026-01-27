'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollRevealOptions = {}
) {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
}

// Component wrapper for scroll reveal
interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'fade-in-scale';
    delay?: number;
    duration?: number;
    threshold?: number;
}

export function ScrollReveal({
    children,
    className = '',
    animation = 'fade-in-up',
    delay = 0,
    duration = 1,
    threshold = 0.1,
}: ScrollRevealProps) {
    const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold });

    const animationClass = isVisible ? `animate-${animation}` : '';

    return (
        <div
            ref={ref}
            className={`${className} ${animationClass}`}
            style={{
                opacity: isVisible ? undefined : 0,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            }}
        >
            {children}
        </div>
    );
}

export default ScrollReveal;

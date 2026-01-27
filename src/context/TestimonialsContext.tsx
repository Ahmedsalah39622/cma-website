'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Testimonial {
    id: string;
    quote: string;
    author: string;
    role: string;
    image: string;
}

interface TestimonialsContextType {
    testimonials: Testimonial[];
    addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
    updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
    deleteTestimonial: (id: string) => void;
    isLoaded: boolean;
}

const defaultTestimonials: Testimonial[] = [
    {
        id: '1',
        quote: '" They thoroughly analyze our industry and target audience, allowing them to develop customized campaigns that effectively reach and engage our customers. Their creative ideas and cutting-edge techniques have helped us stay ahead of the competition."',
        author: 'Michael Kaizer',
        role: 'CEO of Basecamp Corp',
        image: '',
    },
    {
        id: '2',
        quote: '" Working with this team has been an incredible journey. Their strategic approach to digital marketing has transformed our online presence and significantly increased our conversion rates."',
        author: 'Sarah Johnson',
        role: 'Marketing Director at TechFlow',
        image: '',
    },
    {
        id: '3',
        quote: '" The results speak for themselves. Our organic traffic has increased by 300% since partnering with them. Highly recommend their services to any business looking to grow."',
        author: 'David Chen',
        role: 'Founder of Innovate Labs',
        image: '',
    },
];

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

const STORAGE_KEY = 'cma_testimonials';

export function TestimonialsProvider({ children }: { children: ReactNode }) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setTestimonials(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    const saveTestimonials = useCallback((items: Testimonial[]) => {
        setTestimonials(items);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving testimonials:', error);
        }
    }, []);

    const addTestimonial = useCallback((testimonial: Omit<Testimonial, 'id'>) => {
        const newItem: Testimonial = { ...testimonial, id: Date.now().toString() };
        saveTestimonials([...testimonials, newItem]);
    }, [testimonials, saveTestimonials]);

    const updateTestimonial = useCallback((id: string, testimonial: Partial<Testimonial>) => {
        saveTestimonials(testimonials.map(t => t.id === id ? { ...t, ...testimonial } : t));
    }, [testimonials, saveTestimonials]);

    const deleteTestimonial = useCallback((id: string) => {
        saveTestimonials(testimonials.filter(t => t.id !== id));
    }, [testimonials, saveTestimonials]);

    return (
        <TestimonialsContext.Provider
            value={{
                testimonials,
                addTestimonial,
                updateTestimonial,
                deleteTestimonial,
                isLoaded,
            }}
        >
            {children}
        </TestimonialsContext.Provider>
    );
}

export function useTestimonials() {
    const context = useContext(TestimonialsContext);
    if (!context) {
        throw new Error('useTestimonials must be used within a TestimonialsProvider');
    }
    return context;
}

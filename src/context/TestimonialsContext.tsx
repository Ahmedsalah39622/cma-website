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

import { saveTestimonial, deleteTestimonial as deleteTestimonialAction } from '@/actions/testimonials';

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

interface TestimonialsProviderProps {
    children: ReactNode;
    initialTestimonials?: Testimonial[];
}

export function TestimonialsProvider({ children, initialTestimonials = [] }: TestimonialsProviderProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
    const [isLoaded, setIsLoaded] = useState(true);

    const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, 'id'>) => {
        const tempId = Date.now().toString();
        const newItem: Testimonial = { ...testimonial, id: tempId };

        // Optimistic update
        setTestimonials(prev => [...prev, newItem]);

        try {
            await saveTestimonial(testimonial);
            // In a real app we might want to fetch the real ID or revalidate
        } catch (error) {
            console.error('Error saving testimonial:', error);
            // Revert
            setTestimonials(prev => prev.filter(t => t.id !== tempId));
        }
    }, []);

    const updateTestimonial = useCallback(async (id: string, testimonial: Partial<Testimonial>) => {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...testimonial } : t));

        try {
            const current = testimonials.find(t => t.id === id);
            if (!current) return;

            await saveTestimonial({ ...current, ...testimonial, id });
        } catch (error) {
            console.error('Error updating testimonial:', error);
            // Revert logic would be here
        }
    }, [testimonials]);

    const deleteTestimonial = useCallback(async (id: string) => {
        const prevTestimonials = testimonials;
        setTestimonials(prev => prev.filter(t => t.id !== id));

        try {
            await deleteTestimonialAction(id);
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            setTestimonials(prevTestimonials);
        }
    }, [testimonials]);

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

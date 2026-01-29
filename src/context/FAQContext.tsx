'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { saveFaq, deleteFaq as deleteFaqAction } from '@/actions/faqs';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

interface FAQContextType {
    faqs: FAQ[];
    addFaq: (faq: Omit<FAQ, 'id'>) => void;
    updateFaq: (id: string, faq: Partial<FAQ>) => void;
    deleteFaq: (id: string) => void;
}

const FAQContext = createContext<FAQContextType | undefined>(undefined);

interface FAQProviderProps {
    children: ReactNode;
    initialFaqs?: FAQ[];
}

export function FAQProvider({ children, initialFaqs = [] }: FAQProviderProps) {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);

    const addFaq = useCallback(async (faq: Omit<FAQ, 'id'>) => {
        const tempId = Date.now().toString();
        const newItem = { ...faq, id: tempId };

        // Optimistic update
        setFaqs(prev => [...prev, newItem]);

        try {
            await saveFaq(faq);
        } catch (error) {
            console.error('Error saving FAQ:', error);
            // Revert
            setFaqs(prev => prev.filter(f => f.id !== tempId));
        }
    }, []);

    const updateFaq = useCallback(async (id: string, updates: Partial<FAQ>) => {
        setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

        try {
            const current = faqs.find(f => f.id === id);
            if (!current) return;

            await saveFaq({ ...current, ...updates, id });
        } catch (error) {
            console.error('Error updating FAQ:', error);
        }
    }, [faqs]);

    const deleteFaq = useCallback(async (id: string) => {
        const prevFaqs = faqs;
        setFaqs(prev => prev.filter(f => f.id !== id));

        try {
            await deleteFaqAction(id);
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setFaqs(prevFaqs);
        }
    }, [faqs]);

    return (
        <FAQContext.Provider value={{ faqs, addFaq, updateFaq, deleteFaq }}>
            {children}
        </FAQContext.Provider>
    );
}

export function useFAQs() {
    const context = useContext(FAQContext);
    if (!context) {
        throw new Error('useFAQs must be used within a FAQProvider');
    }
    return context;
}

'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback FAQs
const fallbackFaqs = [
    {
        id: 'fallback-1',
        question: 'How long does it take to see results from digital marketing efforts?',
        answer: 'Results vary depending on the strategy. PPC can show immediate results, while SEO typically takes 3-6 months. We provide regular reports to track progress and adjust strategies accordingly.',
        createdAt: new Date(),
    },
    {
        id: 'fallback-2',
        question: 'How do you measure the success of digital marketing campaigns?',
        answer: 'We use comprehensive analytics including traffic metrics, conversion rates, ROI, engagement rates, and custom KPIs tailored to your specific business goals.',
        createdAt: new Date(),
    },
];

// Cached Read
export const getFaqs = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Seed if empty
            if (!data || data.length === 0) {
                const defaultFaqs = [
                    {
                        question: 'Why is digital marketing important for my business?',
                        answer: 'Digital marketing allows businesses to reach and engage with a wider audience, generate leads, drive website traffic, and increase brand visibility.',
                    },
                    {
                        question: "How can digital marketing help improve my website's visibility?",
                        answer: "Through SEO optimization, content marketing, social media engagement, and paid advertising, we can significantly improve your website's visibility.",
                    },
                ];

                const { data: seeded, error: seedError } = await supabase
                    .from('faqs')
                    .insert(defaultFaqs)
                    .select();

                if (seedError) throw seedError;
                return seeded || [];
            }

            return data;
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return fallbackFaqs;
        }
    },
    ['faqs-list'],
    { tags: ['faqs'], revalidate: 60 }
);

export async function saveFaq(data: any) {
    const { id, ...rest } = data;

    try {
        if (id) {
            const { error } = await supabase
                .from('faqs')
                .update({ question: rest.question, answer: rest.answer })
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('faqs')
                .insert({ question: rest.question, answer: rest.answer });
            if (error) throw error;
        }
        (revalidateTag as any)('faqs');
        return { success: true };
    } catch (error) {
        console.error('Error saving FAQ:', error);
        throw error;
    }
}

export async function deleteFaq(id: string) {
    try {
        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', id);
        if (error) throw error;
        (revalidateTag as any)('faqs');
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw error;
    }
}

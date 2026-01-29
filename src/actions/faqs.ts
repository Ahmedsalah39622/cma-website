'use server';

import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
export const getFaqs = unstable_cache(
    async () => {
        try {
            const data = await db.select().from(faqs).orderBy(asc(faqs.createdAt));

            // Seed if empty
            if (data.length === 0) {
                const defaultFaqs = [
                    {
                        question: 'Why is digital marketing important for my business?',
                        answer: 'Digital marketing allows businesses to reach and engage with a wider audience, generate leads, drive website traffic, and increase brand visibility. It provides measurable results, allows for targeted marketing efforts, and enables businesses to adapt and optimize their strategies based on data and insights.',
                    },
                    {
                        question: "How can digital marketing help improve my website's visibility?",
                        answer: "Through SEO optimization, content marketing, social media engagement, and paid advertising, we can significantly improve your website's visibility in search results and across digital platforms.",
                    },
                    {
                        question: 'How long does it take to see results from digital marketing efforts?',
                        answer: 'Results vary depending on the strategy. PPC can show immediate results, while SEO typically takes 3-6 months. We provide regular reports to track progress and adjust strategies accordingly.',
                    },
                    {
                        question: 'How do you measure the success of digital marketing campaigns?',
                        answer: 'We use comprehensive analytics including traffic metrics, conversion rates, ROI, engagement rates, and custom KPIs tailored to your specific business goals.',
                    },
                ];

                await db.insert(faqs).values(defaultFaqs);

                // Re-fetch to get IDs
                return await db.select().from(faqs).orderBy(asc(faqs.createdAt));
            }

            return data;
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return [];
        }
    },
    ['faqs-list'],
    { tags: ['faqs'] }
);

export async function saveFaq(data: any) {
    const { id, ...rest } = data;

    try {
        if (id) {
            await db.update(faqs)
                .set({ question: rest.question, answer: rest.answer })
                .where(eq(faqs.id, id));
        } else {
            await db.insert(faqs).values({ question: rest.question, answer: rest.answer });
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
        await db.delete(faqs).where(eq(faqs.id, id));
        (revalidateTag as any)('faqs');
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw error;
    }
}

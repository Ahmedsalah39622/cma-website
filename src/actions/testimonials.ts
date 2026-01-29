'use server';

import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
export const getTestimonials = unstable_cache(
    async () => {
        try {
            return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    },
    ['testimonials-list'],
    { tags: ['testimonials'] }
);

export async function saveTestimonial(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        quote: rest.quote,
        author: rest.author,
        role: rest.role,
        imageUrl: rest.imageUrl || rest.image_url || rest.image
    };

    try {
        if (id) {
            await db.update(testimonials)
                .set(dbData)
                .where(eq(testimonials.id, id));
        } else {
            await db.insert(testimonials).values(dbData);
        }
        revalidateTag('testimonials');
        return { success: true };
    } catch (error) {
        console.error('Error saving testimonial:', error);
        throw error;
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await db.delete(testimonials).where(eq(testimonials.id, id));
        revalidateTag('testimonials');
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }
}

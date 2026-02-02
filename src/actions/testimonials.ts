'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback testimonials
const fallbackTestimonials = [
    {
        id: 'fallback-1',
        quote: 'We had a wonderful experience working with CMA. They designed an outstanding portfolio for our company.',
        author: 'Happy Client',
        role: 'CEO',
        imageUrl: '',
        createdAt: new Date(),
    },
];

const mapTestimonial = (t: any) => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role,
    imageUrl: t.image_url,
    createdAt: t.created_at,
});

// Cached Read
export const getTestimonials = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []).map(mapTestimonial);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return fallbackTestimonials;
        }
    },
    ['testimonials-list'],
    { tags: ['testimonials'], revalidate: 60 }
);

export async function saveTestimonial(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        quote: rest.quote,
        author: rest.author,
        role: rest.role,
        image_url: rest.imageUrl || rest.image_url || rest.image
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('testimonials')
                .update(dbData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('testimonials')
                .insert(dbData);
            if (error) throw error;
        }
        (revalidateTag as any)('testimonials');
        return { success: true };
    } catch (error) {
        console.error('Error saving testimonial:', error);
        throw error;
    }
}

export async function deleteTestimonial(id: string) {
    try {
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);
        if (error) throw error;
        (revalidateTag as any)('testimonials');
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }
}

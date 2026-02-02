'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback blog posts when DB is unavailable
const fallbackPosts = [
    {
        id: 'fallback-1',
        title: 'How a Digital Marketing Agency Can Boost Your Business',
        excerpt: 'We are the top digital marketing agency for branding corp. We offer a full range of services...',
        color: '#45A7DE',
        readTime: '5 min read',
        content: '',
        imageUrl: '',
        createdAt: new Date(),
    },
];

const mapBlog = (p: any) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    color: p.color,
    readTime: p.read_time,
    content: p.content,
    imageUrl: p.image_url,
    createdAt: p.created_at,
});

// Cached Read
export const getBlogPosts = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Seed if empty
            if (!data || data.length === 0) {
                const defaultPosts = [
                    {
                        title: 'How a Digital Marketing Agency Can Boost Your Business',
                        excerpt: 'We are the top digital marketing agency for branding corp...',
                        color: '#45A7DE',
                        read_time: '5 min read',
                        content: '',
                        image_url: '',
                    },
                ];

                const { data: seeded, error: seedError } = await supabase
                    .from('blog_posts')
                    .insert(defaultPosts)
                    .select();

                if (seedError) throw seedError;
                return (seeded || []).map(mapBlog);
            }

            return data.map(mapBlog);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return fallbackPosts;
        }
    },
    ['blog-posts-list'],
    { tags: ['blog'], revalidate: 60 }
);

export async function saveBlogPost(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        title: rest.title,
        excerpt: rest.excerpt,
        color: rest.color,
        read_time: rest.readTime,
        content: rest.content,
        image_url: rest.imageUrl || rest.image_url
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('blog_posts')
                .update(dbData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('blog_posts')
                .insert(dbData);
            if (error) throw error;
        }
        (revalidateTag as any)('blog');
        return { success: true };
    } catch (error) {
        console.error('Error saving blog post:', error);
        throw error;
    }
}

export async function deleteBlogPost(id: string) {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);
        if (error) throw error;
        (revalidateTag as any)('blog');
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

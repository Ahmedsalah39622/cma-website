'use server';

import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
export const getBlogPosts = unstable_cache(
    async () => {
        try {
            const data = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

            // Seed if empty
            if (data.length === 0) {
                const defaultPosts = [
                    {
                        title: 'How a Digital Marketing Agency Can Boost Your Business',
                        excerpt: 'We are the top digital marketing agency for branding corp. We offer a full rang engine ....',
                        color: '#45A7DE',
                        readTime: '5 min read',
                        content: '',
                        imageUrl: '',
                    },
                    {
                        title: 'The Latest Trends and Strategies with a Digital Marketing Agency',
                        excerpt: 'Working with this digital marketing agency has been a true partnership. They have tak...',
                        color: '#EA5F38',
                        readTime: '5 min read',
                        content: '',
                        imageUrl: '',
                    },
                    {
                        title: 'Maximizing ROI with the Expertise of a Digital Marketing Agency',
                        excerpt: 'What sets this digital marketing agency apart is their commitment to transparency a...',
                        color: '#6A26F1',
                        readTime: '5 min read',
                        content: '',
                        imageUrl: '',
                    },
                ];

                await db.insert(blogPosts).values(defaultPosts);
                return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
            }

            return data;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },
    ['blog-posts-list'],
    { tags: ['blog'] }
);

export async function saveBlogPost(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        title: rest.title,
        excerpt: rest.excerpt,
        color: rest.color,
        readTime: rest.readTime,
        content: rest.content,
        imageUrl: rest.imageUrl || rest.image_url
    };

    try {
        if (id) {
            await db.update(blogPosts)
                .set(dbData)
                .where(eq(blogPosts.id, id));
        } else {
            await db.insert(blogPosts).values(dbData);
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
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        (revalidateTag as any)('blog');
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
export const getProjects = unstable_cache(
    async () => {
        try {
            return await db.select().from(projects).orderBy(desc(projects.createdAt));
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },
    ['projects-list'],
    { tags: ['portfolio'] }
);

export async function getProject(id: string) {
    return unstable_cache(
        async () => {
            try {
                const result = await db.select().from(projects).where(eq(projects.id, id));
                return result[0] || null;
            } catch (error) {
                console.error('Error fetching project:', error);
                return null;
            }
        },
        ['project-detail', id],
        { tags: ['portfolio', `project-${id}`] }
    )();
}

export async function saveProject(data: any) {
    const { id, ...rest } = data;

    // UI: title, company, category, image, year, description, link, videoUrl, videoType, socialLinks, gallery, additionalVideos
    // DB: camelCase in Drizzle schema

    const dbData = {
        title: rest.title,
        company: rest.company,
        category: rest.category,
        imageUrl: rest.imageUrl || rest.image,
        year: rest.year,
        description: rest.description,
        link: rest.link,
        videoUrl: rest.videoUrl,
        videoType: rest.videoType,
        socialLinks: rest.socialLinks,
        gallery: rest.gallery,
        additionalVideos: rest.additionalVideos
    };

    try {
        if (id) {
            await db.update(projects)
                .set(dbData)
                .where(eq(projects.id, id));
        } else {
            await db.insert(projects).values(dbData);
        }
        (revalidateTag as any)('portfolio');
        return { success: true };
    } catch (error) {
        console.error('Error saving project:', error);
        throw error;
    }
}

export async function deleteProject(id: string) {
    try {
        await db.delete(projects).where(eq(projects.id, id));
        (revalidateTag as any)('portfolio');
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

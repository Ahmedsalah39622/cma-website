'use server';

import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
export const getBrands = unstable_cache(
    async () => {
        try {
            return await db.select().from(brands).orderBy(asc(brands.createdAt));
        } catch (error) {
            console.error('Error fetching brands:', error);
            return [];
        }
    },
    ['brands-list'],
    { tags: ['brands'] }
);

export async function saveBrand(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        name: rest.name,
        imageUrl: rest.imageUrl || rest.image_url || rest.image
    };

    try {
        if (id) {
            await db.update(brands)
                .set(dbData)
                .where(eq(brands.id, id));
        } else {
            await db.insert(brands).values(dbData);
        }
        revalidateTag('brands');
        return { success: true };
    } catch (error) {
        console.error('Error saving brand:', error);
        throw error;
    }
}

export async function deleteBrand(id: string) {
    try {
        await db.delete(brands).where(eq(brands.id, id));
        revalidateTag('brands');
    } catch (error) {
        console.error('Error deleting brand:', error);
        throw error;
    }
}

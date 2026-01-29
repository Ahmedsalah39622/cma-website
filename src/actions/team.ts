'use server';

import { db } from '@/db';
import { teamMembers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
export const getTeamMembers = unstable_cache(
    async () => {
        try {
            return await db.select().from(teamMembers).orderBy(asc(teamMembers.createdAt));
        } catch (error) {
            console.error('Error fetching team:', error);
            return [];
        }
    },
    ['team-list'],
    { tags: ['team'] }
);

export async function saveTeamMember(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        name: rest.name,
        role: rest.role,
        imageUrl: rest.imageUrl || rest.image_url || rest.image,
        bgColor: rest.bgColor || rest.bg_color
    };

    try {
        if (id) {
            await db.update(teamMembers)
                .set(dbData)
                .where(eq(teamMembers.id, id));
        } else {
            await db.insert(teamMembers).values(dbData);
        }
        revalidateTag('team');
        return { success: true };
    } catch (error) {
        console.error('Error saving team member:', error);
        throw error;
    }
}

export async function deleteTeamMember(id: string) {
    try {
        await db.delete(teamMembers).where(eq(teamMembers.id, id));
        revalidateTag('team');
    } catch (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }
}

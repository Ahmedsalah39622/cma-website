'use server';

import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag, unstable_cache } from 'next/cache';

export const getSectionVisibility = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, 'section_visibility')
            });
            return (setting?.value as any) || {
                hero: true,
                brands: true,
                portfolio: true,
                services: true,
                testimonials: true,
                team: true,
                faq: true,
                blog: true,
                cta: true,
                contact: true
            };
        } catch (error) {
            console.error('Error fetching section visibility:', error);
            return {
                hero: true,
                brands: true,
                portfolio: true,
                services: true,
                testimonials: true,
                team: true,
                faq: true,
                blog: true,
                cta: true,
                contact: true
            };
        }
    },
    ['section-visibility'],
    { tags: ['site-settings'] }
);

export async function updateSectionVisibility(visibility: any) {
    try {
        await db.insert(siteSettings)
            .values({ key: 'section_visibility', value: visibility })
            .onConflictDoUpdate({
                target: siteSettings.key,
                set: { value: visibility }
            });
        revalidateTag('site-settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating section visibility:', error);
        throw error;
    }
}

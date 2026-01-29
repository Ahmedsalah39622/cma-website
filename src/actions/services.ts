'use server';

import { db } from '@/db';
import { services, siteSettings } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Cached Read
// Cached Read
export const getServices = unstable_cache(
    async () => {
        try {
            const data = await db.select().from(services).orderBy(asc(services.createdAt));

            // Seed if empty
            if (data.length === 0) {
                const defaultServices = [
                    { title: 'Project Management', count: '30 options available', iconType: 'grid' },
                    { title: 'Web & Mobile Development', count: '40 options available', iconType: 'code' },
                    { title: 'Customer Support', count: '17 options available', iconType: 'support' },
                    { title: 'Human Resources', count: '21 options available', iconType: 'users' },
                    { title: 'Design & Creatives', count: '13 options available', iconType: 'design' },
                    { title: 'Marketing & Communication', count: '27 options available', iconType: 'marketing' },
                    { title: 'Business Development', count: '22 options available', iconType: 'business' },
                ];

                // Insert defaults
                await db.insert(services).values(defaultServices.map(s => ({
                    title: s.title,
                    count: s.count,
                    iconType: s.iconType
                })));

                // Re-fetch to get IDs
                const seededData = await db.select().from(services).orderBy(asc(services.createdAt));
                return seededData;
            }

            return data;
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    },
    ['services-list'],
    { tags: ['services'] }
);

export async function saveService(data: any) {
    const { id, ...rest } = data;

    // UI expects/sends: title, count, iconType
    // DB: title, count, icon_type

    const dbData = {
        title: rest.title,
        count: rest.count,
        iconType: rest.iconType || rest.icon_type // Drizzle schema uses camelCase properties for TS, mapped to snake_case cols
    };

    try {
        if (id) {
            await db.update(services)
                .set(dbData)
                .where(eq(services.id, id));
        } else {
            await db.insert(services).values(dbData);
        }
        (revalidateTag as any)('services');
        return { success: true };
    } catch (error) {
        console.error('Error saving service:', error);
        throw error;
    }
}

export async function deleteService(id: string) {
    try {
        await db.delete(services).where(eq(services.id, id));
        (revalidateTag as any)('services');
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
}

// Site Settings for "More Count"
export const getServiceSettings = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, 'services_more')
            });
            return setting?.value || { count: 0, optionsText: 'More Options' }; // Default 0
        } catch (error) {
            return { count: 0, optionsText: 'More Options' }; // Default 0
        }
    },
    ['services-settings'],
    { tags: ['services'] }
);

export async function updateServiceSettings(settings: { count: number, optionsText: string }) {
    try {
        await db.insert(siteSettings)
            .values({ key: 'services_more', value: settings })
            .onConflictDoUpdate({
                target: siteSettings.key,
                set: { value: settings }
            });
        (revalidateTag as any)('services');
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

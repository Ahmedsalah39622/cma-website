'use server';

import { db } from '@/db';
import { contactSubmissions, siteSettings } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Contact Info (stored in site_settings)
export const getContactInfo = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, 'contact_info')
            });
            return setting?.value || {
                email: 'info@cma.com',
                phone: '+1 234 567 890',
                address: '123 Creative St',
                addressLine2: 'Design City, DC 12345'
            };
        } catch (error) {
            return {
                email: 'info@cma.com',
                phone: '',
                address: '',
                addressLine2: ''
            };
        }
    },
    ['contact-info'],
    { tags: ['contact'] }
);

export async function updateContactInfo(info: any) {
    try {
        await db.insert(siteSettings)
            .values({ key: 'contact_info', value: info })
            .onConflictDoUpdate({
                target: siteSettings.key,
                set: { value: info }
            });
        (revalidateTag as any)('contact');
    } catch (error) {
        console.error('Error updating contact info:', error);
        throw error;
    }
}

// Submissions
export async function getContactSubmissions() {
    try {
        return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submittedAt));
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}

export async function submitContact(formData: any) {
    try {
        await db.insert(contactSubmissions).values({
            name: formData.name,
            email: formData.email,
            website: formData.website,
            message: formData.message,
            submittedAt: new Date(),
            read: false
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
}

export async function markSubmissionRead(id: string) {
    try {
        await db.update(contactSubmissions)
            .set({ read: true })
            .where(eq(contactSubmissions.id, id));
        (revalidateTag as any)('contact');
    } catch (error) {
        console.error('Error marking submission read:', error);
        throw error;
    }
}

export async function deleteSubmission(id: string) {
    try {
        await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
        (revalidateTag as any)('contact');
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
}

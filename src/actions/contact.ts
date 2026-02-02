'use server';

import { db } from '@/db';
import { supabase } from '@/lib/supabase';
import { revalidateTag, unstable_cache } from 'next/cache';

// Cached Read for contact info
export const getContactInfo = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', 'contact_info')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            const defaultContact = {
                email: 'contact@example.com',
                phone: '+1 234 567 890',
                address: '123 Business St, Creative City',
                addressLine2: 'Suite 100'
            };

            return data?.value || defaultContact;
        } catch (error) {
            console.error('Error fetching contact info:', error);
            return {
                email: 'contact@example.com',
                phone: '+1 234 567 890',
                address: '123 Business St, Creative City',
                addressLine2: 'Suite 100'
            };
        }
    },
    ['contact-info'],
    { tags: ['contact'], revalidate: 60 }
);

export async function updateContactInfo(info: any) {
    try {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'contact_info', value: info }, { onConflict: 'key' });

        if (error) throw error;
        (revalidateTag as any)('contact');
        return { success: true };
    } catch (error) {
        console.error('Error updating contact info:', error);
        throw error;
    }
}

// Submissions
export async function submitContact(data: any) {
    try {
        const { error } = await supabase
            .from('contact_submissions')
            .insert({
                name: data.name,
                email: data.email,
                website: data.website,
                message: data.message
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
}

export async function getContactSubmissions() {
    try {
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}

export async function deleteSubmission(id: string) {
    try {
        const { error } = await supabase
            .from('contact_submissions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
}

'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback services
const fallbackServices = [
    { id: 'fallback-1', title: 'Web & Mobile Development', count: '40 options available', iconType: 'code', createdAt: new Date() },
    { id: 'fallback-2', title: 'Marketing & Communication', count: '27 options available', iconType: 'marketing', createdAt: new Date() },
];

const mapService = (s: any) => ({
    id: s.id,
    title: s.title,
    count: s.count,
    iconType: s.icon_type,
    createdAt: s.created_at,
});

// Cached Read
export const getServices = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Seed if empty
            if (!data || data.length === 0) {
                const defaultServices = [
                    { title: 'Project Management', count: '30 options available', icon_type: 'grid' },
                    { title: 'Web & Mobile Development', count: '40 options available', icon_type: 'code' },
                    { title: 'Customer Support', count: '17 options available', icon_type: 'support' },
                    { title: 'Human Resources', count: '21 options available', icon_type: 'users' },
                    { title: 'Design & Creatives', count: '13 options available', icon_type: 'design' },
                    { title: 'Marketing & Communication', count: '27 options available', icon_type: 'marketing' },
                    { title: 'Business Development', count: '22 options available', icon_type: 'business' },
                ];

                const { data: seeded, error: seedError } = await supabase
                    .from('services')
                    .insert(defaultServices)
                    .select();

                if (seedError) throw seedError;
                return (seeded || []).map(mapService);
            }

            return data.map(mapService);
        } catch (error) {
            console.error('Error fetching services:', error);
            return fallbackServices;
        }
    },
    ['services-list'],
    { tags: ['services'], revalidate: 60 }
);

export async function saveService(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        title: rest.title,
        count: rest.count,
        icon_type: rest.iconType || rest.icon_type
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('services')
                .update(dbData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('services')
                .insert(dbData);
            if (error) throw error;
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
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);
        if (error) throw error;
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
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', 'services_more')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'
            return data?.value || { count: 0, optionsText: 'More Options' };
        } catch (error) {
            return { count: 0, optionsText: 'More Options' };
        }
    },
    ['services-settings'],
    { tags: ['services'], revalidate: 60 }
);

export async function updateServiceSettings(settings: { count: number, optionsText: string }) {
    try {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'services_more', value: settings }, { onConflict: 'key' });
        if (error) throw error;
        (revalidateTag as any)('services');
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

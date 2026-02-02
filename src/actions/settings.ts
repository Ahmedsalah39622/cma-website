'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag, unstable_cache } from 'next/cache';

// Cached Read for section visibility
export const getSectionVisibility = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', 'section_visibility')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            const defaultVisibility = {
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

            return data?.value || defaultVisibility;
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
    { tags: ['settings'], revalidate: 60 }
);

export async function updateSectionVisibility(visibility: any) {
    try {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'section_visibility', value: visibility }, { onConflict: 'key' });

        if (error) throw error;
        (revalidateTag as any)('settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating visibility:', error);
        throw error;
    }
}

// Portfolio Categories
export const getPortfolioCategories = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('key', 'portfolio_categories')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            const defaultCategories = ['Branding', 'Marketing', 'Development', 'Design'];
            return data?.value || defaultCategories;
        } catch (error) {
            console.error('Error fetching portfolio categories:', error);
            return ['Branding', 'Marketing', 'Development', 'Design'];
        }
    },
    ['portfolio-categories'],
    { tags: ['settings'], revalidate: 60 }
);

export async function updatePortfolioCategories(categories: string[]) {
    try {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'portfolio_categories', value: categories }, { onConflict: 'key' });

        if (error) throw error;
        (revalidateTag as any)('settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating categories:', error);
        throw error;
    }
}

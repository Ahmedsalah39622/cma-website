'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback brands
const fallbackBrands = [
    { id: 'fallback-1', name: 'Almarai', imageUrl: '/brands/almarai.png', createdAt: new Date() },
];

const mapBrand = (b: any) => ({
    id: b.id,
    name: b.name,
    imageUrl: b.image_url,
    createdAt: b.created_at,
});

// Cached Read
export const getBrands = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            return (data || []).map(mapBrand);
        } catch (error) {
            console.error('Error fetching brands:', error);
            return fallbackBrands;
        }
    },
    ['brands-list'],
    { tags: ['brands'], revalidate: 60 }
);

export async function saveBrand(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        name: rest.name,
        image_url: rest.imageUrl || rest.image
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('brands')
                .update(dbData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('brands')
                .insert(dbData);
            if (error) throw error;
        }
        (revalidateTag as any)('brands');
        return { success: true };
    } catch (error) {
        console.error('Error saving brand:', error);
        throw error;
    }
}

export async function deleteBrand(id: string) {
    try {
        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);
        if (error) throw error;
        (revalidateTag as any)('brands');
    } catch (error) {
        console.error('Error deleting brand:', error);
        throw error;
    }
}

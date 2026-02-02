'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback team
const fallbackTeam: any[] = [];

const mapTeam = (t: any) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    imageUrl: t.image_url,
    bgColor: t.bg_color,
    createdAt: t.created_at,
});

// Cached Read
export const getTeamMembers = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            return (data || []).map(mapTeam);
        } catch (error) {
            console.error('Error fetching team:', error);
            return fallbackTeam;
        }
    },
    ['team-list'],
    { tags: ['team'], revalidate: 60 }
);

export async function saveTeamMember(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        name: rest.name,
        role: rest.role,
        image_url: rest.imageUrl || rest.image_url || rest.image,
        bg_color: rest.bgColor || rest.bg_color
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('team_members')
                .update(dbData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('team_members')
                .insert(dbData);
            if (error) throw error;
        }
        (revalidateTag as any)('team');
        return { success: true };
    } catch (error) {
        console.error('Error saving team member:', error);
        throw error;
    }
}

export async function deleteTeamMember(id: string) {
    try {
        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', id);
        if (error) throw error;
        (revalidateTag as any)('team');
    } catch (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }
}

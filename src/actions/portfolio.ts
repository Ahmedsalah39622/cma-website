'use server';

import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Default fallback projects when DB is unavailable
const fallbackProjects = [
    {
        id: 'fallback-1',
        title: 'Brand Identity Design',
        company: 'Tech Startup',
        category: 'Branding',
        imageUrl: '/portfolio-placeholder.jpg',
        year: '2024',
        description: 'Complete brand identity design for a leading tech startup.',
        link: '',
        videoUrl: '',
        videoType: '',
        socialLinks: [],
        gallery: [],
        additionalVideos: [],
        createdAt: new Date(),
    },
    {
        id: 'fallback-2',
        title: 'Social Media Campaign',
        company: 'E-commerce Brand',
        category: 'Marketing',
        imageUrl: '/portfolio-placeholder.jpg',
        year: '2024',
        description: 'Successful social media marketing campaign.',
        link: '',
        videoUrl: '',
        videoType: '',
        socialLinks: [],
        gallery: [],
        additionalVideos: [],
        createdAt: new Date(),
    },
];

const mapProject = (p: any) => ({
    id: p.id,
    title: p.title,
    company: p.company,
    category: p.category,
    imageUrl: p.image_url,
    year: p.year,
    description: p.description,
    link: p.link,
    videoUrl: p.video_url,
    videoType: p.video_type,
    socialLinks: p.social_links || [],
    gallery: p.gallery || [],
    additionalVideos: p.additional_videos || [],
    createdAt: p.created_at,
});

// Cached Read
export const getProjects = unstable_cache(
    async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []).map(mapProject);
        } catch (error) {
            console.error('Error fetching projects:', error);
            return fallbackProjects;
        }
    },
    ['projects-list'],
    { tags: ['portfolio'], revalidate: 60 }
);

export async function getProject(id: string) {
    return unstable_cache(
        async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return data ? mapProject(data) : null;
            } catch (error) {
                console.error('Error fetching project:', error);
                return null;
            }
        },
        ['project-detail', id],
        { tags: ['portfolio', `project-${id}`] }
    )();
}

export async function saveProject(data: any) {
    const { id, ...rest } = data;

    const dbData = {
        title: rest.title,
        company: rest.company,
        category: rest.category,
        image_url: rest.imageUrl || rest.image,
        year: rest.year,
        description: rest.description,
        link: rest.link,
        video_url: rest.videoUrl,
        video_type: rest.videoType,
        social_links: rest.socialLinks,
        gallery: rest.gallery,
        additional_videos: rest.additionalVideos
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('projects')
                .update(dbData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('projects')
                .insert(dbData);
            if (error) throw error;
        }
        (revalidateTag as any)('portfolio');
        return { success: true };
    } catch (error) {
        console.error('Error saving project:', error);
        throw error;
    }
}

export async function deleteProject(id: string) {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        if (error) throw error;
        (revalidateTag as any)('portfolio');
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

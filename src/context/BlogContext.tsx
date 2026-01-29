'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { saveBlogPost, deleteBlogPost as deleteBlogPostAction } from '@/actions/blog';

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    color: string;
    readTime: string;
    content?: string;
    imageUrl?: string;
}

interface BlogContextType {
    posts: BlogPost[];
    addPost: (post: Omit<BlogPost, 'id'>) => void;
    updatePost: (id: string, post: Partial<BlogPost>) => void;
    deletePost: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
    children: ReactNode;
    initialPosts?: BlogPost[];
}

export function BlogProvider({ children, initialPosts = [] }: BlogProviderProps) {
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

    const addPost = useCallback(async (post: Omit<BlogPost, 'id'>) => {
        const tempId = Date.now().toString();
        const newPost = { ...post, id: tempId };

        // Optimistic
        setPosts(prev => [newPost, ...prev]);

        try {
            await saveBlogPost(post);
        } catch (error) {
            console.error('Error saving post:', error);
            setPosts(prev => prev.filter(p => p.id !== tempId));
        }
    }, []);

    const updatePost = useCallback(async (id: string, updates: Partial<BlogPost>) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

        try {
            const current = posts.find(p => p.id === id);
            if (!current) return;

            await saveBlogPost({ ...current, ...updates, id });
        } catch (error) {
            console.error('Error updating post:', error);
        }
    }, [posts]);

    const deletePost = useCallback(async (id: string) => {
        const prevPosts = posts;
        setPosts(prev => prev.filter(p => p.id !== id));

        try {
            await deleteBlogPostAction(id);
        } catch (error) {
            console.error('Error deleting post:', error);
            setPosts(prevPosts);
        }
    }, [posts]);

    return (
        <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
            {children}
        </BlogContext.Provider>
    );
}

export function useBlog() {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}

'use client';

import React, { useState } from 'react';
import { useBlog, BlogPost } from '@/context/BlogContext';

export default function AdminBlogPage() {
    const { posts, addPost, updatePost, deletePost } = useBlog();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
        title: '',
        excerpt: '',
        readTime: '5 min read',
        color: '#45A7DE',
        content: '',
        imageUrl: ''
    });

    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            title: '',
            excerpt: '',
            readTime: '5 min read',
            color: '#45A7DE',
            content: '',
            imageUrl: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (post: BlogPost) => {
        setEditingId(post.id);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            readTime: post.readTime,
            color: post.color,
            content: post.content || '',
            imageUrl: post.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updatePost(editingId, formData);
        } else {
            addPost(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        deletePost(id);
        setDeleteConfirm(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Blog Manager</h1>
                    <p className="text-white/50">Manage your latest news and articles</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all"
                >
                    + Add Article
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:border-[#FFD700]/30 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: post.color }}></div>
                                <span className="text-white/40 text-xs">{post.readTime}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(post)} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-xs">Edit</button>
                                <button onClick={() => setDeleteConfirm(post.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 text-xs">Del</button>
                            </div>
                        </div>

                        <h3 className="text-white font-semibold text-lg leading-snug line-clamp-2">{post.title}</h3>
                        <p className="text-white/60 text-sm line-clamp-3">{post.excerpt}</p>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <p className="text-white/40">No articles found. Add your first post!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Article' : 'New Article'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Read Time</label>
                                    <input
                                        type="text"
                                        value={formData.readTime}
                                        onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                        placeholder="e.g. 5 min read"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Color Label</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none p-0"
                                        />
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/60 text-sm mb-2">Excerpt (Short Summary)</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none resize-none"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl">{editingId ? 'Save Changes' : 'Publish Article'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md p-8 text-center">
                        <h3 className="text-xl font-bold text-white mb-4">Delete this article?</h3>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

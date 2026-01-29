'use client';

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getProjects, saveProject, deleteProject } from '@/actions/portfolio';
import { getPortfolioCategories, updatePortfolioCategories } from '@/actions/settings';

interface Project {
    id: string;
    title: string;
    company: string;
    category: string;
    image: string; // UI uses 'image', DB uses 'imageUrl' map
    year: string;
    description: string;
    link: string;
    videoUrl: string;
    videoType: 'youtube' | 'instagram' | 'mp4';
    socialLinks: { type: string; url: string }[];
    gallery: string[];
    additionalVideos: { type: 'youtube' | 'instagram' | 'mp4'; url: string }[];
}

const emptyForm: Project = {
    id: '',
    title: '',
    company: '',
    category: '', // Will be set from first category in loadData
    image: '',
    year: new Date().getFullYear().toString(),
    description: '',
    link: '',
    videoUrl: '',
    videoType: 'youtube',
    socialLinks: [],
    gallery: [],
    additionalVideos: [],
};

const videoTypeOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'vimeo', label: 'Vimeo' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'X (Twitter)' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'mp4', label: 'Direct MP4' },
];

const socialTypeOptions = [
    { value: 'website', label: 'Website' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'X (Twitter)' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
];

export default function AdminPortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Project>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [projectsData, cats] = await Promise.all([
                getProjects(),
                getPortfolioCategories()
            ]);

            const formatted: Project[] = (projectsData || []).map((p: any) => ({
                id: p.id,
                title: p.title || '',
                company: p.company || '',
                category: p.category || (cats[0] || ''),
                image: p.imageUrl || p.image || '',
                year: p.year?.toString() || '',
                description: p.description || '',
                link: p.link || '',
                videoUrl: p.videoUrl || '',
                videoType: p.videoType || 'youtube',
                socialLinks: p.socialLinks || [],
                gallery: p.gallery || [],
                additionalVideos: p.additionalVideos || []
            }));

            setProjects(formatted);
            setCategories(cats);
            if (cats.length > 0 && !editingId) {
                setFormData(prev => ({ ...prev, category: cats[0] }));
            }
        } catch (err) {
            console.error('Failed to load projects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        if (categories.includes(newCategoryName.trim())) {
            alert('Category already exists');
            return;
        }
        const updated = [...categories, newCategoryName.trim()];
        try {
            await updatePortfolioCategories(updated);
            setCategories(updated);
            setNewCategoryName('');
        } catch (error) {
            alert('Failed to add category');
        }
    };

    const handleDeleteCategory = async (catToDelete: string) => {
        if (!confirm(`Are you sure you want to delete "${catToDelete}"? This will not delete projects in this category, but you should reassign them.`)) return;
        const updated = categories.filter(c => c !== catToDelete);
        try {
            await updatePortfolioCategories(updated);
            setCategories(updated);
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload file. Ensure "portfolio" bucket exists.');
            return null;
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);
        const url = await uploadFile(file);
        if (url) {
            setFormData(prev => ({ ...prev, image: url }));
        }
        setIsUploading(false);
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) continue;
                const url = await uploadFile(file);
                if (url) newImages.push(url);
            }
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }));
        } catch (error) {
            console.error('Error uploading gallery images:', error);
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const addAdditionalVideo = () => {
        setFormData(prev => ({
            ...prev,
            additionalVideos: [...prev.additionalVideos, { type: 'youtube', url: '' }]
        }));
    };

    const removeAdditionalVideo = (index: number) => {
        setFormData(prev => ({
            ...prev,
            additionalVideos: prev.additionalVideos.filter((_, i) => i !== index)
        }));
    };

    const updateAdditionalVideo = (index: number, field: 'type' | 'url', value: string) => {
        setFormData((prev: Project) => {
            const newVideos = [...prev.additionalVideos];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newVideos[index] = { ...newVideos[index], [field]: value } as any;
            return { ...prev, additionalVideos: newVideos };
        });
    };

    const addSocialLink = () => {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { type: 'youtube', url: '' }]
        }));
    };

    const removeSocialLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const updateSocialLink = (index: number, field: 'type' | 'url', value: string) => {
        setFormData((prev: Project) => {
            const newLinks = [...prev.socialLinks];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newLinks[index] = { ...newLinks[index], [field]: value } as any;
            return { ...prev, socialLinks: newLinks };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.company) {
            alert('Please fill in title and company');
            return;
        }

        try {
            const submissionData = {
                id: editingId || undefined,
                title: formData.title,
                company: formData.company,
                category: formData.category,
                imageUrl: formData.image,
                year: formData.year,
                description: formData.description,
                link: formData.link,
                videoUrl: formData.videoUrl,
                videoType: formData.videoType,
                socialLinks: formData.socialLinks.filter(l => l.url),
                gallery: formData.gallery,
                additionalVideos: formData.additionalVideos.filter(v => v.url)
            };

            await saveProject(submissionData);
            await loadData();
            handleCancel();
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save project');
        }
    };

    const handleEdit = (item: Project) => {
        setFormData({ ...item });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete project');
        }
    };

    const handleCancel = () => {
        setFormData({ ...emptyForm, category: categories[0] || '' });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading && projects.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-white/10 rounded-xl w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-80 bg-white/10 rounded-2xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-transparent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Portfolio Manager</h1>
                            <p className="text-white/50 mt-3 text-lg">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setShowCategoryManager(true)} className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-lg">
                                Manage Categories
                            </button>
                            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all text-lg">
                                + Add Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
                {/* Category Manager Modal */}
                {showCategoryManager && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && setShowCategoryManager(false)}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
                            <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Categories</h2>
                                <button onClick={() => setShowCategoryManager(false)} className="text-white/50 hover:text-white">×</button>
                            </div>
                            <div className="p-8 overflow-y-auto space-y-6">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="New Category"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#FFD700]"
                                    />
                                    <button onClick={handleAddCategory} className="px-5 py-3 bg-[#FFD700] text-black font-bold rounded-xl">Add</button>
                                </div>
                                <div className="space-y-3">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <span className="text-white">{cat}</span>
                                            <button onClick={() => handleDeleteCategory(cat)} className="text-red-500 hover:text-red-400">Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#141414] flex-shrink-0 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                                <button onClick={handleCancel} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10">×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase">Title *</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none" required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-white text-sm font-semibold uppercase">Company *</label>
                                        <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none" required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white text-sm font-semibold uppercase">Year</label>
                                        <input type="text" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase">Main Image</label>
                                    {!formData.image ? (
                                        <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FFD700]/50" onClick={() => fileInputRef.current?.click()}>
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            {isUploading ? <p className="text-[#FFD700]">Uploading...</p> : <p className="text-white/50">Click to upload</p>}
                                        </div>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden bg-white/5 aspect-video group">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                        </div>
                                    )}
                                </div>

                                {/* Gallery */}
                                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                                    <h3 className="text-white font-bold">Gallery</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {formData.gallery.map((img, i) => (
                                            <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100">×</button>
                                            </div>
                                        ))}
                                        <label className="border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center aspect-video cursor-pointer hover:border-[#FFD700]/50">
                                            <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                                            <span className="text-white/30 text-xs">+ Add</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Additional Videos */}
                                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-white font-bold">Project Videos (Social)</h3>
                                        <button type="button" onClick={addAdditionalVideo} className="text-[#FFD700] text-sm hover:underline">+ Add Video</button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.additionalVideos.map((video, i) => (
                                            <div key={i} className="flex gap-3">
                                                <select
                                                    value={video.type}
                                                    onChange={(e) => updateAdditionalVideo(i, 'type', e.target.value)}
                                                    className="w-32 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm outline-none"
                                                >
                                                    {videoTypeOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Video URL"
                                                    value={video.url}
                                                    onChange={(e) => updateAdditionalVideo(i, 'url', e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm outline-none"
                                                />
                                                <button type="button" onClick={() => removeAdditionalVideo(i)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {formData.additionalVideos.length === 0 && (
                                            <p className="text-white/30 text-xs italic">Add YouTube or Instagram links to appear in the gallery.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-white font-bold">Project Links</h3>
                                        <button type="button" onClick={addSocialLink} className="text-[#FFD700] text-sm hover:underline">+ Add Link</button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.socialLinks.map((link, i) => (
                                            <div key={i} className="flex gap-3">
                                                <select
                                                    value={link.type}
                                                    onChange={(e) => updateSocialLink(i, 'type', e.target.value)}
                                                    className="w-32 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm outline-none"
                                                >
                                                    {socialTypeOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="URL"
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm outline-none"
                                                />
                                                <button type="button" onClick={() => removeSocialLink(i)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase">Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none resize-none" />
                                </div>

                            </form>
                            <div className="p-8 border-t border-white/10 bg-[#0f0f0f] flex gap-4 flex-shrink-0">
                                <button onClick={handleCancel} className="flex-1 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20">Cancel</button>
                                <button onClick={handleSubmit} disabled={isUploading} className="flex-1 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl disabled:opacity-50">{editingId ? 'Save Values' : 'Add Project'}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setDeleteConfirm(null)}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8 text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Delete Project?</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl">Cancel</button>
                                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl">Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#FFD700]/30 transition-all">
                            <div className="aspect-video relative">
                                {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/30">No Image</div>}
                            </div>
                            <div className="p-6">
                                <h3 className="text-white font-bold text-lg mb-1">{p.title}</h3>
                                <p className="text-white/50 text-sm">{p.company}</p>
                                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                    <button onClick={() => handleEdit(p)} className="flex-1 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20">Edit</button>
                                    <button onClick={() => setDeleteConfirm(p.id)} className="py-2 px-4 bg-red-500/10 text-red-400 text-sm rounded-lg hover:bg-red-500/20">Del</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '@/actions/testimonials';

interface Testimonial {
    id: string;
    quote: string;
    author: string;
    role: string;
    image: string; // URL
}

const emptyForm: Testimonial = {
    id: '',
    quote: '',
    author: '',
    role: '',
    image: '',
};

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Testimonial>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getTestimonials();
            setTestimonials(data.map(d => ({
                id: d.id,
                quote: d.quote || '',
                author: d.author || '',
                role: d.role || '',
                image: d.imageUrl || '',
            })));
        } catch (error) {
            console.error('Error loading testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `testimonials/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('team') // Reusing 'team' bucket if 'testimonials' not created, or create 'testimonials' bucket. 
                // Wait, user created 'portfolio', 'team', 'brands'. Let's use 'team' or just 'portfolio' for misc? 
                // Actually better to use 'brands' or just put in 'portfolio' if no specific bucket. 
                // Let's us 'portfolio' as a general 'media' bucket to be safe if 'testimonials' doesn't exist.
                // Or better, I will use 'portfolio' for now as it definitely exists.
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('team').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image: data.publicUrl }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Ensure bucket exists.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.quote || !formData.author) {
            alert('Please fill in quote and author');
            return;
        }

        try {
            await saveTestimonial({
                id: editingId || undefined,
                quote: formData.quote,
                author: formData.author,
                role: formData.role,
                imageUrl: formData.image
            });
            await loadData();
            handleCancel();
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleEdit = (item: Testimonial) => {
        setFormData({ ...item });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTestimonial(id);
            setTestimonials(prev => prev.filter(p => p.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleCancel = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    if (loading && testimonials.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-white/10 rounded-xl w-1/3" />
                    <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/10 rounded-2xl" />)}</div>
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
                            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Testimonials Manager</h1>
                            <p className="text-white/50 mt-3 text-lg">{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all text-lg">
                            + Add Testimonial
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#141414] flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                                <button onClick={handleCancel} className="text-white hover:text-white/70">✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase">Quote *</label>
                                    <textarea value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} placeholder='"The work was amazing..."' rows={4} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none resize-none" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-white text-sm font-semibold uppercase">Author *</label>
                                        <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="John Doe" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-white text-sm font-semibold uppercase">Role</label>
                                        <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="CEO, Tech Inc" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase">Photo</label>
                                    <div className="flex items-center gap-4">
                                        {formData.image ? (
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden group">
                                                <img src={formData.image} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">Remove</button>
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#FFD700]" onClick={() => fileInputRef.current?.click()}>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                <span className="text-xs text-white/50">Upload</span>
                                            </div>
                                        )}
                                        {isUploading && <span className="text-[#FFD700] text-sm">Uploading...</span>}
                                    </div>
                                </div>
                            </form>
                            <div className="p-8 border-t border-white/10 bg-[#0f0f0f] flex gap-4">
                                <button type="button" onClick={handleCancel} className="flex-1 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20">Cancel</button>
                                <button onClick={handleSubmit} disabled={isUploading} className="flex-1 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl disabled:opacity-50">{editingId ? 'Save' : 'Add'}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setDeleteConfirm(null)}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8 text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Delete Testimonial?</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl">Cancel</button>
                                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl">Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="grid gap-6">
                    {testimonials.map((item) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/30 transition-all flex justify-between items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-white/30">No Img</div>}
                                </div>
                                <div>
                                    <p className="text-white text-lg italic mb-2">"{item.quote}"</p>
                                    <p className="text-[#FFD700] font-bold">{item.author} <span className="text-white/40 font-normal text-sm ml-2">{item.role}</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Edit</button>
                                <button onClick={() => setDeleteConfirm(item.id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Del</button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && !loading && (
                        <div className="text-center py-20 text-white/50">No testimonials found. Add one!</div>
                    )}
                </div>
            </div>
        </div>
    );
}

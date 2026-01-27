'use client';

import React, { useState, useRef } from 'react';
import { useTestimonials, Testimonial } from '@/context/TestimonialsContext';

interface FormData {
    quote: string;
    author: string;
    role: string;
    image: string;
}

const emptyForm: FormData = {
    quote: '',
    author: '',
    role: '',
    image: '',
};

export default function AdminTestimonialsPage() {
    const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, isLoaded } = useTestimonials();
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setIsUploading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d')!;
                    const size = Math.min(img.width, img.height, 200);
                    canvas.width = size;
                    canvas.height = size;
                    ctx.drawImage(img, 0, 0, size, size);
                    setFormData({ ...formData, image: canvas.toDataURL('image/jpeg', 0.8) });
                    setIsUploading(false);
                };
                img.src = ev.target?.result as string;
            };
            reader.readAsDataURL(file);
        } catch {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.quote || !formData.author) {
            alert('Please fill in quote and author');
            return;
        }
        if (editingId) {
            updateTestimonial(editingId, formData);
            setEditingId(null);
        } else {
            addTestimonial(formData);
        }
        setFormData(emptyForm);
        setShowForm(false);
    };

    const handleEdit = (item: Testimonial) => {
        setFormData({ quote: item.quote, author: item.author, role: item.role, image: item.image });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        deleteTestimonial(id);
        setDeleteConfirm(null);
    };

    const handleCancel = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    if (!isLoaded) {
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
                        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#FFD700]/30 hover:scale-[1.02] transition-all duration-300 text-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                            Add Testimonial
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#141414]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                                    <button onClick={handleCancel} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase tracking-wider">Quote *</label>
                                    <textarea value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} placeholder='"Their work exceeded our expectations..."' rows={4} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FFD700] focus:outline-none resize-none" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-white text-sm font-semibold uppercase tracking-wider">Author Name *</label>
                                        <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="John Smith" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FFD700] focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-white text-sm font-semibold uppercase tracking-wider">Role / Company</label>
                                        <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="CEO of Company" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FFD700] focus:outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase tracking-wider">Author Photo</label>
                                    <div className="flex items-center gap-4">
                                        {formData.image ? (
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">×</button>
                                            </div>
                                        ) : (
                                            <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer ${isUploading ? 'border-[#FFD700]' : 'border-white/20 hover:border-[#FFD700]/50'}`} onClick={() => fileInputRef.current?.click()}>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                {isUploading ? <div className="w-6 h-6 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-30"><path d="M12 5v14M5 12h14" /></svg>}
                                            </div>
                                        )}
                                        <p className="text-white/30 text-sm">Click to upload photo</p>
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
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Delete Testimonial?</h3>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20">Cancel</button>
                                    <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Testimonials List */}
                {testimonials.length === 0 ? (
                    <div className="text-center py-32">
                        <h3 className="text-2xl font-bold text-white mb-3">No testimonials yet</h3>
                        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl mt-6">Add First Testimonial</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {testimonials.map((item) => (
                            <div key={item.id} className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-[#FFD700]/30 transition-all">
                                <p className="text-white text-lg leading-relaxed mb-6">{item.quote}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4AF37] overflow-hidden flex items-center justify-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.author} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{item.author}</h3>
                                            <p className="text-white/40 text-sm">{item.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleEdit(item)} className="px-5 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 text-sm font-medium">Edit</button>
                                        <button onClick={() => setDeleteConfirm(item.id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

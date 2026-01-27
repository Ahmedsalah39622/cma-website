'use client';

import React, { useState, useRef } from 'react';
import { useSiteData, TeamMember } from '@/context/SiteDataContext';

const bgColorOptions = [
    { name: 'Peach', value: '#FFE4C4' },
    { name: 'Pink', value: '#FFB6C1' },
    { name: 'Blue', value: '#B0E0E6' },
    { name: 'Sand', value: '#FFDAB9' },
    { name: 'Lavender', value: '#E6E6FA' },
    { name: 'Mint', value: '#98FB98' },
];

interface FormData {
    name: string;
    role: string;
    image: string;
    bgColor: string;
}

const emptyForm: FormData = {
    name: '',
    role: '',
    image: '',
    bgColor: '#FFE4C4',
};

export default function AdminTeamPage() {
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, isLoaded } = useSiteData();
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image upload handling
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        setIsUploading(true);
        try {
            const base64 = await compressImage(file);
            setFormData({ ...formData, image: base64 });
        } catch {
            alert('Error processing image');
        } finally {
            setIsUploading(false);
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { reject(new Error('Canvas not supported')); return; }
                    let { width, height } = img;
                    const maxSize = 600;
                    if (width > maxSize || height > maxSize) {
                        if (width > height) { height = (height / width) * maxSize; width = maxSize; }
                        else { width = (width / height) * maxSize; height = maxSize; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.role) {
            alert('Please fill in name and role');
            return;
        }
        if (editingId) {
            updateTeamMember(editingId, formData);
            setEditingId(null);
        } else {
            addTeamMember(formData);
        }
        setFormData(emptyForm);
        setShowForm(false);
    };

    const handleEdit = (member: TeamMember) => {
        setFormData({ name: member.name, role: member.role, image: member.image, bgColor: member.bgColor });
        setEditingId(member.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        deleteTeamMember(id);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-80 bg-white/10 rounded-2xl" />)}
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
                            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Team Manager</h1>
                            <p className="text-white/50 mt-3 text-lg">{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#FFD700]/30 hover:scale-[1.02] transition-all duration-300 text-lg"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add Team Member
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#141414]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Member' : 'Add Team Member'}</h2>
                                    <button onClick={handleCancel} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase tracking-wider">Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Smith" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FFD700] focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase tracking-wider">Role *</label>
                                    <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="CEO" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FFD700] focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase tracking-wider">Background Color</label>
                                    <div className="flex gap-3">
                                        {bgColorOptions.map((opt) => (
                                            <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, bgColor: opt.value })} className={`w-10 h-10 rounded-full border-2 ${formData.bgColor === opt.value ? 'border-[#FFD700]' : 'border-transparent'}`} style={{ backgroundColor: opt.value }} title={opt.name} />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-semibold uppercase tracking-wider">Photo</label>
                                    {!formData.image ? (
                                        <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer ${isUploading ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-white/20 hover:border-[#FFD700]/50'}`} onClick={() => fileInputRef.current?.click()}>
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            {isUploading ? <div className="w-8 h-8 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto" /> : <p className="text-white/50">Click to upload</p>}
                                        </div>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square w-32">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">×</button>
                                        </div>
                                    )}
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
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Delete Member?</h3>
                                <p className="text-white/50 mb-8">This action cannot be undone.</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20">Cancel</button>
                                    <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Team Grid */}
                {teamMembers.length === 0 ? (
                    <div className="text-center py-32">
                        <h3 className="text-2xl font-bold text-white mb-3">No team members yet</h3>
                        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl mt-6">Add First Member</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="group bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#FFD700]/30 transition-all">
                                <div className="aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: member.bgColor }}>
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-30"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-white font-bold text-lg">{member.name}</h3>
                                    <p className="text-white/40 text-sm mt-1">{member.role}</p>
                                    <div className="flex gap-3 pt-4 mt-4 border-t border-white/5">
                                        <button onClick={() => handleEdit(member)} className="flex-1 px-4 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 text-sm font-medium">Edit</button>
                                        <button onClick={() => setDeleteConfirm(member.id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
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

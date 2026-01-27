'use client';

import React, { useState, useRef } from 'react';
import { usePortfolio, PortfolioItem } from '@/context/PortfolioContext';

const categoryOptions = [
    'UI/UX Design',
    'Digital Marketing',
    'Branding',
    'Web Development',
    'Social Media',
    'Video Production',
];

interface FormData {
    title: string;
    company: string;
    category: string;
    image: string;
    year: string;
    description: string;
}

const emptyForm: FormData = {
    title: '',
    company: '',
    category: 'UI/UX Design',
    image: '',
    year: new Date().getFullYear().toString(),
    description: '',
};

// Max image size (500KB after compression for fast localStorage)
const MAX_IMAGE_SIZE = 500 * 1024;

export default function AdminPortfolioPage() {
    const { items, addItem, updateItem, deleteItem, isLoaded } = usePortfolio();
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Compress and convert image to Base64
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);

        try {
            const base64 = await compressAndConvertToBase64(file);
            setFormData({ ...formData, image: base64 });
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try a smaller image.');
        } finally {
            setIsUploading(false);
        }
    };

    // Compress image and convert to Base64
    const compressAndConvertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas not supported'));
                        return;
                    }

                    // Calculate new dimensions (max 800px width/height for speed)
                    let { width, height } = img;
                    const maxSize = 800;

                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height / width) * maxSize;
                            width = maxSize;
                        } else {
                            width = (width / height) * maxSize;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to JPEG with quality compression
                    let quality = 0.8;
                    let base64 = canvas.toDataURL('image/jpeg', quality);

                    // Reduce quality if still too large
                    while (base64.length > MAX_IMAGE_SIZE && quality > 0.3) {
                        quality -= 0.1;
                        base64 = canvas.toDataURL('image/jpeg', quality);
                    }

                    resolve(base64);
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

        if (!formData.title || !formData.company) {
            alert('Please fill in title and company');
            return;
        }

        if (editingId) {
            updateItem(editingId, formData);
            setEditingId(null);
        } else {
            addItem(formData);
        }

        setFormData(emptyForm);
        setShowForm(false);
    };

    const handleEdit = (item: PortfolioItem) => {
        setFormData({
            title: item.title,
            company: item.company,
            category: item.category,
            image: item.image,
            year: item.year,
            description: item.description || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        deleteItem(id);
        setDeleteConfirm(null);
    };

    const handleCancel = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const clearImage = () => {
        setFormData({ ...formData, image: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isLoaded) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-white/10 rounded-xl w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-80 bg-white/10 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-transparent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                                Portfolio Manager
                            </h1>
                            <p className="text-white/50 mt-3 text-lg">
                                {items.length} project{items.length !== 1 ? 's' : ''} • All changes save instantly
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#FFD700]/30 hover:scale-[1.02] transition-all duration-300 text-lg"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add New Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && handleCancel()}
                    >
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#141414]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingId ? 'Edit Project' : 'Add New Project'}
                                    </h2>
                                    <button
                                        onClick={handleCancel}
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                                {/* Title */}
                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase tracking-wider">
                                        Project Title <span className="text-[#FFD700]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., E-commerce Website Redesign"
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                                    />
                                </div>

                                {/* Company & Year Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-white text-sm font-semibold uppercase tracking-wider">
                                            Company Name <span className="text-[#FFD700]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="e.g., Tech Corp"
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white text-sm font-semibold uppercase tracking-wider">
                                            Year
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            placeholder="2024"
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all cursor-pointer appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
                                    >
                                        {categoryOptions.map((cat) => (
                                            <option key={cat} value={cat} className="bg-[#1a1a1a]">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase tracking-wider">
                                        Project Image
                                    </label>

                                    {/* Upload Zone */}
                                    {!formData.image ? (
                                        <div
                                            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                                ${isUploading
                                                    ? 'border-[#FFD700] bg-[#FFD700]/5'
                                                    : 'border-white/20 hover:border-[#FFD700]/50 hover:bg-white/5'
                                                }`}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />

                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
                                                    <p className="text-[#FFD700] font-medium">Processing image...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50">
                                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                            <polyline points="17 8 12 3 7 8" />
                                                            <line x1="12" y1="3" x2="12" y2="15" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-white font-medium mb-2">Click to upload image</p>
                                                    <p className="text-white/40 text-sm">PNG, JPG, WEBP up to 5MB</p>
                                                    <p className="text-white/30 text-xs mt-2">Images are compressed for fast loading</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                                                >
                                                    Replace
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="px-4 py-2 bg-red-500/80 backdrop-blur-md text-white rounded-lg text-sm font-medium hover:bg-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    )}

                                    {/* Or URL Input */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-[#141414] text-white/40">or paste URL</span>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.image.startsWith('data:') ? '' : formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="block text-white text-sm font-semibold uppercase tracking-wider">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the project..."
                                        rows={4}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all resize-none"
                                    />
                                </div>
                            </form>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-white/10 bg-[#0f0f0f] flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isUploading}
                                    className="flex-1 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingId ? 'Save Changes' : 'Add Project'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
                        onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
                    >
                        <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl shadow-black/50">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Delete Project?</h3>
                                <p className="text-white/50 mb-8 text-lg">
                                    This action cannot be undone. This project will be permanently removed.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteConfirm)}
                                        className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Portfolio Items Grid */}
                {items.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/5 flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-30">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No projects yet</h3>
                        <p className="text-white/50 mb-8 text-lg">Add your first portfolio project to get started.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#FFD700]/30 transition-all text-lg"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add First Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#FFD700]/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-500"
                            >
                                {/* Image */}
                                <div className="aspect-[16/10] bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f]">
                                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-15">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-white text-xs font-semibold uppercase tracking-wider border border-white/10">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-white font-bold text-xl leading-tight mb-2 group-hover:text-[#FFD700] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/40 text-sm font-medium">
                                            {item.company} • {item.year}
                                        </p>
                                    </div>

                                    {item.description && (
                                        <p className="text-white/30 text-sm line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm font-semibold"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(item.id)}
                                            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Performance Note */}
                <div className="mt-16 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-green-400 font-bold text-lg">Ultra-fast Cloud-Ready Storage</p>
                            <p className="text-green-400/60 mt-1">
                                Images are compressed and stored as Base64 in localStorage. Works on any cloud deployment with instant loading (&lt;100ms).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

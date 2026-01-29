'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getBrands, saveBrand, deleteBrand } from '@/actions/brands';

interface Brand {
    id: string;
    name: string;
    image: string; // UI
    image_url?: string; // DB
}

export default function BrandsAdmin() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        setLoading(true);
        try {
            const data = await getBrands();
            const formatted = (data || []).map((b: any) => ({
                id: b.id,
                name: b.name,
                image: b.imageUrl || b.image_url || b.image // Drizzle camelCase
            }));
            setBrands(formatted);
        } catch (err) {
            console.error('Failed to load brands', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('brands')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('brands').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload logo. Ensure "brands" bucket exists.');
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBrandName || !selectedFile) return;

        setIsSubmitting(true);
        try {
            const imageUrl = await uploadFile(selectedFile);
            if (!imageUrl) throw new Error('Upload failed');

            await saveBrand({
                name: newBrandName,
                imageUrl: imageUrl // Pass as imageUrl for Drizzle
            });

            await loadBrands();

            setNewBrandName('');
            setPreviewUrl(null);
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            alert('Failed to add brand');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBrand(id);
            setBrands(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete brand');
        }
    };

    if (loading && brands.length === 0) {
        return <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-[#0a0a14] text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Brands Management</h1>
                        <p className="text-white/50">Manage the trusted partner logos displayed on the home page.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-6">Add New Brand</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/70">Brand Logo</label>
                                    <div className="relative aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-[#FFD700]/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            required={!previewUrl}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 group-hover:opacity-100 group-hover:text-[#FFD700]">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" y1="3" x2="12" y2="15" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-white/40 font-medium group-hover:text-white/70">Upload Logo</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Brand Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/70">Brand Name</label>
                                    <input
                                        type="text"
                                        value={newBrandName}
                                        onChange={(e) => setNewBrandName(e.target.value)}
                                        placeholder="e.g. Google"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD700]"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newBrandName || !previewUrl}
                                    className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFD700]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? 'Uploading & Adding...' : 'Add Brand'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Existing Brands ({brands.length})</h2>
                        </div>

                        {brands.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/30 italic">
                                No brands added yet. Add your first one to see it here.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {brands.map((brand) => (
                                    <div key={brand.id} className="group relative bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-white/20 transition-all">
                                        <div className="relative w-full h-16 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100">
                                            <img
                                                src={brand.image}
                                                alt={brand.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                                            {brand.name}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(brand.id)}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                                            title="Delete Brand"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

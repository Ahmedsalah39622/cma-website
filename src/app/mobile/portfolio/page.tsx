'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Grid, List, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

import Footer from '@/components/Footer';

export default function MobilePortfolioPage() {
    const { items: projects } = usePortfolio();
    const safeProjects = projects || [];

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter logic
    const filteredProjects = selectedCategory === 'All'
        ? safeProjects
        : safeProjects.filter((p: any) => p.category === selectedCategory);

    // Categories
    const categories = ['All', ...Array.from(new Set(safeProjects.map((p: any) => p.category))).filter(Boolean)];

    return (
        <div className="bg-slate-50 min-h-screen font-sans pb-20">

            {/* --- Header --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 px-6 py-4 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <Link
                        href="/mobile"
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <span className="font-bold text-slate-900 text-sm tracking-wide uppercase opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards">
                        Portfolio
                    </span>

                    <div className="flex bg-slate-100 rounded-full p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- Hero --- */}
            <div className="pt-32 px-6 mb-8 text-center">
                <h1 className="text-5xl font-black text-slate-900 leading-[0.9] tracking-tight mb-4">
                    Selected <br />
                    <span className="text-black">Portfolio.</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm max-w-[250px] mx-auto leading-relaxed">
                    Crafting digital experiences that leave a lasting impression.
                </p>
            </div>

            {/* --- Filter Bar (Sticky) --- */}
            <div className="z-40 bg-slate-50/95 backdrop-blur-sm py-4 mb-4 border-b border-white/0 transition-all">
                <div className="overflow-x-auto scrollbar-hide px-6 flex items-center gap-3">
                    {categories.map((cat: any) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                                ? 'bg-slate-900 text-white shadow-lg scale-105'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-gold/50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Content --- */}
            <div className="px-6 min-h-[50vh]">

                {/* Count */}
                <div className="flex items-center justify-end mb-6">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        {filteredProjects.length} PROJECTS
                    </span>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProjects.map((project: any, index: number) => (
                            <Link
                                key={project.id || index}
                                href={`/project/${project.id || index}?force=desktop`}
                                className="group relative block"
                            >
                                <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative transition-transform duration-500 active:scale-[0.98]">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <div className="mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[8px] font-bold text-white uppercase tracking-wider mb-2 border border-white/10">
                                                {project.category}
                                            </span>
                                            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Year Badge */}
                                    {project.year && (
                                        <div className="absolute top-3 right-3">
                                            <span className="flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full w-8 h-8 text-[9px] font-bold text-white border border-white/10">
                                                {project.year.slice(-2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="space-y-6">
                        {filteredProjects.map((project: any, index: number) => (
                            <Link
                                key={project.id || index}
                                href={`/project/${project.id || index}?force=desktop`}
                                className="block group bg-white rounded-3xl p-3 shadow-sm border border-slate-100 active:scale-[0.98] transition-all"
                            >
                                <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-sm">
                                        {project.category}
                                    </div>
                                </div>
                                <div className="px-2 pb-2 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{project.title}</h3>
                                        <p className="text-slate-400 text-xs line-clamp-1">{project.description || 'No description available'}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                                        <ArrowLeft size={18} className="rotate-180" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Sparkles size={48} className="text-slate-300 mb-4" />
                        <p className="font-bold text-slate-900">No Projects Found</p>
                        <p className="text-xs text-slate-400">Try changing the category</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

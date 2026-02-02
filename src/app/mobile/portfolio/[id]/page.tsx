'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Star, Calendar, Globe } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function ProjectGalleryPage() {
    const params = useParams();
    const projectId = params.id as string;
    const { items: projects } = usePortfolio();
    const safeProjects = projects || [];
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const foundProject = safeProjects.find((p: any, index: number) =>
            p.id === projectId || p.id === parseInt(projectId) || index === parseInt(projectId)
        );
        setProject(foundProject || null);
    }, [projectId, safeProjects]);

    if (!project) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 text-lg mb-4">Project not found</p>
                    <Link href="/mobile/portfolio" className="text-gold font-semibold">
                        ← Back to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    // Combine main image with gallery images
    const allImages = [
        project.image,
        ...(project.galleryImages || [])
    ].filter(Boolean);

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href="/mobile/portfolio"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Back</span>
                    </Link>
                    <h1 className="font-bold text-sm truncate max-w-[150px]">{project.title}</h1>
                    <div className="w-16" />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-6">

                {/* Hero Section */}
                <div className="mb-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-4">
                        <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold">Portfolio</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-gold uppercase tracking-wider text-xs font-semibold">{project.category}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        {project.title}
                    </h1>

                    {/* Subtitle with Year */}
                    <div className="flex items-center gap-3 text-slate-500">
                        <span className="font-medium">{project.title}</span>
                        <Star size={14} className="text-gold fill-gold" />
                        <span className="font-medium">{project.year || new Date().getFullYear()}</span>
                    </div>
                </div>

                {/* Main Project Image */}
                <div className="rounded-3xl overflow-hidden shadow-xl mb-10 border border-slate-100">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto"
                    />
                </div>

                {/* Description */}
                {project.description && (
                    <div className="mb-10">
                        <p className="text-slate-600 text-base leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                )}

                {/* External Link */}
                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-slate-950 text-white py-4 rounded-2xl font-bold text-base hover:bg-slate-800 active:scale-[0.98] transition-all mb-10"
                    >
                        <Globe size={18} />
                        Visit Project
                        <ExternalLink size={16} />
                    </a>
                )}

                {/* Project Gallery */}
                {allImages.length > 1 && (
                    <div className="mt-8">
                        {/* Section Title */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-0.5 bg-gold rounded-full" />
                            <h2 className="text-xl font-black text-slate-900">Project Gallery</h2>
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {allImages.map((img: string, index: number) => (
                                <div
                                    key={index}
                                    className={`rounded-2xl overflow-hidden shadow-lg border border-slate-100 ${index === 0 ? 'col-span-2' : ''}`}
                                >
                                    <img
                                        src={img}
                                        alt={`${project.title} - ${index + 1}`}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Links */}
                {project.socialLinks && project.socialLinks.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-0.5 bg-gold rounded-full" />
                            <h2 className="text-xl font-black text-slate-900">Follow Project</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {project.socialLinks.map((social: any, index: number) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-3 rounded-xl transition-colors"
                                >
                                    <img
                                        src={`https://cdn.simpleicons.org/${social.platform}/64748b`}
                                        alt={social.platform}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-sm font-semibold text-slate-700 capitalize">
                                        {social.platform}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Video Section */}
                {project.videoUrl && (
                    <div className="mt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-0.5 bg-gold rounded-full" />
                            <h2 className="text-xl font-black text-slate-900">Project Video</h2>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
                            {project.videoType === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl)}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            ) : project.videoType === 'vimeo' ? (
                                <iframe
                                    src={`https://player.vimeo.com/video/${extractVimeoId(project.videoUrl)}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={project.videoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// Helper functions
function extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
}

function extractVimeoId(url: string): string {
    const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    return match ? match[1] : '';
}

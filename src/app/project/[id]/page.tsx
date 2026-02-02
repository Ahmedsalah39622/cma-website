'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProject } from '@/actions/portfolio'; // Server Action
import { PortfolioItem, usePortfolio } from '@/context/PortfolioContext'; // Type definition & Hook
import GeometricBackground from '@/components/GeometricBackground';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const searchParams = useSearchParams();
    const isFromMobile = searchParams.get('from') === 'mobile';

    // Client-side context for fallback
    const { items: localProjects, isLoaded: isPortfolioLoaded } = usePortfolio();

    const [project, setProject] = useState<any | null>(null); // Use any to bridge DB/Context types or interface
    const [loading, setLoading] = useState(true);
    const [activeMedia, setActiveMedia] = useState<{
        type: 'image' | 'video';
        url: string;
        videoType?: string;
    } | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadProject() {
            setLoading(true);
            try {
                // 1. Try fetching from Server (DB)
                const data = await getProject(id);

                if (!isMounted) return;

                if (data) {
                    // ... (Server Data Found)
                    console.log('Project loaded from Server:', data.id);
                    setProject({
                        ...data,
                        image: data.imageUrl || (data as any).image || (data as any).imageUrl,
                        gallery: Array.isArray(data.gallery) ? data.gallery : [],
                        additionalVideos: Array.isArray(data.additionalVideos) ? data.additionalVideos : [],
                        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
                    });
                    setLoading(false); // Success from Server
                } else {
                    // 2. Fallback: Try fetching from Local Context
                    console.warn('Project not found on Server, checking Local Storage...');

                    // CRITICAL FIX: Only check local if portfolio is fully loaded
                    if (!isPortfolioLoaded) {
                        console.log('Waiting for portfolio hydration...');
                        // Don't finish loading, wait for next render when isPortfolioLoaded becomes true
                        return;
                    }

                    const localProject = localProjects.find(p => p.id === id);

                    if (localProject) {
                        console.log('Project loaded from Local Storage:', localProject.id);
                        setProject({
                            ...localProject,
                            videoUrl: localProject.videoUrl || '',
                            videoType: localProject.videoType || 'youtube',
                            additionalVideos: localProject.additionalVideos || [],
                            socialLinks: localProject.socialLinks || [],
                            gallery: localProject.gallery || [],
                            description: localProject.description || '',
                        });
                        setLoading(false); // Success from Local
                    } else {
                        console.error('Project not found locally for ID:', id);
                        setProject(null);
                        setLoading(false); // Failed both
                    }
                }
            } catch (err) {
                console.error('Error in loadProject:', err);
                // Retry fallback on error
                if (isPortfolioLoaded) {
                    const localProject = localProjects.find(p => p.id === id);
                    if (localProject)
                        setProject(localProject);
                    else
                        setProject(null);
                }
                setLoading(false);
            }
        }

        loadProject();
        return () => { isMounted = false; };
    }, [id, localProjects, isPortfolioLoaded]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black p-6">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>

                {/* Debug Info */}
                <div className="bg-slate-100 p-4 rounded-lg text-xs font-mono text-left max-w-md w-full mb-6 overflow-auto max-h-60 border border-slate-300">
                    <p className="font-bold text-red-600 mb-2">DEBUG INFO:</p>
                    <p>Requested ID: <span className="bg-yellow-200 px-1">{params && (params as any).id ? (params as any).id : id}</span></p>
                    <p>Is Loaded: {isPortfolioLoaded ? 'YES' : 'NO'}</p>
                    <p>Local Projects Count: {localProjects.length}</p>
                    <hr className="my-2 border-slate-300" />
                    <p className="font-bold mb-1">Available IDs:</p>
                    <ul className="list-disc pl-4">
                        {localProjects.map(p => (
                            <li key={p.id} className={p.id === id ? "text-green-600 font-bold" : ""}>
                                {p.id} <span className="text-slate-400">({p.title})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link href="/mobile/portfolio" className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#FFD700]/90 transition-all">
                    Back to Mobile Portfolio
                </Link>
            </div>
        );
    }

    // Combine main video and additional videos
    const allVideos = [];
    if (project.videoUrl) {
        allVideos.push({ type: project.videoType || 'youtube', url: project.videoUrl });
    }
    if (project.additionalVideos && Array.isArray(project.additionalVideos)) {
        allVideos.push(...project.additionalVideos);
    }


    const allImages = [];
    if (project.image) allImages.push(project.image);
    if (project.gallery && Array.isArray(project.gallery)) allImages.push(...project.gallery);

    const getEmbedUrl = (url: string, type: string) => {
        if (!url) return '';

        if (type === 'youtube') {
            let videoId = '';
            if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
            else if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
            else videoId = url.split('/').pop() || '';
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        if (type === 'instagram') {
            if (url.includes('/embed')) return url;
            const cleanUrl = url.endsWith('/') ? url : `${url}/`;
            return `${cleanUrl}embed`;
        }
        if (type === 'vimeo') {
            const videoId = url.split('/').pop();
            return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        }
        if (type === 'tiktok') {
            // Extract ID if full URL, or assume typical embed format
            let videoId = '';
            if (url.includes('/video/')) videoId = url.split('/video/')[1]?.split('?')[0];
            else videoId = url.split('/').pop() || '';
            return `https://www.tiktok.com/embed/v2/${videoId}`;
        }
        if (type === 'facebook') {
            // Facebook requires full plugin URL usually, but basic watch/share URLs might work with some endpoints
            // Best effort: usage of facebook plugin endpoint if they provide just a post URL
            if (url.includes('facebook.com/plugins')) return url;
            return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
        }
        // LinkedIn and Twitter generally don't support simple iframe embeds of standard URLs without scripts. 
        // We will return the URL, assuming the user might paste the 'src' from an embed code.
        return url;
    };

    // Helper for grid preview (no autoplay)
    const getPreviewUrl = (url: string, type: string) => {
        if (type === 'youtube') {
            let videoId = '';
            if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
            else if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
            else videoId = url.split('/').pop() || '';
            return `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0`;
        }
        return getEmbedUrl(url, type).replace('?autoplay=1', '');
    };

    return (
        <main className="min-h-screen bg-[#FFFFFF] text-[#0a0a14] selection:bg-[#FFD700] selection:text-black">
            {/* Global Header */}
            {!isFromMobile && <Header />}

            {/* Mobile Back Button */}
            {isFromMobile && (
                <div className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-black/5 px-4 py-3 flex items-center justify-between shadow-sm">
                    <Link
                        href="/mobile/portfolio"
                        className="flex items-center gap-2 text-slate-900 font-bold text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all"
                    >
                        <span>←</span> Back
                    </Link>
                    <span className="font-bold text-sm truncate max-w-[150px] text-slate-900">{project?.title}</span>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pb-24 overflow-hidden" style={{ paddingTop: '150px' }}>
                <GeometricBackground pattern="hexagon" position="right" opacity={0.03} color="#000" />
                <div className="container-custom relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        {/* Text Content */}
                        <div className="flex-1 space-y-8 order-2 lg:order-1">
                            {/* Breadcrumb-style meta */}
                            <div className="flex items-center gap-3 text-black/60 font-medium tracking-wider text-sm uppercase">
                                <Link href="/#portfolio" className="hover:text-[#FFD700] transition-colors">Portfolio</Link>
                                <span>/</span>
                                <span className="text-[#dcbb0a] font-bold">{project.category}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] text-[#0a0a14]">
                                {project.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-black/50">
                                <span>{project.company}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] self-center" />
                                <span>{project.year}</span>
                            </div>

                            {project.description && (
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl border-l-4 border-[#FFD700]/50 pl-6">
                                    {project.description}
                                </p>
                            )}

                            {/* Actions */}

                        </div>

                        {/* Hero Image */}
                        {project.image && (
                            <div className="flex-1 w-full order-1 lg:order-2">
                                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-black/5 group">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Combined Gallery Section */}
            {(allImages.length > 0 || allVideos.length > 0) && (
                <section className="py-32 lg:pb-40 bg-gray-50 border-y border-black/5">
                    <div className="container-custom">
                        <h2 className="text-3xl font-bold mb-16 flex items-center gap-4 text-[#0a0a14]">
                            <span className="w-10 h-[3px] bg-[#FFD700]" />
                            Project Gallery
                        </h2>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
                            {/* Videos First */}
                            {allVideos.map((video, idx) => (
                                <div
                                    key={`vid-${idx}`}
                                    className="break-inside-avoid relative rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 group cursor-pointer p-4"
                                    style={{ marginBottom: '40px', display: 'inline-block', width: '100%' }}
                                    onClick={() => setActiveMedia({ type: 'video', url: video.url, videoType: video.type })}
                                >
                                    <div className="relative aspect-video pointer-events-none">
                                        {video.type === 'mp4' ? (
                                            <video
                                                src={video.url}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <iframe
                                                src={getPreviewUrl(video.url, video.type)}
                                                className="w-full h-full"
                                                tabIndex={-1}
                                            />
                                        )}
                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                                            <span className="uppercase tracking-wider font-bold text-xs text-black/50">{video.type} Video</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Images */}
                            {allImages.map((img, idx) => (
                                <div
                                    key={`img-${idx}`}
                                    className="break-inside-avoid relative rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer group p-4"
                                    style={{ marginBottom: '40px', display: 'inline-block', width: '100%' }}
                                    onClick={() => setActiveMedia({ type: 'image', url: img })}
                                >
                                    <img
                                        src={img}
                                        alt={`${project.title} ${idx}`}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-black p-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Media Lightbox */}
            {activeMedia && (
                <div
                    className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setActiveMedia(null)}
                >
                    <button
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/5 text-black hover:bg-black/10 flex items-center justify-center transition-colors hover:scale-110 z-[110]"
                        onClick={() => setActiveMedia(null)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="w-full max-w-6xl max-h-[90vh] flex items-center justify-center p-2"
                        onClick={e => e.stopPropagation()}
                    >
                        {activeMedia.type === 'image' ? (
                            <img
                                src={activeMedia.url}
                                alt="Full view"
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        ) : (
                            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                                {activeMedia.videoType === 'mp4' ? (
                                    <video
                                        src={activeMedia.url}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <iframe
                                        src={getEmbedUrl(activeMedia.url, activeMedia.videoType || 'youtube')}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}

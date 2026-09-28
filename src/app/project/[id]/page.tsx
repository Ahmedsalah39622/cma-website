'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProject } from '@/actions/portfolio'; // Server Action
import { PortfolioItem, usePortfolio } from '@/context/PortfolioContext'; // Type definition & Hook
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ASAluminiumCase from '@/components/ASAluminiumCase';
import CmaNavigation from '@/components/CmaNavigation';
import { ArrowUpRight } from 'lucide-react';
import '../../cma-homepage.css';
import '../cma-project.css';


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

    // Custom check for AS For Aluminium upgrade showcase page
    const isASAluminium = project.id === '45cc0e66-8ff8-4cb2-b084-0a267fb09e2c' || 
                          project.company?.toLowerCase().includes('aluminium') || 
                          project.title?.toLowerCase().includes('aluminium');

    if (isASAluminium) {
        return (
            <main className="min-h-screen bg-[#07080B] text-[#F5F5F7] selection:bg-[var(--md-sys-color-primary)] selection:text-white">
                {/* Global Header */}
                {!isFromMobile && <Header />}

                {/* Mobile Back Button (if loaded within a mobile context but using this route) */}
                {isFromMobile && (
                    <div className="fixed top-0 left-0 right-0 z-[100] bg-[#07080B]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-sm">
                        <Link
                            href="/mobile/portfolio"
                            className="flex items-center gap-2 text-white font-bold text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all"
                        >
                            <span>←</span> Back
                        </Link>
                        <span className="font-bold text-sm truncate max-w-[150px] text-white">{project?.title}</span>
                    </div>
                )}

                <div style={{ paddingTop: isFromMobile ? '64px' : '0px' }}>
                    <ASAluminiumCase project={project} isMobileView={isFromMobile} />
                </div>

                {!isFromMobile && <Footer />}
            </main>
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
        <main className="cma-site cma-case-study">
            {/* Global Header */}
            {!isFromMobile && <CmaNavigation homeLinks />}

            {/* Mobile Back Button */}
            {isFromMobile && (
                <div className="cma-case-mobile-bar">
                    <Link
                        href="/work"
                        className="cma-case-back"
                    >
                        <span aria-hidden="true">←</span> Back to work
                    </Link>
                    <span>{project?.title}</span>
                </div>
            )}

            {/* Hero Section */}
            <section className="cma-case-hero">
                    <div className="cma-case-hero-inner">
                        {/* Text Content */}
                        <div className="cma-case-copy">
                            {/* Breadcrumb-style meta */}
                            <div className="cma-case-breadcrumb">
                                <Link href="/#work">Work</Link>
                                <span>/</span>
                                <span>{project.category}</span>
                            </div>

                            <h1>
                                {project.title}
                            </h1>

                            <div className="cma-case-facts">
                                <span>{project.company}</span>
                                <span />
                                <span>{project.year}</span>
                            </div>

                            {project.description && (
                                <p className="cma-case-description">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        {/* Hero Image */}
                        {project.image && (
                            <div className="cma-case-image">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                    />
                            </div>
                        )}
                    </div>
            </section>

            {/* Combined Gallery Section */}
            {(allImages.length > 0 || allVideos.length > 0) && (
                <section className="cma-case-gallery-section">
                    <div className="cma-case-gallery-inner">
                        <div className="cma-case-gallery-heading"><div><p className="cma-kicker">MORE FROM THIS PROJECT</p><h2>Project gallery</h2></div><span>{allImages.length + allVideos.length} ITEMS</span></div>

                        <div className="cma-case-gallery-grid">
                            {/* Videos First */}
                            {allVideos.map((video, idx) => (
                                <button
                                    type="button"
                                    aria-label={`Play ${video.type} video`}
                                    key={`vid-${idx}`}
                                    className="cma-gallery-item cma-gallery-video"
                                    onClick={() => setActiveMedia({ type: 'video', url: video.url, videoType: video.type })}
                                >
                                    <div className="cma-gallery-media">
                                        {video.type === 'mp4' ? (
                                            <video
                                                src={video.url}
                                            />
                                        ) : (
                                            <iframe
                                                src={getPreviewUrl(video.url, video.type)}
                                                tabIndex={-1}
                                            />
                                        )}
                                        {/* Play Overlay */}
                                        <div className="cma-gallery-play">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                        </div>
                                    </div>
                                    <div className="cma-gallery-caption">{video.type} video</div>
                                </button>
                            ))}

                            {/* Images */}
                            {allImages.map((img, idx) => (
                                <button
                                    type="button"
                                    aria-label={`View image ${idx + 1} for ${project.title}`}
                                    key={`img-${idx}`}
                                    className="cma-gallery-item"
                                    onClick={() => setActiveMedia({ type: 'image', url: img })}
                                >
                                    <img
                                        src={img}
                                        alt={`${project.title} ${idx}`}
                                    />
                                    <div className="cma-gallery-caption">View image {idx + 1}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Media Lightbox */}
            {activeMedia && (
                <div
                    className="cma-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Project media preview"
                    onClick={() => setActiveMedia(null)}
                >
                    <button
                        className="cma-lightbox-close"
                        type="button"
                        aria-label="Close media preview"
                        onClick={() => setActiveMedia(null)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="cma-lightbox-content"
                        onClick={e => e.stopPropagation()}
                    >
                        {activeMedia.type === 'image' ? (
                            <img
                                src={activeMedia.url}
                                alt="Full view"
                            />
                        ) : (
                            <div className="cma-lightbox-video">
                                {activeMedia.videoType === 'mp4' ? (
                                    <video
                                        src={activeMedia.url}
                                        controls
                                        autoPlay
                                    />
                                ) : (
                                    <iframe
                                        src={getEmbedUrl(activeMedia.url, activeMedia.videoType || 'youtube')}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <footer className="cma-footer"><Link className="cma-wordmark" href="/" aria-label="CMA home"><span className="cma-mark" aria-hidden="true">C</span><span>CMA<span className="cma-wordmark-period">.</span></span></Link><p>Good ideas. Good people. Good work.</p><Link href="/#contact">Discuss a project <ArrowUpRight size={15} /></Link><span>© {new Date().getFullYear()} CMA Studio</span></footer>
        </main>
    );
}

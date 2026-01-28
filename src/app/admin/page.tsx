'use client';

import Link from 'next/link';

const adminSections = [
    {
        name: 'Portfolio',
        href: '/admin/portfolio',
        description: 'Manage your portfolio projects, images, and case studies',
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-500/10',
    },
    {
        name: 'Services',
        href: '/admin/services',
        description: 'Manage your service offerings and categories',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        color: 'from-yellow-500 to-amber-600',
        bgColor: 'bg-yellow-500/10',
    },
    {
        name: 'Team Members',
        href: '/admin/team',
        description: 'Add, edit, and remove team members with photos',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/10',
    },
    {
        name: 'Testimonials',
        href: '/admin/testimonials',
        description: 'Manage client testimonials and reviews',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        color: 'from-purple-500 to-violet-600',
        bgColor: 'bg-purple-500/10',
    },
    {
        name: 'Brands',
        href: '/admin/brands',
        description: 'Manage trusted partner logos and brands',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        color: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-500/10',
    },
    {
        name: 'Contact',
        href: '/admin/contact',
        description: 'View contact submissions and update contact information',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'from-orange-500 to-amber-600',
        bgColor: 'bg-orange-500/10',
    },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-6 lg:px-8 pb-20">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#FFD700]/20 to-[#D4AF37]/20 border border-[#FFD700]/30 rounded-full mb-8">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[#FFD700] font-medium text-sm">System Online</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                    Admin Dashboard
                </h1>
                <p className="text-white/50 text-lg lg:text-xl max-w-2xl mx-auto">
                    Manage your website content with ease. All changes are saved instantly.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="w-full max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {adminSections.map((section) => (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10 hover:border-[#FFD700]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FFD700]/5"
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 ${section.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`bg-gradient-to-r ${section.color} bg-clip-text text-white`}
                                >
                                    <path d={section.icon} />
                                </svg>
                            </div>

                            {/* Content */}
                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition-colors">
                                {section.name}
                            </h2>
                            <p className="text-white/50 leading-relaxed">
                                {section.description}
                            </p>

                            {/* Arrow */}
                            <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-16 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-8">
                    <h3 className="text-white/40 text-sm font-semibold uppercase tracking-wider mb-6">Quick Info</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-3xl font-bold text-white">⚡</p>
                            <p className="text-white/50 text-sm mt-2">Ultra-fast saves via localStorage</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">📸</p>
                            <p className="text-white/50 text-sm mt-2">Auto-compressed images</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">☁️</p>
                            <p className="text-white/50 text-sm mt-2">Cloud-ready deployment</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">🔄</p>
                            <p className="text-white/50 text-sm mt-2">Instant live updates</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

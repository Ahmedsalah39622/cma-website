"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, Code, Zap, BarChart3, ChevronDown,
  Mail, Phone, Instagram, Linkedin, MessageCircle,
  Star, Shield, Target, TrendingUp, Users, Sparkles,
  Quote, Calendar, Clock
} from 'lucide-react';

import { useServices, ServiceIcons } from '@/context/ServicesContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useFAQs } from '@/context/FAQContext';
import { useBrands } from '@/context/BrandsContext';
import { useTestimonials } from '@/context/TestimonialsContext';
import { useBlog } from '@/context/BlogContext';
import { useSiteData } from '@/context/SiteDataContext';

export default function MobilePage() {
  const { services: dynamicServices } = useServices();
  const { items: dynamicProjects } = usePortfolio();
  const { faqs: dynamicFaqs } = useFAQs();
  const { brands: dynamicBrands } = useBrands();
  const { testimonials: dynamicTestimonials } = useTestimonials();
  const { posts: dynamicPosts } = useBlog();
  const { teamMembers: dynamicTeam, contactInfo, visibility } = useSiteData();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { label: "Active Clients", value: "230+", icon: <Users size={16} /> },
    { label: "Projects Done", value: "420+", icon: <Target size={16} /> },
    { label: "Success Rate", value: "98%", icon: <TrendingUp size={16} /> }
  ];

  if (!visibility) return null;

  return (
    <div className="bg-[#FDFDFD] min-h-screen text-slate-900 font-sans selection:bg-gold/30 overflow-x-hidden">

      {/* --- Minimal Pill Navbar with Sidebar Menu --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-5 py-5">

        {/* Main Pill Bar */}
        <div className="flex justify-between items-center bg-white/95 backdrop-blur-xl px-4 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CMA" className="w-7 h-7 object-contain" />
            <span className="text-slate-900 font-bold text-base tracking-wide">CMA</span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 flex items-center justify-center active:scale-95 transition-all"
          >
            <div className="flex flex-col gap-1 items-center justify-center">
              <span className={`block w-5 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* --- Sidebar Overlay --- */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* --- Vertical Sidebar --- */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-slate-950 z-[200] shadow-2xl transition-transform duration-500 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-white text-xl">✕</span>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="px-6 flex flex-col h-[calc(100%-100px)]">

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 flex-1">
            <a
              href="#services"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all border-b border-white/5"
            >
              <Zap size={22} className="text-gold" />
              <span className="text-white font-semibold text-lg">Services</span>
            </a>

            <a
              href="#portfolio"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all border-b border-white/5"
            >
              <Target size={22} className="text-gold" />
              <span className="text-white font-semibold text-lg">Portfolio</span>
            </a>

            <a
              href="#testimonials"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all border-b border-white/5"
            >
              <Star size={22} className="text-gold" />
              <span className="text-white font-semibold text-lg">Testimonials</span>
            </a>


          </div>

          {/* Contact CTA at bottom */}
          <div className="pb-10">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-gold to-amber-400 px-6 py-4 rounded-2xl active:scale-[0.98] transition-all w-full"
            >
              <MessageCircle size={20} className="text-slate-900" />
              <span className="text-slate-900 font-bold text-lg">Contact Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* --- Hero Section --- */}
      {visibility.hero !== false && (
        <section className="pt-[28rem] pb-48 px-8 relative overflow-hidden text-center mb-40">
          {/* Animated Background Blobs */}
          <div className="absolute top-20 -left-20 w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-60 -right-20 w-80 h-80 bg-gold/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-slate-900/[0.04] border border-slate-900/5 px-5 py-2.5 rounded-full mb-12">
              <Sparkles size={14} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[.3em] text-slate-500">The Gold Standard Agency</span>
            </div>

            <h1 className="text-[4rem] font-[1000] leading-[0.9] tracking-tighter mb-12 text-slate-950">
              Design <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">Your Future</span> <br />
              <span className="inline-flex items-center gap-4 justify-center">
                <span className="text-gold italic font-serif lowercase text-[3rem]">with</span>
                <span>CMA</span>
              </span>
            </h1>

            <p className="text-slate-500 text-xl leading-relaxed max-w-[90%] mb-16 font-medium mx-auto">
              We don't just market; we build <span className="text-slate-950 font-bold underline decoration-gold/50 underline-offset-8">legacies</span> for brands that dare to lead in a digital world.
            </p>

            <div className="flex flex-col gap-8 w-full items-center">
              <button className="w-full max-w-sm bg-slate-950 text-white py-7 rounded-[2rem] font-black text-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all">
                Ignite Growth <ArrowRight size={22} className="text-gold" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --- Brands Section (Marquee) --- */}
      {visibility.brands !== false && dynamicBrands.length > 0 && (
        <section className="py-24 mt-32 bg-white border-y border-slate-50 relative overflow-hidden">
          {/* Title */}
          <div className="text-center mb-12 px-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em] mb-3">Trusted Partners</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Brands We Worked With</h2>
          </div>

          <div className="flex animate-marquee gap-20 whitespace-nowrap">
            {[...dynamicBrands, ...dynamicBrands].map((brand, i) => (
              <div key={i} className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <img src={brand.image} alt={brand.name} className="h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Stats Section --- */}
      <section className="px-6 py-40 mt-24 bg-slate-50 border-y border-slate-100/50">
        <div className="grid grid-cols-2 gap-5 max-w-md mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 ${i === 0 ? 'col-span-2' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-inner">
                {stat.icon}
              </div>
              <div>
                <h4 className="text-[2.5rem] font-black text-slate-950 leading-tight mb-1">{stat.value}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Services Section --- */}
      {visibility.services !== false && (
        <section className="px-6 py-40 bg-white rounded-[4.5rem] mt-24 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden text-center border border-slate-100">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="mb-20 relative z-10 px-4">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full mb-6 mx-auto">
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Our Services</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Elite solutions for <br />
              <span className="italic font-serif text-gold lowercase">modern</span> brands.
            </h2>
          </div>

          <div className="grid gap-8 relative z-10 max-w-sm mx-auto">
            {dynamicServices.map((s, i) => (
              <div key={i} className="bg-slate-50 backdrop-blur-xl border border-slate-100 p-10 rounded-[3rem] group active:scale-[0.97] transition-all flex flex-col items-center shadow-sm">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-slate-100 mb-8 shadow-sm">
                  {ServiceIcons[s.iconType] || <Code size={28} className="text-gold" />}
                </div>
                <div className="mb-6">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[.3em] border border-gold/20 px-4 py-2 rounded-full mb-5 inline-block bg-gold/5">Service</span>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-base font-medium">{s.count}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest pt-4 hover:text-gold transition-colors cursor-pointer group-hover:gap-4 transition-all duration-300">
                  Learn More <ArrowRight size={16} className="text-gold" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Portfolio Section --- */}
      {visibility.portfolio !== false && (
        <section className="px-8 py-48 mt-24 text-center bg-white">
          <div className="flex flex-col items-center mb-24 gap-4">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full mb-4">
              <Sparkles size={12} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[.3em] text-slate-400">Our Gallery</span>
            </div>
            <h2 className="text-[3.5rem] font-black leading-[1] tracking-tight text-slate-950">
              Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 underline decoration-gold/20 underline-offset-[12px] decoration-4">Portfolio</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-[280px] mt-6 mx-auto leading-relaxed">
              Showcasing our finest projects that blend art with modern digital marketing strategies
            </p>
          </div>

          <div className="space-y-24 max-w-sm mx-auto">
            {dynamicProjects.slice(0, 5).map((p, i) => (
              <div key={i} className="group cursor-pointer text-center relative">
                <div className={`aspect-[4/5] bg-slate-50 rounded-[4.5rem] mb-10 overflow-hidden relative shadow-2xl border border-slate-100 group-hover:scale-[1.03] transition-all duration-700`}>
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40" />

                  <div className="absolute top-10 right-10">
                    <div className="bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-[11px] font-black text-slate-950 shadow-2xl border border-white/20">{p.year}</div>
                  </div>

                  <div className="absolute bottom-12 left-0 w-full px-10 flex flex-col items-center">
                    <span className="bg-slate-950/90 backdrop-blur-md text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[.4em] inline-block shadow-2xl border border-white/5">{p.category}</span>
                  </div>
                </div>
                <h4 className="text-3xl font-[1000] text-slate-950 px-4 group-hover:text-gold transition-colors duration-300 tracking-tight">{p.title}</h4>
                <div className="w-10 h-1 bg-gold/20 rounded-full mx-auto mt-4 group-hover:w-20 group-hover:bg-gold/40 transition-all duration-500" />
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <a
              href="/mobile/portfolio"
              className="inline-flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg"
            >
              View All Projects
              <ArrowRight size={18} />
            </a>
          </div>
        </section>

      )}

      {/* --- Testimonials Section --- */}
      {visibility.testimonials !== false && dynamicTestimonials.length > 0 && (
        <section className="px-6 py-32 mt-32 bg-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl" />
          </div>

          {/* Section Header */}
          <div className="text-center mb-16 relative z-10">
            <span className="inline-block text-[10px] font-black text-gold uppercase tracking-[.4em] mb-4">
              Success Stories
            </span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">
              What Our Clients Say
            </h2>
            <p className="text-slate-500 text-base max-w-xs mx-auto">
              Real testimonials from clients we helped achieve exceptional results
            </p>
          </div>

          {/* Testimonials Cards */}
          <div className="flex flex-col gap-8 max-w-md mx-auto relative z-10">
            {dynamicTestimonials.map((t, i) => (
              <div
                key={i}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative text-center flex flex-col items-center"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-lg leading-relaxed mb-8 text-center">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={t.image || '/avatar-placeholder.png'}
                      alt={t.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h5 className="font-bold text-slate-900 text-base">{t.author}</h5>
                    <p className="text-slate-400 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Team Section --- */}
      {visibility.team !== false && dynamicTeam.length > 0 && (
        <section className="px-6 py-48 mt-24 bg-white text-center">
          <div className="mb-24 px-4">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full mb-6 mx-auto">
              <Users size={12} className="text-gold" />
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Meet The Team</span>
            </div>
            <h2 className="text-[3.5rem] font-black text-slate-950 leading-[1] tracking-tight">
              The minds <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">behind elite</span> designs.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-14 max-w-sm mx-auto">
            {dynamicTeam.map((member, i) => (
              <div key={i} className="group flex flex-col items-center">
                <div className="w-full aspect-square rounded-[4rem] overflow-hidden mb-8 shadow-2xl border-[10px] border-white relative" style={{ backgroundColor: member.bgColor || '#F5F5F5' }}>
                  <img src={member.image || '/team-placeholder.png'} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <h4 className="text-2xl font-black text-slate-950 mb-2">{member.name}</h4>
                <p className="text-gold text-xs font-black uppercase tracking-[0.3em]">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Blog Section --- */}
      {visibility.blog !== false && dynamicPosts.length > 0 && (
        <section className="px-6 py-48 mt-24 bg-slate-50 text-center">
          <div className="mb-24 px-4">
            <div className="inline-flex items-center gap-2 bg-slate-950/5 border border-slate-950/10 px-4 py-2 rounded-full mb-6 mx-auto">
              <Calendar size={12} className="text-gold" />
              <span className="text-slate-900 text-[10px] font-black uppercase tracking-[0.4em]">Daily Insights</span>
            </div>
            <h2 className="text-[3.5rem] font-black text-slate-950 leading-[1.1] tracking-tight">
              Fuel your <br />
              <span className="italic font-serif text-gold lowercase">digital</span> wisdom.
            </h2>
          </div>

          <div className="flex flex-col gap-10 max-w-sm mx-auto">
            {dynamicPosts.slice(0, 3).map((post, i) => (
              <div key={i} className="bg-white rounded-[3.5rem] p-4 shadow-xl border border-slate-100 group transition-all duration-500 hover:shadow-2xl text-left">
                <div className="aspect-video w-full rounded-[2.8rem] overflow-hidden mb-8 relative">
                  <img src={post.imageUrl || '/blog-placeholder.jpg'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/95 backdrop-blur rounded-full flex items-center gap-2">
                    <Clock size={12} className="text-gold" />
                    <span className="text-[10px] font-black text-slate-950 uppercase">{post.readTime}</span>
                  </div>
                </div>
                <div className="px-6 pb-6 text-center lg:text-left flex flex-col items-center lg:items-start text-center">
                  <h3 className="text-2xl font-black text-slate-950 mb-4 leading-tight">{post.title}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 text-center">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-gold font-black text-[10px] uppercase tracking-widest cursor-pointer group-hover:gap-5 transition-all mx-auto">
                    Read Article <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* --- Footer Section --- */}
      <footer className="bg-white border-t border-slate-100 px-6 pt-16 pb-10 mt-24">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          {/* Logo & Description */}
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
                <img src="/logo.png" alt="CMA" className="w-full h-full object-contain" />
              </div>
              <span className="text-slate-900 font-bold text-2xl">CMA</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs text-center">
              We offer a comprehensive suite of digital marketing services. Your partner in digital growth.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center gap-2 text-center mb-8">
            {contactInfo.address && (
              <p className="text-slate-400 text-sm">{contactInfo.address}</p>
            )}
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone}`} className="text-slate-700 font-semibold text-base">
                {contactInfo.phone}
              </a>
            )}
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className="text-slate-700 font-semibold text-base">
                {contactInfo.email}
              </a>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <img
                  src={`https://cdn.simpleicons.org/${social === 'twitter' ? 'x' : social}/64748b`}
                  alt={social}
                  className="w-4 h-4"
                />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-slate-200 mb-6" />

          {/* Bottom */}
          <div className="text-center flex flex-col items-center">
            <p className="text-slate-400 text-xs mb-4">
              © {new Date().getFullYear()} CMA Agency. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-6">
              <a href="#" className="text-slate-400 text-xs hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 text-xs hover:text-slate-700 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

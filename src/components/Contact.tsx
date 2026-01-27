'use client';

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { useSiteData } from '@/context/SiteDataContext';

export default function Contact() {
    const { contactInfo, addContactSubmission, isLoaded } = useSiteData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            alert('Please fill in the required fields');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            addContactSubmission(formData);
            setFormData({ name: '', email: '', website: '', message: '' });
            setIsSubmitting(false);
            setSubmitted(true);

            setTimeout(() => setSubmitted(false), 3000);
        }, 300);
    };

    if (!isLoaded) {
        return (
            <section id="contact" className="py-28 lg:py-36 bg-white section-wrapper">
                <div className="container-custom">
                    <div className="animate-pulse h-96 bg-gray-100 rounded-3xl" />
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-28 lg:py-36 bg-white section-wrapper relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <ScrollReveal className="container-custom relative z-10">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

                    {/* Left Column - Info */}
                    <div className="scroll-visible animate-fade-in-up">
                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#010205] tracking-[-0.02em] leading-[1.1] mb-8">
                            Contact us
                        </h2>

                        {/* Description */}
                        <p className="text-[#666] text-lg lg:text-xl leading-[1.8] mb-16">
                            We are committed to processing the information in order to contact you and talk about your project.
                        </p>

                        {/* Contact Details */}
                        <div className="space-y-10">
                            {/* Email */}
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700]/15 to-[#D4AF37]/5 flex items-center justify-center flex-shrink-0">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M22 6L12 13 2 6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#010205] font-semibold text-xl tracking-[-0.01em]">{contactInfo.email}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a237e]/10 to-[#3949ab]/5 flex items-center justify-center flex-shrink-0">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a237e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#010205] font-semibold text-xl tracking-[-0.01em]">{contactInfo.address}</p>
                                    <p className="text-[#777] text-base mt-1.5">{contactInfo.addressLine2}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 flex items-center justify-center flex-shrink-0">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#010205] font-semibold text-xl tracking-[-0.01em]">{contactInfo.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="scroll-visible animate-fade-in-up delay-200">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Name */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    className="peer w-full px-0 pt-6 pb-3 bg-transparent border-b-2 border-gray-200 text-[#010205] text-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    required
                                />
                                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium 
                                    ${focusedField === 'name' || formData.name
                                        ? 'text-xs text-[#D4AF37] top-0'
                                        : 'text-lg text-[#999] top-6'}`}>
                                    Name<span className="text-[#D4AF37]">*</span>
                                </label>
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="peer w-full px-0 pt-6 pb-3 bg-transparent border-b-2 border-gray-200 text-[#010205] text-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    required
                                />
                                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium 
                                    ${focusedField === 'email' || formData.email
                                        ? 'text-xs text-[#D4AF37] top-0'
                                        : 'text-lg text-[#999] top-6'}`}>
                                    Email<span className="text-[#D4AF37]">*</span>
                                </label>
                            </div>

                            {/* Website */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    onFocus={() => setFocusedField('website')}
                                    onBlur={() => setFocusedField(null)}
                                    className="peer w-full px-0 pt-6 pb-3 bg-transparent border-b-2 border-gray-200 text-[#010205] text-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                                />
                                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium 
                                    ${focusedField === 'website' || formData.website
                                        ? 'text-xs text-[#D4AF37] top-0'
                                        : 'text-lg text-[#999] top-6'}`}>
                                    Website
                                </label>
                            </div>

                            {/* Message */}
                            <div className="relative group">
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    rows={4}
                                    className="peer w-full px-0 pt-6 pb-3 bg-transparent border-b-2 border-gray-200 text-[#010205] text-lg focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                />
                                <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium 
                                    ${focusedField === 'message' || formData.message
                                        ? 'text-xs text-[#D4AF37] top-0'
                                        : 'text-lg text-[#999] top-6'}`}>
                                    Message
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || submitted}
                                    className={`group flex items-center justify-center gap-3 px-10 py-4 h-[60px] rounded-full font-semibold text-lg whitespace-nowrap transition-all duration-300 ${submitted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#0a0a14] text-white hover:bg-[#1a1a24] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1'
                                        } disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Sending...</span>
                                        </>
                                    ) : submitted ? (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span>Message Sent!</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Schedule Call</span>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}

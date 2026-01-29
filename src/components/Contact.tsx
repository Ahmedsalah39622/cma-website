'use client';

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { submitContact } from '@/actions/contact';

interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    addressLine2?: string;
}

interface ContactProps {
    contactInfo?: ContactInfo;
}

export default function Contact({ contactInfo = { email: '', phone: '', address: '' } }: ContactProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            alert('Please fill in the required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await submitContact(formData);
            setFormData({ name: '', email: '', website: '', message: '' });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading check removed as data comes from props

    return (
        <section id="contact" className="py-32 lg:py-44 bg-white section-wrapper relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#183B73]/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <ScrollReveal className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center mb-24 scroll-visible animate-fade-in-up">
                    <span className="inline-block px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase bg-[#FFD700]/10 text-[#B8860B] border border-[#FFD700]/20 mb-10">
                        Get In Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#010205] tracking-[-0.02em] leading-[1.15] mb-10">
                        Let's Build Something
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8860B] mt-3">
                            Extraordinary Together
                        </span>
                    </h2>
                    <p className="text-[#666] text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                        Ready to transform your brand? We'd love to hear about your project and explore how we can help you achieve your goals.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Contact Info - Left Column */}
                    <div className="space-y-10 scroll-visible animate-fade-in-up">
                        {/* Email Card */}
                        <div className="group p-10 rounded-[28px] bg-gradient-to-br from-gray-50/80 to-white border border-gray-100 hover:border-[#FFD700]/40 hover:shadow-2xl hover:shadow-[#FFD700]/5 transition-all duration-500">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FFD700]/20 to-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M22 6L12 13 2 6" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#999] text-sm font-semibold uppercase tracking-[0.15em] mb-3">Email Us</p>
                                    <p className="text-[#010205] font-bold text-xl lg:text-2xl truncate">{contactInfo.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="group p-10 rounded-[28px] bg-gradient-to-br from-gray-50/80 to-white border border-gray-100 hover:border-[#183B73]/30 hover:shadow-2xl hover:shadow-[#183B73]/5 transition-all duration-500">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#183B73]/15 to-[#183B73]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#183B73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#999] text-sm font-semibold uppercase tracking-[0.15em] mb-3">Visit Us</p>
                                    <p className="text-[#010205] font-bold text-xl lg:text-2xl">{contactInfo.address}</p>
                                    {contactInfo.addressLine2 && (
                                        <p className="text-[#666] text-base mt-3">{contactInfo.addressLine2}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="group p-10 rounded-[28px] bg-gradient-to-br from-gray-50/80 to-white border border-gray-100 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500/15 to-emerald-500/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#999] text-sm font-semibold uppercase tracking-[0.15em] mb-3">Call Us</p>
                                    <p className="text-[#010205] font-bold text-xl lg:text-2xl">{contactInfo.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-8 pt-6 pl-4">
                            <div className="flex items-center gap-4">
                                <div className="w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                <span className="text-[#555] text-base font-medium">Available 24/7</span>
                            </div>
                            <div className="w-px h-6 bg-gray-200" />
                            <span className="text-[#777] text-base">Response within 2 hours</span>
                        </div>
                    </div>

                    {/* Form - Right Column */}
                    <div className="scroll-visible animate-fade-in-up delay-200">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Name Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-[#333] uppercase tracking-[0.1em] mb-4">
                                    Your Name <span className="text-[#D4AF37]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="John Doe"
                                    className={`w-full px-8 py-6 bg-gray-50 border-2 rounded-2xl text-[#010205] text-lg focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${focusedField === 'name' ? 'border-[#FFD700] bg-white shadow-lg shadow-[#FFD700]/10' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-[#333] uppercase tracking-[0.1em] mb-4">
                                    Email Address <span className="text-[#D4AF37]">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="john@example.com"
                                    className={`w-full px-8 py-6 bg-gray-50 border-2 rounded-2xl text-[#010205] text-lg focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${focusedField === 'email' ? 'border-[#FFD700] bg-white shadow-lg shadow-[#FFD700]/10' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    required
                                />
                            </div>

                            {/* Website Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-[#333] uppercase tracking-[0.1em] mb-4">
                                    Website <span className="text-gray-400 font-normal normal-case tracking-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    onFocus={() => setFocusedField('website')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="https://yourwebsite.com"
                                    className={`w-full px-8 py-6 bg-gray-50 border-2 rounded-2xl text-[#010205] text-lg focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${focusedField === 'website' ? 'border-[#FFD700] bg-white shadow-lg shadow-[#FFD700]/10' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Message Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-[#333] uppercase tracking-[0.1em] mb-4">
                                    Your Message
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    rows={6}
                                    placeholder="Tell us about your project, goals, and how we can help..."
                                    className={`w-full px-8 py-6 bg-gray-50 border-2 rounded-2xl text-[#010205] text-lg focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-400 ${focusedField === 'message' ? 'border-[#FFD700] bg-white shadow-lg shadow-[#FFD700]/10' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Submit Button & Note */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || submitted}
                                    className={`group relative flex items-center justify-center gap-4 px-12 py-6 rounded-full font-bold text-lg overflow-hidden transition-all duration-500 ${submitted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black hover:shadow-[0_12px_40px_rgba(212,175,55,0.4)] hover:-translate-y-1'
                                        } disabled:opacity-70 disabled:cursor-not-allowed min-w-[240px]`}
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />

                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Sending...</span>
                                        </>
                                    ) : submitted ? (
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span>Message Sent!</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform duration-300">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                                <p className="text-[#888] text-base">
                                    We'll get back to you within 24 hours
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}

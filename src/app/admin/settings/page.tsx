"use client";

import React, { useState, useEffect } from 'react';
import { useSiteData, ContactInfo } from '@/context/SiteDataContext';
import { updateContactInfo as updateContactInfoAction } from '@/actions/contact';
import { getSectionVisibility, updateSectionVisibility } from '@/actions/settings';

export default function AdminSettingsPage() {
    const { contactInfo, updateContactInfo } = useSiteData();
    const [formData, setFormData] = useState<ContactInfo>(contactInfo);
    const [visibility, setVisibility] = useState<Record<string, boolean>>({
        hero: true,
        brands: true,
        services: true,
        testimonials: true,
        portfolio: true,
        team: true,
        faq: true,
        blog: true,
        cta: true,
        contact: true
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setFormData(contactInfo);
    }, [contactInfo]);

    useEffect(() => {
        async function loadVisibility() {
            const data = await getSectionVisibility();
            if (data) setVisibility(data);
        }
        loadVisibility();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (key: string) => {
        setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        // Optimistic update for contact info
        updateContactInfo(formData);

        try {
            await Promise.all([
                updateContactInfoAction(formData),
                updateSectionVisibility(visibility)
            ]);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { key: 'hero', label: 'Hero Section' },
        { key: 'brands', label: 'Brands (Clients)' },
        { key: 'services', label: 'Services' },
        { key: 'portfolio', label: 'Portfolio' },
        { key: 'testimonials', label: 'Testimonials' },
        { key: 'team', label: 'Team Members' },
        { key: 'faq', label: 'FAQ Section' },
        { key: 'blog', label: 'Blog Section' },
        { key: 'cta', label: 'CTA (Footer)' },
        { key: 'contact', label: 'Contact Form' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
            <p className="text-white/50 mb-12">Manage your contact information and section visibility.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-white text-sm font-semibold uppercase">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-white text-sm font-semibold uppercase">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-white text-sm font-semibold uppercase">Address Line 1</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-white text-sm font-semibold uppercase">Address Line 2 (City, Country)</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Visibility */}
                <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Home Page Sections</h2>
                    <p className="text-white/50 text-sm mb-8">Choose which sections to display on your landing page.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sections.map(section => (
                            <div
                                key={section.key}
                                onClick={() => handleToggle(section.key)}
                                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${visibility[section.key]
                                    ? 'bg-[#FFD700]/10 border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/5'
                                    : 'bg-white/5 border-white/10 opacity-50'
                                    }`}
                            >
                                <span className={`font-semibold ${visibility[section.key] ? 'text-[#FFD700]' : 'text-white'}`}>
                                    {section.label}
                                </span>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${visibility[section.key] ? 'bg-[#FFD700]' : 'bg-white/20'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${visibility[section.key] ? 'left-7' : 'left-1'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                    {message && (
                        <p className={`text-center mt-4 ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

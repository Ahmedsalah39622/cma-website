'use client';

import React, { useState } from 'react';
import { useServices, Service } from '@/context/ServicesContext';

const iconOptions: { value: Service['iconType']; label: string }[] = [
    { value: 'grid', label: '📊 Grid / Project Management' },
    { value: 'code', label: '💻 Code / Development' },
    { value: 'support', label: '🎧 Support / Customer Service' },
    { value: 'users', label: '👥 Users / HR' },
    { value: 'design', label: '🎨 Design / Creative' },
    { value: 'marketing', label: '⚡ Marketing / Communication' },
    { value: 'business', label: '💼 Business / Development' },
    { value: 'chart', label: '📈 Chart / Analytics' },
    { value: 'globe', label: '🌐 Globe / International' },
    { value: 'star', label: '⭐ Star / Premium' },
];

export default function AdminServicesPage() {
    const { services, addService, updateService, deleteService, moreCount, setMoreCount, moreOptionsText, setMoreOptionsText, isLoaded } = useServices();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({ title: '', count: '', iconType: 'grid' as Service['iconType'] });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const openAddModal = () => {
        setEditingService(null);
        setFormData({ title: '', count: '', iconType: 'grid' });
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setFormData({ title: service.title, count: service.count, iconType: service.iconType });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            updateService(editingService.id, formData);
        } else {
            addService(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        deleteService(id);
        setDeleteConfirm(null);
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
                    <p className="text-white/50">Manage your service offerings</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all"
                >
                    + Add Service
                </button>
            </div>

            {/* More Card Settings */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">"+More" Card Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white/60 text-sm mb-2">More Count (e.g., +4)</label>
                        <input
                            type="number"
                            value={moreCount}
                            onChange={(e) => setMoreCount(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FFD700]/50"
                        />
                    </div>
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Options Text</label>
                        <input
                            type="text"
                            value={moreOptionsText}
                            onChange={(e) => setMoreOptionsText(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FFD700]/50"
                        />
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                    <div
                        key={service.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                {iconOptions.find(i => i.value === service.iconType)?.label.split(' ')[0] || '📊'}
                            </div>
                            <span className="text-white/30 text-sm">#{idx + 1}</span>
                        </div>

                        <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                        <p className="text-white/50 text-sm mb-6">{service.count}</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => openEditModal(service)}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(service.id)}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-white/40 text-lg">No services yet. Add your first service!</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Service Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FFD700]/50"
                                    placeholder="e.g., Web Development"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/60 text-sm mb-2">Options Count</label>
                                <input
                                    type="text"
                                    value={formData.count}
                                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FFD700]/50"
                                    placeholder="e.g., 30 options available"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/60 text-sm mb-2">Icon</label>
                                <select
                                    value={formData.iconType}
                                    onChange={(e) => setFormData({ ...formData, iconType: e.target.value as Service['iconType'] })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FFD700]/50"
                                >
                                    {iconOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-semibold rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingService ? 'Save Changes' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-md text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Delete Service?</h3>
                        <p className="text-white/50 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

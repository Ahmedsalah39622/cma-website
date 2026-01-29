'use client';

import React, { useState, useEffect } from 'react';
import { getContactInfo, updateContactInfo, getContactSubmissions, markSubmissionRead, deleteSubmission } from '@/actions/contact';

export default function AdminContactPage() {
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        address: '',
        addressLine2: ''
    });
    const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(contactInfo);
    const [viewingSubmission, setViewingSubmission] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [info, submissions] = await Promise.all([
                getContactInfo(),
                getContactSubmissions()
            ]);
            setContactInfo(info);
            setFormData(info);
            setContactSubmissions(submissions || []);
        } catch (err) {
            console.error('Failed to load contact data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveInfo = async () => {
        try {
            await updateContactInfo(formData);
            setContactInfo(formData);
            setEditing(false);
        } catch (err) {
            console.error('Failed to save info', err);
            alert('Failed to save contact info');
        }
    };

    const handleViewSubmission = async (id: string) => {
        setViewingSubmission(id);
        const sub = contactSubmissions.find(s => s.id === id);
        if (sub && !sub.read) {
            try {
                await markSubmissionRead(id);
                setContactSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
            } catch (err) {
                console.error('Failed to mark read', err);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSubmission(id);
            setContactSubmissions(prev => prev.filter(s => s.id !== id));
            setDeleteConfirm(null);
            if (viewingSubmission === id) setViewingSubmission(null);
        } catch (err) {
            console.error('Failed to delete', err);
            alert('Failed to delete submission');
        }
    };

    const unreadCount = contactSubmissions.filter(s => !s.read).length;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-white/10 rounded-xl w-1/3" />
                    <div className="h-64 bg-white/10 rounded-2xl" />
                </div>
            </div>
        );
    }

    const viewedSubmission = contactSubmissions.find(s => s.id === viewingSubmission);

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-transparent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Contact Manager</h1>
                    <p className="text-white/50 mt-3 text-lg">{contactSubmissions.length} submission{contactSubmissions.length !== 1 ? 's' : ''} • {unreadCount} unread</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 space-y-12">
                {/* Contact Info Section */}
                <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                        {!editing && (
                            <button onClick={() => { setFormData(contactInfo); setEditing(true); }} className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20">
                                Edit
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-white/60 text-sm">Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/60 text-sm">Phone</label>
                                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-white/60 text-sm">Address Line 1</label>
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/60 text-sm">Address Line 2</label>
                                    <input type="text" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setEditing(false)} className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20">Cancel</button>
                                <button onClick={handleSaveInfo} className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl">Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6L12 13 2 6" /></svg>
                                </div>
                                <div>
                                    <p className="text-white/40 text-sm">Email</p>
                                    <p className="text-white font-medium mt-1">{contactInfo.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                </div>
                                <div>
                                    <p className="text-white/40 text-sm">Address</p>
                                    <p className="text-white font-medium mt-1">{contactInfo.address}</p>
                                    <p className="text-white/60 text-sm">{contactInfo.addressLine2}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </div>
                                <div>
                                    <p className="text-white/40 text-sm">Phone</p>
                                    <p className="text-white font-medium mt-1">{contactInfo.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submissions Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Contact Submissions</h2>
                    {contactSubmissions.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-3xl">
                            <p className="text-white/40 text-lg">No submissions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contactSubmissions.map((sub) => (
                                <div key={sub.id} className={`bg-gradient-to-b from-white/[0.08] to-white/[0.03] border rounded-2xl p-6 cursor-pointer hover:border-[#FFD700]/30 transition-all ${sub.read ? 'border-white/10' : 'border-[#FFD700]/50'}`} onClick={() => handleViewSubmission(sub.id)}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            {!sub.read && <div className="w-3 h-3 rounded-full bg-[#FFD700]" />}
                                            <div>
                                                <h3 className="text-white font-semibold">{sub.name}</h3>
                                                <p className="text-white/40 text-sm">{sub.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-white/30 text-sm">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(sub.id); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    {sub.message && <p className="text-white/50 text-sm mt-3 line-clamp-2">{sub.message}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* View Submission Modal */}
            {viewedSubmission && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setViewingSubmission(null)}>
                    <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Message from {viewedSubmission.name}</h2>
                            <button onClick={() => setViewingSubmission(null)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div><span className="text-white/40 text-sm">Email:</span> <span className="text-white ml-2">{viewedSubmission.email}</span></div>
                            {viewedSubmission.website && <div><span className="text-white/40 text-sm">Website:</span> <span className="text-white ml-2">{viewedSubmission.website}</span></div>}
                            <div><span className="text-white/40 text-sm">Date:</span> <span className="text-white ml-2">{new Date(viewedSubmission.submittedAt).toLocaleString()}</span></div>
                            {viewedSubmission.message && (
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-white/40 text-sm mb-2">Message:</p>
                                    <p className="text-white leading-relaxed">{viewedSubmission.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Delete Submission?</h3>
                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20">Cancel</button>
                                <button onClick={() => { handleDelete(deleteConfirm); }} className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

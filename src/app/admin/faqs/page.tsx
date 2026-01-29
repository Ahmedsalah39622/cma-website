'use client';

import React, { useState } from 'react';
import { useFAQs, FAQ } from '@/context/FAQContext';

export default function AdminFAQsPage() {
    const { faqs, addFaq, updateFaq, deleteFaq } = useFAQs();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ question: '', answer: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (faq: FAQ) => {
        setEditingId(faq.id);
        setFormData({ question: faq.question, answer: faq.answer });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateFaq(editingId, formData);
        } else {
            addFaq(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        deleteFaq(id);
        setDeleteConfirm(null);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">FAQs Manager</h1>
                    <p className="text-white/50">Manage your frequently asked questions</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all"
                >
                    + Add Question
                </button>
            </div>

            <div className="grid gap-4">
                {faqs.map((faq, idx) => (
                    <div key={faq.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 group">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg mb-2">{faq.question}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(faq)}
                                    className="px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(faq.id)}
                                    className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <p className="text-white/40">No FAQs found. Add your first question!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Question' : 'Add Question'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Question</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Answer</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FFD700] outline-none"
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold rounded-xl">{editingId ? 'Save Changes' : 'Add Question'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md p-8 text-center">
                        <h3 className="text-xl font-bold text-white mb-4">Delete this question?</h3>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

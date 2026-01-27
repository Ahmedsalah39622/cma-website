'use client';

import React, { useState } from 'react';
import GeometricBackground from './GeometricBackground';

const faqs = [
    {
        question: 'Why is digital marketing important for my business?',
        answer: 'Digital marketing allows businesses to reach and engage with a wider audience, generate leads, drive website traffic, and increase brand visibility. It provides measurable results, allows for targeted marketing efforts, and enables businesses to adapt and optimize their strategies based on data and insights.',
    },
    {
        question: 'How can digital marketing help improve my website\'s visibility?',
        answer: 'Through SEO optimization, content marketing, social media engagement, and paid advertising, we can significantly improve your website\'s visibility in search results and across digital platforms.',
    },
    {
        question: 'How long does it take to see results from digital marketing efforts?',
        answer: 'Results vary depending on the strategy. PPC can show immediate results, while SEO typically takes 3-6 months. We provide regular reports to track progress and adjust strategies accordingly.',
    },
    {
        question: 'How do you measure the success of digital marketing campaigns?',
        answer: 'We use comprehensive analytics including traffic metrics, conversion rates, ROI, engagement rates, and custom KPIs tailored to your specific business goals.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-8 lg:py-12 section-wrapper">
            <div className="mx-4 bg-white rounded-[28px] py-20 lg:py-24 px-8 lg:px-20 relative overflow-hidden">
                <GeometricBackground pattern="marketing" position="right" opacity={0.06} className="text-[#020B1C]" />
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">

                    {/* Left Column */}
                    <div className="lg:w-[531px] flex flex-col gap-12">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl md:text-5xl font-semibold text-[#010205] leading-[1.3] tracking-[-0.03em]">
                                Digital Marketing FAQs
                            </h2>
                            <p className="text-[#878C91] text-base leading-[1.8]">
                                As a leading digital marketing agency, we are dedicated to providing comprehensive educational resources and answering frequently asked questions to help our clients.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-12">
                            <button className="px-6 py-4 border border-[#010205] rounded-full font-bold text-base font-[Manrope] hover:bg-[#010205] hover:text-white transition-all">
                                More Questions
                            </button>
                            <a href="#contact" className="text-[#010205] font-semibold underline hover:no-underline">
                                Contanct Us
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Accordion */}
                    <div className="flex-1">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border-b border-black ${index === 0 ? 'border-t' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="w-full flex justify-between items-center py-6 px-6 text-left gap-8"
                                >
                                    <span className="text-[#010205] font-semibold text-xl lg:text-2xl leading-[1.5] tracking-[-0.03em]">
                                        {faq.question}
                                    </span>
                                    <span className="text-2xl flex-shrink-0">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-[#878C91] text-base leading-[1.8]">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

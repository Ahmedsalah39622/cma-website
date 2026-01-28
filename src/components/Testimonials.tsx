'use client';

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import GeometricBackground from './GeometricBackground';
import { useTestimonials } from '@/context/TestimonialsContext';

export default function Testimonials() {
  const { testimonials, isLoaded } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  if (!isLoaded || testimonials.length === 0) {
    return (
      <section className="py-24 lg:py-32 bg-[#FFFFFF] section-wrapper relative overflow-hidden">
        <div className="container-custom">
          {testimonials.length === 0 && isLoaded ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No testimonials added yet.</p>
              <p className="text-gray-300 text-sm mt-2">Add testimonials from the admin panel.</p>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl mb-8" />
              <div className="h-16 bg-gray-200 rounded-xl w-1/2" />
            </div>
          )}
        </div>
      </section>
    );
  }

  const current = testimonials[currentIndex] || testimonials[0];

  const goToPrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setIsFading(false);
    }, 260);
  };

  const goToNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setIsFading(false);
    }, 260);
  };

  return (
    <section className="py-24 lg:py-32 bg-[#FFFFFF] section-wrapper relative overflow-hidden">
      <GeometricBackground pattern="circles" position="center" opacity={0.04} className="text-[#020B1C]" />
      <ScrollReveal className="container-custom relative z-10">
        <div className="flex flex-col gap-16 lg:gap-20">
          {/* Quote */}
          <blockquote className={`scroll-visible animate-fade-in-up testimonial-quote text-2xl md:text-3xl lg:text-4xl font-semibold text-[#010205] leading-[1.6] tracking-[-0.03em] ${isFading ? 'fade-out' : 'fade-in'}`}>
            {current.quote}
          </blockquote>

          {/* Author & Navigation */}
          <div className="scroll-visible animate-fade-in-up delay-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Author */}
            <div className="flex items-center gap-6">
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4AF37] border-2 border-white/50 overflow-hidden flex items-center justify-center">
                {current.image ? (
                  <img
                    src={current.image}
                    alt={current.author}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#010205] font-bold text-xl">{current.author}</span>
                <span className="text-[#878C91] text-base">{current.role}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-8 lg:gap-10">
              {/* Prev Button */}
              <button
                onClick={goToPrev}
                className="testimonial-nav-btn w-[56px] h-[56px] lg:w-[88px] lg:h-[56px] rounded-full border border-[#010205] flex items-center justify-center hover:bg-[#010205] hover:text-white transition-all group"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-180 group-hover:stroke-white">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Counter */}
              <span className="text-[#010205] font-semibold text-base underline">
                0{currentIndex + 1}/0{testimonials.length}
              </span>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="testimonial-nav-btn w-[56px] h-[56px] lg:w-[88px] lg:h-[56px] rounded-full bg-[#010205] flex items-center justify-center hover:bg-black/80 transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

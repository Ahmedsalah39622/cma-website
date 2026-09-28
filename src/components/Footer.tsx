'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navigation = [
  { name: 'Service', href: '#services' },
  { name: 'Agency', href: '#about' },
  { name: 'Case Study', href: '#portfolio' },
  { name: 'Resource', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const licence = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Copyright', href: '#' },
  { name: 'Email Address', href: '#' },
];

import { useSiteData } from '@/context/SiteDataContext';

export default function Footer() {
  const { contactInfo } = useSiteData();

  return (
    <footer className="pt-20 lg:pt-32 pb-12 bg-transparent section-wrapper relative overflow-hidden border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--md-sys-color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Column 1: Brand (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden bg-white/5 border border-white/10 p-1">
                <Image src="/logo.png" alt="CMA Logo" fill className="object-cover p-1 brightness-125" />
              </div>
              <span className="text-[var(--md-sys-color-on-background)] font-bold text-3xl font-[Manrope] tracking-[-0.03em]">CMA</span>
            </div>

            <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm leading-[1.8] font-[Roboto] max-w-[360px]">
              We offer a comprehensive suite of digital marketing services. From SEO and social media to branding and content creation, we serve as your partner in digital growth and visual upgrades.
            </p>

            <div className="flex flex-col gap-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
              {contactInfo.address && <p>{contactInfo.address}</p>}
              {contactInfo.addressLine2 && <p>{contactInfo.addressLine2}</p>}
              {contactInfo.phone && <p className="text-[var(--md-sys-color-primary)] font-semibold">{contactInfo.phone}</p>}
              {contactInfo.email && <p className="text-[var(--md-sys-color-primary)] font-semibold">{contactInfo.email}</p>}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--md-sys-color-primary)] hover:border-[var(--md-sys-color-primary)] group transition-all duration-300 hover:scale-110"
                >
                  <img src={`https://cdn.simpleicons.org/${social === 'facebook' ? 'facebook' : social === 'twitter' ? 'x' : social === 'linkedin' ? 'linkedin' : 'instagram'}/ffffff`} alt={social} className="w-4 h-4 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-6">
            <h4 className="text-[var(--md-sys-color-on-background)] font-bold text-lg font-[Manrope]">Company</h4>
            <ul className="flex flex-col gap-4">
              {['About Agency', 'Our Services', 'Case Studies', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[var(--md-sys-color-on-surface-variant)] text-sm font-[Roboto] hover:text-white hover:translate-x-1 transition-all inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (3 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-[var(--md-sys-color-on-background)] font-bold text-lg font-[Manrope]">Services</h4>
            <ul className="flex flex-col gap-4">
              {['SEO Optimization', 'Social Media', 'Content Marketing', 'PPC Advertising', 'Web Development'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[var(--md-sys-color-on-surface-variant)] text-sm font-[Roboto] hover:text-white hover:translate-x-1 transition-all inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="text-[var(--md-sys-color-on-background)] font-bold text-lg font-[Manrope]">Stay Updated</h4>
            <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm leading-[1.6]">
              Subscribe to our newsletter for the latest digital marketing trends.
            </p>

            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-[16px] px-5 py-3.5 text-[var(--md-sys-color-on-background)] placeholder:text-white/30 focus:outline-none focus:border-[var(--md-sys-color-primary)] transition-all focus:bg-white/10"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/95 text-white px-5 rounded-[12px] font-medium text-sm transition-colors hover:scale-[1.02] active:scale-[0.97]">
                  Join
                </button>
              </div>
              <p className="text-[var(--md-sys-color-on-surface-variant)]/60 text-xs">No spam, unsubscribe anytime.</p>
            </form>
          </div>

        </div>

        {/* Separator */}
        <div className="w-full h-[1px] bg-white/5 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--md-sys-color-on-surface-variant)]/60 text-sm">© {new Date().getFullYear()} CMA Agency. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[var(--md-sys-color-on-surface-variant)]/60 text-sm hover:text-[var(--md-sys-color-on-background)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[var(--md-sys-color-on-surface-variant)]/60 text-sm hover:text-[var(--md-sys-color-on-background)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

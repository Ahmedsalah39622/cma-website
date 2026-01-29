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
    <footer className="pt-20 lg:pt-32 pb-12 bg-white section-wrapper relative overflow-hidden border-t border-gray-100">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#183B73]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Column 1: Brand (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden bg-gray-50 border border-gray-200 p-1">
                <Image src="/logo.png" alt="CMA Logo" fill className="object-cover p-1" />
              </div>
              <span className="text-[#020B1C] font-bold text-3xl font-[Manrope] tracking-[-0.03em]">CMA</span>
            </div>

            <p className="text-gray-500 text-sm leading-[1.8] font-[Roboto] max-w-[360px]">
              We offer a comprehensive suite of digital marketing services. From SEO and social media to branding and content creation, we serve as your partner in digital growth.
            </p>

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              {contactInfo.address && <p>{contactInfo.address}</p>}
              {contactInfo.addressLine2 && <p>{contactInfo.addressLine2}</p>}
              {contactInfo.phone && <p className="text-[#183B73] font-semibold">{contactInfo.phone}</p>}
              {contactInfo.email && <p className="text-[#183B73] font-semibold">{contactInfo.email}</p>}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-[40px] h-[40px] rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-[#FFB800] hover:border-[#FFB800] group transition-all duration-300"
                >
                  <img src={`https://cdn.simpleicons.org/${social === 'facebook' ? 'facebook' : social === 'twitter' ? 'x' : social === 'linkedin' ? 'linkedin' : 'instagram'}/374151`} alt={social} className="w-4 h-4 group-hover:brightness-0 group-hover:invert transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-6">
            <h4 className="text-[#020B1C] font-bold text-lg font-[Manrope]">Company</h4>
            <ul className="flex flex-col gap-4">
              {['About Agency', 'Our Services', 'Case Studies', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 text-sm font-[Roboto] hover:text-[#183B73] hover:translate-x-1 transition-all inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (3 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-[#020B1C] font-bold text-lg font-[Manrope]">Services</h4>
            <ul className="flex flex-col gap-4">
              {['SEO Optimization', 'Social Media', 'Content Marketing', 'PPC Advertising', 'Web Development'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 text-sm font-[Roboto] hover:text-[#183B73] hover:translate-x-1 transition-all inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="text-[#020B1C] font-bold text-lg font-[Manrope]">Stay Updated</h4>
            <p className="text-gray-500 text-sm leading-[1.6]">
              Subscribe to our newsletter for the latest digital marketing trends.
            </p>

            <form className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-[#020B1C] placeholder:text-gray-400 focus:outline-none focus:border-[#183B73] focus:ring-2 focus:ring-[#183B73]/10 transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#020B1C] hover:bg-[#183B73] text-white px-5 rounded-lg font-bold text-sm transition-colors">
                  Join
                </button>
              </div>
              <p className="text-gray-400 text-xs">No spam, unsubscribe anytime.</p>
            </form>
          </div>

        </div>

        {/* Separator */}
        <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} CMA Agency. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-gray-500 text-sm hover:text-[#020B1C] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 text-sm hover:text-[#020B1C] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

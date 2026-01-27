'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: 'Service', href: '#services', hasDropdown: true },
  { name: 'Agency', href: '#about', hasDropdown: true },
  { name: 'Case study', href: '#portfolio', hasDropdown: true },
  { name: 'Resources', href: '#blog', hasDropdown: true },
  { name: 'Contact', href: '#contact', hasDropdown: false },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [showIntroLogo, setShowIntroLogo] = useState(true);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsAnimated(true);

      // Hide intro logo after the circle expansion phase (approx 1.0s)
      setTimeout(() => {
        setShowIntroLogo(false);
      }, 1100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pt-8 px-4 flex justify-center transition-all duration-500 ease-out ${isVisible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-full opacity-0'
        }`}
    >
      <div
        className={`relative w-full max-w-[1000px] bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 overflow-hidden ${isAnimated ? 'navbar-animate' : 'opacity-0'}`}
      >
        {/* Intro Logo (Visible during dropped circle phase) */}
        <div className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none transition-opacity duration-500 ${showIntroLogo ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-[70px] h-[70px]">
            <Image src="/logo.png" alt="Intro Logo" fill className="object-contain" />
          </div>
        </div>

        {/* Glass Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-50 pointer-events-none"></div>

        <div className={`relative px-8 lg:px-12 py-5`}>
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className={`flex items-center gap-3 mr-8 lg:mr-12 ${isAnimated ? 'appear-stagger-1' : 'opacity-0'}`}>
              <div className="relative w-[42px] h-[42px]">
                {/* Gold Dropped Circle Shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-[8px_8px_24px_8px] shadow-sm flex items-center justify-center overflow-hidden">
                  {/* Logo Image Inside - Small & Centered */}
                  <div className="relative w-[24px] h-[24px]">
                    <Image
                      src="/logo.png"
                      alt="CMA Logo"
                      fill
                      className="object-contain brightness-0"
                    />
                  </div>
                </div>
              </div>
              <span className="text-[#020407] font-bold text-2xl font-[Manrope] tracking-[-0.03em]">CMA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center gap-1 ${isAnimated ? 'appear-stagger-2' : 'opacity-0'}`}>
              {navLinks.map((link) => (
                <div key={link.name} className="relative group px-5 py-3">
                  <Link
                    href={link.href}
                    className="relative z-10 flex items-center gap-2 text-[#555] font-medium text-[15px] group-hover:text-[#020407] transition-colors duration-300"
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50 group-hover:opacity-100 transition-opacity">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Link>
                  {/* Hover Pill Effect */}
                  <div className="absolute inset-0 bg-gray-100/80 rounded-full scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out -z-0"></div>
                </div>
              ))}
            </nav>

            {/* Right Side */}
            <div className={`flex items-center gap-3 ${isAnimated ? 'appear-stagger-3' : 'opacity-0'}`}>
              {/* Schedule Call Button */}
              <Link
                href="#contact"
                className="group hidden md:inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#0a0a14] text-white text-[15px] font-medium rounded-full hover:bg-[#1a1a24] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 min-w-[180px]"
              >
                <span>Schedule Call</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>



              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden mt-6 pb-2 border-t border-gray-100/50 pt-4 animate-fade-in-down">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[#444] font-medium text-sm py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="#contact"
                  className="group mt-2 w-full bg-[#0a0a14] text-white py-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#1a1a24] transition-colors shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Schedule Call</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

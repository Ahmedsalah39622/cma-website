'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

const desktopLinks = [
  { name: 'Features', href: '/#services' },
  { name: 'Customers', href: '/#testimonials' },
  { name: 'Integrations', href: '/#portfolio' },
  { name: 'Pricing', href: '/#contact' },
];

const Header = () => {
  const { isSidebarExpanded, toggleSidebar, activeSection, setActiveSection } = useUI();

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Popup overlay states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state
      setIsScrolled(currentScrollY > 40);

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileDrawerOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsAppsOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Escape key event for closing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsAppsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update root html classes for page padding shifts
  useEffect(() => {
    const root = document.documentElement;
    if (isSidebarExpanded) {
      root.classList.add('sidebar-expanded');
      root.classList.remove('sidebar-collapsed');
    } else {
      root.classList.add('sidebar-collapsed');
      root.classList.remove('sidebar-expanded');
    }
  }, [isSidebarExpanded]);

  return (
    <>
      {/* Smart Morphing Glass App Bar */}
      <header
        className={`fixed z-50 flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          } ${isScrolled
            ? 'top-4 left-1/2 -translate-x-1/2 h-14 max-w-[820px] w-[calc(100%-32px)] rounded-full border border-white/10 bg-black/45 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-2'
            : 'top-0 left-0 right-0 h-16 border-b border-white/5 bg-black/85 backdrop-blur-lg px-4'
          }`}
      >
        <div className="w-full flex items-center justify-between">

          {/* Left Block: Hamburger + Brand */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Hamburger Toggle */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileDrawerOpen(true);
                } else {
                  toggleSidebar();
                }
              }}
              className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/[0.06] transition-colors focus:outline-none cursor-pointer flex items-center justify-center w-10 h-10"
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Brand Logo (Folded SVG sheets + lowercase brand) */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity ml-1">
              <svg className="w-6 h-6 text-[var(--md-sys-color-primary)] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left ribbon leaf */}
                <path d="M5.5 3.5L9.5 2V20.5L5.5 22V3.5Z" fill="currentColor" className="opacity-90" />
                {/* Right ribbon leaf */}
                <path d="M12 7.5L16 6V18L12 19.5V7.5Z" fill="currentColor" />
              </svg>
              <span className="text-white font-bold text-[20px] tracking-tight font-sans">cma</span>
            </Link>
          </div>

          {/* Center Block: Desktop Navigation Links (matching Image 1 layout) */}
          <nav className="hidden lg:flex items-center gap-2">
            {desktopLinks.map((link) => {
              const linkSection = link.href.split('#')[1];
              const isActive = activeSection === linkSection;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveSection(linkSection)}
                  className={`text-[14px] font-medium px-4 py-1.5 rounded-full transition-all duration-300 ${isActive
                      ? 'bg-white/10 text-white font-semibold shadow-inner border border-white/5'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Block: Actions Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-white/70">

            {/* Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full hover:bg-white/[0.06] flex items-center justify-center hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsAppsOpen(false);
                }}
                className="w-10 h-10 rounded-full hover:bg-white/[0.06] flex items-center justify-center hover:text-white transition-colors relative focus:outline-none cursor-pointer"
                aria-label="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {/* Notification indicator dot */}
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0B0B0D]"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-50 animate-fade-in-down">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-2">
                    <span className="text-white font-semibold text-sm">Notifications</span>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-white/40 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-white/95 text-xs leading-relaxed font-sans">Campaign "Search Visibility" reports +18% CTR</p>
                        <span className="text-white/40 text-[10px] block mt-1">5 mins ago</span>
                      </div>
                    </div>
                    <div className="flex gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                      <div>
                        <p className="text-white/95 text-xs leading-relaxed font-sans">Monthly Google Search Console stats are ready</p>
                        <span className="text-white/40 text-[10px] block mt-1">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Google Apps Launcher Grid Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsAppsOpen(!isAppsOpen);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                }}
                className="w-10 h-10 rounded-full hover:bg-white/[0.06] flex items-center justify-center hover:text-white transition-colors focus:outline-none cursor-pointer"
                aria-label="Google Apps"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
                </svg>
              </button>

              {/* Apps Launcher Dropdown (Mock Workspace apps for the agency) */}
              {isAppsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-50 animate-fade-in-down">
                  <span className="text-white/40 text-xs font-semibold uppercase tracking-wider block mb-3 px-1">Agency Suite</span>
                  <div className="grid grid-cols-3 gap-3">
                    <a href="#services" onClick={() => setIsAppsOpen(false)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.04] transition-colors gap-1 text-center">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">CMA Ads</span>
                    </a>
                    <a href="#portfolio" onClick={() => setIsAppsOpen(false)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.04] transition-colors gap-1 text-center">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                          <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Analytics</span>
                    </a>
                    <a href="#testimonials" onClick={() => setIsAppsOpen(false)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.04] transition-colors gap-1 text-center">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Console</span>
                    </a>
                    <a href="#contact" onClick={() => setIsAppsOpen(false)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.04] transition-colors gap-1 text-center">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Support</span>
                    </a>
                    <a href="#blog" onClick={() => setIsAppsOpen(false)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.04] transition-colors gap-1 text-center">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Resources</span>
                    </a>
                    <a href="/" onClick={() => setIsAppsOpen(false)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/[0.04] transition-colors gap-1 text-center">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          <path d="M2 12h20" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Website</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Separator line */}
            <div className="w-[1px] h-5 bg-white/20 self-center mx-1"></div>

            {/* Google colored ring Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                  setIsAppsOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-[conic-gradient(#4285F4_0deg_90deg,#EA4335_90deg_180deg,#FBBC05_180deg_270deg,#34A853_270deg_360deg)] p-[2.5px] hover:scale-105 transition-all focus:outline-none cursor-pointer"
                aria-label="User Account"
              >
                <div className="w-full h-full rounded-full bg-[#1E1F22] flex items-center justify-center">
                  <span className="text-xs text-white font-bold font-sans">U</span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/10 shadow-2xl p-3 z-50 animate-fade-in-down">
                  <div className="px-2.5 py-1.5 mb-2">
                    <p className="text-white font-semibold text-sm truncate">User Account</p>
                    <p className="text-white/40 text-[11px] truncate">user@cma-agency.com</p>
                  </div>
                  <div className="w-full h-[1px] bg-white/[0.06] mb-1.5"></div>
                  <Link href="#profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white rounded-xl hover:bg-white/[0.03] transition-colors">
                    Manage Google Account
                  </Link>
                  <Link href="#settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:text-white rounded-xl hover:bg-white/[0.03] transition-colors">
                    Agency Settings
                  </Link>
                  <div className="w-full h-[1px] bg-white/[0.06] my-1.5"></div>
                  <button onClick={() => setIsProfileOpen(false)} className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Google-Style Collapsible Left Navigation Rail/Drawer (Desktop) */}
      <aside
        className={`hidden lg:flex flex-col fixed top-16 left-0 bottom-0 z-40 bg-black/40 backdrop-blur-md border-r border-white/5 transition-all duration-300 ${isSidebarExpanded ? 'w-[240px]' : 'w-[72px]'
          }`}
      >
        <div className="flex-1 py-4 flex flex-col justify-between">
          <nav className="flex flex-col gap-1 px-3">
            {/* Dashboard Navigation */}
            <Link
              href="/#services"
              onClick={() => setActiveSection('services')}
              className={`flex items-center rounded-full transition-all group ${isSidebarExpanded ? 'px-4 py-3 gap-4' : 'w-12 h-12 justify-center mx-auto'
                } ${activeSection === 'services'
                  ? 'bg-[#004A77] text-white font-semibold'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              title="Dashboard"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {isSidebarExpanded && <span className="text-sm font-sans tracking-wide">Dashboard</span>}
            </Link>

            {/* Team Navigation */}
            <Link
              href="/#team"
              onClick={() => setActiveSection('team')}
              className={`flex items-center rounded-full transition-all group ${isSidebarExpanded ? 'px-4 py-3 gap-4' : 'w-12 h-12 justify-center mx-auto'
                } ${activeSection === 'team'
                  ? 'bg-[#004A77] text-white font-semibold'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              title="Team"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {isSidebarExpanded && <span className="text-sm font-sans tracking-wide">Team</span>}
            </Link>

            {/* Settings Navigation */}
            <Link
              href="/#contact"
              onClick={() => setActiveSection('contact')}
              className={`flex items-center rounded-full transition-all group ${isSidebarExpanded ? 'px-4 py-3 gap-4' : 'w-12 h-12 justify-center mx-auto'
                } ${activeSection === 'contact'
                  ? 'bg-[#004A77] text-white font-semibold'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              {isSidebarExpanded && <span className="text-sm font-sans tracking-wide">Settings</span>}
            </Link>
          </nav>

          <div className="px-3">
            <div className="w-full h-[1px] bg-white/[0.08] my-3"></div>
            <div className={`text-white/30 text-[10px] text-center font-mono ${isSidebarExpanded ? '' : 'hidden'}`}>
              Version 1.2.0 (Stable)
            </div>
          </div>
        </div>
      </aside>

      {/* Google-Style Full Screen Search Input Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xl z-[100] flex flex-col items-center justify-start pt-32 px-6 transition-all duration-300 animate-fade-in">
          <div className="w-full max-w-[680px] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <input
                type="text"
                placeholder="Search services, case studies, resources..."
                className="w-full bg-transparent text-white text-2xl placeholder-white/25 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-white/50 hover:text-white p-2 text-xs border border-white/10 rounded-lg hover:bg-white/5 transition-all cursor-pointer font-mono"
              >
                ESC
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-col gap-3">
              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Quick Suggestions</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a href="#services" onClick={() => setIsSearchOpen(false)} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span>SEO Optimization</span>
                  <span className="text-[var(--md-sys-color-primary)] text-xs">Service</span>
                </a>
                <a href="#portfolio" onClick={() => setIsSearchOpen(false)} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span>Social Marketing Study</span>
                  <span className="text-[var(--md-sys-color-primary)] text-xs">Case Study</span>
                </a>
                <a href="#blog" onClick={() => setIsSearchOpen(false)} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span>Digital Marketing Trends</span>
                  <span className="text-[var(--md-sys-color-primary)] text-xs">Blog</span>
                </a>
                <a href="#contact" onClick={() => setIsSearchOpen(false)} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span>Book Free Consultation</span>
                  <span className="text-[var(--md-sys-color-primary)] text-xs">Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu (Sliding Overlay matching Image 2) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex lg:hidden">
          {/* Drawer Menu Panel */}
          <div className="w-[280px] bg-[#000000] h-full p-6 flex flex-col justify-between shadow-2xl animate-fade-in-right">

            {/* Drawer Top Header Area */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3.5L9.5 2V20.5L5.5 22V3.5Z" fill="currentColor" className="opacity-90" />
                    <path d="M12 7.5L16 6V18L12 19.5V7.5Z" fill="currentColor" />
                  </svg>
                  <span className="text-white font-bold text-xl tracking-tight">hero</span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="text-white/60 hover:text-white p-1 focus:outline-none cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Drawer Links List */}
              <nav className="flex flex-col gap-2.5 pt-8">
                {/* Dashboard Menu Item */}
                <Link
                  href="/#services"
                  onClick={() => { setIsMobileDrawerOpen(false); setActiveSection('services'); }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeSection === 'services'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/60 hover:bg-white/[0.02] hover:text-white'
                    }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="text-base font-sans tracking-wide">Dashboard</span>
                </Link>

                {/* Team Menu Item */}
                <Link
                  href="/#team"
                  onClick={() => { setIsMobileDrawerOpen(false); setActiveSection('team'); }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeSection === 'team'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/60 hover:bg-white/[0.02] hover:text-white'
                    }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="text-base font-sans tracking-wide">Team</span>
                </Link>

                {/* Settings Menu Item */}
                <Link
                  href="/#contact"
                  onClick={() => { setIsMobileDrawerOpen(false); setActiveSection('contact'); }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeSection === 'contact'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/60 hover:bg-white/[0.02] hover:text-white'
                    }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span className="text-base font-sans tracking-wide">Settings</span>
                </Link>
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3">
              <a href="#contact" onClick={() => setIsMobileDrawerOpen(false)} className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-center hover:bg-white/95 transition-all text-sm font-sans">
                Contact CMA
              </a>
              <span className="text-white/30 text-xs text-center">Version 1.2.0</span>
            </div>

          </div>
          {/* Backdrop Touch Dimmer */}
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default Header;

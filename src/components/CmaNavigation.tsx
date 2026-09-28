'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
];

export default function CmaNavigation({ homeLinks = false }: { homeLinks?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionLinks = links.map((link) => ({ ...link, href: homeLinks ? `/${link.href}` : link.href }));
  const contactHref = homeLinks ? '/#contact' : '#contact';

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="cma-header">
      <Link className="cma-wordmark" href="/" aria-label="CMA home" onClick={() => setMenuOpen(false)}>
        <span className="cma-mark" aria-hidden="true">C</span>
        <span>CMA<span className="cma-wordmark-period">.</span></span>
      </Link>
      <nav className="cma-desktop-nav" aria-label="Main navigation">
        {sectionLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <a className="cma-header-cta" href={contactHref}>Let&apos;s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
      <button
        className="cma-menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="cma-mobile-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      {menuOpen && (
        <nav id="cma-mobile-navigation" className="cma-mobile-nav" aria-label="Mobile navigation">
          {sectionLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          <a href={contactHref} onClick={() => setMenuOpen(false)}>Start a project <ArrowUpRight size={17} /></a>
        </nav>
      )}
    </header>
  );
}

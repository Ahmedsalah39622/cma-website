'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LayoutGrid, List, Search } from 'lucide-react';
import { usePortfolio, type PortfolioItem } from '@/context/PortfolioContext';
import CmaNavigation from '@/components/CmaNavigation';

type ViewMode = 'grid' | 'list';

function ProjectCard({ project, viewMode }: { project: PortfolioItem; viewMode: ViewMode }) {
  return (
    <Link className={`cma-archive-card cma-archive-card-${viewMode}`} href={`/project/${project.id}`} aria-label={`View ${project.title} case study`}>
      <div
        className="cma-archive-image"
        role="img"
        aria-label={project.title}
        style={project.image ? { backgroundImage: `url("${project.image.replaceAll('"', '')}")` } : undefined}
      >
        {!project.image && <span className="cma-archive-placeholder" aria-hidden="true">CMA<span>.</span></span>}
        {project.year && <span className="cma-archive-year">{project.year}</span>}
        <span className="cma-archive-image-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </div>
      <div className="cma-archive-meta">
        <div><span>{project.category}</span><h2>{project.title}</h2><p>{project.company || project.description || 'Creative work by CMA'}</p></div>
        <ArrowUpRight className="cma-archive-meta-arrow" size={19} aria-hidden="true" />
      </div>
    </Link>
  );
}

export default function CmaPortfolioArchive() {
  const { items } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [query, setQuery] = useState('');
  const categories = ['All', ...Array.from(new Set(items.map((project) => project.category).filter(Boolean)))];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProjects = items.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const searchableText = `${project.title} ${project.company} ${project.category} ${project.description || ''}`.toLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  return (
    <main className="cma-site cma-work-archive">
      <CmaNavigation homeLinks />
      <section className="cma-archive-intro">
        <p className="cma-kicker">A LITTLE PROOF OF WHAT WE DO</p>
        <h1>The work<br /><span>speaks.</span></h1>
        <div className="cma-archive-intro-bottom"><p>Different challenges, different people, one thoughtful approach. Take a look around.</p><span>{items.length.toString().padStart(2, '0')} PROJECTS<br />AND COUNTING</span></div>
      </section>

      <section className="cma-archive-content" aria-label="Project archive">
        <div className="cma-archive-toolbar">
          <div className="cma-archive-categories" role="group" aria-label="Filter projects by category">
            {categories.map((category) => <button key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category}</button>)}
          </div>
          <div className="cma-archive-tools">
            <label className="cma-archive-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search projects</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a project" /></label>
            <div className="cma-archive-view" role="group" aria-label="Project layout">
              <button type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}><LayoutGrid size={17} /></button>
              <button type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}><List size={17} /></button>
            </div>
          </div>
        </div>
        <div className="cma-archive-count" aria-live="polite">{filteredProjects.length.toString().padStart(2, '0')} PROJECTS</div>
        {filteredProjects.length > 0 ? (
          <div className={`cma-archive-grid cma-archive-grid-${viewMode}`}>
            {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} viewMode={viewMode} />)}
          </div>
        ) : (
          <div className="cma-archive-empty"><Search size={25} aria-hidden="true" /><h2>No projects found</h2><p>Try another search or category.</p><button type="button" onClick={() => { setQuery(''); setSelectedCategory('All'); }}>Clear filters</button></div>
        )}
      </section>
      <footer className="cma-footer"><Link className="cma-wordmark" href="/" aria-label="CMA home"><span className="cma-mark" aria-hidden="true">C</span><span>CMA<span className="cma-wordmark-period">.</span></span></Link><p>Good ideas. Good people. Good work.</p><Link href="/#contact">Discuss a project <ArrowUpRight size={15} /></Link><span>© {new Date().getFullYear()} CMA Studio</span></footer>
    </main>
  );
}

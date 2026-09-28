import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Asterisk, MoveUpRight } from 'lucide-react';
import CmaContactForm from '@/components/CmaContactForm';
import CmaNavigation from '@/components/CmaNavigation';

type Project = {
  id: string;
  title: string;
  company?: string;
  category?: string;
  image?: string;
  description?: string;
  year?: string;
};

type HomepageProps = {
  services: { id: string; title: string; count?: string }[];
  serviceSettings: { count: string; optionsText: string };
  team: { id: string; name: string; role: string; image?: string }[];
  brands: { id: string; name: string; image?: string }[];
  contact: { email: string; phone: string; address: string; addressLine2?: string };
  projects: Project[];
  testimonials: { id: string; quote: string; author: string; role?: string }[];
  faqs: { id: string; question: string; answer: string }[];
  blogPosts: { id: string; title: string; excerpt?: string; readTime?: string; imageUrl?: string }[];
  visibility: Record<string, boolean>;
};

const showSection = (visibility: HomepageProps['visibility'], section: string) => visibility[section] !== false;

function ProjectImage({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <div
      className={`cma-project-image ${className}`}
      role="img"
      aria-label={project.title}
      style={project.image ? { backgroundImage: `url("${project.image.replaceAll('"', '')}")` } : undefined}
    >
      {!project.image && <span aria-hidden="true">CMA<span>.</span></span>}
      <div className="cma-image-grain" aria-hidden="true" />
    </div>
  );
}

export default function CmaHomepage({
  services,
  serviceSettings,
  team,
  brands,
  contact,
  projects,
  testimonials,
  faqs,
  blogPosts,
  visibility,
}: HomepageProps) {
  const leadProject = projects[0];
  return (
    <main className="cma-site">
      <CmaNavigation />

      {showSection(visibility, 'hero') && (
        <section className="cma-hero" id="top">
          <div className="cma-hero-copy">
            <p className="cma-eyebrow"><span className="cma-live-dot" /> Independent creative growth studio <span>CMA / CREATIVE PARTNER</span></p>
            <h1>Make your brand<br />impossible to <span>ignore<Asterisk aria-hidden="true" /></span></h1>
            <div className="cma-hero-bottom">
              <p>We bring strategy, creativity, and the right people together to turn ambitious brands into the ones everyone remembers.</p>
              <a className="cma-circle-link" href="#work" aria-label="Explore our work"><ArrowDown size={20} /></a>
            </div>
          </div>
          <div className="cma-hero-visual">
            {leadProject ? (
              <Link href={`/project/${leadProject.id}`} className="cma-hero-image-link" aria-label={`View ${leadProject.title} project`}>
                <ProjectImage project={leadProject} className="cma-hero-image" />
              </Link>
            ) : (
              <div className="cma-hero-image cma-hero-image-fallback" aria-hidden="true"><span>BRANDS<br />THAT MOVE.</span><Asterisk /></div>
            )}
            <div className="cma-hero-stamp" aria-hidden="true"><span>STRATEGY</span><Asterisk size={21} /><span>STORY</span><Asterisk size={21} /><span>IMPACT</span></div>
            <div className="cma-hero-caption">
              <div><span>IN THE SPOTLIGHT</span><strong>{leadProject?.title || 'Ideas built to make a difference'}</strong></div>
              <span>{leadProject?.category || 'CMA / CREATIVE STUDIO'}</span>
            </div>
          </div>
          <div className="cma-scroll-note"><span>SCROLL TO EXPLORE</span><span /></div>
        </section>
      )}

      {showSection(visibility, 'brands') && brands.length > 0 && (
        <section className="cma-client-band" aria-label="Selected clients">
          <p>BRANDS WE&apos;RE PROUD TO WORK WITH</p>
          <div className="cma-client-viewport">
            <div className="cma-client-marquee">
              {[0, 1].map((copy) => (
                <div className="cma-client-track" key={copy} aria-hidden={copy === 1}>
                  {brands.map((brand) => (
                    <span className="cma-client-logo" key={brand.id}>
                      {brand.image ? <span role="img" aria-label={brand.name} style={{ backgroundImage: `url("${brand.image.replaceAll('"', '')}")` }} /> : brand.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showSection(visibility, 'portfolio') && projects.length > 0 && (
        <section className="cma-section cma-work-section" id="work">
          <div className="cma-section-heading">
            <div><p className="cma-kicker">A FEW RECENT WINS</p><h2>Work with a<br /><span>point of view.</span></h2></div>
            <Link className="cma-text-link" href="/work">Explore all projects <ArrowUpRight size={17} /></Link>
          </div>
          <div className="cma-project-grid">
            {projects.slice(0, 3).map((project, index) => (
              <Link className={`cma-project-card cma-project-card-${index + 1}`} href={`/project/${project.id}`} key={project.id}>
                <ProjectImage project={project} />
                <div className="cma-project-meta"><div><span>{project.company || project.category || 'SELECTED WORK'}</span><h3>{project.title}</h3></div><MoveUpRight size={20} aria-hidden="true" /></div>
              </Link>
            ))}
          </div>
          <p className="cma-work-note">Thoughtful work, made together. <span>{projects.length} projects and counting.</span></p>
        </section>
      )}

      <section className="cma-proof-band" aria-label="CMA at a glance">
        <div className="cma-proof-intro"><span>SMALL ENOUGH TO CARE.</span><span>BUILT TO MAKE A DIFFERENCE.</span></div>
        <div className="cma-proof-stat"><strong>{projects.length.toString().padStart(2, '0')}</strong><span>Selected projects</span></div>
        <div className="cma-proof-stat"><strong>{services.length.toString().padStart(2, '0')}</strong><span>Ways we can help</span></div>
        <div className="cma-proof-stat"><strong>{brands.length.toString().padStart(2, '0')}</strong><span>Good people we work with</span></div>
      </section>

      {showSection(visibility, 'services') && (
        <section className="cma-section cma-services-section" id="services">
          <div className="cma-services-lead"><p className="cma-kicker">WHAT WE BRING TO THE TABLE</p><h2>Clarity first.<br /><span>Then momentum.</span></h2><p>From the first big question to the final detail, we make the right things happen in the right order.</p></div>
          <div className="cma-service-list">
            {services.map((service, index) => (
              <div className="cma-service-row" key={service.id}><span className="cma-service-index">0{index + 1}</span><h3>{service.title}</h3><ArrowUpRight size={19} aria-hidden="true" /></div>
            ))}
            {Number.parseInt(serviceSettings.count, 10) > 0 && <div className="cma-service-more"><span>AND MORE GOOD THINGS</span><strong>+{serviceSettings.count}</strong><span>{serviceSettings.optionsText}</span></div>}
          </div>
        </section>
      )}

      {showSection(visibility, 'testimonials') && testimonials.length > 0 && (
        <section className="cma-quote-section">
          <div className="cma-quote-mark" aria-hidden="true">“</div>
          <div><p className="cma-kicker">KIND WORDS, REAL PEOPLE</p><blockquote>{testimonials[0].quote}</blockquote><p className="cma-quote-credit"><strong>{testimonials[0].author}</strong>{testimonials[0].role && <span>{testimonials[0].role}</span>}</p></div>
          <span className="cma-quote-decoration" aria-hidden="true"><Asterisk size={92} strokeWidth={1} /></span>
        </section>
      )}

      {showSection(visibility, 'team') && team.length > 0 && (
        <section className="cma-section cma-team-section" id="about">
          <div className="cma-section-heading"><div><p className="cma-kicker">NICE TO MEET YOU</p><h2>Good people.<br /><span>Better together.</span></h2></div><p>Big ideas are a team sport. Meet a few of the people behind the work.</p></div>
          <div className="cma-team-list">
            {team.slice(0, 5).map((member) => <div className="cma-team-person" key={member.id}><div className="cma-team-photo" role={member.image ? 'img' : undefined} aria-label={member.image ? member.name : undefined} style={member.image ? { backgroundImage: `url("${member.image.replaceAll('"', '')}")` } : undefined}><span>{member.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span></div><div><strong>{member.name}</strong><span>{member.role}</span></div></div>)}
          </div>
        </section>
      )}

      {showSection(visibility, 'blog') && blogPosts.length > 0 && (
        <section className="cma-section cma-journal-section" id="journal">
          <div className="cma-section-heading"><div><p className="cma-kicker">NOTES FROM THE STUDIO</p><h2>Ideas worth<br /><span>passing on.</span></h2></div></div>
          <div className="cma-journal-grid">
            {blogPosts.slice(0, 3).map((post) => <article className="cma-journal-entry" key={post.id}><span>{post.readTime || 'FROM THE JOURNAL'}</span><h3>{post.title}</h3><p>{post.excerpt}</p><ArrowUpRight size={18} aria-hidden="true" /></article>)}
          </div>
        </section>
      )}

      {showSection(visibility, 'faq') && faqs.length > 0 && (
        <section className="cma-section cma-faq-section">
          <div className="cma-faq-title"><p className="cma-kicker">A GOOD PLACE TO START</p><h2>Fair questions.</h2></div>
          <div className="cma-faq-list">{faqs.slice(0, 5).map((faq) => <details key={faq.id}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div>
        </section>
      )}

      {showSection(visibility, 'contact') && (
        <section className="cma-contact-section" id="contact">
          <div className="cma-contact-copy"><p className="cma-kicker">HAVE A GOOD ONE IN MIND?</p><h2>Let&apos;s make<br />something <span>matter.</span></h2><p>Tell us what you&apos;re working on. We&apos;ll bring the questions, ideas, and an honest point of view.</p><div className="cma-contact-details">{contact.email && <a href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight size={15} /></a>}{contact.phone && <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}<ArrowUpRight size={15} /></a>}{contact.address && <span>{contact.address}{contact.addressLine2 ? `, ${contact.addressLine2}` : ''}</span>}</div></div>
          <CmaContactForm />
        </section>
      )}

      <footer className="cma-footer"><Link className="cma-wordmark" href="/" aria-label="CMA home"><span className="cma-mark" aria-hidden="true">C</span><span>CMA<span className="cma-wordmark-period">.</span></span></Link><p>Good ideas. Good people. Good work.</p><a href="#top">Back to top <ArrowUpRight size={15} /></a><span>© {new Date().getFullYear()} CMA Studio</span></footer>
    </main>
  );
}

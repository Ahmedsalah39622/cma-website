import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Brands from '@/components/Brands';
import Portfolio from '@/components/Portfolio';
import Team from '@/components/Team';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Services from '@/components/Services';

// Server Actions
import { getProjects } from '@/actions/portfolio';
import { getServices, getServiceSettings } from '@/actions/services';
import { getTeamMembers } from '@/actions/team';
import { getBrands } from '@/actions/brands';
import { getContactInfo } from '@/actions/contact';
import { getSectionVisibility } from '@/actions/settings';

export default async function Home() {
  // Fetch data in parallel for speed
  const [
    servicesData,
    serviceSettings,
    teamData,
    brandsData,
    contactData,
    projectsData,
    visibility
  ] = await Promise.all([
    getServices(),
    getServiceSettings(),
    getTeamMembers(),
    getBrands(),
    getContactInfo(),
    getProjects(),
    getSectionVisibility()
  ]);

  // Normalize data for components
  const normalizedBrands = brandsData.map(b => ({ ...b, image: b.imageUrl || '' }));
  const normalizedProjects = projectsData.map(p => ({ ...p, image: p.imageUrl || '' }));
  const normalizedTeam = teamData.map(t => ({ ...t, image: t.imageUrl || '' }));
  const normalizedContact = {
    email: (contactData as any)?.email || '',
    phone: (contactData as any)?.phone || '',
    address: (contactData as any)?.address || '',
    addressLine2: (contactData as any)?.addressLine2 || ''
  };
  const safeServiceSettings = {
    count: (serviceSettings as any)?.count || '0+',
    optionsText: (serviceSettings as any)?.optionsText || 'Services'
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] section-wrapper pt-header">
      <Header />

      {visibility.hero !== false && <Hero />}
      {visibility.brands !== false && <Brands brands={normalizedBrands as any} />}
      {visibility.portfolio !== false && <Portfolio projects={normalizedProjects as any} />}
      {visibility.services !== false && (
        <Services
          services={servicesData as any}
          moreCount={safeServiceSettings.count}
          moreOptionsText={safeServiceSettings.optionsText}
        />
      )}
      {visibility.testimonials !== false && <Testimonials />}
      {visibility.team !== false && <Team teamMembers={normalizedTeam as any} />}
      {visibility.faq !== false && <FAQ />}
      {visibility.blog !== false && <Blog />}
      {visibility.cta !== false && <CTA />}
      {visibility.contact !== false && <Contact contactInfo={normalizedContact} />}

      <Footer />
    </main>
  );
}

export const dynamic = 'force-dynamic';
import CmaHomepage from '@/components/CmaHomepage';
import './cma-homepage.css';

// Server Actions
import { getProjects } from '@/actions/portfolio';
import { getServices, getServiceSettings } from '@/actions/services';
import { getTeamMembers } from '@/actions/team';
import { getBrands } from '@/actions/brands';
import { getContactInfo } from '@/actions/contact';
import { getSectionVisibility } from '@/actions/settings';
import { getTestimonials } from '@/actions/testimonials';
import { getFaqs } from '@/actions/faqs';
import { getBlogPosts } from '@/actions/blog';

export default async function Home() {
  // Fetch data in parallel for speed
  const [
    servicesData,
    serviceSettings,
    teamData,
    brandsData,
    contactData,
    projectsData,
    visibility,
    testimonialsData,
    faqsData,
    blogPostsData
  ] = await Promise.all([
    getServices(),
    getServiceSettings(),
    getTeamMembers(),
    getBrands(),
    getContactInfo(),
    getProjects(),
    getSectionVisibility(),
    getTestimonials(),
    getFaqs(),
    getBlogPosts()
  ]);

  // Normalize data for components
  const normalizedBrands = brandsData.map((b) => ({ ...b, image: b.imageUrl || '' }));
  const normalizedProjects = projectsData.map((p) => ({ ...p, image: p.imageUrl || '' }));
  const normalizedTeam = teamData.map((t) => ({ ...t, image: t.imageUrl || '' }));
  const normalizedContact = {
    email: contactData?.email || '',
    phone: contactData?.phone || '',
    address: contactData?.address || '',
    addressLine2: contactData?.addressLine2 || ''
  };
  const safeServiceSettings = {
    count: serviceSettings?.count || '0+',
    optionsText: serviceSettings?.optionsText || 'Services'
  };

  return (
    <CmaHomepage
      services={servicesData}
      serviceSettings={safeServiceSettings}
      team={normalizedTeam}
      brands={normalizedBrands}
      contact={normalizedContact}
      projects={normalizedProjects}
      testimonials={testimonialsData}
      faqs={faqsData}
      blogPosts={blogPostsData}
      visibility={visibility}
    />
  );
}

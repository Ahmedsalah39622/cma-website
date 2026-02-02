import { ServicesProvider } from "@/context/ServicesContext";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { TestimonialsProvider } from "@/context/TestimonialsContext";
import { BrandsProvider } from "@/context/BrandsContext";
import { FAQProvider } from "@/context/FAQContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { BlogProvider } from "@/context/BlogContext";
import { getServices, getServiceSettings } from '@/actions/services';
import { getTestimonials } from '@/actions/testimonials';
import { getFaqs } from '@/actions/faqs';
import { getProjects } from '@/actions/portfolio';
import { getTeamMembers } from '@/actions/team';
import { getBrands } from '@/actions/brands';
import { getContactInfo } from '@/actions/contact';
import { getSectionVisibility } from '@/actions/settings';
import { getBlogPosts } from '@/actions/blog';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "CMA Mobile - Creative Marketing Agency",
    description: "CMA Mobile Experience - Transform your brand with data-driven strategies",
};

export default async function MobileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch all data server-side
    const [
        services,
        settings,
        testimonialsData,
        faqsData,
        projectsData,
        teamData,
        brandsData,
        contactData,
        visibility,
        blogPostsData
    ] = await Promise.all([
        getServices(),
        getServiceSettings(),
        getTestimonials(),
        getFaqs(),
        getProjects(),
        getTeamMembers(),
        getBrands(),
        getContactInfo(),
        getSectionVisibility(),
        getBlogPosts()
    ]);

    const testimonials = testimonialsData.map((t: any) => ({
        id: t.id,
        quote: t.quote,
        author: t.author,
        role: t.role || '',
        image: t.imageUrl || ''
    }));

    const faqs = faqsData.map((f: any) => ({
        id: f.id,
        question: f.question,
        answer: f.answer
    }));

    const projects = projectsData.map((p: any) => ({
        ...p,
        image: p.imageUrl || p.image || '/portfolio-placeholder.jpg',
    }));

    const brands = brandsData.map((b: any) => ({
        id: b.id,
        name: b.name,
        image: b.imageUrl || b.image || ''
    }));

    const posts = blogPostsData.map((p: any) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt || '',
        color: p.color || '#45A7DE',
        readTime: p.readTime || '5 min read',
        content: p.content || '',
        imageUrl: p.imageUrl || ''
    }));

    return (
        <div className="mobile-layout">
            <ServicesProvider initialServices={services as any} initialSettings={settings as any}>
                <SiteDataProvider
                    initialVisibility={visibility}
                    initialContact={contactData}
                    initialTeam={teamData}
                >
                    <TestimonialsProvider initialTestimonials={testimonials}>
                        <BrandsProvider initialBrands={brands}>
                            <PortfolioProvider initialItems={projects}>
                                <FAQProvider initialFaqs={faqs}>
                                    <BlogProvider initialPosts={posts}>
                                        {children}
                                    </BlogProvider>
                                </FAQProvider>
                            </PortfolioProvider>
                        </BrandsProvider>
                    </TestimonialsProvider>
                </SiteDataProvider>
            </ServicesProvider>
        </div>
    );
}

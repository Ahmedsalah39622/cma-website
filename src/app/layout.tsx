export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { TestimonialsProvider } from "@/context/TestimonialsContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { BrandsProvider } from "@/context/BrandsContext";
import { FAQProvider } from "@/context/FAQContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cma-website.vercel.app'),
  title: "CMA Studio | Creative Strategy, Content & Digital Growth",
  description: "CMA brings strategy, creativity, and digital expertise together to build brands people remember and businesses that move forward.",
  keywords: "CMA Studio, creative agency, brand strategy, digital marketing, content production, creative growth",
  openGraph: {
    title: "CMA Studio | Make your brand impossible to ignore",
    description: "Strategy, creativity, and the right people to move ambitious brands forward.",
    type: "website",
    images: [
      {
        url: '/logo-big-hatchedwhite.png',
        width: 1200,
        height: 630,
        alt: 'CMA - Creative Marketing Agency',
      },
    ],
  },
  icons: {
    icon: "/cma-logo.png",
    apple: "/cma-logo.png",
  },
};
import { Analytics } from "@vercel/analytics/react";

import { getServices, getServiceSettings } from '@/actions/services';
import { getTestimonials } from '@/actions/testimonials';
import { getFaqs } from '@/actions/faqs';
import { getBlogPosts } from '@/actions/blog';
import { getProjects } from '@/actions/portfolio';
import { getBrands } from '@/actions/brands';
import { getTeamMembers } from '@/actions/team';
import { getContactInfo } from '@/actions/contact';
import { getSectionVisibility } from '@/actions/settings';
import { BlogProvider } from "@/context/BlogContext";
import { UIProvider } from "@/context/UIContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    services,
    settings,
    testimonialsData,
    faqsData,
    blogPostsData,
    projectsData,
    brandsData,
    teamData,
    contactData,
    visibility
  ] = await Promise.all([
    getServices(),
    getServiceSettings(),
    getTestimonials(),
    getFaqs(),
    getBlogPosts(),
    getProjects(),
    getBrands(),
    getTeamMembers(),
    getContactInfo(),
    getSectionVisibility()
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

  const posts = blogPostsData.map((p: any) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || '',
    color: p.color || '#45A7DE',
    readTime: p.readTime || '5 min read',
    content: p.content || '',
    imageUrl: p.imageUrl || ''
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

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <SmoothScroll>
            <ServicesProvider initialServices={services as any} initialSettings={settings as any}>
              <SiteDataProvider
                initialVisibility={visibility}
                initialContact={contactData}
                initialTeam={teamData}
              >
                <TestimonialsProvider initialTestimonials={testimonials}>
                  <FAQProvider initialFaqs={faqs}>
                    <BlogProvider initialPosts={posts}>
                      <PortfolioProvider initialItems={projects}>
                        <BrandsProvider initialBrands={brands}>
                          <UIProvider>
                            {children}
                            <WhatsAppButton />
                          </UIProvider>
                        </BrandsProvider>
                      </PortfolioProvider>
                    </BlogProvider>
                  </FAQProvider>
                </TestimonialsProvider>
              </SiteDataProvider>
            </ServicesProvider>
          </SmoothScroll>
          <CustomCursor />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

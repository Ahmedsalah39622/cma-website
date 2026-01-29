import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { TestimonialsProvider } from "@/context/TestimonialsContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { BrandsProvider } from "@/context/BrandsContext";
import { FAQProvider } from "@/context/FAQContext";
import MobileNotice from "@/components/MobileNotice";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CMA - Creative Marketing Agency | Transform Your Digital Presence",
  description: "CMA is a leading digital marketing agency specializing in branding, social media, SEO, and video production. We help businesses grow through innovative marketing strategies.",
  keywords: "marketing agency, digital marketing, branding, social media marketing, SEO, video production, creative agency",
  openGraph: {
    title: "CMA - Creative Marketing Agency",
    description: "Transform your brand with data-driven strategies and creative excellence",
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
    icon: "/logo.png",
    apple: "/logo.png",
  },
};
import { Analytics } from "@vercel/analytics/react";

import { getServices, getServiceSettings } from '@/actions/services';
import { getTestimonials } from '@/actions/testimonials';
import { getFaqs } from '@/actions/faqs';
import { getBlogPosts } from '@/actions/blog';
import { BlogProvider } from "@/context/BlogContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [services, settings, testimonialsData, faqsData, blogPostsData] = await Promise.all([
    getServices(),
    getServiceSettings(),
    getTestimonials(),
    getFaqs(),
    getBlogPosts()
  ]);

  const testimonials = testimonialsData.map(t => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role || '',
    image: t.imageUrl || ''
  }));

  const faqs = faqsData.map(f => ({
    id: f.id,
    question: f.question,
    answer: f.answer
  }));

  const posts = blogPostsData.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || '',
    color: p.color || '#45A7DE',
    readTime: p.readTime || '5 min read',
    content: p.content || '',
    imageUrl: p.imageUrl || ''
  }));

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <MobileNotice />
        <ServicesProvider initialServices={services as any} initialSettings={settings as any}>
          <SiteDataProvider>
            <TestimonialsProvider initialTestimonials={testimonials}>
              <FAQProvider initialFaqs={faqs}>
                <BlogProvider initialPosts={posts}>
                  <PortfolioProvider>
                    <BrandsProvider>
                      {children}
                      <WhatsAppButton />
                    </BrandsProvider>
                  </PortfolioProvider>
                </BlogProvider>
              </FAQProvider>
            </TestimonialsProvider>
          </SiteDataProvider>
        </ServicesProvider>
        <Analytics />
      </body>
    </html>
  );
}

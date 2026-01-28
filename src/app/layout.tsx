import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { TestimonialsProvider } from "@/context/TestimonialsContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { BrandsProvider } from "@/context/BrandsContext";
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
  },
};
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <MobileNotice />
        <ServicesProvider>
          <SiteDataProvider>
            <TestimonialsProvider>
              <PortfolioProvider>
                <BrandsProvider>
                  {children}
                  <WhatsAppButton />
                </BrandsProvider>
              </PortfolioProvider>
            </TestimonialsProvider>
          </SiteDataProvider>
        </ServicesProvider>
        <Analytics />
      </body>
    </html>
  );
}

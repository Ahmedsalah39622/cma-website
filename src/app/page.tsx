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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] section-wrapper pt-header">
      <Header />
      <Hero />
      <Brands />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Blog />
      <CTA />
      <Contact />

      <Footer />
    </main>
  );
}

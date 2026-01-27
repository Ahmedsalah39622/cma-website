import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
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
    <main className="min-h-screen bg-[#FAFAFA] section-wrapper">
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Team />
      <Testimonials />
      <FAQ />
      <Blog />
      <CTA />
      <Contact />
    
      <Footer />
    </main>
  );
}

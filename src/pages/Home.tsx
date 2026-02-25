import { useSEO } from '../hooks/useSEO';
import CtaBand from '../components/CtaBand';
import GalleryTeaser from '../components/GalleryTeaser';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import ServicesPreview from '../components/ServicesPreview';
import Testimonials from '../components/Testimonials';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';

export default function Home() {
  useSEO({ title: 'Home', description: 'Alpha Ultimate offers premium home and commercial cleaning services in Riyadh, Saudi Arabia. Deep cleaning, move-in/out, post-construction. Book 24/7.', canonical: '/' });
  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <ServicesPreview />
      <GalleryTeaser />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CtaBand />
    </div>
  );
}

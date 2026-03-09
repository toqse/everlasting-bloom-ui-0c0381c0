import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import StatsSection from "@/components/StatsSection";
import FeaturedProfiles from "@/components/FeaturedProfiles";
import SuccessStories from "@/components/SuccessStories";
import WhyChooseUs from "@/components/WhyChooseUs";

import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== "#") {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <SearchFilters />
      <StatsSection />
      <FeaturedProfiles />
      <WhyChooseUs />
      <SuccessStories />
      <PhotoGallery />
      <Footer />
    </main>
  );
};

export default Index;

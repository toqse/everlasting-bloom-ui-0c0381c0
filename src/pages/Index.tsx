import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import FeaturedProfiles from "@/components/FeaturedProfiles";
import SuccessStories from "@/components/SuccessStories";
import Membership from "@/components/Membership";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* SEO Meta Tags */}
      <title>EternalBond - Find Your Forever Love | India's Trusted Matrimony</title>
      <meta name="description" content="Join India's most trusted matrimony service. Find your perfect life partner with advanced matching, verified profiles, and millions of success stories. Start your journey to forever love today." />

      <Navbar />
      <Hero />
      <SearchFilters />
      <FeaturedProfiles />
      <SuccessStories />
      <Membership />
      <Footer />
    </main>
  );
};

export default Index;

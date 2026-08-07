"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import SuccessStories from "@/components/SuccessStories";
import WhyChooseUs from "@/components/WhyChooseUs";

import PhotoGallery from "@/components/PhotoGallery";

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
    <main className="min-h-screen overflow-x-clip">
      <Hero />
      <StatsSection />
      <WhyChooseUs />
      <SuccessStories />
      <PhotoGallery />
    </main>
  );
};

export default Index;

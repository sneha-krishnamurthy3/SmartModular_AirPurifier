import React from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { FeaturesGrid } from '../components/features/FeaturesGrid';
import { ExplodedViewSection } from '../components/modular/ExplodedViewSection';
import { HowItWorksTimeline } from '../components/workflow/HowItWorksTimeline';
import { SustainabilitySection } from '../components/sustainability/SustainabilitySection';
import { ProductShowcase } from '../components/product/ProductShowcase';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { FAQSection } from '../components/faq/FAQSection';

export const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-brand-black">
      <HeroSection />
      <FeaturesGrid />
      <ExplodedViewSection />
      <HowItWorksTimeline />
      <SustainabilitySection />
      <ProductShowcase />
      <ReviewsSection />
      <FAQSection />
    </main>
  );
};

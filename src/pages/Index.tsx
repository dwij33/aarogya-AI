import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import { MentalHealthChat } from "@/components/home/MentalHealthChat";
import { ServiceFeatures } from "@/components/home/ServiceFeatures";
import { HealthNewsSection } from "@/components/home/HealthNewsSection";

export default function Home() {
  useEffect(() => {
    document.title = "ArogyaAI+ | AI-Powered Healthcare";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto">
            <MentalHealthChat />
          </div>
        </div>
        <HealthNewsSection />
        <ServiceFeatures />
        <FeatureSection />
        <TestimonialSection />
        <CTASection />
      </main>
    </div>
  );
}

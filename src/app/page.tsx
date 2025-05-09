"use client";

import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import WhyChoose from "../components/home/WhyChoose";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedProperties from "../components/home/FeaturedProperties";
import BCTToken from "../components/home/BCTToken";
import SDGGoals from "../components/home/SDGGoals";
import TrustIndicators from "../components/home/TrustIndicators";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <Stats />
      <WhyChoose />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="properties">
        <FeaturedProperties />
      </section>
      <TrustIndicators />
      <section id="bct-token">
        <BCTToken />
      </section>
      <section id="sdg-goals">
        <SDGGoals />
      </section>
    </main>
  );
}

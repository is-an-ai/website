import React from "react";
import {
  HeroSection,
  HowItWorksSection,
  ExamplesSection,
  CommunityCTASection,
} from "@/components";

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <HowItWorksSection />
      <ExamplesSection />
      <CommunityCTASection />
    </div>
  );
};

export default HomePage;

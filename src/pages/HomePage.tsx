import {
  HeroSection,
  HowItWorksSection,
  ExamplesSection,
  CommunityCTASection,
} from "@/components";

const HomePage = () => {
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

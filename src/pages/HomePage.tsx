import {
  HeroSection,
  HowItWorksSection,
  ExamplesSection,
  CommunityCTASection,
  BugReportButton,
} from "@/components";

const HomePage = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <HowItWorksSection />
      <ExamplesSection />
      <CommunityCTASection />
      <BugReportButton />
    </div>
  );
};

export default HomePage;

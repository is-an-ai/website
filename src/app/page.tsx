import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ExamplesSection from "@/components/ExamplesSection";
import CommunityCTASection from "@/components/CommunityCTASection";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <HowItWorksSection />
      <ExamplesSection />
      <CommunityCTASection />
    </div>
  );
}

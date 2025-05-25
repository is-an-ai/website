import StepCard from "./StepCard";

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Choose subdomain",
      description: "Pick any available name for your AI project",
    },
    {
      step: 2,
      title: "Point to your site",
      description: "Enter your domain, IP, or hosting platform",
    },
    {
      step: 3,
      title: "You're live",
      description: "DNS propagates within minutes, SSL included",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-mono">
            How it works
          </h2>
          <p className="text-gray-600">Three steps. That&apos;s it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

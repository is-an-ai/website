import SubdomainChecker from "./SubdomainChecker";

const HeroSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded-full mb-4">
              Free • Open Source • Community Driven
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 font-mono">
              <span className="text-cyan-600">your-project</span>.is-an.ai
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Free subdomains for AI projects. No GitHub PRs, no DNS config, no
              waiting.
              <br />
              <span className="text-sm text-gray-500 font-mono">
                Just like is-a.dev, but for AI stuff.
              </span>
            </p>
          </div>

          <SubdomainChecker />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

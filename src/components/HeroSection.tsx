import { Link } from "react-router-dom";
import SubdomainChecker from "./SubdomainChecker";
import TypingAnimation from "./TypingAnimation";

const HeroSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded-full mb-4">
              Free • Open Source • Community Driven
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-mono leading-tight">
              <span className="text-cyan-600 bg-gray-100 rounded-md px-2 py-1">
                <TypingAnimation
                  words={[
                    "jarvis",
                    "friday",
                    "cortana",
                    "hal-9000",
                    "skynet",
                    "ava",
                    "samantha",
                    "wall-e",
                    "data",
                    "glados",
                    "karen",
                    "viki",
                  ]}
                />
              </span>
              .is-an.ai
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
              Free subdomains for AI projects. No GitHub PRs, no DNS config, no
              waiting.
              <br className="hidden sm:block" />
              <span className="text-sm text-gray-500 font-mono block sm:inline mt-2 sm:mt-0">
                Just like is-a.dev, but for AI stuff.
              </span>
            </p>
          </div>

          <SubdomainChecker />

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-colors font-mono"
            >
              Go to Dashboard
            </Link>
            <span className="text-sm text-gray-500 font-mono text-center">
              Manage your subdomains
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

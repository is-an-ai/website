import { Link } from "react-router-dom";
import { useAllSubdomains } from "@/hooks/useAllSubdomains";
import { DOMAIN_SUFFIX } from "@/lib/constants";
import ExampleCard from "./ExampleCard";

const ExamplesSection = () => {
  const { subdomains, isLoading } = useAllSubdomains();

  // Show first 4 subdomains as examples
  const examples = subdomains.slice(0, 4).map((subdomain) => ({
    subdomain: `${subdomain.subdomainName}${DOMAIN_SUFFIX}`,
    description: subdomain.description,
  }));

  // Fallback examples if no data or error
  const fallbackExamples = [
    {
      subdomain: "your-project.is-an.ai",
      description: "Your AI project could be here",
    },
    {
      subdomain: "amazing-ai.is-an.ai",
      description: "Join the community of AI innovators",
    },
    {
      subdomain: "ml-research.is-an.ai",
      description: "Share your research with the world",
    },
    {
      subdomain: "ai-demo.is-an.ai",
      description: "Showcase your AI demonstrations",
    },
  ];

  const displayExamples = examples.length > 0 ? examples : fallbackExamples;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-mono">
            Live examples
          </h2>
          <p className="text-gray-600">
            {examples.length > 0
              ? "AI projects already using is-an.ai subdomains"
              : "Join the growing community of AI developers"}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading examples...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {displayExamples.map((example) => (
                <ExampleCard
                  key={example.subdomain}
                  subdomain={example.subdomain}
                  description={example.description}
                />
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link
                to="/examples"
                className="text-sm text-gray-600 hover:text-gray-900 underline hover:no-underline font-mono"
              >
                View all &gt;
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ExamplesSection;

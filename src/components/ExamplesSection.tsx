import { Link } from "react-router-dom";
import { useAllSubdomains } from "@/hooks/useAllSubdomains";
import { DOMAIN_SUFFIX } from "@/lib/constants";
import ExampleCard from "./ExampleCard";

const ExamplesSection = () => {
  const { subdomains, isLoading, error } = useAllSubdomains();

  // Show first 4 subdomains as examples
  const examples = subdomains.slice(0, 4).map((subdomain) => ({
    subdomain: `${subdomain.subdomainName}${DOMAIN_SUFFIX}`,
    description: subdomain.description,
  }));

  if (error) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-mono">
              Live examples
            </h2>
            <div className="text-red-500 mb-4">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Failed to load examples</p>
            <Link
              to="/examples"
              className="text-sm text-cyan-600 hover:text-cyan-800 underline hover:no-underline font-mono"
            >
              View examples page &gt;
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-mono">
            Live examples
          </h2>
          <p className="text-gray-600">
            {examples.length > 0
              ? "AI projects using is-an.ai subdomains"
              : "Real AI projects will appear here"}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading examples...</p>
          </div>
        ) : (
          <>
            {examples.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {examples.map((example) => (
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
                    View all {subdomains.length} projects &gt;
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg font-mono mb-2">
                  No projects yet
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Be the first to register a subdomain!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors font-mono"
                >
                  Register Your Subdomain
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ExamplesSection;

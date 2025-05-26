import { useMemo } from "react";
import { useAllSubdomains } from "@/hooks/api/useSubdomains";
import { Subdomain } from "@/types/api";
import { DOMAIN_SUFFIX } from "@/lib/constants";

interface Project {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  isLive: boolean;
}

// Helper function to transform Subdomain to Project
const transformSubdomainToProject = (subdomain: Subdomain): Project => {
  return {
    id: subdomain.subdomainId,
    name: subdomain.subdomainName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "), // Convert kebab-case to Title Case
    subdomain: `${subdomain.subdomainName}${DOMAIN_SUFFIX}`,
    description: subdomain.description,
    isLive: true, // Assume all registered subdomains are live
  };
};

const ExamplesPage = () => {
  const {
    data: subdomains = [],
    isLoading,
    error,
    refetch,
  } = useAllSubdomains();

  // Transform subdomains to projects
  const projects: Project[] = useMemo(() => {
    return subdomains.map(transformSubdomainToProject);
  }, [subdomains]);

  const getStatusBadge = (isLive: boolean) => {
    return isLive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
        Live
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
        Coming Soon
      </span>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load projects
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-mono">
            AI Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI projects using{" "}
            <span className="font-mono font-semibold">is-an.ai</span> subdomains
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        )}

        {/* Stats */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 font-mono">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Projects</div>
            </div>
            <div className="bg-white rounded-lg border p-6 text-center">
              <div className="text-3xl font-bold text-green-600 font-mono">
                {projects.filter((p) => p.isLive).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Live & Running</div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    {getStatusBadge(project.isLive)}
                  </div>

                  <div className="mb-3">
                    <a
                      href={
                        project.isLive ? `https://${project.subdomain}` : "#"
                      }
                      target={project.isLive ? "_blank" : "_self"}
                      rel={project.isLive ? "noopener noreferrer" : ""}
                      className={`font-mono text-sm ${
                        project.isLive
                          ? "text-cyan-600 hover:text-cyan-800 hover:underline"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {project.subdomain}
                      {project.isLive && (
                        <svg
                          className="inline w-3 h-3 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                        </svg>
                      )}
                    </a>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-mono">
              No projects found
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Be the first to register a subdomain!
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-mono">
            Want to add your AI project?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get your own subdomain and deploy your AI project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors font-mono"
            >
              Register Your Subdomain
            </a>
            <a
              href="/docs"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors font-mono"
            >
              Read Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage;

import { useState } from "react";

interface Project {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  category: string;
  tags: string[];
  isLive: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const ExamplesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories: Category[] = [
    {
      id: "all",
      name: "All Projects",
      description: "View all AI projects using is-an.ai",
    },
    {
      id: "demos",
      name: "AI Demos",
      description: "Interactive AI demonstrations",
    },
    {
      id: "research",
      name: "Research Tools",
      description: "Academic and research projects",
    },
    {
      id: "models",
      name: "Model APIs",
      description: "AI model inference endpoints",
    },
    {
      id: "datasets",
      name: "Data Tools",
      description: "Dataset exploration and tools",
    },
  ];

  // Mock data - in real app this would come from API
  const projects: Project[] = [
    {
      id: "1",
      name: "Neural Style Transfer",
      subdomain: "neural-art.is-an.ai",
      description:
        "Transform your photos using AI-powered artistic style transfer with various painting styles.",
      category: "demos",
      tags: ["Computer Vision", "Art", "PyTorch"],
      isLive: true,
    },
    {
      id: "2",
      name: "Smart Chat Assistant",
      subdomain: "smart-chat.is-an.ai",
      description:
        "Conversational AI assistant powered by fine-tuned language models for domain-specific queries.",
      category: "demos",
      tags: ["NLP", "Chatbot", "Transformers"],
      isLive: true,
    },
    {
      id: "3",
      name: "Research Paper Explorer",
      subdomain: "paper-explorer.is-an.ai",
      description:
        "Search and analyze machine learning research papers with semantic similarity and citation graphs.",
      category: "research",
      tags: ["NLP", "Research", "Knowledge Graph"],
      isLive: true,
    },
    {
      id: "4",
      name: "Sentiment Analysis API",
      subdomain: "sentiment-api.is-an.ai",
      description:
        "High-performance sentiment analysis for social media text with multi-language support.",
      category: "models",
      tags: ["NLP", "API", "Sentiment"],
      isLive: true,
    },
    {
      id: "5",
      name: "Medical Image Classifier",
      subdomain: "med-vision.is-an.ai",
      description:
        "AI-powered medical image analysis for early disease detection and diagnosis assistance.",
      category: "research",
      tags: ["Computer Vision", "Healthcare", "CNN"],
      isLive: false,
    },
    {
      id: "6",
      name: "Dataset Visualizer",
      subdomain: "data-viz.is-an.ai",
      description:
        "Interactive visualization tool for exploring high-dimensional datasets with dimensionality reduction.",
      category: "datasets",
      tags: ["Data Science", "Visualization", "t-SNE"],
      isLive: true,
    },
    {
      id: "7",
      name: "Code Generation Assistant",
      subdomain: "code-gen.is-an.ai",
      description:
        "AI-powered code completion and generation for Python, JavaScript, and machine learning frameworks.",
      category: "demos",
      tags: ["Code Generation", "Programming", "GPT"],
      isLive: true,
    },
    {
      id: "8",
      name: "Speech Recognition Demo",
      subdomain: "speech-to-text.is-an.ai",
      description:
        "Real-time speech recognition with custom vocabulary and noise reduction capabilities.",
      category: "demos",
      tags: ["Speech", "Audio", "Whisper"],
      isLive: true,
    },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-mono">
            AI Project Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing AI projects built by researchers and developers
            using <span className="font-mono font-semibold">is-an.ai</span>{" "}
            subdomains
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                  activeCategory === category.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {activeCategory !== "all" && (
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                {categories.find((c) => c.id === activeCategory)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
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
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 font-mono">
              {new Set(projects.flatMap((p) => p.tags)).size}
            </div>
            <div className="text-sm text-gray-600 mt-1">AI Technologies</div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
                    href={project.isLive ? `https://${project.subdomain}` : "#"}
                    target={project.isLive ? "_blank" : "_self"}
                    rel={project.isLive ? "noopener noreferrer" : ""}
                    className={`font-mono text-sm ${
                      project.isLive
                        ? "text-purple-600 hover:text-purple-800 hover:underline"
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

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-mono">
              No projects found in this category
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Try selecting a different category above
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-mono">
            Want to showcase your AI project?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join the community of AI researchers and developers. Get your own
            subdomain and share your innovation with the world.
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

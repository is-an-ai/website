import { useState } from "react";

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick Start Guide
          </h2>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3">
              What you'll get:
            </h3>
            <p className="text-purple-800">
              A subdomain like{" "}
              <code className="bg-purple-100 px-2 py-1 rounded text-sm">
                your-project.is-an.ai
              </code>{" "}
              pointing to your AI project
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-mono text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Choose your subdomain
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Pick a memorable name that represents your AI project
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-mono text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Connect your GitHub
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  We'll automatically create a pull request for you
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-mono text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Wait for approval
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Usually takes 24-48 hours for review and activation
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "examples",
      title: "Examples",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Good Subdomain Examples
          </h2>

          <div className="grid gap-4">
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <code className="font-mono text-lg">smart-chat.is-an.ai</code>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  ✓ Good
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Descriptive, clear purpose, uses hyphens
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <code className="font-mono text-lg">neural-art.is-an.ai</code>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  ✓ Good
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                AI domain specific, memorable
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex items-center justify-between">
                <code className="font-mono text-lg">test123.is-an.ai</code>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  ✗ Avoid
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Generic, not descriptive, includes numbers
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Naming Guidelines:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use lowercase letters and hyphens only</li>
              <li>• Make it descriptive of your AI project</li>
              <li>• Keep it under 20 characters</li>
              <li>• Avoid numbers unless they're meaningful</li>
              <li>• Check availability on the registration page</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Common Issues</h2>

          <div className="space-y-4">
            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                My subdomain isn't working after approval
              </summary>
              <div className="p-4 pt-0 text-gray-600 text-sm">
                <p className="mb-2">
                  DNS propagation can take up to 24 hours. Try:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Clear your browser cache</li>
                  <li>Try accessing from a different device</li>
                  <li>Check DNS propagation with online tools</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                Pull request was rejected
              </summary>
              <div className="p-4 pt-0 text-gray-600 text-sm">
                <p className="mb-2">Common rejection reasons:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Subdomain already taken</li>
                  <li>Inappropriate naming</li>
                  <li>Target URL not responding</li>
                  <li>Not an AI-related project</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                GitHub authentication failed
              </summary>
              <div className="p-4 pt-0 text-gray-600 text-sm">
                <p className="mb-2">Try these steps:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure you have a public GitHub profile</li>
                  <li>Disable browser extensions that block popups</li>
                  <li>Clear cookies and try again</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      title: "FAQ",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is this service free?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, completely free for AI researchers and enthusiasts.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my subdomain later?
              </h3>
              <p className="text-gray-600 text-sm">
                No, subdomains are permanent. Choose carefully.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                What kind of projects are allowed?
              </h3>
              <p className="text-gray-600 text-sm">
                Any AI, ML, or data science related projects. No commercial
                restrictions.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I point to localhost?
              </h3>
              <p className="text-gray-600 text-sm">
                No, only publicly accessible URLs are allowed.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does approval take?
              </h3>
              <p className="text-gray-600 text-sm">
                Usually 24-48 hours. Complex cases may take longer.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeContent = sections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 font-mono">
                Documentation
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-mono transition-colors ${
                        activeSection === section.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border p-8">
              {activeContent?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;

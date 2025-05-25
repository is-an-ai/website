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

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
            <h3 className="font-semibold text-cyan-900 mb-3">
              What you'll get:
            </h3>
            <p className="text-cyan-800">
              A subdomain like{" "}
              <code className="bg-cyan-100 px-2 py-1 rounded text-sm">
                your-project.is-an.ai
              </code>{" "}
              pointing to your AI project - <strong>instantly!</strong>
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
                  Sign in with GitHub
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Simple one-click authentication - no account creation needed
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-mono text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Register instantly
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Your subdomain is active immediately - no waiting required!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Alternative: GitHub Repository Method
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              For advanced users who prefer the traditional approach:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Fork the is-an.ai repository</li>
              <li>Add your DNS record following the JSON schema</li>
              <li>Submit a pull request</li>
              <li>Automatic processing via GitHub Actions</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "examples",
      title: "Platform Integration",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Deploy with Popular Platforms
          </h2>

          <div className="space-y-6">
            {/* Vercel */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">▲</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Vercel</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    1. Deploy your project to Vercel
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Your app URL: https://my-project.vercel.app
                  </code>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    2. Register subdomain on is-an.ai
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Subdomain: my-project.is-an.ai →
                    https://my-project.vercel.app
                  </code>
                </div>
                <p className="text-xs text-gray-500">
                  ✨ Works instantly with any Vercel deployment
                </p>
              </div>
            </div>

            {/* Cloudflare Pages */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">☁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cloudflare Pages
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    1. Deploy to Cloudflare Pages
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Your app URL: https://my-project.pages.dev
                  </code>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    2. Point your is-an.ai subdomain
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Subdomain: my-project.is-an.ai →
                    https://my-project.pages.dev
                  </code>
                </div>
                <p className="text-xs text-gray-500">
                  🚀 Perfect for static sites and SPAs
                </p>
              </div>
            </div>

            {/* GitHub Pages */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  GitHub Pages
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    1. Enable GitHub Pages in your repo
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Your app URL: https://username.github.io/repo-name
                  </code>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    2. Create your is-an.ai subdomain
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Subdomain: my-project.is-an.ai →
                    https://username.github.io/repo-name
                  </code>
                </div>
                <p className="text-xs text-gray-500">
                  📚 Great for documentation and project showcases
                </p>
              </div>
            </div>

            {/* Netlify */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Netlify</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    1. Deploy your site to Netlify
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Your app URL: https://amazing-site-123.netlify.app
                  </code>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    2. Set up your custom subdomain
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                    Subdomain: my-project.is-an.ai →
                    https://amazing-site-123.netlify.app
                  </code>
                </div>
                <p className="text-xs text-gray-500">
                  ⚡ Excellent for JAMstack applications
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Pro Tips:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Make sure your target URL is publicly accessible</li>
              <li>• HTTPS URLs are recommended for security</li>
              <li>• You can update the target URL anytime in your dashboard</li>
              <li>• DNS changes take 5-10 minutes to propagate</li>
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
                My subdomain isn't working after registration
              </summary>
              <div className="p-4 pt-0 text-gray-600 text-sm">
                <p className="mb-2">
                  DNS propagation can take a few minutes. Try:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Wait 5-10 minutes for DNS propagation</li>
                  <li>Clear your browser cache</li>
                  <li>Try accessing from a different device</li>
                  <li>Check DNS propagation with online tools</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                Subdomain registration failed
              </summary>
              <div className="p-4 pt-0 text-gray-600 text-sm">
                <p className="mb-2">Common reasons for failure:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Subdomain already taken</li>
                  <li>Invalid subdomain format</li>
                  <li>Target URL not responding</li>
                  <li>Rate limiting (try again in a few minutes)</li>
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
                  <li>Check if GitHub is experiencing issues</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                Can't access my dashboard
              </summary>
              <div className="p-4 pt-0 text-gray-600 text-sm">
                <p className="mb-2">Dashboard access issues:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure you're signed in with GitHub</li>
                  <li>Clear browser cache and cookies</li>
                  <li>Try signing out and back in</li>
                  <li>Check if you have any registered subdomains</li>
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
                Yes, completely free for everyone. No hidden costs or
                limitations for basic subdomain registration.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                How fast is the registration process?
              </h3>
              <p className="text-gray-600 text-sm">
                Instant! Your subdomain is active immediately after
                registration. DNS propagation takes 5-10 minutes.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my subdomain later?
              </h3>
              <p className="text-gray-600 text-sm">
                You can update DNS records (target URL) anytime through your
                dashboard. To change the subdomain name itself, delete the
                current one and create a new one.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                What kind of projects are allowed?
              </h3>
              <p className="text-gray-600 text-sm">
                Any projects are welcome! While we focus on AI, you don't need
                to have an AI-related project to use our service.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I point to localhost?
              </h3>
              <p className="text-gray-600 text-sm">
                No, only publicly accessible URLs are allowed. Your target must
                be reachable from the internet.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                How many subdomains can I register?
              </h3>
              <p className="text-gray-600 text-sm">
                There's no strict limit, but please be reasonable.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if my target URL goes down?
              </h3>
              <p className="text-gray-600 text-sm">
                Your subdomain will continue to point to the URL you specified.
                Update it in your dashboard when your service is back up.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I delete my subdomain?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can delete your subdomains anytime through your
                dashboard. This action is permanent.
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

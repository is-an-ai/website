import { useState } from "react";
import { BugReportButton } from "@/components";

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface StepItem {
  number: string | number;
  title: string;
  description: string;
  extra?: React.ReactNode;
  bgColor?: string;
}

interface PlatformConfig {
  name: string;
  icon: string;
  iconBg: string;
  steps: Array<{
    title: string;
    code: string;
  }>;
  note: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// Reusable Components
const StepList = ({ steps }: { steps: StepItem[] }) => (
  <div className="space-y-4">
    {steps.map((step, index) => (
      <div
        key={index}
        className="flex items-start space-x-4 p-4 border rounded-lg"
      >
        <div
          className={`flex-shrink-0 w-8 h-8 ${
            step.bgColor || "bg-gray-900"
          } text-white rounded-full flex items-center justify-center font-mono text-sm`}
        >
          {step.number}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{step.title}</h4>
          <p className="text-gray-600 text-sm mt-1">{step.description}</p>
          {step.extra}
        </div>
      </div>
    ))}
  </div>
);

const PlatformCard = ({ platform }: { platform: PlatformConfig }) => (
  <div className="border rounded-lg p-6">
    <div className="flex items-center mb-4">
      <div
        className={`w-8 h-8 ${platform.iconBg} rounded flex items-center justify-center mr-3`}
      >
        <span className="text-white text-xs font-bold">{platform.icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
    </div>
    <div className="space-y-3">
      {platform.steps.map((step, index) => (
        <div key={index} className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600 mb-2">{step.title}</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
            {step.code}
          </code>
        </div>
      ))}
      <p className="text-xs text-gray-500">{platform.note}</p>
    </div>
  </div>
);

const FAQSection = ({ items }: { items: FAQItem[] }) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <div key={index} className="border-b pb-4">
        <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
        <p className="text-gray-600 text-sm">{item.answer}</p>
      </div>
    ))}
  </div>
);

const TroubleshootingSection = ({
  items,
}: {
  items: Array<{ title: string; content: React.ReactNode }>;
}) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <details key={index} className="border rounded-lg">
        <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
          {item.title}
        </summary>
        <div className="p-4 pt-0 text-gray-600 text-sm">{item.content}</div>
      </details>
    ))}
  </div>
);

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  // Data configurations
  const howItWorksSteps: StepItem[] = [
    {
      number: 1,
      title: "User submits subdomain request",
      description:
        "Via website form or direct GitHub pull request to the repository",
    },
    {
      number: 2,
      title: "Repository update (via PR)",
      description:
        "DNS records are stored as JSON files in the public GitHub repository",
      extra: (
        <div className="mt-2 bg-gray-50 rounded p-2">
          <code className="text-xs text-gray-700">
            • Website users: Automated bot creates PR
            <br />• Manual users: Direct pull request submission
          </code>
        </div>
      ),
    },
    {
      number: 3,
      title: "GitHub Actions trigger",
      description:
        "When PR is merged, automated workflow processes the DNS changes",
    },
    {
      number: 4,
      title: "Cloudflare API integration",
      description:
        "GitHub Actions calls Cloudflare API to update DNS records in real-time",
    },
    {
      number: "✓",
      title: "Subdomain goes live",
      description: "DNS propagation completes within 5-10 minutes globally",
      bgColor: "bg-green-600",
    },
  ];

  const gettingStartedSteps: StepItem[] = [
    {
      number: 1,
      title: "Choose your subdomain",
      description: "Pick a memorable name that represents your AI project",
    },
    {
      number: 2,
      title: "Sign in with GitHub",
      description:
        "Simple one-click authentication - no account creation needed",
    },
    {
      number: 3,
      title: "Register subdomain",
      description: "Your subdomain becomes active within minutes",
    },
  ];

  const platforms: PlatformConfig[] = [
    {
      name: "Vercel",
      icon: "▲",
      iconBg: "bg-black",
      steps: [
        {
          title: "1. Deploy your project to Vercel",
          code: "Your app URL: https://my-project.vercel.app",
        },
        {
          title: "2. Register subdomain on is-an.ai with CNAME",
          code: "Subdomain: my-project.is-an.ai → cname.vercel-dns.com (CNAME)",
        },
        {
          title: "3. Add custom domain in Vercel",
          code: "Project Settings → Domains → Add: my-project.is-an.ai",
        },
      ],
      note: "Works with any Vercel deployment",
    },
    {
      name: "Cloudflare Pages",
      icon: "☁",
      iconBg: "bg-orange-500",
      steps: [
        {
          title: "1. Deploy to Cloudflare Pages",
          code: "Your app URL: https://my-project.pages.dev",
        },
        {
          title: "2. Register subdomain on is-an.ai with CNAME",
          code: "Subdomain: my-project.is-an.ai → my-project.pages.dev (CNAME)",
        },
        {
          title: "3. Add custom domain in Cloudflare Pages",
          code: "Pages → Custom domains → Set up: my-project.is-an.ai",
        },
      ],
      note: "🚀 Perfect for static sites and SPAs",
    },
    {
      name: "GitHub Pages",
      icon: "⚡",
      iconBg: "bg-gray-900",
      steps: [
        {
          title: "1. Enable GitHub Pages in your repo",
          code: "Your app URL: https://username.github.io/repo-name",
        },
        {
          title: "2. Register subdomain on is-an.ai with CNAME",
          code: "Subdomain: my-project.is-an.ai → username.github.io (CNAME)",
        },
        {
          title: "3. Configure custom domain in GitHub",
          code: "Settings → Pages → Custom domain: my-project.is-an.ai",
        },
      ],
      note: "Good for documentation and project sites",
    },
    {
      name: "Netlify",
      icon: "N",
      iconBg: "bg-teal-500",
      steps: [
        {
          title: "1. Deploy your site to Netlify",
          code: "Your app URL: https://amazing-site-123.netlify.app",
        },
        {
          title: "2. Register subdomain on is-an.ai with CNAME",
          code: "Subdomain: my-project.is-an.ai → amazing-site-123.netlify.app (CNAME)",
        },
        {
          title: "3. Add custom domain in Netlify",
          code: "Site Settings → Domain management → Add: my-project.is-an.ai",
        },
      ],
      note: "⚡ Excellent for JAMstack applications",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Is this service free?",
      answer:
        "Yes, completely free for everyone. No hidden costs or limitations for basic subdomain registration.",
    },
    {
      question: "How fast is the registration process?",
      answer:
        "Instant! Your subdomain is active immediately after registration. DNS propagation takes 5-10 minutes.",
    },
    {
      question: "Can I change my subdomain later?",
      answer:
        "You can update DNS records (target URL) anytime through your dashboard. To change the subdomain name itself, delete the current one and create a new one.",
    },
    {
      question: "What kind of projects are allowed?",
      answer:
        "Any projects are welcome! While we focus on AI, you don't need to have an AI-related project to use our service.",
    },
    {
      question: "Can I point to localhost?",
      answer:
        "No, only publicly accessible URLs are allowed. Your target must be reachable from the internet.",
    },
    {
      question: "How many subdomains can I register?",
      answer:
        "Each account can register up to 5 subdomains. This limit helps ensure fair usage for all users.",
    },
    {
      question: "What happens if my target URL goes down?",
      answer:
        "Your subdomain will continue to point to the URL you specified. Update it in your dashboard when your service is back up.",
    },
    {
      question: "Can I delete my subdomain?",
      answer:
        "Yes, you can delete your subdomains anytime through your dashboard. This action is permanent.",
    },
  ];

  const troubleshootingItems = [
    {
      title: "My subdomain isn't working after registration",
      content: (
        <>
          <p className="mb-2">DNS propagation can take a few minutes. Try:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Wait 5-10 minutes for DNS propagation</li>
            <li>Clear your browser cache</li>
            <li>Try accessing from a different device</li>
            <li>Check DNS propagation with online tools</li>
          </ul>
        </>
      ),
    },
    {
      title: "Subdomain registration failed",
      content: (
        <>
          <p className="mb-2">Common reasons for failure:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Subdomain already taken</li>
            <li>Invalid subdomain format</li>
            <li>Target URL not responding</li>
            <li>Rate limiting (try again in a few minutes)</li>
          </ul>
        </>
      ),
    },
    {
      title: "GitHub authentication failed",
      content: (
        <>
          <p className="mb-2">Try these steps:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure you have a public GitHub profile</li>
            <li>Disable browser extensions that block popups</li>
            <li>Clear cookies and try again</li>
            <li>Check if GitHub is experiencing issues</li>
          </ul>
        </>
      ),
    },
    {
      title: "Can't access my dashboard",
      content: (
        <>
          <p className="mb-2">Dashboard access issues:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure you're signed in with GitHub</li>
            <li>Clear browser cache and cookies</li>
            <li>Try signing out and back in</li>
            <li>Check if you have any registered subdomains</li>
          </ul>
        </>
      ),
    },
  ];

  const sections: DocSection[] = [
    {
      id: "how-it-works",
      title: "How It Works",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            System Architecture
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              🔄 Registration Flow:
            </h3>
            <p className="text-blue-800 text-sm">
              is-an.ai operates as a DNS management service backed by GitHub and
              Cloudflare infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            <StepList steps={howItWorksSteps} />
          </div>
        </div>
      ),
    },
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
              pointing to your AI project.
            </p>
          </div>

          <div className="space-y-4">
            <StepList steps={gettingStartedSteps} />
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
            {platforms.map((platform) => (
              <PlatformCard key={platform.name} platform={platform} />
            ))}
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

          <TroubleshootingSection items={troubleshootingItems} />
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

          <FAQSection items={faqItems} />
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

      {/* Bug Report Button */}
      <BugReportButton />
    </div>
  );
};

export default DocsPage;

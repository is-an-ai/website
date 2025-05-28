import { Link } from "react-router-dom";
import ExampleCard from "./ExampleCard";

const PREDEFINED_EXAMPLES = [
  {
    subdomain: "beautyclip.is-an.ai",
    description: "AI-powered cosmetic search engine",
  },
  {
    subdomain: "trax.is-an.ai",
    description: "Just like Figma, but for musicians",
  },
  {
    subdomain: "seo.is-an.ai",
    description: "Developer Seo's portfolio",
  },
  {
    subdomain: "chungjung.is-an.ai",
    description: "Chungjung's personal blog",
  },
];

const ExamplesSection = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-mono">
            Live examples
          </h2>
          <p className="text-gray-600">AI projects using is-an.ai subdomains</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {PREDEFINED_EXAMPLES.map((example) => (
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
            View all projects &gt;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;

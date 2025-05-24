import ExampleCard from "./ExampleCard";

const ExamplesSection = () => {
  const examples = [
    {
      subdomain: "chatbot.is-an.ai",
      description: "GPT-powered customer support chatbot",
    },
    {
      subdomain: "vision.is-an.ai",
      description: "Computer vision model for image classification",
    },
    {
      subdomain: "nlp-toolkit.is-an.ai",
      description: "Natural language processing research tools",
    },
    {
      subdomain: "ml-ops.is-an.ai",
      description: "MLOps dashboard for model monitoring",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-mono">
            Live examples
          </h2>
          <p className="text-gray-600">
            AI projects already using is-an.ai subdomains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example) => (
            <ExampleCard
              key={example.subdomain}
              subdomain={example.subdomain}
              description={example.description}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-900 underline hover:no-underline font-mono"
          >
            View all &gt;
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;

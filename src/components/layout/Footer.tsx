import { GITHUB_REPOSITORY_URL, DOMAIN_SUFFIX } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-mono font-semibold text-gray-900 mb-2">
              is-an.ai
            </h3>
            <p className="text-xs text-gray-600 max-w-md font-mono">
              Free {DOMAIN_SUFFIX} subdomains for AI projects.{" "}
              <a
                href={GITHUB_REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Contribute on GitHub
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center text-xs font-mono text-gray-500">
          <p>Open source. MIT licensed.</p>
          <p className="mt-2 md:mt-0">
            Inspired by{" "}
            <a
              href="https://is-a.dev"
              className="underline hover:no-underline"
              target="_blank"
            >
              is-a.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

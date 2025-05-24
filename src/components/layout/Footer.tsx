import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-mono font-semibold text-gray-900 mb-2">
              is-an.ai
            </h3>
            <p className="text-xs text-gray-600 max-w-md font-mono">
              Free .is-an.ai subdomains for AI projects.{" "}
              <a href="#" className="underline hover:no-underline">
                Contribute on GitHub
              </a>
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-mono">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              how it works
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              api docs
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              community
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              status
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center text-xs font-mono text-gray-500">
          <p>Built by developers, for developers. MIT licensed.</p>
          <p className="mt-2 md:mt-0">
            Inspired by{" "}
            <a href="#" className="underline hover:no-underline">
              is-a.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

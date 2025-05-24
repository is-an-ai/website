import React from "react";

interface BrowserMockupProps {
  children: React.ReactNode;
}

const BrowserMockup: React.FC<BrowserMockupProps> = ({ children }) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2 ml-4 flex-1">
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Address Bar */}
          <div className="mt-3">
            <div className="flex items-center bg-white rounded border border-gray-300 px-3 py-2">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-gray-500 font-mono text-sm">https://</span>
              <input
                type="text"
                placeholder="my-ai-project"
                className="font-mono text-blue-600 bg-transparent outline-none border-none flex-1 text-sm"
              />
              <span className="text-gray-900 font-mono text-sm">.is-an.ai</span>
            </div>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="bg-white p-8">{children}</div>
      </div>
    </div>
  );
};

export default BrowserMockup;

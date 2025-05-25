import React, { useState, useCallback } from "react";
import { useSubdomains } from "@/hooks/useSubdomains";
import { useAuth } from "@/hooks/useAuth";

interface SubdomainCheckerProps {
  onAvailabilityCheck?: (subdomain: string, isAvailable: boolean) => void;
}

const SubdomainChecker = ({ onAvailabilityCheck }: SubdomainCheckerProps) => {
  const [subdomainInput, setSubdomainInput] = useState("");
  const { isAuthenticated, login } = useAuth();
  const {
    isCheckingAvailability,
    availabilityResult,
    error,
    checkAvailability,
    clearError,
    clearAvailabilityResult,
  } = useSubdomains();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setSubdomainInput(value);
      clearAvailabilityResult();
      clearError();
    },
    [clearAvailabilityResult, clearError]
  );

  const handleCheckAvailability = useCallback(async () => {
    if (!subdomainInput.trim()) {
      return;
    }

    const isAvailable = await checkAvailability(subdomainInput.trim());
    onAvailabilityCheck?.(subdomainInput.trim(), isAvailable);
  }, [subdomainInput, checkAvailability, onAvailabilityCheck]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCheckAvailability();
      }
    },
    [handleCheckAvailability]
  );

  const renderResult = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <svg
            className="w-5 h-5 flex-shrink-0"
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
          <span className="text-sm text-center">{error}</span>
        </div>
      );
    }

    if (availabilityResult === true) {
      return (
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-center">
            {subdomainInput}.is-an.ai is available!
          </span>
        </div>
      );
    }

    if (availabilityResult === false) {
      return (
        <div className="flex items-center justify-center space-x-2 text-orange-600">
          <svg
            className="w-5 h-5 flex-shrink-0"
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
          <span className="text-sm font-medium text-center">
            {subdomainInput}.is-an.ai is already taken
          </span>
        </div>
      );
    }

    return null;
  };

  const renderAuthPrompt = () => {
    if (isAuthenticated) return null;

    return (
      <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
        <p className="text-sm text-cyan-800 mb-3 text-center">
          Sign in to register your subdomain
        </p>
        <div className="flex justify-center">
          <button
            onClick={login}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="truncate">Continue with GitHub</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mb-8 px-4 sm:px-0">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 ml-4 flex-1">
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
          <div className="mt-2 sm:mt-3">
            <div className="flex items-center bg-white rounded border border-gray-300 px-2 sm:px-3 py-2">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1 sm:mr-2 flex-shrink-0"
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
              <span className="text-gray-500 font-mono text-xs sm:text-sm">
                https://
              </span>
              <input
                type="text"
                value={subdomainInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="my-ai-project"
                className="font-mono text-cyan-600 bg-transparent outline-none border-none flex-1 text-xs sm:text-sm min-w-0"
                disabled={isCheckingAvailability}
              />
              <span className="text-gray-900 font-mono text-xs sm:text-sm">
                .is-an.ai
              </span>
            </div>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="bg-white p-4 sm:p-6 lg:p-8">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              {isCheckingAvailability ? (
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
              {isCheckingAvailability
                ? "Checking availability..."
                : "Ready to check availability?"}
            </h3>

            <p className="text-gray-600 mb-4 sm:mb-6 text-sm px-2">
              Enter your desired subdomain in the address bar above
            </p>

            {renderResult()}

            <div className="mt-4 sm:mt-6">
              <button
                onClick={handleCheckAvailability}
                disabled={!subdomainInput.trim() || isCheckingAvailability}
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-cyan-600 text-white font-medium text-sm rounded-lg hover:bg-cyan-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isCheckingAvailability ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 animate-spin flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Check Availability
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 sm:mt-4">
              Free • SSL included
            </p>

            {renderAuthPrompt()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubdomainChecker;

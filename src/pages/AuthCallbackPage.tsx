import React from "react";

const AuthCallbackPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-blue-500 animate-spin"
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
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Authenticating with GitHub
        </h1>

        <p className="text-gray-600 text-sm">
          Please wait while we complete your sign-in...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

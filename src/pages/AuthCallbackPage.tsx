import { useEffect } from "react";
import { useAuth } from "@/hooks/api/useAuth";

const AuthCallbackPage = () => {
  const { isLoading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    // If authentication is successful, redirect to dashboard
    // This is handled by useAuth, but we can also handle it here as backup
    if (isAuthenticated && !isLoading) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isLoading]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Failed
          </h1>

          <p className="text-gray-600 text-sm mb-6">{error}</p>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Successfully Authenticated!
          </h1>

          <p className="text-gray-600 text-sm">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Loading state
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

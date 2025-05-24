import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubdomains } from "@/hooks/useSubdomains";
import CreateSubdomainModal from "@/components/CreateSubdomainModal";
import Toast from "@/components/Toast";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const {
    subdomains,
    isLoading,
    error,
    fetchMySubdomains,
    clearError,
    checkAvailability,
    createSubdomain,
    isCheckingAvailability,
    availabilityResult,
    clearAvailabilityResult,
  } = useSubdomains();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
      return;
    }

    if (isAuthenticated) {
      fetchMySubdomains();
    }
  }, [isAuthenticated, authLoading, navigate, fetchMySubdomains]);

  const handleCloseModal = () => {
    setShowCreateForm(false);
    clearAvailabilityResult();
    clearError();
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleCopySubdomain = async (subdomainName: string) => {
    try {
      await navigator.clipboard.writeText(`${subdomainName}.is-an.ai`);
      showToast("Subdomain copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy to clipboard", "error");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-mono">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
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
                <span className="text-red-800 text-sm">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Subdomains section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Subdomains
              </h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm"
              >
                Add Subdomain
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading subdomains...</p>
              </div>
            ) : subdomains.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No subdomains yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first subdomain
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm"
                >
                  Create Subdomain
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {subdomains.map((subdomain) => (
                  <div
                    key={subdomain.subdomainId}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-cyan-600 font-semibold text-lg">
                          {subdomain.subdomainName}.is-an.ai
                        </h3>
                        <button
                          onClick={() =>
                            handleCopySubdomain(subdomain.subdomainName)
                          }
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy subdomain"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {subdomain.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {subdomain.record.type}:{" "}
                          {Array.isArray(subdomain.record.value)
                            ? subdomain.record.value.join(", ")
                            : String(subdomain.record.value)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created{" "}
                        {new Date(subdomain.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create form modal placeholder */}
        {showCreateForm && (
          <CreateSubdomainModal
            isOpen={showCreateForm}
            onClose={handleCloseModal}
            onSubmit={createSubdomain}
            onCheckAvailability={checkAvailability}
            isLoading={isLoading}
            isCheckingAvailability={isCheckingAvailability}
            availabilityResult={availabilityResult}
            error={error}
          />
        )}
      </main>

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default DashboardPage;

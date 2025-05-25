import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubdomains } from "@/hooks/useSubdomains";
import { CreateSubdomainModal, EditSubdomainModal } from "@/components";
import Toast from "@/components/Toast";
import { DOMAIN_SUFFIX } from "@/lib/constants";
import { Subdomain } from "@/types/api";

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
    updateSubdomain,
    deleteSubdomain,
  } = useSubdomains();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSubdomain, setEditingSubdomain] = useState<Subdomain | null>(
    null
  );
  const [deletingSubdomain, setDeletingSubdomain] = useState<Subdomain | null>(
    null
  );
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

  const handleCloseEditModal = () => {
    setShowEditForm(false);
    setEditingSubdomain(null);
    clearError();
  };

  const handleEditSubdomain = (subdomain: Subdomain) => {
    setEditingSubdomain(subdomain);
    setShowEditForm(true);
  };

  const handleDeleteSubdomain = (subdomain: Subdomain) => {
    setDeletingSubdomain(subdomain);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSubdomain) return;

    try {
      await deleteSubdomain(deletingSubdomain.subdomainName);
      showToast("Subdomain deleted successfully!");
      setShowDeleteConfirm(false);
      setDeletingSubdomain(null);
    } catch {
      // Error is already handled by the hook
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingSubdomain(null);
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
      await navigator.clipboard.writeText(`${subdomainName}${DOMAIN_SUFFIX}`);
      showToast("Subdomain copied to clipboard!");
    } catch {
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-mono">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 text-sm self-start sm:self-auto"
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
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Subdomains
              </h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full sm:w-auto bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm"
              >
                Add Subdomain
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4">
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
                <p className="text-gray-600 mb-4 px-4 text-center">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h3 className="font-mono text-cyan-600 font-semibold text-base sm:text-lg truncate">
                          {subdomain.subdomainName}
                          {DOMAIN_SUFFIX}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopySubdomain(subdomain.subdomainName)
                          }
                          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
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
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {subdomain.description}
                    </p>

                    {/* DNS Records - Mobile optimized */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 space-y-1 sm:space-y-0 sm:space-x-2 sm:flex sm:flex-wrap">
                        {subdomain.record.map((record, index) => (
                          <span
                            key={index}
                            className="font-mono bg-gray-100 px-2 py-1 rounded block sm:inline-block"
                          >
                            {record.type}:{" "}
                            {Array.isArray(record.value)
                              ? record.value.join(", ")
                              : String(record.value)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions - Mobile optimized */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="text-xs text-gray-500">
                        Created{" "}
                        {new Date(subdomain.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditSubdomain(subdomain)}
                          className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-cyan-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubdomain(subdomain)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create form modal */}
        {showCreateForm && (
          <CreateSubdomainModal
            isOpen={showCreateForm}
            onClose={handleCloseModal}
            onSubmit={async (data) => {
              try {
                await createSubdomain(data);
                showToast("Subdomain created successfully!");
              } catch {
                // Error is already handled by the hook
              }
            }}
            onCheckAvailability={checkAvailability}
            isLoading={isLoading}
            isCheckingAvailability={isCheckingAvailability}
            availabilityResult={availabilityResult}
            error={error}
          />
        )}

        {/* Edit form modal */}
        {showEditForm && (
          <EditSubdomainModal
            isOpen={showEditForm}
            onClose={handleCloseEditModal}
            onSubmit={async (data) => {
              try {
                await updateSubdomain(editingSubdomain!.subdomainName, data);
                showToast("Subdomain updated successfully!");
                handleCloseEditModal();
              } catch {
                // Error is already handled by the hook
              }
            }}
            subdomain={editingSubdomain}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* Delete confirmation modal */}
        {showDeleteConfirm && deletingSubdomain && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Subdomain
                </h3>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <svg
                    className="w-6 h-6"
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

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Are you sure?
                    </h4>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    You are about to delete:
                  </p>
                  <p className="font-mono text-cyan-600 font-semibold">
                    {deletingSubdomain.subdomainName}
                    {DOMAIN_SUFFIX}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {deletingSubdomain.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Delete Subdomain"
                  )}
                </button>
              </div>
            </div>
          </div>
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

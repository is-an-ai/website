import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import { useAuth } from "@/hooks/api/useAuth";
import {
  useMySubdomains,
  useCreateSubdomain,
  useUpdateSubdomain,
  useDeleteSubdomain,
} from "@/hooks/api/useSubdomains";
import {
  CreateSubdomainModal,
  EditSubdomainModal,
  BugReportButton,
} from "@/components";
import Toast from "@/components/Toast";
import { DOMAIN_SUFFIX, MAX_SUBDOMAINS_PER_USER } from "@/lib/constants";
import {
  Subdomain,
  CreateSubdomainRequest,
  UpdateSubdomainRequest,
} from "@/types/api";
import { getErrorMessage } from "@/lib/validation";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();

  // React Query hooks
  const { data: subdomains = [], isLoading, error } = useMySubdomains();
  const createMutation = useCreateSubdomain();
  const updateMutation = useUpdateSubdomain();
  const deleteMutation = useDeleteSubdomain();

  // Local state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Check if user has reached subdomain limit
  const hasReachedLimit = subdomains.length >= MAX_SUBDOMAINS_PER_USER;
  const isLegacyUser = subdomains.length > MAX_SUBDOMAINS_PER_USER;

  const handleCreateSubdomain = async (data: CreateSubdomainRequest) => {
    if (hasReachedLimit) {
      showToast(
        `Maximum ${MAX_SUBDOMAINS_PER_USER} subdomains allowed per account`,
        "error"
      );
      return;
    }

    try {
      await createMutation.mutateAsync(data);
      showToast("Subdomain created successfully!");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, "error");
      throw error; // Re-throw so modal can handle it
    }
  };

  const handleUpdateSubdomain = async (
    data: UpdateSubdomainRequest,
    subdomainName: string
  ) => {
    try {
      await updateMutation.mutateAsync({
        name: subdomainName,
        data,
      });
      showToast("Subdomain updated successfully!");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, "error");
      throw error; // Re-throw so modal can handle it
    }
  };

  const handleDeleteSubdomain = async () => {
    if (!deletingSubdomain) return;

    try {
      await deleteMutation.mutateAsync(deletingSubdomain.subdomainName);
      showToast("Subdomain deleted successfully!");
      setShowDeleteConfirm(false);
      setDeletingSubdomain(null);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, "error");
    }
  };

  const handleCopySubdomain = async (subdomainName: string) => {
    try {
      await navigator.clipboard.writeText(`${subdomainName}${DOMAIN_SUFFIX}`);
      showToast("Subdomain copied to clipboard!");
    } catch {
      showToast("Failed to copy to clipboard", "error");
    }
  };

  const handleNavigateToDocs = (section?: string) => {
    const docsPath = section ? `/docs#${section}` : "/docs";
    navigate(docsPath);
  };

  const showCreateModal = () => {
    if (hasReachedLimit) {
      showToast(
        `Maximum ${MAX_SUBDOMAINS_PER_USER} subdomains allowed per account`,
        "error"
      );
      return;
    }

    NiceModal.show(CreateSubdomainModal, {
      onSubmit: handleCreateSubdomain,
      onNavigateToDocs: handleNavigateToDocs,
      isLoading: createMutation.isPending,
      error: createMutation.error?.message || null,
    });
  };

  const showEditModal = (subdomain: Subdomain) => {
    NiceModal.show(EditSubdomainModal, {
      onSubmit: (data: UpdateSubdomainRequest) =>
        handleUpdateSubdomain(data, subdomain.subdomainName),
      onNavigateToDocs: handleNavigateToDocs,
      subdomain,
      isLoading: updateMutation.isPending,
      error: updateMutation.error?.message || null,
    });
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
              <span className="text-red-800 text-sm">{error.message}</span>
            </div>
          </div>
        )}

        {/* Subdomain limit warning */}
        {hasReachedLimit && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-amber-500 mr-2"
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
              <div className="flex-1">
                {isLegacyUser ? (
                  <div>
                    <span className="text-amber-800 text-sm font-medium block mb-1">
                      Legacy Account Notice
                    </span>
                    <span className="text-amber-700 text-sm">
                      You have {subdomains.length} subdomains from before our
                      limit change. You can keep all existing subdomains, but
                      new registrations are limited to {MAX_SUBDOMAINS_PER_USER}{" "}
                      total. Delete some subdomains to create new ones.
                    </span>
                  </div>
                ) : (
                  <span className="text-amber-800 text-sm">
                    You have reached the maximum limit of{" "}
                    {MAX_SUBDOMAINS_PER_USER} subdomains per account. Delete an
                    existing subdomain to create a new one.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create subdomain section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Your Subdomains
              </h2>
              <p className="text-sm text-gray-600">
                {isLegacyUser ? (
                  <>
                    Manage your is-an.ai subdomains ({subdomains.length} total,
                    limit: {MAX_SUBDOMAINS_PER_USER} for new accounts)
                  </>
                ) : (
                  <>
                    Manage your is-an.ai subdomains ({subdomains.length}/
                    {MAX_SUBDOMAINS_PER_USER})
                  </>
                )}
              </p>
            </div>
            <button
              onClick={showCreateModal}
              disabled={hasReachedLimit}
              className="mt-3 sm:mt-0 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title={
                hasReachedLimit
                  ? `Maximum ${MAX_SUBDOMAINS_PER_USER} subdomains allowed per account`
                  : undefined
              }
            >
              Create Subdomain
            </button>
          </div>

          {/* Subdomains list */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading subdomains...</p>
            </div>
          ) : subdomains.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No subdomains yet</p>
              <button
                onClick={showCreateModal}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                Create your first subdomain
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subdomains.map((subdomain: Subdomain) => (
                <div
                  key={subdomain.subdomainId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 font-mono">
                          {subdomain.subdomainName}
                          {DOMAIN_SUFFIX}
                        </h3>
                        <button
                          onClick={() =>
                            handleCopySubdomain(subdomain.subdomainName)
                          }
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
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
                      <p className="text-sm text-gray-600 mb-2">
                        {subdomain.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(subdomain.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => showEditModal(subdomain)}
                        className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingSubdomain(subdomain);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
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
      </main>

      {/* Modals */}
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Subdomain
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-mono font-medium">
                {deletingSubdomain?.subdomainName}
                {DOMAIN_SUFFIX}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingSubdomain(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubdomain}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Bug Report Button */}
      <BugReportButton />
    </div>
  );
};

export default DashboardPage;

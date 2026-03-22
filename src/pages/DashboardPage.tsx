import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import NiceModal from "@ebay/nice-modal-react";
import { useAuth } from "@/hooks/api/useAuth";
import {
  useMySubdomains,
  useCreateSubdomain,
  useUpdateSubdomain,
  useDeleteSubdomain,
} from "@/hooks/api/useSubdomains";
import {
  useMyHostings,
  useDeleteHosting,
} from "@/hooks/api/useHosting";
import {
  CreateSubdomainModal,
  DeployHostingModal,
  EditSubdomainModal,
  BugReportButton,
} from "@/components";
import Toast from "@/components/Toast";
import {
  DOMAIN_SUFFIX,
  MAX_SUBDOMAINS_PER_USER,
  REGISTRAR_AT_CAPACITY,
} from "@/lib/constants";
import {
  Subdomain,
  CreateSubdomainRequest,
  UpdateSubdomainRequest,
  HostingStatus,
} from "@/types/api";
import { getErrorMessage } from "@/lib/validation";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();

  // React Query hooks
  const { data: subdomains = [], isLoading, error } = useMySubdomains();
  const createMutation = useCreateSubdomain();
  const updateMutation = useUpdateSubdomain();
  const deleteMutation = useDeleteSubdomain();

  // Hosting hooks
  const { data: hostings = [], isLoading: hostingsLoading } = useMyHostings();
  const deleteHostingMutation = useDeleteHosting();

  // Local state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingSubdomain, setDeletingSubdomain] = useState<Subdomain | null>(
    null
  );
  const [showDeleteHostingConfirm, setShowDeleteHostingConfirm] = useState(false);
  const [deletingHosting, setDeletingHosting] = useState<HostingStatus | null>(null);
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
  const registrarAtCapacity = REGISTRAR_AT_CAPACITY === true;
  const isLegacyUser = subdomains.length > MAX_SUBDOMAINS_PER_USER;

  const handleCreateSubdomain = async (data: CreateSubdomainRequest) => {
    if (registrarAtCapacity) {
      showToast(t("dashboard.registrarUnavailable"), "error");
      return;
    }

    if (hasReachedLimit) {
      showToast(
        t("dashboard.maxSubdomains", { max: MAX_SUBDOMAINS_PER_USER }),
        "error"
      );
      return;
    }

    try {
      await createMutation.mutateAsync(data);
      showToast(t("dashboard.createdSuccess"));
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
      showToast(t("dashboard.updatedSuccess"));
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
      showToast(t("dashboard.deletedSuccess"));
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
      showToast(t("dashboard.copiedSuccess"));
    } catch {
      showToast(t("dashboard.copyFailed"), "error");
    }
  };

  const handleNavigateToDocs = (section?: string) => {
    const docsPath = section ? `/docs#${section}` : "/docs";
    navigate(docsPath);
  };

  const handleDeleteHosting = async () => {
    if (!deletingHosting) return;

    try {
      await deleteHostingMutation.mutateAsync(deletingHosting.subdomain);
      showToast("Hosted site deleted successfully");
      setShowDeleteHostingConfirm(false);
      setDeletingHosting(null);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, "error");
    }
  };

  const showDeployModal = () => {
    NiceModal.show(DeployHostingModal, {
      onSuccess: () => {
        showToast("Site deployed successfully");
      },
    });
  };

  const showRedeployModal = (hosting: HostingStatus) => {
    NiceModal.show(DeployHostingModal, {
      onSuccess: () => {
        showToast(`${hosting.subdomain}${DOMAIN_SUFFIX} re-deployed successfully`);
      },
    });
  };

  const showCreateModal = () => {
    if (hasReachedLimit) {
      showToast(
        t("dashboard.maxSubdomains", { max: MAX_SUBDOMAINS_PER_USER }),
        "error"
      );
      return;
    }

    if (registrarAtCapacity) {
      showToast(t("dashboard.registrarUnavailable"), "error");
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
          <p className="text-gray-600">{t("dashboard.loading")}</p>
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
                {t("dashboard.title")}
              </h1>
              <p className="text-sm text-gray-600">
                {t("dashboard.welcomeBack", { name: user?.name })}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 text-sm self-start sm:self-auto"
            >
              {t("dashboard.signOut")}
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
                      {t("dashboard.legacyNotice")}
                    </span>
                    <span className="text-amber-700 text-sm">
                      {t("dashboard.legacyDesc", {
                        count: subdomains.length,
                        max: MAX_SUBDOMAINS_PER_USER,
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-amber-800 text-sm">
                    {t("dashboard.limitReached", {
                      max: MAX_SUBDOMAINS_PER_USER,
                    })}
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
                {t("dashboard.yourSubdomains")}
              </h2>
              <p className="text-sm text-gray-600">
                {isLegacyUser
                  ? t("dashboard.manageSubdomainsLegacy", {
                      count: subdomains.length,
                      max: MAX_SUBDOMAINS_PER_USER,
                    })
                  : t("dashboard.manageSubdomains", {
                      count: subdomains.length,
                      max: MAX_SUBDOMAINS_PER_USER,
                    })}
              </p>
            </div>
            <button
              onClick={showCreateModal}
              disabled={hasReachedLimit || registrarAtCapacity}
              className="mt-3 sm:mt-0 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title={
                registrarAtCapacity
                  ? t("dashboard.registrarUnavailable")
                  : hasReachedLimit
                  ? t("dashboard.maxSubdomains", {
                      max: MAX_SUBDOMAINS_PER_USER,
                    })
                  : undefined
              }
            >
              {t("dashboard.createSubdomain")}
            </button>
          </div>

          {/* Subdomains list */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">
                {t("dashboard.loadingSubdomains")}
              </p>
            </div>
          ) : subdomains.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">{t("dashboard.noSubdomains")}</p>
              <button
                onClick={showCreateModal}
                disabled={registrarAtCapacity}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                title={
                  registrarAtCapacity
                    ? t("dashboard.registrarUnavailable")
                    : undefined
                }
              >
                {t("dashboard.createFirst")}
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
                          title={t("dashboard.copyToClipboard")}
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
                        {t("dashboard.created")}{" "}
                        {new Date(subdomain.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => showEditModal(subdomain)}
                        className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                      >
                        {t("dashboard.edit")}
                      </button>
                      <button
                        onClick={() => {
                          setDeletingSubdomain(subdomain);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {t("dashboard.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hosted Sites section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Hosted Sites
              </h2>
              <p className="text-sm text-gray-600">
                Deploy and manage static sites on your subdomains
              </p>
            </div>
            <button
              onClick={showDeployModal}
              className="mt-3 sm:mt-0 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
            >
              Deploy new site
            </button>
          </div>

          {hostingsLoading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading hosted sites...</p>
            </div>
          ) : hostings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven't deployed any sites yet.
              </p>
              <button
                onClick={showDeployModal}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                Deploy your first site
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {hostings.map((hosting: HostingStatus) => (
                <div
                  key={hosting.subdomain}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 font-mono">
                          {hosting.subdomain}{DOMAIN_SUFFIX}
                        </h3>
                      </div>
                      <a
                        href={hosting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-mono break-all"
                      >
                        {hosting.url}
                      </a>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{hosting.fileCount} files</span>
                        <span>
                          {hosting.totalSize < 1024 * 1024
                            ? `${(hosting.totalSize / 1024).toFixed(1)} KB`
                            : `${(hosting.totalSize / (1024 * 1024)).toFixed(1)} MB`}
                        </span>
                        <span>
                          Deployed{" "}
                          {new Date(hosting.lastDeployedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => showRedeployModal(hosting)}
                        className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                      >
                        Re-deploy
                      </button>
                      <button
                        onClick={() => {
                          setDeletingHosting(hosting);
                          setShowDeleteHostingConfirm(true);
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
              {t("dashboard.deleteTitle")}
            </h3>
            <p className="text-gray-600 mb-4">
              <Trans
                i18nKey="dashboard.deleteConfirm"
                values={{
                  name: deletingSubdomain?.subdomainName,
                  domain: DOMAIN_SUFFIX,
                }}
                components={{
                  mono: <span className="font-mono font-medium" />,
                }}
              />
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
                {t("dashboard.cancel")}
              </button>
              <button
                onClick={handleDeleteSubdomain}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? t("dashboard.deleting")
                  : t("dashboard.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete hosting confirmation modal */}
      {showDeleteHostingConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Hosted Site
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-mono font-medium">
                {deletingHosting?.subdomain}{DOMAIN_SUFFIX}
              </span>
              ? This will remove all hosted files and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteHostingConfirm(false);
                  setDeletingHosting(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={deleteHostingMutation.isPending}
              >
                {t("dashboard.cancel")}
              </button>
              <button
                onClick={handleDeleteHosting}
                disabled={deleteHostingMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteHostingMutation.isPending ? "Deleting..." : "Delete"}
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

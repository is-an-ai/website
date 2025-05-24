import { useState, useCallback } from "react";
import { CreateSubdomainRequest, DNSRecord } from "@/types/api";

interface CreateSubdomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubdomainRequest) => Promise<void>;
  onCheckAvailability: (name: string) => Promise<boolean>;
  isLoading: boolean;
  isCheckingAvailability: boolean;
  availabilityResult: boolean | null;
  error: string | null;
}

const DNS_RECORD_TYPES = [
  { value: "A", label: "A Record", description: "IPv4 address" },
  { value: "AAAA", label: "AAAA Record", description: "IPv6 address" },
  { value: "CNAME", label: "CNAME Record", description: "Canonical name" },
  { value: "TXT", label: "TXT Record", description: "Text record" },
] as const;

const CreateSubdomainModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCheckAvailability,
  isLoading,
  isCheckingAvailability,
  availabilityResult,
  error,
}: CreateSubdomainModalProps) => {
  const [formData, setFormData] = useState({
    subdomainName: "",
    description: "",
    recordType: "A" as DNSRecord["type"],
    recordValue: "",
  });

  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [lastCheckedName, setLastCheckedName] = useState("");

  const handleSubdomainNameChange = useCallback((value: string) => {
    // Reset availability check when name changes
    setHasCheckedAvailability(false);
    setLastCheckedName("");
    setFormData((prev) => ({ ...prev, subdomainName: value }));
  }, []);

  const handleCheckAvailability = useCallback(async () => {
    if (!formData.subdomainName.trim()) return;

    await onCheckAvailability(formData.subdomainName.trim());
    setHasCheckedAvailability(true);
    setLastCheckedName(formData.subdomainName.trim());
  }, [formData.subdomainName, onCheckAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !hasCheckedAvailability ||
      lastCheckedName !== formData.subdomainName.trim()
    ) {
      return; // Force availability check first
    }

    if (!availabilityResult) {
      return; // Can't submit if not available
    }

    const record: DNSRecord = {
      type: formData.recordType,
      value: formData.recordValue.trim(),
    };

    const requestData: CreateSubdomainRequest = {
      subdomainName: formData.subdomainName.trim(),
      description: formData.description.trim(),
      record,
    };

    try {
      await onSubmit(requestData);
      // Reset form on success
      setFormData({
        subdomainName: "",
        description: "",
        recordType: "A",
        recordValue: "",
      });
      setHasCheckedAvailability(false);
      setLastCheckedName("");
      onClose();
    } catch (err) {
      // Error is handled by parent component
    }
  };

  const isFormValid =
    formData.subdomainName.trim() &&
    formData.description.trim() &&
    formData.recordValue.trim() &&
    hasCheckedAvailability &&
    lastCheckedName === formData.subdomainName.trim() &&
    availabilityResult === true;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Create Subdomain</h3>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subdomain Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subdomain Name
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.subdomainName}
                    onChange={(e) => handleSubdomainNameChange(e.target.value)}
                    placeholder="my-awesome-project"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    .is-an.ai
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={
                  !formData.subdomainName.trim() ||
                  isCheckingAvailability ||
                  isLoading
                }
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap text-sm font-medium"
              >
                {isCheckingAvailability ? "Checking..." : "Check"}
              </button>
            </div>

            {/* Availability Result */}
            {hasCheckedAvailability &&
              lastCheckedName === formData.subdomainName.trim() && (
                <div className="mt-2">
                  {availabilityResult === true ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Available!
                    </div>
                  ) : availabilityResult === false ? (
                    <div className="flex items-center text-red-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Not available
                    </div>
                  ) : null}
                </div>
              )}

            {formData.subdomainName.trim() && !hasCheckedAvailability && (
              <p className="mt-2 text-amber-600 text-sm">
                Please check availability before proceeding
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your project (e.g., My awesome AI project)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              disabled={isLoading}
            />
          </div>

          {/* DNS Record Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              DNS Record Type
            </label>
            <select
              value={formData.recordType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recordType: e.target.value as DNSRecord["type"],
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {DNS_RECORD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* DNS Record Value */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              DNS Record Value
            </label>
            <input
              type="text"
              value={formData.recordValue}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recordValue: e.target.value,
                }))
              }
              placeholder={
                formData.recordType === "A"
                  ? "192.168.1.1"
                  : formData.recordType === "AAAA"
                  ? "2001:db8::1"
                  : formData.recordType === "CNAME"
                  ? "example.com"
                  : "Your text value"
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Subdomain"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubdomainModal;

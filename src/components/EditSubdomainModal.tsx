import { useState, useEffect } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { UpdateSubdomainRequest, DNSRecord, Subdomain } from "@/types/api";
import { DOMAIN_SUFFIX } from "@/lib/constants";
import { validateDNSRecords } from "@/lib/validation";
import { detectPlatform, hasCnameRecord } from "@/lib/platformDetection";
import PlatformGuidanceModal from "./PlatformGuidanceModal";

interface EditSubdomainModalProps {
  onSubmit: (data: UpdateSubdomainRequest) => Promise<void>;
  onNavigateToDocs?: (section?: string) => void;
  subdomain: Subdomain;
  isLoading: boolean;
  error: string | null;
}

const DNS_RECORD_TYPES = [
  {
    value: "A",
    label: "A Record",
    description: "IPv4 address",
    placeholder: "192.168.1.1",
  },
  {
    value: "AAAA",
    label: "AAAA Record",
    description: "IPv6 address",
    placeholder: "2001:db8::1",
  },
  {
    value: "CNAME",
    label: "CNAME Record",
    description: "Canonical name",
    placeholder: "example.com",
  },
  {
    value: "TXT",
    label: "TXT Record",
    description: "Text record",
    placeholder: "v=spf1 include:_spf.google.com ~all",
  },
] as const;

const EditSubdomainModal = NiceModal.create<EditSubdomainModalProps>(
  ({ onSubmit, onNavigateToDocs, subdomain, isLoading, error }) => {
    const modal = useModal();

    const [formData, setFormData] = useState({
      description: "",
    });

    const [records, setRecords] = useState<DNSRecord[]>([
      { type: "A", value: "" },
    ]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Initialize form data when subdomain changes
    useEffect(() => {
      if (subdomain) {
        setFormData({
          description: subdomain.description,
        });
        setRecords(
          subdomain.record.length > 0
            ? [...subdomain.record]
            : [{ type: "A", value: "" }]
        );
      }
    }, [subdomain]);

    const addRecord = () => {
      setRecords([...records, { type: "A", value: "" }]);
    };

    const removeRecord = (index: number) => {
      if (records.length > 1) {
        setRecords(records.filter((_, i) => i !== index));
      }
    };

    const updateRecord = (
      index: number,
      field: keyof DNSRecord,
      value: string
    ) => {
      const updatedRecords = [...records];
      if (field === "type") {
        updatedRecords[index] = {
          ...updatedRecords[index],
          type: value as DNSRecord["type"],
        };
      } else {
        updatedRecords[index] = { ...updatedRecords[index], value };
      }
      setRecords(updatedRecords);

      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Filter out empty records and trim values
      const validRecords = records
        .filter((record) => {
          if (typeof record.value === "string") {
            return record.value.trim() !== "";
          }
          return Array.isArray(record.value) ? record.value.length > 0 : true;
        })
        .map((record) => ({
          ...record,
          value:
            typeof record.value === "string"
              ? record.value.trim()
              : record.value,
        }));

      if (validRecords.length === 0) {
        return; // Need at least one valid record
      }

      // Client-side validation
      const validation = validateDNSRecords(validRecords);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      const requestData: UpdateSubdomainRequest = {
        description: formData.description.trim(),
        record: validRecords,
      };

      try {
        await onSubmit(requestData);

        // Check for platform guidance after successful update
        if (hasCnameRecord(validRecords)) {
          const cnameRecord = validRecords.find(
            (record) => record.type === "CNAME"
          );
          if (cnameRecord && typeof cnameRecord.value === "string") {
            const guidance = detectPlatform(cnameRecord.value);
            if (guidance) {
              // Show platform guidance modal
              NiceModal.show(PlatformGuidanceModal, {
                guidance,
                subdomainName: subdomain.subdomainName,
                onViewDocs: onNavigateToDocs
                  ? () => onNavigateToDocs(guidance.docsSection)
                  : undefined,
              });
            }
          }
        }

        // Close modal on success
        setValidationErrors([]);
        modal.remove();
      } catch (err) {
        console.error(err);
      }
    };

    const isFormValid = records.some((record) =>
      typeof record.value === "string"
        ? record.value.trim() !== ""
        : Array.isArray(record.value)
        ? record.value.length > 0
        : true
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Edit Subdomain</h3>
            <button
              onClick={modal.remove}
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
            {/* Subdomain Name (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subdomain Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={subdomain.subdomainName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {DOMAIN_SUFFIX}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Subdomain name cannot be changed after creation
              </p>
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
                placeholder="Brief description of your project (optional)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                disabled={isLoading}
              />
            </div>

            {/* DNS Records */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">
                  DNS Records
                </label>
                <button
                  type="button"
                  onClick={addRecord}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  disabled={isLoading}
                >
                  + Add Record
                </button>
              </div>

              <div className="space-y-3">
                {records.map((record, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <select
                      value={record.type}
                      onChange={(e) =>
                        updateRecord(index, "type", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isLoading}
                    >
                      {DNS_RECORD_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={
                        typeof record.value === "string" ? record.value : ""
                      }
                      onChange={(e) =>
                        updateRecord(index, "value", e.target.value)
                      }
                      placeholder={
                        DNS_RECORD_TYPES.find(
                          (type) => type.value === record.type
                        )?.placeholder || "Enter value"
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isLoading}
                    />
                    {records.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecord(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                        disabled={isLoading}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start">
                  <svg
                    className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-amber-800 text-sm font-medium mb-1">
                      Please fix the following DNS record errors:
                    </h4>
                    <ul className="text-amber-700 text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="list-disc list-inside">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-red-500 mr-2"
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

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={modal.remove}
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
                    Updating...
                  </div>
                ) : (
                  "Update Subdomain"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default EditSubdomainModal;

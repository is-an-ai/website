import { useState, useEffect } from "react";
import { UpdateSubdomainRequest, DNSRecord, Subdomain } from "@/types/api";
import { DOMAIN_SUFFIX } from "@/lib/constants";

interface EditSubdomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSubdomainRequest) => Promise<void>;
  subdomain: Subdomain | null;
  isLoading: boolean;
  error: string | null;
}

const DNS_RECORD_TYPES = [
  { value: "A", label: "A Record", description: "IPv4 address" },
  { value: "AAAA", label: "AAAA Record", description: "IPv6 address" },
  { value: "CNAME", label: "CNAME Record", description: "Canonical name" },
  { value: "TXT", label: "TXT Record", description: "Text record" },
] as const;

const EditSubdomainModal = ({
  isOpen,
  onClose,
  onSubmit,
  subdomain,
  isLoading,
  error,
}: EditSubdomainModalProps) => {
  const [formData, setFormData] = useState({
    description: "",
  });

  const [records, setRecords] = useState<DNSRecord[]>([
    { type: "A", value: "" },
  ]);

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
          typeof record.value === "string" ? record.value.trim() : record.value,
      }));

    if (validRecords.length === 0) {
      return; // Need at least one valid record
    }

    const requestData: UpdateSubdomainRequest = {
      description: formData.description.trim(),
      record: validRecords,
    };

    try {
      await onSubmit(requestData);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const isFormValid =
    formData.description.trim() &&
    records.some((record) =>
      typeof record.value === "string"
        ? record.value.trim() !== ""
        : Array.isArray(record.value)
        ? record.value.length > 0
        : true
    );

  if (!isOpen || !subdomain) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Edit Subdomain</h3>
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
              Subdomain name cannot be changed
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
              placeholder="Describe your project (e.g., My awesome AI project)"
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
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center"
                disabled={isLoading}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Record
              </button>
            </div>

            <div className="space-y-3">
              {records.map((record, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Record {index + 1}
                    </span>
                    {records.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecord(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        value={record.type}
                        onChange={(e) =>
                          updateRecord(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        disabled={isLoading}
                      >
                        {DNS_RECORD_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={
                          typeof record.value === "string" ? record.value : ""
                        }
                        onChange={(e) =>
                          updateRecord(index, "value", e.target.value)
                        }
                        placeholder={
                          record.type === "A"
                            ? "192.168.1.1"
                            : record.type === "AAAA"
                            ? "2001:db8::1"
                            : record.type === "CNAME"
                            ? "example.com"
                            : "Your text value"
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
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
};

export default EditSubdomainModal;

import { useState, useRef } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useSubdomainAvailability } from "@/hooks/api/useSubdomains";
import { useDeployHosting } from "@/hooks/api/useHosting";
import { DOMAIN_SUFFIX } from "@/lib/constants";
import { HostingResponse } from "@/types/api";

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_COUNT = 1000;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function stripRootFolder(files: File[]): { name: string; file: File }[] {
  return files.map((file) => {
    const relativePath = file.webkitRelativePath;
    const stripped = relativePath
      ? relativePath.split("/").slice(1).join("/")
      : file.name;
    return { name: stripped, file };
  });
}

interface DeployHostingModalProps {
  onSuccess?: () => void;
}

const DeployHostingModal = NiceModal.create<DeployHostingModalProps>(
  ({ onSuccess }) => {
    const modal = useModal();
    const deployMutation = useDeployHosting();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [subdomainName, setSubdomainName] = useState("");
    const [checkingName, setCheckingName] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [deployResult, setDeployResult] = useState<HostingResponse | null>(
      null
    );

    const {
      data: availabilityResult,
      isLoading: isCheckingAvailability,
    } = useSubdomainAvailability(checkingName);

    const strippedFiles = stripRootFolder(files);
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const hasIndexHtml = strippedFiles.some((f) => f.name === "index.html");

    const handleCheckAvailability = () => {
      const trimmed = subdomainName.trim();
      if (!trimmed) return;
      setCheckingName(trimmed);
    };

    const handleFilesSelected = (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;
      setFiles(Array.from(selectedFiles));
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const items = e.dataTransfer.items;
      if (!items) return;

      const allFiles: File[] = [];

      const readEntries = (
        reader: FileSystemDirectoryReader
      ): Promise<FileSystemEntry[]> => {
        return new Promise((resolve, reject) => {
          reader.readEntries(resolve, reject);
        });
      };

      const traverseEntry = async (
        entry: FileSystemEntry,
        path: string
      ): Promise<void> => {
        if (entry.isFile) {
          const fileEntry = entry as FileSystemFileEntry;
          const file = await new Promise<File>((resolve, reject) => {
            fileEntry.file(resolve, reject);
          });
          // Create a new file with the full path as webkitRelativePath
          const fileWithPath = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });
          Object.defineProperty(fileWithPath, "webkitRelativePath", {
            value: path + file.name,
            writable: false,
          });
          allFiles.push(fileWithPath);
        } else if (entry.isDirectory) {
          const dirEntry = entry as FileSystemDirectoryEntry;
          const reader = dirEntry.createReader();
          let entries: FileSystemEntry[] = [];
          // readEntries may return results in batches
          let batch: FileSystemEntry[];
          do {
            batch = await readEntries(reader);
            entries = entries.concat(batch);
          } while (batch.length > 0);

          for (const child of entries) {
            await traverseEntry(child, path + entry.name + "/");
          }
        }
      };

      const entries: FileSystemEntry[] = [];
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry) entries.push(entry);
      }

      for (const entry of entries) {
        await traverseEntry(entry, "");
      }

      if (allFiles.length > 0) {
        setFiles(allFiles);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (deployMutation.isPending) return;

      try {
        const result = await deployMutation.mutateAsync({
          name: subdomainName.trim(),
          files,
        });
        setDeployResult(result);
        onSuccess?.();
      } catch {
        // Error handled by mutation state
      }
    };

    const hasCheckedAvailability = checkingName === subdomainName.trim();
    const isAvailable = hasCheckedAvailability && availabilityResult?.available === true;
    const isBusy = deployMutation.isPending;

    // Validation
    const validationErrors: string[] = [];
    if (files.length > 0) {
      if (!hasIndexHtml) validationErrors.push("Must include an index.html file");
      if (totalSize > MAX_TOTAL_SIZE)
        validationErrors.push(`Total size exceeds 50MB (${formatFileSize(totalSize)})`);
      if (files.length > MAX_FILE_COUNT)
        validationErrors.push(`Too many files (${files.length}/${MAX_FILE_COUNT})`);
    }

    const isFormValid =
      subdomainName.trim() &&
      isAvailable &&
      files.length > 0 &&
      validationErrors.length === 0;

    // Success state
    if (deployResult) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Deployed Successfully
              </h3>
              <p className="text-gray-600 mb-4">
                Your site is now live at:
              </p>
              <a
                href={deployResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:text-cyan-700 font-mono font-medium text-lg break-all"
              >
                {deployResult.url}
              </a>
              <p className="text-sm text-gray-500 mt-3">
                {deployResult.fileCount} files ({formatFileSize(deployResult.totalSize)})
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={modal.remove}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <a
                href={deployResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium text-center"
              >
                Visit Site
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Deploy Static Site
            </h3>
            <button
              onClick={modal.remove}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isBusy}
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
                Subdomain
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={subdomainName}
                      onChange={(e) => setSubdomainName(e.target.value)}
                      placeholder="my-site"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isBusy}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {DOMAIN_SUFFIX}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={
                    !subdomainName.trim() || isCheckingAvailability || isBusy
                  }
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {isCheckingAvailability ? "Checking..." : "Check"}
                </button>
              </div>

              {/* Availability Status */}
              {hasCheckedAvailability && (
                <div className="mt-2">
                  {availabilityResult?.available === true && (
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
                      Available
                    </div>
                  )}
                  {availabilityResult?.available === false && (
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
                      {availabilityResult.error || "Not available"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Files
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {files.length === 0 ? (
                  <>
                    <svg
                      className="w-10 h-10 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-gray-600 mb-2">
                      Drag & drop a folder here
                    </p>
                    <p className="text-gray-400 text-sm mb-3">or</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      disabled={isBusy}
                    >
                      Select folder
                    </button>
                  </>
                ) : (
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-900">
                        {files.length} files ({formatFileSize(totalSize)})
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFiles([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        disabled={isBusy}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {strippedFiles.slice(0, 50).map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span className="text-gray-700 font-mono text-xs truncate flex-1 mr-2">
                            {f.name}
                          </span>
                          <span className="text-gray-400 text-xs whitespace-nowrap">
                            {formatFileSize(f.file.size)}
                          </span>
                        </div>
                      ))}
                      {files.length > 50 && (
                        <p className="text-gray-400 text-xs pt-1">
                          ...and {files.length - 50} more files
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  // @ts-expect-error webkitdirectory is a non-standard attribute
                  webkitdirectory=""
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />
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
                  <ul className="text-amber-700 text-sm space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i} className="list-disc list-inside">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* API Error */}
            {deployMutation.error && (
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
                  <span className="text-red-800 text-sm">
                    {deployMutation.error.message}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={modal.remove}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isBusy}
                className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isBusy ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deploying...
                  </div>
                ) : (
                  "Deploy"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default DeployHostingModal;

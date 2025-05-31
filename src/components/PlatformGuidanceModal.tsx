import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { PlatformGuidance } from "@/lib/platformDetection";

interface PlatformGuidanceModalProps {
  guidance: PlatformGuidance;
  subdomainName: string;
  onViewDocs?: () => void;
}

const PlatformGuidanceModal = NiceModal.create<PlatformGuidanceModalProps>(
  ({ guidance, subdomainName, onViewDocs }) => {
    const modal = useModal();

    const handleViewDocs = () => {
      onViewDocs?.();
      modal.remove();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 ${guidance.iconBg} rounded flex items-center justify-center mr-3`}
              >
                <span className="text-white text-xs font-bold">
                  {guidance.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {guidance.platform} Setup Guide
              </h3>
            </div>
            <button
              onClick={() => modal.remove()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-amber-800 font-medium mb-1">
                    Additional setup required
                  </h4>
                  <p className="text-amber-700 text-sm">{guidance.message}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Next steps:</h4>
              <ol className="space-y-2">
                {guidance.steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-700"
                  >
                    <span className="bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
                <li className="flex items-start text-sm text-gray-700">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  <span className="font-medium">
                    Enter {subdomainName}.is-an.ai
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 DNS propagation takes 5-10 minutes. Please wait a moment
                after setting up the domain in {guidance.platform}.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => modal.remove()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Got it
              </button>
              {onViewDocs && (
                <button
                  onClick={handleViewDocs}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View detailed guide
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PlatformGuidanceModal;

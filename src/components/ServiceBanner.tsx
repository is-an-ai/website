import React from "react";
import { CheckCircle, X, AlertTriangle } from "lucide-react";
import { REGISTRAR_AT_CAPACITY } from "@/lib/constants";

interface ServiceBannerProps {
  onClose?: () => void;
  isVisible?: boolean;
}

const ServiceBanner: React.FC<ServiceBannerProps> = ({
  onClose,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  const atCapacity = REGISTRAR_AT_CAPACITY === true;

  return (
    <div
      className={
        atCapacity
          ? "bg-amber-50 border-b border-amber-200 px-4 py-3"
          : "bg-blue-50 border-b border-blue-200 px-4 py-3"
      }
    >
      <div className="max-w-6xl mx-auto flex items-start sm:items-center justify-between">
        <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
          {atCapacity ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          )}
          <div className="text-sm text-gray-700 min-w-0 flex-1">
            {atCapacity ?? (
              <>
                <span className="font-medium">Registrar capacity reached.</span>
                <span className="ml-1 block sm:inline">
                  New subdomain registrations are temporarily paused. We’re
                  building our own nameservers and will be back soon.
                </span>
              </>
            )}
          </div>
        </div>
        {!atCapacity && onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors ml-4 flex-shrink-0"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceBanner;

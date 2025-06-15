import { PSL_WARNINGS } from "@/lib/pslWarnings";

interface PSLWarningProps {
  message: string;
  title?: string;
}

const PSLWarning = ({
  message,
  title = PSL_WARNINGS.VERCEL_TITLE,
}: PSLWarningProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-start">
        <svg
          className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-red-800 text-sm font-medium mb-1">{title}</h4>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default PSLWarning;

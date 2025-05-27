import { useState } from "react";
import { GITHUB_REPOSITORY_URL } from "@/lib/constants";

interface BugReportButtonProps {
  repositoryUrl?: string;
}

const BugReportButton = ({
  repositoryUrl = `${GITHUB_REPOSITORY_URL}/website`,
}: BugReportButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBugReport = () => {
    const issueUrl = `${repositoryUrl}/issues/new?template=bug_report.md&title=[Bug]%20&labels=bug`;
    window.open(issueUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleBugReport}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 bg-gray-600 hover:bg-cyan-600 text-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 group"
      title="Report a bug"
      aria-label="Report a bug"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>

        {/* Expandable text on hover */}
        <span
          className={`overflow-hidden transition-all duration-200 whitespace-nowrap text-xs font-medium ${
            isHovered ? "max-w-20 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Bug Report
        </span>
      </div>

      {/* Subtle pulse animation on hover only */}
      <div
        className={`absolute inset-0 rounded-full bg-cyan-500 transition-opacity duration-200 ${
          isHovered ? "animate-ping opacity-10" : "opacity-0"
        }`}
      ></div>
    </button>
  );
};

export default BugReportButton;

import React from "react";

interface ExampleCardProps {
  subdomain: string;
  description: string;
  status?: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  subdomain,
  description,
  status = "ACTIVE",
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-blue-600 text-sm">{subdomain}</span>
        <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ExampleCard;

interface ExampleCardProps {
  subdomain: string;
  description: string;
  status?: string;
}

const ExampleCard = ({
  subdomain,
  description,
  status = "ACTIVE",
}: ExampleCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-purple-600 text-sm">{subdomain}</span>
        <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ExampleCard;

interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

const StepCard = ({ step, title, description }: StepCardProps) => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4 font-mono font-bold text-cyan-600">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-mono">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default StepCard;

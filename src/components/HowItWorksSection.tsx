import { useState } from "react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      step: 1,
      title: "Choose subdomain",
      description: "Pick any available name for your AI project",
      icon: "🎯",
      details: "Type your desired subdomain and check availability instantly",
      color: "from-indigo-500 to-purple-600",
    },
    {
      step: 2,
      title: "Point to your site",
      description: "Enter your domain, IP, or hosting platform",
      icon: "🔗",
      details: "Works with Vercel, Netlify, GitHub Pages, and more",
      color: "from-purple-500 to-pink-600",
    },
    {
      step: 3,
      title: "You're live",
      description: "DNS propagates within minutes, SSL included",
      icon: "🚀",
      details: "Automatic HTTPS, global CDN, and instant activation",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 overflow-hidden">
      {/* Geometric background patterns */}
      <div className="absolute inset-0">
        {/* Hexagon pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-hexagon-pattern"></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-300 transform rotate-45 opacity-15 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full opacity-25 animate-float animation-delay-4000"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-indigo-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-pink-400 rounded-full opacity-70 animate-pulse animation-delay-3000"></div>

        {/* Wavy lines */}
        <div className="absolute top-10 left-1/3 w-40 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-40 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full mb-6 shadow-sm">
            <span className="text-2xl mr-2">⚡</span>
            <span className="text-sm font-mono font-semibold text-purple-700">
              Lightning fast setup
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-mono">
            How it works
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Three simple steps to get your AI project online with a professional
            subdomain
          </p>
        </motion.div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              onHoverStart={() => setActiveStep(step.step)}
              onHoverEnd={() => setActiveStep(null)}
            >
              <div
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                  activeStep === step.step
                    ? "border-purple-300 shadow-2xl shadow-purple-200/50 scale-105 bg-white/80"
                    : "border-purple-200/50 hover:border-purple-300/70 shadow-lg hover:shadow-xl bg-white/60 hover:bg-white/70"
                }`}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                    step.color
                  } opacity-0 transition-opacity duration-300 ${
                    activeStep === step.step ? "opacity-5" : ""
                  }`}
                ></div>

                <div className="relative z-10">
                  {/* Step number and icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg font-mono shadow-lg`}
                    >
                      {step.step}
                    </div>
                    <div className="text-3xl ml-4">{step.icon}</div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-mono text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {step.description}
                  </p>

                  {/* Expandable details */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeStep === step.step ? "auto" : 0,
                      opacity: activeStep === step.step ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-purple-200">
                      <p className="text-sm text-gray-500 text-center font-mono">
                        {step.details}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-y-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

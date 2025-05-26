import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SubdomainChecker from "./SubdomainChecker";
import TypingAnimation from "./TypingAnimation";
import { useAuth } from "@/hooks/api/useAuth";
import { DOMAIN_SUFFIX } from "@/lib/constants";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-cyan-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-40 animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/5 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-pulse animation-delay-3000"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-4 py-2 text-sm font-mono bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-700 rounded-full mb-6 border border-cyan-200 shadow-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="mr-2">🤖</span>
              Free {DOMAIN_SUFFIX} subdomains for AI projects
            </motion.span>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 font-mono leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span className="relative inline-block">
                <span className="text-cyan-600 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl px-3 py-2 border border-cyan-200 shadow-lg">
                  <TypingAnimation
                    words={[
                      "jarvis",
                      "friday",
                      "cortana",
                      "hal-9000",
                      "skynet",
                      "ava",
                      "samantha",
                      "wall-e",
                      "data",
                      "glados",
                      "karen",
                      "viki",
                    ]}
                  />
                </span>
              </motion.span>
              <span className="text-gray-800">.is-an.ai</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4"
            >
              <p className="text-lg sm:text-xl text-gray-700 mb-4 max-w-3xl mx-auto px-4 sm:px-0 font-medium">
                Free subdomains for AI projects. No DNS config, no waiting.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Instant setup
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Free SSL
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Global CDN
                </div>
              </div>
              <p className="text-sm text-gray-500 font-mono mt-4">
                Just like is-a.dev, but for AI stuff.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8"
          >
            <SubdomainChecker />
          </motion.div>

          {isAuthenticated && (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-mono shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">🚀</span>
                  Go to Dashboard
                </Link>
              </motion.div>
              <motion.div
                className="flex items-center text-sm text-gray-600 font-mono bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200"
                whileHover={{ scale: 1.02 }}
              >
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                Manage your subdomains
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

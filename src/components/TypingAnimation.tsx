import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingAnimationProps {
  words: string[];
  className?: string;
}

const TypingAnimation = ({ words, className = "" }: TypingAnimationProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "deleting">(
    "typing"
  );
  const [showCursor, setShowCursor] = useState(true);
  const [waitStartTime, setWaitStartTime] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log(phase, currentText);

        const currentWord = words[currentWordIndex];

        if (phase === "typing") {
          if (currentText.length < currentWord.length) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            setPhase("waiting");
            setWaitStartTime(Date.now());
          }
        } else if (phase === "waiting") {
          if (waitStartTime && Date.now() - waitStartTime >= 1500) {
            setPhase("deleting");
            setWaitStartTime(null);
          }
        } else if (phase === "deleting") {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
            setPhase("typing");
          }
        }
      },
      phase === "deleting" ? 120 : 200
    );

    return () => clearInterval(interval);
  }, [currentText, phase, currentWordIndex, words, waitStartTime]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="text-cyan-600"
      >
        |
      </motion.span>
    </span>
  );
};

export default TypingAnimation;

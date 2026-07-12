"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface CourseQuizProps {
  courseId: 1 | 2 | 3 | 4;
}

export default function CourseQuiz({ courseId }: CourseQuizProps) {
  const t = useTranslations("quizzes");
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Hardcoded answers map
  const answersMap = {
    1: [1, 2], // course 1: Q1 -> 1, Q2 -> 2
    2: [0, 1], // course 2: Q1 -> 0, Q2 -> 1
    3: [1, 2], // course 3: Q1 -> 1, Q2 -> 2
    4: [0, 2], // course 4: Q1 -> 0, Q2 -> 2
  };
  const totalQuestions = 2;

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(optionIndex);
    const correctIndex = answersMap[courseId][currentQuestionIndex];
    setIsCorrect(optionIndex === correctIndex);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Quiz finished
      setCurrentQuestionIndex(totalQuestions);
    }
  };

  const isFinished = currentQuestionIndex >= totalQuestions;

  return (
    <div className="mt-8 border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Accordion Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 transition-colors"
      >
        <span className="font-black text-blue-900 tracking-wide">
          {t("ui.testKnowledge")}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              {isFinished ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {t("ui.finishQuiz")}
                  </h3>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setIsCorrect(null);
                    }}
                    className="mt-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest"
                  >
                    Restart
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress Indicators */}
                  <div className="flex gap-2 mb-4">
                    {[...Array(totalQuestions)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i === currentQuestionIndex
                            ? "bg-[#1cb0f6]"
                            : i < currentQuestionIndex
                            ? "bg-[#58cc02]"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {t(`course${courseId}.q${currentQuestionIndex}` as any)}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => {
                      const optionText = t(
                        `course${courseId}.q${currentQuestionIndex}_o${i}` as any
                      );
                      const isSelected = selectedOption === i;
                      const correctIndex = answersMap[courseId][currentQuestionIndex];
                      const isOptionCorrect = i === correctIndex;

                      let btnStyle =
                        "bg-white border-b-[4px] border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300";
                      
                      if (selectedOption !== null) {
                        if (isOptionCorrect) {
                          btnStyle = "bg-[#d7ffb8] border-b-[4px] border-[#58cc02] text-[#46a302]";
                        } else if (isSelected && !isOptionCorrect) {
                          btnStyle = "bg-[#ffdfe0] border-b-[4px] border-[#ff4b4b] text-[#ea2b2b]";
                        } else {
                          btnStyle = "bg-white border-b-[4px] border-gray-200 text-gray-400 opacity-50 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(i)}
                          className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${btnStyle} ${
                            selectedOption === null ? "active:border-b-0 active:translate-y-[4px]" : ""
                          }`}
                        >
                          {optionText}
                        </button>
                      );
                    })}
                  </div>

                  {/* Result & Next Button */}
                  <AnimatePresence>
                    {selectedOption !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4 flex items-center justify-between"
                      >
                        <span
                          className={`font-black ${
                            isCorrect ? "text-[#58cc02]" : "text-[#ea2b2b]"
                          }`}
                        >
                          {isCorrect ? t("ui.correct") : t("ui.incorrect")}
                        </span>
                        
                        <button
                          onClick={handleNext}
                          className="bg-[#1cb0f6] border-b-[4px] border-[#1899d6] hover:brightness-110 active:border-b-0 active:translate-y-[4px] text-white font-black px-6 py-3 rounded-xl transition-all uppercase tracking-widest text-sm"
                        >
                          {t("ui.nextQuestion")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

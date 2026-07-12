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

  const answersMap = {
    1: [1, 2],
    2: [0, 1],
    3: [1, 2],
    4: [0, 2],
  };
  const totalQuestions = 2;

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setIsCorrect(optionIndex === answersMap[courseId][currentQuestionIndex]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((p) => p + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setCurrentQuestionIndex(totalQuestions);
    }
  };

  const isFinished = currentQuestionIndex >= totalQuestions;



  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-[#1cb0f6]/20 bg-gradient-to-br from-blue-50/60 to-white shadow-sm">
      {/* Accordion Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-blue-50/60 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-[#1cb0f6]/15 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-[#1cb0f6]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-left flex-1">
          <p className="font-black text-[#1a3a5c] text-sm tracking-wide">
            {t("ui.testKnowledge")}
          </p>
          <p className="text-[11px] text-gray-400 font-medium">
            {totalQuestions} questions
          </p>
        </div>
        <span className="text-[10px] font-bold bg-[#1cb0f6]/10 text-[#1cb0f6] px-2.5 py-1 rounded-full mr-1">
          Quiz
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-gray-400"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-blue-100">
              <div className="pt-5">
                {isFinished ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4 drop-shadow-sm">🏆</div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      {t("ui.finishQuiz")}
                    </h3>
                    <p className="text-sm text-gray-500 mb-5">
                      Great job completing the quiz!
                    </p>
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setSelectedOption(null);
                        setIsCorrect(null);
                      }}
                      className="text-xs font-black text-[#1cb0f6] hover:text-[#0a86c6] uppercase tracking-widest transition-colors"
                    >
                      ↺ Restart Quiz
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Progress bar */}
                    <div className="flex gap-1.5">
                      {[...Array(totalQuestions)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            i < currentQuestionIndex
                              ? "bg-[#58cc02]"
                              : i === currentQuestionIndex
                                ? "bg-[#1cb0f6]"
                                : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Question */}
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {t(`course${courseId}.q${currentQuestionIndex}` as any)}
                    </h3>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {[0, 1, 2].map((i) => {
                        const optionText = t(
                          `course${courseId}.q${currentQuestionIndex}_o${i}` as any,
                        );
                        const isSelected = selectedOption === i;
                        const correctIndex =
                          answersMap[courseId][currentQuestionIndex];
                        const isOptionCorrect = i === correctIndex;

                        let cls =
                          "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1cb0f6]/40 hover:bg-blue-50/40";
                        if (selectedOption !== null) {
                          if (isOptionCorrect)
                            cls =
                              "bg-[#d7ffb8] border-2 border-[#58cc02] text-[#2d6a14]";
                          else if (isSelected)
                            cls =
                              "bg-[#ffdfe0] border-2 border-[#ff4b4b] text-[#c0392b]";
                          else
                            cls =
                              "bg-gray-50 border-2 border-gray-100 text-gray-400 opacity-60 cursor-not-allowed";
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(i)}
                            className={`w-full text-left px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${cls} ${
                              selectedOption === null
                                ? "active:scale-[0.98]"
                                : ""
                            }`}
                          >
                            <span className="inline-flex items-center gap-3">
                              <span
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                                  selectedOption !== null && isOptionCorrect
                                    ? "border-[#58cc02] bg-[#58cc02] text-white"
                                    : selectedOption !== null &&
                                        isSelected &&
                                        !isOptionCorrect
                                      ? "border-[#ff4b4b] bg-[#ff4b4b] text-white"
                                      : "border-current"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}
                              </span>
                              {optionText}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback + Next */}
                    <AnimatePresence>
                      {selectedOption !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 ${
                            isCorrect
                              ? "bg-[#d7ffb8]/60 border-[#58cc02]/40"
                              : "bg-[#ffdfe0]/60 border-[#ff4b4b]/40"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">
                              {isCorrect ? "🎉" : "💡"}
                            </span>
                            <span
                              className={`font-black text-sm ${isCorrect ? "text-[#2d6a14]" : "text-[#c0392b]"}`}
                            >
                              {isCorrect ? t("ui.correct") : t("ui.incorrect")}
                            </span>
                          </div>
                          <button
                            onClick={handleNext}
                            className="bg-[#1cb0f6] hover:bg-[#0a96d6] text-white font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95"
                          >
                            {t("ui.nextQuestion")} →
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

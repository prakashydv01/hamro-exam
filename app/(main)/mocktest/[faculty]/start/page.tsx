"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Circle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import katex from "katex";


type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

// Helper function to render math with KaTeX
const renderMath = (text: string) => {
  // Check if the text contains math delimiters
  const inlineMathRegex = /\$([^$]+)\$/g;
  const displayMathRegex = /\$\$([^$]+)\$\$/g;
  
  let renderedText = text;
  
  // Replace display math ($$...$$)
  renderedText = renderedText.replace(displayMathRegex, (_, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (error) {
      console.error("KaTeX display math error:", error);
      return `<span class="text-red-500">${math}</span>`;
    }
  });
  
  // Replace inline math ($...$)
  renderedText = renderedText.replace(inlineMathRegex, (_, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (error) {
      console.error("KaTeX inline math error:", error);
      return `<span class="text-red-500">${math}</span>`;
    }
  });
  
  return <span dangerouslySetInnerHTML={{ __html: renderedText }} />;
};

export default function StartTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    try {
      const qRaw = localStorage.getItem("mocktest_questions");
      const parsed = qRaw && qRaw !== "undefined" ? JSON.parse(qRaw) : [];

      const durationRaw = localStorage.getItem("mocktest_duration");
      const duration = durationRaw ? Number(durationRaw) : 0;

      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
        setAnswers(new Array(parsed.length).fill(null));
      } else {
        // No questions found, redirect back
        router.back();
      }

      if (duration > 0) {
        setTimeLeft(duration * 60);
        setTimerActive(true);
      }
    } catch (err) {
      console.error("Invalid localStorage data", err);
      router.back();
    }
  }, [router]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft < 60) return "text-red-600";
    if (timeLeft < 300) return "text-orange-500";
    return "text-slate-600";
  };

  /* ================= ANSWERS ================= */
  const selectOption = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  /* ================= SUBMIT ================= */
  const submitTest = async () => {
    if (submitting) return;
    
    setTimerActive(false);
    setSubmitting(true);

    const attemptId = localStorage.getItem("mocktest_attemptId");
    const formatted: Record<string, number> = {};

    questions.forEach((q, i) => {
      if (answers[i] !== null) {
        formatted[q._id] = answers[i] as number;
      }
    });

    try {
      const res = await fetch("/api/mocktest/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attemptId,
          answers: formatted,
        }),
      });

      const data = await res.json();
      localStorage.setItem("mocktest_result", JSON.stringify(data));
      router.push(window.location.pathname.replace("start", "result"));
    } catch (err) {
      console.error(err);
      alert("Failed to submit test. Please try again.");
      setSubmitting(false);
      setTimerActive(true);
    }
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-slate-500">Loading test...</p>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header Stats */}
        <div className="bg-white border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                Question <span className="font-semibold text-slate-900">{current + 1}</span> of <span className="font-semibold text-slate-900">{questions.length}</span>
              </div>
              <div className="text-sm text-green-600">
                ✓ {answeredCount} Answered
              </div>
            </div>
            <div className={`flex items-center gap-1 font-mono text-lg font-bold ${getTimerColor()}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content - Question Area */}
          <div className="flex-1">
            {/* Question Card */}
            <div className="bg-slate-50 rounded-lg p-5 mb-4">
              <div className="text-xs text-slate-500 mb-2">Question {current + 1}</div>
              <div className="text-base md:text-lg font-medium text-slate-800 leading-relaxed">
                {renderMath(q.question)}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => {
                const isSelected = answers[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group
                      ${isSelected 
                        ? "border-blue-400 bg-blue-50" 
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                      }
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5
                        ${isSelected 
                          ? "bg-blue-500 text-white" 
                          : "bg-slate-100 text-slate-600 group-hover:bg-blue-500 group-hover:text-white"
                        }
                      `}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm text-slate-700 flex-1">
                        {renderMath(opt)}
                      </span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrent(p => Math.max(p - 1, 0))}
                disabled={current === 0}
                className="flex items-center gap-1 px-4 py-2 text-sm border text-gray-900 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
                Previous
              </button>

              {current === questions.length - 1 ? (
                <button
                  onClick={submitTest}
                  disabled={submitting}
                  className="flex items-center gap-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Test
                      <CheckCircle className="w-3 h-3" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrent(p => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="hidden md:block w-48 flex-shrink-0">
            <div className="bg-slate-50 rounded-lg p-3 sticky top-4">
              <div className="text-xs font-semibold text-slate-600 mb-2">Question Navigator</div>
              <div className="grid grid-cols-4 gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`aspect-square text-xs font-medium rounded transition-all
                      ${i === current 
                        ? "bg-blue-500 text-white ring-2 ring-blue-300" 
                        : answers[i] !== null
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-100 border border-green-300 rounded" />
                    <span className="text-slate-500">Answered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white border border-slate-300 rounded" />
                    <span className="text-slate-500">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Question Navigator */}
        <div className="md:hidden mt-6 pt-4 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-600 mb-2">Quick Navigation</div>
          <div className="grid grid-cols-8 gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`aspect-square text-xs font-medium rounded transition-all
                  ${i === current 
                    ? "bg-blue-500 text-white" 
                    : answers[i] !== null
                    ? "bg-green-100 text-green-700"
                    : "bg-white border border-slate-200 text-slate-600"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Warning when no answer selected */}
        {answers[current] === null && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="w-3 h-3" />
            This question hasn't been answered yet
          </div>
        )}
      </div>
    </div>
  );
}
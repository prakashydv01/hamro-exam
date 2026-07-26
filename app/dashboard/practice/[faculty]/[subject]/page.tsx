"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import katex from "katex";

import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Trophy,
  HelpCircle
} from "lucide-react";

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

// Helper function to render math expressions
const renderMath = (text: string) => {
  if (!text) return text;
  
  const inlineMathRegex = /\$([^\$]+)\$/g;
  const displayMathRegex = /\$\$([^\$]+)\$\$/g;
  
  let renderedText = text;
  
  renderedText = renderedText.replace(displayMathRegex, (match, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (error) {
      console.error("KaTeX display math error:", error);
      return match;
    }
  });
  
  renderedText = renderedText.replace(inlineMathRegex, (match, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (error) {
      console.error("KaTeX inline math error:", error);
      return match;
    }
  });
  
  return <span dangerouslySetInnerHTML={{ __html: renderedText }} />;
};

const MathContent = ({ text }: { text: string }) => {
  if (text.includes('$')) {
    return <>{renderMath(text)}</>;
  }
  return <>{text}</>;
};

export default function MCQPage() {
  const params = useParams();
  const router = useRouter();

  const faculty = decodeURIComponent(params?.faculty as string);
  const subject = decodeURIComponent(params?.subject as string);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MCQ states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  /* ---------------- FETCH QUESTIONS ---------------- */
  useEffect(() => {
    if (!faculty || !subject) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/practice?faculty=${encodeURIComponent(
            faculty
          )}&subject=${encodeURIComponent(subject)}`
        );

        if (!res.ok) throw new Error("Failed to fetch questions");

        const data = await res.json();
        setQuestions(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [faculty, subject]);

  /* ---------------- HANDLE OPTION ---------------- */
  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    const q = questions[currentIndex];
    setSelectedOption(index);
    setShowExplanation(true);

    if (!answered.has(q._id)) {
      setAnswered(prev => new Set(prev).add(q._id));

      if (index === q.correctAnswer) {
        setCorrectAnswers(prev => prev + 1);
      }
    }
  };

  /* ---------------- NAVIGATION ---------------- */
  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setAnswered(new Set());
  };

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">Score: {correctAnswers}/{answered.size}</span>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">Loading questions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && questions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-slate-500">No questions available.</p>
          </div>
        )}

        {/* MCQ Content */}
        {!loading && q && (
          <div>
            {/* Progress Bar - Compact */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{currentIndex + 1} / {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card - Compact */}
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-slate-500 mb-2">Question {currentIndex + 1}</div>
              <div className="text-base font-medium text-slate-800 leading-relaxed">
                <MathContent text={q.question} />
              </div>
            </div>

            {/* Options - Clean List */}
            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctAnswer;
                const isSelected = i === selectedOption;
                const showCorrect = selectedOption !== null && isCorrect;
                const showWrong = selectedOption !== null && isSelected && !isCorrect;

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200
                      ${selectedOption === null && 'border-slate-200 hover:border-blue-300 text-gray-900 hover:bg-blue-50'}
                      ${showCorrect && 'border-green-400 bg-green-50'}
                      ${showWrong && 'border-red-400 bg-red-50'}
                      ${selectedOption !== null && !isCorrect && !isSelected && 'border-slate-200 bg-white opacity-60'}
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        ${showCorrect && 'bg-green-500 text-white'}
                        ${showWrong && 'bg-red-500 text-white'}
                        ${selectedOption === null && 'bg-slate-100 text-slate-600'}
                      `}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-slate-700 flex-1">
                        <MathContent text={opt} />
                      </span>
                      {showCorrect && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                      {showWrong && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation - Collapsible */}
            {showExplanation && q.explanation && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-blue-900">Explanation: </span>
                    <span className="text-blue-800">
                      <MathContent text={q.explanation} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation - Simple */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="flex-1 flex items-center justify-center gap-1 text-gray-900 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
                Previous
              </button>

              {selectedOption !== null && currentIndex < questions.length - 1 && (
                <button
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}

              {selectedOption !== null && currentIndex === questions.length - 1 && (
                <button
                  onClick={() => {
                    const total = questions.length;
                    const accuracy = (correctAnswers / total) * 100;
                    alert(`Quiz Complete!\n\nScore: ${correctAnswers}/${total}\nAccuracy: ${accuracy.toFixed(1)}%`);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Trophy className="w-3 h-3" />
                  Finish
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
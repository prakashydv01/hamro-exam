"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
} from "lucide-react";
import katex from "katex";

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject?: string;
};

type Progress = {
  answers: (number | null)[];
  current: number;
  timeLeft: number;
};

// Helper function to render math with KaTeX
const renderMath = (text: string) => {
  const inlineMathRegex = /\$([^$]+)\$/g;
  const displayMathRegex = /\$\$([^$]+)\$\$/g;

  let renderedText = text;

  renderedText = renderedText.replace(displayMathRegex, (_, math) => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: true });
    } catch (error) {
      console.error("KaTeX display math error:", error);
      return `<span class="text-red-500">${math}</span>`;
    }
  });

  renderedText = renderedText.replace(inlineMathRegex, (_, math) => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: false });
    } catch (error) {
      console.error("KaTeX inline math error:", error);
      return `<span class="text-red-500">${math}</span>`;
    }
  });

  return <span dangerouslySetInnerHTML={{ __html: renderedText }} />;
};

export default function StartTestPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);

  // A question index is reachable once every question before it is answered.
  const [unlockedUpTo, setUnlockedUpTo] = useState(0);

  const progressKey = attemptId ? `mocktest_progress_${attemptId}` : null;

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [status, router]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (status !== "authenticated") return;

    try {
      const id = localStorage.getItem("mocktest_attemptId");
      const qRaw = localStorage.getItem("mocktest_questions");
      const durationRaw = localStorage.getItem("mocktest_duration");

      const parsedQuestions: Question[] =
        qRaw && qRaw !== "undefined" ? JSON.parse(qRaw) : [];
      const duration = durationRaw ? Number(durationRaw) : 0;

      if (!id || !Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        // No real attempt to work with — bounce back to test selection.
        router.back();
        return;
      }

      setAttemptId(id);
      setQuestions(parsedQuestions);

      const key = `mocktest_progress_${id}`;
      const savedRaw = localStorage.getItem(key);
      if (savedRaw && savedRaw !== "undefined") {
        try {
          const saved: Progress = JSON.parse(savedRaw);
          if (saved.answers?.length === parsedQuestions.length) {
            setAnswers(saved.answers);
            setUnlockedUpTo(computeUnlockedUpTo(saved.answers));
            setTimeLeft(saved.timeLeft ?? duration * 60);
            setCurrent(saved.current ?? 0);
            setTimerActive(true);
            return;
          }
        } catch {
          // fall through to fresh start
        }
      }

      const freshAnswers = new Array(parsedQuestions.length).fill(null);
      setAnswers(freshAnswers);
      setUnlockedUpTo(0);
      setTimeLeft(duration * 60);
      setTimerActive(duration > 0);
    } catch (err) {
      console.error("Invalid localStorage data", err);
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, status]);

  const computeUnlockedUpTo = (arr: (number | null)[]) => {
    const firstUnanswered = arr.findIndex((a) => a === null);
    return firstUnanswered === -1 ? arr.length - 1 : firstUnanswered;
  };

  /* ================= LOCAL PROGRESS CACHE (survives refresh) ================= */
  const saveProgressLocally = (
    updatedAnswers: (number | null)[],
    updatedCurrent: number,
    updatedTimeLeft: number
  ) => {
    if (!progressKey) return;
    const progress: Progress = {
      answers: updatedAnswers,
      current: updatedCurrent,
      timeLeft: updatedTimeLeft,
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  };

  const buildAnswersMap = (arr: (number | null)[]) => {
    const map: Record<string, number> = {};
    questions.forEach((q, idx) => {
      if (arr[idx] !== null) map[q._id] = arr[idx] as number;
    });
    return map;
  };

  /* ================= PERSIST ANSWER TO SERVER ================= */
  const syncAnswers = async (updatedAnswers: (number | null)[]) => {
    if (!attemptId) return;
    try {
      const res = await fetch("/api/mocktest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attemptId, answers: buildAnswersMap(updatedAnswers) }),
      });
      if (!res.ok) throw new Error(`[${res.status}]`);
      setSyncWarning(null);
    } catch (err) {
      console.error("Failed to sync answer:", err);
      // Non-blocking — the full answer set is re-sent on submit anyway.
      setSyncWarning("Having trouble saving your progress — check your connection.");
    }
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    saveProgressLocally(answers, current, timeLeft);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest();
          return 0;
        }
        const newTime = prev - 1;
        saveProgressLocally(answers, current, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    saveProgressLocally(updated, current, timeLeft);
    syncAnswers(updated);

    if (current === unlockedUpTo && current < questions.length - 1) {
      setUnlockedUpTo(current + 1);
    }
  };

  const isCurrentAnswered = answers[current] !== null && answers[current] !== undefined;
  const canNavigateTo = (index: number) => index <= unlockedUpTo;

  const goToQuestion = (index: number) => {
    if (!canNavigateTo(index)) return;
    setCurrent(index);
    saveProgressLocally(answers, index, timeLeft);
  };

  const goNext = () => {
    if (!isCurrentAnswered) return;
    if (current < questions.length - 1) {
      const next = current + 1;
      setCurrent(next);
      saveProgressLocally(answers, next, timeLeft);
    }
  };

  /* ================= SUBMIT ================= */
  const submitTest = async () => {
    if (submitting || !attemptId) return;
    if (!isCurrentAnswered) return; // must answer the last question too

    setTimerActive(false);
    setSubmitting(true);
    setSubmitError(null);

    const answersMap = buildAnswersMap(answers);

    try {
      const res = await fetch("/api/mocktest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attemptId, answers: answersMap }),
      });

      if (res.status === 401) {
        setSubmitError("Your session expired. Redirecting to login...");
        setTimeout(() => {
          router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        }, 1000);
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Failed with status ${res.status}`);
      }

      const data = await res.json();

      // Build a per-question breakdown locally for the results page —
      // the submit API only returns aggregate numbers.
      const result = {
        attemptId,
        score: {
          total: data.total,
          correct: data.correct,
          wrong: data.wrong,
          unattempted: data.unattempted,
          obtained: data.score,
          percentage: data.percentage,
          accuracy: data.accuracy,
          negativeMarking: data.negativeMarking,
        },
        questions: questions.map((q, idx) => ({
          ...q,
          userAnswer: answers[idx],
          isCorrect: answers[idx] === q.correctAnswer,
        })),
      };
      localStorage.setItem("mocktest_result", JSON.stringify(result));

      // Clean up everything scoped to this attempt.
      localStorage.removeItem("mocktest_questions");
      localStorage.removeItem("mocktest_attemptId");
      localStorage.removeItem("mocktest_duration");
      if (progressKey) localStorage.removeItem(progressKey);

      router.push(window.location.pathname.replace("start", "result"));
    } catch (err) {
      console.error("Failed to submit test:", err);
      setSubmitError(
        "We couldn't submit your test. Your answers are saved — please check your connection and try again."
      );
      setSubmitting(false);
      setTimerActive(true);
    }
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  if (status === "loading" || status === "unauthenticated" || !questions.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-slate-500">
              {status === "unauthenticated" ? "Redirecting to login..." : "Loading test..."}
            </p>
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
                Question <span className="font-semibold text-slate-900">{current + 1}</span> of{" "}
                <span className="font-semibold text-slate-900">{questions.length}</span>
              </div>
              <div className="text-sm text-green-600">✓ {answeredCount} Answered</div>
              {session?.user?.name && (
                <div className="text-xs text-slate-400">as {session.user.name}</div>
              )}
            </div>
            <div className={`flex items-center gap-1 font-mono text-lg font-bold ${getTimerColor()}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

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
            <div className="bg-slate-50 rounded-lg p-5 mb-4">
              <div className="text-xs text-slate-500 mb-2">Question {current + 1}</div>
              <div className="text-base md:text-lg font-medium text-slate-800 leading-relaxed">
                {renderMath(q.question)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => {
                const isSelected = answers[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group
                      ${
                        isSelected
                          ? "border-blue-400 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                      }
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5
                        ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-blue-500 group-hover:text-white"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm text-slate-700 flex-1">{renderMath(opt)}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {syncWarning && (
              <div className="mb-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <AlertTriangle className="w-3 h-3" />
                {syncWarning}
              </div>
            )}

            {submitError && (
              <div className="mb-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                <AlertTriangle className="w-3 h-3" />
                {submitError}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const prev = Math.max(current - 1, 0);
                  setCurrent(prev);
                  saveProgressLocally(answers, prev, timeLeft);
                }}
                disabled={current === 0}
                className="flex items-center gap-1 px-4 py-2 text-sm border text-gray-900 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
                Previous
              </button>

              {current === questions.length - 1 ? (
                <button
                  onClick={submitTest}
                  disabled={submitting || !isCurrentAnswered}
                  title={!isCurrentAnswered ? "Answer this question to submit" : undefined}
                  className="flex items-center gap-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                  onClick={goNext}
                  disabled={!isCurrentAnswered}
                  title={!isCurrentAnswered ? "Select an answer to continue" : undefined}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                {questions.map((_, i) => {
                  const locked = !canNavigateTo(i);
                  return (
                    <button
                      key={i}
                      onClick={() => goToQuestion(i)}
                      disabled={locked}
                      title={locked ? "Answer the current question to unlock" : undefined}
                      className={`aspect-square text-xs font-medium rounded transition-all flex items-center justify-center
                        ${
                          i === current
                            ? "bg-blue-500 text-white ring-2 ring-blue-300"
                            : locked
                            ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                            : answers[i] !== null
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                        }
                      `}
                    >
                      {locked ? <Lock className="w-3 h-3" /> : i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-green-100 border border-green-300 rounded" />
                  <span className="text-slate-500">Answered</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-white border border-slate-300 rounded" />
                  <span className="text-slate-500">Pending</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Lock className="w-2.5 h-2.5 text-slate-300" />
                  <span className="text-slate-500">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Question Navigator */}
        <div className="md:hidden mt-6 pt-4 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-600 mb-2">Quick Navigation</div>
          <div className="grid grid-cols-8 gap-1.5">
            {questions.map((_, i) => {
              const locked = !canNavigateTo(i);
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  disabled={locked}
                  className={`aspect-square text-xs font-medium rounded transition-all flex items-center justify-center
                    ${
                      i === current
                        ? "bg-blue-500 text-white"
                        : locked
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                        : answers[i] !== null
                        ? "bg-green-100 text-green-700"
                        : "bg-white border border-slate-200 text-slate-600"
                    }
                  `}
                >
                  {locked ? <Lock className="w-3 h-3" /> : i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Warning when no answer selected */}
        {!isCurrentAnswered && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="w-3 h-3" />
            Select an answer to continue to the next question
          </div>
        )}
      </div>
    </div>
  );
}
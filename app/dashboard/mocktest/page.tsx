"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Clock, BookOpen, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

/* ================= TYPES ================= */
type SubjectRule = {
  subject: string;
  count: number;
  compulsory?: boolean;
  group?: string;
};

type MockTestConfig = {
  faculty: string;
  durationMinutes: number;
  totalQuestions: number;
  subjectRules?: SubjectRule[];
  description?: string;
  negativeMarking?: {
    enabled: boolean;
    perWrong: number;
  };
};

// ✅ FIXED: correctAnswer is now number
type Question = {
  _id: string;
  question: string;
  options: string[];
  subject: string;
  correctAnswer: number;
};

type UserAnswer = {
  questionId: string;
  selectedOption: number | null;
  selectedAnswer: number | null;
  subject: string;
  isCorrect?: boolean;
};

type SubjectScore = {
  correct: number;
  wrong: number;
  total: number;
  name: string;
};

type TestResult = {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  score: number;
  percentage: number;
  accuracy: number;
  timeTaken: number;
  subjectScores: SubjectScore[];
  negativeMarking: {
    enabled: boolean;
    perWrong: number;
    applied: number;
  };
};

type SubmitResponse = {
  attemptId: string;
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  percentage: number;
  accuracy: number;
  negativeMarking: {
    enabled: boolean;
    perWrong: number;
    applied: number;
  };
};

/* ================= PAGE ================= */
export default function MockTestPage() {
  const [configs, setConfigs] = useState<MockTestConfig[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<MockTestConfig | null>(null);
  const [view, setView] = useState<"select" | "exam" | "review" | "result">("select");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [attemptId, setAttemptId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  /* ================= LOAD CONFIGS ================= */
  useEffect(() => {
    fetch("/api/mocktest")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setConfigs(data);
      })
      .catch(err => console.error(err));
  }, []);

  /* ================= LOAD SINGLE CONFIG ================= */
  useEffect(() => {
    if (!selectedFaculty) {
      setConfig(null);
      return;
    }

    const found = configs.find(c => c.faculty === selectedFaculty);
    setConfig(found || null);
    setSelectedGroups({});
  }, [selectedFaculty, configs]);

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  /* ================= START MOCK TEST ================= */
  const startMockTest = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/mocktest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty: selectedFaculty,
          selectedGroups,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to start mock test");
        return;
      }

      setAttemptId(data.attemptId);
      
      // ✅ Ensure correctAnswer is treated as number
      const questionsFromAPI = Array.isArray(data.questions) 
        ? data.questions.map((q: any) => ({
            ...q,
            correctAnswer: Number(q.correctAnswer)
          }))
        : [];
      
      setQuestions(questionsFromAPI);
      
      const initialAnswers = questionsFromAPI.map((q: Question) => ({
        questionId: q._id,
        selectedOption: null,
        selectedAnswer: null,
        subject: q.subject || "General",
      }));
      setUserAnswers(initialAnswers);
      
      if (config?.durationMinutes) {
        setTimeLeft(config.durationMinutes * 60);
        setTimerActive(true);
      }
      
      setView("exam");
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= QUESTION NAVIGATION ================= */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      selectedOption: optionIndex,
      selectedAnswer: optionIndex,
    };
    setUserAnswers(updatedAnswers);
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  /* ================= PREPARE ANSWERS FOR SUBMISSION ================= */
  const prepareAnswersForSubmission = () => {
    const answers: Record<string, number> = {};
    
    userAnswers.forEach((answer) => {
      if (answer.selectedAnswer !== null) {
        answers[answer.questionId] = answer.selectedAnswer;
      }
    });
    
    return answers;
  };

  /* ================= SUBMIT TEST ================= */
  const handleSubmitTest = async () => {
    setTimerActive(false);
    setSubmitting(true);
    
    try {
      const answers = prepareAnswersForSubmission();
      
      const res = await fetch("/api/mocktest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          answers,
        }),
      });

      const data: SubmitResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit test");
      }

      // Calculate subject-wise performance
      const subjectMap = new Map<string, { correct: number; wrong: number; total: number; name: string }>();
      
      questions.forEach((question, index) => {
        const subjectName = question.subject || "General";
        const userAnswer = userAnswers[index];
        
        // ✅ Simple number comparison
        const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
        
        if (!subjectMap.has(subjectName)) {
          subjectMap.set(subjectName, { 
            correct: 0, 
            wrong: 0, 
            total: 0,
            name: subjectName 
          });
        }
        
        const subjectData = subjectMap.get(subjectName)!;
        subjectData.total++;
        
        if (isCorrect) {
          subjectData.correct++;
        } else if (userAnswer.selectedAnswer !== null) {
          subjectData.wrong++;
        }
      });

      const subjectScores = Array.from(subjectMap.values());

      const result: TestResult = {
        totalQuestions: data.total,
        correctAnswers: data.correct,
        wrongAnswers: data.wrong,
        unattempted: data.unattempted,
        score: data.score,
        percentage: data.percentage,
        accuracy: data.accuracy,
        timeTaken: (config?.durationMinutes || 0) * 60 - timeLeft,
        subjectScores: subjectScores,
        negativeMarking: data.negativeMarking,
      };

      setTestResult(result);
      
      // Update answers with correctness info for review
      const updatedAnswersWithValidation = userAnswers.map((answer, index) => ({
        ...answer,
        isCorrect: answer.selectedAnswer === questions[index].correctAnswer,
      }));
      setUserAnswers(updatedAnswersWithValidation);
      
      setView("result");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error submitting test");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= REVIEW ANSWERS ================= */
  const handleReviewAnswers = () => {
    setView("review");
    setCurrentQuestionIndex(0);
  };

  /* ================= FORMAT TIME ================= */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* ================= GET OPTION LETTER ================= */
  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  /* ================= CHECK IF LAST QUESTION ================= */
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= SELECT VIEW ================= */}
        {view === "select" && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Practice Mock Tests
              </h1>
              <p className="text-gray-600 text-sm">
                Select your faculty and subjects to begin
              </p>
            </div>

            {/* Faculty Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Select Faculty
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {configs.map((facultyConfig) => (
                  <button
                    key={facultyConfig.faculty}
                    onClick={() => setSelectedFaculty(facultyConfig.faculty)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedFaculty === facultyConfig.faculty
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {facultyConfig.faculty}
                      </h3>
                      {selectedFaculty === facultyConfig.faculty && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {facultyConfig.totalQuestions}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {facultyConfig.durationMinutes}m
                      </span>
                      {facultyConfig.negativeMarking?.enabled && (
                        <span className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3.5 h-3.5" />
                          -{facultyConfig.negativeMarking.perWrong} per wrong
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            {config && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedFaculty} Subjects
                  </h2>
                  <span className="text-sm text-gray-500">
                    Total: {config.totalQuestions} Qs
                  </span>
                </div>
                
                {/* Compulsory Subjects */}
                {config.subjectRules?.filter(s => s.compulsory).length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Compulsory
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {config.subjectRules
                        .filter(s => s.compulsory)
                        .map(s => (
                          <div key={s.subject} className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="font-medium text-sm text-gray-800">{s.subject}</div>
                            <div className="text-xs text-gray-600">{s.count} Qs</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Optional Groups */}
                {Object.entries(
                  config.subjectRules?.reduce(
                    (acc: Record<string, SubjectRule[]>, s) => {
                      if (s.group) {
                        acc[s.group] = acc[s.group] || [];
                        acc[s.group].push(s);
                      }
                      return acc;
                    },
                    {}
                  ) || {}
                ).map(([group, subjects]) => (
                  <div key={group} className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      {group.replace(/_/g, ' ')} (Choose one)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {subjects.map(s => (
                        <button
                          key={s.subject}
                          onClick={() =>
                            setSelectedGroups(prev => ({
                              ...prev,
                              [group]: s.subject,
                            }))
                          }
                          className={`p-2 rounded border text-left transition-all ${
                            selectedGroups[group] === s.subject
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium text-sm text-gray-800">{s.subject}</div>
                          <div className="text-xs text-gray-600">{s.count} Qs</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Negative Marking Info */}
                {config.negativeMarking?.enabled && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 text-sm">Negative Marking Applied</p>
                        <p className="text-xs text-red-600">
                          Each wrong answer will deduct {config.negativeMarking.perWrong} mark
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startMockTest}
                disabled={loading || !selectedFaculty}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Mock Test"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= EXAM VIEW ================= */}
        {view === "exam" && questions.length > 0 && (
          <div>
            {/* Exam Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3 sticky top-0 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {questions[currentQuestionIndex]?.subject || "General"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Q{currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                  </div>
                  <button
                    onClick={handleSubmitTest}
                    disabled={submitting}
                    className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Question Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  {/* Question */}
                  <div className="mb-4">
                    <p className="text-gray-900 text-base">
                      {questions[currentQuestionIndex]?.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {questions[currentQuestionIndex]?.options.map((option, index) => {
                      const isSelected = userAnswers[currentQuestionIndex]?.selectedOption === index;
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {getOptionLetter(index)}
                            </span>
                            <span className="text-sm text-gray-700">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4 pt-3 border-t">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    {isLastQuestion ? (
                      <button
                        onClick={handleSubmitTest}
                        disabled={submitting}
                        className="flex items-center justify-center gap-1 px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Test"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Palette */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sticky top-20">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">Questions</h3>
                  
                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{userAnswers.filter(a => a.selectedOption !== null).length}/{questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(userAnswers.filter(a => a.selectedOption !== null).length / questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-1 mb-3">
                    {questions.map((_, index) => {
                      const isAnswered = userAnswers[index]?.selectedOption !== null;
                      const isCurrent = index === currentQuestionIndex;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionSelect(index)}
                          className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                            isCurrent
                              ? "ring-2 ring-blue-500 bg-blue-100 text-blue-600"
                              : isAnswered
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex gap-3 text-xs border-t pt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                      <span className="text-gray-600">Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                      <span className="text-gray-600">Not</span>
                    </div>
                  </div>

                  {/* Submit Button in Palette for Mobile */}
                  <div className="mt-3 pt-3 border-t lg:hidden">
                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="w-full px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Test"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= RESULT VIEW ================= */}
        {view === "result" && testResult && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Test Completed!
                </h2>
                <p className="text-sm text-gray-600">
                  Your score: {testResult.percentage.toFixed(1)}%
                </p>
              </div>
              
              {/* Score Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className="bg-blue-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-blue-600">{testResult.totalQuestions}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="bg-green-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-green-600">{testResult.correctAnswers}</div>
                  <div className="text-xs text-gray-600">Correct</div>
                </div>
                <div className="bg-red-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-red-600">{testResult.wrongAnswers}</div>
                  <div className="text-xs text-gray-600">Wrong</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-yellow-600">{testResult.unattempted}</div>
                  <div className="text-xs text-gray-600">Unattempted</div>
                </div>
              </div>

              {/* Score Details */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Raw Score</p>
                    <p className="font-semibold text-gray-900">{testResult.correctAnswers} marks</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Accuracy</p>
                    <p className="font-semibold text-gray-900">{testResult.accuracy}%</p>
                  </div>
                  {testResult.negativeMarking.enabled && (
                    <>
                      <div>
                        <p className="text-gray-600">Negative Marks</p>
                        <p className="font-semibold text-red-600">-{testResult.negativeMarking.applied}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Per Wrong</p>
                        <p className="font-semibold text-gray-900">{testResult.negativeMarking.perWrong}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-gray-600">Final Score</p>
                    <p className="font-semibold text-blue-600">{testResult.score.toFixed(1)}</p>
                  </div>
                </div>
              </div>

              {/* Subject Performance */}
              {testResult.subjectScores && testResult.subjectScores.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">Subject Performance</h3>
                  <div className="space-y-2">
                    {testResult.subjectScores.map((subject) => (
                      <div key={subject.name} className="bg-gray-50 rounded p-2">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-medium text-gray-700">{subject.name}</span>
                          <span className="text-gray-600">
                            {subject.correct}/{subject.total} 
                            {subject.wrong > 0 && ` (${subject.wrong} wrong)`}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(subject.correct / subject.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Info */}
              <div className="mb-4 text-center">
                <p className="text-xs text-gray-500">
                  Time Taken: {formatTime(testResult.timeTaken)} / {formatTime(config?.durationMinutes ? config.durationMinutes * 60 : 0)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleReviewAnswers}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-4 h-4" />
                  Review
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                >
                  New Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= REVIEW VIEW ================= */}
        {view === "review" && questions.length > 0 && (
          <div>
            {/* Review Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3 sticky top-0 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-gray-900">Review Answers</h2>
                  <p className="text-sm text-gray-600">
                    Q{currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
                
                <button
                  onClick={() => setView("result")}
                  className="px-4 py-1.5 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
                >
                  Back to Results
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Question Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  {/* Status */}
                  <div className="mb-3">
                    {userAnswers[currentQuestionIndex]?.isCorrect ? (
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Correct
                      </div>
                    ) : userAnswers[currentQuestionIndex]?.selectedOption !== null ? (
                      <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        Incorrect
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Not Attempted
                      </div>
                    )}
                  </div>

                  {/* Question */}
                  <div className="mb-4">
                    <p className="text-gray-900 text-base">
                      {questions[currentQuestionIndex]?.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {questions[currentQuestionIndex]?.options.map((option, index) => {
                      const isSelected = userAnswers[currentQuestionIndex]?.selectedOption === index;
                      
                      // ✅ Direct number comparison
                      const isCorrectAnswer = questions[currentQuestionIndex]?.correctAnswer === index;
                      
                      // Determine styling
                      let bgClass = "border-gray-200";
                      let textClass = "text-gray-700";
                      let iconBgClass = "bg-gray-100 text-gray-600";
                      
                      if (isCorrectAnswer) {
                        // Correct answer - always show in green
                        bgClass = "border-green-500 bg-green-50";
                        textClass = "text-green-700";
                        iconBgClass = "bg-green-500 text-white";
                      } else if (isSelected && !isCorrectAnswer) {
                        // Wrong answer selected - show in red
                        bgClass = "border-red-500 bg-red-50";
                        textClass = "text-red-700";
                        iconBgClass = "bg-red-500 text-white";
                      }
                      
                      return (
                        <div key={index} className={`w-full p-3 rounded-lg border ${bgClass}`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${iconBgClass}`}>
                              {getOptionLetter(index)}
                            </span>
                            <span className={`text-sm ${textClass}`}>{option}</span>
                            {isCorrectAnswer && (
                              <span className="text-xs text-green-600 font-medium ml-auto">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>
                    
                    <button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Palette */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sticky top-20">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">Review</h3>
                  
                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Correct</span>
                      <span>{userAnswers.filter(a => a.isCorrect).length}/{questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(userAnswers.filter(a => a.isCorrect).length / questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-1">
                    {questions.map((_, index) => {
                      const isCurrent = index === currentQuestionIndex;
                      const isCorrect = userAnswers[index]?.isCorrect;
                      const isAttempted = userAnswers[index]?.selectedOption !== null;
                      
                      let gridItemClass = "w-8 h-8 rounded text-xs font-medium transition-all ";
                      
                      if (isCurrent) {
                        gridItemClass += "ring-2 ring-blue-500 bg-blue-100 text-blue-600";
                      } else if (isCorrect === true) {
                        gridItemClass += "bg-green-100 text-green-600";
                      } else if (isCorrect === false) {
                        gridItemClass += "bg-red-100 text-red-600";
                      } else if (isAttempted) {
                        gridItemClass += "bg-yellow-100 text-yellow-600";
                      } else {
                        gridItemClass += "bg-gray-100 text-gray-600 hover:bg-gray-200";
                      }
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionSelect(index)}
                          className={gridItemClass}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                      <span className="text-gray-600">Correct</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                      <span className="text-gray-600">Wrong</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                      <span className="text-gray-600">Attempted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                      <span className="text-gray-600">Not</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
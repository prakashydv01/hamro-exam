"use client";

import { useEffect, useState } from "react";
import { ChevronRight, CheckCircle, XCircle, Award, BookOpen, ChevronLeft, RefreshCw, Home } from "lucide-react";

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

type ViewState = "faculty" | "subject" | "mcq";

export default function CompactPracticePage() {
  const [faculties, setFaculties] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // MCQ view states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [viewState, setViewState] = useState<ViewState>("faculty");

  /* ---------------- FETCH FACULTIES ---------------- */
  useEffect(() => {
    fetch("/api/practice")
      .then(res => res.json())
      .then(data => setFaculties(data.data || []));
  }, []);

  /* ---------------- HANDLE FACULTY SELECTION ---------------- */
  const handleFacultySelect = async (faculty: string) => {
    setLoading(true);
    setSelectedFaculty(faculty);
    setSelectedSubject(null);
    setQuestions([]);
    resetMCQState();
    
    const res = await fetch(`/api/practice?faculty=${faculty}`);
    const data = await res.json();
    setSubjects(data.data || []);
    setLoading(false);
    setViewState("subject");
  };

  /* ---------------- HANDLE SUBJECT SELECTION ---------------- */
  const handleSubjectSelect = async (subject: string) => {
    if (!selectedFaculty) return;
    
    setLoading(true);
    setSelectedSubject(subject);
    resetMCQState();
    
    const res = await fetch(
      `/api/practice?faculty=${selectedFaculty}&subject=${subject}`
    );
    const data = await res.json();
    setQuestions(data.data || []);
    setLoading(false);
    setViewState("mcq");
  };

  /* ---------------- RESET MCQ STATE ---------------- */
  const resetMCQState = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(0);
  };

  /* ---------------- HANDLE OPTION SELECTION ---------------- */
  const handleOptionSelect = async (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent re-selecting
    
    const currentQuestion = questions[currentIndex];
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    // Track answered question
    if (!answeredQuestions.has(currentQuestion._id)) {
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion._id]));
      
      // Update correct answers count
      if (optionIndex === currentQuestion.correctAnswer) {
        setCorrectAnswers(prev => prev + 1);
      }

      // Automatically store attempt via API
      
    }
  };

  /* ---------------- NAVIGATION ---------------- */
  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const goBackToSubjects = () => setViewState("subject");

  const goBackToFaculties = () => {
    setSelectedFaculty(null);
    setSelectedSubject(null);
    setQuestions([]);
    resetMCQState();
    setViewState("faculty");
  };

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-2xl mx-auto">
        {/* Route-style Header */}
        {viewState !== "faculty" && (
          <div className="mb-3">
            <nav className="flex items-center text-sm text-gray-600 bg-white p-2 rounded-lg border">
              <button
                onClick={goBackToFaculties}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <Home size={16} className="mr-1" />
                Faculties
                {selectedFaculty && <ChevronRight size={16} className="mx-1" />}
              </button>
              
              {selectedFaculty && (
                <>
                  <span className="mx-1 text-gray-800 font-medium">{selectedFaculty}</span>
                  {viewState === "mcq" && <ChevronRight size={16} className="mx-1" />}
                </>
              )}
              
              {viewState === "mcq" && selectedSubject && (
                <span className="ml-1 text-gray-800 font-medium">{selectedSubject}</span>
              )}
            </nav>
          </div>
        )}

        {/* Progress Bar - Moved to top */}
        {viewState === "mcq" && questions.length > 0 && (
          <div className="bg-white rounded-lg border p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">
                Question {currentIndex + 1} of {questions.length}
              </div>
              <div className="text-sm font-bold text-blue-600">
                Score: {correctAnswers}/{answeredQuestions.size}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Faculty Selection - COMPACT */}
        {!loading && viewState === "faculty" && (
          <div className="space-y-2">
            <div className="bg-white rounded-lg border p-4 mb-3">
              <h1 className="text-xl font-bold text-gray-800 mb-1">MCQ Practice</h1>
              <p className="text-gray-600">Select a faculty to begin practice</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {faculties.map(faculty => (
                <button
                  key={faculty}
                  onClick={() => handleFacultySelect(faculty)}
                  className="bg-white p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all text-left flex items-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <BookOpen className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{faculty}</h3>
                    <p className="text-xs text-gray-500">Click to view subjects</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subject Selection - COMPACT */}
        {!loading && viewState === "subject" && selectedFaculty && (
          <div className="space-y-2">
            <div className="bg-white rounded-lg border p-4 mb-3">
              <h1 className="text-xl font-bold text-gray-800 mb-1">{selectedFaculty}</h1>
              <p className="text-gray-600">Select a subject to practice</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => handleSubjectSelect(subject)}
                  className="bg-white p-3 rounded-lg border hover:border-green-300 hover:bg-green-50 transition-all text-left flex items-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <Award className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{subject}</h3>
                    <p className="text-xs text-gray-500">Click to start practice</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MCQ Practice - ULTRA COMPACT */}
        {!loading && viewState === "mcq" && currentQuestion && (
          <div className="space-y-3">
            {/* Question Card - ULTRA COMPACT */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              {/* Question - Compact */}
              <div className="p-4 border-b">
                <div className="text-sm text-gray-500 mb-1">Question {currentIndex + 1}</div>
                <h2 className="text-gray-800 font-medium leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Ultra-Compact Options */}
              <div className="p-3 space-y-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const showCorrect = selectedOption !== null && isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-3 rounded text-left transition-all duration-100 flex items-start
                        ${isSelected
                          ? isCorrect
                            ? "bg-green-50 border border-green-300"
                            : "bg-red-50 border border-red-300"
                          : showCorrect
                          ? "bg-green-50 border border-green-300"
                          : "border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                    >
                      <div className={`min-w-8 h-8 rounded flex items-center justify-center mr-3 text-sm font-medium
                        ${isSelected
                          ? isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : showCorrect
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`text-sm ${isSelected && !isCorrect ? "text-red-700" : "text-gray-700"}`}>
                        {option}
                      </span>
                      {selectedOption !== null && (isSelected || isCorrect) && (
                        <div className="ml-auto">
                          {isCorrect ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : isSelected && !isCorrect ? (
                            <XCircle size={18} className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Compact Explanation */}
              {showExplanation && currentQuestion.explanation && (
                <div className="p-3 border-t bg-blue-50">
                  <div className="text-xs font-medium text-blue-800 mb-1">Explanation:</div>
                  <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation - Compact */}
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className={`px-3 py-1.5 rounded text-sm flex items-center
                  ${currentIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              <button
                onClick={resetMCQState}
                className="px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <RefreshCw size={14} className="mr-1" />
                Reset
              </button>

              {selectedOption !== null && currentIndex < questions.length - 1 && (
                <button
                  onClick={goToNext}
                  className="px-3 py-1.5 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              )}

              {selectedOption !== null && currentIndex === questions.length - 1 && (
                <button
                  onClick={() => alert(`Quiz Completed!\nScore: ${correctAnswers}/${questions.length}\nAccuracy: ${((correctAnswers / questions.length) * 100).toFixed(1)}%`)}
                  className="px-3 py-1.5 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        )}

        {/* No Questions */}
        {!loading && viewState === "mcq" && questions.length === 0 && (
          <div className="bg-white rounded-lg border p-6 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Questions Available</h3>
            <p className="text-gray-600 mb-4">There are no practice questions for this subject yet.</p>
            <button
              onClick={goBackToSubjects}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm"
            >
              Back to Subjects
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
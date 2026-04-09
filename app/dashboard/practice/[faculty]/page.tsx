"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  BookOpen, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  Library,
  Clock,
  Sparkles,
  Target
} from "lucide-react";

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ Ensure faculty is string
  const faculty = decodeURIComponent(params?.faculty as string);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    if (!faculty) return;

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/practice?faculty=${encodeURIComponent(faculty)}`);

        if (!res.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const data = await res.json();
        setSubjects(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading subjects.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [faculty]);

  /* ---------------- HANDLE CLICK ---------------- */
  const handleSubjectClick = (subject: string) => {
    router.push(
      `/dashboard/practice/${encodeURIComponent(faculty)}/${encodeURIComponent(subject)}`
    );
  };

  // Get gradient color based on index
  const getCardGradient = (index: number) => {
    const gradients = [
      "from-blue-50 to-indigo-50",
      "from-purple-50 to-pink-50",
      "from-green-50 to-emerald-50",
      "from-orange-50 to-amber-50",
      "from-red-50 to-rose-50",
      "from-teal-50 to-cyan-50",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button - Sticky on mobile */}
        <div className="sticky top-4 z-10 mb-6">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Faculties</span>
          </button>
        </div>

        {/* Header Section with Hero Style */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-6">
            <Library className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            {faculty}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Choose a subject to begin your practice journey
          </p>
          
          {/* Stats Cards */}
          {!loading && subjects.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700 font-medium">{subjects.length} Subjects</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-slate-700 font-medium">Self-paced Learning</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-full">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-slate-700 font-medium">Track Progress</span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State - Square Cards Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-white rounded-2xl border border-slate-200 p-6 animate-pulse"
              >
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4" />
                  <div className="space-y-3 flex-1">
                    <div className="h-5 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-2/3 bg-slate-200 rounded" />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-red-800 text-xl font-medium mb-2">
                Unable to Load Subjects
              </p>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Subjects Grid - Square Cards */}
        {!loading && !error && subjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {subjects.map((subject, index) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative aspect-square bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative h-full flex flex-col p-6">
                  {/* Subject Number Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  {/* Subject Title */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                      {subject}
                    </h3>
                    <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                      Start practicing
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Ready to begin</span>
                      <Sparkles className="w-3 h-3 group-hover:text-yellow-500 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-all duration-300 pointer-events-none" />
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && subjects.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center max-w-md">
              <BookOpen className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-yellow-800 text-xl font-medium mb-2">
                No Subjects Available
              </p>
              <p className="text-yellow-600 mb-6">
                No subjects found for {faculty}. Please check back later.
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all duration-300 font-medium"
              >
                Go Back to Faculties
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
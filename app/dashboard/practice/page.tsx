"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  GraduationCap, 
  Loader2, 
  AlertCircle,
  ChevronRight 
} from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const [faculties, setFaculties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setError(null);
        const res = await fetch("/api/practice");
        
        if (!res.ok) {
          throw new Error(`Failed to load faculties: ${res.status}`);
        }
        
        const data = await res.json();
        setFaculties(data.data || []);
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
        setError(error instanceof Error ? error.message : "Failed to load faculties");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  const handleFacultySelect = (faculty: string) => {
    router.push(`/practice/${encodeURIComponent(faculty)}`);
  };

  // Faculty icons mapping (you can expand this)
  const getFacultyIcon = (faculty: string) => {
    const facultyLower = faculty.toLowerCase();
    if (facultyLower.includes("science")) return <GraduationCap className="w-5 h-5 text-blue-600" />;
    if (facultyLower.includes("arts")) return <BookOpen className="w-5 h-5 text-blue-600" />;
    return <GraduationCap className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Choose Your Faculty
          </h1>
          <p className="text-slate-600 text-lg">
            Select a faculty to start practicing
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-600 text-lg">
              Loading faculties...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <p className="text-red-800 text-lg font-medium mb-2">
              Something went wrong
            </p>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Faculty Grid */}
        {!loading && !error && faculties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculties.map((faculty) => (
              <button
                key={faculty}
                onClick={() => handleFacultySelect(faculty)}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      {getFacultyIcon(faculty)}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 text-left">
                    {faculty}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 text-left">
                    Click to start practicing →
                  </p>
                </div>
                
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && faculties.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <p className="text-yellow-800 text-lg">
              No faculties available
            </p>
            <p className="text-yellow-600 mt-2">
              Please check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
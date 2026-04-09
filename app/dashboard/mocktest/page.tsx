"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  FileQuestion, 
  TrendingUp,
  Loader2,
  AlertCircle,
  ChevronRight
} from "lucide-react";

type MockTestConfig = {
  faculty: string;
  totalQuestions: number;
  durationMinutes: number;
};

export default function MockTestListPage() {
  const [configs, setConfigs] = useState<MockTestConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/mocktest");
        
        if (!res.ok) {
          throw new Error("Failed to load mock tests");
        }
        
        const data = await res.json();
        setConfigs(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load mock tests");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const handleSelectFaculty = (faculty: string) => {
    const slug = faculty.toLowerCase().replace(/\s+/g, "-");
    router.push(`/dashboard/mocktest/${slug}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Mock Tests
          </h1>
          <p className="text-slate-600">
            Select a faculty to start your mock test
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-slate-500">Loading mock tests...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <p className="text-red-800 font-medium mb-2">Failed to Load Tests</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && configs.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <FileQuestion className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <p className="text-yellow-800 font-medium">No Mock Tests Available</p>
            <p className="text-yellow-600 text-sm mt-1">Check back later for updates</p>
          </div>
        )}

        {/* Faculty Grid */}
        {!loading && !error && configs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => (
              <button
                key={config.faculty}
                onClick={() => handleSelectFaculty(config.faculty)}
                className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden text-left"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {config.faculty}
                    </h2>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileQuestion className="w-4 h-4" />
                      <span>{config.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{config.durationMinutes} Minutes</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-xs text-blue-600 group-hover:text-blue-700">
                      Start Test →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
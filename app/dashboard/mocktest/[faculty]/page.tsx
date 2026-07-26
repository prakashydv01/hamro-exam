"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  FileQuestion, 
  CheckCircle,
  Circle,
  Loader2,
  AlertCircle,
  BookOpen,
  Layers
} from "lucide-react";

/* ================= TYPES ================= */
type SubjectRule = {
  subject: string;
  count: number;
  compulsory?: boolean;
  group?: string;
};

type MockTestConfig = {
  faculty: string;
  totalQuestions: number;
  durationMinutes: number;
  subjectRules?: SubjectRule[];
};

export default function FacultyPage() {
  const params = useParams();
  const router = useRouter();

  const facultySlug =
    typeof params.faculty === "string"
      ? params.faculty
      : params.faculty?.[0] || "";

  const [config, setConfig] = useState<MockTestConfig | null>(null);
  const [realFaculty, setRealFaculty] = useState<string>("");
  const [selectedGroups, setSelectedGroups] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD CONFIG ================= */
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setPageLoading(true);
        setError(null);

        const res = await fetch("/api/mocktest");
        
        if (!res.ok) {
          throw new Error("Failed to load test configuration");
        }
        
        const data = await res.json();

        if (!Array.isArray(data)) {
          setConfig(null);
          return;
        }

        const found = data.find(
          (f: MockTestConfig) =>
            f.faculty.toLowerCase().replace(/\s+/g, "-") === facultySlug
        );

        if (found) {
          setConfig(found);
          setRealFaculty(found.faculty);
        } else {
          setConfig(null);
        }
      } catch (err) {
        console.error("Failed to load config", err);
        setError(err instanceof Error ? err.message : "Failed to load configuration");
        setConfig(null);
      } finally {
        setPageLoading(false);
      }
    };

    if (facultySlug) fetchConfig();
  }, [facultySlug]);

  /* ================= START TEST ================= */
  const startTest = async () => {
    if (!realFaculty) {
      alert("Mock test not configured for this faculty");
      return;
    }

    // Check if all groups are selected
    const groups = config?.subjectRules?.filter(s => s.group) || [];
    const uniqueGroups = [...new Set(groups.map(g => g.group))];
    const missingGroups = uniqueGroups.filter(group => !selectedGroups[group as string]);
    
    if (missingGroups.length > 0) {
      alert(`Please select one subject from each group: ${missingGroups.join(", ")}`);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/mocktest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty: config?.faculty,
          selectedGroups,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to start test");
        return;
      }

      if (!Array.isArray(data.questions)) {
        alert("Invalid question data from server");
        return;
      }

      localStorage.setItem("mocktest_questions", JSON.stringify(data.questions || []));
      localStorage.setItem("mocktest_attemptId", data.attemptId || "");
      localStorage.setItem("mocktest_duration", data.durationMinutes.toString());

      router.push(`/mocktest/${facultySlug}/start`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GROUP SUBJECTS ================= */
  const groups = config?.subjectRules?.reduce((acc: Record<string, SubjectRule[]>, s) => {
    if (s.group) {
      acc[s.group] = acc[s.group] || [];
      acc[s.group].push(s);
    }
    return acc;
  }, {}) || {};

  const compulsorySubjects = config?.subjectRules?.filter(s => s.compulsory) || [];

  /* ================= UI ================= */

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-slate-500">Loading test configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <p className="text-red-800 font-medium mb-2">Test Not Available</p>
            <p className="text-red-600 text-sm mb-4">
              {error || "Mock test not configured for this faculty"}
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tests
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {config.faculty}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <FileQuestion className="w-4 h-4" />
              <span>{config.totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{config.durationMinutes} Minutes</span>
            </div>
          </div>
        </div>

        {/* Compulsory Subjects */}
        {compulsorySubjects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Compulsory Subjects
            </h2>
            <div className="space-y-2">
              {compulsorySubjects.map((s) => (
                <div
                  key={s.subject}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <span className="text-sm text-slate-700">{s.subject}</span>
                  <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">
                    {s.count} questions
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups */}
        {Object.entries(groups).map(([group, subjects]) => (
          <div key={group} className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              {group} (Choose one)
            </h3>
            <div className="space-y-2">
              {subjects.map((s) => {
                const isSelected = selectedGroups[group] === s.subject;
                return (
                  <button
                    key={s.subject}
                    onClick={() =>
                      setSelectedGroups((prev) => ({
                        ...prev,
                        [group]: s.subject,
                      }))
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 text-left
                      ${isSelected 
                        ? "bg-blue-50 border-blue-400" 
                        : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-700">{s.subject}</span>
                    </div>
                    <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                      {s.count} questions
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Start Button */}
        <div className="pt-6 border-t border-slate-200">
          <button
            onClick={startTest}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting Test...
              </>
            ) : (
              <>
                Start Mock Test
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">
            Make sure you have selected all required groups before starting
          </p>
        </div>
      </div>
    </div>
  );
}
import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";

export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ faculty: string }> }) {
  const { faculty } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);
  
  return {
    title: `${facultyName} Subjects | Entrance Syllabus`,
    description: `Browse all subjects and syllabus materials for ${facultyName} entrance examination. Complete curriculum guide and study resources.`,
    keywords: `${facultyName}, entrance syllabus, subjects, exam preparation, ${facultyName.toLowerCase()} entrance`,
    openGraph: {
      title: `${facultyName} Subjects | Entrance Syllabus`,
      description: `Complete entrance syllabus and subject guide for ${facultyName}`,
      type: "website",
    },
    robots: "index, follow",
  };
}

// Color palette for subjects
const subjectColors = [
  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "📖" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "📐" },
  { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "🔬" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "⚡" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: "💊" },
  { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", icon: "💻" },
  { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", icon: "📊" },
  { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", icon: "🎨" },
  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "🏗️" },
  { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", icon: "🧬" },
];

export default async function FacultyPage({ params }: { params: Promise<{ faculty: string }> }) {
  const { faculty } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);

  const res = await contentfulClient.getEntries({
    content_type: "notes",
    "fields.faculty": faculty.toLowerCase().trim(),
  });

  const notes = res.items;

  // Get unique subjects with their data
  const subjectMap = new Map();
  notes.forEach((note: any) => {
    const subject = note.fields.subject;
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, {
        name: subject,
        count: 1,
        firstNote: note,
      });
    } else {
      subjectMap.get(subject).count++;
    }
  });
  
  const subjects = Array.from(subjectMap.values());

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation Bar */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Faculties
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 text-sm font-medium text-emerald-600">
                Faculty Syllabus
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                {facultyName}
              </h1>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Select a subject to view the detailed entrance syllabus
              </p>
            </div>
            {subjects.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                  {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-5xl">📚</div>
            <h2 className="text-xl font-medium text-gray-700">No subjects found</h2>
            <p className="mt-2 text-gray-400">Syllabus content for {facultyName} is coming soon.</p>
            <Link
              href="/notes"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              ← Browse other faculties
            </Link>
          </div>
        ) : (
          <>
            {/* Search/Quick hint */}
            <div className="mb-6 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {subjects.length} subjects available
              </span>
            </div>

            {/* Subjects Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject: any, idx: number) => {
                const colors = subjectColors[idx % subjectColors.length];
                const subjectName = subject.name;
                const subjectSlug = encodeURIComponent(subjectName.toLowerCase().replace(/\s+/g, "-"));
                
                return (
                  <Link
                    key={subjectName}
                    href={`/notes/${faculty}/${subjectSlug}`}
                    className="group block transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div
                      className={`rounded-xl ${colors.bg} border ${colors.border} p-5 transition-all duration-200 group-hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{colors.icon}</div>
                          <div>
                            <h2 className={`text-lg font-semibold ${colors.text}`}>
                              {subjectName}
                            </h2>
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="text-gray-500">
                                {subject.count} note{subject.count !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-full bg-white/50 p-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <svg
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Decorative progress bar */}
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/50">
                        <div 
                          className="h-full w-0 rounded-full transition-all duration-500 group-hover:w-2/3" 
                          style={{ backgroundColor: colors.text.replace("text-", "bg-") }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="mx-auto max-w-6xl px-6">
          <p>{facultyName} Entrance Syllabus • Complete Curriculum Guide</p>
        </div>
      </footer>
    </div>
  );
}
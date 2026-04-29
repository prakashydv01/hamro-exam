import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";

export const revalidate = 60;

// Subtle color palette for faculty cards
const facultyColors = [
  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "🎓" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "📚" },
  { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "🔬" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "⚖️" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: "🩺" },
  { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", icon: "💻" },
  { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", icon: "📊" },
  { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", icon: "🎨" },
];

export default async function NotesHome() {
  const res = await contentfulClient.getEntries({
    content_type: "notes",
  });

  const notes = res.items;

  // ✅ Deduplicate faculties
  const uniqueFaculties = Array.from(
    new Map(
      notes.map((item: any) => [item.fields.faculty, item])
    ).values()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Entrance Syllabus
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Select your faculty to get started
              </p>
            </div>

            {uniqueFaculties.length > 0 && (
              <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {uniqueFaculties.length} faculties
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Faculty Cards */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {uniqueFaculties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <p className="text-gray-400">
              No faculties available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {uniqueFaculties.map((note: any, idx: number) => {
              const colors = facultyColors[idx % facultyColors.length];
              const facultyName = note.fields.faculty;
              const facultySlug = encodeURIComponent(facultyName);

              return (
                <Link
                  key={facultyName} // better key for uniqueness
                  href={`/notes/${facultySlug}`}
                  className="group block transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div
                    className={`rounded-xl ${colors.bg} border ${colors.border} p-4 transition-all duration-200 group-hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{colors.icon}</div>
                      <div className="flex-1">
                        <h2 className={`font-medium ${colors.text}`}>
                          {facultyName}
                        </h2>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                          <span>View syllabus</span>
                          <span className="transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
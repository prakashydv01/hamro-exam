import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

// Generate comprehensive metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ faculty: string }> }): Promise<Metadata> {
  const { faculty } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);
  const decodedFaculty = decodeURIComponent(facultyName);
  
  const title = `${decodedFaculty} Entrance Syllabus & Subject Guide | Complete Preparation Resources`;
  const description = `Detailed entrance syllabus and subject materials for ${decodedFaculty} examination. Access chapter-wise notes, model questions, past papers, and study guides for ${decodedFaculty} entrance preparation. Perfect for BIT, BCA, BSc.CSIT, IOE, and other Nepalese entrance exams.`;
  
  return {
    title,
    description,
    keywords: `${decodedFaculty}, ${decodedFaculty.toLowerCase()} entrance syllabus, ${decodedFaculty.toLowerCase()} subjects, entrance exam preparation, ${decodedFaculty.toLowerCase()} notes, model questions, past papers, syllabus PDF, entrance guide Nepal`,
    openGraph: {
      title: `${decodedFaculty} Entrance Syllabus | Complete Subject Guide`,
      description: `Comprehensive entrance syllabus and study materials for ${decodedFaculty}. Including chapter breakdown, important topics, and exam pattern.`,
      type: "website",
      url: `https://hamroexam.com/notes/${encodeURIComponent(decodedFaculty)}`,
      siteName: "Entrance Notes Nepal",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedFaculty} Entrance Syllabus - Full Subject List`,
      description: `Prepare for ${decodedFaculty} entrance with our detailed subject syllabus and resources.`,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: `https://hamroexam.com/notes/${encodeURIComponent(decodedFaculty)}`,
    },
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
  const decodedFaculty = decodeURIComponent(facultyName);

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

  // JSON-LD structured data for the subject listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${decodedFaculty} Entrance Syllabus Subjects`,
    "description": `Complete list of subjects for ${decodedFaculty} entrance examination with detailed notes and study materials.`,
    "url": `https://hamroexam.com/notes/${encodeURIComponent(decodedFaculty)}`,
    "numberOfItems": subjects.length,
    "itemListElement": subjects.map((subject, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": subject.name,
      "url": `https://hamroexam.com/notes/${encodeURIComponent(decodedFaculty)}/${encodeURIComponent(subject.name.toLowerCase().replace(/\s+/g, "-"))}`,
      "description": `${subject.name} syllabus and notes for ${decodedFaculty} entrance preparation. Contains ${subject.count} study resource(s).`
    })),
    "inLanguage": "en",
    "isAccessibleForFree": true,
  };

  // Prepare keywords for natural article insertion
  const facultyLower = decodedFaculty.toLowerCase();
  const isTechnical = ["bit", "bca", "bsc.csit", "ioe", "bsc csit", "bsc computer science"].includes(facultyLower);
  const isScience = ["bsc nursing", "bsc agriculture", "bsc forestry", "bsc microbiology"].includes(facultyLower);
  const isManagement = ["bba", "bbs", "bhm", "bttm"].includes(facultyLower);
  
  let facultyTypeNote = "";
  if (isTechnical) facultyTypeNote = "This technical program requires strong foundation in mathematics, logical reasoning, and core computer concepts.";
  else if (isScience) facultyTypeNote = "Science entrances test your knowledge in physics, chemistry, biology, and general awareness.";
  else if (isManagement) facultyTypeNote = "Management entrance preparation focuses on mathematics, English, business studies, and current affairs.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
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
                  {decodedFaculty} Entrance Exam Notes
                </h1>
                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Select a subject to view detailed notes
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
              <p className="mt-2 text-gray-400">Syllabus content for {decodedFaculty} is coming soon.</p>
              <Link
                href="/notes"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
              >
                ← Browse other faculties
              </Link>
            </div>
          ) : (
            <>
              {/* Quick hint */}
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
                      href={`/notes/${encodeURIComponent(decodedFaculty)}/${subjectSlug}`}
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

              {/* SEO Keywords Article - Natural sentence integration */}
              <div className="mt-20 border-t border-gray-200 pt-12">
                <article className="prose prose-gray max-w-none">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Complete {decodedFaculty} Entrance Syllabus & Subject Guide
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed">
                    The <strong>{decodedFaculty} entrance syllabus</strong> is designed to test your proficiency in core subjects essential for success in your chosen field. Our comprehensive study materials include <strong>{decodedFaculty.toLowerCase()} notes</strong> covering every chapter, <strong>model questions</strong> that simulate real exam patterns, and <strong>past papers</strong> from previous years. {facultyTypeNote} By mastering each subject listed above, you will build the confidence needed to excel in the entrance examination.
                  </p>

                  <p className="text-gray-700 leading-relaxed mt-4">
                    Each subject page contains detailed <strong>chapter-wise syllabus</strong>, important formulas, key concepts, and practice questions. For technical faculties like <strong>BIT, BCA, BSc.CSIT, and IOE</strong>, we emphasize mathematics, logical reasoning, and programming fundamentals. Science students get access to in-depth <strong>physics notes</strong>, <strong>chemistry notes</strong>, and <strong>biology notes</strong> tailored to the entrance exam pattern. Management aspirants will find comprehensive materials for business mathematics, accounting, and general knowledge.
                  </p>

                  <p className="text-gray-700 leading-relaxed mt-4">
                    Preparing for the <strong>Nepal entrance exam</strong> requires a strategic approach. Our platform offers <strong>entrance preparation tips</strong>, time management strategies, and weekly mock tests. For <strong>Pulchowk entrance</strong> or <strong>KU entrance notes</strong>, we provide specific topic breakdowns based on past trends. The <strong>IOE entrance guide</strong> includes engineering mathematics, physics, chemistry, and aptitude sections. Similarly, <strong>BSc CSIT notes Nepal</strong> focus on computer fundamentals, programming logic, and digital systems. Start your preparation today by selecting a subject and accessing free, high-quality resources.
                  </p>

                  <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      📘 What You Will Find in Each Subject
                    </h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Complete syllabus breakdown with chapter-wise weightage</li>
                      <li><strong>Entrance notes PDF</strong> for offline study and quick revision</li>
                      <li>Topic-wise <strong>entrance model questions</strong> with answer keys</li>
                      <li>Previous year question papers and solution sets</li>
                      <li>Important formulas and concept summaries</li>
                      <li>Video lecture links and recommended reference books</li>
                    </ul>
                  </div>

                  <p className="text-gray-600 text-sm mt-6 italic">
                     {decodedFaculty} entrance syllabus, {decodedFaculty.toLowerCase()} subjects, entrance exam preparation, model questions, past papers, syllabus PDF, entrance guide Nepal, BIT entrance notes, BCA entrance preparation, BSc CSIT notes Nepal, IOE entrance guide, Pulchowk entrance, KU entrance notes, engineering entrance preparation, science entrance notes, management entrance notes.
                  </p>
                </article>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
          <div className="mx-auto max-w-6xl px-6">
            <p>{decodedFaculty} Entrance Notes • Complete Subject Guide • Free Study Resources</p>
          </div>
        </footer>
      </div>
    </>
  );
}
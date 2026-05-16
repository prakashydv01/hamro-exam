import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";
import type { Metadata } from "next";

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

// Helper to fetch notes data
async function getFacultiesData() {
  const res = await contentfulClient.getEntries({
    content_type: "notes",
  });
  const notes = res.items;
  const uniqueFaculties = Array.from(
    new Map(
      notes.map((item: any) => [item.fields.faculty, item])
    ).values()
  );
  return { uniqueFaculties, totalNotes: notes.length };
}

// Dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const { uniqueFaculties, totalNotes } = await getFacultiesData();
  const facultyNames = uniqueFaculties.map((f: any) => f.fields.faculty).join(", ");
  
  const title = "Entrance Preparation Notes for BIT, BCA, BSc.CSIT, IOE | Nepal Entrance Exam Resources";
  const description = `Access comprehensive entrance notes and preparation materials for ${facultyNames || "BIT, BCA, BSc.CSIT, IOE"}. Download PDFs, syllabus, model questions, and study guides for Nepal's entrance examinations. ${totalNotes}+ study resources available.`;
  
  const keywords = [
    "entrance preparation notes",
    "BIT entrance notes",
    "BCA entrance preparation",
    "BSc CSIT notes Nepal",
    "IOE entrance guide",
    "Nepal entrance exam",
    "engineering entrance preparation",
    "science entrance notes",
    "IT entrance syllabus",
    "entrance model questions",
    "Pulchowk entrance",
    "KU entrance notes",
    "Pokhara University entrance",
    "Purbanchal University entrance",
    "entrance exam tips Nepal"
  ].join(", ");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: "Entrance Preparation Notes for Nepal's Top Faculties",
      description: `Comprehensive study materials for ${facultyNames}. Free entrance notes for BIT, BCA, BSc.CSIT, IOE and more.`,
      type: "website",
      url: "https://hamroexam.com/notes",
      siteName: "Entrance Notes Nepal",
    },
    twitter: {
      card: "summary_large_image",
      title: "Entrance Preparation Notes for BIT, BCA, BSc.CSIT, IOE",
      description: `Free study resources for ${facultyNames}. Get entrance notes, syllabus & model questions.`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://hamroexam.com/notes",
    },
  };
}

export default async function NotesHome() {
  const { uniqueFaculties, totalNotes } = await getFacultiesData();

  // Structured data (unchanged)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Entrance Preparation Notes",
    "description": "Comprehensive entrance notes and study materials for various faculties in Nepal",
    "url": "https://hamroexam.com/notes",
    "numberOfItems": totalNotes,
    "about": uniqueFaculties.map((faculty: any) => ({
      "@type": "EducationalOccupationalProgram",
      "name": `${faculty.fields.faculty} Entrance Preparation`,
      "educationalLevel": "Bachelor's Level Entrance",
      "teaches": "Entrance Examination Subjects",
      "offers": {
        "@type": "Offer",
        "category": "Study Material",
        "availability": "https://schema.org/OnlineOnly"
      }
    })),
    "inLanguage": "en",
    "isAccessibleForFree": true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Entrance Preparation Notes
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Select your faculty to access comprehensive study materials, syllabus, and model questions
                </p>
              </div>
              {uniqueFaculties.length > 0 && (
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {uniqueFaculties.length} faculties • {totalNotes} resources
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Faculty Cards - Square shape */}
        <div className="mx-auto max-w-6xl px-6 py-8">
          {uniqueFaculties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-5xl">📭</div>
              <p className="text-gray-400">
                No faculties available at the moment. Check back soon for entrance notes!
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {uniqueFaculties.map((note: any, idx: number) => {
                  const colors = facultyColors[idx % facultyColors.length];
                  const facultyName = note.fields.faculty;
                  const facultySlug = encodeURIComponent(facultyName);

                  return (
                    <Link
                      key={facultyName}
                      href={`/notes/${facultySlug}`}
                      className="group block"
                      aria-label={`View entrance notes and syllabus for ${facultyName}`}
                    >
                      {/* Square card using aspect-square */}
                      <div
                        className={`rounded-xl ${colors.bg} border ${colors.border} p-5 transition-all duration-200 group-hover:shadow-md flex flex-col items-center justify-center text-center aspect-square`}
                      >
                        <div className="text-4xl mb-3">{colors.icon}</div>
                        <h2 className={`font-semibold text-lg ${colors.text} mb-1`}>
                          {facultyName}
                        </h2>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                          <span>View notes</span>
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* SEO Keywords Article - Natural sentence-based integration */}
              <div className="mt-20 border-t border-gray-200 pt-12">
                <article className="prose prose-gray max-w-none">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Complete Entrance Preparation Guide for Nepal's Top Faculties
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Preparing for competitive entrance exams in Nepal requires reliable and comprehensive 
                    <strong> entrance preparation notes</strong>. Whether you aim for <strong>BIT entrance notes</strong> 
                    or need specialised <strong>BCA entrance preparation</strong> materials, our platform offers 
                    curated resources tailored to your faculty. Students pursuing <strong>BSc CSIT notes Nepal</strong> 
                    will find detailed chapter-wise summaries, while aspirants of engineering can access the complete 
                    <strong> IOE entrance guide</strong> covering physics, chemistry, mathematics, and reasoning.
                  </p>

                  <p className="text-gray-700 leading-relaxed mt-4">
                    The <strong>Nepal entrance exam</strong> landscape includes multiple universities such as Tribhuvan 
                    University, Kathmandu University, Pokhara University, and Purbanchal University. Each has its own 
                    pattern and syllabus. Our <strong>engineering entrance preparation</strong> section covers Pulchowk 
                    Campus, IOE affiliated colleges, and KU School of Engineering. For <strong>science entrance notes</strong>, 
                    we provide detailed materials for BSc Nursing, BSc Agriculture, BSc Forestry, and other pure science 
                    programs. The <strong>IT entrance syllabus</strong> is meticulously broken down for BIT and BSc.CSIT 
                    aspirants, including model questions and past papers.
                  </p>

                  <p className="text-gray-700 leading-relaxed mt-4">
                    To excel in entrance exams, you need more than just notes – you need a strategy. Access 
                    <strong> entrance model questions</strong> that mimic real exam patterns, 
                    <strong> Pulchowk entrance</strong> specific guides, and <strong>TU entrance notes</strong> 
                    that highlight frequently tested topics. For management and humanities, we offer BBA entrance 
                    guides, BHM study materials, and LLB entrance notes. Every resource is designed to help you 
                    master concepts, improve speed, and build confidence. Start your preparation today with 
                    our free, high-quality study materials.
                  </p>

                  <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      🎯 Why Our Entrance Notes Stand Out
                    </h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Faculty-specific Notes breakdowns (BIT, BCA, BSc.CSIT, IOE)</li>
                     
                      <li>Chapter-wise <strong>physics notes</strong>, <strong>chemistry notes</strong>, <strong>math notes</strong></li>
                      <li><strong>Computer notes</strong> for IT entrance and <strong>English notes</strong> for Grammer sections</li>
                      <li>Weekly updated <strong>entrance tips</strong> and exam strategies from toppers</li>
                      <li><strong>Formula sheets</strong>, <strong>cheat sheets</strong>, and quick revision guides</li>
                    </ul>
                  </div>

                  <p className="text-gray-600 text-sm mt-6 italic">
                    entrance preparation notes, BIT entrance notes, BCA entrance preparation, BSc CSIT notes Nepal, 
                    IOE entrance guide, Nepal entrance exam, engineering entrance preparation, science entrance notes, 
                    IT entrance syllabus, entrance model questions, Pulchowk entrance, KU entrance notes, Pokhara University 
                    entrance, Purbanchal University entrance, entrance exam tips Nepal, physics notes, chemistry notes, 
                    math notes, biology notes, computer notes, entrance notes PDF.
                  </p>
                </article>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
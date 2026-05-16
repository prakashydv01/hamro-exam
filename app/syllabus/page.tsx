import Link from "next/link";
import { contentfulClient } from "@/lib/contentful";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

// Fetch faculties from Contentful (syllabus content type)
async function getSyllabusFaculties() {
  const response = await contentfulClient.getEntries({
    content_type: "syllabus",
    select: ["fields.faculty", "fields.slug"],
  });
  return response.items;
}

// Dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const syllabusList = await getSyllabusFaculties();
  const faculties = syllabusList.map((item: any) => item.fields.faculty).join(", ");
  
  const title = "Entrance Syllabus for BIT, BCA, BSc.CSIT, IOE & More | Nepal Faculty Syllabus";
  const description = `Complete entrance syllabus for ${faculties || "BIT, BCA, BSc.CSIT, IOE, Management, Science, Humanities"}. Detailed course structure, subjects, marking scheme, and exam patterns for Nepal's top faculties. Download syllabus PDFs and prepare effectively.`;
  
  return {
    title,
    description,
    keywords: "entrance syllabus, BIT syllabus, BCA syllabus, BSc CSIT syllabus, IOE syllabus, Nepal entrance syllabus, faculty syllabus, course structure, marking scheme, exam pattern, syllabus PDF, Pulchowk syllabus, KU syllabus",
    openGraph: {
      title: "Complete Entrance Syllabus for Nepal Faculties | BIT, BCA, CSIT, IOE",
      description: "Access detailed syllabus for all major faculties. Updated regularly with official course structures and subject breakdowns.",
      type: "website",
      url: "https://hamroexam.com/syllabus",
      siteName: "Entrance Syllabus Nepal",
    },
    twitter: {
      card: "summary_large_image",
      title: "Nepal Entrance Syllabus – All Faculties",
      description: "Free syllabus guides for BIT, BCA, BSc.CSIT, IOE and more. Download PDFs and plan your preparation.",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://hamroexam.com/syllabus",
    },
  };
}

export default async function SyllabusPage() {
  const syllabusList = await getSyllabusFaculties();

  // JSON-LD structured data for the syllabus listing
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Entrance Syllabus for Nepal Faculties",
    "description": "Comprehensive syllabus listing for undergraduate entrance examinations in Nepal.",
    "url": "https://hamroexam.com/syllabus",
    "numberOfItems": syllabusList.length,
    "itemListElement": syllabusList.map((item: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": `${item.fields.faculty} Syllabus`,
      "url": `https://hamroexam.com/syllabus/${item.fields.slug}`,
      "description": `Complete entrance syllabus, subjects, and marking scheme for ${item.fields.faculty}.`
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
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* White Header (instead of blue hero) */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Academic Resources
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Entrance Syllabus
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Select your faculty to view detailed syllabus, subjects, and exam patterns.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          {/* Stats Bar (white version) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  <span className="font-semibold text-gray-900">{syllabusList.length}</span>{" "}
                  Faculties Available
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Updated regularly • Last sync: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Faculty Grid – moved up (already prominent) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {syllabusList.map((item: any, index: number) => {
              const faculty = item.fields.faculty;
              const slug = item.fields.slug;

              return (
                <Link
                  key={slug}
                  href={`/syllabus/${slug}`}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-6 h-6 text-blue-700" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                      {faculty}
                    </h2>
                    
                    <p className="text-gray-500 text-sm mb-4">
                      View complete syllabus, subjects, and marking scheme
                    </p>
                    
                    <div className="flex items-center text-sm text-blue-600 font-medium">
                      <span>Browse syllabus</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>

                  {/* Decorative Bottom Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {syllabusList.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No syllabus available
              </h3>
              <p className="text-gray-500">
                Syllabus information will be added soon.
              </p>
            </div>
          )}

          {/* SEO Article – natural keyword integration for syllabus */}
          <div className="mt-20 pt-8 border-t border-gray-200">
            <article className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Complete Syllabus Guide for Nepal's Entrance Examinations
              </h2>
              
              <p className="text-gray-700 leading-relaxed">
                Understanding the <strong>entrance syllabus</strong> is the first step toward successful exam preparation. Our platform provides the most up‑to‑date <strong>BIT syllabus</strong>, <strong>BCA syllabus</strong>, <strong>BSc CSIT syllabus</strong>, and <strong>IOE syllabus</strong> for all major universities in Nepal. Whether you are targeting Pulchowk Campus, Kathmandu University, Pokhara University, or Purbanchal University, you will find the exact <strong>course structure</strong>, <strong>subject breakdown</strong>, and <strong>marking scheme</strong> for each faculty.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                Each syllabus page includes detailed information on <strong>semester‑wise subjects</strong>, credit hours, practical exams, and internal assessment patterns. For engineering aspirants, the <strong>IOE syllabus</strong> covers mathematics, physics, chemistry, and engineering drawing. The <strong>BSc CSIT syllabus</strong> focuses on programming, digital logic, mathematics, and computer fundamentals. Management students can access <strong>BBA syllabus</strong> and <strong>BBS syllabus</strong> with complete subject lists. Similarly, science faculties like <strong>BSc Nursing</strong>, <strong>BSc Agriculture</strong>, and <strong>BSc Forestry</strong> have their own dedicated syllabus pages.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                Use these syllabus guides to plan your study schedule, identify important topics, and download <strong>syllabus PDFs</strong> for offline reference. The <strong>entrance exam pattern</strong> and <strong>marking scheme</strong> are also explained to help you understand weightage and question types. Bookmark this page to stay updated with the latest curriculum changes. For detailed subject‑wise notes and model questions, visit our <Link href="/notes" className="text-blue-600 hover:underline">entrance notes section</Link>.
              </p>

              <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-2">📌 Syllabus Coverage</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-gray-600 text-sm">
                  <li>BIT • BCA • BSc.CSIT • IOE (Engineering)</li>
                  <li>BBA • BBS • BHM • BTTM (Management)</li>
                  <li>BSc Nursing • BSc Agriculture • BSc Forestry</li>
                  <li>BA • BEd • LLB (Humanities & Law)</li>
                  <li>BSc Microbiology • BSc Environmental Science</li>
                </ul>
              </div>

              <p className="text-gray-500 text-sm mt-6 italic">
                Keywords: entrance syllabus, BIT syllabus, BCA syllabus, BSc CSIT syllabus, IOE syllabus, Nepal entrance syllabus, faculty syllabus, course structure, marking scheme, syllabus PDF, Pulchwok syllabus, KU syllabus, Pokhara University syllabus, Purbanchal University syllabus.
              </p>
            </article>
          </div>

          {/* Help Section – now white background (changed from blue) */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Need help choosing your faculty?
              </h3>
              <p className="text-gray-600 text-sm">
                Contact our academic counselors for guidance on course selection and syllabus details.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
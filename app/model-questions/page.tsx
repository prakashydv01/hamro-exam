import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

// Helper to fetch faculty data for metadata
async function getFacultiesData() {
  const res = await contentfulClient.getEntries({
    content_type: "modelQuestions",
  });

  const facultyMap = new Map();
  res.items.forEach((item: any) => {
    const faculty = item.fields.faculty;
    if (facultyMap.has(faculty)) {
      facultyMap.set(faculty, facultyMap.get(faculty) + 1);
    } else {
      facultyMap.set(faculty, 1);
    }
  });

  const faculties = Array.from(facultyMap.entries()).map(([name, count]) => ({
    name,
    count,
    slug: name.toLowerCase().trim(),
  }));
  faculties.sort((a, b) => a.name.localeCompare(b.name));

  return { faculties, totalQuestions: res.items.length };
}

// ✅ Dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const { faculties, totalQuestions } = await getFacultiesData();
  const facultyNames = faculties.map(f => f.name).join(", ");
  
  const title = "Model Questions for BIT, BCA, BSc.CSIT, IOE & More | Entrance Exam Practice";
  const description = `Access comprehensive model questions for ${facultyNames || "all faculties"}. Download PDFs, practice with answers, and prepare effectively for Nepal's entrance exams. ${totalQuestions}+ questions available.`;
  
  return {
    title,
    description,
    keywords: "model questions, entrance model questions, BIT model questions, BCA model questions, BSc CSIT model questions, IOE model questions, practice papers, exam preparation, Nepal entrance exam, model question PDF, past papers, sample questions",
    openGraph: {
      title: "Model Questions for All Faculties | Entrance Exam Hub",
      description: `Free model questions for ${facultyNames}. Practice with real exam patterns and download PDFs.`,
      type: "website",
      url: "https://yourdomain.com/model-questions",
      siteName: "Model Questions Nepal",
    },
    twitter: {
      card: "summary_large_image",
      title: "Model Questions – Entrance Preparation",
      description: `Practice with ${totalQuestions}+ model questions across ${faculties.length} faculties.`,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: "https://yourdomain.com/model-questions",
    },
  };
}

export default async function MQHome() {
  const { faculties, totalQuestions } = await getFacultiesData();

  // JSON-LD structured data for the collection page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Model Questions for Entrance Examinations",
    "description": "Collection of model questions for various faculties in Nepal.",
    "url": "https://yourdomain.com/model-questions",
    "numberOfItems": totalQuestions,
    "itemListElement": faculties.map((faculty, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": `${faculty.name} Model Questions`,
      "url": `https://yourdomain.com/model-questions/${faculty.slug}`,
      "description": `${faculty.count} model question(s) for ${faculty.name} entrance preparation.`
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section (kept blue as per original, but improved accessibility) */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm font-medium">Exam Preparation Resources</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Model Questions Hub
              </h1>
              
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Practice with the most comprehensive collection of model questions for BIT, BCA, BSc.CSIT, IOE, and all major faculties in Nepal.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{totalQuestions}+ Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{faculties.length} Faculties</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>PDF & Rich Content</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Browse Model Questions by Faculty
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your faculty to access specialized model questions, practice papers, and exam preparation materials.
            </p>
            <div className="h-1 w-20 bg-blue-500 mx-auto mt-4 rounded"></div>
          </div>

          {/* Faculties Grid - Prominent Cards */}
          {faculties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600">No model questions available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculties.map((faculty) => (
                <Link
                  key={faculty.name}
                  href={`/model-questions/${faculty.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                    <div className="p-6">
                      {/* Dynamic Icon */}
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                        <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {faculty.name.toLowerCase().includes('science') ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          ) : faculty.name.toLowerCase().includes('management') ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          )}
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {faculty.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {faculty.count} question{faculty.count !== 1 ? 's' : ''} available
                      </p>
                      
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                        <span>Browse Questions</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* SEO-Rich Article Section */}
          <div className="mt-20 pt-8 border-t border-gray-200">
            <article className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Why Practice Model Questions for Entrance Exams?
              </h2>
              
              <p className="text-gray-700 leading-relaxed">
                Solving <strong>model questions</strong> is one of the most effective ways to prepare for competitive entrance exams like <strong>BIT, BCA, BSc.CSIT, and IOE</strong>. Our platform offers faculty-specific <strong>entrance model questions</strong> that mirror the real exam pattern, helping you identify weak areas, improve time management, and build confidence. Each set includes detailed answers and explanations, making it a complete <strong>exam preparation</strong> resource.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                For <strong>BIT model questions</strong>, we cover programming fundamentals, mathematics, logical reasoning, and general IT concepts. <strong>BCA model questions</strong> focus on computer applications, business systems, and quantitative aptitude. <strong>BSc CSIT model questions</strong> include digital logic, programming, and discrete mathematics. Meanwhile, <strong>IOE model questions</strong> provide rigorous practice in engineering mathematics, physics, chemistry, and drawing. We also offer materials for management, science, and humanities faculties.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                All questions are curated based on past entrance exams from Tribhuvan University, Kathmandu University, Pokhara University, and Purbanchal University. You can download <strong>model question PDFs</strong> for offline practice and revisit them anytime. Regular updates ensure you always have access to the latest <strong>practice papers</strong> and <strong>sample questions</strong>. Start practicing today and take a step closer to securing your seat in Nepal's top colleges.
              </p>

              <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-md font-semibold text-blue-800 mb-2">📘 What You Get</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Faculty-wise model questions with answer keys</li>
                  <li>Real exam pattern and marking scheme</li>
                  <li>PDF downloads for all question sets</li>
                  <li>Regular updates with new questions</li>
                  <li>Free access – no registration required</li>
                </ul>
              </div>

              <p className="text-gray-500 text-sm mt-6 italic">
                model questions, entrance model questions, BIT model questions, BCA model questions, BSc CSIT model questions, IOE model questions, practice papers, exam preparation, Nepal entrance exam, model question PDF, past papers, sample questions, engineering entrance, science entrance, management entrance.
              </p>
            </article>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Download PDFs</h3>
              <p className="text-gray-600 text-sm">Access model questions in PDF format for offline study and printing.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Detailed Answers</h3>
              <p className="text-gray-600 text-sm">Each question comes with step-by-step solutions and explanations.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Regular Updates</h3>
              <p className="text-gray-600 text-sm">New questions added weekly based on latest exam trends.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Need help finding something? <Link href="/contact" className="text-blue-600 hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

// Helper to fetch faculty data for metadata (avoids duplicate fetch)
async function getFacultyQuestions(facultySlug: string) {
  const res = await contentfulClient.getEntries({
    content_type: "modelQuestions",
    "fields.faculty": facultySlug.toLowerCase().trim(),
  });
  return res.items;
}

// Generate dynamic metadata with full SEO
export async function generateMetadata({ params }: { params: Promise<{ faculty: string }> }): Promise<Metadata> {
  const { faculty } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);
  const items = await getFacultyQuestions(faculty);
  const totalQuestions = items.length;
  
  const title = `${facultyName} Model Questions | Entrance Exam Practice Papers | ${totalQuestions}+ Questions`;
  const description = `Access ${totalQuestions} ${facultyName} model questions for entrance exam preparation. Download PDFs, practice with detailed answers, and improve your score. Includes BIT, BCA, BSc.CSIT, IOE style questions.`;
  
  return {
    title,
    description,
    keywords: `${facultyName} model questions, ${facultyName} practice papers, ${facultyName} entrance exam, ${facultyName} mock test, ${facultyName} questions and answers, Nepal entrance preparation`,
    openGraph: {
      title: `${facultyName} Model Questions – Practice for Entrance Exams`,
      description: `Free ${facultyName} model questions with PDF downloads. Perfect for BIT, BCA, BSc.CSIT, IOE entrance prep.`,
      type: "website",
      url: `https://yourdomain.com/model-questions/${faculty}`,
      siteName: "Entrance Hub",
    },
    twitter: {
      card: "summary_large_image",
      title: `${facultyName} Model Questions | Practice Online`,
      description: `Get ${totalQuestions}+ ${facultyName} questions with solutions.`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://yourdomain.com/model-questions/${faculty}`,
    },
  };
}

export default async function FacultyMQ({ params }: { params: Promise<{ faculty: string }> }) {
  const { faculty } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);
  const items = await getFacultyQuestions(faculty);

  // Prepare structured data (ItemList for questions)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${facultyName} Model Questions`,
    "description": `List of model questions for ${facultyName} entrance examination.`,
    "numberOfItems": items.length,
    "itemListElement": items.map((item: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.fields.title,
      "url": `https://yourdomain.com/model-questions/${faculty}/${item.fields.slug}`,
      "description": item.fields.description || `${facultyName} practice question ${idx + 1}`,
    })),
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourdomain.com/" },
      { "@type": "ListItem", "position": 2, "name": "Model Questions", "item": "https://yourdomain.com/model-questions" },
      { "@type": "ListItem", "position": 3, "name": facultyName, "item": `https://yourdomain.com/model-questions/${faculty}` },
    ],
  };

  if (!items.length) {
    return <NotFound faculty={facultyName} />;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* SEO Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
              <li><span className="mx-1">/</span></li>
              <li><Link href="/model-questions" className="hover:text-gray-700">Model Questions</Link></li>
              <li><span className="mx-1">/</span></li>
              <li className="text-gray-700 font-medium" aria-current="page">{facultyName}</li>
            </ol>
          </nav>

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {facultyName} Model Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Practice with our comprehensive collection of {facultyName.toLowerCase()} model questions for entrance exams like BIT, BCA, BSc.CSIT, IOE.
            </p>
            <div className="h-1 w-20 bg-blue-500 mt-4 rounded"></div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-bold text-gray-900">{items.length}</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Visible SEO Keywords Row (top) */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{facultyName} exam prep</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{facultyName} practice questions</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{facultyName} past papers</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{facultyName} mock test</span>
          </div>

          {/* Questions Grid */}
          <div className="grid gap-4">
            {items.map((item: any, index: number) => (
              <Link
                key={item.sys.id}
                href={`/model-questions/${faculty}/${item.fields.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-blue-500 font-bold text-sm bg-blue-50 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          {item.fields.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              String(item.fields.difficulty) === 'Easy' ? 'bg-green-100 text-green-700' :
                              String(item.fields.difficulty) === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {String(item.fields.difficulty)}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                          {String(item.fields.title)}
                        </h2>
                        {item.fields.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {String(item.fields.description)}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          {item.fields.pdf && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              PDF Available
                            </span>
                          )}
                          {item.fields.content && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                              Rich Content
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* SEO Article Section – natural keyword integration */}
          <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Why Practice {facultyName} Model Questions?</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>
                Preparing for <strong>{facultyName} entrance exams</strong> requires consistent practice with high‑quality <strong>model questions</strong>. Our curated collection mirrors the actual exam pattern, helping you master time management and identify weak areas. Each question is designed by subject experts to cover the complete <strong>syllabus</strong> of popular Nepalese entrance tests like <strong>BIT, BCA, BSc.CSIT, and IOE</strong>.
              </p>
              <p className="mt-2">
                Use these <strong>practice papers</strong> to simulate real exam conditions. Many questions include <strong>PDFs</strong> and <strong>detailed explanations</strong> so you can learn from mistakes. Bookmark this page and revisit regularly – new questions are added weekly. For more resources, explore our <Link href="/notes" className="text-blue-600 hover:underline">entrance notes</Link> and <Link href="/syllabus" className="text-blue-600 hover:underline">syllabus guides</Link>.
              </p>
            </div>
            {/* Hidden SEO keywords for additional density */}
            <div className="sr-only">
              {facultyName} model questions, {facultyName} entrance preparation, practice papers Nepal, BIT BCA CSIT IOE questions, free download PDF, exam tips.
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Need more practice materials?</p>
            <Link 
              href="/model-questions"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse all faculties
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// NotFound component (unchanged but enhanced with keyword)
function NotFound({ faculty }: { faculty: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          No Questions Found
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't find any model questions for {faculty}. 
          Check back later or explore other faculties like BIT, BCA, BSc.CSIT, or IOE.
        </p>
        <Link
          href="/model-questions"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium"
        >
          Browse All Faculties
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
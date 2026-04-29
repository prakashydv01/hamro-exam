import { contentfulClient } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Custom function to render rich text with preserved line breaks
const renderRichText = (content: any) => {
  if (!content) return null;

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => (
        <strong className="font-bold text-gray-900">{text}</strong>
      ),
      [MARKS.ITALIC]: (text: React.ReactNode) => (
        <em className="italic text-gray-700">{text}</em>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => {
        // Get the text content
        const textContent = node.content?.[0]?.value || "";
        // Check if it contains specific formatting patterns
        const hasLineBreaks = textContent.includes('\n');
        
        return (
          <div className="mb-4 leading-relaxed text-gray-600 whitespace-pre-line">
            {children}
          </div>
        );
      },
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-600">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-600">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li className="mb-1">{children}</li>
      ),
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { uri } = node.data;
        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            {children}
          </a>
        );
      },
    },
  };

  return documentToReactComponents(content, options);
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ faculty: string; subject: string }> }) {
  const { faculty, subject } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);
  const subjectName = subject.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

  return {
    title: `${subjectName} Syllabus | ${facultyName} Entrance`,
    description: `Complete ${subjectName} syllabus for ${facultyName} entrance examination.`,
    robots: "index, follow",
  };
}

export default async function SubjectNote({ params }: { params: Promise<{ faculty: string; subject: string }> }) {
  const { faculty, subject } = await params;
  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);
  const subjectName = subject.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

  const res = await contentfulClient.getEntries({
    content_type: "notes",
    "fields.faculty": faculty.toLowerCase().trim(),
    "fields.subject": subjectName,
    limit: 1,
  });

  const note = res.items[0];

  if (!note) {
    notFound();
  }

  const title = note.fields.title as string;
  const content = note.fields.content; // This is your existing rich text field
  const updatedAt = note.sys.updatedAt;

  console.log("Content:", content); // Debug: Check if content exists

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/notes/${faculty}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Subjects
            </Link>
            <Link
              href="/notes"
              className="text-sm text-gray-400 transition-colors hover:text-gray-600"
            >
              All Faculties
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
              {facultyName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
              {subjectName}
            </span>
            {updatedAt && (
              <>
                <span>•</span>
                <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="prose prose-gray max-w-none">
            <style>{`
              .prose {
                color: #374151;
                line-height: 1.7;
              }
              .prose h1 {
                font-size: 1.75rem;
                font-weight: 700;
                margin-top: 2rem;
                margin-bottom: 1rem;
                color: #111827;
              }
              .prose h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-top: 1.75rem;
                margin-bottom: 0.75rem;
                color: #1f2937;
              }
              .prose h3 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 0.5rem;
                color: #374151;
              }
              .prose p {
                margin-bottom: 1rem;
                line-height: 1.7;
                color: #4b5563;
                white-space: pre-wrap;
              }
              .prose strong {
                color: #111827;
                font-weight: 600;
              }
              .prose ul, .prose ol {
                margin-top: 0.75rem;
                margin-bottom: 1rem;
                padding-left: 1.75rem;
              }
              .prose li {
                margin-bottom: 0.25rem;
              }
              .prose li::marker {
                color: #059669;
              }
            `}</style>
            {content ? renderRichText(content) : (
              <p className="text-gray-500">No content available.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <Link
            href={`/notes/${faculty}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All {facultyName} Subjects
          </Link>
        </div>
      </div>
    </div>
  );
}
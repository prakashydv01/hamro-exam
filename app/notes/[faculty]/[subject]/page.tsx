import { contentfulClient } from "@/lib/contentful";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import {
  MathJax,
  MathJaxContext,
} from "better-react-mathjax";

export const revalidate = 60;

// MathJax Config
const mathJaxConfig = {
  loader: {
    load: ["[tex]/ams"],
  },
  tex: {
    packages: { "[+]": ["ams"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
  },
};

// ---------------------------------------------------------------------------
// JSON content schema (same shape you'd get from Rich Text, just stored as a
// plain JSON field now):
//
// { nodeType: "document", content: Node[] }
//
// Node:
//  - block: { nodeType: "heading-1" | "heading-2" | "heading-3" | "paragraph"
//             | "unordered-list" | "ordered-list" | "list-item" | "hr"
//             | "table" | "table-row" | "table-cell" | "table-header-cell",
//             content: Node[] }
//  - text:  { nodeType: "text", value: string, marks?: { type: string }[] }
// ---------------------------------------------------------------------------

type JsonNode = {
  nodeType: string;
  value?: string;
  marks?: { type: string }[];
  content?: JsonNode[];
};

// Wraps any plain string in MathJax so $...$ / $$...$$ inside it typesets.
const renderLatexText = (text: string, key: React.Key) => {
  if (!text) return null;
  return (
    <MathJax key={key} inline dynamic>
      {text}
    </MathJax>
  );
};

// Renders a "text" leaf node, applying bold/italic marks around the
// MathJax-wrapped text.
function renderTextNode(node: JsonNode, key: React.Key): React.ReactNode {
  let rendered: React.ReactNode = renderLatexText(node.value ?? "", `${key}-t`);

  const marks = node.marks ?? [];
  if (marks.some((m) => m.type === "bold")) {
    rendered = (
      <strong key={`${key}-b`} className="font-bold text-gray-900">
        {rendered}
      </strong>
    );
  }
  if (marks.some((m) => m.type === "italic")) {
    rendered = (
      <em key={`${key}-i`} className="italic text-gray-700">
        {rendered}
      </em>
    );
  }
  if (marks.some((m) => m.type === "underline")) {
    rendered = (
      <span key={`${key}-u`} className="underline">
        {rendered}
      </span>
    );
  }

  return rendered;
}

// Renders a list of child nodes, giving each a stable key.
function renderChildren(nodes: JsonNode[] | undefined, keyPrefix: string): React.ReactNode[] {
  if (!nodes) return [];
  return nodes.map((child, i) => renderNode(child, `${keyPrefix}-${i}`));
}

// Core recursive renderer — the JSON-field equivalent of documentToReactComponents.
function renderNode(node: JsonNode, key: React.Key): React.ReactNode {
  switch (node.nodeType) {
    case "document":
      return <React.Fragment key={key}>{renderChildren(node.content, `${key}`)}</React.Fragment>;

    case "text":
      return renderTextNode(node, key);

    case "paragraph":
      return (
        <div key={key} className="mb-4 leading-relaxed text-gray-600 whitespace-pre-wrap break-words">
          {renderChildren(node.content, `${key}`)}
        </div>
      );

    case "heading-1":
      return (
        <h1 key={key} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
          {renderChildren(node.content, `${key}`)}
        </h1>
      );

    case "heading-2":
      return (
        <h2 key={key} className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          {renderChildren(node.content, `${key}`)}
        </h2>
      );

    case "heading-3":
      return (
        <h3 key={key} className="text-xl font-semibold mt-5 mb-2 text-gray-800">
          {renderChildren(node.content, `${key}`)}
        </h3>
      );

    case "unordered-list":
      return (
        <ul key={key} className="list-disc pl-6 mb-4 space-y-1 text-gray-600">
          {renderChildren(node.content, `${key}`)}
        </ul>
      );

    case "ordered-list":
      return (
        <ol key={key} className="list-decimal pl-6 mb-4 space-y-1 text-gray-600">
          {renderChildren(node.content, `${key}`)}
        </ol>
      );

    case "list-item":
      return (
        <li key={key} className="mb-1">
          {renderChildren(node.content, `${key}`)}
        </li>
      );

    case "hr":
      return <hr key={key} className="my-6 border-gray-200" />;

    case "table":
      return (
        <div key={key} className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <tbody>{renderChildren(node.content, `${key}`)}</tbody>
          </table>
        </div>
      );

    case "table-row":
      return (
        <tr key={key} className="border-b border-gray-200 even:bg-gray-50">
          {renderChildren(node.content, `${key}`)}
        </tr>
      );

    case "table-header-cell":
      return (
        <th
          key={key}
          className="border border-gray-200 bg-gray-800 px-3 py-2 text-left font-semibold text-white"
        >
          {renderChildren(node.content, `${key}`)}
        </th>
      );

    case "table-cell":
      return (
        <td key={key} className="border border-gray-200 px-3 py-2 align-top">
          {renderChildren(node.content, `${key}`)}
        </td>
      );

    default:
      // Unknown node type — render children defensively so nothing silently vanishes.
      return <React.Fragment key={key}>{renderChildren(node.content, `${key}`)}</React.Fragment>;
  }
}

// Entry point: accepts the raw JSON field value (object, or a JSON string —
// handled defensively in case it ever comes back unparsed).
function renderJsonContent(content: unknown): React.ReactNode {
  if (!content) return null;

  let parsed: JsonNode;
  if (typeof content === "string") {
    try {
      parsed = JSON.parse(content);
    } catch {
      // Not valid JSON — show it as plain (MathJax-wrapped) text instead of crashing.
      return renderLatexText(content, "raw");
    }
  } else {
    parsed = content as JsonNode;
  }

  return renderNode(parsed, "root");
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{
    faculty: string;
    subject: string;
  }>;
}) {
  const { faculty, subject } = await params;

  const facultyName = faculty.charAt(0).toUpperCase() + faculty.slice(1);

  const subjectName = subject
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  return {
    title: `${subjectName} Syllabus | ${facultyName} Entrance`,
    description: `Complete ${subjectName} syllabus for ${facultyName} entrance examination.`,
    robots: "index, follow",
  };
}

export default async function SubjectNote({
  params,
}: {
  params: Promise<{
    faculty: string;
    subject: string;
  }>;
}) {
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
  const content = note.fields.content; // now a plain JSON field
  const updatedAt = note.sys.updatedAt;

  return (
    <MathJaxContext config={mathJaxConfig}>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
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
                  line-height: 1.8;
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
                  line-height: 1.8;
                  color: #4b5563;
                  white-space: pre-wrap;
                }

                .prose strong {
                  color: #111827;
                  font-weight: 600;
                }

                .prose ul,
                .prose ol {
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

                mjx-container {
                  overflow-x: auto;
                  overflow-y: hidden;
                  padding: 0.25rem 0;
                }
              `}</style>

              {content ? (
                renderJsonContent(content)
              ) : (
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              All {facultyName} Subjects
            </Link>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}
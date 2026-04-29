import { contentfulClient } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";

type MQPageParams = {
  params: {
    faculty: string;
    slug: string;
  };
};

export const revalidate = 60;

// ✅ SEO: Generate metadata dynamically
export async function generateMetadata({ params }: MQPageParams) {
  const { slug } =  params;
  
  const res = await contentfulClient.getEntries({
    content_type: "modelQuestions",
    "fields.slug": slug,
    limit: 1,
  });

  const data = res.items?.[0];
  const title = data?.fields?.title || "Model Question";

  return {
    title: `${title} | Model Questions`,
    description: `Download and view ${title} - Model questions for exam preparation`,
    openGraph: {
      title: `${title} | Model Questions`,
      description: `Access ${title} model questions with PDF download`,
      type: "article",
    },
  };
}

export default async function MQDetail({ params }: MQPageParams) {
  const { slug } = params;

  const res = await contentfulClient.getEntries({
    content_type: "modelQuestions",
    "fields.slug": slug,
    include: 1, // ✅ important for linked assets (PDF)
    limit: 1,
  });

  const data = res.items?.[0];

  if (!data) {
    return <NotFound />;
  }

  const { title, content, pdf } = data.fields;
  const titleStr = typeof title === 'string' ? title : 'Model Question';

  // ✅ Safe PDF URL extraction
  const pdfUrl = pdf && typeof pdf === 'object' && 'fields' in pdf && pdf.fields && typeof pdf.fields === 'object' && 'file' in pdf.fields && pdf.fields.file && typeof pdf.fields.file === 'object' && 'url' in pdf.fields.file && pdf.fields.file.url
    ? `https:${pdf.fields.file.url}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ✅ SEO: Breadcrumb for better structure */}
        <div className="text-sm text-gray-500 mb-4">
          <span>Home</span> <span className="mx-2">/</span> 
          <span>Model Questions</span> <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{titleStr}</span>
        </div>

        {/* Title - More prominent */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500 inline-block">
          {titleStr}
        </h1>

        {/* ✅ PDF Section - Enhanced Design */}
        {pdfUrl && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-white font-semibold text-lg">📄 Document Available</h2>
                  <p className="text-blue-100 text-sm">Download PDF for offline access</p>
                </div>
                <a
                  href={pdfUrl}
                  download
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition duration-200 shadow-md inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
            
            {/* Inline Preview */}
            <div className="p-4 bg-gray-100">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] rounded-lg shadow-inner"
                title={`Preview of ${titleStr}`}
                loading="lazy"
              />
              <p className="text-center text-sm text-gray-500 mt-3">
                💡 Preview may take a moment to load. 
                <a href={pdfUrl} download className="text-blue-600 hover:underline ml-1">Download PDF</a> 
                for faster access.
              </p>
            </div>
          </div>
        )}

        {/* ✅ Rich Text Section - Better typography */}
        {content && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="prose prose-lg prose-blue max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-li:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2
              prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100">
              {documentToReactComponents(content as Document)}
            </div>
          </div>
        )}

        {/* ✅ Fallback */}
        {!pdfUrl && !content && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">No content available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ SEO: Custom 404 component
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Question Not Found</h1>
        <p className="text-gray-600">The model question you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}
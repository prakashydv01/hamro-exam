import Link from "next/link";
import { contentfulClient } from "@/lib/contentful";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";

async function getSyllabusFaculties() {
  const response = await contentfulClient.getEntries({
    content_type: "syllabus",
    select: ["fields.faculty", "fields.slug"],
  });

  return response.items;
}

export default async function SyllabusPage() {
  const syllabusList = await getSyllabusFaculties();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8" />
            <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
              Academic Resources
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Entrance Syllabus
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            Select your faculty to view detailed syllabus and course structure
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Stats Bar */}
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

        {/* Faculty Grid */}
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

        {/* Empty State (if no data) */}
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

        {/* Help Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
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
  );
}
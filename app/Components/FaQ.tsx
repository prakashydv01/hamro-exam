// app/Components/EntranceFaqSection.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// FAQ data with SEO-optimized content
const entranceFaqs = [
  // BIT FAQs
  {
    id: 1,
    question: "What is the eligibility for BIT entrance exam in Nepal?",
    answer: "To appear in BIT entrance exam, you need minimum 45% marks in +2 with Mathematics as compulsory subject. Age limit is 17-25 years. Reserved category students need 40% marks.",
    category: "BIT",
    subcategory: "eligibility",
    keywords: ["bit eligibility", "bit entrance requirements", "bit admission criteria"]
  },
  {
    id: 2,
    question: "BIT entrance exam syllabus and question pattern",
    answer: "BIT entrance exam consists of 100 multiple choice questions (MCQs) covering Mathematics (60 questions), English (20 questions), and Logical Reasoning (20 questions). Exam duration is 2 hours with no negative marking.",
    category: "BIT",
    subcategory: "pattern",
    keywords: ["bit syllabus", "bit exam pattern", "bit question format"]
  },
  {
    id: 3,
    question: "Top BIT colleges in Nepal for entrance preparation",
    answer: "Leading BIT colleges in Nepal include Kathmandu University (KU), NCCS College, GCES, Kathford College, Padma Kanya Campus, and Prime College. These institutions offer quality BIT programs.",
    category: "BIT",
    subcategory: "colleges",
    keywords: ["best bit colleges", "bit colleges nepal", "top bit institutes"]
  },
  
  // CSIT FAQs
  {
    id: 4,
    question: "CSIT entrance eligibility criteria and requirements",
    answer: "CSIT entrance requires minimum D+ in each subject with Mathematics or Computer Science in +2. Aggregate of 45% is mandatory. Students from management stream with Computer Science can also apply.",
    category: "CSIT",
    subcategory: "eligibility",
    keywords: ["csit eligibility", "csit entrance requirements", "bsc csit admission"]
  },
  {
    id: 5,
    question: "BSc CSIT entrance exam format and marking scheme",
    answer: "CSIT entrance exam features 100 MCQs: Mathematics (60 questions), English (20), Physics (10), and Chemistry (10). No negative marking applies. Total marks: 100, Duration: 2 hours.",
    category: "CSIT",
    subcategory: "pattern",
    keywords: ["csit exam pattern", "csit syllabus", "bsc csit entrance format"]
  },
  {
    id: 6,
    question: "Best CSIT colleges in Nepal for quality education",
    answer: "Top CSIT colleges include Pulchowk Campus, Patan Multiple Campus, ASCOL, St. Xavier's College, Prime College, and KIST College. These institutes have excellent placement records.",
    category: "CSIT",
    subcategory: "colleges",
    keywords: ["best csit colleges", "csit colleges nepal", "top bsc csit institutes"]
  },
  
  // BCA FAQs
  {
    id: 7,
    question: "BCA entrance exam eligibility in Nepal",
    answer: "BCA entrance requires 45% in +2 with Mathematics or Business Mathematics. Minimum D+ grade in all subjects is mandatory. Students from any stream can apply with mathematics background.",
    category: "BCA",
    subcategory: "eligibility",
    keywords: ["bca eligibility", "bca entrance requirements", "bca admission nepal"]
  },
  {
    id: 8,
    question: "BCA entrance syllabus and subject weightage",
    answer: "BCA entrance syllabus includes Mathematics (50% weightage), English (25%), Logical Reasoning (15%), and Computer Awareness (10%). Total 100 questions, 2 hours duration.",
    category: "BCA",
    subcategory: "syllabus",
    keywords: ["bca syllabus", "bca entrance topics", "bca exam subjects"]
  },
  {
    id: 9,
    question: "Top BCA colleges in Nepal for career opportunities",
    answer: "Leading BCA colleges include Padma Kanya Campus, Shankar Dev Campus, KIST College, Prime College, NCCS College, and Texas College. These offer modern IT infrastructure.",
    category: "BCA",
    subcategory: "colleges",
    keywords: ["best bca colleges", "bca colleges nepal", "top bca institutes"]
  },
  
  // IOE FAQs
  {
    id: 10,
    question: "IOE entrance exam eligibility for engineering",
    answer: "IOE entrance requires 50% in +2 with Physics, Chemistry, and Mathematics. Minimum 50% individually in PCM subjects. Diploma holders can also apply for lateral entry.",
    category: "IOE",
    subcategory: "eligibility",
    keywords: ["ioe eligibility", "ioe entrance requirements", "engineering admission nepal"]
  },
  {
    id: 11,
    question: "IOE entrance exam pattern and negative marking",
    answer: "IOE entrance features 100 MCQs: Mathematics (70 questions), Physics (15), Chemistry (15). Each question carries 4 marks with 1 mark negative for wrong answers. Total marks: 400.",
    category: "IOE",
    subcategory: "pattern",
    keywords: ["ioe exam pattern", "ioe syllabus", "ioe marking scheme"]
  },
  {
    id: 12,
    question: "Top IOE engineering colleges in Nepal",
    answer: "Best IOE colleges: Pulchowk Campus, Purwanchal Campus, Western Campus, Thapathali Campus, and Kathmandu Engineering College. These are constituent campuses of Tribhuvan University.",
    category: "IOE",
    subcategory: "colleges",
    keywords: ["best engineering colleges", "ioe colleges nepal", "top engineering institutes"]
  },
  
  // General FAQs
  {
    id: 13,
    question: "How to apply for entrance exams in Nepal",
    answer: "Visit official websites of IOE, TU, KU, or PU. Fill online application form, upload required documents (photo, signature, marksheets), and pay fee (NPR 1000-2000). Deadlines are usually in Ashwin-Mangsir.",
    category: "General",
    subcategory: "application",
    keywords: ["entrance application", "how to apply for entrance", "entrance exam registration"]
  },
  {
    id: 14,
    question: "Documents required for entrance exam registration",
    answer: "Required documents: Grade 10 marksheet, Grade 11 marksheet, Grade 12 marksheet or transcript, Character certificate, Citizenship certificate, Passport size photos, Migration certificate (if applicable).",
    category: "General",
    subcategory: "documents",
    keywords: ["entrance documents", "registration requirements", "application documents"]
  },
  {
    id: 15,
    question: "BIT vs CSIT vs BCA: Which is better for career?",
    answer: "BIT focuses on IT management and business applications. CSIT emphasizes computer science fundamentals and research. BCA concentrates on application development. Choose based on your career goals: IT management (BIT), research/development (CSIT), or software development (BCA).",
    category: "General",
    subcategory: "comparison",
    keywords: ["bit vs csit", "bca vs bit", "which is better", "it courses comparison"]
  },
];

// Category configuration
const categories = [
  { id: "all", name: "All Programs", icon: "📚", count: entranceFaqs.length },
  { id: "BIT", name: "BIT", icon: "💻", count: entranceFaqs.filter(f => f.category === "BIT").length },
  { id: "CSIT", name: "CSIT", icon: "🔬", count: entranceFaqs.filter(f => f.category === "CSIT").length },
  { id: "BCA", name: "BCA", icon: "📱", count: entranceFaqs.filter(f => f.category === "BCA").length },
  { id: "IOE", name: "IOE", icon: "⚙️", count: entranceFaqs.filter(f => f.category === "IOE").length },
  { id: "General", name: "General", icon: "📌", count: entranceFaqs.filter(f => f.category === "General").length },
];

export default function EntranceFaqSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filter FAQs by category only
  const filteredFaqs = useMemo(() => {
    if (selectedCategory === "all") return entranceFaqs;
    return entranceFaqs.filter(faq => faq.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      {/* SEO Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": entranceFaqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header - SEO Optimized */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Entrance Exam Guide Nepal 2024
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete information about BIT • CSIT • BCA • IOE entrance exams: eligibility, syllabus, pattern, and top colleges
            </p>
          </div>

          {/* Category Pills - Simplified */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                aria-current={selectedCategory === category.id ? "page" : undefined}
              >
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {category.count}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {filteredFaqs.map((faq) => (
                <motion.article
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-shadow shadow-sm hover:shadow"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  {/* Question */}
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full p-5 flex items-start gap-4 text-left"
                    aria-expanded={expandedId === faq.id}
                  >
                    <span className="text-2xl mt-0.5">{categories.find(c => c.id === faq.category)?.icon}</span>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-gray-900 pr-8" itemProp="name">
                        {faq.question}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                          {faq.category}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 capitalize">
                          {faq.subcategory}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl text-gray-400">
                      {expandedId === faq.id ? "−" : "+"}
                    </span>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                      >
                        <div 
                          className="p-5 pl-16 bg-gray-50"
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <p className="text-gray-700 leading-relaxed" itemProp="text">
                            {faq.answer}
                          </p>
                          
                          {/* Related Links */}
                          {faq.subcategory === "colleges" && (
                            <div className="mt-4">
                              <Link 
                                href={`/colleges/${faq.category.toLowerCase()}`}
                                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                              >
                                View all {faq.category} colleges →
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <span className="text-5xl mb-4 block">📋</span>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-500 mb-4">Try selecting a different category</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-blue-600 hover:underline font-medium"
              >
                View all programs
              </button>
            </div>
          )}

          {/* Quick Comparison Table */}
          <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Entrance Exam Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-3 text-left font-semibold text-gray-700">Program</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Math Weight</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Questions</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Negative Marking</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Total Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50"><td className="py-3 font-medium">BIT</td><td>60%</td><td>100</td><td className="text-green-600">No</td><td>100</td></tr>
                  <tr className="hover:bg-gray-50"><td className="py-3 font-medium">CSIT</td><td>60%</td><td>100</td><td className="text-green-600">No</td><td>100</td></tr>
                  <tr className="hover:bg-gray-50"><td className="py-3 font-medium">BCA</td><td>50%</td><td>100</td><td className="text-green-600">No</td><td>100</td></tr>
                  <tr className="hover:bg-gray-50"><td className="py-3 font-medium">IOE</td><td>70%</td><td>100</td><td className="text-red-600">Yes </td><td>140</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need personalized guidance for your entrance exam preparation?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
            >
              <span>📞</span>
              Get Free Counseling
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
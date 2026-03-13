// app/Components/EntranceFaqSection.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple, elegant icon set
const Icons = {
  BIT: "💻",
  CSIT: "🔬",
  BCA: "📱",
  IOE: "⚙️",
  General: "📌",
  eligibility: "✓",
  syllabus: "📘",
  pattern: "📊",
  colleges: "🏛️",
};

const entranceFaqs = [
  // BIT
  {
    id: 1,
    question: "What is the eligibility for BIT entrance?",
    answer: "Minimum 45% in +2 with Mathematics compulsory. Age: 17-25 years. Reserved category: 40%.",
    category: "BIT",
    subcategory: "eligibility",
  },
  {
    id: 2,
    question: "BIT entrance syllabus and pattern?",
    answer: "100 MCQs: Mathematics (60), English (20), Reasoning (20). 2 hours, no negative marking.",
    category: "BIT",
    subcategory: "pattern",
  },
  {
    id: 3,
    question: "Top BIT colleges in Nepal?",
    answer: "KU, NCCS, GCES, Kathford, Padma Kanya, Prime College.",
    category: "BIT",
    subcategory: "colleges",
  },
  // CSIT
  {
    id: 4,
    question: "CSIT entrance eligibility criteria?",
    answer: "Minimum D+ in each subject with Mathematics/Computer Science. 45% aggregate required.",
    category: "CSIT",
    subcategory: "eligibility",
  },
  {
    id: 5,
    question: "CSIT entrance exam format?",
    answer: "100 MCQs: Math (60), English (20), Physics (10), Chemistry (10). No negative marking.",
    category: "CSIT",
    subcategory: "pattern",
  },
  {
    id: 6,
    question: "Best CSIT colleges?",
    answer: "Pulchowk, Patan Campus, ASCOL, St. Xavier's, Prime, KIST.",
    category: "CSIT",
    subcategory: "colleges",
  },
  // BCA
  {
    id: 7,
    question: "BCA entrance eligibility?",
    answer: "45% in +2 with Mathematics/Business Mathematics. Minimum D+ in all subjects.",
    category: "BCA",
    subcategory: "eligibility",
  },
  {
    id: 8,
    question: "BCA entrance syllabus?",
    answer: "Mathematics (50%), English (25%), Reasoning (15%), Computer Awareness (10%).",
    category: "BCA",
    subcategory: "syllabus",
  },
  {
    id: 9,
    question: "Top BCA colleges in Nepal?",
    answer: "Padma Kanya, Shankar Dev, KIST, Prime, NCCS, Texas College.",
    category: "BCA",
    subcategory: "colleges",
  },
  // IOE
  {
    id: 10,
    question: "IOE entrance eligibility?",
    answer: "50% in +2 with Physics, Chemistry, Mathematics. PCM: 50% individually.",
    category: "IOE",
    subcategory: "eligibility",
  },
  {
    id: 11,
    question: "IOE entrance exam pattern?",
    answer: "100 MCQs: Math (70), Physics (15), Chemistry (15). 4 marks each, -1 for wrong.",
    category: "IOE",
    subcategory: "pattern",
  },
  {
    id: 12,
    question: "Top IOE engineering colleges?",
    answer: "Pulchowk, Purwanchal, Western, Thapathali, Kathmandu Engineering College.",
    category: "IOE",
    subcategory: "colleges",
  },
  // General
  {
    id: 13,
    question: "How to apply for entrance exams?",
    answer: "Visit official websites (IOE, TU, KU, PU). Fill form online, upload docs, pay fee (NPR 1000-2000).",
    category: "General",
    subcategory: "application",
  },
  {
    id: 14,
    question: "Documents required for registration?",
    answer: "Marksheets (10, 11, 12), Character certificate, Citizenship, Photos, Migration certificate.",
    category: "General",
    subcategory: "documents",
  },
  {
    id: 15,
    question: "BIT vs CSIT vs BCA difference?",
    answer: "BIT: IT Management, CSIT: Computer Science, BCA: Applications. Choose based on career goals.",
    category: "General",
    subcategory: "comparison",
  },
];

const categories = [
  { id: "all", label: "All", icon: "📋" },
  { id: "BIT", label: "BIT", icon: "💻" },
  { id: "CSIT", label: "CSIT", icon: "🔬" },
  { id: "BCA", label: "BCA", icon: "📱" },
  { id: "IOE", label: "IOE", icon: "⚙️" },
  { id: "General", label: "General", icon: "📌" },
];

const subcategories = [
  { id: "eligibility", label: "Eligibility", icon: "✓" },
  { id: "syllabus", label: "Syllabus", icon: "📘" },
  { id: "pattern", label: "Pattern", icon: "📊" },
  { id: "colleges", label: "Colleges", icon: "🏛️" },
  { id: "application", label: "Application", icon: "📝" },
  { id: "documents", label: "Documents", icon: "📄" },
  { id: "comparison", label: "Comparison", icon: "⚖️" },
];

export default function EntranceFaqSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return entranceFaqs.filter(faq => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === "all" || faq.subcategory === selectedSubcategory;
      const matchesSearch = searchQuery === "" || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return entranceFaqs.length;
    return entranceFaqs.filter(f => f.category === categoryId).length;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Entrance Exam Guide
          </h1>
          <p className="text-lg text-gray-500">
            BIT • CSIT • BCA • IOE
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-500">Program:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-xs px-1.5 rounded-full ${
                    selectedCategory === cat.id
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}>
                    {getCategoryCount(cat.id)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-500">Topic:</span>
            {selectedSubcategory !== "all" && (
              <button
                onClick={() => setSelectedSubcategory("all")}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedSubcategory === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Topics
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedSubcategory === sub.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center gap-1">
                  <span>{sub.icon}</span>
                  <span>{sub.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
          </p>
          <button
            onClick={() => setExpandedId(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Collapse all
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition"
              >
                {/* Question Row */}
                <div
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="p-4 flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl">{Icons[faq.category as keyof typeof Icons]}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {faq.category}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {subcategories.find(s => s.id === faq.subcategory)?.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(faq.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition"
                    >
                      <span className="text-lg">
                        {bookmarkedIds.includes(faq.id) ? "⭐" : "☆"}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(faq.answer);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition"
                      title="Copy answer"
                    >
                      <span className="text-lg">📋</span>
                    </button>
                    <span className="text-xl text-gray-400 ml-1">
                      {expandedId === faq.id ? "−" : "+"}
                    </span>
                  </div>
                </div>

                {/* Answer (Expandable) */}
                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100 bg-gray-50"
                    >
                      <div className="p-4 pl-14">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                        
                        {/* Quick Tags */}
                        {faq.subcategory === "eligibility" && (
                          <div className="flex gap-2 mt-3">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              ✓ Minimum marks: 45%
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              📅 Age: 17-25
                            </span>
                          </div>
                        )}
                        
                        {faq.subcategory === "colleges" && (
                          <div className="mt-3">
                            <a 
                              href="/colleges" 
                              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View detailed college list →
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-xl"
          >
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedSubcategory("all");
              }}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Quick Comparison Table */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left font-medium text-gray-600">Program</th>
                  <th className="pb-2 text-left font-medium text-gray-600">Math</th>
                  <th className="pb-2 text-left font-medium text-gray-600">Questions</th>
                  <th className="pb-2 text-left font-medium text-gray-600">Negative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="py-2">BIT</td><td>60%</td><td>100</td><td className="text-green-600">No</td></tr>
                <tr><td className="py-2">CSIT</td><td>60%</td><td>100</td><td className="text-green-600">No</td></tr>
                <tr><td className="py-2">BCA</td><td>50%</td><td>100</td><td className="text-green-600">No</td></tr>
                <tr><td className="py-2">IOE</td><td>70%</td><td>100</td><td className="text-red-600">Yes (-1)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookmark Bar */}
        {bookmarkedIds.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3"
          >
            <span>⭐ {bookmarkedIds.length} saved</span>
            <button 
              onClick={() => setBookmarkedIds([])}
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </motion.div>
        )}

        {/* Simple CTA */}
        

        {/* SEO Structured Data */}
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
      </div>
    </section>
  );
}
// HeroSimple.tsx (server component – no "use client" needed)
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSimple() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Site Name with primary keywords – natural and visible */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Hamro <span className="text-blue-600">Exam</span>
          </h1>
          
          {/* Tagline – natural, user‑oriented */}
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            Your Gateway to Entrance Exam Success
          </p>
          
          {/* Description – natural keyword placement, valuable to users */}
          <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Prepare for <strong className="text-gray-700">BSc.CSIT, BIT, IOE, and BCA</strong> entrance exams with 
            thousands of practice questions, mock tests, and detailed analytics – all in one place.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              aria-label="Start practicing entrance exam questions"
            >
              Start Practicing
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              aria-label="Learn more about entrance exam preparation"
            >
              Learn More
            </Link>
          </div>

          {/* ✅ REMOVED hidden SEO keywords div – no sr-only lists, no stuffing */}
        </div>
      </div>
    </section>
  );
}
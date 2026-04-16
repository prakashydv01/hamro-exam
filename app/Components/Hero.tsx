"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSimple() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Site Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Hamro{" "}
            <span className="text-blue-600">Exam</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            Your Gateway to Entrance Exam Success
          </p>
          
          {/* Description */}
          <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Bsc.Csit , BIT , IOE , BCA entrance exams with 
            thousands of practice questions, mock tests, and detailed analytics.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Practicing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
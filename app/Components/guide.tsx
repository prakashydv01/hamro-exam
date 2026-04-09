// app/guide/page.tsx
import React from 'react';
import Image from 'next/image';

// Import screenshots directly from assets
// First, make sure you have these images in your assets folder
// You'll need to add your actual images - these are placeholder imports
import practicePageImg from '@/public/image/image1.png';
import facultySelectionImg from '@/public/image/image2.png';
import subjectSelectionImg from '@/public/image/image3.png';
import answeringQuestionsImg from '@/public/image/image4.png';
import practiceResultsImg from '@/public/image/image5.png';
import mockTestPageImg from '@/public/image/image11.png';
import mocktestFacultyImg from '@/public/image/image12.png';
import mocktestListImg from '@/public/image/image13.png';
import mocktestTimedImg from '@/public/image/image14.png';
import mocktestResultImg from '@/public/image/image15.png';

// Optional: Create a reusable screenshot component
const Screenshot = ({ 
  src, 
  alt, 
  caption 
}: { 
  src: any; 
  alt: string; 
  caption?: string;
}) => {
  return (
    <div className="mt-3 bg-gray-100 p-4 rounded-lg border border-gray-300">
      <div className="relative w-full h-auto">
        <Image 
          src={src}
          alt={alt}
          className="rounded-md w-full h-auto"
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 mt-2 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
};

const UserGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* H1 Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-4">
          How to Use Hamro Exam – Complete Guide for Practice & Mock Tests
        </h1>
        
        {/* Introduction */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-8">
          <p className="text-lg text-gray-800 leading-relaxed">
            <strong>Hamro Exam</strong> is a free online platform designed to help Nepali students prepare for entrance exams like IOE, IOM, CEE, and university entrance tests. 
            We make exam preparation easy, effective, and accessible to everyone. This guide will show you how to use <strong>Practice Mode</strong> and <strong>Mock Test Mode</strong> like a pro.
          </p>
        </div>

        {/* Section 1: Practice Mode */}
        <h2 className="text-2xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mt-8 mb-4">
          1. How to Use Practice Mode
        </h2>
        <p className="text-gray-700 mb-4">
          Practice Mode is for learning without pressure. You can answer questions topic by topic and see instant explanations.
        </p>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 1: Go to Practice page</h3>
            <p className="text-gray-600">Click on <strong>&quot;Practice&quot;</strong> in the navigation menu or visit <code className="bg-gray-100 px-2 py-0.5 rounded">/practice</code>.</p>
            <Screenshot 
              src={practicePageImg}
              alt="Practice page showing Start Practicing button and faculty list"
              caption="Figure 1: Practice Mode - Faculty selection screen"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 2: Select Faculty</h3>
            <p className="text-gray-600">Choose your faculty (e.g., Science, Management, Engineering, Medical).</p>
            <Screenshot 
              src={facultySelectionImg}
              alt="Faculty selection dropdown showing Science, Management, Engineering, Medical"
              caption="Figure 2: Select your faculty from the dropdown menu"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 3: Choose Subject</h3>
            <p className="text-gray-600">Select a subject like Physics, Chemistry, Math, or English.</p>
            <Screenshot 
              src={subjectSelectionImg}
              alt="Subject cards showing Physics with 50 questions, Chemistry with 40 questions"
              caption="Figure 3: Choose a subject to practice"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 4: Start answering questions</h3>
            <p className="text-gray-600">Read each question, select your answer, and click <strong>&quot;Next&quot;</strong>. You can skip and go back anytime.</p>
            <Screenshot 
              src={answeringQuestionsImg}
              alt="Question interface showing MCQ options, Next button, and question counter"
              caption="Figure 4: Answer questions at your own pace"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 5: View results / correct answers</h3>
            <p className="text-gray-600">After finishing, you&apos;ll see your score, correct answers, and explanations to help you learn.</p>
            <Screenshot 
              src={practiceResultsImg}
              alt="Results page showing score percentage, correct vs wrong answers, and explanations"
              caption="Figure 5: Review your answers and learn from mistakes"
            />
          </div>
        </div>

        {/* Section 2: Mock Test Mode */}
        <h2 className="text-2xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mt-12 mb-4">
          2. How to Use Mock Test Mode
        </h2>
        <p className="text-gray-700 mb-4">
          Mock tests simulate real exam conditions. They are timed and follow the official exam pattern — perfect for final preparation.
        </p>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 1: Go to Mock Test page</h3>
            <p className="text-gray-600">Click on <strong>&quot;Mock Test&quot;</strong> in the navbar or go to <code className="bg-gray-100 px-2 py-0.5 rounded">/mock-test</code>.</p>
            <Screenshot 
              src={mockTestPageImg}
              alt="Mock Test landing page with Start a Mock Test button"
              caption="Figure 6: Mock Test Mode - Get started with full-length exams"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 2: Select Faculty</h3>
            <p className="text-gray-600">Choose your faculty (Science, Management, Engineering, etc.).</p>
            <Screenshot 
              src={mocktestFacultyImg}
              alt="Faculty selection with icons - Science flask icon, Management chart icon"
              caption="Figure 7: Select your faculty for mock tests"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 3: Choose Mock Test</h3>
            <p className="text-gray-600">Select a specific test (choose optional subject to start complete mock test if available).</p>
            <Screenshot 
              src={mocktestListImg}
              alt="List of mock tests showing test name, total questions, time limit, and attempted badge"
              caption="Figure 8: Pick the mock test that matches your exam"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 4: Start timed test</h3>
            <p className="text-gray-600">Click <strong>&quot;Start Test&quot;</strong>. A timer will begin. Answer all questions before time runs out. You can mark questions for review.</p>
            <Screenshot 
              src={mocktestTimedImg}
              alt="Mock test interface with timer at top, question palette, and Submit Test button"
              caption="Figure 9: Timed exam interface - Watch the clock!"
            />
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-800">Step 5: Submit and view result</h3>
            <p className="text-gray-600">Click <strong>&quot;Submit&quot;</strong> when done. You&apos;ll get a detailed report: score, rank (if available), time taken, and section-wise analysis.</p>
            <Screenshot 
              src={mocktestResultImg}
              alt="Mock test result card showing 75% score, rank among 1000 students, and time spent"
              caption="Figure 10: Detailed results with ranking and analysis"
            />
          </div>
        </div>

        {/* Tips Section */}
        <h2 className="text-2xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mt-12 mb-4">
          🎯 Tips for Best Performance
        </h2>
        <ul className="bg-white p-5 rounded-lg shadow list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Practice daily:</strong> Even 20 minutes a day builds consistency.</li>
          <li><strong>Review wrong answers:</strong> Understanding mistakes is the fastest way to improve.</li>
          <li><strong>Take mock tests seriously:</strong> Simulate exam environment – no phone, no distractions, strict timing.</li>
          <li><strong>Track your progress:</strong> Check your dashboard to see which subjects need more work.</li>
          <li><strong>Re-attempt mock tests:</strong> Your second attempt will show how much you&apos;ve grown.</li>
        </ul>

        {/* FAQ Section */}
        <h2 className="text-2xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mt-12 mb-4">
          ❓ Frequently Asked Questions
        </h2>
        <div className="bg-white p-5 rounded-lg shadow divide-y divide-gray-200">
          <div className="py-3">
            <h3 className="font-bold text-gray-800">Do I need to login?</h3>
            <p className="text-gray-600">You can try a few questions without login, but to save progress, take mock tests, and see analytics, you need a free account (just email & name).</p>
          </div>
          <div className="py-3">
            <h3 className="font-bold text-gray-800">Is Hamro Exam completely free?</h3>
            <p className="text-gray-600">Yes! Hamro Exam is 100% free for all Nepali students. No hidden charges, no premium plans.</p>
          </div>
          <div className="py-3">
            <h3 className="font-bold text-gray-800">How are scores calculated?</h3>
            <p className="text-gray-600">For most tests: +4 for correct, -1 for wrong (negative marking). For practice mode, no negative marking. The scoring pattern is shown before each test.</p>
          </div>
          <div className="py-3">
            <h3 className="font-bold text-gray-800">Can I retry mock tests?</h3>
            <p className="text-gray-600">Absolutely. You can retake any mock test unlimited times. Your best score is saved on your profile.</p>
          </div>
          <div className="py-3">
            <h3 className="font-bold text-gray-800">Does it work on mobile?</h3>
            <p className="text-gray-600">Yes, Hamro Exam is fully responsive. You can practice on your phone, tablet, or computer.</p>
          </div>
        </div>

        {/* Conclusion */}
        <div className="mt-12 bg-green-50 p-6 rounded-lg text-center shadow-sm">
          <p className="text-xl font-semibold text-green-800 mb-2">Ready to ace your entrance exam? 🚀</p>
          <p className="text-gray-700">
            Start with Practice Mode to build confidence, then challenge yourself with Mock Tests. 
            Every question you solve brings you closer to your dream college. <strong>Hamro Exam ma swagat cha!</strong> (Welcome to Hamro Exam!)
          </p>
          <div className="mt-4">
            <a href="/dashboard" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Start Practicing Now →
            </a>
          </div>
        </div>

        {/* SEO-friendly note */}
        <div className="sr-only">
          Hamro Exam user guide for Practice Mode and Mock Test Mode. Learn how to prepare for entrance exams in Nepal.
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
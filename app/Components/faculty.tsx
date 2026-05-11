// app/dashboard/DashboardClient.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Cpu, 
  Microscope, 
  BarChart3, 
  Globe, 
  Shield,
  BookOpen, 
  Target 
} from 'lucide-react';

interface FacultyCardProps {
  name: string;
  code: string;
  icon?: React.ReactNode;
  questionCount: number;
  mockTestCount: string | number;
  iconBgColor?: string;
  iconColor?: string;
}

// Individual faculty card with embedded SEO keywords
const FacultyCard: React.FC<FacultyCardProps> = ({
  name,
  code,
  icon,
  questionCount,
  mockTestCount,
  iconBgColor = '#eff6ff',
  iconColor = '#2563eb'
}) => {
  const router = useRouter();

  const handlePractice = () => router.push('/practice');
  const handleMockTest = () => router.push('/mocktest');

  // SEO keywords relevant to this faculty
  const seoKeywords = `${name} entrance preparation, ${name} model questions, ${name} mock test, ${name} practice papers, ${name} exam guide`.toLowerCase();

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Hidden SEO keywords for search engines (optional but safe) */}
      <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {seoKeywords}
      </span>

      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {icon &&
              React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, {
                style: { color: iconColor, width: '20px', height: '20px' },
              })}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#111827' }}>
              {name}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{code}</p>
          </div>
        </div>
      </div>

      {/* Stats + visible SEO keywords */}
      <div style={{ padding: '16px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Questions</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>{questionCount}+</p>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }}></div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Mock Tests</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
              {mockTestCount === 'unlimited' ? '∞' : mockTestCount}
            </p>
          </div>
        </div>

        {/* Visible SEO keyword tags inside the card */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          <span className="seo-keyword" style={{ fontSize: '10px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px', color: '#4b5563' }}>
            {name} preparation
          </span>
          <span className="seo-keyword" style={{ fontSize: '10px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px', color: '#4b5563' }}>
            {name} model questions
          </span>
          <span className="seo-keyword" style={{ fontSize: '10px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px', color: '#4b5563' }}>
            {name} mock test
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={handlePractice}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            aria-label={`Practice ${name} questions`}
          >
            <BookOpen style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            Practice
          </button>
          <button
            onClick={handleMockTest}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: '#1f2937',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
            aria-label={`Take ${name} mock test`}
          >
            <Target style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            Mock Test
          </button>
        </div>
      </div>
    </div>
  );
};

// Client component that renders the dashboard
export default function DashboardClient() {
  const faculties = [
    {
      name: 'BIT',
      code: 'BIT',
      icon: <GraduationCap />,
      questions: 1250,
      mockTests: "unlimited",
      iconBgColor: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      name: 'Bsc.CSIT',
      code: 'CSIT',
      icon: <Cpu />,
      questions: 1450,
      mockTests: "unlimited",
      iconBgColor: '#f5f3ff',
      iconColor: '#7c3aed',
    },
    {
      name: 'IOE',
      code: 'IOE',
      icon: <Microscope />,
      questions: 1100,
      mockTests: "unlimited",
      iconBgColor: '#ecfdf5',
      iconColor: '#059669',
    },
    {
      name: 'BCA',
      code: 'BCA',
      icon: <BookOpen />,
      questions: 1100,
      mockTests: "unlimited",
      iconBgColor: '#ecfdf5',
      iconColor: '#059669',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Global style override (kept from original) */}
      <style>{`
        body {
          background-color: #f9fafb !important;
          color: #111827 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        svg {
          color: inherit !important;
          stroke: currentColor !important;
        }
        /* Responsive grid: 1 column on mobile, 2 columns on tablet+, stay 2 columns on desktop */
        @media (min-width: 640px) {
          .faculty-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        /* Keep 2 columns even on large screens (user request: "two card in one row") */
        @media (min-width: 1024px) {
          .faculty-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px' }}>
        {/* Header SEO-friendly */}
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>
            Faculty Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
            Select your faculty to start practicing model questions and taking mock tests.
          </p>
        </header>

        {/* Faculty Grid - exactly two cards per row on tablet/desktop */}
        <div className="faculty-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {faculties.map((faculty) => (
            <FacultyCard
              key={faculty.code}
              name={faculty.name}
              code={faculty.code}
              icon={faculty.icon}
              questionCount={faculty.questions}
              mockTestCount={faculty.mockTests}
              iconBgColor={faculty.iconBgColor}
              iconColor={faculty.iconColor}
            />
          ))}
        </div>

        {/* Optional footer note – kept minimal */}
        
      </div>
    </div>
  );
}
// components/FeaturesSection.tsx
'use client';

import React from 'react';
import { Target, BookOpen, BarChart3, Clock, Award, TrendingUp, Computer, GraduationCap, Brain, Zap } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats?: string;
  color: string;
  keyword?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, stats, color, keyword }) => {
  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
      }}
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Hidden keyword for SEO */}
      {keyword && <meta itemProp="keywords" content={keyword} />}
      
      {/* Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#111827',
        margin: '0 0 8px 0'
      }} itemProp="name">{title}</h3>

      {/* Description */}
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        margin: '0 0 16px 0',
        lineHeight: '1.5'
      }} itemProp="description">{description}</p>

      {/* Stats */}
      {stats && (
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '20px',
          fontSize: '13px',
          color: '#4b5563'
        }} itemProp="offers">
          {stats}
        </div>
      )}
    </div>
  );
};

// Main Features Section
export default function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Practice Mode for BIT, BSc CSIT, BCA & IOE',
      description: 'Master entrance exam concepts with 4,000+ practice questions specifically designed for BIT entrance, BSc CSIT preparation, BCA exams, and IOE engineering entrance.',
      stats: '4,000+ practice questions',
      color: '#2563eb', // blue
      keyword: 'BIT entrance preparation, BSc CSIT practice questions, BCA mock tests, IOE entrance exam'
    },
    {
      icon: <Target style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Full-Length Mock Tests',
      description: 'Simulate real exam conditions with 37+ full-length mock tests for BIT, BSc CSIT, BCA, and IOE. Practice with previous year papers and get authentic exam experience.',
      stats: '37 full-length tests',
      color: '#7c3aed', // purple
      keyword: 'BIT mock tests, BSc CSIT full-length exams, BCA test series, IOE engineering mock tests'
    },
    {
      icon: <BarChart3 style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics for BIT, BSc CSIT, BCA, and IOE preparation. Identify weak areas, get personalized insights, and improve your percentile rank.',
      stats: 'Real-time progress tracking',
      color: '#059669', // green
      keyword: 'BIT entrance analytics, BSc CSIT performance tracking, BCA progress report, IOE rank predictor'
    },
    {
      icon: <Clock style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Timed Practice Tests',
      description: 'Master time management for BIT, BSc CSIT, BCA, and IOE entrance exams. Practice with real-time countdown timers and learn to solve questions faster.',
      stats: 'Time-based analysis',
      color: '#ea580c', // orange
      keyword: 'BIT time management, BSc CSIT speed tests, BCA timed practice, IOE exam simulation'
    },
    {
      icon: <GraduationCap style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Faculty-Wise Preparation',
      description: 'Specialized preparation for Science & Technology, Management, Humanities, and Education faculties. Covers BIT, BSc CSIT, BCA, BBM, BBS, and IOE entrance exams.',
      stats: '15+ faculties covered',
      color: '#dc2626', // red
      keyword: 'BIT faculty preparation, BSc CSIT subject-wise tests, BCA specialization, IOE engineering subjects'
    },
    {
      icon: <Brain style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Concept-Based Learning',
      description: 'Master fundamental concepts for BIT entrance, BSc CSIT mathematics, BCA programming, and IOE physics & chemistry with our concept-first approach.',
      stats: 'Topic-wise practice',
      color: '#8b5cf6', // violet
      keyword: 'BIT concept learning, BSc CSIT fundamentals, BCA programming practice, IOE physics preparation'
    }
  ];

  return (
    <section 
      style={{
        padding: '60px 0',
        backgroundColor: '#ffffff'
      }}
      aria-label="Entrance Exam Preparation Features"
      itemScope
      itemType="https://schema.org/EducationalOccupationalProgram"
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Section Header - SEO Optimized */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 16px 0',
            lineHeight: '1.2'
          }}>
            Complete Entrance Exam Preparation for <span style={{ color: '#2563eb' }}>BIT, BSc CSIT, BCA & IOE</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#4b5563',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Nepal's most comprehensive platform for <strong>BIT entrance preparation, BSc CSIT mock tests, BCA practice sets, and IOE engineering entrance exam</strong>. Trusted by 5,000+ successful students.
          </p>
          
          {/* Keywords meta (hidden but present for SEO) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <span>BIT entrance exam preparation</span>
            <span>BSc CSIT entrance mock test</span>
            <span>BCA entrance practice questions</span>
            <span>IOE engineering entrance preparation</span>
            <span>Bachelor in Information Technology entrance</span>
            <span>Institute of Engineering entrance exam</span>
            <span>Computer Science entrance Nepal</span>
            <span>Bachelor of Computer Application preparation</span>
            <span>TU entrance exam preparation</span>
            <span>PU entrance mock tests</span>
            <span>KU entrance exam practice</span>
            <span>Purbanchal University entrance</span>
            <span>Nepal entrance exam preparation</span>
            <span>Science faculty entrance test</span>
            <span>Management entrance preparation</span>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '24px'
        }}>
          <style>{`
            @media (min-width: 768px) {
              div[data-features="true"] {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (min-width: 1024px) {
              div[data-features="true"] {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
          `}</style>
          <div data-features="true" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '24px'
          }}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Statistics with SEO Context */}
        <div style={{
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '2px solid #f3f4f6'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#111827',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Trusted by Students from Top Colleges for <span style={{ color: '#059669' }}>BIT, BSc CSIT, BCA & IOE Preparation</span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '16px'
          }}>
            <style>{`
              @media (min-width: 640px) {
                div[data-stats="true"] {
                  grid-template-columns: repeat(4, 1fr) !important;
                }
              }
            `}</style>
            <div data-stats="true" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '24px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb' }}>4,000+</div>
                <div style={{ fontSize: '15px', color: '#4b5563', marginTop: '4px', fontWeight: 500 }}>BIT & BSc CSIT Practice Questions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#7c3aed' }}>37</div>
                <div style={{ fontSize: '15px', color: '#4b5563', marginTop: '4px', fontWeight: 500 }}>Full-Length Mock Tests for IOE</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#059669' }}>15+</div>
                <div style={{ fontSize: '15px', color: '#4b5563', marginTop: '4px', fontWeight: 500 }}>Faculties & Specializations</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#ea580c' }}>5,000+</div>
                <div style={{ fontSize: '15px', color: '#4b5563', marginTop: '4px', fontWeight: 500 }}>Successful Students in BIT, BSc CSIT, BCA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty-Specific Callout */}
        
      </div>
    </section>
  );
}
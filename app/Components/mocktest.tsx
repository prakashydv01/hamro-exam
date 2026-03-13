// components/FeaturesSection.tsx
'use client';

import React from 'react';
import { Target, BookOpen, BarChart3, Clock, Award, TrendingUp } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats?: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, stats, color }) => {
  return (
    <div style={{
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
    }}>
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
      }}>{title}</h3>

      {/* Description */}
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        margin: '0 0 16px 0',
        lineHeight: '1.5'
      }}>{description}</p>

      {/* Stats */}
      {stats && (
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '20px',
          fontSize: '13px',
          color: '#4b5563'
        }}>
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
      title: 'Practice Mode',
      description: 'Learn at your own pace with instant feedback and detailed explanations for every question.',
      stats: '4,000+ practice questions',
      color: '#2563eb' // blue
    },
    {
      icon: <Target style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Mock Tests',
      description: 'Simulate real exam conditions with timed tests, previous year papers, and performance analysis.',
      stats: '37 full-length tests',
      color: '#7c3aed' // purple
    },
    {
      icon: <BarChart3 style={{ width: '28px', height: '28px', color: '#ffffff' }} />,
      title: 'Analytics',
      description: 'Track your progress, identify weak areas, and get personalized insights to improve your score.',
      stats: 'Real-time progress tracking',
      color: '#059669' // green
    }
  ];

  return (
    <div style={{
      padding: '48px 0',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 12px 0'
          }}>
            Everything you need to crack BIT Entrance
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Comprehensive preparation platform with practice questions, mock tests, and detailed analytics
          </p>
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

        {/* Additional Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '16px',
          marginTop: '48px',
          paddingTop: '48px',
          borderTop: '1px solid #f0f0f0'
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
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#2563eb' }}>4,000+</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Practice Questions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#7c3aed' }}>37</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Mock Tests</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#059669' }}>15+</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Faculties</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ea580c' }}>5,000+</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Happy Students</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px'
        }}>
          
        </div>
      </div>
    </div>
  );
}
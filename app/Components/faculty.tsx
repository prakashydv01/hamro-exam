// components/FacultyCard.tsx
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
  mockTestCount: string | number ;
  iconBgColor?: string;
  iconColor?: string;
}

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

  const handlePractice = () => {
    router.push('/practice');
  };

  const handleMockTest = () => {
    router.push('/mocktest');
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
           {icon &&
               React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, {
                  style: {
                    color: iconColor,
                    width: "20px",
                    height: "20px",
                    },
                  })}
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              color: '#111827'
            }}>{name}</h3>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#6b7280'
            }}>{code}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        padding: '16px',
        flex: 1
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#6b7280'
            }}>Questions</p>
            <p style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827'
            }}>{questionCount}</p>
          </div>
          <div style={{
            width: '1px',
            height: '32px',
            backgroundColor: '#e5e7eb'
          }}></div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#6b7280'
            }}>Mock Tests</p>
            <p style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827'
            }}>{mockTestCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: 'auto'
        }}>
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
              gap: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
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
              gap: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
          >
            <Target style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            Mock Test
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard page
export default function DashboardPage() {
  const faculties = [
    {
      name: 'BIT',
      code: 'BIT',
      icon: <GraduationCap />,
      questions: 1250,
      mockTests: "unlimited",
      iconBgColor: '#eff6ff',
      iconColor: '#2563eb'
    },
    {
      name: 'Bsc.CSIT',
      code: 'CSIT',
      icon: <Cpu />,
      questions: 1450,
      mockTests: "unlimited",
      iconBgColor: '#f5f3ff',
      iconColor: '#7c3aed'
    },
    {
      name: 'IOE',
      code: 'IOE',
      icon: <Microscope />,
      questions: 1100,
      mockTests: "unlimited",
      iconBgColor: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      name: 'BCA',
      code: 'BCA',
      icon: <BookOpen />,
      questions: 1100,
      mockTests: "unlimited",
      iconBgColor: '#ecfdf5',
      iconColor: '#059669'
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      {/* Force all colors to be explicit */}
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
      `}</style>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '20px', // Reduced from 24px
        paddingBottom: '20px' // Consistent padding all around
      }}>
        {/* Header - Reduced margin bottom */}
        <div style={{ marginBottom: '20px' }}> {/* Reduced from 32px to 20px */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#111827',
            margin: 0
          }}>Faculties</h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '4px',
            marginBottom: 0
          }}>Select your faculty to start practicing</p>
        </div>

        {/* Faculty Grid - No extra margin bottom */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '16px', // Reduced from 20px to 16px
          marginBottom: 0 // Removed bottom margin
        }}>
          <style>{`
            @media (min-width: 640px) {
              div[data-grid="true"] {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (min-width: 1024px) {
              div[data-grid="true"] {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
          `}</style>
          <div data-grid="true" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '16px' // Consistent gap
          }}>
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
        </div>

        {/* No extra footer or note to minimize bottom gap */}
      </div>
    </div>
  );
}
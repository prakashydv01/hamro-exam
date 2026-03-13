// components/TestimonialsSection.tsx
'use client';

import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  faculty: string;
  rank: string;
  score: string;
  image?: string;
  text: string;
  rating: number;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial; isActive?: boolean }> = ({ 
  testimonial, 
  isActive = true 
}) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      height: '100%',
      position: 'relative',
      transition: 'all 0.3s ease',
      opacity: isActive ? 1 : 0.7,
      transform: isActive ? 'scale(1)' : 'scale(0.95)'
    }}>
      {/* Quote Icon */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        color: '#e5e7eb'
      }}>
        <Quote style={{ width: '40px', height: '40px' }} />
      </div>

      {/* Rating Stars */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '20px'
      }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            style={{
              width: '18px',
              height: '18px',
              fill: i < testimonial.rating ? '#fbbf24' : '#e5e7eb',
              color: i < testimonial.rating ? '#fbbf24' : '#e5e7eb',
              stroke: 'none'
            }}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p style={{
        fontSize: '16px',
        lineHeight: '1.7',
        color: '#4b5563',
        margin: '0 0 24px 0',
        fontStyle: 'italic',
        position: 'relative',
        zIndex: 1,
        paddingRight: '20px'
      }}>
        "{testimonial.text}"
      </p>

      {/* Student Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Avatar */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: testiMonialsColors[testimonial.id % testiMonialsColors.length],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: 600,
          flexShrink: 0
        }}>
          {testimonial.name.charAt(0)}
        </div>

        {/* Details */}
        <div>
          <h4 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 4px 0'
          }}>{testimonial.name}</h4>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 2px 0'
          }}>{testimonial.faculty}</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}>
            <span style={{
              backgroundColor: '#f3f4f6',
              padding: '2px 8px',
              borderRadius: '12px',
              color: '#4b5563'
            }}>Rank: {testimonial.rank}</span>
            <span style={{
              backgroundColor: '#f3f4f6',
              padding: '2px 8px',
              borderRadius: '12px',
              color: '#4b5563'
            }}>Score: {testimonial.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const testiMonialsColors = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#dc2626', '#4f46e5'];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    faculty: 'BIT',
    rank: '12',
    score: '98.5%',
    text: 'The practice questions are incredibly similar to the actual exam. I attempted all mock tests and they helped me manage my time effectively during the real exam.',
    rating: 5
  },
  {
    id: 2,
    name: 'Rahul Thapa',
    faculty: 'Bsc.CSIT',
    rank: '8',
    score: '96.2%',
    text: 'The analytics feature helped me identify my weak areas in Mathematics. I focused on them and saw a huge improvement in my scores within weeks.',
    rating: 5
  },
  {
    id: 3,
    name: 'Sneha KC',
    faculty: 'IOE',
    rank: '15',
    score: '94.8%',
    text: 'Best platform for BIT entrance preparation. The detailed explanations for each question helped me understand concepts deeply, not just memorize answers.',
    rating: 5
  },
  {
    id: 4,
    name: 'Amit Gurung',
    faculty: 'BIM',
    rank: '21',
    score: '92.3%',
    text: 'I loved the mock test environment. It felt exactly like the real exam. The timer and interface helped me stay calm and focused during the actual test.',
    rating: 4
  },
  {
    id: 5,
    name: 'Nisha Rai',
    faculty: 'BCA',
    rank: '9',
    score: '95.7%',
    text: 'The practice mode with instant feedback was a game-changer. I could learn from my mistakes immediately and track my progress over time.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Get visible testimonials (current and next two for desktop)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({
        ...testimonials[index],
        isActive: i === 1 // Middle card is active
      });
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div style={{
      padding: '80px 0',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 16px 0'
          }}>
            What Our Students Say
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Join thousands of successful students who cracked BIT entrance with our platform
          </p>
        </div>

        {/* Stats Summary */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb' }}>5,000+</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Happy Students</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#7c3aed' }}>95%</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Success Rate</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#059669' }}>4.8/5</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ea580c' }}>50+</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Top Ranks</div>
          </div>
        </div>

        {/* Testimonials Carousel - Desktop */}
        <div style={{
          display: 'none',
          position: 'relative'
        }}>
          <style>{`
            @media (min-width: 768px) {
              div[data-testimonials-desktop="true"] {
                display: block !important;
              }
            }
          `}</style>
          <div data-testimonials-desktop="true" style={{
            display: 'none',
            position: 'relative'
          }}>
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              }}
            >
              <ChevronLeft style={{ width: '20px', height: '20px', color: '#4b5563' }} />
            </button>

            <button
              onClick={nextTestimonial}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              }}
            >
              <ChevronRight style={{ width: '20px', height: '20px', color: '#4b5563' }} />
            </button>

            {/* Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px'
            }}>
              {visibleTestimonials.map((testimonial, index) => (
                <div key={testimonial.id} style={{
                  transition: 'all 0.5s ease',
                  opacity: testimonial.isActive ? 1 : 0.5,
                  transform: testimonial.isActive ? 'scale(1)' : 'scale(0.9)'
                }}>
                  <TestimonialCard testimonial={testimonial} isActive={testimonial.isActive} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials - Mobile */}
        <div style={{
          display: 'block'
        }}>
          <style>{`
            @media (min-width: 768px) {
              div[data-testimonials-mobile="true"] {
                display: none !important;
              }
            }
          `}</style>
          <div data-testimonials-mobile="true" style={{
            display: 'block'
          }}>
            <TestimonialCard testimonial={testimonials[currentIndex]} isActive={true} />
            
            {/* Mobile Navigation Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px'
            }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === currentIndex ? '#2563eb' : '#d1d5db',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Mobile Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '16px'
            }}>
              <button
                onClick={prevTestimonial}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#4b5563',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
                Previous
              </button>
              <button
                onClick={nextTestimonial}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#4b5563',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Next
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          marginTop: '60px',
          flexWrap: 'wrap',
          opacity: 0.7
        }}>
          {['Topper\'s Choice', 'Trusted by 5000+', '95% Success Rate', 'Best Preparation'].map((badge, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Star style={{ width: '16px', height: '16px', fill: '#fbbf24', color: '#fbbf24' }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
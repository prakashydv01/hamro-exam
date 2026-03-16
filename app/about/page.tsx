// app/about/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { 
  Award, 
  BookOpen, 
  Target, 
  Users, 
  Clock, 
  Shield, 
  BarChart, 
  Globe,
  ChevronRight,
  CheckCircle,
  Star
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Hamro Exam",
  description: "Learn about Hamro Exam - your trusted platform for mock tests, exam preparation, and academic success.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Students Through 
              <span className="block text-yellow-300 mt-2">Quality Assessment</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Hamro Exam is revolutionizing the way students prepare for their Entrance exams 
              by providing realistic mock tests, instant feedback, and detailed analytics.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/dashboard/mocktest" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl inline-flex items-center"
              >
                Start Practicing
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#features" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="fill-current text-white" viewBox="0 0 1440 120">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "5K+", icon: Users },
              { label: "Mock Tests", value: "unlimited", icon: BookOpen },
              { label: "Questions", value: "10K+", icon: Target },
              { label: "Success Rate", value: "95%", icon: Award },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Hamro Exam, we believe that every student deserves access to quality 
                assessment tools that help them excel in their academic journey. Our mission 
                is to democratize exam preparation by providing free, high-quality mock tests 
                that simulate real exam conditions.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We combine technology with educational expertise to create an engaging 
                learning experience that identifies strengths, highlights areas for improvement, 
                and builds confidence in students.
              </p>
              <div className="space-y-4">
                {[
                  "Provide realistic exam simulation",
                  "Deliver instant feedback and analytics",
                  "Make quality education accessible to all",
                  "Continuously improve based on student feedback"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Using a reliable Unsplash image directly */}
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students studying together"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-yellow-900 p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="font-semibold">Years of Excellence in Education</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Hamro Exam?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to ace your exams with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Real-Time Testing",
                description: "Experience real exam conditions with timed tests that simulate the actual environment.",
                color: "blue"
              },
              {
                icon: BarChart,
                title: "Detailed Analytics",
                description: "Get comprehensive performance reports with insights into your strengths and weaknesses.",
                color: "green"
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description: "Your data is safe with us. We use industry-standard encryption and security measures.",
                color: "purple"
              },
              {
                icon: Globe,
                title: "Multi-Subject Coverage",
                description: "Access tests across various subjects and faculties all in one place.",
                color: "yellow"
              },
              {
                icon: Users,
                title: "Community Learning",
                description: "Join thousands of students preparing together and sharing knowledge.",
                color: "red"
              },
              {
                icon: Award,
                title: "Expert Curated",
                description: "All tests are designed by experienced educators and subject matter experts.",
                color: "indigo"
              }
            ].map((feature, index) => {
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
                purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
                yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white",
                red: "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white",
                indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
              };
              
              return (
                <div 
                  key={index}
                  className="group p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section - Using UI Avatars */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate educators and technologists working together to transform education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Prakash Yadav",
                role: "Founder & CEO",
                bio: "Professional technology enthusiast with a passion for education",
                color: "3b82f6"
              },
              {
                name: "Michael Chen",
                role: "Head of Product",
                bio: "EdTech innovator passionate about student success",
                color: "10b981"
              },
              {
                name: "Prof. Emily Williams",
                role: "Curriculum Director",
                bio: "Expert in exam preparation and assessment design",
                color: "8b5cf6"
              },
              {
                name: "David Kumar",
                role: "Lead Developer",
                bio: "Building scalable platforms for millions of students",
                color: "f59e0b"
              }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 inline-block">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-white overflow-hidden">
                      {/* Using UI Avatars for consistent placeholder images */}
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.color}&color=fff&size=128&bold=true`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied students who have improved their scores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "BIT Aspirant",
                quote: "The mock tests are incredibly realistic. They helped me understand the exam pattern and manage time effectively.",
                color: "ec4899"
              },
              {
                name: "Rahul Verma",
                role: "IOE Aspirant",
                quote: "Detailed analytics after each test showed me exactly where I need to focus. Improved my score by 30%!",
                color: "8b5cf6"
              },
              {
                name: "Anita Patel",
                role: "CSIT Aspirant",
                quote: "Best platform for practice tests. The questions are relevant and the interface is user-friendly.",
                color: "14b8a6"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl relative">
                <div className="absolute -top-4 left-8 text-6xl text-blue-200">"</div>
                <div className="relative">
                  <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-0.5">
                        <div className="w-full h-full rounded-full bg-white overflow-hidden">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=${testimonial.color}&color=fff&size=48&bold=true`}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
     
    </div>
  );
}
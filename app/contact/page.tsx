// app/contact/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Globe,
  Building,
  ChevronRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Hamro Exam",
  description: "Get in touch with Hamro Exam. Find our address, email, phone numbers and office hours.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Email */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-3">General Inquiries</p>
              <a 
                href="mailto:info@hamroexam.com" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                hamroexam@gmail.com
              </a>
              
             
            </div>

            {/* Phone */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-600 mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-3">Main Office</p>
              <a 
                href="tel:+977-9809612558" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                +977 9809612558
              </a>
              
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full text-purple-600 mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Sunday - Thursday</p>
                <p className="font-medium text-gray-900">9:00 AM - 5:00 PM</p>
                <p>Friday - Saturday</p>
                <p className="font-medium text-gray-900">Closed</p>
              </div>
            </div>

            {/* Website */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full text-yellow-600 mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Website</h3>
              <p className="text-gray-600 mb-3">Main Site</p>
              <a 
                href="https://www.hamroexam.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                www.hamroexam.com
              </a>
              
            </div>
          </div>
        </div>
      </section>

      {/* Map & Address Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Address */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Headquarters</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Hamro Exam <br />
                      New Baneshwor <br />
                      Kathmandu 44600<br />
                      Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                   
                  </div>
                  
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Need immediate assistance?</h4>
                  <p className="text-blue-800">
                    Our support team typically responds within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                {/* Using a static map image from a reliable source */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80"
                  alt="Map illustration"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-lg p-4 text-center">
                    <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Kathmandu, Nepal</p>
                    <p className="text-sm text-gray-600">Main Office</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow us on social media for updates, tips, and announcements
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Facebook", icon: "📘", url: "https://facebook.com/hamroexam", color: "bg-blue-600" },
              
              { name: "Instagram", icon: "📷", url: "https://instagram.com/hamroexam", color: "bg-pink-600" },
              
              { name: "YouTube", icon: "▶️", url: "https://youtube.com/@hamroexam", color: "bg-red-600" },
              { name: "Telegram", icon: "📱", url: "https://t.me/hamroexam", color: "bg-blue-500" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center space-x-2`}
              >
                <span className="text-xl">{social.icon}</span>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How quickly do you respond to emails?",
                a: "We typically respond to all inquiries within 24-48 hours during business days."
              },
              {
                q: "Do you provide phone support on weekends?",
                a: "Phone support is available Sunday-Thursday from 9 AM to 5 PM. For weekend inquiries, please email us."
              },
              {
                q: "Is there a physical office I can visit?",
                a: "Yes, our main office in Kathmandu is open during business hours. We recommend scheduling an appointment."
              },
              {
                q: "How can I report a technical issue?",
                a: "For technical issues, please email support@hamroexam.com with details about the problem."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 ml-7">{faq.a}</p>
              </div>
            ))}
          </div>

          
        </div>
      </section>

      {/* Quick Response Note */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">We're Here to Help</h2>
          <p className="text-blue-100 mb-6">
            Whether you have a question about our services, need technical support, 
            or want to provide feedback, our team is ready to assist you.
          </p>
          <div className="text-sm text-blue-200">
            <p>Response time: Within 24-48 hours on business days</p>
          </div>
        </div>
      </section>
    </div>
  );
}
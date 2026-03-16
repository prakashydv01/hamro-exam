// app/privacy-policy/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  Mail,
  ChevronRight,
  FileText,
  Users,
  Settings,
  AlertCircle,
    Globe,
    Building
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Hamro Exam",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Last updated: March 14, 2026
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { name: "Information We Collect", href: "#information" },
              { name: "How We Use Data", href: "#usage" },
              { name: "Data Security", href: "#security" },
              { name: "Your Rights", href: "#rights" },
              { name: "Contact Us", href: "#contact" },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Hamro Exam, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform, website, and services. 
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
                policy, please do not access the site.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. 
                We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. 
                You are encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>
            </div>

            {/* Information We Collect */}
            <div id="information" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Database className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Personal Data
                  </h3>
                  <p className="text-gray-600 mb-3">
                    While using our Service, we may ask you to provide us with certain personally identifiable 
                    information that can be used to contact or identify you. Personally identifiable information 
                    may include, but is not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Educational institution and faculty</li>
                    <li>Academic records and test performance data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-blue-600" />
                    Usage Data
                  </h3>
                  <p className="text-gray-600 mb-3">
                    We may also collect information that your browser sends whenever you visit our Service 
                    or when you access the Service by or through a mobile device. This Usage Data may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Your computer's Internet Protocol address (e.g., IP address)</li>
                    <li>Browser type and browser version</li>
                    <li>The pages of our Service that you visit</li>
                    <li>The time and date of your visit</li>
                    <li>The time spent on those pages</li>
                    <li>Unique device identifiers and other diagnostic data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Test and Performance Data
                  </h3>
                  <p className="text-gray-600">
                    When you take mock tests on our platform, we collect and store your answers, scores, 
                    time taken, and performance analytics. This data is used to provide you with insights 
                    about your progress and to improve our testing algorithms.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div id="usage" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Hamro Exam uses the collected data for various purposes:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "To provide and maintain our Service",
                  "To notify you about changes to our Service",
                  "To allow you to participate in interactive features",
                  "To provide customer support",
                  "To gather analysis or valuable information to improve our Service",
                  "To monitor the usage of our Service",
                  "To detect, prevent and address technical issues",
                  "To provide you with personalized test recommendations"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Security */}
            <div id="security" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                The security of your data is important to us. We implement a variety of security measures 
                to maintain the safety of your personal information:
              </p>
              
              <div className="bg-purple-50 rounded-xl p-6 mb-4">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using SSL/TLS technology.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Access Control:</strong> Strict access controls and authentication procedures protect your data from unauthorized access.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Regular Backups:</strong> We perform regular backups to prevent data loss.</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-gray-600">
                However, remember that no method of transmission over the Internet or method of electronic 
                storage is 100% secure. While we strive to use commercially acceptable means to protect your 
                personal information, we cannot guarantee its absolute security.
              </p>
            </div>

            {/* Cookies Policy */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                  <Cookie className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Cookies Policy</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to track the activity on our Service and 
                hold certain information. Cookies are files with a small amount of data which may include 
                an anonymous unique identifier.
              </p>
              
              <p className="text-gray-600 mb-4">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
              
              <p className="text-gray-600">
                We use cookies for the following purposes:
              </p>
              
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>To keep you logged in to your account</li>
                <li>To remember your preferences</li>
                <li>To analyze how you use our platform</li>
                <li>To improve your user experience</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div id="rights" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                You have certain rights regarding your personal information:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Access</h3>
                  <p className="text-gray-600">You have the right to request copies of your personal data.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Rectification</h3>
                  <p className="text-gray-600">You have the right to request that we correct any information you believe is inaccurate.</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Erasure</h3>
                  <p className="text-gray-600">You have the right to request that we erase your personal data, under certain conditions.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Restrict Processing</h3>
                  <p className="text-gray-600">You have the right to request that we restrict the processing of your personal data.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Data Portability</h3>
                  <p className="text-gray-600">You have the right to request that we transfer the data we collected to another organization.</p>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                We may employ third-party companies and individuals to facilitate our Service, provide the 
                Service on our behalf, perform Service-related services, or assist us in analyzing how our 
                Service is used.
              </p>
              
              <p className="text-gray-600">
                These third parties have access to your Personal Data only to perform these tasks on our 
                behalf and are obligated not to disclose or use it for any other purpose. We use:
              </p>
              
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>Google Analytics for traffic analysis</li>
                <li>Payment processors for subscription handling</li>
                <li>Cloud service providers for data storage</li>
                <li>Email service providers for communication</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Children's Privacy</h2>
              </div>
              
              <p className="text-gray-600">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally 
                identifiable information from anyone under the age of 13. If you are a parent or guardian and 
                you are aware that your child has provided us with Personal Data, please contact us. If we become 
                aware that we have collected Personal Data from children without verification of parental consent, 
                we take steps to remove that information from our servers.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Changes to This Privacy Policy</h2>
              </div>
              
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy. 
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
                Policy are effective when they are posted on this page.
              </p>
            </div>

            {/* Contact Us */}
            <div id="contact" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">hamroexam1@gmail.com</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <a href="https://www.hamroexam.com/contact" className="text-blue-600 hover:underline">
                      www.hamroexam.com/contact
                    </a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">
                      Hamro Exam <br />
                      New Baneshwor, Kathmandu 44600, Nepal
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Consent */}
            <div className="border-t pt-8">
              <h3 className="font-semibold text-gray-900 mb-2">By using our service, you consent to our privacy policy.</h3>
              <p className="text-gray-600">
                If you do not agree with this policy, please do not use our website or services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      
    </div>
  );
}
// app/terms-of-service/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { 
  FileText,
  Scale,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  UserCheck,
  Ban,
  Globe,
  Mail,
  Building,
  ChevronRight,
  Shield,
  BookOpen,
  Clock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Hamro Exam",
  description: "Read our terms of service to understand the rules and regulations for using Hamro Exam platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <FileText className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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
              { name: "Acceptance of Terms", href: "#acceptance" },
              { name: "User Accounts", href: "#accounts" },
              { name: "Acceptable Use", href: "#use" },
              { name: "Intellectual Property", href: "#ip" },
              { name: "Limitation of Liability", href: "#liability" },
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms of Service constitute a legally binding agreement made between you, whether personally 
                or on behalf of an entity ("you") and Hamro Exam Education Pvt. Ltd. ("we," "us," or "our"), 
                concerning your access to and use of the Hamro Exam website and mobile application as well as any 
                other media form, media channel, mobile website or mobile application related, linked, or otherwise 
                connected thereto (collectively, the "Site").
              </p>
              <p className="text-gray-600 leading-relaxed">
                You agree that by accessing the Site, you have read, understood, and agree to be bound by all of 
                these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE 
                EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div id="acceptance" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                If you are using our services on behalf of an organization, you represent and warrant that you have the authority 
                to bind that organization to these Terms.
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 mt-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Important Notice:
                </h3>
                <p className="text-blue-800">
                  We reserve the right to change or modify these Terms at any time. We will provide notice of significant 
                  changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued 
                  use of our services after such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* User Accounts */}
            <div id="accounts" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">User Accounts and Registration</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Creation</h3>
                  <p className="text-gray-600 mb-3">
                    To access certain features of our platform, you may be required to create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Keep your password confidential and secure</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Be responsible for all activities that occur under your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Termination</h3>
                  <p className="text-gray-600">
                    We reserve the right to suspend or terminate your account at our sole discretion, without notice, 
                    for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, 
                    or for any other reason. You may terminate your account at any time by contacting our support team.
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptable Use Policy */}
            <div id="use" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Acceptable Use Policy</h2>
              </div>
              
              <p className="text-gray-600 mb-4">You agree not to use our platform to:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  "Violate any applicable laws or regulations",
                  "Impersonate any person or entity",
                  "Engage in unauthorized access to our systems",
                  "Interfere with the proper functioning of the platform",
                  "Upload or transmit viruses or malicious code",
                  "Attempt to bypass our security measures",
                  "Share account credentials with others",
                  "Use automated scripts to access the platform",
                  "Harass, abuse, or harm another person",
                  "Collect user information without consent"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                  <Ban className="h-5 w-5 mr-2" />
                  Prohibited Activities
                </h3>
                <p className="text-red-800">
                  Any violation of these acceptable use policies may result in immediate termination of your account 
                  and legal action. We reserve the right to investigate and take appropriate legal action against 
                  anyone who violates these provisions.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div id="ip" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Intellectual Property Rights</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Our Content</h3>
                  <p className="text-gray-600 mb-3">
                    The Site, including its source code, databases, functionality, software, website designs, audio, video, 
                    text, photographs, and graphics (collectively, the "Content") and the trademarks, service marks, and logos 
                    contained therein (the "Marks") are owned or controlled by us or licensed to us.
                  </p>
                  <p className="text-gray-600">
                    The Content and Marks are provided on the Site "AS IS" for your information and personal use only. 
                    Except as expressly provided in these Terms, no part of the Site and no Content or Marks may be copied, 
                    reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, 
                    transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your Content</h3>
                  <p className="text-gray-600">
                    By submitting questions, answers, or other content to our platform (including test responses and performance data), 
                    you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content 
                    for the purpose of providing and improving our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment and Subscription Terms</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free and Paid Services</h3>
                  <p className="text-gray-600">
                    Hamro Exam offers both free and paid subscription services. Paid subscriptions are billed on a recurring 
                    basis (monthly or annually) as selected. You agree to pay all fees associated with your subscription.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cancellation and Refunds</h3>
                  <p className="text-gray-600">
                    You may cancel your subscription at any time through your account settings. No refunds will be provided 
                    for partial subscription periods. Upon cancellation, your access to paid features will continue until the 
                    end of your current billing period.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Price Changes</h3>
                  <p className="text-gray-600">
                    We reserve the right to change our subscription fees at any time. We will provide at least 30 days notice 
                    of any price changes before they take effect.
                  </p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div id="liability" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  To the fullest extent permitted by applicable law, in no event will Hamro Exam Education Pvt. Ltd., 
                  its affiliates, or their licensors, service providers, employees, agents, officers, or directors be 
                  liable for damages of any kind, under any legal theory, arising out of or in connection with your use, 
                  or inability to use, the site, any linked sites, or such other third-party sites, nor any third-party 
                  content, including any direct, indirect, special, incidental, consequential, or punitive damages.
                </p>
                
                <p className="text-gray-600">
                  We do not guarantee that:
                </p>
                
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  <li>The platform will be uninterrupted, timely, secure, or error-free</li>
                  <li>Test results will accurately predict actual exam performance</li>
                  <li>Any errors or defects will be corrected</li>
                  <li>The platform is free of viruses or other harmful components</li>
                </ul>
              </div>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Indemnification</h2>
              </div>
              
              <p className="text-gray-600">
                You agree to defend, indemnify, and hold harmless Hamro Exam Education Pvt. Ltd., its subsidiaries, 
                and affiliates, and their respective officers, agents, partners, and employees, from and against any loss, 
                damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third 
                party due to or arising out of your use of the platform, your violation of these Terms, or your violation 
                of any rights of another.
              </p>
            </div>

            {/* Termination Clause */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <XCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior 
                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                including but not limited to a breach of the Terms.
              </p>
              
              <p className="text-gray-600">
                All provisions of the Terms which by their nature should survive termination shall survive termination, 
                including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
              </div>
              
              <p className="text-gray-600">
                These Terms shall be governed and construed in accordance with the laws of Nepal, without regard to its 
                conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be 
                considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable 
                by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </div>

            {/* Contact Information */}
            <div id="contact" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">Email:</span>
                      <br />
                      <a href="mailto:legal@hamroexam.com" className="text-blue-600 hover:underline">
                        hamroexam1@gmail.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">Website:</span>
                      <br />
                      <a href="https://www.hamroexam.com/contact" className="text-blue-600 hover:underline">
                        www.hamroexam.com/contact
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">Address:</span>
                      <br />
                      Hamro Exam <br />
                      New Baneshwor, Kathmandu 44600, Nepal
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Acknowledgement */}
            <div className="border-t pt-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                By using our service, you acknowledge that you have read these Terms of Service
              </h3>
              <p className="text-gray-600">
                and agree to be bound by all the terms and conditions outlined above. If you do not agree to these Terms, 
                you are not authorized to use our platform or services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      
    </div>
  );
}
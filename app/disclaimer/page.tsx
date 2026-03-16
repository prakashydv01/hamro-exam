// app/disclaimer/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { 
  AlertCircle,
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Info,
  BookOpen,
  HelpCircle,
  Mail,
  Globe,
  Building,
  CheckCircle,
  XCircle,
  ChevronRight,
    Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | Hamro Exam",
  description: "Important disclaimers regarding the use of Hamro Exam platform, test results, and educational content.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Last updated: March 14, 2026
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { name: "General Information", href: "#general" },
              { name: "Test Accuracy", href: "#accuracy" },
              { name: "No Warranty", href: "#warranty" },
              { name: "External Links", href: "#external" },
              { name: "Limitation", href: "#limitation" },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-600 hover:text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
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
            
            {/* Important Notice Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-12 rounded-r-xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-bold text-amber-800 text-lg mb-2">Please Read Carefully</h2>
                  <p className="text-amber-700">
                    This disclaimer governs your use of Hamro Exam platform. By accessing or using our platform, 
                    you acknowledge that you have read, understood, and agree to be bound by this disclaimer. 
                    If you do not agree with any part of this disclaimer, you must not use our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div id="general" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Info className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">General Information Only</h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                The information provided by Hamro Exam Education Pvt. Ltd. ("we," "us," or "our") on 
                https://www.hamroexam.com (the "Site") and our mobile application is for general informational 
                purposes only. All information on the Site and our mobile application is provided in good faith, 
                however we make no representation or warranty of any kind, express or implied, regarding the 
                accuracy, adequacy, validity, reliability, availability, or completeness of any information on 
                the Site or our mobile application.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND 
                INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY 
                INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR 
                MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION 
                IS SOLELY AT YOUR OWN RISK.
              </p>
            </div>

            {/* Test Accuracy Disclaimer */}
            <div id="accuracy" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mock Test and Performance Disclaimer</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-purple-600" />
                    Test Results Are Not Guaranteed
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Our mock tests are designed to help you practice and assess your knowledge. However:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">No Guarantee of Actual Exam Success:</strong> Performance on our mock tests 
                        does not guarantee or predict your performance on actual examinations, certification tests, or academic assessments.
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">Not Official Content:</strong> Our questions and tests are created by our 
                        educators and are not endorsed by or affiliated with any official examination boards, educational institutions, 
                        or certification bodies unless explicitly stated.
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">Variable Difficulty:</strong> The difficulty level of our mock tests may 
                        differ from actual exams. Some tests may be harder, some easier.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-900 mb-3">Educational Purpose Only</h3>
                  <p className="text-purple-800">
                    Our mock tests are provided for educational and practice purposes only. They are intended to help 
                    you identify areas for improvement and build test-taking confidence, not to serve as the sole basis 
                    for your exam preparation.
                  </p>
                </div>
              </div>
            </div>

            {/* No Warranty */}
            <div id="warranty" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">No Warranties</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                THE PLATFORM IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. YOU AGREE THAT YOUR USE OF THE 
                PLATFORM AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE 
                DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE PLATFORM AND YOUR USE THEREOF, 
                INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              
              <p className="text-gray-600">
                WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE PLATFORM'S 
                CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE PLATFORM AND ASSUME NO LIABILITY OR 
                RESPONSIBILITY FOR ANY:
              </p>
              
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
                <li>Errors, mistakes, or inaccuracies of content</li>
                <li>Personal injury or property damage resulting from your access to and use of the platform</li>
                <li>Any unauthorized access to or use of our secure servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from the platform</li>
                <li>Any bugs, viruses, Trojan horses, or the like which may be transmitted to or through the platform by any third party</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available via the platform</li>
              </ul>
            </div>

            {/* External Links Disclaimer */}
            <div id="external" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">External Links Disclaimer</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                The Site and our mobile application may contain (or you may be sent through the Site or our mobile 
                application) links to other websites or content belonging to or originating from third parties or 
                links to websites and features in banners or other advertising. Such external links are not investigated, 
                monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
              </p>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-green-800">
                    <strong className="text-green-900">WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY</strong>{' '}
                    for the accuracy or reliability of any information offered by third-party websites linked through the 
                    site or any website or feature linked in any banner or other advertising. We will not be a party to or 
                    in any way be responsible for monitoring any transaction between you and third-party providers of 
                    products or services.
                  </p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div id="limitation" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                IN NO EVENT SHALL HAMRO EXAM EDUCATION PVT. LTD., ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, 
                SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR 
                PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER 
                INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                <li>Your access to or use of or inability to access or use the platform</li>
                <li>Any conduct or content of any third party on the platform</li>
                <li>Any content obtained from the platform</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              
              <p className="text-gray-600">
                AND WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, 
                WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, EVEN IF A LIMITED REMEDY 
                SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
              </p>
            </div>

            {/* Educational Use Disclaimer */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Educational Use Disclaimer</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Hamro Exam is an educational technology platform designed to provide practice tests and learning 
                resources. We do not offer academic advice, certification, or professional credentials. Any 
                information, test results, or analytics provided should not be construed as professional advice 
                or guarantee of academic success.
              </p>
              
              <p className="text-gray-600">
                Users are encouraged to supplement their preparation with:
              </p>
              
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>Official study materials from recognized educational institutions</li>
                <li>Guidance from qualified teachers and academic advisors</li>
                <li>Official practice tests from examination boards when available</li>
                <li>Comprehensive study programs and textbooks</li>
              </ul>
            </div>

            {/* Professional Relationship */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">No Professional Relationship</h2>
              </div>
              
              <p className="text-gray-600">
                Your use of the platform does not create a teacher-student relationship, professional advisory 
                relationship, or any other special relationship between you and Hamro Exam. The platform is 
                simply a tool to aid your independent study and preparation. Any decisions you make based on 
                your use of the platform are your own responsibility.
              </p>
            </div>

            {/* Accuracy of Information */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Accuracy of Information</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                While we strive to ensure the accuracy of all content on our platform, including questions, 
                answers, and explanations, we cannot guarantee that all information is completely accurate, 
                current, or error-free. Educational content may become outdated as curricula change, and 
                human error may occasionally occur in question creation.
              </p>
              
              <p className="text-gray-600">
                If you identify any inaccuracies in our content, please contact us so we can review and 
                correct the information.
              </p>
            </div>

            {/* Geographic Limitations */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Geographic Limitations</h2>
              </div>
              
              <p className="text-gray-600">
                The owner of the platform is based in Nepal. We make no claims that the platform or any of 
                its content is accessible, appropriate, or legally available outside of Nepal. Access to the 
                platform may not be legal by certain persons or in certain countries. If you access the 
                platform from outside Nepal, you do so on your own initiative and are responsible for 
                compliance with local laws.
              </p>
            </div>

            {/* Contact Information */}
            <div id="contact" className="mb-12 scroll-mt-20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                If you have any questions about this Disclaimer, please contact us:
              </p>
              
              <div className="bg-amber-50 rounded-xl p-6">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">Email:</span>
                      <br />
                      <a href="mailto:hamroexam1@gmail.com" className="text-amber-600 hover:underline">
                        hamroexam1@gmail.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">Website:</span>
                      <br />
                      <a href="https://www.hamroexam.com/contact" className="text-amber-600 hover:underline">
                        www.hamroexam.com/contact
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium">Address:</span>
                      <br />
                      <span className="text-amber-600">
                      Hamro Exam <br />
                      New Baneshwor, Kathmandu 44600, Nepal
                        </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Acknowledgement */}
            <div className="border-t pt-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                By using Hamro Exam, you acknowledge that:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>You have read and understood this disclaimer in its entirety</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>You agree to be bound by all the terms and conditions outlined above</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>You accept that your use of the platform is at your own risk</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>You will not hold Hamro Exam liable for any outcomes related to your exam performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      
    </div>
  );
}
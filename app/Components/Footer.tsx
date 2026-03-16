'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCopyright,
  FaBookOpen,
  FaChartLine,
  FaUserGraduate,
  FaHome
} from 'react-icons/fa';
import { SiNextdotjs } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaBookOpen className="text-3xl text-blue-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Hamro Exam
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted partner for exam preparation, mock tests, and academic success. 
              Empowering students with quality education resources.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-all hover:scale-110">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="bg-gray-800 p-2 rounded-lg hover:bg-blue-400 transition-all hover:scale-110">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-all hover:scale-110">
                <FaInstagram className="text-xl" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-all hover:scale-110">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-blue-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home', icon: <FaHome className="inline mr-2" /> },
                
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-2 duration-300"
                  >
                    {link.icon || <span className="inline-block w-4 mr-2" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Exams */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-blue-500 pl-3">
              Popular Exams
            </h3>
            <ul className="space-y-3">
              {[
               
                { href: '/dashboard/mocktest', label: 'Mock Tests', icon: <FaBookOpen className="inline mr-2" /> },
                
                { href: '/dashboard/practice', label: 'Practice', icon: <FaUserGraduate className="inline mr-2" /> },
                
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center hover:translate-x-2 duration-300"
                  >
                    {link.icon || <span className="inline-block w-4 mr-2" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-yellow-500 pl-3">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-yellow-400 mt-1" />
                <span className="text-gray-300">
                  Kathmandu, Nepal<br />
                  New Baneshwor
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <a href="tel:+977-9809612558" className="text-gray-300 hover:text-blue-400">
                  +977-9809612558
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-red-400" />
                <a href="mailto:hamroexam1@gmail.com" className="text-gray-300 hover:text-red-400">
                  hamroexam1@gmail.com
                </a>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FaCopyright className="text-gray-400" />
            <span className="text-gray-400">
              {currentYear} Hamro Exam. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            
            <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
              Disclaimer
            </Link>
            
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-gray-400 text-sm">
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
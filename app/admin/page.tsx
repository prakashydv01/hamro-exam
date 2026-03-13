"use client";

import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <div className="flex items-center mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <p className="text-gray-600">
            Welcome back,{" "}
            <span className="font-semibold text-blue-600">
              {session?.user?.name || "Administrator"}
            </span>
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-13.67 0" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 font-medium">
            ↗ 12% increase
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Questions</p>
              <p className="text-2xl font-bold text-gray-900">567</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 font-medium">
            ↗ 8% increase
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-red-600 font-medium">
            ⬇ 3 pending review
          </div>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/users" 
            className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="p-3 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-13.67 0" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                Manage Users
              </h3>
              <p className="text-sm text-gray-500 mt-1">View and manage user accounts</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a 
            href="/admin/questions" 
            className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
          >
            <div className="p-3 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                Manage Questions
              </h3>
              <p className="text-sm text-gray-500 mt-1">Review and moderate questions</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 ml-auto group-hover:text-green-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a 
            href="/admin/payments" 
            className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <div className="p-3 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                Payments
              </h3>
              <p className="text-sm text-gray-500 mt-1">View and process payments</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 ml-auto group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">New user registered</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-medium">View</span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Question approved</p>
                <p className="text-sm text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">View</span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Payment pending review</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
            <span className="text-sm text-amber-600 font-medium">Review</span>
          </div>
        </div>
      </div>
    </div>
  );
}
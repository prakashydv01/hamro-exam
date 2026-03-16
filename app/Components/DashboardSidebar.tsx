"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const menu = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/practice", label: "Practice", icon: BookOpen },
  { href: "/dashboard/mocktest", label: "Mock Tests", icon: FileText },
  { href: "/dashboard/history", label: "History", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function DashboardSidebar({ userName: propUserName, userEmail: propUserEmail }: DashboardSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use props if provided, otherwise use session
  const userName = propUserName || session?.user?.name || "ARZ FUN";
  const userEmail = propUserEmail || session?.user?.email || "";

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobile, open]);

  // Close sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {/* Minimal Arrow Button to Open Sidebar */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 lg:hidden group"
          aria-label="Open sidebar"
        >
          <div className="relative">
            {/* Arrow button */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:pl-3">
              <ChevronRight size={24} className="animate-pulse" />
            </div>
            
            {/* Small hint text */}
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Open menu
            </span>
          </div>
        </button>
      )}

      {/* Close button when sidebar is open */}
      {isMobile && open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed left-64 top-1/2 -translate-y-1/2 z-50 lg:hidden bg-white border border-gray-200 text-gray-600 p-2 rounded-r-xl shadow-lg hover:bg-gray-50 transition-all duration-300"
          aria-label="Close sidebar"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          style={{ top: '4rem' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gradient-to-b from-white to-gray-50/50
          border-r border-gray-200
          w-64
          shrink-0
          transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed z-40 top-16 left-0 h-[calc(100vh-4rem)] shadow-2xl
               ${open ? "translate-x-0" : "-translate-x-full"}`
            : "sticky top-0 hidden lg:block h-screen"}
        `}
      >
        {/* Desktop User Profile */}
        {!isMobile && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-sm text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex flex-col h-[calc(100%-120px)]">
          <nav className="flex-1 p-4 space-y-1">
            {menu.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || 
                            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center justify-between
                    px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${active
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${active ? "bg-indigo-100" : "bg-gray-100 group-hover:bg-gray-200"}`}>
                      <Icon size={18} className={active ? "text-indigo-600" : "text-gray-600"} />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {active && <ChevronRight size={16} className="text-indigo-500" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="
                w-full
                flex items-center justify-between
                px-4 py-3
                rounded-xl
                text-red-600
                hover:bg-red-50
                hover:text-red-700
                transition-all duration-200
                group
              "
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </div>
              <span className="text-xs text-red-400 group-hover:text-red-500">
                {session?.user?.email ? "Signed in" : ""}
              </span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <p className="text-xs text-gray-500 text-center">
            v1.0.0 • Dashboard
          </p>
        </div>
      </aside>
    </>
  );
}
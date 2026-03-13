"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Bell,
  LogOut,
  Book,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

/* ================= TYPES ================= */
interface UserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/* ================= HEADER ================= */
export default function Header() {
  const { data: session, status } = useSession();
  const user: UserData | null = session?.user || null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(
          'button[aria-label="Toggle menu"]'
        )
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= ROUTE CHANGE ================= */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/dashboard", label: "Mock Test", icon: <BookOpen size={18} /> },
    { href: "/dashboard", label: "Practice", icon: <Book size={18} /> },
    
  ];

  // Hide user dropdown when not logged in
  if (status === "loading") {
    return (
      <header className="bg-white border-b border-gray-100" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-2 w-20 bg-gray-100 rounded mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white border-b border-gray-100"
      }`}
      style={{ backgroundColor: 'white' }}
    >
      {/* Force white theme even in dark mode */}
      <style jsx>{`
        header {
          background-color: white !important;
        }
        @media (prefers-color-scheme: dark) {
          header {
            background-color: white !important;
          }
          header a, header button, header div {
            color: inherit;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ================= LOGO WITH PNG ================= */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 relative overflow-hidden rounded-lg">
              <Image
                src="/image/Hamro-Exam.png"
                alt="HamroExam Logo"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Hamro<span className="text-blue-600">Exam</span>
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight">Entrance Prep</p>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition-all text-xs font-medium ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center">
            {/* ================= MOBILE MENU BTN ================= */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="lg:hidden fixed inset-x-0 top-14 bottom-0 bg-white z-40 overflow-y-auto animate-in slide-in-from-top duration-200"
            style={{ backgroundColor: 'white' }}
          >
            <div className="p-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              {/* Only show logout in mobile menu when logged in */}
              {user && (
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-600 rounded-md hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
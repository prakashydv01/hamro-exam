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
  Book,
  BarChart2,
  ListChecks,
  BookMarked,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

/* ================= TYPES ================= */
interface UserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/* ================= NAV ITEMS ================= */
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/mocktest", label: "Mock Test", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Book },
  { href: "/notes", label: "Notes", icon: BookMarked },
  { href: "/syllabus", label: "Syllabus", icon: ListChecks },
  { href: "/model-questions", label: "Model Questions", icon: BarChart2 },
];

/* ================= HEADER ================= */
export default function Header() {
  const { data: session, status } = useSession();
  const user: UserData | null = session?.user ?? null;
  const isAuthLoading = status === "loading";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Click outside to close ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !toggleBtnRef.current?.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Close menu on route change ── */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  /* ── Body scroll lock on mobile menu ── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* ── Logout ── */
  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full bg-white
          transition-shadow duration-200
          ${isScrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative overflow-hidden rounded-lg ring-1 ring-gray-100 group-hover:ring-blue-200 transition-all">
                <Image
                  src="/image/Hamro-Exams.svg"
                  alt="HamroExam Logo"
                  width={36}
                  height={36}
                  className="object-cover"
                  priority
                />
              </div>
              <div className="leading-tight">
                <p className="text-[15px] sm:text-base font-bold text-gray-900 tracking-tight">
                  Hamro<span className="text-blue-600">Exam</span>
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                  Entrance Prep
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium
                    transition-all duration-150 whitespace-nowrap
                    ${
                      isActive(href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon size={15} strokeWidth={isActive(href) ? 2.2 : 1.8} />
                  {label}
                </Link>
              ))}
            </nav>

            {/* ── Right: auth + hamburger ── */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop logout — only when logged in */}
              {!isAuthLoading && user && (
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                ref={toggleBtnRef}
                onClick={() => setIsMenuOpen((v) => !v)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {/* Backdrop */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
          transition-opacity duration-200
          ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        ref={menuRef}
        className={`
          lg:hidden fixed top-14 left-0 right-0 z-50
          bg-white border-b border-gray-100
          shadow-xl rounded-b-2xl
          transition-all duration-250 ease-out origin-top
          overflow-hidden
          ${isMenuOpen ? "opacity-100 scale-y-100 max-h-[calc(100vh-3.5rem)]" : "opacity-0 scale-y-95 max-h-0"}
        `}
        style={{ transformOrigin: "top center" }}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          {/* Nav links */}
          <div className="px-3 pt-3 pb-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive(href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-lg
                    ${isActive(href) ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}
                  `}
                >
                  <Icon size={15} strokeWidth={isActive(href) ? 2.2 : 1.8} />
                </span>
                <span className="leading-tight">{label}</span>
                {isActive(href) && (
                  <ChevronRight size={14} className="ml-auto text-blue-400" />
                )}
              </Link>
            ))}
          </div>

          {/* Divider + Auth */}
          {!isAuthLoading && user && (
            <div className="px-3 pb-4 pt-1 border-t border-gray-100 mt-1">
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name ?? "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-400">
                  <LogOut size={15} />
                </span>
                Sign out
              </button>
            </div>
          )}

          {/* Login CTA when not logged in */}
          {!isAuthLoading && !user && (
            <div className="px-3 pb-4 pt-1 border-t border-gray-100 mt-1">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
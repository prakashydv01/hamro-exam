"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  AlertCircle,
  Chrome,
  CheckCircle
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "User already exists");
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">MCQ<span className="text-blue-600">Master</span></h1>
              <p className="text-gray-500 text-xs">Create Account</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Chrome size={18} className="text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-3">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 leading-tight">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Quick Benefits */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="text-blue-600 mb-1" size={14} />
              <span className="text-xs text-gray-700 text-center">Free MCQs</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
              <CheckCircle className="text-purple-600 mb-1" size={14} />
              <span className="text-xs text-gray-700 text-center">Mock Tests</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600 mb-1" size={14} />
              <span className="text-xs text-gray-700 text-center">Analytics</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
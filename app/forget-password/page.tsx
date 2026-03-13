"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch("/api/forget-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg("If this email exists, a reset link has been sent.");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Forgot password?</h1>
          <p className="text-gray-600 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>

            {msg && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm">{msg}</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      {/* Background gradient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-orange-600/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-t from-teal-600/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/logos/logo-icon-64.png"
              alt="CampusBIB"
              className="h-10 w-10"
            />
            <span className="text-2xl text-slate-100 tracking-wide">
              <span className="font-light">Campus</span>
              <span className="font-bold">BIB</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {sent ? "Check your email" : "Reset your password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 shadow-xl shadow-black/20">
          {sent ? (
            // Success state
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Reset link sent!</p>
                <p className="text-slate-400 text-sm mt-2">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="text-white font-medium">{email}</span>.
                  <br />
                  Check your inbox and click the link to set a new password.
                </p>
              </div>
              <p className="text-slate-500 text-xs">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-orange-400 hover:text-orange-300 cursor-pointer"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            // Form state
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <p className="text-sm text-slate-400">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01]"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

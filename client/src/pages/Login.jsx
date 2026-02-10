/**
 * Login.jsx — Glassmorphism login/register page
 * 
 * Matches the new design system: Slate-950 background,
 * indigo accents, glassmorphism card, subtle gradients.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import FinMindLogo from "../components/FinMindLogo";
import ParticleBackground from "../components/ParticleBackground";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Support ?register=true from landing page
  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsRegister(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050d1a] text-white">
      {/* Interactive particle background */}
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <FinMindLogo className="h-10" />
          </div>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500">
            <Sparkles size={12} className="text-cyan-400" />
            AI-powered finance management
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800/60 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-6 shadow-xl backdrop-blur-md">
          <h2 className="mb-5 text-base font-semibold text-slate-200">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  strokeWidth={2}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  strokeWidth={2}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs text-slate-500 transition-colors hover:text-indigo-400"
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 transition-colors hover:text-indigo-400"
          >
            <ArrowLeft size={12} />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

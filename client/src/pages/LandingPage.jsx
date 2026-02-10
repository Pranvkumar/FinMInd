/**
 * LandingPage.jsx — Marketing landing page for FinMind
 *
 * Deep navy + cyan/teal theme matching the FinMind logo.
 * Features interactive particle background that reacts to mouse,
 * hero section with logo, feature highlights, and CTA.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ScanLine,
  BarChart3,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";
import FinMindLogo from "../components/FinMindLogo";

const features = [
  {
    icon: Sparkles,
    title: "AI Categorization",
    description:
      "Type a description and our AI instantly categorizes your expense — Food, Transport, Entertainment, and more.",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/10",
  },
  {
    icon: ScanLine,
    title: "Receipt Scanner",
    description:
      "Upload a receipt or transaction screenshot. Gemini Vision extracts amount, merchant, and date automatically.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/10",
  },
  {
    icon: MessageSquare,
    title: "Financial Coach",
    description:
      'Chat with an AI that knows your spending patterns. Ask questions like "How much did I spend on food this month?"',
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Spending Analytics",
    description:
      "Beautiful charts showing your 7-day spending pulse, monthly totals, and per-transaction averages.",
    color: "text-teal-400",
    bg: "bg-teal-500/15",
    border: "border-teal-500/10",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#050d1a] text-white">
      {/* Interactive particle background — fixed behind everything */}
      <ParticleBackground />

      {/* Content layer */}
      <div className="relative z-10">
        {/* ── Navbar ──────────────────────────── */}
        <nav className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050d1a]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <FinMindLogo className="h-9" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:text-white sm:px-4"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/login?register=true")}
                className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 sm:px-5"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Radial glow behind hero */}
          <div className="pointer-events-none absolute left-1/2 top-16 h-96 w-200 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-20 text-center sm:px-6 md:pt-28">
            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <FinMindLogo className="h-14 sm:h-18 md:h-22" />
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl"
            >
              Your finances,{" "}
              <span className="bg-linear-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                understood by AI
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-5 max-w-2xl text-sm text-slate-400 sm:text-base md:text-lg"
            >
              Track expenses, scan receipts, and get personalized financial
              advice — all powered by AI. FinMind categorizes every transaction,
              answers your money questions, and helps you spend smarter.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <button
                onClick={() => navigate("/login?register=true")}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-cyan-400 hover:shadow-xl hover:shadow-cyan-500/25"
              >
                Start for Free
                <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-xl border border-slate-600/50 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-500/30 hover:bg-white/5"
              >
                See Features
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Features Grid ──────────────────── */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold md:text-3xl">
              Everything you need to{" "}
              <span className="text-cyan-400">master your money</span>
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Built with the latest AI models, designed for humans.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className={`group rounded-2xl border bg-[#0a1628]/60 p-6 backdrop-blur-md transition-all hover:bg-[#0d1f3c]/80 ${feature.border}`}
              >
                <div
                  className={`mb-4 inline-flex rounded-xl ${feature.bg} p-2.5`}
                >
                  <feature.icon
                    size={20}
                    className={feature.color}
                    strokeWidth={2}
                  />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-slate-200">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────── */}
        <section className="border-t border-cyan-500/10 bg-[#0a1628]/80">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-2xl font-bold md:text-3xl"
            >
              Ready to take control?
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="mt-3 text-sm text-slate-500"
            >
              Join FinMind — it takes 10 seconds to sign up.
            </motion.p>
            <motion.button
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              onClick={() => navigate("/login?register=true")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-cyan-400 hover:shadow-xl hover:shadow-cyan-500/25"
            >
              Create Free Account
              <ArrowRight size={16} strokeWidth={2} />
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;

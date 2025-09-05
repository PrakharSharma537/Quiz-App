// src/pages/Dashboard.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DIFFS = ["easy", "medium", "hard", "mixed"];
const AMOUNTS = [10, 15, 20, 25, 30];
const SOURCES = [
  { label: "Open Trivia API", value: "api" },
  { label: "Local JSON", value: "local" },
];

// Local demo categories (must match localBank.js keys)
const CATEGORIES = [
  {
    slug: "gk",
    title: "General Knowledge",
    color: "from-violet-600/30 via-fuchsia-500/20 to-indigo-500/20",
    icon: (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20 text-pink-300 text-xl">
        🧠
      </span>
    ),
  },
  {
    slug: "js",
    title: "JavaScript",
    color: "from-slate-600/30 via-sky-500/20 to-indigo-500/20",
    icon: (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 text-xl">
        💻
      </span>
    ),
  },
  {
    slug: "science",
    title: "Science",
    color: "from-emerald-600/30 via-teal-500/20 to-cyan-500/20",
    icon: (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 text-xl">
        🧪
      </span>
    ),
  },
  {
    slug: "sports",
    title: "Sports",
    color: "from-amber-600/30 via-orange-500/20 to-rose-500/20",
    icon: (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 text-xl">
        🏟️
      </span>
    ),
  },
 
  {
    slug: "history",
    title: "History",
    color: "from-purple-600/30 via-fuchsia-500/20 to-slate-500/20",
    icon: (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 text-xl">
        📜
      </span>
    ),
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  // quick start controls
  const [qsCategory, setQsCategory] = useState(""); // '' means mixed
  const [qsDifficulty, setQsDifficulty] = useState("mixed");
  const [qsAmount, setQsAmount] = useState(10);
  const [qsSource, setQsSource] = useState("local");

  const queryForQuickStart = useMemo(() => {
    const p = new URLSearchParams();
    p.set("source", qsSource);            // "api" | "local"
    if (qsCategory) p.set("slug", qsCategory); // local slug
    p.set("amount", String(qsAmount));
    p.set("difficulty", qsDifficulty);
    return `/quiz?${p.toString()}`;
  }, [qsSource, qsCategory, qsAmount, qsDifficulty]);

  const handleQuickStart = () => {
    navigate(queryForQuickStart);
  };

  const startLocalCategory = (slug) => {
    // fixed 20 questions for category cards
    navigate(`/quiz?source=local&slug=${slug}&amount=20&difficulty=mixed`);
  };

  return (
    <div className="min-h-[100svh] bg-[#0e1320] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <p className="text-center text-slate-400 mb-6">
          “The beautiful thing about learning is that no one can take it away from you.”
          — <span className="italic">B.B. King</span>
        </p>

        {/* Quick Start */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-4 md:p-6 mb-10">
          <div className="grid md:grid-cols-4 gap-3">
            {/* Category (local slugs) */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Category
              </label>
              <select
                value={qsCategory}
                onChange={(e) => setQsCategory(e.target.value)}
                className="w-full rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 px-3 py-2"
              >
                <option value="">—</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Difficulty
              </label>
              <select
                value={qsDifficulty}
                onChange={(e) => setQsDifficulty(e.target.value)}
                className="w-full rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 px-3 py-2 capitalize"
              >
                {DIFFS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Questions
              </label>
              <select
                value={qsAmount}
                onChange={(e) => setQsAmount(Number(e.target.value))}
                className="w-full rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 px-3 py-2"
              >
                {AMOUNTS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Source
              </label>
              <select
                value={qsSource}
                onChange={(e) => setQsSource(e.target.value)}
                className="w-full rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 px-3 py-2"
              >
                {SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Open Trivia API = live questions • Local JSON = curated demo sets per category (20 Qs).
            </span>
            <button
              onClick={handleQuickStart}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Start
            </button>
          </div>
        </div>

        {/* Categories */}
        <h3 className="text-xl font-semibold mb-4">Explore categories</h3>
        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => startLocalCategory(c.slug)}
              className={`group text-left rounded-2xl border border-slate-700/50 bg-gradient-to-tr ${c.color} p-4 md:p-5 hover:border-slate-600 transition-colors`}
            >
              <div className="flex items-start gap-4">
                {c.icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{c.title}</h4>
                    <span className="text-[10px] rounded-full bg-indigo-600/70 text-white px-2 py-1">
                      20 Qs
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    Start 20 questions
                  </p>

                  <div className="mt-3 inline-flex items-center text-indigo-300 group-hover:text-indigo-200">
                    Start quiz
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

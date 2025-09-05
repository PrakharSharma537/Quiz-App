import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_OPTIONS } from "../utils/categoryMap";
import TextEffect from '../components/TextEffect'

export default function Home() {
  const navigate = useNavigate();

  // Quick Start preferences
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState("mixed");
  const [source, setSource] = useState("api");

  useEffect(() => {
    // Load saved prefs (optional)
    const pref = JSON.parse(localStorage.getItem("quiz:prefs") || "{}");
    if (pref.amount) setAmount(pref.amount);
    if (pref.difficulty) setDifficulty(pref.difficulty);
    if (pref.source) setSource(pref.source);
  }, []);

  const savePrefs = () => {
    localStorage.setItem(
      "quiz:prefs",
      JSON.stringify({ amount, difficulty, source })
    );
  };

  const startQuiz = () => {
    // save + go
    savePrefs();
    const params = new URLSearchParams({
      amount: String(amount),
      difficulty,
      source,
    });
    navigate(`/quiz?${params.toString()}`);
  };

  const startCategoryQuiz = (catId) => {
    // Minimum 20 questions, API source, mixed difficulty
    const params = new URLSearchParams({
      amount: "20",
      difficulty: "mixed",
      source: "api",
      category: String(catId),
    });
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-indigo-400">
  <TextEffect texts={["Learn Fast.", "Play Faster."]} delay={250} />
</h1>

            <p className="mt-6 text-lg text-slate-300 max-w-2xl">
              10 questions • 30s timer • instant results. Practice, compete, and
              track your progress.
            </p>

            <div className="mt-8 flex gap-6 text-indigo-300">
              <a href="#quickstart" className="hover:text-indigo-200">
                Get started
              </a>
              <a href="#categories" className="hover:text-indigo-200">
                Explore categories
              </a>
            </div>
          </div>

          {/* Quick Start Card */}
          <div
            id="quickstart"
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-white/90 mb-4">
              Quick Start
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Questions
                </label>
                <select
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-lg bg-[#0e1626] border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[5, 10, 15, 20, 25, 30].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg bg-[#0e1626] border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                  <option value="mixed">mixed</option>
                </select>
              </div>

              {/* Source */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-slate-300 mb-1">
                  Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-lg bg-[#0e1626] border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="api">Open Trivia API</option>
                  <option value="local">Local JSON</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={startQuiz}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                Start
              </button>
              <p className="mt-3 text-xs text-slate-400">
                Open Trivia API = live questions • Local JSON = bundled demo
                questions.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-white/10 my-12" />

        {/* Explore Categories */}
        <section id="categories">
          <h3 className="text-xl font-semibold text-white/90 mb-6">
            Explore categories
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c.key}
                onClick={() => startCategoryQuiz(c.id)}
                className="text-left rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition p-5 min-h-[120px] flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="mt-3 text-white/90 font-semibold">{c.label}</div>
                <div className="text-slate-400 text-sm">Start 20 questions</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

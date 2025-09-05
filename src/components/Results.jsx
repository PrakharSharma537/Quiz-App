// src/pages/Results.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const score = state?.score ?? 0;
  const total = state?.total ?? 0;
  const details = state?.details || state?.answers || []; // backwards compatible
  const meta = state?.meta || {};

  // store “best score” for the same settings
  const bestKey = useMemo(() => {
    const src = meta.source || "api";
    const diff = meta.difficulty || "mixed";
    const amt = total || 10;
    const cat = meta.category || "any";
    return `best:${src}:${diff}:${amt}:${cat}`;
  }, [meta, total]);

  const [best, setBest] = useState(() => {
    const v = localStorage.getItem(bestKey);
    return v ? Number(v) : 0;
  });

  useEffect(() => {
    if (score > best) {
      localStorage.setItem(bestKey, String(score));
      setBest(score);
    }
  }, [bestKey, score, best]);

  const retry = () => {
    const src = meta.source === "local" ? "local" : "api";
    const q = new URLSearchParams();
    q.set("source", src);
    if (meta.category) q.set("slug", meta.category);
    if (meta.difficulty) q.set("difficulty", meta.difficulty);
    if (total) q.set("amount", total);
    navigate(`/quiz?${q.toString()}`);
  };

  return (
    <div className="min-h-[100svh] bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Summary header */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 md:p-7 mb-6 flex items-center gap-6">
          <div className="relative w-20 h-20 grid place-items-center rounded-full bg-slate-800">
            <span className="text-lg font-semibold">
              {score}/{total}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">Your result</h1>
            <div className="text-sm text-slate-400">
              Source:{" "}
              <span className="text-slate-200">
                {meta.source === "local" ? "Local JSON" : "Open Trivia API"}
              </span>{" "}
              • Difficulty:{" "}
              <span className="capitalize text-slate-200">
                {meta.difficulty || "mixed"}
              </span>{" "}
              • Questions: <span className="text-slate-200">{total}</span>
              {meta.category && (
                <>
                  {" "}
                  • Category:{" "}
                  <span className="uppercase text-slate-200">
                    {meta.category}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-slate-800 p-4 min-w-[120px] text-right">
            <div className="text-xs text-slate-400">Best (same settings)</div>
            <div className="text-xl font-semibold">
              {best}/{total}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">stored locally</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={retry}
            className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700"
          >
            Home
          </button>
        </div>

        {/* Review */}
        <h2 className="text-lg font-semibold mb-3">Answer review</h2>
        {!details.length ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-slate-400">
            No per-question details available for this attempt.
          </div>
        ) : (
          <div className="space-y-3">
            {details.map((d, i) => {
              const correct =
                (d.selected ?? "").trim() === (d.correct ?? "").trim();
              return (
                <div
                  key={`${d.qid}-${i}`}
                  className={`rounded-xl border p-4 ${
                    correct
                      ? "border-emerald-600/40 bg-emerald-900/20"
                      : "border-rose-600/40 bg-rose-900/20"
                  }`}
                >
                  <div className="text-sm text-slate-400 mb-1">
                    Q{i + 1}
                    {d.category ? ` • ${String(d.category).toUpperCase()}` : ""}
                  </div>
                  <div className="font-medium mb-2">{d.question}</div>
                  <div className="text-sm">
                    <span className="text-slate-400">Your answer: </span>
                    <span className={correct ? "text-emerald-300" : "text-rose-300"}>
                      {d.selected ?? "Skipped"}
                    </span>
                  </div>
                  {!correct && (
                    <div className="text-sm">
                      <span className="text-slate-400">Correct answer: </span>
                      <span className="text-emerald-300">{d.correct}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

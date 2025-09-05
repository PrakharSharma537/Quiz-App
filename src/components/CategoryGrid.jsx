// src/components/CategoryGrid.jsx
import React from "react";

/**
 * Professional category grid.
 * Props:
 *  - items?: { key?, title, emoji, plays, badge? }[]
 *  - onPick?: (category: string) => void
 *  - columns?: Tailwind grid columns classes (override if needed)
 *  - className?: extra classes
 */
const DEFAULT_ITEMS = [
  { key: "General Knowledge", title: "General Knowledge", emoji: "🧠", plays: "128k", badge: "Popular" },
  { key: "JavaScript",        title: "JavaScript",        emoji: "💻", plays: "92k",  badge: "Hot" },
  { key: "Science",           title: "Science",           emoji: "🔬", plays: "76k" },
  { key: "Sports",            title: "Sports",            emoji: "🏟️", plays: "54k" },
  { key: "Geography",         title: "Geography",         emoji: "🌍", plays: "61k" },
  { key: "History",           title: "History",           emoji: "📜", plays: "47k" },
];

export default function CategoryGrid({
  items = DEFAULT_ITEMS,
  onPick,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  className = "",
}) {
  return (
    <div className={`grid gap-4 ${columns} ${className}`}>
      {items.map((c, i) => (
        <CategoryCard
          key={c.key ?? c.title ?? i}
          item={c}
          onClick={() => onPick?.(c.key ?? c.title)}
        />
      ))}
    </div>
  );
}

/* ----------------- Card ----------------- */

function CategoryCard({ item, onClick }) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKey}
      aria-label={`Start ${item.title} quiz`}
      className="
        group relative overflow-hidden rounded-2xl
        border border-white/10 bg-white/[.04] backdrop-blur
        transition duration-200 ease-out
        hover:-translate-y-0.5 hover:bg-white/[.07] hover:shadow-2xl
        focus:outline-none focus:ring-2 focus:ring-brand
      "
    >
      {/* soft gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-2 bg-gradient-to-r from-brand/20 via-fuchsia-500/10 to-pink-500/20 blur-2xl" />
      </div>

      <div className="relative p-5 min-h-[150px] flex items-start gap-3">
        <div className="text-3xl leading-none">{item.emoji}</div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{item.title}</h4>
            {item.badge && (
              <span className="px-2 py-0.5 text-[11px] rounded-full border border-border bg-slate-800/60 text-slate-200">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{item.plays} plays</p>
        </div>

        {/* arrow hint */}
        <div className="self-center opacity-0 group-hover:opacity-100 transition translate-x-2 group-hover:translate-x-0">
          <ArrowIcon className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h12M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

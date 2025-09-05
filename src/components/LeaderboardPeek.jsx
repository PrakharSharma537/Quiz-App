// src/components/LeaderboardPeek.jsx
import React from "react";

/**
 * Leaderboard peek widget.
 * Props:
 *  - items?: Array<{ name: string; score: number; avatar?: string }>
 *  - limit?: number (default 5)
 *  - onViewAll?: () => void
 *  - className?: string
 */
const DEFAULT_ITEMS = [
  { name: "Aarav", score: 10 },
  { name: "Meera", score: 9 },
  { name: "Kabir", score: 9 },
  { name: "Zoya", score: 8 },
  { name: "Ishaan", score: 8 },
];

export default function LeaderboardPeek({
  items = DEFAULT_ITEMS,
  limit = 5,
  onViewAll,
  className = "",
}) {
  const best = Number(localStorage.getItem("quiz_highscore") || 0);
  const data = (items || []).slice(0, limit);

  return (
    <section className={className}>
      <div className="rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur p-5 md:p-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">🏆 Leaderboard</h3>
          <button
            className="btn-secondary"
            onClick={onViewAll || (() => {})}
            aria-label="View full leaderboard"
          >
            View all
          </button>
        </div>

        {/* content */}
        {data.length === 0 ? (
          <p className="text-slate-400 mt-4">No leaderboard data yet.</p>
        ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {/* left: rows */}
            <div className="flex flex-col gap-2">
              {data.map((row, idx) => (
                <Row key={row.name + idx} rank={idx + 1} {...row} />
              ))}
            </div>

            {/* right: your best card */}
            <div className="rounded-xl border border-white/10 bg-white/[.04] p-4">
              <div className="text-sm text-slate-300">Your best</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-extrabold">{best}</div>
                <div className="text-slate-400">/ 10</div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all"
                    style={{ width: `${Math.min(100, (best / 10) * 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Beat your high score to climb the board.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ========== Row ========== */

function Row({ rank, name, score, avatar }) {
  const medal = getMedal(rank);

  return (
    <div
      className="
        group rounded-xl border border-white/10 bg-card/60 backdrop-blur
        px-3 py-2.5 flex items-center gap-3
        hover:bg-card/80 transition
      "
    >
      {/* rank / medal */}
      <div className="w-8 text-center">
        {medal ? (
          <span className={`text-xl ${medal.color}`} title={`Rank ${rank}`}>
            {medal.emoji}
          </span>
        ) : (
          <span className="text-slate-400 font-semibold">{rank}</span>
        )}
      </div>

      {/* avatar */}
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>

      {/* name + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <div className="truncate font-medium text-slate-200">{name}</div>
          <div className="text-sm text-slate-300">
            <b>{score}</b>/10
          </div>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full ${medal ? medal.bar : "bg-slate-500"} transition-all`}
            style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function getMedal(rank) {
  switch (rank) {
    case 1:
      return { emoji: "🥇", color: "text-yellow-400", bar: "bg-yellow-400" };
    case 2:
      return { emoji: "🥈", color: "text-slate-300", bar: "bg-slate-300" };
    case 3:
      return { emoji: "🥉", color: "text-amber-600", bar: "bg-amber-500" };
    default:
      return null;
  }
}


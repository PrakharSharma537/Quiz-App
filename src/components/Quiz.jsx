// src/components/Quiz.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadQuestions } from "../utils/loadQuestions";

// small helper to randomize options
const shuffle = (arr = []) => [...arr].sort(() => Math.random() - 0.5);

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // read query params
  const params = useMemo(() => new URLSearchParams(location.search), [location]);
  const source = params.get("source") || "api"; // "api" | "local"
  const slug = params.get("slug") || ""; // gk | js | science | ...
  const amount = Number(params.get("amount") || 10);
  const difficulty = params.get("difficulty") || "mixed";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState(null);
  const [qs, setQs] = useState([]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null); // selected option string
  const [locked, setLocked] = useState(false); // question resolved (answered or skipped)
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // for results page
  const [timeLeft, setTimeLeft] = useState(30);

  // fetch / (re)build questions
  useEffect(() => {
    let active = true;
    setLoading(true);
    setErr("");

    (async () => {
      try {
        const data = await loadQuestions({
          source,
          amount,
          difficulty,
          category: slug,
        });

        // Normalize incoming rows to a consistent shape
        const normalized = (data.list || data.questions || []).map((row, i) => {
          const correct =
            row.correct ?? row.a ?? row.answer ?? row.correct_answer ?? "";

          // prefer row.options/row.choices if present; otherwise build from OpenTDB fields
          let opts = row.options || row.choices;
          if (!opts) {
            const wrongs = row.incorrect_answers || row.incorrect || [];
            opts = correct ? shuffle([...wrongs, correct]) : [];
          }

          return {
            id: row.id ?? i,
            question: row.q || row.question || row.text || "",
            options: opts,
            correct,
            category: row.category || data?.meta?.category || slug,
            difficulty: row.difficulty || data?.meta?.difficulty || difficulty,
          };
        });

        if (!active) return;

        setQs(normalized);
        setMeta(
          data.meta || {
            source,
            difficulty,
            amount: normalized.length,
            category: slug,
          }
        );

        // reset quiz state
        setIdx(0);
        setScore(0);
        setSelected(null);
        setLocked(false);
        setAnswers([]);
        setTimeLeft(30);
      } catch (e) {
        if (!active) return;
        setErr(e?.message || "Failed to load questions.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, slug, amount, difficulty]);

  // 30s timer with auto-skip
  useEffect(() => {
    if (loading || err || !qs.length) return;

    setTimeLeft(30);
    let cleared = false;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (!cleared && !locked) {
            // auto skip only if still unanswered
            handleSkip(true);
          }
          return 30; // not really used; next question will reset
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      cleared = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, loading, err, qs.length, locked]);

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center text-slate-300">
        Loading quiz…
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-400 font-medium mb-4">Error: {err}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!qs.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-slate-300">
        No questions available.
      </div>
    );
  }

  const current = qs[idx];

  const handleSelect = (opt) => {
    if (locked) return;

    setSelected(opt);
    setLocked(true);

    const isCorrect = (opt ?? "").trim() === (current.correct ?? "").trim();

    setAnswers((prev) => [
      ...prev,
      {
        qid: current.id,
        question: current.question,
        selected: opt,
        correct: current.correct,
        category: current.category,
        autoSkipped: false,
      },
    ]);

    if (isCorrect) setScore((s) => s + 1);
  };

  const goNext = () => {
    // require an answer to use "Next"
    if (selected == null) return;

    setSelected(null);
    setLocked(false);

    if (idx < qs.length - 1) {
      setIdx((i) => i + 1);
    } else {
      // navigate to results
      navigate("/results", {
        state: {
          score,
          total: qs.length,
          answers,
          meta: {
            ...meta,
            finishedAt: Date.now(),
          },
        },
        replace: true,
      });
    }
  };

  const handleSkip = (auto = false) => {
    if (locked && selected != null) return; // already answered; don't skip

    // record as skipped (selected null)
    setAnswers((prev) => [
      ...prev,
      {
        qid: current.id,
        question: current.question,
        selected: null,
        correct: current.correct,
        category: current.category,
        autoSkipped: !!auto,
      },
    ]);

    setLocked(true);

    // move on after a short delay
    setTimeout(() => {
      setSelected(null);
      setLocked(false);
      if (idx < qs.length - 1) {
        setIdx((i) => i + 1);
      } else {
        navigate("/results", {
          state: {
            score,
            total: qs.length,
            answers,
            meta: {
              ...meta,
              finishedAt: Date.now(),
            },
          },
          replace: true,
        });
      }
    }, 150);
  };

  const handlePrev = () => {
    if (idx === 0) return;
    // keep previous record intact (simple flow)
    setIdx((i) => i - 1);
    setSelected(null);
    setLocked(false);
  };

  // styling for options
  const optionClass = (opt) => {
    const base =
      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-colors duration-150";

    if (!locked) {
      // normal selectable state
      return `${base} bg-white/70 hover:bg-white border-slate-300 text-slate-800`;
    }

    // after answer/skip -> show correctness visualization
    const isCorrect = (opt ?? "").trim() === (current.correct ?? "").trim();
    const isSelected = selected === opt;

    if (isCorrect) {
      // always show correct option as green
      return `${base} bg-emerald-50 border-emerald-400 text-emerald-700`;
    }
    if (isSelected && !isCorrect) {
      // selected wrong -> red
      return `${base} bg-rose-50 border-rose-400 text-rose-700`;
    }
    // other (not selected wrong and not correct)
    return `${base} bg-white/60 border-slate-300 text-slate-500`;
  };

  const optionRightIcon = (opt) => {
    if (!locked) return null;
    const isCorrect = (opt ?? "").trim() === (current.correct ?? "").trim();
    const isSelected = selected === opt;

    if (isCorrect) {
      return (
        <span className="ml-3 text-emerald-600 font-semibold" aria-hidden>
          ✓
        </span>
      );
    }
    if (isSelected && !isCorrect) {
      return (
        <span className="ml-3 text-rose-600 font-semibold" aria-hidden>
          ✕
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-sky-400 via-indigo-500 to-indigo-700">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-5 md:p-7">
          {/* header */}
          <div className="flex items-start justify-between gap-4">
            <div className="text-slate-700">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Question {idx + 1} / {qs.length}
              </div>
              <h1 className="mt-1 text-2xl md:text-[28px] font-semibold text-slate-900 leading-snug">
                {current.question}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-full bg-slate-900 text-white text-xs px-3 py-1">
                Score: {score} / {qs.length}
              </div>
              <div className="rounded-full bg-indigo-600 text-white text-xs px-3 py-1">
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* options */}
          <div className="mt-5 grid gap-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={locked && selected !== null} // lock once answered
                className={optionClass(opt)}
              >
                <span className="text-left">{opt}</span>
                {optionRightIcon(opt)}
              </button>
            ))}
          </div>

          {/* actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={idx === 0}
              className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Last Question
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSkip(false)}
                disabled={locked && selected !== null} // if already answered, no skip
                className="px-3 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Skip
              </button>

              <button
                onClick={goNext}
                disabled={selected == null} // ✅ cannot go next without selecting
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {idx === qs.length - 1 ? "Finish" : "Next Question →"}
              </button>
            </div>
          </div>

          {/* footer meta */}
          <div className="mt-4 text-[12px] text-slate-500">
            Source:{" "}
            <span className="text-slate-700 font-medium">
              {meta?.source === "local" ? "Local JSON" : "Open Trivia API"}
            </span>{" "}
            • Difficulty:{" "}
            <span className="capitalize text-slate-700 font-medium">
              {meta?.difficulty || difficulty}
            </span>{" "}
            {current?.category && (
              <>
                • Category:{" "}
                <span className="uppercase text-slate-700 font-medium">
                  {current.category}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

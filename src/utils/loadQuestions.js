// src/utils/loadQuestions.js
// NOTE: adjust the import path if your localBank is at a different place
import { QUESTIONS_BANK } from "../data/localBank";

/** Fisher–Yates shuffle */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Map our local slugs to OpenTDB category ids (if ever needed for API mode)
const OTDB_CATEGORY_BY_SLUG = {
  gk: 9,           // General Knowledge
  js: 18,          // Science: Computers (closest for JS)
  science: 17,     // Science & Nature
  sports: 21,      // Sports
  history: 23,     // History
  geo: 22,         // Geography
};

export async function loadQuestions(opts = {}) {
  const {
    source = "api",           // "api" | "local"
    amount = 10,
    difficulty = "mixed",     // "easy" | "medium" | "hard" | "mixed"
    category = "",            // legacy param
    slug = "",                // our dashboard/links send this
  } = opts;

  const whichSlug = (slug || category || "").trim().toLowerCase();

  // ---------- LOCAL MODE ----------
  if (source === "local") {
    // 1) pick pool strictly from the requested slug
    let pool = [];
    if (whichSlug && QUESTIONS_BANK[whichSlug]) {
      pool = QUESTIONS_BANK[whichSlug].slice();
    } else {
      // if slug is missing/wrong, combine all (rare)
      Object.values(QUESTIONS_BANK).forEach((list) => pool.push(...list));
    }

    // 2) filter by difficulty unless mixed
    let filtered =
      difficulty === "mixed"
        ? pool
        : pool.filter(
            (q) => (q.difficulty || "").toLowerCase() === difficulty
          );

    // 3) shuffle and trim to amount
    filtered = shuffle(filtered).slice(0, amount);

    // 4) normalize
    const list = filtered.map((row, i) => {
      const options = shuffle([
        row.correct_answer,
        ...(row.incorrect_answers || []),
      ]);
      return {
        id: i,
        question: row.question || row.q || "",
        options,
        correct: row.correct_answer,
        category: (row.category || whichSlug || "LOCAL").toUpperCase(),
        difficulty: row.difficulty || "mixed",
      };
    });

    return {
      list,
      meta: {
        source: "local",
        difficulty,
        amount: list.length,
        category: whichSlug || "mixed",
      },
    };
  }

  // ---------- API MODE ----------
  try {
    const params = new URLSearchParams();
    params.set("amount", String(amount));

    if (difficulty && difficulty !== "mixed") {
      params.set("difficulty", difficulty);
    }

    // if user selected a category slug that maps to an OpenTDB category id
    const otdbCat = OTDB_CATEGORY_BY_SLUG[whichSlug];
    if (otdbCat) params.set("category", String(otdbCat));

    const url = `https://opentdb.com/api.php?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenTDB ${res.status}`);

    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];

    // normalize API
    const list = results.map((row, i) => {
      const options = shuffle([
        row.correct_answer,
        ...(row.incorrect_answers || []),
      ]);
      return {
        id: i,
        question: row.question,
        options,
        correct: row.correct_answer,
        category: (row.category || whichSlug || "API").toUpperCase(),
        difficulty: row.difficulty || difficulty,
      };
    });

    return {
      list,
      meta: {
        source: "api",
        difficulty,
        amount: list.length,
        category: whichSlug || "mixed",
      },
    };
  } catch (err) {
    // Fallback to local for API issues — but respect slug!
    console.warn("[loadQuestions] OpenTDB error, falling back to LOCAL:", err?.message);

    const pool = whichSlug && QUESTIONS_BANK[whichSlug]
      ? QUESTIONS_BANK[whichSlug].slice()
      : Object.values(QUESTIONS_BANK).flat();

    let filtered =
      difficulty === "mixed"
        ? pool
        : pool.filter(
            (q) => (q.difficulty || "").toLowerCase() === difficulty
          );

    filtered = shuffle(filtered).slice(0, amount);

    const list = filtered.map((row, i) => {
      const options = shuffle([
        row.correct_answer,
        ...(row.incorrect_answers || []),
      ]);
      return {
        id: i,
        question: row.question || "",
        options,
        correct: row.correct_answer,
        category: (row.category || whichSlug || "LOCAL").toUpperCase(),
        difficulty: row.difficulty || difficulty,
      };
    });

    return {
      list,
      meta: {
        source: "local",
        difficulty,
        amount: list.length,
        category: whichSlug || "mixed",
      },
    };
  }
}

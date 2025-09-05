// src/lib/loadQuestions.js
import localQuestions from "../data/questions.json";

/** Fisher–Yates Shuffle */
const shuffle = (arr) =>
  arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

/** Decode HTML entities returned by Open Trivia DB */
const decodeHTML = (s) =>
  new DOMParser().parseFromString(s, "text/html").body.textContent || s;

/** Normalize Open Trivia DB item to our UI model */
function normalizeOTD(item) {
  const correct = decodeHTML(item.correct_answer);
  const options = shuffle([correct, ...item.incorrect_answers.map(decodeHTML)]);
  return {
    question: decodeHTML(item.question),
    options,
    answerIndex: options.indexOf(correct),
    category: item.category,
    difficulty: item.difficulty,
    source: "api",
  };
}

/** Load from Open Trivia API with tiny retry + 429 detection */
export async function loadFromAPI({ amount = 10, difficulty = "mixed" }) {
  const params = new URLSearchParams({
    amount: String(Math.max(1, Math.min(50, amount))),
    type: "multiple",
  });
  if (["easy", "medium", "hard"].includes(difficulty)) {
    params.set("difficulty", difficulty);
  }
  const url = `https://opentdb.com/api.php?${params.toString()}`;

  const tries = 2; // 1 retry
  let last;
  for (let i = 0; i <= tries; i++) {
    const res = await fetch(url);
    if (res.status === 429) {
      last = new Error("RATE_LIMIT");
      // simple backoff
      await new Promise((r) => setTimeout(r, (i + 1) * 1000));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.response_code !== 0) throw new Error(`API_${data.response_code}`);
    return data.results.map(normalizeOTD);
  }
  if (last) {
    last.code = "RATE_LIMIT";
    throw last;
  }
  throw new Error("API_FAILED");
}

/** Load from bundled local JSON */
export async function loadFromLocal({ amount = 10, difficulty = "mixed" }) {
  let pool = localQuestions;
  if (["easy", "medium", "hard"].includes(difficulty)) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  const slice = Math.max(1, Math.min(amount, pool.length));
  return pool.slice(0, slice).map((q) => ({ ...q, source: "local" }));
}

/** Unified loader with graceful fallback to local on 429 */
export async function loadQuestions(opts) {
  if (opts.source === "local") return loadFromLocal(opts);
  try {
    return await loadFromAPI(opts);
  } catch (e) {
    if (e.code === "RATE_LIMIT") {
      // fallback silently to local
      return await loadFromLocal(opts);
    }
    throw e;
  }
}

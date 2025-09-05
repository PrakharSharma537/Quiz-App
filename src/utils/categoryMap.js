// Open Trivia DB category IDs
export const CATEGORY_OPTIONS = [
  { key: "gk",        label: "General Knowledge", id: 9,  emoji: "🧠" },
  { key: "js",        label: "JavaScript",        id: 18, emoji: "💻" }, // OTDB: Computers
  { key: "science",   label: "Science",           id: 17, emoji: "🔬" }, // Science & Nature
  { key: "sports",    label: "Sports",            id: 21, emoji: "🏟️" },
  { key: "geography", label: "Geography",         id: 22, emoji: "🌍" },
  { key: "history",   label: "History",           id: 23, emoji: "📜" },
];

// Helper: by label -> id
export const categoryIdByLabel = (label) =>
  CATEGORY_OPTIONS.find(c => c.label === label)?.id || "";

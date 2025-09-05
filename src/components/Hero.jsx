// components/Hero.jsx
import { getUser } from "../auth";

export default function Hero({ onStart }) {
  const user = getUser();
  const best = Number(localStorage.getItem("quiz_highscore") || 0);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent pointer-events-none"/>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-white/90 italic text-lg">
          “The beautiful thing about learning is that no one can take it away from you.” – B.B. King
        </p>
        <div className="mt-6 card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold">Welcome {user?.name ? user.name : "Learner"} 👋</h1>
              <p className="text-white/90">Best score: <b>{best}</b> / 10 • Ready to level up?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onStart} className="btn-primary">Start Quiz</button>
              <a href="#quickstart" className="btn-secondary">Choose Options</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

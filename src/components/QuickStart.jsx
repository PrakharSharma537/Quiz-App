// components/QuickStart.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DIFFS = ["mixed","easy","medium","hard"];
const CATS = ["General", "JavaScript", "Science", "History", "Sports", "Geography"];

export default function QuickStart() {
  const nav = useNavigate();
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState("mixed");
  const [category, setCategory] = useState("General");
  const [source, setSource] = useState("api");

  function start() {
    const config = { amount, difficulty, source, category, timer: 30 };
    localStorage.setItem("last_config", JSON.stringify(config));
    nav("/quiz", { state: config });
  }

  return (
    <section id="quickstart" className="max-w-6xl mx-auto px-4">
      <div className="card grid sm:grid-cols-5 gap-3">
        <Field label="Category">
          <select value={category} onChange={e=>setCategory(e.target.value)} className="input"/>
        </Field>
        <Field label="Difficulty">
          <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="input">
            {DIFFS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Questions">
          <input type="number" min={5} max={10} value={amount}
                 onChange={e=>setAmount(+e.target.value)} className="input"/>
        </Field>
        <Field label="Source">
          <select value={source} onChange={e=>setSource(e.target.value)} className="input">
            <option value="api">Open Trivia API</option>
            <option value="local">Local JSON</option>
          </select>
        </Field>
        <div className="flex items-end"><button onClick={start} className="btn-primary w-full">Start</button></div>
        <div className="sm:col-span-5 text-sm text-slate-300">
          You’ll answer <b>{amount}</b> {difficulty} questions (~{Math.ceil(amount*0.5)} min).
        </div>
      </div>
    </section>
  );
}

function Field({label, children}) {
  return <div><label className="text-sm text-slate-300">{label}</label>{children}</div>;
}
// Tailwind helper (put once in index.css)
/* .input { @apply w-full px-3 py-2 rounded-xl bg-slate-900 border border-border focus:outline-none focus:ring-2 focus:ring-brand; } */

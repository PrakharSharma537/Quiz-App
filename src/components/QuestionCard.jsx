export default function QuestionCard({ data, selected, onSelect }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: data.question }} />
      <div className="grid gap-3">
        {data.options.map((opt, i) => {
          const sel = selected === opt;
          return (
            <button key={i}
              className={`opt ${sel ? "opt-selected" : ""}`}
              onClick={()=>onSelect(opt)} aria-pressed={sel}
              dangerouslySetInnerHTML={{ __html: opt }} />
          );
        })}
      </div>
    </div>
  );
}

export default function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 border border-border overflow-hidden">
      <div className="h-full bg-brand transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, clearUser } from "../auth";
import { useState } from "react";

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const textLink = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-border">
      <div className="w-full px-6 md:px-10 h-14 flex items-center gap-4">
        <Link to="/" className="font-extrabold text-xl tracking-wide flex items-center gap-2">
          <span>⚡</span> <span>Quiz App</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={textLink}>Home</NavLink>
          {user && <NavLink to="/dashboard" className={textLink}>Dashboard</NavLink>}
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-slate-300">Hi, {user.name}</span>
              <button
                className="btn-secondary"
                onClick={() => { clearUser(); nav("/", { replace: true }); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={textLink}>Login</NavLink>
              <NavLink
                to="/register"
                className="px-3 py-2 rounded-lg border border-border text-slate-200 hover:bg-slate-800/50"
              >
                Register
              </NavLink>
            </>
          )}
          <Link to="/quiz" className="btn-primary ml-1">Take Quiz</Link>
        </div>

        <button
          className="md:hidden px-3 py-2 rounded-lg border border-border"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur">
          <div className="w-full px-6 md:px-10 py-3 flex flex-col gap-2">
            <NavLink to="/" end className={textLink} onClick={() => setOpen(false)}>Home</NavLink>
            {user && (
              <NavLink to="/dashboard" className={textLink} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/quiz" className={textLink} onClick={() => setOpen(false)}>Quiz</NavLink>

            {user ? (
              <button
                className="btn-secondary"
                onClick={() => { clearUser(); setOpen(false); nav("/", { replace: true }); }}
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className={textLink} onClick={() => setOpen(false)}>Login</NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-2 rounded-lg border border-border text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}

            <Link to="/quiz" className="btn-primary" onClick={() => setOpen(false)}>Take Quiz</Link>
          </div>
        </div>
      )}
    </header>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("Name is required");
    if (!email.trim()) return setErr("Email is required");
    if (!pwd) return setErr("Password is required");
    if (pwd !== cpwd) return setErr("Passwords do not match");

    try {
      setLoading(true);
      // TODO: Replace with your real register API call
      // await api.register({ name, email, password: pwd });

      // ✔ Registration success → go to Login
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50">
      {/* Register card center */}
      <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl p-8 md:p-10">
        <h2 className="text-4xl font-extrabold text-center">Register</h2>
        <p className="mt-2 text-center text-gray-600">
          Join and start your learning journey.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M4 20c0-3.3137 3.5817-6 8-6s8 2.6863 8 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                Full Name
              </span>
            </label>
            <input
              className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M4 7l8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Email Address
              </span>
            </label>
            <input
              type="email"
              className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="9"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M8 11V8a4 4 0 118 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Password
              </span>
            </label>
            <input
              type="password"
              className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="9"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M8 11V8a4 4 0 118 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
              value={cpwd}
              onChange={(e) => setCpwd(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

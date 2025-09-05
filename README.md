# Quiz App (React + Vite + Tailwind)

A clean, responsive quiz application that loads questions from **Open Trivia DB** or **local JSON category packs**. Features single-question flow, scoring, results review, 30s per-question timer with auto-skip, and protected routes.

## ✨ Features
- React + Vite + Tailwind (responsive, modern UI)
- One question at a time (4 options), **Next disabled until you choose**
- **Skip** button + **30s timer** → auto-skip if unanswered
- Score tracking + **Results** page (selected vs correct)
- Data sources:
  - **Open Trivia DB** (live)
  - **Local category packs** (GK, JS, Science, Sports, History, Geography)
- Routing with React Router (`/`, `/dashboard`, `/quiz`, `/results`)
- Basic auth flow (Login/Register) + protected routes

---

## 🧱 Tech Stack
- **React 18+**, **Vite**
- **React Router**
- **Tailwind CSS**

---

## 📁 Project Structure (key folders)
src/
components/
Navbar.jsx
Quiz.jsx
Results.jsx
pages/
Home.jsx
Dashboard.jsx
Login.jsx
Register.jsx
utils/
loadQuestions.js
data/
localBank.js # local category questions (demo packs)
App.jsx
main.jsx

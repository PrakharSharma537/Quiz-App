// Simple localStorage-based auth helpers

export function getUser() {
  const raw = localStorage.getItem("quiz_user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem("quiz_user", JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem("quiz_user");
}

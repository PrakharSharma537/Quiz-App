import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "../auth";

export default function RequireAuth({ children }) {
  const user = getUser();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

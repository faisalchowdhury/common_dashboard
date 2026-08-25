import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "./AuthContext";
import FullPageLoader from "../components/FullPageLoader";

/**
 * Gate for everything inside the dashboard shell.
 *
 * In design mode the session starts signed in, so this passes straight
 * through — it is kept as the seam for a real auth check later.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader label="Checking your session…" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

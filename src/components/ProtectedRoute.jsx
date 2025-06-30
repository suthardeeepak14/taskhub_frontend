import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // ✅ Show spinner or text while loading
  }

  if (!user) {
    console.warn("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

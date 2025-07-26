import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  // Don't render anything until auth status is confirmed
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Only after loading completes, we check for auth
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

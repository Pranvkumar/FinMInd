import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import { Loader2 } from "lucide-react";

/**
 * App.jsx — Root component with react-router
 *
 * Routes:
 *   /          → LandingPage (public)
 *   /login     → Login / Register (redirects to /dashboard if authenticated)
 *   /dashboard → Dashboard (protected, redirects to /login if not authenticated)
 */

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 text-white">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
        <p className="text-sm text-slate-500">Loading FinMind…</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 text-white">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
        <p className="text-sm text-slate-500">Loading FinMind…</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      {/* Login / Register */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all → redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

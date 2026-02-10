/**
 * AuthContext.jsx — Global Authentication State
 * 
 * Provides:
 *   - user object (null when logged out)
 *   - loading state (true while checking auth on mount)
 *   - register(email, password)
 *   - login(email, password)
 *   - logout()
 * 
 * On mount, it calls /auth/refresh to silently restore the session
 * from the httpOnly cookie, so users don't have to log in again.
 */

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

/**
 * Custom hook to consume the AuthContext.
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ──────────────────────────────────────────
  // On mount: try to restore session silently
  // ──────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Attempt to get a new access token from the refresh cookie
        const { data } = await api.post("/auth/refresh");

        if (data.success && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);

          // Fetch the user profile
          const profileRes = await api.get("/auth/me");
          setUser(profileRes.data.user);
        }
      } catch (error) {
        // No valid refresh token — user must log in
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ──────────────────────────────────────────
  // Register a new account
  // ──────────────────────────────────────────
  const register = async (email, password) => {
    const { data } = await api.post("/auth/register", { email, password });

    if (data.success) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
    }

    return data;
  };

  // ──────────────────────────────────────────
  // Log in to an existing account
  // ──────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    if (data.success) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
    }

    return data;
  };

  // ──────────────────────────────────────────
  // Log out (clears token + cookie)
  // ──────────────────────────────────────────
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if the API call fails, clear local state
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  // ──────────────────────────────────────────
  // Delete account permanently
  // ──────────────────────────────────────────
  const deleteAccount = async () => {
    await api.delete("/auth/account");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // ──────────────────────────────────────────
  // Context value
  // ──────────────────────────────────────────
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

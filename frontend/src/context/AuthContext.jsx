import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { parseError } from "../utils/parseError";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // on mount — verify token is still valid by hitting /profile
  useEffect(() => {
    async function rehydrate() {
      if (!token) { setLoading(false); return; }
      try {
        const { user } = await authService.getProfile();
        setUser(user);
      } catch {
        // token expired or invalid — clear it
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    rehydrate();
  }, []);

  async function register(formData) {
    const { accessToken, user } = await authService.register(formData);
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setUser(user);
  }

  async function login(formData) {
    const { accessToken, user } = await authService.login(formData);
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
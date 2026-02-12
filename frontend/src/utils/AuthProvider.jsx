import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define your Backend URL
  const API_BASE_URL = "http://localhost:5000/api/auth";

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setRole(data.user.role);
        } else {
          // Token is likely expired or invalid
          localStorage.removeItem("token");
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login Function
  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setRole(data.user.role);

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  // Signup Function
  const signUp = async (email, password, fullName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  // Signout Function
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: role === "admin",
    isStaff: role === "staff",
    isAdminOrStaff: role === "admin" || role === "staff",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use Auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

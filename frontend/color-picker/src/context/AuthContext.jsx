import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // Check Logged-in User
  // =========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // =========================================
  // Login
  // =========================================

  // const login = (userData) => {
  //   localStorage.setItem("user", JSON.stringify(userData));
  //   setUser(userData);
  // };

  //06/08/2026 {time:  PM}
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
  };

  // =========================================
  // Logout
  // =========================================

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================
// Custom Hook
// =========================================

export function useAuth() {
  return useContext(AuthContext);
}

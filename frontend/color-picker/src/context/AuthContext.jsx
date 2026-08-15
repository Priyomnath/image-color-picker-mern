import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // CHECK LOGGED-IN USER
  // =========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken && storedToken !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  // =========================================
  // LOGIN
  // =========================================

  const login = (userData, token) => {
    if (!userData || !token) {
      console.error("LOGIN ERROR: User data or token missing");

      return false;
    }

    // Save user
    localStorage.setItem("user", JSON.stringify(userData));

    // Save JWT token
    localStorage.setItem("token", token);

    // Update React state
    setUser(userData);

    console.log("AUTH CONTEXT USER:", userData);
    console.log("AUTH CONTEXT TOKEN:", token);
    console.log(
      "TOKEN FROM LOCAL STORAGE:",
      localStorage.getItem("token"),
    );

    return true;
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  // =========================================
  // PROVIDER
  // =========================================

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
// CUSTOM HOOK
// =========================================

export function useAuth() {
  return useContext(AuthContext);
}
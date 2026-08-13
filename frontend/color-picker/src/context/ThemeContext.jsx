import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // =====================================================
  // APPLY THEME
  // =====================================================
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.setAttribute("data-theme", "dark");

      body.classList.remove("light-mode");
      body.classList.add("dark-mode");

      body.style.backgroundColor = "#08090a";
      body.style.color = "#ffffff";
    } else {
      root.setAttribute("data-theme", "light");

      body.classList.remove("dark-mode");
      body.classList.add("light-mode");

      body.style.backgroundColor = "#f8f9fa";
      body.style.color = "#212529";
    }

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // =====================================================
  // TOGGLE THEME
  // =====================================================
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useTheme() {
  return useContext(ThemeContext);
}

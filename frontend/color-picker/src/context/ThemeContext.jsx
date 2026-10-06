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

      body.classList.remove("light-theme");
      body.classList.add("dark-theme");

      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");

      body.classList.remove("dark-theme");
      body.classList.add("light-theme");

      localStorage.setItem("theme", "light");
    }
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
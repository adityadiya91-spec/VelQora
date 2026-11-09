import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  isPrimaryMode: true,
  themeMode: "primary",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isPrimaryMode, setIsPrimaryMode] = useState(() => {
    const saved = localStorage.getItem("velqora_theme_mode");
    return saved !== null ? saved === "primary" : true;
  });

  const themeMode = isPrimaryMode ? "primary" : "orange-white";

  useEffect(() => {
    localStorage.setItem("velqora_theme_mode", isPrimaryMode ? "primary" : "orange-white");
    if (isPrimaryMode) {
      document.documentElement.classList.remove("theme-orange-white");
      document.documentElement.classList.add("theme-primary");
      document.body.style.backgroundColor = "#07090E";
      document.body.style.color = "#FFFFFF";
    } else {
      document.documentElement.classList.remove("theme-primary");
      document.documentElement.classList.add("theme-orange-white");
      document.body.style.backgroundColor = "#F8FAFC";
      document.body.style.color = "#0F172A";
    }
  }, [isPrimaryMode]);

  const toggleTheme = () => {
    setIsPrimaryMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isPrimaryMode, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

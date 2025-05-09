"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-800 text-xl text-yellow-400 focus:outline-none"
      aria-label="Toggle dark/light mode"
      onClick={toggle}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

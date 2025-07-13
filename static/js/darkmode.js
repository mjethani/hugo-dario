"use strict";

const DARK_MODE_COLORS = {
  dark: {
    bg: "#141413",
    text: "#f0efea",
  },
  light: {
    bg: "#f0efea",
    text: "#141413",
  },
};

function setDarkMode(isDarkMode) {
  const initialReadyState = document.readyState;

  // Handle class toggle and color updates in one batch for better performance
  requestAnimationFrame(() => {
    if (initialReadyState !== "complete") {
      // Apply initialization styles just for this paint
      document.documentElement.classList.add("dark-mode-init");

      requestAnimationFrame(() => {
        if (initialReadyState !== "complete") {
          document.documentElement.classList.remove("dark-mode-init");
        }
      });
    }

    document.documentElement.classList.toggle("dark-mode", isDarkMode);
    const colors = isDarkMode ? DARK_MODE_COLORS.dark : DARK_MODE_COLORS.light;

    // Set both properties at once to minimize repaints
    const style = document.documentElement.style;
    style.setProperty("--bg-color", colors.bg);
    style.setProperty("--text-color", colors.text);

    // Update the toggle switch state
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
      darkModeToggle.checked = isDarkMode;
    }
  });
}

function handleDarkModeToggle() {
  const isDarkMode = document.documentElement.classList.contains("dark-mode");
  const newMode = !isDarkMode;

  // Update localStorage and UI state together
  localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
  setDarkMode(newMode);
}

function initDarkMode() {
  // Default to dark mode if not set in localStorage
  if (localStorage.getItem("darkMode") === null) {
    const isSystemInDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    localStorage.setItem("darkMode", isSystemInDark ? "enabled" : "disabled");
  }

  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", handleDarkModeToggle);

    // Check localStorage and set initial state
    const savedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(savedDarkMode === "enabled");
  }

  requestAnimationFrame(() => {
    // Show dark mode toggle switch
    const toggleSwitch = document.querySelector(".toggle-switch");
    if (toggleSwitch)
      toggleSwitch.classList.add("visible");
  });
}

// Use immediate listener setup
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDarkMode);
} else {
  initDarkMode();
}

document.body.classList.add("theme-ready");

const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

toggle?.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore storage errors in privacy-restricted browsers.
  }
});

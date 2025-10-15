class ResumeTheme {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.init();
  }

  init() {
    this.applyTheme();
    document
      .getElementById("theme-toggle")
      .addEventListener("click", () => this.toggleTheme());
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme();
    localStorage.setItem("theme", this.currentTheme);
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    document.getElementById("theme-toggle").innerHTML =
      this.currentTheme === "light" ? "🌙 Theme" : "☀️ Theme";
  }
}

document.addEventListener("DOMContentLoaded", () => new ResumeTheme());

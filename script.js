// ---------- Tema chiaro/scuro ----------
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const label = toggle.querySelector(".theme-label");

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  label.textContent = theme === "dark" ? "Tema chiaro" : "Tema scuro";
}

let saved = null;
try { saved = localStorage.getItem("tema"); } catch (e) { /* storage non disponibile */ }
applyTheme(saved || (systemPrefersDark() ? "dark" : "light"));

toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("tema", next); } catch (e) { /* ignora */ }
});

// ---------- Alone che segue il cursore sulla griglia ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  window.addEventListener("pointermove", (e) => {
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  }, { passive: true });
}

// ---------- Voce di menu attiva durante lo scroll ----------
const links = [...document.querySelectorAll(".side nav a")];
const sections = links
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((a) =>
        a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + entry.target.id))
      );
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((s) => observer.observe(s));

// ---------- Anno nel footer ----------
document.getElementById("anno").textContent = new Date().getFullYear();
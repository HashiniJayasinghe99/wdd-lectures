// js/ui.js
// ---------------------------------------------------------------
// Shared screen parts used on every page:
//   - the top header (menu, sign in button, progress wheel)
//   - the sign-in pop-up
//   - the progress wheel
//   - small "toast" messages
// ---------------------------------------------------------------

import { MODULE } from "./config.js";
import { isDemoMode } from "./db.js";
import {
  restoreSession,
  signIn,
  getCurrentStudent,
  onAuthChange,
} from "./auth.js";
import { overallProgress } from "./progress.js";

// Pages in subfolders need a different path back to the site root.
// Each page sets it in its <body> tag, e.g. <body data-root="../../">
export function rootPath() {
  return document.body.dataset.root || "./";
}

// ---------------------------------------------------------------
// Start-up: every page calls this first.
// ---------------------------------------------------------------
export async function initPage() {
  try {
    await restoreSession();
  } catch (error) {
    console.error("Could not restore the session:", error);
  }
  renderHeader();
  onAuthChange(renderHeader);
  showDemoBanner();
  return getCurrentStudent();
}

// ---------------------------------------------------------------
// Header
// ---------------------------------------------------------------
function renderHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const root = rootPath();
  const page = document.body.dataset.page;
  const student = getCurrentStudent();

  const links = [
    { id: "home", label: "Home", href: root + "index.html" },
    { id: "leaderboard", label: "Leaderboard", href: root + "leaderboard.html" },
    { id: "profile", label: "My Profile", href: root + "profile.html" },
  ];

  const navHtml = links
    .map((link) => {
      const current = link.id === page ? ' aria-current="page"' : "";
      return `<a href="${link.href}"${current}>${link.label}</a>`;
    })
    .join("");

  let accountHtml = `<button type="button" class="btn btn-primary" id="signin-btn">Sign in</button>`;
  if (student) {
    const percent = overallProgress(student).percent;
    accountHtml = `
      <a class="user-chip" href="${root}profile.html" title="Open my profile">
        ${wheelSVG(percent, { size: 36, stroke: 5, showText: false })}
        <span class="user-chip-text">
          <strong>${escapeHtml(student.displayName)}</strong>
          <small>${student.points} pts</small>
        </span>
      </a>`;
  }

  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="${root}index.html">
        <span class="brand-mark">&lt;/&gt;</span>
        <span>WDD <small>${escapeHtml(MODULE.code)}</small></span>
      </a>
      <nav class="nav" aria-label="Main">${navHtml}</nav>
      <div class="header-account">${accountHtml}</div>
    </div>`;

  const signInButton = document.getElementById("signin-btn");
  if (signInButton) signInButton.addEventListener("click", openLoginModal);
}

function showDemoBanner() {
  if (!isDemoMode || document.getElementById("demo-banner")) return;
  const banner = document.createElement("div");
  banner.id = "demo-banner";
  banner.className = "demo-banner";
  banner.textContent =
    "Demo mode: Firebase is not connected yet, so data is stored only in this browser. " +
    "Try registration numbers DEMO001, DEMO002 or DEMO003.";
  document.body.prepend(banner);
}

// ---------------------------------------------------------------
// Sign-in pop-up
// ---------------------------------------------------------------
export function openLoginModal() {
  if (document.getElementById("login-modal")) return;

  const overlay = document.createElement("div");
  overlay.id = "login-modal";
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <h2 id="login-title">Sign in</h2>
      <p class="muted">Enter your registration number. No password needed.</p>
      <form id="login-form">
        <label for="regno-input">Registration number</label>
        <input id="regno-input" type="text" autocomplete="off" placeholder="e.g. HND-2025-001" required>
        <p class="form-error" id="login-error" role="alert"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="login-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="login-submit">Sign in</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#regno-input");
  const errorBox = overlay.querySelector("#login-error");
  const submitButton = overlay.querySelector("#login-submit");
  input.focus();

  const close = () => overlay.remove();
  overlay.querySelector("#login-cancel").addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close(); // click outside the box
  });
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  overlay.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.textContent = "";
    submitButton.disabled = true;
    submitButton.textContent = "Checking...";

    try {
      const student = await signIn(input.value);
      close();
      showToast(`Welcome, ${student.displayName}!`);
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        errorBox.textContent =
          "We could not find that registration number. Check it, or ask your lecturer.";
      } else if (error.message === "EMPTY") {
        errorBox.textContent = "Please type your registration number.";
      } else {
        console.error(error);
        errorBox.textContent = "Could not reach the database. Check your internet and try again.";
      }
      submitButton.disabled = false;
      submitButton.textContent = "Sign in";
    }
  });
}

// ---------------------------------------------------------------
// Progress wheel (a circle that fills up)
// ---------------------------------------------------------------
export function wheelSVG(percent, { size = 120, stroke = 10, showText = true } = {}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const middle = size / 2;

  return `
    <div class="wheel" style="width:${size}px;height:${size}px" data-circumference="${circumference}">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${percent}% complete">
        <circle class="wheel-track" cx="${middle}" cy="${middle}" r="${radius}" stroke-width="${stroke}" fill="none"/>
        <circle class="wheel-bar" cx="${middle}" cy="${middle}" r="${radius}" stroke-width="${stroke}" fill="none"
          stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          transform="rotate(-90 ${middle} ${middle})"/>
      </svg>
      ${showText ? `<span class="wheel-text" style="font-size:${size * 0.22}px">${percent}%</span>` : ""}
    </div>`;
}

// Changes an existing wheel (it animates smoothly).
export function setWheel(wheelElement, percent) {
  const circumference = Number(wheelElement.dataset.circumference);
  wheelElement.querySelector(".wheel-bar").style.strokeDashoffset =
    circumference * (1 - percent / 100);
  const text = wheelElement.querySelector(".wheel-text");
  if (text) text.textContent = `${percent}%`;
  wheelElement.querySelector("svg").setAttribute("aria-label", `${percent}% complete`);
}

// ---------------------------------------------------------------
// Toast message (small pop-up at the bottom of the screen)
// ---------------------------------------------------------------
export function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("toast-hide"), 3000);
  setTimeout(() => toast.remove(), 3500);
}

// ---------------------------------------------------------------
// Helper: stop typed text from being treated as HTML
// ---------------------------------------------------------------
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

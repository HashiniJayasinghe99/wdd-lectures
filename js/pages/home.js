// js/pages/home.js
// Builds the home page from js/config.js:
// module details, learning outcomes and the lecture list under each one.

import { MODULE, LEARNING_OUTCOMES } from "../config.js";
import { initPage, openLoginModal, wheelSVG, escapeHtml } from "../ui.js";
import { getCurrentStudent, onAuthChange } from "../auth.js";
import { lectureProgress, overallProgress } from "../progress.js";

// ---------- Module details at the top ----------
function renderHero() {
  const student = getCurrentStudent();

  // Right-hand side: progress wheel if signed in, otherwise a sign-in button.
  let progressHtml = `
    <div class="hero-progress">
      <button type="button" class="btn btn-primary" id="hero-signin">Sign in to track progress</button>
    </div>`;
  if (student) {
    const progress = overallProgress(student);
    progressHtml = `
      <div class="hero-progress">
        ${wheelSVG(progress.percent, { size: 130, stroke: 12 })}
        <p>${progress.done} of ${progress.total} items done</p>
      </div>`;
  }

  document.getElementById("hero").innerHTML = `
    <div class="hero-card">
      <div>
        <p class="eyebrow">${escapeHtml(MODULE.unit)} &middot; ${escapeHtml(MODULE.programme)}</p>
        <h1>${escapeHtml(MODULE.name)}</h1>
        <p class="muted">${escapeHtml(MODULE.intro)}</p>
        <div class="hero-meta">
          <div><span>Module code</span><strong>${escapeHtml(MODULE.code)}</strong></div>
          <div><span>Lecturer</span><strong>${escapeHtml(MODULE.lecturer)}</strong></div>
        </div>
      </div>
      ${progressHtml}
    </div>`;

  const signInButton = document.getElementById("hero-signin");
  if (signInButton) signInButton.addEventListener("click", openLoginModal);
}

// ---------- One lecture row ----------
function lectureRowHtml(lecture) {
  const student = getCurrentStudent();
  let progressHtml = "";
  if (student) {
    const progress = lectureProgress(student, lecture);
    progressHtml = wheelSVG(progress.percent, { size: 52, stroke: 6 });
  }

  return `
    <li class="lecture-row">
      <div class="info">
        <span class="session">${escapeHtml(lecture.session)}</span>
        <h4>${escapeHtml(lecture.title)}</h4>
        <p>${escapeHtml(lecture.summary)}</p>
      </div>
      ${progressHtml}
      <a class="btn btn-primary" href="${lecture.page}">Open</a>
    </li>`;
}

// ---------- Learning outcome cards ----------
function renderLearningOutcomes() {
  const html = LEARNING_OUTCOMES.map((lo) => {
    const criteriaHtml = lo.criteria
      .map((code) => `<span class="chip">${escapeHtml(code)}</span>`)
      .join("");

    const lecturesHtml =
      lo.lectures.length > 0
        ? `<ul class="lecture-list">${lo.lectures.map(lectureRowHtml).join("")}</ul>`
        : `<p class="lecture-empty">Lectures for this learning outcome will appear here soon.</p>`;

    return `
      <article class="card lo-card" id="${lo.id}">
        <div class="lo-head">
          <span class="lo-badge">${escapeHtml(lo.id)}</span>
          <div>
            <h3>${escapeHtml(lo.title)}</h3>
            <div class="lo-criteria" aria-label="Assessment criteria">${criteriaHtml}</div>
          </div>
        </div>
        ${lecturesHtml}
      </article>`;
  }).join("");

  document.getElementById("lo-list").innerHTML = html;
}

function renderAll() {
  renderHero();
  renderLearningOutcomes();
}

// ---------- Start ----------
await initPage();
document.getElementById("site-footer").textContent =
  `${MODULE.name} (${MODULE.code}) · ${MODULE.lecturer}`;
renderAll();
onAuthChange(renderAll); // redraw when someone signs in or out

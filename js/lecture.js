// js/lecture.js
// ---------------------------------------------------------------
// Shared behaviour for every lecture page. A lecture's own script
// (for example lectures/lo3/session-01.js) just calls:
//
//   initLecture("s01", { activities, quiz, onReady });
//
// What this does:
//   - fills the left sidebar (progress wheel + contents list with ticks)
//   - counts a reading section as "read" after it has been on screen for a few seconds
//   - turns every <div class="code-lab"> into a live coding activity
//   - turns <div id="quiz"> into the quiz
//   - turns every <div class="task-checklist"> into a tick-box task
// ---------------------------------------------------------------

import { initPage, openLoginModal, showToast, wheelSVG, setWheel, escapeHtml } from "./ui.js";
import { getCurrentStudent, onAuthChange } from "./auth.js";
import { findLecture, lectureProgress, completeItem, isItemDone } from "./progress.js";
import { setupCodeLab } from "./components/code-lab.js";
import { setupQuiz } from "./components/quiz.js";

const READ_SECONDS = 3; // how long a section must stay in view to count as read

export async function initLecture(lectureId, { activities = {}, quiz = [], onReady } = {}) {
  await initPage();

  const lecture = findLecture(lectureId);
  if (!lecture) {
    console.error(`Lecture "${lectureId}" is not listed in js/config.js`);
    return;
  }

  buildSidebar(lecture);
  buildSignInBanner();
  trackReading(lectureId);
  buildCodeLabs(lectureId, activities);
  buildChecklists(lectureId);

  const quizBox = document.getElementById("quiz");
  if (quizBox && quiz.length > 0) setupQuiz(quizBox, lectureId, "quiz", quiz);

  if (onReady) onReady();

  // Keep the sidebar up to date when progress changes or the student signs in/out.
  document.addEventListener("progress-changed", () => refreshSidebar(lecture));
  onAuthChange(() => {
    refreshSidebar(lecture);
    buildSignInBanner();
  });
}

// ---------------------------------------------------------------
// Sidebar: progress wheel and contents list
// ---------------------------------------------------------------
function buildSidebar(lecture) {
  const sidebar = document.getElementById("lecture-sidebar");

  // One entry for every <section data-toc="..."> in the page.
  const sections = Array.from(document.querySelectorAll("main section[data-toc]"));
  const links = sections
    .map((section) => {
      const itemId = section.dataset.item || "";
      return `
        <li>
          <a href="#${section.id}" data-section="${section.id}">
            <span class="tick ${itemId ? "" : "none"}" data-tick="${itemId}"></span>
            <span>${escapeHtml(section.dataset.toc)}</span>
          </a>
        </li>`;
    })
    .join("");

  sidebar.innerHTML = `
    <div class="sidebar-progress">
      ${wheelSVG(0, { size: 72, stroke: 8 })}
      <div>
        <strong>${escapeHtml(lecture.session)}</strong>
        <small id="sidebar-count"></small>
      </div>
    </div>
    <ul class="toc">${links}</ul>`;

  refreshSidebar(lecture);
  highlightCurrentSection(sections);
}

// Updates the wheel, the count and the ticks.
function refreshSidebar(lecture) {
  const student = getCurrentStudent();
  const wheel = document.querySelector("#lecture-sidebar .wheel");
  const count = document.getElementById("sidebar-count");
  if (!wheel || !count) return;

  if (!student) {
    setWheel(wheel, 0);
    count.textContent = "Sign in to track progress";
  } else {
    const progress = lectureProgress(student, lecture);
    setWheel(wheel, progress.percent);
    count.textContent = `${progress.done} of ${progress.total} done`;
  }

  document.querySelectorAll("#lecture-sidebar [data-tick]").forEach((tick) => {
    const itemId = tick.dataset.tick;
    tick.classList.toggle("done", itemId !== "" && isItemDone(lecture.id, itemId));
  });
}

// Highlights the contents link of the section you are reading.
function highlightCurrentSection(sections) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll("#lecture-sidebar .toc a").forEach((a) => {
          a.classList.toggle("active", a.dataset.section === entry.target.id);
        });
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------------
// Sign-in reminder at the top of the lecture
// ---------------------------------------------------------------
function buildSignInBanner() {
  const box = document.getElementById("signin-banner");
  if (!box) return;

  if (getCurrentStudent()) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `
    <div class="signin-banner">
      <p><strong>You are not signed in.</strong> You can still read and practise, but your progress and points will not be saved.</p>
      <button type="button" class="btn btn-primary" id="banner-signin">Sign in</button>
    </div>`;
  document.getElementById("banner-signin").addEventListener("click", openLoginModal);
}

// ---------------------------------------------------------------
// Reading: a "read" section counts after READ_SECONDS on screen
// ---------------------------------------------------------------
function trackReading(lectureId) {
  const sections = document.querySelectorAll('section[data-type="read"]');
  const timers = new Map();      // section id -> timer
  const finished = new Set();    // read sections already counted (or waiting for sign-in)

  async function markRead(section) {
    const itemId = section.dataset.item;
    finished.add(itemId);
    const result = await completeItem(lectureId, itemId);
    if (result.saved) showToast(`Section read: +${result.gained} points`);
    if (result.reason === "not-signed-in") finished.delete(itemId); // try again after sign in
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const id = section.id;
        // "Reading" = at least half of the section, or at least half of the screen, is visible.
        const reading =
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.5);

        if (reading && !timers.has(id) && !finished.has(section.dataset.item)) {
          timers.set(id, setTimeout(() => markRead(section), READ_SECONDS * 1000));
        } else if (!reading && timers.has(id)) {
          clearTimeout(timers.get(id));
          timers.delete(id);
        }
      });
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  sections.forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------------
// Live coding activities
// ---------------------------------------------------------------
function buildCodeLabs(lectureId, activities) {
  document.querySelectorAll(".code-lab").forEach((box) => {
    const itemId = box.dataset.activity;
    if (!activities[itemId]) {
      console.error(`No activity data for "${itemId}"`);
      return;
    }
    setupCodeLab(box, lectureId, itemId, activities[itemId]);
  });
}

// ---------------------------------------------------------------
// Tick-box tasks (for work done outside the page, like drawing a wireframe)
// ---------------------------------------------------------------
function buildChecklists(lectureId) {
  document.querySelectorAll(".task-checklist").forEach((box) => {
    const itemId = box.dataset.activity;
    const boxes = box.querySelectorAll('input[type="checkbox"]');
    const button = box.querySelector(".task-done");
    const status = box.querySelector(".lab-status");

    if (isItemDone(lectureId, itemId)) status.textContent = "You have completed this task.";

    button.addEventListener("click", async () => {
      const allTicked = Array.from(boxes).every((b) => b.checked);
      if (!allTicked) {
        status.className = "lab-status fail";
        status.textContent = "Tick every box when you have done it.";
        return;
      }
      if (!getCurrentStudent()) {
        status.className = "lab-status ok";
        status.textContent = "Well done! Sign in to save your progress and earn points.";
        return;
      }
      const result = await completeItem(lectureId, itemId);
      status.className = "lab-status ok";
      if (result.saved) {
        status.textContent = `Well done! +${result.gained} points`;
        showToast(`Task complete: +${result.gained} points`);
      } else if (result.reason === "already-done") {
        status.textContent = "You had already completed this task.";
      } else {
        status.className = "lab-status fail";
        status.textContent = "Could not save your progress. Try again.";
      }
    });
  });
}

// js/lecture.js
// ---------------------------------------------------------------
// Shared behaviour for every lecture page. A lecture's own script
// (for example lectures/lo3/session-01.js) just calls:
//
//   initLecture("s01", { activities, quiz, onReady });
//
// What this does:
//   - shows ONE section at a time, with Previous / Next buttons
//   - fills the left sidebar (progress wheel + contents list with ticks)
//   - draws the coloured step bar (blue = theory, green = activity, purple = quiz)
//   - counts a theory section as "read" after it has been open for a few seconds
//   - turns every <div class="code-lab"> into a live coding activity
//   - turns <div id="quiz"> into the quiz
//   - turns every <div class="task-checklist"> into a tick-box task
// ---------------------------------------------------------------

import { initPage, openLoginModal, showToast, wheelSVG, setWheel, escapeHtml } from "./ui.js";
import { getCurrentStudent, onAuthChange } from "./auth.js";
import { findLecture, lectureProgress, completeItem, isItemDone } from "./progress.js";
import { setupCodeLab } from "./components/code-lab.js";
import { setupQuiz } from "./components/quiz.js";

const READ_SECONDS = 5; // a theory section counts as read after this many seconds

// data-type in the HTML  ->  name and colour class shown to students
const TYPE_INFO = {
  read: { label: "Theory" },
  activity: { label: "Activity" },
  quiz: { label: "Quiz" },
  info: { label: "Info" }, // sections with no data-type (overview, summary...)
};

function typeOf(section) {
  return section.dataset.type || "info";
}

// ---------------------------------------------------------------
// Start
// ---------------------------------------------------------------
export async function initLecture(lectureId, { activities = {}, quiz = [], onReady } = {}) {
  await initPage();

  const lecture = findLecture(lectureId);
  if (!lecture) {
    console.error(`Lecture "${lectureId}" is not listed in js/config.js`);
    return;
  }

  // Every <section data-toc="..."> is one step.
  const sections = Array.from(document.querySelectorAll("main section[data-toc]"));

  buildSidebar(lecture, sections);
  buildSignInBanner();
  buildCodeLabs(lectureId, activities);
  buildChecklists(lectureId);

  const quizBox = document.getElementById("quiz");
  if (quizBox && quiz.length > 0) setupQuiz(quizBox, lectureId, "quiz", quiz);

  if (onReady) onReady();

  const showStep = buildStepNavigation(lecture, sections);

  // Keep the sidebar up to date when progress changes or the student signs in/out.
  document.addEventListener("progress-changed", () => {
    refreshSidebar(lecture);
    refreshStepBar(lecture, sections);
  });
  onAuthChange(() => {
    refreshSidebar(lecture);
    refreshStepBar(lecture, sections);
    buildSignInBanner();
    startReadTimer(lecture.id, sections[currentIndex]); // count the section they are on after signing in
  });

  // Open the step in the address (#act-links) or the first step.
  const startId = location.hash.slice(1);
  const startIndex = Math.max(0, sections.findIndex((s) => s.id === startId));
  showStep(startIndex, { scroll: false });
}

// ---------------------------------------------------------------
// Step navigation: one section at a time
// ---------------------------------------------------------------
let currentIndex = 0;
let readTimer = null;

function buildStepNavigation(lecture, sections) {
  const main = document.querySelector(".lecture-main");

  // ----- Step bar at the top -----
  const bar = document.createElement("div");
  bar.className = "step-bar";
  bar.innerHTML = `
    <div class="step-meta">
      <span id="step-count"></span>
      <span id="step-type" class="type-tag"></span>
    </div>
    <div class="step-segments" id="step-segments"></div>`;
  const banner = document.getElementById("signin-banner");
  banner.after(bar);

  const segmentsBox = bar.querySelector("#step-segments");
  sections.forEach((section, index) => {
    const segment = document.createElement("button");
    segment.type = "button";
    segment.className = "seg";
    segment.dataset.type = typeOf(section);
    segment.title = `${TYPE_INFO[typeOf(section)].label}: ${section.dataset.toc}`;
    segment.setAttribute("aria-label", segment.title);
    segment.addEventListener("click", () => showStep(index));
    segmentsBox.appendChild(segment);
  });

  // ----- Previous / Next bar at the bottom -----
  const nav = document.createElement("nav");
  nav.className = "step-nav";
  nav.setAttribute("aria-label", "Lecture steps");
  nav.innerHTML = `
    <button type="button" class="nav-btn nav-prev">
      <span class="nav-label">&larr; Previous</span><span class="nav-title"></span>
    </button>
    <button type="button" class="nav-btn nav-next">
      <span class="nav-label">Next &rarr;</span><span class="nav-title"></span>
    </button>`;
  main.appendChild(nav);

  const prevButton = nav.querySelector(".nav-prev");
  const nextButton = nav.querySelector(".nav-next");
  prevButton.addEventListener("click", () => showStep(currentIndex - 1));
  nextButton.addEventListener("click", () => {
    if (currentIndex < sections.length - 1) showStep(currentIndex + 1);
    else location.href = (document.body.dataset.root || "./") + "index.html"; // last step: back to the home page
  });

  // ----- Show one step -----
  function showStep(index, { scroll = true } = {}) {
    if (index < 0 || index >= sections.length) return;
    currentIndex = index;

    sections.forEach((section, i) => (section.hidden = i !== index));
    const section = sections[index];

    // Step bar text
    const info = TYPE_INFO[typeOf(section)];
    document.getElementById("step-count").innerHTML =
      `Step <strong>${index + 1}</strong> of ${sections.length} &middot; ${escapeHtml(section.dataset.toc)}`;
    const typeLabel = document.getElementById("step-type");
    typeLabel.textContent = info.label;
    typeLabel.className = `type-tag type-${typeOf(section)}`;
    typeLabel.hidden = typeOf(section) === "info";

    // Previous / Next buttons
    prevButton.disabled = index === 0;
    prevButton.querySelector(".nav-title").textContent = index > 0 ? sections[index - 1].dataset.toc : "";
    const isLast = index === sections.length - 1;
    nextButton.querySelector(".nav-label").innerHTML = isLast ? "Finished" : "Next &rarr;";
    nextButton.querySelector(".nav-title").textContent = isLast ? "Back to all lectures" : sections[index + 1].dataset.toc;

    refreshStepBar(lecture, sections);
    markActiveInSidebar(section.id);
    history.replaceState(null, "", `#${section.id}`);
    if (scroll) window.scrollTo({ top: 0 });

    startReadTimer(lecture.id, section);
  }

  // Sidebar links and the browser's back button
  window.addEventListener("hashchange", () => {
    const index = sections.findIndex((s) => s.id === location.hash.slice(1));
    if (index !== -1 && index !== currentIndex) showStep(index);
  });

  // Left / right arrow keys (not while typing in an editor or form)
  document.addEventListener("keydown", (event) => {
    const tag = event.target.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (document.getElementById("login-modal")) return;
    if (event.key === "ArrowRight") nextButton.click();
    if (event.key === "ArrowLeft" && !prevButton.disabled) prevButton.click();
  });

  return showStep;
}

// Colours the segments: done steps are brighter, the current step is tallest.
function refreshStepBar(lecture, sections) {
  document.querySelectorAll("#step-segments .seg").forEach((segment, index) => {
    const itemId = sections[index].dataset.item;
    segment.classList.toggle("current", index === currentIndex);
    segment.classList.toggle("done", Boolean(itemId) && isItemDone(lecture.id, itemId));
  });
}

// ---------------------------------------------------------------
// Reading: a theory section counts after READ_SECONDS on screen
// ---------------------------------------------------------------
function startReadTimer(lectureId, section) {
  clearTimeout(readTimer);
  if (!section || section.dataset.type !== "read") return;

  const itemId = section.dataset.item;
  if (isItemDone(lectureId, itemId) || !getCurrentStudent()) return; // nothing to save yet

  readTimer = setTimeout(async () => {
    const result = await completeItem(lectureId, itemId);
    if (result.saved) showToast(`Theory read: +${result.gained} points`);
  }, READ_SECONDS * 1000);
}

// ---------------------------------------------------------------
// Sidebar: progress wheel, colour legend and contents list
// ---------------------------------------------------------------
function buildSidebar(lecture, sections) {
  const sidebar = document.getElementById("lecture-sidebar");

  const links = sections
    .map((section) => {
      const itemId = section.dataset.item || "";
      return `
        <li data-type="${typeOf(section)}">
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
    <ul class="legend-types" aria-label="Colour guide">
      <li><span class="dot dot-theory"></span>Theory: read and learn</li>
      <li><span class="dot dot-activity"></span>Activity: do it yourself</li>
      <li><span class="dot dot-quiz"></span>Quiz: test yourself</li>
    </ul>
    <ul class="toc">${links}</ul>`;

  refreshSidebar(lecture);
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

function markActiveInSidebar(sectionId) {
  document.querySelectorAll("#lecture-sidebar .toc a").forEach((link) => {
    const active = link.dataset.section === sectionId;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "step");
      link.scrollIntoView({ block: "nearest" });
    } else {
      link.removeAttribute("aria-current");
    }
  });
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

    if (isItemDone(lectureId, itemId)) status.textContent = "You have completed this activity.";

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
        showToast(`Activity complete: +${result.gained} points`);
      } else if (result.reason === "already-done") {
        status.textContent = "You had already completed this activity.";
      } else {
        status.className = "lab-status fail";
        status.textContent = "Could not save your progress. Try again.";
      }
    });
  });
}

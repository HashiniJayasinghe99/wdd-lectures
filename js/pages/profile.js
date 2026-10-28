// js/pages/profile.js
// The student's own page: progress wheel, points, editable display name,
// and progress for each lecture.

import { initPage, openLoginModal, showToast, wheelSVG, escapeHtml } from "../ui.js";
import { getCurrentStudent, signOut, notifyChange, onAuthChange } from "../auth.js";
import { updateStudent } from "../db.js";
import { getAllLectures, lectureProgress, overallProgress } from "../progress.js";

const root = document.getElementById("profile-root");

function render() {
  const student = getCurrentStudent();

  // Not signed in: ask them to sign in.
  if (!student) {
    root.innerHTML = `
      <section class="card" style="text-align:center">
        <h1>My Profile</h1>
        <p class="muted">Sign in with your registration number to see your progress.</p>
        <button type="button" class="btn btn-primary" id="profile-signin">Sign in</button>
      </section>`;
    document.getElementById("profile-signin").addEventListener("click", openLoginModal);
    return;
  }

  const overall = overallProgress(student);
  const quizzesTaken = Object.keys(student.scores).length;

  // One row per published lecture.
  const lecturesHtml = getAllLectures()
    .map((lecture) => {
      const progress = lectureProgress(student, lecture);
      return `
        <div class="profile-lecture">
          ${wheelSVG(progress.percent, { size: 64, stroke: 7 })}
          <div class="info">
            <h4>${escapeHtml(lecture.session)}: ${escapeHtml(lecture.title)}</h4>
            <p>${progress.done} of ${progress.total} items done</p>
          </div>
          <a class="btn btn-ghost btn-small" href="${lecture.page}">Open</a>
        </div>`;
    })
    .join("");

  root.innerHTML = `
    <section class="card">
      <div class="profile-top">
        ${wheelSVG(overall.percent, { size: 150, stroke: 14 })}
        <div class="info">
          <h1>${escapeHtml(student.displayName)}</h1>
          <p class="muted">Registration number: ${escapeHtml(student.regNo)}</p>
          <div class="stat-row">
            <div class="stat"><strong>${student.points}</strong><span>points</span></div>
            <div class="stat"><strong>${overall.done}/${overall.total}</strong><span>items done</span></div>
            <div class="stat"><strong>${quizzesTaken}</strong><span>quizzes taken</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>Display name</h2>
      <p class="muted">This is the name shown on the leaderboard. Use any name you like (up to 30 characters).</p>
      <form class="name-form" id="name-form">
        <div class="field-wrap">
          <label for="name-input">Name</label>
          <input id="name-input" type="text" maxlength="30" required value="${escapeHtml(student.displayName)}">
        </div>
        <button type="submit" class="btn btn-primary">Save name</button>
      </form>
      <p class="form-error" id="name-error" role="alert"></p>
    </section>

    <section class="card">
      <h2>My lectures</h2>
      ${lecturesHtml || '<p class="muted">No lectures published yet.</p>'}
    </section>

    <p style="text-align:center"><button type="button" class="btn btn-ghost" id="signout-btn">Sign out</button></p>`;

  document.getElementById("name-form").addEventListener("submit", saveName);
  document.getElementById("signout-btn").addEventListener("click", () => {
    signOut();
    showToast("You have signed out");
  });
}

async function saveName(event) {
  event.preventDefault();
  const student = getCurrentStudent();
  const errorBox = document.getElementById("name-error");
  const newName = document.getElementById("name-input").value.trim();

  if (newName.length === 0 || newName.length > 30) {
    errorBox.textContent = "The name must be between 1 and 30 characters.";
    return;
  }
  errorBox.textContent = "";

  try {
    await updateStudent(student.regNo, { displayName: newName });
    student.displayName = newName;
    notifyChange(); // updates the header and re-draws this page
    showToast("Name saved");
  } catch (error) {
    console.error(error);
    errorBox.textContent = "Could not save your name. Please try again.";
  }
}

// ---------- Start ----------
await initPage();
render();
onAuthChange(render);

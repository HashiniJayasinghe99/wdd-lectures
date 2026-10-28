// js/pages/leaderboard.js
// Shows students ranked by points. Only display names are shown, never registration numbers.

import { getAllStudents } from "../db.js";
import { initPage, showToast, escapeHtml } from "../ui.js";
import { getCurrentStudent, onAuthChange } from "../auth.js";
import { calculatePoints, overallProgress } from "../progress.js";

const SHOW_TOP = 20; // how many rows to show

let rankedStudents = []; // sorted list, filled by loadLeaderboard()

async function loadLeaderboard() {
  const box = document.getElementById("leaderboard");
  box.innerHTML = `<p class="muted" style="padding:16px 0">Loading...</p>`;

  try {
    const students = await getAllStudents();

    // Work out each student's points and progress, then sort (highest first).
    rankedStudents = students
      .map((student) => {
        const safe = { completed: {}, scores: {}, ...student };
        return {
          regNo: student.regNo,
          name: student.displayName || "Student",
          points: calculatePoints(safe),
          percent: overallProgress(safe).percent,
        };
      })
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

    renderTable();
  } catch (error) {
    console.error(error);
    box.innerHTML = `<p class="form-error" style="padding:16px 0">Could not load the leaderboard. Check your internet and try again.</p>`;
  }
}

function renderTable() {
  const me = getCurrentStudent();
  const box = document.getElementById("leaderboard");

  if (rankedStudents.length === 0) {
    box.innerHTML = `<p class="muted" style="padding:16px 0">No students yet.</p>`;
    return;
  }

  // Show the top rows. If I am further down, add my row at the end.
  const rows = rankedStudents.slice(0, SHOW_TOP).map((s, index) => ({ ...s, rank: index + 1 }));
  const myIndex = me ? rankedStudents.findIndex((s) => s.regNo === me.regNo) : -1;
  if (myIndex >= SHOW_TOP) rows.push({ ...rankedStudents[myIndex], rank: myIndex + 1 });

  const rowsHtml = rows
    .map((s) => {
      const isMe = me && s.regNo === me.regNo;
      return `
        <tr class="${isMe ? "me-row" : ""}">
          <td class="rank">${s.rank}</td>
          <td>${escapeHtml(s.name)}${isMe ? " <small>(you)</small>" : ""}</td>
          <td class="points">${s.points}</td>
          <td><div class="bar" title="${s.percent}% complete"><span style="width:${s.percent}%"></span></div></td>
        </tr>`;
    })
    .join("");

  box.innerHTML = `
    <table class="table leaderboard">
      <thead><tr><th>Rank</th><th>Name</th><th>Points</th><th>Progress</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;
}

// ---------- Start ----------
await initPage();
await loadLeaderboard();
onAuthChange(renderTable); // highlight my row after signing in
document.getElementById("refresh-btn").addEventListener("click", async () => {
  await loadLeaderboard();
  showToast("Leaderboard updated");
});

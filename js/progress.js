// js/progress.js
// ---------------------------------------------------------------
// Progress and points.
//
// A student's document stores:
//   completed: { s01_r_design: true, s01_a_headings: true, ... }
//   scores:    { s01_quiz: 7 }     (best quiz score)
//   points:    total points (worked out from the two lists above)
//
// Keys are "<lectureId>_<itemId>", for example "s01_a_headings".
// ---------------------------------------------------------------

import { LEARNING_OUTCOMES, POINTS } from "./config.js";
import { updateStudent } from "./db.js";
import { getCurrentStudent, notifyChange } from "./auth.js";

// ---------- Looking things up in config.js ----------

export function getAllLectures() {
  return LEARNING_OUTCOMES.flatMap((lo) =>
    lo.lectures.map((lecture) => ({ ...lecture, loId: lo.id }))
  );
}

export function findLecture(lectureId) {
  return getAllLectures().find((lecture) => lecture.id === lectureId);
}

export function itemKey(lectureId, itemId) {
  return `${lectureId}_${itemId}`;
}

export function isItemDone(lectureId, itemId) {
  const student = getCurrentStudent();
  return Boolean(student && student.completed[itemKey(lectureId, itemId)]);
}

// ---------- Calculations (they take a student object) ----------

// Progress for one lecture -> { done: 3, total: 14, percent: 21 }
export function lectureProgress(student, lecture) {
  const total = lecture.items.length;
  const done = lecture.items.filter(
    (item) => student.completed[itemKey(lecture.id, item.id)]
  ).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

// Progress across every published lecture.
export function overallProgress(student) {
  let done = 0;
  let total = 0;
  for (const lecture of getAllLectures()) {
    const result = lectureProgress(student, lecture);
    done += result.done;
    total += result.total;
  }
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

// Adds up the points for everything the student has completed.
export function calculatePoints(student) {
  let points = 0;
  for (const lecture of getAllLectures()) {
    for (const item of lecture.items) {
      const key = itemKey(lecture.id, item.id);
      if (item.type === "quiz") {
        points += (student.scores[key] || 0) * POINTS.quizQuestion;
      } else if (student.completed[key]) {
        points += POINTS[item.type];
      }
    }
  }
  return points;
}

// ---------- Saving progress ----------

// Marks an item as done and saves it.
// Returns { saved: true, gained: 10 }  or  { saved: false, reason: "..." }
export async function completeItem(lectureId, itemId) {
  const student = getCurrentStudent();
  if (!student) return { saved: false, reason: "not-signed-in" };

  const key = itemKey(lectureId, itemId);
  if (student.completed[key]) return { saved: false, reason: "already-done" };

  const pointsBefore = student.points;
  student.completed[key] = true;
  student.points = calculatePoints(student);

  try {
    await updateStudent(student.regNo, {
      [`completed.${key}`]: true,
      points: student.points,
    });
  } catch (error) {
    // Saving failed: undo the change so the screen matches the database.
    delete student.completed[key];
    student.points = pointsBefore;
    console.error("Could not save progress:", error);
    return { saved: false, reason: "error" };
  }

  announceChange();
  return { saved: true, gained: student.points - pointsBefore };
}

// Saves a quiz result. Only the BEST score is kept.
export async function saveQuizResult(lectureId, itemId, score) {
  const student = getCurrentStudent();
  if (!student) return { saved: false, reason: "not-signed-in" };

  const key = itemKey(lectureId, itemId);
  const bestBefore = student.scores[key] || 0;
  const pointsBefore = student.points;
  const wasDone = Boolean(student.completed[key]);

  student.scores[key] = Math.max(bestBefore, score);
  student.completed[key] = true;
  student.points = calculatePoints(student);

  try {
    await updateStudent(student.regNo, {
      [`scores.${key}`]: student.scores[key],
      [`completed.${key}`]: true,
      points: student.points,
    });
  } catch (error) {
    student.scores[key] = bestBefore;
    if (!wasDone) delete student.completed[key];
    student.points = pointsBefore;
    console.error("Could not save quiz result:", error);
    return { saved: false, reason: "error" };
  }

  announceChange();
  return { saved: true, gained: student.points - pointsBefore, best: student.scores[key] };
}

// Tell the header and the lecture page that progress changed.
function announceChange() {
  notifyChange();
  document.dispatchEvent(new CustomEvent("progress-changed"));
}

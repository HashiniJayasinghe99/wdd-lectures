// js/auth.js
// ---------------------------------------------------------------
// Login with a registration number only (no password).
// A student can sign in only if you added their registration number
// to the "students" collection in the database.
//
// The signed-in registration number is remembered in the browser
// (localStorage), so students stay signed in on that device.
// ---------------------------------------------------------------

import { getStudent } from "./db.js";

const STORAGE_KEY = "wdd-signed-in-regno";

let currentStudent = null; // null means "not signed in"
const listeners = [];      // functions to call when sign-in state changes

// "hnd/2025/001 " -> "HND-2025-001"  (trim, uppercase, no slashes or spaces)
export function normaliseRegNo(text) {
  return text.trim().toUpperCase().replace(/[\s/]+/g, "-");
}

// Fills in any fields a new student document might be missing.
function buildStudent(regNo, data) {
  return {
    displayName: regNo,
    completed: {},
    scores: {},
    points: 0,
    ...data,
    regNo,
  };
}

export function getCurrentStudent() {
  return currentStudent;
}

// Call this when something about the student changes (name, progress).
export function notifyChange() {
  listeners.forEach((listener) => listener(currentStudent));
}

export function onAuthChange(listener) {
  listeners.push(listener);
}

// Called on every page load: sign the student back in if they were signed in before.
export async function restoreSession() {
  const regNo = localStorage.getItem(STORAGE_KEY);
  if (!regNo) return null;

  const data = await getStudent(regNo);
  if (!data) {
    // The student was removed from the database.
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  currentStudent = buildStudent(regNo, data);
  return currentStudent;
}

// Throws Error("EMPTY") or Error("NOT_FOUND") when the login fails.
export async function signIn(input) {
  const regNo = normaliseRegNo(input);
  if (!regNo) throw new Error("EMPTY");

  const data = await getStudent(regNo);
  if (!data) throw new Error("NOT_FOUND");

  currentStudent = buildStudent(regNo, data);
  localStorage.setItem(STORAGE_KEY, regNo);
  notifyChange();
  return currentStudent;
}

export function signOut() {
  currentStudent = null;
  localStorage.removeItem(STORAGE_KEY);
  notifyChange();
}

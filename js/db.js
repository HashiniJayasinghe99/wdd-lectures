// js/db.js
// ---------------------------------------------------------------
// The ONLY file that talks to the database.
// Other files call getStudent(), updateStudent() and getAllStudents().
//
// Two back-ends:
//   - Firebase Firestore (when firebase-config.js has real keys)
//   - Demo mode (browser localStorage) so you can test without Firebase
//
// Student documents live in the "students" collection.
// The document id is the registration number, for example "HND-2025-001".
// ---------------------------------------------------------------

import { firebaseConfig } from "./firebase-config.js";

export const isDemoMode = firebaseConfig.apiKey.startsWith("YOUR_");

const COLLECTION = "students";
const FIREBASE_VERSION = "10.12.2";

// ---------------------------------------------------------------
// Firebase back-end (loaded only when needed)
// ---------------------------------------------------------------
let firebase = null;

async function loadFirebase() {
  if (firebase) return firebase;
  const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
  const { initializeApp } = await import(`${base}/firebase-app.js`);
  const firestore = await import(`${base}/firebase-firestore.js`);
  const app = initializeApp(firebaseConfig);
  firebase = { db: firestore.getFirestore(app), ...firestore };
  return firebase;
}

// ---------------------------------------------------------------
// Demo back-end (stored in this browser only)
// ---------------------------------------------------------------
const DEMO_KEY = "wdd-demo-database";

function loadDemoDb() {
  const saved = localStorage.getItem(DEMO_KEY);
  if (saved) return JSON.parse(saved);

  // First visit: create three sample students.
  const sample = {
    DEMO001: { displayName: "Demo Student", completed: {}, scores: {}, points: 0 },
    DEMO002: {
      displayName: "Alex",
      completed: { s01_r_design: true, s01_r_wireframe: true, s01_a_headings: true, s01_a_paragraphs: true },
      scores: {},
      points: 24,
    },
    DEMO003: {
      displayName: "Sam",
      completed: { s01_r_design: true, s01_r_html: true, s01_quiz: true },
      scores: { s01_quiz: 7 },
      points: 39,
    },
  };
  saveDemoDb(sample);
  return sample;
}

function saveDemoDb(data) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data));
}

// Firestore accepts keys like "completed.s01_quiz". This helper does the same for demo mode.
function applyChanges(student, changes) {
  for (const [path, value] of Object.entries(changes)) {
    const parts = path.split(".");
    let target = student;
    for (const part of parts.slice(0, -1)) {
      target[part] = target[part] || {};
      target = target[part];
    }
    target[parts[parts.length - 1]] = value;
  }
}

// ---------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------

// Returns the student's data, or null if the registration number is not in the database.
export async function getStudent(regNo) {
  if (isDemoMode) {
    const student = loadDemoDb()[regNo];
    return student ? structuredClone(student) : null;
  }
  const { db, doc, getDoc } = await loadFirebase();
  const snapshot = await getDoc(doc(db, COLLECTION, regNo));
  return snapshot.exists() ? snapshot.data() : null;
}

// Saves only the fields in "changes", for example:
//   updateStudent("HND-001", { displayName: "Kamal", "completed.s01_quiz": true })
export async function updateStudent(regNo, changes) {
  if (isDemoMode) {
    const db = loadDemoDb();
    if (!db[regNo]) throw new Error("NOT_FOUND");
    applyChanges(db[regNo], changes);
    db[regNo].lastActive = Date.now();
    saveDemoDb(db);
    return;
  }
  const { db, doc, updateDoc, serverTimestamp } = await loadFirebase();
  await updateDoc(doc(db, COLLECTION, regNo), { ...changes, lastActive: serverTimestamp() });
}

// Returns every student as a list: [{ regNo, displayName, completed, scores, ... }]
export async function getAllStudents() {
  if (isDemoMode) {
    const db = loadDemoDb();
    return Object.entries(db).map(([regNo, data]) => ({ regNo, ...structuredClone(data) }));
  }
  const { db, collection, getDocs } = await loadFirebase();
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ regNo: d.id, ...d.data() }));
}

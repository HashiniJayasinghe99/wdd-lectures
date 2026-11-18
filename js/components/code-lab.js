// js/components/code-lab.js
// ---------------------------------------------------------------
// A live HTML practice area: students type code on the left and see
// the result on the right. "Check my work" tests the code against a
// list of goals and, if every goal passes, marks the activity done.
//
// An activity is described like this (see lectures/lo3/session-01.js):
//   {
//     instructions: "Text shown above the editor (can contain HTML)",
//     starter: "code that appears in the editor at the start",
//     checks: [ ...goals, see below... ],
//     reflection: { question: "...", minLength: 20 },   // optional
//     prototype: "<html>...</html>",                    // optional: picture of the target result
//     allowScripts: true,                               // optional: let JavaScript run in the preview
//     practiceSubmit: true                              // optional: for form activities (see below)
//   }
//
// practiceSubmit: true lets students press Submit in the preview. The browser's own checks
// (required, min, max, pattern...) run, and if the form is valid a message appears instead of
// the page really being sent anywhere. It also switches scripts on.
//
// Three kinds of goal (check):
//   1. Elements:  { label: "A heading", selector: "h1", min: 1, hasText: true }
//        passes when the page has at least "min" elements matching the CSS selector.
//        hasText: true only counts elements that contain some text.
//   2. CSS rule:  { label: "Blue headings", css: { selector: "h1", property: "color", value: /blue/ } }
//        passes when a <style> rule for that selector sets that property.
//        "property" can be a list of names. "value" (a regular expression) is optional.
//   3. Custom:    { label: "...", test: (page, code) => true or false }
//        "page" is the student's code as a document, "code" is the raw text.
// ---------------------------------------------------------------

import { completeItem, isItemDone } from "../progress.js";
import { getCurrentStudent } from "../auth.js";
import { showToast } from "../ui.js";
import { hasCssRule } from "./css-check.js";

// Added to the end of the preview when practiceSubmit is on. It stops the form from really
// leaving the page and shows a message instead (it only runs when the form passed validation).
const PRACTICE_SUBMIT_SCRIPT =
  "<script>document.addEventListener('submit', function (event) {" +
  "event.preventDefault();" +
  "alert('Practice mode: the form is valid and would be sent now.');" +
  "});<\/script>";

export function setupCodeLab(container, lectureId, itemId, activity) {
  const editorId = `editor-${itemId}`;

  // The preview is sandboxed: it cannot touch this page. Scripts are off unless the activity needs them.
  let sandbox = "allow-popups allow-popups-to-escape-sandbox";
  if (activity.allowScripts) sandbox += " allow-scripts allow-modals";
  if (activity.practiceSubmit) sandbox += " allow-scripts allow-modals allow-forms";

  // The target page only runs scripts when the activity itself needs them (for example a "Hi" button).
  const prototypeSandbox = activity.allowScripts || activity.practiceSubmit ? "allow-scripts allow-modals" : "";
  const prototypeHtml = activity.prototype
    ? `<details class="lab-prototype" open>
         <summary>What your finished page should look like</summary>
         <iframe class="lab-preview lab-prototype-frame" title="Target result" sandbox="${prototypeSandbox}"></iframe>
       </details>`
    : "";

  container.innerHTML = `
    <div class="lab-instructions">${activity.instructions}</div>
    ${prototypeHtml}
    <p class="lab-label" style="margin-top:14px">Your goals</p>
    <ul class="lab-goals"></ul>
    <div class="lab-grid">
      <div>
        <label class="lab-label" for="${editorId}">Your code</label>
        <textarea class="lab-editor" id="${editorId}" spellcheck="false"
          autocapitalize="off" autocomplete="off"></textarea>
      </div>
      <div>
        <span class="lab-label">Live preview</span>
        <iframe class="lab-preview lab-live" title="Preview of your code" sandbox="${sandbox}"></iframe>
      </div>
    </div>
    <div class="lab-reflection" hidden>
      <label class="lab-reflection-question" for="reflection-${itemId}"></label>
      <textarea class="field" id="reflection-${itemId}" rows="3"></textarea>
    </div>
    <div class="lab-actions">
      <button type="button" class="btn btn-success lab-check">Check my work</button>
      <button type="button" class="btn btn-ghost lab-reset">Reset code</button>
      <span class="lab-status" role="status" aria-live="polite"></span>
    </div>`;

  const editor = container.querySelector(".lab-editor");
  const preview = container.querySelector(".lab-live");
  const goalList = container.querySelector(".lab-goals");
  const status = container.querySelector(".lab-status");
  const reflectionBox = container.querySelector(".lab-reflection");
  const reflectionInput = container.querySelector(".lab-reflection textarea");

  // ---------- Target picture (optional) ----------
  if (activity.prototype) {
    container.querySelector(".lab-prototype-frame").srcdoc = activity.prototype;
  }

  // ---------- Goals list (built with textContent so tags like <h1> show as text) ----------
  const goalItems = activity.checks.map((check) => {
    const li = document.createElement("li");
    li.textContent = check.label;
    goalList.appendChild(li);
    return li;
  });

  // ---------- Reflection question (optional) ----------
  if (activity.reflection) {
    reflectionBox.hidden = false;
    container.querySelector(".lab-reflection-question").textContent = activity.reflection.question;
  }

  // ---------- Editor and preview ----------
  editor.value = activity.starter;
  updatePreview();

  let previewTimer;
  editor.addEventListener("input", () => {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(updatePreview, 250); // wait until typing pauses
  });

  // Pressing Tab inserts two spaces instead of leaving the editor.
  editor.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const start = editor.selectionStart;
    editor.setRangeText("  ", start, editor.selectionEnd, "end");
    updatePreview();
  });

  function updatePreview() {
    preview.srcdoc = editor.value + (activity.practiceSubmit ? PRACTICE_SUBMIT_SCRIPT : "");
  }

  container.querySelector(".lab-reset").addEventListener("click", () => {
    editor.value = activity.starter;
    updatePreview();
    goalItems.forEach((li) => (li.className = ""));
    status.className = "lab-status";
    status.textContent = "";
  });

  // ---------- Checking the work ----------
  container.querySelector(".lab-check").addEventListener("click", checkWork);

  // Runs one goal and answers true (passed) or false (not yet).
  function runCheck(check, page) {
    if (check.test) return Boolean(check.test(page, editor.value));

    if (check.css) return hasCssRule(page, check.css.selector, check.css.property, check.css.value);

    let found = Array.from(page.querySelectorAll(check.selector));
    if (check.hasText) found = found.filter((el) => el.textContent.trim().length > 0);
    return found.length >= (check.min || 1);
  }

  async function checkWork() {
    const page = new DOMParser().parseFromString(editor.value, "text/html");

    // Test each goal.
    let passedCount = 0;
    activity.checks.forEach((check, index) => {
      const passed = runCheck(check, page);
      goalItems[index].className = passed ? "ok" : "fail";
      if (passed) passedCount++;
    });

    // Test the reflection answer, if there is one.
    let reflectionOk = true;
    if (activity.reflection) {
      reflectionOk = reflectionInput.value.trim().length >= (activity.reflection.minLength || 20);
    }

    if (passedCount < activity.checks.length) {
      setStatus("fail", `${passedCount} of ${activity.checks.length} goals done. Fix the red items and check again.`);
      return;
    }
    if (!reflectionOk) {
      setStatus("fail", "Code looks good! Now answer the question below (a sentence or two).");
      reflectionInput.focus();
      return;
    }

    // Everything passed.
    await finish();
  }

  async function finish() {
    if (!getCurrentStudent()) {
      setStatus("ok", "Well done, all goals complete! Sign in to save your progress and earn points.");
      return;
    }
    const result = await completeItem(lectureId, itemId);
    if (result.saved) {
      setStatus("ok", `Well done! +${result.gained} points`);
      showToast(`Activity complete: +${result.gained} points`);
    } else if (result.reason === "already-done") {
      setStatus("ok", "Well done! You had already completed this activity.");
    } else {
      setStatus("fail", "Your code is correct, but we could not save your progress. Try again.");
    }
  }

  function setStatus(kind, message) {
    status.className = `lab-status ${kind}`;
    status.textContent = message;
  }

  // If the student already completed this activity, say so.
  if (isItemDone(lectureId, itemId)) {
    setStatus("ok", "You have completed this activity.");
  }
}

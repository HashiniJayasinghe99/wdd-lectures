// js/components/quiz.js
// ---------------------------------------------------------------
// A multiple-choice quiz. Questions are described like this:
//   {
//     question: "What does HTML stand for?",
//     options: ["...", "...", "...", "..."],
//     answer: 1,                       // position of the right option (0 = first)
//     explanation: "Shown after submitting."
//   }
// Students can retry. Only their best score is saved.
// ---------------------------------------------------------------

import { saveQuizResult, itemKey } from "../progress.js";
import { getCurrentStudent } from "../auth.js";
import { POINTS } from "../config.js";
import { showToast, escapeHtml } from "../ui.js";

export function setupQuiz(container, lectureId, itemId, questions) {
  drawQuestions();

  // ---------- Show the questions ----------
  function drawQuestions() {
    const student = getCurrentStudent();
    const best = student ? student.scores[itemKey(lectureId, itemId)] : undefined;

    const questionsHtml = questions
      .map((q, qIndex) => {
        const optionsHtml = q.options
          .map(
            (option, oIndex) => `
            <label class="quiz-option">
              <input type="radio" name="q${qIndex}" value="${oIndex}">
              <span>${escapeHtml(option)}</span>
            </label>`
          )
          .join("");
        return `
          <fieldset class="quiz-question">
            <legend>${qIndex + 1}. ${escapeHtml(q.question)}</legend>
            ${optionsHtml}
            <p class="quiz-explain" hidden></p>
          </fieldset>`;
      })
      .join("");

    container.innerHTML = `
      <p class="muted">${questions.length} questions. Each correct answer earns ${POINTS.quizQuestion} points.
        You can try again; your best score is kept.
        ${best !== undefined ? `<strong>Your best so far: ${best}/${questions.length}.</strong>` : ""}</p>
      <form id="quiz-form-${itemId}">${questionsHtml}
        <div class="lab-actions">
          <button type="submit" class="btn btn-primary">Submit answers</button>
          <span class="lab-status" role="status" aria-live="polite"></span>
        </div>
      </form>`;

    container.querySelector("form").addEventListener("submit", submitQuiz);
  }

  // ---------- Mark the answers ----------
  async function submitQuiz(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.querySelector(".lab-status");

    // Every question must be answered.
    const answers = questions.map((q, i) => form.querySelector(`input[name="q${i}"]:checked`));
    if (answers.some((a) => a === null)) {
      status.className = "lab-status fail";
      status.textContent = "Please answer every question first.";
      return;
    }

    // Mark each question and count the score.
    let score = 0;
    questions.forEach((q, i) => {
      const chosen = Number(answers[i].value);
      const fieldset = form.querySelectorAll(".quiz-question")[i];
      const options = fieldset.querySelectorAll(".quiz-option");

      options[q.answer].classList.add("correct");
      if (chosen === q.answer) {
        score++;
      } else {
        options[chosen].classList.add("wrong");
      }

      const explain = fieldset.querySelector(".quiz-explain");
      explain.textContent = q.explanation;
      explain.hidden = false;
      fieldset.querySelectorAll("input").forEach((input) => (input.disabled = true));
    });

    // Replace the submit button with the result and a retry button.
    const actions = form.querySelector(".lab-actions");
    actions.innerHTML = `
      <span class="quiz-result">You scored ${score} / ${questions.length}</span>
      <button type="button" class="btn btn-ghost" id="quiz-retry-${itemId}">Try again</button>
      <span class="lab-status" role="status" aria-live="polite"></span>`;
    actions.querySelector(`#quiz-retry-${itemId}`).addEventListener("click", drawQuestions);
    const newStatus = actions.querySelector(".lab-status");

    // Save the result.
    if (!getCurrentStudent()) {
      newStatus.textContent = "Sign in to save your score and earn points.";
      return;
    }
    const result = await saveQuizResult(lectureId, itemId, score);
    if (result.saved) {
      newStatus.className = "lab-status ok";
      newStatus.textContent =
        result.gained > 0 ? `+${result.gained} points!` : `Your best score is ${result.best}/${questions.length}.`;
      if (result.gained > 0) showToast(`Quiz saved: +${result.gained} points`);
    } else {
      newStatus.className = "lab-status fail";
      newStatus.textContent = "Could not save your score. Please try again.";
    }
  }
}

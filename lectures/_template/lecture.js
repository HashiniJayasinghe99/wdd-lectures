// lectures/_template/lecture.js
// Copy this file next to your lecture HTML (see the notes in lecture.html).

import { initLecture } from "../../js/lecture.js";

// One entry per live coding activity.
// The key must match data-activity in the HTML and the item id in js/config.js.
const activities = {
  a_one: {
    instructions: `<p>Tell students what to do. You can use HTML here.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Practice</title>
</head>
<body>
  <!-- Students type here -->

</body>
</html>`,
    // A check passes when the code has at least "min" elements matching the CSS selector.
    // Add hasText: true to count only elements that contain some text.
    checks: [
      { label: "A heading: <h1>", selector: "h1", min: 1, hasText: true },
    ],
    // reflection: { question: "Explain in your own words...", minLength: 25 },  // optional
  },
};

// Quiz questions. "answer" is the position of the right option (0 = first).
const quiz = [
  {
    question: "Example question?",
    options: ["Wrong", "Right", "Wrong", "Wrong"],
    answer: 1,
    explanation: "Shown after the student submits.",
  },
];

// Use the lecture id you chose in js/config.js (for example "s02").
initLecture("s02", { activities, quiz });

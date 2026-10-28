// lectures/lo3/session-01.js
// ---------------------------------------------------------------
// Data for Session 01: the activities, the quiz, and the small demo.
// The text of the lecture itself is in session-01.html.
// ---------------------------------------------------------------

import { initLecture } from "../../js/lecture.js";

// ---------------------------------------------------------------
// ACTIVITIES
// The key (a_headings...) must match data-activity in the HTML
// and the item id in js/config.js.
// ---------------------------------------------------------------
const activities = {
  a_headings: {
    instructions: `
      <p>Add headings to the page. <code>&lt;h1&gt;</code> is the most important heading
      and <code>&lt;h6&gt;</code> is the least important.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <h1>Heading 1</h1>
  <!-- Add Heading 2, Heading 3 and Heading 4 below this line -->

</body>
</html>`,
    checks: [
      { label: "A heading 1: <h1>", selector: "h1", min: 1, hasText: true },
      { label: "A heading 2: <h2>", selector: "h2", min: 1, hasText: true },
      { label: "A heading 3: <h3>", selector: "h3", min: 1, hasText: true },
      { label: "A heading 4: <h4>", selector: "h4", min: 1, hasText: true },
    ],
  },

  a_paragraphs: {
    instructions: `
      <p>Add a heading and a paragraph about web development, then compare how they look.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <h1>Web Development</h1>
  <!-- Add a paragraph below this line -->

</body>
</html>`,
    checks: [
      { label: "A heading: <h1>", selector: "h1", min: 1, hasText: true },
      { label: "A paragraph with some text: <p>", selector: "p", min: 1, hasText: true },
    ],
    reflection: {
      question: "In your own words: what are the main differences between a heading tag and a paragraph tag?",
      minLength: 25,
    },
  },

  a_links: {
    instructions: `<p>Add two links. Remember: the address goes in the <code>href</code> attribute
      and the clickable words go between the tags.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <h1>Web Development</h1>
  <p>Web development involves creating websites using HTML, CSS, and JavaScript.</p>
  <!-- Add two links below this line -->

</body>
</html>`,
    checks: [
      { label: "A link to a web address starting with https://", selector: 'a[href^="https://"]', min: 1, hasText: true },
      { label: "A second link with clickable text", selector: "a[href]", min: 2, hasText: true },
    ],
  },

  a_images: {
    instructions: `<p>Add an image. In the preview we use a picture from the internet. In your own project you
      would use a file from your images folder, for example <code>src="images/photo.jpg"</code>.</p>
      <p>Use this address: <code>https://placehold.co/300x200?text=My+Image</code></p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <h2>My Favourite Image</h2>
  <!-- Add an image below this line -->

</body>
</html>`,
    checks: [
      { label: "An image with a src attribute: <img src=\"...\">", selector: "img[src]", min: 1 },
      { label: "Alternative text for the image: alt=\"...\"", selector: 'img[alt]:not([alt=""])', min: 1 },
      { label: "A width for the image: width=\"300\"", selector: "img[width]", min: 1 },
    ],
  },

  a_lists: {
    instructions: `<p>Create one unordered list (bullets) and one ordered list (numbers). Each list needs
      at least three items. Put a heading above each list.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <h2>Unordered List</h2>
  <!-- Add a list of HTML, CSS and JavaScript here -->

  <h2>Ordered List</h2>
  <!-- Add the steps: Plan the website, Design the layout, Develop the pages -->

</body>
</html>`,
    checks: [
      { label: "Two headings: <h2>", selector: "h2", min: 2 },
      { label: "An unordered list with 3 items: <ul> and <li>", selector: "ul > li", min: 3, hasText: true },
      { label: "An ordered list with 3 items: <ol> and <li>", selector: "ol > li", min: 3, hasText: true },
    ],
  },

  a_tables: {
    instructions: `<p>Build a table with a header row and two rows of data, like the one in the lecture.
      Remember: <code>&lt;tr&gt;</code> is a row, <code>&lt;th&gt;</code> a header cell and
      <code>&lt;td&gt;</code> a normal cell.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <h2>Our Languages</h2>
  <!-- Add a table with the headers Language and Purpose -->

</body>
</html>`,
    checks: [
      { label: "A table: <table>", selector: "table", min: 1 },
      { label: "Two header cells: <th>", selector: "th", min: 2, hasText: true },
      { label: "Three rows: <tr> (1 header row + 2 data rows)", selector: "tr", min: 3 },
      { label: "Four data cells: <td>", selector: "td", min: 4, hasText: true },
    ],
  },

  a_div: {
    instructions: `<p>Make two separate boxes using <code>&lt;div&gt;</code>. Inside each div put a
      heading and a paragraph. (You will style them with CSS in a later session.)</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
</head>
<body>
  <!-- Box 1: a div with an h2 and a p inside -->

  <!-- Box 2: a div with an h2 and a p inside -->

</body>
</html>`,
    checks: [
      { label: "Two <div> containers", selector: "div", min: 2 },
      { label: "A heading inside each div: <h2>", selector: "div > h2", min: 2, hasText: true },
      { label: "A paragraph inside each div: <p>", selector: "div > p", min: 2, hasText: true },
    ],
  },
};

// ---------------------------------------------------------------
// QUIZ
// "answer" is the position of the correct option (0 = first option).
// ---------------------------------------------------------------
const quiz = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Tool Markup Language", "HyperText Markup Language", "High Text Machine Language", "Home Text Making Language"],
    answer: 1,
    explanation: "HTML is HyperText Markup Language, the standard language for creating web pages.",
  },
  {
    question: "Which technology controls colours, fonts and layout?",
    options: ["CSS", "HTML", "JavaScript", "SQL"],
    answer: 0,
    explanation: "CSS (Cascading Style Sheets) handles the styling and layout of a page.",
  },
  {
    question: "Which technology adds behaviour, such as reacting to a button click?",
    options: ["HTML", "CSS", "JavaScript", "A wireframe"],
    answer: 2,
    explanation: "JavaScript adds behaviour and interactivity.",
  },
  {
    question: "What is the main focus of a wireframe?",
    options: ["Final colours and photos", "Structure, content and functionality", "Server settings", "Search engine ranking"],
    answer: 1,
    explanation: "A wireframe is a low-fidelity layout. It shows structure, content and functionality, not the final visual design.",
  },
  {
    question: "An HTML element is made of...",
    options: ["Only a start tag", "A start tag, some content and an end tag", "Only attributes", "A CSS rule"],
    answer: 1,
    explanation: "An element runs from its start tag, through its content, to its end tag.",
  },
  {
    question: "Which tag defines the MOST important heading?",
    options: ["<h6>", "<head>", "<h1>", "<header>"],
    answer: 2,
    explanation: "<h1> is the most important heading and <h6> the least important.",
  },
  {
    question: "Which two attributes does the <img> tag require?",
    options: ["href and title", "src and alt", "width and height", "name and id"],
    answer: 1,
    explanation: "src gives the path to the image and alt gives text for when the image cannot be seen.",
  },
  {
    question: "Which tag creates a NUMBERED list?",
    options: ["<ul>", "<li>", "<ol>", "<dl>"],
    answer: 2,
    explanation: "<ol> is an ordered (numbered) list. <ul> is an unordered (bulleted) list. Both use <li> for each item.",
  },
  {
    question: "What is the <div> element mainly used for?",
    options: ["Showing a table", "Linking to another site", "Grouping other elements in a container", "Adding an image"],
    answer: 2,
    explanation: "<div> is a generic block-level container that groups other elements so they can be styled or arranged together.",
  },
];

// ---------------------------------------------------------------
// DEMO: how HTML, CSS and JavaScript work together
// ---------------------------------------------------------------
function setupTogetherDemo() {
  const buttons = document.querySelectorAll("#together-demo [data-step]");
  const card = document.getElementById("demo-card");
  const followButton = document.getElementById("follow-btn");
  const counter = document.getElementById("follow-count");
  const caption = document.getElementById("together-caption");

  const captions = {
    1: "Step 1, HTML only: the content and structure are all there (a heading, text and a button), but it is plain and the button does nothing.",
    2: "Step 2, HTML + CSS: the same content now has colour, spacing, rounded corners and a shadow. The button still does nothing.",
    3: "Step 3, HTML + CSS + JavaScript: click the button! JavaScript makes the page respond.",
  };

  let step = 1;
  let followers = 0;
  let following = false;

  function showStep(newStep) {
    step = newStep;
    card.classList.toggle("styled", step >= 2); // CSS switches on at step 2
    caption.textContent = captions[step];
    buttons.forEach((b) => {
      const active = Number(b.dataset.step) === step;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active);
    });
  }

  // JavaScript behaviour only works from step 3.
  followButton.addEventListener("click", () => {
    if (step < 3) return;
    following = !following;
    followers += following ? 1 : -1;
    followButton.textContent = following ? "Following" : "Follow";
    followButton.setAttribute("aria-pressed", following);
    counter.textContent = `${followers} ${followers === 1 ? "follower" : "followers"}`;
  });

  buttons.forEach((b) => b.addEventListener("click", () => showStep(Number(b.dataset.step))));
  showStep(1);
}

// ---------------------------------------------------------------
// START
// ---------------------------------------------------------------
initLecture("s01", { activities, quiz, onReady: setupTogetherDemo });

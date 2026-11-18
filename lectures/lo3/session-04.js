// lectures/lo3/session-04.js
// ---------------------------------------------------------------
// Data for Session 04 (CSS): the activities, the quiz and the small
// interactive demos. The text of the lecture is in session-04.html.
// ---------------------------------------------------------------

import { initLecture } from "../../js/lecture.js";
import { hasCssRule, readCssRules, ruleDeclarations } from "../../js/components/css-check.js";

// Shorthand: the many ways to write "padding", "margin" and "border" in CSS.
const PADDING = ["padding", "padding-top", "padding-right", "padding-bottom", "padding-left"];
const MARGIN = ["margin", "margin-top", "margin-right", "margin-bottom", "margin-left"];
const BORDER = ["border", "border-width", "border-style", "border-color", "border-top", "border-right", "border-bottom", "border-left"];
const BACKGROUND = ["background-color", "background"];

// ---------------------------------------------------------------
// ACTIVITIES
// The key (a_syntax...) must match data-activity in the HTML
// and the item id in js/config.js.
// ---------------------------------------------------------------
const activities = {
  // ----- Activity 1: first rules -----
  a_syntax: {
    instructions: `
      <p>Write CSS rules inside the <code>&lt;style&gt;</code> block. Each rule is a selector, then
        <code>{ property: value; }</code>.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>My First CSS</title>
  <style>
    /* Write your CSS rules here */

  </style>
</head>
<body>
  <h1>Welcome to CSS</h1>
  <p>CSS makes web pages look good.</p>
</body>
</html>`,
    checks: [
      { label: "A colour for the heading: h1 { color: ...; }", css: { selector: "h1", property: "color" } },
      { label: "A size for the paragraph text: p { font-size: ...px; }", css: { selector: "p", property: "font-size", value: /\d/ } },
      { label: "The heading is centred: text-align: center", css: { selector: "h1", property: "text-align", value: /center/ } },
      { label: "A font for the whole page: body { font-family: ...; }", css: { selector: "body", property: "font-family" } },
    ],
  },

  // ----- Activity 2: the box model -----
  a_box: {
    prototype: `<!DOCTYPE html>
<html><head><style>
  .box { padding: 20px; border: 3px solid #3b6df0; margin: 20px; background-color: #eef3ff; font-family: Arial, sans-serif; }
</style></head>
<body>
  <div class="box"><h2>My Box</h2><p>Content, padding, border and margin make up every element.</p></div>
  <div class="box"><h2>Another Box</h2><p>Margin creates space between the boxes.</p></div>
</body></html>`,
    instructions: `
      <p>Style the <code>.box</code> class so each box has all four layers of the box model:</p>
      <ul>
        <li><strong>padding</strong> inside the border</li>
        <li>a <strong>border</strong> (for example <code>3px solid blue</code>)</li>
        <li><strong>margin</strong> outside the border</li>
        <li>a <strong>background colour</strong>, so you can see the padding area</li>
      </ul>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Box Model</title>
  <style>
    .box {
      /* Add padding, border, margin and a background colour */

    }
  </style>
</head>
<body>
  <div class="box">
    <h2>My Box</h2>
    <p>Content, padding, border and margin make up every element.</p>
  </div>
  <div class="box">
    <h2>Another Box</h2>
    <p>Margin creates space between the boxes.</p>
  </div>
</body>
</html>`,
    checks: [
      { label: ".box has padding", css: { selector: ".box", property: PADDING } },
      { label: ".box has a border", css: { selector: ".box", property: BORDER } },
      { label: ".box has margin", css: { selector: ".box", property: MARGIN } },
      { label: ".box has a background colour", css: { selector: ".box", property: BACKGROUND } },
    ],
  },

  // ----- Activity 3: positioning -----
  a_position: {
    prototype: `<!DOCTYPE html>
<html><head><style>
  .card { position: relative; width: 220px; padding: 20px; border: 2px solid #3b6df0; border-radius: 10px; font-family: Arial, sans-serif; }
  .badge { position: absolute; top: 10px; right: 10px; background: crimson; color: white; padding: 4px 10px; border-radius: 4px; font-size: 14px; }
</style></head>
<body><div class="card"><span class="badge">NEW</span><h3>Wireless Mouse</h3><p>Comfortable and quiet.</p></div></body></html>`,
    instructions: `
      <p>Pin the <strong>NEW</strong> badge to the top-right corner of the card:</p>
      <ol>
        <li>Make <code>.card</code> the positioned parent with <code>position: relative;</code></li>
        <li>Make <code>.badge</code> <code>position: absolute;</code></li>
        <li>Place it with <code>top</code> and <code>right</code></li>
      </ol>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Positioning</title>
  <style>
    .card {
      width: 220px;
      padding: 20px;
      border: 2px solid #3b6df0;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      /* Step 1: make the card the positioned parent */
    }

    .badge {
      background: crimson;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 14px;
      /* Step 2: pin the badge to the top-right corner of the card */
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">NEW</span>
    <h3>Wireless Mouse</h3>
    <p>Comfortable and quiet.</p>
  </div>
</body>
</html>`,
    checks: [
      { label: ".card has position: relative", css: { selector: ".card", property: "position", value: /relative/ } },
      { label: ".badge has position: absolute", css: { selector: ".badge", property: "position", value: /absolute/ } },
      { label: ".badge is placed from the top (or bottom)", css: { selector: ".badge", property: ["top", "bottom"] } },
      { label: ".badge is placed from the right (or left)", css: { selector: ".badge", property: ["right", "left"] } },
    ],
  },

  // ----- Activity 4: three ways to apply CSS -----
  a_ways: {
    instructions: `
      <p>Use all three ways of applying CSS on one page:</p>
      <ol>
        <li><strong>Inline:</strong> add a <code>style</code> attribute to the <code>&lt;h1&gt;</code> that sets its <code>color</code></li>
        <li><strong>Internal:</strong> add a <code>&lt;style&gt;</code> block in the <code>&lt;head&gt;</code> with a rule for <code>p</code></li>
        <li><strong>External:</strong> add <code>&lt;link rel="stylesheet" href="style.css"&gt;</code> in the <code>&lt;head&gt;</code></li>
      </ol>
      <p class="muted">The preview cannot load a <code>style.css</code> file, so the link will not change anything here. In VS Code you
        would create that file next to your HTML.</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Three Ways</title>
  <!-- 2. Internal: add a <style> block here with a rule for p -->
  <!-- 3. External: add a <link> to style.css here -->
</head>
<body>
  <!-- 1. Inline: give this heading a style attribute that sets its colour -->
  <h1>Three ways to use CSS</h1>
  <p>This paragraph will be styled with an internal style block.</p>
</body>
</html>`,
    checks: [
      { label: "Inline: the h1 has a style attribute that sets a colour", selector: 'h1[style*="color"]', min: 1 },
      {
        label: "Internal: a <style> block in the head with a rule for p",
        test: (page) =>
          Boolean(page.head.querySelector("style")) &&
          Object.keys(ruleDeclarations(page, "p")).length > 0,
      },
      { label: "External: a <link rel=\"stylesheet\" href=\"...\"> in the head", selector: 'head link[rel="stylesheet"][href]', min: 1 },
    ],
  },

  // ----- Activity 5: selectors -----
  a_selectors: {
    instructions: `
      <p>Write one rule for each kind of selector:</p>
      <ol>
        <li><strong>Element:</strong> style every <code>p</code></li>
        <li><strong>Class:</strong> give <code>.note</code> a background colour</li>
        <li><strong>ID:</strong> style <code>#footer</code></li>
        <li><strong>Grouping:</strong> style <code>h1</code> and <code>h2</code> together in one rule</li>
      </ol>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Selectors</title>
  <style>
    /* 1. Element selector: style every p */

    /* 2. Class selector: give the .note paragraphs a background colour */

    /* 3. ID selector: style the element with id="footer" */

    /* 4. Grouping selector: style h1 and h2 together with one rule */

  </style>
</head>
<body>
  <h1>Web Design Notes</h1>
  <h2>Selectors</h2>
  <p>A normal paragraph.</p>
  <p class="note">A paragraph with the class "note".</p>
  <p class="note">Another note.</p>
  <p id="footer">This paragraph has the id "footer".</p>
</body>
</html>`,
    checks: [
      { label: "Element selector: a rule for p (colour, size or font)", css: { selector: "p", property: ["color", "font-size", "font-family", "line-height"] } },
      { label: "Class selector: .note has a background colour", css: { selector: ".note", property: BACKGROUND } },
      { label: "ID selector: a rule for #footer", test: (page) => Object.keys(ruleDeclarations(page, "#footer")).length > 0 },
      {
        label: "Grouping selector: one rule for h1, h2 { ... }",
        test: (page) =>
          readCssRules(page).some(
            (rule) =>
              rule.selectors.includes("h1") && rule.selectors.includes("h2") && Object.keys(rule.declarations).length > 0
          ),
      },
    ],
  },

  // ----- Activity 6: restyle MyWebPage (from the slides) -----
  a_mypage: {
    prototype: myPageWithCss(`
    body { background-color: #eef3ff; font-family: Arial, sans-serif; }
    p { padding: 20px; background-color: white; }
    .google-btn, .wiki-btn { color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; }
    .google-btn { background-color: #3b6df0; }
    .wiki-btn { background-color: #2fa37e; }
    .image-box { border: 4px solid #3b6df0; width: 300px; padding: 10px; background-color: white; }
    .caption { position: relative; top: 8px; left: 20px; }`),
    instructions: `
      <p>Update the page with these style changes:</p>
      <ol>
        <li>Change the <strong>background colour</strong> of the page</li>
        <li>Increase the <strong>padding</strong> of the paragraph</li>
        <li>Change the <strong>border colour</strong> of the image box</li>
        <li>Move the <strong>image caption</strong> using <code>top</code> or <code>left</code> (it needs a <code>position</code> first)</li>
        <li>Change the <strong>button colours</strong> (Google and Wikipedia)</li>
      </ol>
      <p class="muted">Your colours do not have to match the target. Use the class names already in the HTML:
        <code>.image-box</code>, <code>.caption</code>, <code>.google-btn</code>, <code>.wiki-btn</code>.</p>`,
    starter: myPageWithCss(`
    /* Write your CSS here */
`),
    checks: [
      { label: "Page background colour: body { background-color: ...; }", css: { selector: "body", property: BACKGROUND } },
      { label: "Paragraph padding: p { padding: ...; }", css: { selector: "p", property: PADDING } },
      { label: "Image box border colour: .image-box { border: ...; }", css: { selector: ".image-box", property: ["border", "border-color"] } },
      {
        label: "Caption moved: .caption has position relative or absolute, plus top or left",
        test: (page) => {
          const rule = ruleDeclarations(page, ".caption");
          return /^(relative|absolute)$/.test(rule.position || "") && ["top", "left", "right", "bottom"].some((side) => side in rule);
        },
      },
      {
        label: "Button colours: .google-btn and .wiki-btn each have a background colour",
        test: (page) => hasCssRule(page, ".google-btn", BACKGROUND) && hasCssRule(page, ".wiki-btn", BACKGROUND),
      },
    ],
  },
};

// The MyWebPage page from Session 01, with room for CSS. Used as the starter and the target.
function myPageWithCss(css) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Web Design & Development</title>
  <style>${css}  </style>
</head>
<body>
  <h1>Web Development</h1>
  <p>Web development involves creating websites using HTML, CSS, and JavaScript.</p>

  <a href="https://www.google.com" class="google-btn">Visit Google</a>
  <a href="https://www.wikipedia.org" class="wiki-btn">Visit Wikipedia</a>

  <h2>My Favorite Image</h2>
  <div class="image-box">
    <img src="https://placehold.co/300x180?text=Student" alt="My image" width="300">
    <p class="caption">Student</p>
  </div>

  <h2>Unordered List</h2>
  <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
  </ul>

  <h2>Ordered List</h2>
  <ol>
    <li>Plan the website</li>
    <li>Design the layout</li>
    <li>Develop the pages</li>
  </ol>

  <h2>Technology Table</h2>
  <table border="1">
    <tr><th>Technology</th><th>Meaning</th></tr>
    <tr><td>HTML</td><td>HyperText Markup Language</td></tr>
    <tr><td>CSS</td><td>Cascading Style Sheets</td></tr>
  </table>

  <div>
    <h3>Let's talk about div tag</h3>
    <p>Helps in layout and styling</p>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------
// QUIZ
// "answer" is the position of the correct option (0 = first option).
// ---------------------------------------------------------------
const quiz = [
  {
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colourful Style Sheets"],
    answer: 1,
    explanation: "CSS is Cascading Style Sheets, the language used to style HTML.",
  },
  {
    question: "In the rule  p { color: blue; }  what is 'color'?",
    options: ["The selector", "The value", "The property", "The declaration block"],
    answer: 2,
    explanation: "p is the selector, color is the property and blue is the value.",
  },
  {
    question: "What separates one declaration from the next inside a declaration block?",
    options: ["Commas", "Semicolons", "Colons", "Full stops"],
    answer: 1,
    explanation: "Each declaration ends with a semicolon. The colon sits between a property and its value.",
  },
  {
    question: "Which is the correct order of the box model layers, from the inside out?",
    options: ["Margin, border, padding, content", "Content, margin, padding, border", "Content, padding, border, margin", "Padding, content, margin, border"],
    answer: 2,
    explanation: "Content is in the middle, then padding, then the border, and the margin is the outside space.",
  },
  {
    question: "Which property creates space INSIDE the border, around the content?",
    options: ["margin", "padding", "spacing", "outline"],
    answer: 1,
    explanation: "Padding is inside the border. Margin is the space outside it.",
  },
  {
    question: "An element with position: absolute is placed relative to...",
    options: ["Its own normal position", "The browser window only", "Its nearest positioned ancestor", "The previous element"],
    answer: 2,
    explanation: "Absolute positioning uses the nearest ancestor that has a position other than static. Relative positioning is the one that uses the element's own normal position.",
  },
  {
    question: "Which way of applying CSS is recommended for large websites?",
    options: ["Inline styles", "Internal <style> blocks", "An external stylesheet", "Writing it in the body"],
    answer: 2,
    explanation: "An external .css file can be linked from every page, so one change updates the whole site.",
  },
  {
    question: "What does the selector  .intro  select?",
    options: ["Every <intro> element", "The element with the id 'intro'", "All elements with class=\"intro\"", "The first paragraph"],
    answer: 2,
    explanation: "A dot means class. A hash (#) means id.",
  },
  {
    question: "Which selector targets the single element with id=\"menu\"?",
    options: [".menu", "#menu", "menu", "*menu"],
    answer: 1,
    explanation: "An id selector starts with a hash (#). An id should be used once per page.",
  },
  {
    question: "How do you apply the same style to h1, h2 and p with one rule?",
    options: ["h1 h2 p { ... }", "h1 + h2 + p { ... }", "h1, h2, p { ... }", "h1.h2.p { ... }"],
    answer: 2,
    explanation: "A grouping selector separates the selectors with commas.",
  },
];

// ---------------------------------------------------------------
// DEMO 1: the same page with and without CSS
// ---------------------------------------------------------------
function setupCssToggleDemo() {
  const frame = document.getElementById("css-toggle-frame");
  const codeBox = document.getElementById("css-toggle-code-box");
  const code = document.getElementById("css-toggle-code");
  const caption = document.getElementById("css-toggle-caption");
  const offButton = document.getElementById("css-off");
  const onButton = document.getElementById("css-on");

  const html = `<h2>Alex Student</h2>
<p>Web design student</p>
<button>Follow</button>`;

  const css = `body { font-family: Arial, sans-serif; background: #eef3ff; text-align: center; padding: 12px; }
h2 { color: #2449ab; margin: 6px 0; }
p { color: #5b6b80; margin: 0 0 10px; }
button { background: #3b6df0; color: white; border: 0; border-radius: 999px; padding: 8px 20px; font-weight: bold; }`;

  function show(cssOn) {
    frame.srcdoc = cssOn ? `<style>${css}</style>${html}` : html;
    codeBox.hidden = !cssOn;
    code.textContent = css;
    caption.textContent = cssOn
      ? "HTML + CSS: exactly the same content, now with colour, spacing, a centred layout and a rounded button."
      : "HTML only: the structure and content are all there, but the browser uses plain default styles.";
    offButton.classList.toggle("active", !cssOn);
    onButton.classList.toggle("active", cssOn);
  }

  offButton.addEventListener("click", () => show(false));
  onButton.addEventListener("click", () => show(true));
  show(false);
}

// ---------------------------------------------------------------
// DEMO 2: property playground (writes the rule for you)
// ---------------------------------------------------------------
function setupSyntaxDemo() {
  const color = document.getElementById("pg-color");
  const size = document.getElementById("pg-size");
  const align = document.getElementById("pg-align");
  const heading = document.getElementById("pg-heading");
  const code = document.getElementById("pg-code");

  function update() {
    heading.style.color = color.value;
    heading.style.fontSize = size.value + "px";
    heading.style.textAlign = align.value;
    document.getElementById("pg-size-out").textContent = size.value + "px";
    code.textContent = `h1 {\n  color: ${color.value};\n  font-size: ${size.value}px;\n  text-align: ${align.value};\n}`;
  }
  [color, size, align].forEach((control) => control.addEventListener("input", update));
  update();
}

// ---------------------------------------------------------------
// DEMO 3: box model explorer
// ---------------------------------------------------------------
function setupBoxDemo() {
  const CONTENT_WIDTH = 120; // the width of the "Content" box in the demo (set in style.css)
  const margin = document.getElementById("bm-m");
  const border = document.getElementById("bm-b");
  const padding = document.getElementById("bm-p");

  function update() {
    const m = Number(margin.value);
    const b = Number(border.value);
    const p = Number(padding.value);

    // The coloured layers are drawn with padding (margin area), border-width and padding.
    document.getElementById("bm-margin").style.padding = m + "px";
    document.getElementById("bm-border").style.borderWidth = b + "px";
    document.getElementById("bm-padding").style.padding = p + "px";

    document.getElementById("bm-m-out").textContent = m + "px";
    document.getElementById("bm-b-out").textContent = b + "px";
    document.getElementById("bm-p-out").textContent = p + "px";

    document.getElementById("bm-code").textContent =
      `.box {\n  margin: ${m}px;\n  border: ${b}px solid;\n  padding: ${p}px;\n}`;
    document.getElementById("bm-total").textContent =
      `Total width taken: ${CONTENT_WIDTH} (content) + 2 × ${p} (padding) + 2 × ${b} (border) + 2 × ${m} (margin) = ${CONTENT_WIDTH + 2 * (p + b + m)}px`;
  }
  [margin, border, padding].forEach((range) => range.addEventListener("input", update));
  update();
}

// ---------------------------------------------------------------
// DEMO 4: relative vs absolute positioning
// ---------------------------------------------------------------
function setupPositionDemo() {
  const box = document.getElementById("pos-box2");
  const ghost = document.getElementById("pos-ghost");
  const parentBox = document.getElementById("pos-parent-box");
  const topRange = document.getElementById("pos-top");
  const leftRange = document.getElementById("pos-left");
  const parentCheck = document.getElementById("pos-parent");
  const code = document.getElementById("pos-code");
  const caption = document.getElementById("pos-caption");
  const buttonBox = document.getElementById("pos-buttons");

  const CAPTIONS = {
    static: "static (the default): normal flow. top and left have no effect.",
    relative: "relative: box 2 moves away from its normal place (the dashed outline). Its old space stays reserved, so box 3 does not move.",
    absolute: "absolute: box 2 leaves the normal flow, so box 3 moves up to fill the gap. Box 2 is placed from the corner of its nearest positioned ancestor.",
  };
  let mode = "relative";

  function update() {
    const top = topRange.value;
    const left = leftRange.value;

    // 1. Set up the parent, then measure where box 2 would normally sit.
    parentBox.style.position = parentCheck.checked ? "relative" : "static";
    box.style.position = "static";
    box.style.top = "";
    box.style.left = "";
    const normalTop = box.offsetTop;
    const normalLeft = box.offsetLeft;

    // 2. Apply the chosen position.
    if (mode !== "static") {
      box.style.position = mode;
      box.style.top = top + "px";
      box.style.left = left + "px";
    }

    // 3. Show the dashed outline of the normal place (relative only).
    ghost.hidden = mode !== "relative";
    ghost.style.top = normalTop + "px";
    ghost.style.left = normalLeft + "px";

    document.getElementById("pos-top-out").textContent = top + "px";
    document.getElementById("pos-left-out").textContent = left + "px";
    topRange.disabled = leftRange.disabled = mode === "static";

    code.textContent =
      mode === "static"
        ? ".box-2 {\n  position: static;\n}"
        : `.box-2 {\n  position: ${mode};\n  top: ${top}px;\n  left: ${left}px;\n}`;
    caption.textContent =
      CAPTIONS[mode] +
      (mode === "absolute" && !parentCheck.checked
        ? " The parent is not positioned now, so box 2 is placed from the corner of the bigger blue demo box instead."
        : "");

    buttonBox.querySelectorAll(".btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  }

  ["static", "relative", "absolute"].forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost btn-small";
    button.dataset.mode = name;
    button.textContent = `position: ${name}`;
    button.addEventListener("click", () => {
      mode = name;
      update();
    });
    buttonBox.appendChild(button);
  });
  [topRange, leftRange, parentCheck].forEach((control) => control.addEventListener("input", update));
  update();
}

// ---------------------------------------------------------------
// DEMO 5: three ways to apply CSS (different code, same result)
// ---------------------------------------------------------------
const WAYS = {
  inline: {
    label: "Inline",
    code: `<h1 style="color: tomato;">Hello, CSS!</h1>`,
    caption: "Inline: the style sits on one element. Quick, but you must repeat it everywhere and it is hard to maintain.",
  },
  internal: {
    label: "Internal",
    code: `<head>
  <style>
    h1 { color: tomato; }
  </style>
</head>
<body>
  <h1>Hello, CSS!</h1>
</body>`,
    caption: "Internal: one <style> block styles the whole page. Good for a single page.",
  },
  external: {
    label: "External",
    code: `<!-- index.html -->
<head>
  <link rel="stylesheet" href="style.css">
</head>

/* style.css */
h1 { color: tomato; }`,
    caption: "External: one .css file shared by every page. Change it once and the whole website updates. This is the recommended way.",
  },
};

function setupWaysDemo() {
  const buttonBox = document.getElementById("ways-buttons");
  const frame = document.getElementById("ways-frame");
  const code = document.getElementById("ways-code");
  const caption = document.getElementById("ways-caption");

  frame.srcdoc = `<body style="margin:14px"><h1 style="color: tomato; font-family: Arial, sans-serif; margin: 0">Hello, CSS!</h1></body>`;

  function show(key) {
    code.textContent = WAYS[key].code;
    caption.textContent = WAYS[key].caption;
    buttonBox.querySelectorAll(".btn").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
  }

  Object.entries(WAYS).forEach(([key, way]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost btn-small";
    button.dataset.key = key;
    button.textContent = way.label;
    button.addEventListener("click", () => show(key));
    buttonBox.appendChild(button);
  });
  show("inline");
}

// ---------------------------------------------------------------
// DEMO 6: selector tester
// ---------------------------------------------------------------
function setupSelectorDemo() {
  const input = document.getElementById("selector-box");
  const page = document.getElementById("selector-page");
  const caption = document.getElementById("selector-caption");
  const presets = document.getElementById("selector-presets");

  function update() {
    page.querySelectorAll(".hit").forEach((el) => el.classList.remove("hit"));
    const text = input.value.trim();
    if (!text) {
      caption.textContent = "Type a selector to begin.";
      return;
    }
    try {
      const matches = page.querySelectorAll(text);
      matches.forEach((el) => el.classList.add("hit"));
      caption.textContent =
        matches.length === 0
          ? `${text} { } selects nothing in this page.`
          : `${text} { } selects ${matches.length} element${matches.length === 1 ? "" : "s"} (highlighted).`;
    } catch (error) {
      caption.textContent = "That is not a valid selector (yet). Keep typing.";
    }
  }

  ["p", ".note", "#main-title", "#last-note", "h1, h2", "p.note", ".note, h1"].forEach((selector) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost btn-small";
    button.textContent = selector;
    button.addEventListener("click", () => {
      input.value = selector;
      update();
    });
    presets.appendChild(button);
  });
  input.addEventListener("input", update);
  update();
}

// ---------------------------------------------------------------
// DEMO 7: a taste of Flexbox
// ---------------------------------------------------------------
function setupFlexDemo() {
  const stage = document.getElementById("flex-stage");
  const direction = document.getElementById("flex-direction");
  const justify = document.getElementById("flex-justify");
  const align = document.getElementById("flex-align");
  const code = document.getElementById("flex-code");

  function update() {
    stage.style.flexDirection = direction.value;
    stage.style.justifyContent = justify.value;
    stage.style.alignItems = align.value;
    code.textContent =
      `.container {\n  display: flex;\n  flex-direction: ${direction.value};\n  justify-content: ${justify.value};\n  align-items: ${align.value};\n}`;
  }
  [direction, justify, align].forEach((control) => control.addEventListener("input", update));
  update();
}

// ---------------------------------------------------------------
// START
// ---------------------------------------------------------------
function setupDemos() {
  setupCssToggleDemo();
  setupSyntaxDemo();
  setupBoxDemo();
  setupPositionDemo();
  setupWaysDemo();
  setupSelectorDemo();
  setupFlexDemo();
}

initLecture("s04", { activities, quiz, onReady: setupDemos });

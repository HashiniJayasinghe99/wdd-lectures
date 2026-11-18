// lectures/lo3/session-02.js
// ---------------------------------------------------------------
// Data for Session 02 (HTML Forms): the activities, the quiz and the
// small interactive demos. The text of the lecture is in session-02.html.
// ---------------------------------------------------------------

import { initLecture } from "../../js/lecture.js";

// ---------------------------------------------------------------
// Small helpers used by the activity checks
// ---------------------------------------------------------------

// Inputs that people fill in (everything except buttons).
function fieldInputs(page) {
  return Array.from(page.querySelectorAll("input")).filter(
    (input) => !["submit", "reset", "button", "hidden"].includes(input.type)
  );
}

// Does this element have a <label for="..."> that matches its id?
function hasLabel(page, element) {
  const id = element.getAttribute("id");
  if (!id) return false;
  return Array.from(page.querySelectorAll("label[for]")).some(
    (label) => label.getAttribute("for") === id
  );
}

// ---------------------------------------------------------------
// The finished registration form (the "prototype").
// It is shown as the target in Activity 2, and is the starting point for Activity 3.
// ---------------------------------------------------------------
const REGISTRATION_FORM = `<!DOCTYPE html>
<html>
<head>
  <title>User Registration</title>
</head>
<body>
  <h1>User Registration Form</h1>
  <form>
    <label for="fullname">Full Name:</label><br>
    <input type="text" id="fullname" name="fullname"><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email"><br><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password"><br><br>

    <label for="age">Age:</label><br>
    <input type="number" id="age" name="age"><br><br>

    <label for="dob">Date of Birth:</label><br>
    <input type="date" id="dob" name="dob"><br><br>

    <label for="photo">Upload Profile Picture:</label><br>
    <input type="file" id="photo" name="photo"><br><br>

    Gender:<br>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">Male</label><br>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">Female</label><br><br>

    Hobbies:<br>
    <input type="checkbox" id="reading" name="hobbies" value="reading">
    <label for="reading">Reading</label><br>
    <input type="checkbox" id="traveling" name="hobbies" value="traveling">
    <label for="traveling">Traveling</label><br>
    <input type="checkbox" id="sports" name="hobbies" value="sports">
    <label for="sports">Sports</label><br><br>

    <label for="color">Favorite Color:</label><br>
    <input type="color" id="color" name="color"><br><br>

    <label for="exp">Experience with HTML:</label><br>
    <input type="range" id="exp" name="exp" min="0" max="100" value="100"><br><br>

    <input type="submit" value="Register">
    <input type="reset" value="Clear">
  </form>
</body>
</html>`;

// The upgraded version (target of Activity 3).
const UPGRADED_FORM = REGISTRATION_FORM.replace(
  `    <input type="submit" value="Register">`,
  `    <label for="branch">Select the branch:</label><br>
    <select id="branch" name="branch">
      <option value="colombo">Colombo</option>
      <option value="galle">Galle</option>
      <option value="kandy">Kandy</option>
    </select><br><br>

    <label for="why">Describe why you need to learn HTML:</label><br>
    <textarea id="why" name="why" rows="5" cols="30" placeholder="Enter your text here"></textarea><br><br>

    <button type="button" onclick="alert('Hi')">Say Hi</button><br><br>

    <input type="submit" value="Register">`
);

// ---------------------------------------------------------------
// ACTIVITIES
// The key (a_first_form...) must match data-activity in the HTML
// and the item id in js/config.js.
// ---------------------------------------------------------------
const activities = {
  // ----- Activity 1 -----
  a_first_form: {
    practiceSubmit: true,
    instructions: `
      <p>Inside <code>&lt;body&gt;</code>, build a <code>&lt;form&gt;</code> that contains:</p>
      <ul>
        <li>a <strong>name</strong> field with a label</li>
        <li>an <strong>email</strong> field with a label</li>
        <li>a button that submits the form</li>
      </ul>
      <p class="muted">Remember: the label's <code>for</code> must match the input's <code>id</code>. Use <code>&lt;br&gt;</code> to
        put things on separate lines (CSS will do this properly later).</p>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>My First Form</title>
</head>
<body>
  <h1>Contact Us</h1>

  <!-- Build your form here -->

</body>
</html>`,
    checks: [
      { label: "A form: <form>", selector: "form", min: 1 },
      { label: "A text input with an id and a name", selector: 'input[type="text"][id][name]', min: 1 },
      { label: "An email input: type=\"email\"", selector: 'input[type="email"]', min: 1 },
      {
        label: "Two labels whose for matches an input's id",
        test: (page) => {
          const labels = Array.from(page.querySelectorAll("label[for]")).filter((l) => l.textContent.trim());
          const linked = labels.filter((l) => page.getElementById(l.getAttribute("for")));
          return linked.length >= 2;
        },
      },
      { label: "A submit button", selector: 'input[type="submit"], button[type="submit"], form button:not([type])', min: 1 },
    ],
  },

  // ----- Activity 2 (from the slides) -----
  a_registration: {
    practiceSubmit: true,
    prototype: REGISTRATION_FORM,
    instructions: `
      <p>Build the registration form shown in the prototype. Choose the correct input <code>type</code> for each field:</p>
      <details>
        <summary>Need a hint? Which type for which field?</summary>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Field</th><th>Type</th></tr></thead>
          <tbody>
            <tr><td>Full Name</td><td><code>text</code></td></tr>
            <tr><td>Email</td><td><code>email</code></td></tr>
            <tr><td>Password</td><td><code>password</code></td></tr>
            <tr><td>Age</td><td><code>number</code></td></tr>
            <tr><td>Date of Birth</td><td><code>date</code></td></tr>
            <tr><td>Upload Profile Picture</td><td><code>file</code></td></tr>
            <tr><td>Gender (choose one)</td><td><code>radio</code>, with the same name</td></tr>
            <tr><td>Hobbies (choose many)</td><td><code>checkbox</code></td></tr>
            <tr><td>Favorite Color</td><td><code>color</code></td></tr>
            <tr><td>Experience with HTML</td><td><code>range</code> (0 to 100)</td></tr>
            <tr><td>Register / Clear</td><td><code>submit</code> / <code>reset</code></td></tr>
          </tbody>
        </table></div>
      </details>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>User Registration</title>
</head>
<body>
  <h1>User Registration Form</h1>
  <form>
    <!-- Example: the first field is done for you -->
    <label for="fullname">Full Name:</label><br>
    <input type="text" id="fullname" name="fullname"><br><br>

    <!-- Add the other fields here -->

  </form>
</body>
</html>`,
    checks: [
      { label: "A form with a heading", test: (page) => page.querySelector("form") && page.querySelector("h1, h2") && page.querySelector("h1, h2").textContent.trim().length > 0 },
      {
        label: "Name, email and password fields",
        test: (page) =>
          ["text", "email", "password"].every((type) => page.querySelector(`input[type="${type}"]`)),
      },
      { label: "An age field: type=\"number\"", selector: 'input[type="number"]', min: 1 },
      { label: "A date of birth field: type=\"date\"", selector: 'input[type="date"]', min: 1 },
      { label: "A profile picture upload: type=\"file\"", selector: 'input[type="file"]', min: 1 },
      {
        label: "Gender: two radio buttons that share the same name",
        test: (page) => {
          const names = Array.from(page.querySelectorAll('input[type="radio"]'))
            .map((radio) => radio.getAttribute("name"))
            .filter(Boolean);
          return names.some((name) => names.filter((other) => other === name).length >= 2);
        },
      },
      { label: "Hobbies: three checkboxes", selector: 'input[type="checkbox"]', min: 3 },
      { label: "A favourite colour picker: type=\"color\"", selector: 'input[type="color"]', min: 1 },
      { label: "Experience with HTML: type=\"range\"", selector: 'input[type="range"]', min: 1 },
      {
        label: "Every field has a label (for matches id) and a name",
        test: (page) => {
          const fields = fieldInputs(page);
          return fields.length > 0 && fields.every((input) => hasLabel(page, input) && input.getAttribute("name"));
        },
      },
      {
        label: "A Register button (submit) and a Clear button (reset)",
        test: (page) =>
          page.querySelector('input[type="submit"], button[type="submit"]') !== null &&
          page.querySelector('input[type="reset"], button[type="reset"]') !== null,
      },
    ],
  },

  // ----- Activity 3 (from the slides) -----
  a_upgrade: {
    practiceSubmit: true,
    prototype: UPGRADED_FORM,
    instructions: `
      <p>Upgrade your form with these requirements:</p>
      <ul>
        <li>Add a <strong>drop-down menu</strong> to select the branch (<strong>Colombo, Galle, Kandy</strong>)</li>
        <li>Add a <strong>text area</strong> with <strong>5 rows</strong> and <strong>30 columns</strong></li>
        <li>Add a <strong>button</strong> which pops up the message <strong>"Hi"</strong> when you click it</li>
      </ul>
      <p class="muted">Give the drop-down and the text area a label each. Try clicking your Hi button in the preview.</p>`,
    starter: REGISTRATION_FORM.replace(
      `    <input type="submit" value="Register">`,
      `    <!-- Add the branch drop-down, the text area and the Hi button here -->

    <input type="submit" value="Register">`
    ),
    checks: [
      {
        label: "A drop-down list with a label: <select>",
        test: (page) => {
          const select = page.querySelector("select");
          return Boolean(select) && hasLabel(page, select);
        },
      },
      {
        label: "The drop-down has the options Colombo, Galle and Kandy",
        test: (page) => {
          const options = Array.from(page.querySelectorAll("select option")).map((o) => o.textContent.trim().toLowerCase());
          return ["colombo", "galle", "kandy"].every((city) => options.includes(city));
        },
      },
      {
        label: "A text area with rows=\"5\" and cols=\"30\"",
        test: (page) => {
          const area = page.querySelector("textarea");
          return Boolean(area) && area.getAttribute("rows") === "5" && area.getAttribute("cols") === "30";
        },
      },
      {
        label: "The text area has a label",
        test: (page) => {
          const area = page.querySelector("textarea");
          return Boolean(area) && hasLabel(page, area);
        },
      },
      {
        label: "A button that shows \"Hi\" with alert() when clicked: onclick",
        test: (page) =>
          Array.from(page.querySelectorAll("button[onclick], input[type='button'][onclick]")).some((button) =>
            /alert\s*\(\s*['"]hi/i.test(button.getAttribute("onclick"))
          ),
      },
      {
        label: "The Hi button has type=\"button\" (so it does not submit the form)",
        test: (page) =>
          Array.from(page.querySelectorAll("button[onclick], input[type='button'][onclick]")).some(
            (button) =>
              /alert\s*\(\s*['"]hi/i.test(button.getAttribute("onclick")) && button.getAttribute("type") === "button"
          ),
      },
    ],
  },

  // ----- Activity 4 -----
  a_validation: {
    practiceSubmit: true,
    instructions: `
      <p>Add attributes so the browser checks the input. Your goals:</p>
      <ul>
        <li><strong>Username:</strong> required, with a placeholder, and a <code>maxlength</code> of 20</li>
        <li><strong>Email</strong> and <strong>password:</strong> both required</li>
        <li><strong>Age:</strong> minimum 16, maximum 60</li>
        <li><strong>Phone:</strong> exactly 10 digits. Use <code>pattern="[0-9]{10}"</code></li>
        <li>Put the username, email and password inside a <code>&lt;fieldset&gt;</code> with the legend <strong>Account details</strong></li>
      </ul>`,
    starter: `<!DOCTYPE html>
<html>
<head>
  <title>Sign Up</title>
</head>
<body>
  <h1>Student Sign Up</h1>
  <form>
    <!-- Put these three fields inside a fieldset with the legend "Account details" -->
    <label for="username">Username:</label><br>
    <input type="text" id="username" name="username"><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email"><br><br>

    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password"><br><br>

    <label for="age">Age:</label><br>
    <input type="number" id="age" name="age"><br><br>

    <label for="phone">Phone (10 digits):</label><br>
    <input type="text" id="phone" name="phone"><br><br>

    <input type="submit" value="Sign up">
  </form>
</body>
</html>`,
    checks: [
      {
        label: "Username: required, has a placeholder, maxlength=\"20\"",
        test: (page) => {
          const input = page.getElementById("username");
          return Boolean(input) && input.hasAttribute("required") &&
            (input.getAttribute("placeholder") || "").trim().length > 0 &&
            input.getAttribute("maxlength") === "20";
        },
      },
      {
        label: "Email and password are both required",
        test: (page) => {
          const email = page.getElementById("email");
          const password = page.getElementById("password");
          return Boolean(email && password) && email.hasAttribute("required") && password.hasAttribute("required");
        },
      },
      {
        label: "Age: min=\"16\" and max=\"60\"",
        test: (page) => {
          const age = page.getElementById("age");
          return Boolean(age) && age.getAttribute("min") === "16" && age.getAttribute("max") === "60";
        },
      },
      {
        label: "Phone: a pattern of exactly 10 digits",
        test: (page) => {
          const phone = page.getElementById("phone");
          const pattern = phone ? phone.getAttribute("pattern") || "" : "";
          return /(\[0-9\]|\\d)\{10\}/.test(pattern);
        },
      },
      {
        label: "A fieldset with the legend \"Account details\" around username, email and password",
        test: (page) => {
          const fieldset = page.querySelector("fieldset");
          if (!fieldset) return false;
          const legend = fieldset.querySelector("legend");
          const hasLegend = Boolean(legend) && legend.textContent.toLowerCase().includes("account");
          const holdsFields = ["username", "email", "password"].every((id) => fieldset.querySelector("#" + id));
          return hasLegend && holdsFields;
        },
      },
    ],
  },
};

// ---------------------------------------------------------------
// QUIZ
// "answer" is the position of the correct option (0 = first option).
// ---------------------------------------------------------------
const quiz = [
  {
    question: "Which element creates an HTML form?",
    options: ["<input>", "<form>", "<label>", "<fieldset>"],
    answer: 1,
    explanation: "The <form> element holds all the fields of a form.",
  },
  {
    question: "What is an HTML form mainly used for?",
    options: ["Styling a page", "Collecting user input", "Adding images", "Making the page load faster"],
    answer: 1,
    explanation: "Forms collect user input, which is most often sent to a server for processing.",
  },
  {
    question: "How do you link a <label> to its input?",
    options: ["for on the label matches id on the input", "name on the label matches name on the input", "Put them in the same <div>", "class on both"],
    answer: 0,
    explanation: "The for attribute of the label must equal the id of the input.",
  },
  {
    question: "Which input type lets the user choose only ONE option from a group?",
    options: ["text", "checkbox", "radio", "submit"],
    answer: 2,
    explanation: "Radio buttons allow one choice. Checkboxes allow zero or more.",
  },
  {
    question: "What makes a set of radio buttons work as one group?",
    options: ["The same id", "The same name", "The same value", "The same label"],
    answer: 1,
    explanation: "Radio buttons that share a name belong to one group, so choosing one clears the others.",
  },
  {
    question: "Which element creates a drop-down list?",
    options: ["<dropdown>", "<list>", "<select>", "<datalist>"],
    answer: 2,
    explanation: "<select> creates the drop-down list, and each <option> inside it is one choice.",
  },
  {
    question: "Which attribute sets the number of visible lines of a <textarea>?",
    options: ["lines", "height", "size", "rows"],
    answer: 3,
    explanation: "rows sets the visible lines and cols sets the visible width in characters.",
  },
  {
    question: "Which attribute stops a form being submitted while a field is empty?",
    options: ["readonly", "required", "disabled", "autofocus"],
    answer: 1,
    explanation: "required means the field must be filled in before the form can be submitted.",
  },
  {
    question: "A text input has no name attribute. What happens when the form is submitted?",
    options: ["Its value is sent as 'undefined'", "The form cannot be submitted", "Its value is not sent", "The browser makes up a name"],
    answer: 2,
    explanation: "Only inputs with a name are sent. The name labels the data.",
  },
  {
    question: "Which method is better for sending a password?",
    options: ["get, because it is faster", "post, because the data is not shown in the address", "get, because it can be bookmarked", "Either, there is no difference"],
    answer: 1,
    explanation: "post keeps the data out of the web address. get shows it in the URL.",
  },
];

// ---------------------------------------------------------------
// DEMO 1: gallery of four less common form elements
// ---------------------------------------------------------------
const ELEMENTS = {
  fieldset: {
    label: "<fieldset> + <legend>",
    caption: "<fieldset> draws a box around related fields. <legend> is the caption of that box.",
    code: `<fieldset>
  <legend>Contact details</legend>
  <label for="g-phone">Phone:</label>
  <input type="text" id="g-phone" name="phone">
</fieldset>`,
  },
  datalist: {
    label: "<datalist>",
    caption: "Start typing: the browser suggests values from the list, but the user can still type anything else. The input and the list are linked with list and id.",
    code: `<label for="g-browser">Favourite browser:</label>
<input list="g-browsers" id="g-browser" name="browser">
<datalist id="g-browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Edge">
</datalist>`,
  },
  optgroup: {
    label: "<optgroup>",
    caption: "<optgroup> adds headings inside a drop-down list to keep long lists tidy.",
    code: `<select name="city">
  <optgroup label="Western Province">
    <option>Colombo</option>
    <option>Gampaha</option>
  </optgroup>
  <optgroup label="Southern Province">
    <option>Galle</option>
    <option>Matara</option>
  </optgroup>
</select>`,
  },
  output: {
    label: "<output>",
    caption: "Move the slider: <output> shows a result. (A little JavaScript with oninput updates it.)",
    code: `<form oninput="gOut.value = gRange.value">
  <input type="range" id="gRange" name="gRange" value="50">
  <output name="gOut" for="gRange">50</output>
</form>`,
  },
};

function setupElementDemo() {
  const buttonBox = document.getElementById("element-buttons");
  const stage = document.getElementById("element-stage");
  const code = document.getElementById("element-code");
  const caption = document.getElementById("element-caption");

  function show(key) {
    const element = ELEMENTS[key];
    stage.innerHTML = element.code; // our own trusted code, so it is safe to display as HTML
    code.textContent = element.code; // textContent shows the tags as text
    caption.textContent = element.caption;
    buttonBox.querySelectorAll(".btn").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
  }

  Object.entries(ELEMENTS).forEach(([key, element]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost btn-small";
    button.dataset.key = key;
    button.textContent = element.label;
    button.addEventListener("click", () => show(key));
    buttonBox.appendChild(button);
  });
  show("fieldset");
}

// ---------------------------------------------------------------
// DEMO 2: gallery of input types
// ---------------------------------------------------------------
const INPUT_TYPES = {
  text: { code: `<input type="text" name="fullname">`, caption: "A single line of text." },
  password: { code: `<input type="password" name="pass">`, caption: "Hides what is typed behind dots." },
  email: { code: `<input type="email" name="email" placeholder="you@example.com">`, caption: "Expects an email address. The browser checks the format when the form is submitted." },
  number: { code: `<input type="number" name="age" min="0" max="120">`, caption: "Only numbers, with up and down arrows." },
  radio: {
    code: `<input type="radio" name="size" value="s"> Small
<input type="radio" name="size" value="m"> Medium
<input type="radio" name="size" value="l"> Large`,
    caption: "Same name, so only ONE can be chosen.",
  },
  checkbox: {
    code: `<input type="checkbox" name="hobby" value="reading"> Reading
<input type="checkbox" name="hobby" value="sports"> Sports`,
    caption: "Zero, one or many can be ticked.",
  },
  date: { code: `<input type="date" name="dob">`, caption: "A date picker. The look depends on the browser." },
  file: { code: `<input type="file" name="photo">`, caption: "Lets the user choose a file. The form needs method=\"post\" and enctype=\"multipart/form-data\"." },
  color: { code: `<input type="color" name="colour" value="#3b6df0">`, caption: "A colour picker." },
  range: { code: `<input type="range" name="level" min="0" max="100" value="40">`, caption: "A slider between min and max." },
  submit: { code: `<input type="submit" value="Register">`, caption: "Submits the form. Its value is the text on the button." },
  reset: { code: `<input type="reset" value="Clear">`, caption: "Clears every field back to its starting value." },
};

function setupInputDemo() {
  const buttonBox = document.getElementById("input-buttons");
  const stage = document.getElementById("input-stage");
  const code = document.getElementById("input-code");
  const caption = document.getElementById("input-caption");

  function show(type) {
    const info = INPUT_TYPES[type];
    // Radios and checkboxes get a label wrapped around the text so they look neat.
    stage.innerHTML = info.code
      .split("\n")
      .map((line) => (/type="(radio|checkbox)"/.test(line) ? `<label>${line}</label>` : line))
      .join("\n");
    code.textContent = info.code;
    caption.textContent = info.caption;
    buttonBox.querySelectorAll(".btn").forEach((b) => b.classList.toggle("active", b.dataset.type === type));
  }

  Object.keys(INPUT_TYPES).forEach((type) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost btn-small";
    button.dataset.type = type;
    button.textContent = type;
    button.addEventListener("click", () => show(type));
    buttonBox.appendChild(button);
  });
  show("text");
}

// ---------------------------------------------------------------
// DEMO 3: label with and without "for"
// ---------------------------------------------------------------
function setupLabelDemo() {
  const caption = document.getElementById("label-caption");
  const withoutFor = document.getElementById("demo-no-for");
  const withFor = document.getElementById("demo-with-for");

  withoutFor.addEventListener("change", () => {
    caption.textContent = "You clicked the box itself. The first label is not linked, so clicking its words does nothing.";
  });
  withFor.addEventListener("change", () => {
    caption.textContent = "The second label has for matching the checkbox id, so clicking its words toggles the box.";
  });
}

// ---------------------------------------------------------------
// DEMO 4: resize a textarea with rows and cols
// ---------------------------------------------------------------
function setupTextareaDemo() {
  const rowsRange = document.getElementById("rows-range");
  const colsRange = document.getElementById("cols-range");
  const area = document.getElementById("demo-textarea");
  const code = document.getElementById("textarea-code");

  function update() {
    area.rows = Number(rowsRange.value);
    area.cols = Number(colsRange.value);
    document.getElementById("rows-out").textContent = rowsRange.value;
    document.getElementById("cols-out").textContent = colsRange.value;
    code.textContent = `<textarea rows="${rowsRange.value}" cols="${colsRange.value}"></textarea>`;
  }
  rowsRange.addEventListener("input", update);
  colsRange.addEventListener("input", update);
  update();
}

// ---------------------------------------------------------------
// DEMO 5: what actually gets sent?
// ---------------------------------------------------------------
function setupSendDemo() {
  const form = document.getElementById("send-form");
  const result = document.getElementById("send-result");

  // The browser checks required, min, max... first. This only runs when the form is valid.
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // do not really send anything

    const data = new FormData(form);
    const lines = [];
    for (const [name, value] of data.entries()) {
      lines.push(`${name} = ${value}`);
    }
    result.textContent =
      lines.length > 0
        ? "Data sent:\n" + lines.join("\n")
        : "Nothing to send.";
    result.textContent += "\n\nMissing? 'secret' is disabled, 'Nickname' has no name, and the newsletter box is only sent when ticked.";
  });
}

// ---------------------------------------------------------------
// START
// ---------------------------------------------------------------
function setupDemos() {
  setupElementDemo();
  setupInputDemo();
  setupLabelDemo();
  setupTextareaDemo();
  setupSendDemo();
}

initLecture("s02", { activities, quiz, onReady: setupDemos });

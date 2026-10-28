// js/config.js
// ---------------------------------------------------------------
// THE FILE YOU EDIT EVERY WEEK.
// It holds the module details, the learning outcomes (LOs) and the
// list of published lectures under each LO.
//
// To publish a new lecture:
//   1. Copy lectures/_template to lectures/loX/session-NN (html + js)
//   2. Add a new object to the "lectures" list of the right LO below
//   3. Upload the site again - the home page updates by itself
// ---------------------------------------------------------------

export const MODULE = {
  name: "Web Design & Development",
  code: "Y/618/7419",
  unit: "Unit 13",
  programme: "Pearson BTEC Higher National Diploma in Computing",
  lecturer: "Hashini Jayasinghe",
  lecturerQualification: "BSc (Hons) IT (Software Engineering), MSc in CS (Reading)",
  intro:
    "Learn how websites are planned, built, tested and published. " +
    "Each week's lecture material, activities and quiz are added here.",
};

// How many points each kind of item is worth.
export const POINTS = {
  read: 2,          // reading a lecture section
  activity: 10,     // completing an activity
  quizQuestion: 5,  // each correct quiz answer
};

// ---------------------------------------------------------------
// Learning outcomes and their lectures
// ---------------------------------------------------------------
// Item "type" must be one of: "read", "activity", "quiz".
// A quiz item also needs "questions" (how many questions it has).
// Item ids use only letters, numbers and underscores (Firebase safe).
// ---------------------------------------------------------------

export const LEARNING_OUTCOMES = [
  {
    id: "LO1",
    title:
      "Explain server technologies and management services associated with hosting and managing websites",
    criteria: ["P1", "P2", "M1", "M2", "D1"],
    lectures: [],
  },
  {
    id: "LO2",
    title:
      "Categorise website technologies, tools and software used to develop websites",
    criteria: ["P3", "P4", "M3"],
    lectures: [],
  },
  {
    id: "LO3",
    title:
      "Utilise website technologies, tools and techniques with good design principles to create a multipage website",
    criteria: ["P5", "P6", "M4", "D2"],
    lectures: [
      {
        id: "s01", // short id, used in the database
        session: "Session 01",
        title: "Introduction to Web Design & Development",
        summary:
          "What web design and development are, how wireframes plan a site, " +
          "and your first hands-on HTML: headings, paragraphs, links, images, lists, tables and div.",
        page: "lectures/lo3/session-01.html",
        items: [
          { id: "r_design",    title: "What is web design?",                 type: "read" },
          { id: "r_wireframe", title: "Wireframes: the blueprint",           type: "read" },
          { id: "a_wireframe", title: "Task: plan a wireframe",              type: "activity" },
          { id: "r_dev",       title: "Web development and the 3 languages", type: "read" },
          { id: "r_html",      title: "HTML basics",                         type: "read" },
          { id: "a_headings",  title: "Activity 1: Headings",                type: "activity" },
          { id: "a_paragraphs",title: "Activity 2: Paragraphs",              type: "activity" },
          { id: "a_links",     title: "Activity 3: Links",                   type: "activity" },
          { id: "a_images",    title: "Activity 4: Images",                  type: "activity" },
          { id: "a_lists",     title: "Activity 5: Lists",                   type: "activity" },
          { id: "a_tables",    title: "Activity 6: Tables",                  type: "activity" },
          { id: "a_div",       title: "Activity 7: Div container",           type: "activity" },
          { id: "r_together",  title: "How the 3 languages work together",   type: "read" },
          { id: "quiz",        title: "Session 01 quiz",                     type: "quiz", questions: 9 },
        ],
      },
    ],
  },
  {
    id: "LO4",
    title:
      "Create and use a Test Plan to review the performance and design of a multipage website",
    criteria: ["P7", "M5", "D3"],
    lectures: [],
  },
];

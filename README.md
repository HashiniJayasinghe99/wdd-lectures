# WDD Lecture Site

Static lecture website for **Web Design & Development (Y/618/7419)**.
Students sign in with their registration number (no password), do activities, earn points,
and see a progress wheel and a leaderboard. Data is stored in Firebase Firestore.

## Folder structure

```
wdd-lectures/
├── index.html            Home page (module, learning outcomes, lecture list)
├── leaderboard.html      Ranking of students by points
├── profile.html          Student profile: progress wheel, edit display name
├── firestore.rules       Security rules to paste into Firebase
├── css/
│   └── style.css         All styling (colours are at the top of the file)
├── js/
│   ├── config.js         EDIT WEEKLY: module info, learning outcomes, lectures
│   ├── firebase-config.js  Your Firebase keys
│   ├── db.js             The only file that talks to the database
│   ├── auth.js           Sign in / sign out with registration number
│   ├── progress.js       Progress and points calculations
│   ├── ui.js             Header, sign-in pop-up, progress wheel, toast messages
│   ├── lecture.js        Shared code for every lecture page
│   ├── components/
│   │   ├── code-lab.js   Live HTML editor activities
│   │   └── quiz.js       Multiple-choice quiz
│   └── pages/            One script per main page (home, leaderboard, profile)
└── lectures/
    ├── _template/        Copy these two files to start a new lecture
    └── lo3/
        ├── session-01.html   The lecture content
        └── session-01.js     Its activities and quiz questions
```

## 1. Try it without Firebase (demo mode)

The site uses JavaScript modules, so it must be opened through a web server, not by double-clicking the file.

1. Open the folder in **VS Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

While `js/firebase-config.js` still has the `YOUR_...` placeholders, the site runs in **demo mode**
(data stays in your own browser). Sign in with `DEMO001`, `DEMO002` or `DEMO003`.

## 2. Connect Firebase

1. Go to the [Firebase console](https://console.firebase.google.com) and **create a project**.
2. **Build > Firestore Database > Create database** (choose a location, start in production mode).
3. **Project settings > Your apps > Web (`</>`)**: register an app and copy the `firebaseConfig` values into `js/firebase-config.js`.
4. **Firestore > Rules**: paste the contents of `firestore.rules` and publish.

## 3. Add your eligible students

In **Firestore > Data**:

1. Start a collection called **`students`**.
2. For each student, add a document whose **Document ID is the registration number**.
   Write it in capitals with dashes instead of slashes or spaces, e.g. `HND-2025-001`
   (the sign-in box converts what students type into this format automatically).
3. Give every document these fields:

| Field | Type | Value |
|---|---|---|
| `displayName` | string | Their name (students can change it later) |
| `points` | number | `0` |
| `completed` | map | empty map |
| `scores` | map | empty map |

Only students who have a document can sign in. The website cannot create or delete students.

## 4. Publish a new lecture each week

1. Copy `lectures/_template/lecture.html` and `lecture.js` into the right folder,
   e.g. `lectures/lo2/session-02.html` and `session-02.js`. Keep them two folders deep.
2. In the HTML file, change the last script line to `session-02.js`. In the JS file, change `"s02"` to your lecture id.
3. Write your content in the HTML, and your activities and quiz in the JS file. `session-01` is a full example.
4. Add the lecture to the right learning outcome in `js/config.js` (copy the `s01` entry). List every
   tracked item (`read`, `activity`, `quiz`) there, because the progress wheel counts them.
5. Upload the site again. The home page, profile and leaderboard update by themselves.

### Points

Set in `js/config.js`: reading a section = 2, an activity = 10, each correct quiz answer = 5.
Only a student's best quiz score counts.

## 5. Put it online

Any static host works: **Firebase Hosting**, GitHub Pages or Netlify. Upload the whole folder.

## Good to know

- **No password means a registration number is the only key.** Anyone who knows a classmate's number can sign in as them
  and change their name or progress. That is fine for a friendly learning leaderboard, but do not use it for graded marks.
- Registration numbers are document IDs, so someone who inspects the network traffic could see them.
  The leaderboard itself only shows display names.
- To remove a student or reset their progress, edit their document in the Firebase console.

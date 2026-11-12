# Universal Study Guide

A website that turns **notes for any subject** into quizzes: math, science, history, English, languages, anything. Paste notes from class, a study guide, or from ChatGPT, Claude or any other AI. The site saves them under your profile, builds study cards, quizzes you over time with spaced repetition, and helps you cram before a quiz or test. No notes? Practice **53 built-in topics across 6 subjects**, from arithmetic to topology, biology to world history, grammar to Spanish.

**Live site:** https://hernandezmyles82-spec.github.io/universal-study-guide/

## Features

- **Profiles**: each student has their own notes, cards and progress (saved in the browser).
- **Notes → study cards**: paste notes or upload a `.txt` / `.md` file. The site recognizes:
  - `## Topic` headings, `Term: definition`, `Formula name: formula`, `X is defined as / means / is called ...`
  - fill-in-the-blank questions from **bold** words, dates and years, and names of people, places, events and documents
  - `Q: ...` / `A: ...` practice questions, `Example: ...` / `Solution / Answer: ...` worked problems
  - Markdown tables, `front :: back` flashcards, and `{{cloze}}` blanks
  - LaTeX math (`$x^2$`, `$$\frac{a}{b}$$`, `\( \)`), rendered with KaTeX
- **Quizzes**: multiple choice, type the answer (understands `3/4`, `0.75`, `25pi`, `sqrt(2)`) and flashcards. Includes an "I was actually right" override.
- **Spaced repetition / daily review**: cards you miss come back in 10 minutes; cards you know come back after 1, 3, 7+ days.
- **Test Prep**: add a quiz or test date and choose which notes and topics are on it. Then take a **Quick quiz** (your weakest cards), a **Full practice test**, or use **🔥 Cram mode**, which repeats every miss until you get it right. Includes a countdown and a daily study plan.
- **Built-in subjects**: a reference sheet plus endless practice questions for every topic:
  - **Math** (36 topics, Easy / Medium / Hard): Arithmetic, Fractions, Percents, Exponents, Ratios, Linear Equations, Algebra 2 (Functions, Slope & Lines), Lines & Slope, Systems, Polynomials, Quadratics, Logs, Functions, Area, Pythagorean Theorem, Angles, Volume, Unit Circle, Right-Triangle Trig, Sequences, Complex Numbers, Limits, Derivatives, Integrals, Series, Multivariable Calculus, Linear Algebra, Differential Equations, Statistics & Probability, Discrete Math, Number Theory, Abstract Algebra, Real Analysis, Complex Analysis and Topology.
  - **Science**: Cells; Genetics & Evolution (Punnett squares); Ecology & Energy; Atoms & the Periodic Table (symbols, protons/neutrons/electrons, molar mass, pH, bonds); Forces, Motion & Energy (speed, F = ma, energy, work, power, Ohm's law); Earth & Space.
  - **History & Social Studies**: U.S. History, World History (dates and "which came first"), Government & Civics, World Geography (capitals and continents), Economics & Personal Finance.
  - **English**: Grammar & Parts of Speech, Literary Devices, Reading & Writing Skills, Word Roots.
  - **World Languages**: Spanish and French vocabulary and verb conjugation.
  - **Computer Science**: programming basics, binary, Boolean logic, Big-O and reading code.
- **Weak spots** on the dashboard, study streaks, and **backup / import** to move your data between devices.

### Tip for AI notes
On the "Add notes" page there's a ready-made prompt you can copy into ChatGPT, Claude or any AI along with your study guide. It makes the AI write notes in the format this site understands best.

## Student accounts

Students can create their own account (name, email, password) so everything they add is saved
and follows them to any device. This uses Firebase (free). Follow [FIREBASE-SETUP.md](FIREBASE-SETUP.md)
to turn it on. Until then, the site works without accounts and saves notes in each browser.

## Run it

It's a static site with no build step and no server.

- **Locally:** open `index.html`, or run `python3 -m http.server` and visit http://localhost:8000
- **Free hosting with GitHub Pages:** repo **Settings → Pages → Deploy from a branch**, then choose the branch and `/ (root)`.

## Tests

```
node tests/run-tests.js
```
These check the answer checker, the notes parser, storage and spaced repetition, and quiz building, and run every practice-problem generator at every difficulty.

## Project layout

```
index.html          app shell
css/styles.css      styles (light + dark mode, mobile friendly)
js/util.js          helpers, safe math evaluator, answer checking
js/store.js         profiles, notes, cards, exams, spaced repetition (localStorage)
js/sync.js          saves to an online account (claude.ai or Firebase)
js/accounts.js      website sign up / log in with Firebase
js/firebase-config.js  your Firebase settings (null = accounts off)
firestore.rules     database rules: each student reads/writes only their own data
js/parser.js        notes → study cards
js/library.js       subjects + math topics with reference sheets
js/library-subjects.js  science, history, English, languages, computer science topics
js/generators.js    randomized math practice problems
js/generators-subjects.js  practice questions for the other subjects
js/quiz.js          builds quizzes from cards / categories / exams
js/app.js           UI views and routing
vendor/katex/       KaTeX math rendering (MIT license)
vendor/firebase/    Firebase SDK 10.12.2 (Apache 2.0)
tests/              Node tests + sample notes
DEVELOPMENT.md      how the code works + pitfalls to avoid when changing it
```

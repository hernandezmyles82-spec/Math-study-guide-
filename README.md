# Universal Study Guide

A website that turns **notes for any subject** into quizzes: math, science, history, English, languages, anything. Paste notes from class, a study guide, or from ChatGPT, Claude or any other AI. The site saves them under your profile, builds study cards, quizzes you over time with spaced repetition, and helps you cram before a quiz or test. No notes? Practice **91 built-in topics across 7 subjects, from elementary school to AP, IB and college**, or study any of **60 AP and IB courses** unit by unit.

## Use it

- **Main version (claude.ai):** https://claude.ai/artifact/UKoHcpR26SUxNA5ccNJ1vR
  Everyone signs in with their own claude.ai account (free works). Their notes and progress are saved
  privately to that account: nobody else, including the page's owner, can see them, and they follow the
  person to any device. To share it, open the link → **Share** → give people **Contributor** access
  (Viewers can use it, but their notes stay in their own browser).
- **Public website (GitHub Pages):** https://www.universalstudyguide.com/
  No sign-in; notes are saved in each visitor's browser. Optional email/password accounts can be
  turned on with Firebase (see [FIREBASE-SETUP.md](FIREBASE-SETUP.md)).

Both versions are built from the same code (`python3 tools/build-artifact.py` makes the claude.ai page).

## Features

- **Profiles**: each student has their own notes, cards and progress (saved to their claude.ai account on the main version, or in the browser on the public website).
- **Notes → study cards**: paste notes or upload a `.txt` / `.md` file. The site recognizes:
  - `## Topic` headings, `Term: definition`, `Formula name: formula`, `X is defined as / means / is called ...`
  - fill-in-the-blank questions from **bold** words, dates and years, and names of people, places, events and documents
  - `Q: ...` / `A: ...` practice questions, `Example: ...` / `Solution / Answer: ...` worked problems
  - Markdown tables, `front :: back` flashcards, and `{{cloze}}` blanks
  - LaTeX math (`$x^2$`, `$$\frac{a}{b}$$`, `\( \)`), rendered with KaTeX
- **Format with AI (your choice)**: when you add notes, pick **📝 Keep my notes as I wrote them** or **✨ Let AI format my notes**. AI is never used unless you pick it, and the site remembers your choice (you can change it on the Profile page). With AI picked, paste your notes and click **✨ Format with AI** to have AI tidy them into the format that makes the best quiz questions. It keeps your facts and wording and adds nothing new, and you see both versions side by side, with the number of study cards each makes, before choosing. You can always undo. On the claude.ai version, Claude does it right in the page (using your own Claude account, after you allow it); on the public website, the button gives you a ready-made prompt with your notes to paste into any AI chat.
- **Ways to study** every topic, course and set of notes:
  - 🃏 **Flashcards**: flip cards, shuffle, ⭐ star the hard ones, sort into "know it" / "still learning"
  - 🧠 **Learn**: keeps asking until you get each card right twice in a row (choose it, then type it)
  - 🧩 **Matching**: a timed game matching terms to definitions
  - ✅ **True / False** quick rounds
  - 📝 **Practice test**: timed, no answers shown until the end, then a review of every question
  - ⏳ **Put in order**: timelines and step-by-step processes
- **Study guides**: every one of the 91 built-in topics has a full guide (overview, key ideas, worked examples, common mistakes, a self-check, and timelines), with 🔊 read aloud and 🖨️ print.
- **Mistake notebook**: every missed question is saved to redo; answer it right and it leaves the notebook.
- **Progress & badges**: study streak, a 5-week activity calendar, 13 badges, and mastery % for each topic.
- **Quizzes**: multiple choice, type the answer (understands `3/4`, `0.75`, `25pi`, `sqrt(2)`) and flashcards. Includes an "I was actually right" override.
- **Spaced repetition / daily review**: cards you miss come back in 10 minutes; cards you know come back after 1, 3, 7+ days.
- **Test Prep**: add a quiz or test date and choose which notes and topics are on it. Then take a **Quick quiz** (your weakest cards), a **Full practice test**, or use **🔥 Cram mode**, which repeats every miss until you get it right. Includes a countdown and a daily study plan.
- **Built-in subjects, lowest to highest**: every topic has a reference sheet and endless practice questions, and a level tag (Elementary, Middle school, High school, AP & IB, College). The Categories page filters by subject and by level.
  - **Math** (37): early math (place value, time, money) → arithmetic, fractions → algebra, geometry, trig → precalculus → AP/IB calculus and statistics → college linear algebra, differential equations, discrete math, number theory, abstract algebra, real and complex analysis, topology.
  - **Science** (13): Science Explorers → cells, genetics, ecology, human body, earth & space, astronomy → chemistry (atoms, reactions & stoichiometry), physics (motion, waves & electricity) → environmental science → organic chemistry.
  - **History & Social Studies** (14): community & map skills → ancient civilizations, geography → U.S. and world history, government, economics → European history, psychology, human geography, comparative government, macro- and microeconomics → philosophy & political theory.
  - **English** (9): phonics & early reading → grammar, word roots, literary devices → reading & writing → rhetoric (AP Language), poetry (AP Literature), research & Theory of Knowledge → literary theory.
  - **World Languages** (10): first words in Spanish → Spanish basics → past tenses → advanced grammar (AP/IB); French, German, Italian, Latin, Chinese and Japanese.
  - **Computer Science** (5): digital literacy → programming basics → Java (AP CSA), internet & cybersecurity (AP CSP) → data structures & algorithms.
  - **Arts & Music** (3): art & music basics → music theory → art history.
- **AP & IB courses** (60): all 36 AP courses and 24 IB Diploma subjects (including TOK and the Extended Essay). Each course page lists the official units, links the topics that practice them, gives a "Practice this course" quiz that mixes all of them, and can start a Test Prep plan with those topics already picked.
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

## Security

The site has no server or database of its own to break into: the public website is plain files, and notes live in each student's browser or their own claude.ai account. A Content-Security-Policy in `index.html` lets the browser run only the site's own scripts, so code typed into notes, names or a backup file can never run. See DEVELOPMENT.md → Security.

## Project layout

```
index.html          app shell
css/styles.css      styles (light + dark mode, mobile friendly)
js/util.js          helpers, safe math evaluator, answer checking
js/store.js         profiles, notes, cards, exams, spaced repetition (localStorage)
js/sync.js          saves to an online account (claude.ai or Firebase)
js/ai-format.js     "Format with AI": the prompt, cleanup of the answer, and claude.ai's ask-Claude
js/accounts.js      website sign up / log in with Firebase
js/firebase-config.js  your Firebase settings (null = accounts off)
firestore.rules     database rules: each student reads/writes only their own data
js/parser.js        notes → study cards
js/library.js       subjects + math topics with reference sheets
js/library-subjects.js  science, history, English, languages, computer science topics
js/library-more.js  beginner and advanced topics for every subject, Arts & Music, and each topic's grade band
js/courses.js       AP and IB courses: units and linked topics
js/generators.js    randomized math practice problems
js/generators-subjects.js  practice questions for the other subjects
js/generators-more.js  practice questions for the topics in library-more.js
js/quiz.js          builds quizzes from cards / categories / exams
js/guides.js        study guide format (parser)
js/guides-*.js      the study guide for every built-in topic, one file per subject
js/modes.js         study-mode logic: flashcards, learn, matching, true/false, tests, put in order, badges
js/study.js         study-mode screens, study guides, mistake notebook, progress page
js/app.js           UI views and routing
vendor/katex/       KaTeX math rendering (MIT license)
vendor/fonts/       Inter and Bricolage Grotesque fonts (SIL Open Font License)
vendor/firebase/    Firebase SDK 10.12.2 (Apache 2.0)
tests/              Node tests + sample notes
DEVELOPMENT.md      how the code works + pitfalls to avoid when changing it
```

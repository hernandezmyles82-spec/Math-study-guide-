---
title: App overview
type: architecture
created: 2026-11-09
updated: 2026-11-09
sources:
  - code: index.html
  - code: js/app.js
  - code: js/store.js
  - code: js/quiz.js
  - code: js/util.js
  - code: js/library.js
  - code: js/generators.js
  - code: tests/run-tests.js
verified_at: 20b8d7f
---

# App overview

A static, build-free website: plain HTML/CSS/JS with no server and no framework. A student
pastes math notes; the site turns them into study cards, quizzes them with spaced
repetition, runs test prep (quick quiz / full test / cram mode), and offers 35 built-in math
categories with randomized practice problems.

## Modules and load order

`index.html` loads plain scripts in a fixed order. Each script attaches itself to the
global `window.MSG` namespace (or `globalThis` under Node, so the tests can `require` them).

| File | Role |
|---|---|
| `js/util.js` | `MSG.U`: random helpers, HTML escaping, dates, a safe math evaluator (`U.evalExpr`, `js/util.js:57`) and answer checking (`U.checkText`, `js/util.js:147`) |
| `js/store.js` | `MSG.Store`: profiles, notes, cards, exams, spaced repetition. Persists to `localStorage` under `mathStudyGuide.v1` (`js/store.js:6`) |
| `js/parser.js` | `MSG.parseNotes`: notes into cards. See [[notes-parser]] |
| `js/library.js` | `MSG.Library`: the categories and their reference-sheet concepts, written as one `String.raw` block parsed at load |
| `js/generators.js` | `MSG.Generators`: per-category random problem generators keyed by the same category ids (`generate`, `js/generators.js:458`) |
| `js/quiz.js` | `MSG.Quiz`: builds questions from cards, categories and exams; checks answers (`js/quiz.js:177`) |
| `js/app.js` | Hash router (`route`, `js/app.js:528`), views as HTML-string functions, delegated `data-action` / `data-form` handlers |
| `vendor/katex/` | Bundled KaTeX for math rendering, so the site works offline and without a CDN |

> ⚠️ Script order in `index.html` matters: each module destructures what it needs from `window.MSG` at load time (for example `js/quiz.js` needs `U`, `Library`, `Generators`, `Store`). Adding a module means placing it after its dependencies, and adding it to the `require` list in `tests/run-tests.js` too.

## Data model

One profile holds `notes`, `cards`, `exams`, `activity` (per-day counts for the streak),
`catStats` (per-category right/wrong), `sessions` and `settings`. Each card has an
`srs` block (`due`, `interval`, `ease`, `reps`, `lapses`) and `stats`. Scheduling is a
simplified SM-2 in `Store.schedule` (`js/store.js:124`): a miss comes back in 10 minutes,
hits go 1 day, then 3, then `interval * ease`.

Card `source` is `note` (generated from notes), `manual` (typed or edited by the student)
or `library` (concepts added from a category, with id `lib:<category>:<index>`).

> ⚠️ Re-saving a note re-parses it and replaces only `source: 'note'` cards, carrying progress over for cards whose front and back did not change (`Store.updateNote`, `js/store.js:67`). That is why `Store.updateCard` flips an edited card to `source: 'manual'`: otherwise the student's edit would be wiped the next time the note is saved.

> ⚠️ Library card ids are positional (`lib:<cat>:<index>`). Reordering or inserting concepts in `js/library.js` silently re-maps students' saved progress onto different concepts. Append new concepts at the end of a category.

## Question shapes

Every quiz question is one of three kinds: `mc` (choices + correct index), `input` (typed;
`check: 'numeric'` for generator answers, otherwise fuzzy text matching) or `flash`
(self-graded). Generators return `mc` or `input`; cards become any of the three by
weighted choice in `cardQuestion` (`js/quiz.js:66`).

> ⚠️ Answers are recorded only when the student presses Next (`commitAnswer`, `js/app.js:472`), not when they answer. That delay is what lets "I was actually right" (`js/app.js:591`) flip a wrong answer before it reaches spaced repetition. Recording earlier would make the override a lie.

> ⚠️ Distractors for category quizzes must come from the category's own concepts (and same-level categories), not from the student's notes. An early version pulled "A polygon with three sides" from personal notes into a unit-circle question, which made it trivially easy. See the scoring in `distractors` (`js/quiz.js:23`) and the pool in `forCategory` (`js/quiz.js:115`).

## Rendering math

All text goes through `U.esc` before insertion, then KaTeX auto-render runs over the
view (`renderMath`, `js/app.js:38`) with `$`, `$$`, `\(` and `\[` delimiters. KaTeX reads
text nodes, so escaped `&lt;` inside math still renders correctly.

> ⚠️ Single `$` is a math delimiter, so a note like "costs $5 and $10" renders the middle as math. Generators deliberately never print `$` for money (they say "dollars").

## Tests

`node tests/run-tests.js` checks the evaluator and answer checker, the parser against
`tests/sample-notes.md`, storage and scheduling, quiz building, and runs every generator
60 times at each difficulty, verifying finite answers and distinct choices.

> ⚠️ For a new generator, the test asserts that `answerDisplay` evaluates to `answer` (unless it contains `π`). Displaying a rounded or reformatted value that does not evaluate back will fail the suite, which is intended: the displayed answer must be one the checker would accept.

Related: [[notes-parser]].

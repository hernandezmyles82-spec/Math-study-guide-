# Development guide

How the code is organized, and the pitfalls to avoid when changing it. For what the site
does and how to run it, see [README.md](README.md).

Run the tests after any change:

```
node tests/run-tests.js
```

## How the app is built

A static, build-free website: plain HTML/CSS/JS with no server and no framework. A student
pastes notes for any subject; the site turns them into study cards, quizzes them with spaced
repetition, runs test prep (quick quiz / full test / cram mode), and offers built-in
categories with randomized practice problems.

### Modules and load order

`index.html` loads plain scripts in a fixed order. Each script attaches itself to the
global `window.MSG` namespace (or `globalThis` under Node, so the tests can `require` them).

| File | Role |
|---|---|
| `js/util.js` | `MSG.U`: random helpers, HTML escaping, dates, a safe math evaluator (`U.evalExpr`, `js/util.js:57`) and answer checking (`U.checkText`, `js/util.js:147`) |
| `js/store.js` | `MSG.Store`: profiles, notes, cards, exams, spaced repetition. Persists to `localStorage` under `mathStudyGuide.v1` |
| `js/parser.js` | `MSG.parseNotes`: notes into cards. See the "Notes parser" section below |
| `js/library.js` | `MSG.Library`: the categories and their reference-sheet concepts, written as one `String.raw` block parsed at load |
| `js/generators.js` | `MSG.Generators`: per-category random problem generators keyed by the same category ids (`generate`, `js/generators.js:458`) |
| `js/quiz.js` | `MSG.Quiz`: builds questions from cards, categories and exams; checks answers (`js/quiz.js:177`) |
| `js/firebase-config.js` | Firebase web settings, or `null` for no website accounts. Must load before `js/sync.js` |
| `js/sync.js` | `MSG.SyncEngine(backend)`: saves the whole store to an online account as a manifest plus chunks, newer copy wins. Also starts claude.ai account saving when running as a claude.ai artifact (skipped when Firebase is configured) |
| `js/accounts.js` | `MSG.Accounts`: Firebase email/password accounts; data at `users/<uid>` (+ `chunks`), protected by `firestore.rules`. Does nothing when the config is `null` |
| `js/app.js` | Hash router (`route`, `js/app.js:528`), views as HTML-string functions, delegated `data-action` / `data-form` handlers |
| `vendor/katex/` | Bundled KaTeX for math rendering, so the site works offline and without a CDN |

> ⚠️ **Watch out:** Script order in `index.html` matters: each module destructures what it needs from `window.MSG` at load time (for example `js/quiz.js` needs `U`, `Library`, `Generators`, `Store`). Adding a module means placing it after its dependencies, and adding it to the `require` list in `tests/run-tests.js` too.

### Data model

One profile holds `notes`, `cards`, `exams`, `activity` (per-day counts for the streak),
`catStats` (per-category right/wrong), `sessions` and `settings`. Each card has an
`srs` block (`due`, `interval`, `ease`, `reps`, `lapses`) and `stats`. Scheduling is a
simplified SM-2 in `Store.schedule` (`js/store.js:124`): a miss comes back in 10 minutes,
hits go 1 day, then 3, then `interval * ease`.

Card `source` is `note` (generated from notes), `manual` (typed or edited by the student)
or `library` (concepts added from a category, with id `lib:<category>:<index>`).

> ⚠️ **Watch out:** Re-saving a note re-parses it and replaces only `source: 'note'` cards, carrying progress over for cards whose front and back did not change (`Store.updateNote`, `js/store.js:67`). That is why `Store.updateCard` flips an edited card to `source: 'manual'`: otherwise the student's edit would be wiped the next time the note is saved.

> ⚠️ **Watch out:** Library card ids are positional (`lib:<cat>:<index>`). Reordering or inserting concepts in `js/library.js` silently re-maps students' saved progress onto different concepts. Append new concepts at the end of a category.

> ⚠️ **Watch out:** `Store.importProfile` rebuilds every field of a backup by hand with the right type, because ids, dates and numbers are put into the page without escaping and a backup file can be edited by anyone. The flip side: **a field added to the data model must also be added to `importProfile`, or it is silently dropped when a student restores a backup.** The round-trip tests in `tests/run-tests.js` catch missing links (cards to notes, exams to notes) but not new fields.

### Subjects

`Library.addSubject(name, icon, levels, raw)` registers a subject; `js/library.js` adds Math and
`js/library-subjects.js` adds the rest. Each category has a `subject` and a `level` (a group inside the
subject), and `Library.groups()` returns subjects → levels → categories for the Categories page, the
note editor and Test Prep. Practice questions for a category id live in `MSG.Generators.G[id]`
(`js/generators.js` for math, `js/generators-subjects.js` for the rest); the test suite requires every
category to have some.

> ⚠️ **Watch out:** The site was renamed from Math Study Guide to Universal Study Guide, but the storage key stays `mathStudyGuide.v1` (and `mathStudyGuide.v1:<uid>` with accounts). Renaming it would make every student's saved notes disappear.

> ⚠️ **Watch out:** In a category quiz, wrong answer choices come from the same subject (`forCategory` in `js/quiz.js`). A quiz built from notes never borrows another subject's definitions; with too few cards it uses typed or flashcard questions instead.

### Question shapes

Every quiz question is one of three kinds: `mc` (choices + correct index), `input` (typed;
`check: 'numeric'` for generator answers, otherwise fuzzy text matching) or `flash`
(self-graded). Generators return `mc` or `input`; cards become any of the three by
weighted choice in `cardQuestion` (`js/quiz.js:66`).

> ⚠️ **Watch out:** Answers are recorded only when the student presses Next (`commitAnswer`, `js/app.js:472`), not when they answer. That delay is what lets "I was actually right" (`js/app.js:591`) flip a wrong answer before it reaches spaced repetition. Recording earlier would make the override a lie.

> ⚠️ **Watch out:** Distractors for category quizzes must come from the category's own concepts (and same-level categories), not from the student's notes. An early version pulled "A polygon with three sides" from personal notes into a unit-circle question, which made it trivially easy. See the scoring in `distractors` (`js/quiz.js:23`) and the pool in `forCategory` (`js/quiz.js:115`).

> ⚠️ **Watch out:** Typed answers forgive a one- or two-letter typo only when the answer is plain words (`U.checkText`, `js/util.js`). An earlier version also forgave math, so `x^2-1` was marked correct for `x^2+1`. For the same reason, "a or b" alternatives apply only to word answers: `x = 2 or x = -3` needs both roots.

> ⚠️ **Watch out:** Multiple-choice distractors must never be equal in value to the answer or to each other ("2/1" vs "2"). Build them with `frac()` rather than raw `\frac{}{}` strings so equal values collapse, and keep the test in `tests/run-tests.js` that evaluates every pair of choices.

### Rendering math

All text goes through `U.esc` before insertion, then KaTeX auto-render runs over the
view (`renderMath`, `js/app.js:38`) with `$`, `$$`, `\(` and `\[` delimiters. KaTeX reads
text nodes, so escaped `&lt;` inside math still renders correctly.

> ⚠️ **Watch out:** Single `$` is a math delimiter. `money()` in `js/app.js` wraps a `$` that starts a plain amount ("$5", "$1,200.50") in its own element so the renderer cannot pair it, which keeps "costs $5 and $10" from turning into math. Keep `fmt()` and `md()` going through it. Generators deliberately never print `$` for money (they say "dollars").

### Running inside claude.ai

The site is also published as a claude.ai artifact (declared capabilities `db`, `user`,
`downloads`). Build that page with `python3 tools/build-artifact.py OUTPUT.html`: it makes one
self-contained page with every script, style and KaTeX font inlined, and Firebase turned off.

> ⚠️ **Watch out:** Publish only that single built page to claude.ai. Separate stylesheet, script and font files can be blocked by claude.ai's sandbox, which leaves the site unstyled.

> ⚠️ **Watch out:** Routes are plain `#name` or `#name--id` (for example `#note--abc123`, `#category--decimals-percents`), not `#/path`. claude.ai only passes plain `#name` hashes, and it reserves some names: never use `settings`, `sidebar`, `customize`, `upgrade`, `downloads` or `comment-*` as a route. That is why the settings page is `#profile`.

> ⚠️ **Watch out:** Never use `confirm()`, `alert()` or `prompt()`: claude.ai never shows them, and `confirm()` silently returns false. Use `ask()` in `js/app.js`, which shows an in-page dialog. File downloads go through `saveFile()`, which uses the `downloads` capability inside claude.ai and a normal download link elsewhere.

> ⚠️ **Watch out:** Account sync keeps whichever copy has the newer `updatedAt` (set on every save). Editing on two devices while one is offline keeps only the later device's changes. Each save writes new chunk ids before switching the manifest, so an interrupted save never corrupts the saved copy; do not "simplify" that into overwriting the same chunk ids.

### Website accounts (Firebase)

Setup steps for the site owner are in `FIREBASE-SETUP.md`. With a config set, `route()` shows the
log in / create account screen until Firebase reports a signed-in user and their notes have loaded
(`MSG.Accounts.loaded`).

> ⚠️ **Watch out:** With accounts on, the browser copy is stored per account (`mathStudyGuide.v1:<uid>`, via `Store.useAccount`), and nothing is loaded while nobody is logged in. Never read or write the plain `mathStudyGuide.v1` key in account mode, or one student would see the previous student's notes on a shared computer.

> ⚠️ **Watch out:** Logging out must call `engine.flush()` before `auth.signOut()` (see `A.logOut`), or the last few seconds of changes are lost: saves are delayed 1.5 s to group edits.

> ⚠️ **Watch out:** Firebase cannot run inside the claude.ai artifact (its sandbox blocks outside connections). When publishing the artifact, publish a `js/firebase-config.js` that sets `null`, even if the repository's copy has real settings.

### Tests

`node tests/run-tests.js` checks the evaluator and answer checker, the parser against
`tests/sample-notes.md`, storage and scheduling, quiz building, and runs every generator
60 times at each difficulty, verifying finite answers and distinct choices.

> ⚠️ **Watch out:** For a new generator, the test asserts that `answerDisplay` evaluates to `answer` (unless it contains `π`). Displaying a rounded or reformatted value that does not evaluate back will fail the suite, which is intended: the displayed answer must be one the checker would accept.

## Notes parser

`parseNotes(text, { title })` (`js/parser.js:94`) turns free-form notes (handwritten
style, Markdown, or AI output with LaTeX) into card objects `{ type, front, back, term?,
topic, work? }`. It is heuristic, one line at a time; students can edit or delete
any card afterwards, so it favors finding more cards over perfect precision.

### Pipeline

1. Normalize line endings and join multi-line display math (`$$ … $$`, `\[ … \]`) into
   single lines (`joinDisplayMath`, `js/parser.js:77`).
2. Walk the lines; `#` headings (and lone labels like `Power Rule:`) set the current
   `topic`.
3. Try each recognizer in order, and stop at the first that matches:
   tables (`js/parser.js:121`), `front :: back`, `{{cloze}}`, `Q:`/`A:`
   (`js/parser.js:166`), `Example:`/`Solution:`/`Answer:` (`js/parser.js:191`),
   label-then-formula, `Term: definition` / `**Term** - def`, natural-language
   definitions (`js/parser.js:242`), standalone formulas (`js/parser.js:255`), then
   fill-in-the-blank from bold words, then a year, then math vocabulary, then a name (`properNoun`), then any number.
4. Dedupe on `front|back`.

Card types: `def` (has `term`, so quizzes can ask in both directions), `qa`, `cloze`,
`problem` (keeps the full `work` and shows it as the explanation).

> ⚠️ **Watch out:** Recognizer order matters. `Q:` and `Example:` lines contain colons, so they must be tested before the generic `Term: definition` matcher, or "Example 1: Find…" becomes a vocabulary card about the word "Example 1".

> ⚠️ **Watch out:** `SKIP_TERM` (`js/parser.js:15`) is what stops words like Example, Note, Solution, Step 2, Definition from being treated as terms. When a new note style produces junk cards, the fix is usually adding to this list, not adding another regex.

> ⚠️ **Watch out:** Never insert the blank (`_____`) and then call `stripMd` on the result: `stripMd` treats `__x__` as bold and collapses the blank to `_`. Strip each segment first, then join around the blank, as `unwrap` does (`js/parser.js:159`).

> ⚠️ **Watch out:** Formula detection is deliberately strict in `defCard` (`js/parser.js:64`): a definition containing `=` is only a "formula" if it is mostly math (fewer than 4 prose words) or starts with a math delimiter. Otherwise "Critical point: a point where f'(x) = 0 …" is mislabeled "What is the formula for Critical point?".

> ⚠️ **Watch out:** Bare LaTeX in a definition (`\pi r^2` with no delimiters) is wrapped in `$…$` by `defCard`, or it shows as raw backslashes. Fill-in-the-blank avoids blanking text inside `$…$` / `\(…\)` via `hidesLatex` (`js/parser.js:44`), so a formula is never cut in half.

### Testing a change

`tests/sample-notes.md` holds AI-style notes covering every recognizer; `tests/run-tests.js`
asserts the key cards exist. To see everything the parser produces:

`node -e 'require("./js/util.js");require("./js/parser.js");console.log(MSG.parseNotes(require("fs").readFileSync("tests/sample-notes.md","utf8")))'`

The "Add notes" page shows a live preview and card count as the student types, so
parser behavior is visible in the UI immediately.

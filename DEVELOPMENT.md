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
| `js/file-text.js` | `MSG.FileText`: reads uploaded PDF (pdf.js) and Word .docx (mammoth) files into notes in the browser. Loads the libraries only when needed (`loadVendor`) |
| `js/guides.js` | `MSG.Guides`: parses the study-guide text format (`Guides.add(raw)`, `get(id)`) |
| `js/guides-*.js` | The study guide for every built-in topic, keyed by topic id, one file per subject (`guides-math.js`, `guides-science.js`, `guides-history.js`, `guides-english.js`, `guides-languages.js`, `guides-cs-arts.js`; `guides-content.js` holds Derivatives and U.S. History). Loaded after `js/guides.js` and before `js/modes.js` |
| `js/modes.js` | `MSG.Modes`: logic for the study modes (decks, true/false, matching, learn, practice test, put-in-order, badges, mastery). No HTML, so the tests can run it |
| `js/study.js` | `MSG.Study`: screens and actions for the study modes, study guides, mistake notebook and progress page. `js/app.js` calls `Study.init(helpers)` and merges the returned `views`, `actions` and `forms` into its router |
| `js/firebase-config.js` | Firebase web settings, or `null` for no website accounts. Must load before `js/sync.js` |
| `js/sync.js` | `MSG.SyncEngine(backend)`: saves the whole store to an online account as a manifest plus chunks, newer copy wins. Also starts claude.ai account saving when running as a claude.ai artifact (skipped when Firebase is configured) |
| `js/accounts.js` | `MSG.Accounts`: Firebase email/password accounts; data at `users/<uid>` (+ `chunks`), protected by `firestore.rules`. Does nothing when the config is `null` |
| `js/app.js` | Hash router (`route`, `js/app.js:528`), views as HTML-string functions, delegated `data-action` / `data-form` handlers |
| `vendor/katex/` | Bundled KaTeX for math rendering, so the site works offline and without a CDN |

> ⚠️ **Watch out:** Script order in `index.html` matters: each module destructures what it needs from `window.MSG` at load time (for example `js/quiz.js` needs `U`, `Library`, `Generators`, `Store`). Adding a module means placing it after its dependencies, and adding it to the `require` list in `tests/run-tests.js` too.

### Data model

One profile holds `notes`, `cards`, `exams`, `activity` (per-day counts for the streak),
`catStats` (per-category right/wrong), `sessions`, `settings`, `starred` (card or concept id → 1),
`mistakes` (the mistake notebook: missed questions, saved whole so they can be asked again) and
`modesUsed` (study mode → times used, for badges). Each card has an
`srs` block (`due`, `interval`, `ease`, `reps`, `lapses`) and `stats`. Scheduling is a
simplified SM-2 in `Store.schedule` (`js/store.js:124`): a miss comes back in 10 minutes,
hits go 1 day, then 3, then `interval * ease`.

Card `source` is `note` (generated from notes), `manual` (typed or edited by the student)
or `library` (concepts added from a category, with id `lib:<category>:<index>`).

> ⚠️ **Watch out:** Re-saving a note re-parses it and replaces only `source: 'note'` cards, carrying progress over for cards whose front and back did not change (`Store.updateNote`, `js/store.js:67`). That is why `Store.updateCard` flips an edited card to `source: 'manual'`: otherwise the student's edit would be wiped the next time the note is saved.

> ⚠️ **Watch out:** Library card ids are positional (`lib:<cat>:<index>`). Reordering or inserting concepts in `js/library.js` silently re-maps students' saved progress onto different concepts. Append new concepts at the end of a category.

> ⚠️ **Watch out:** `Store.importProfile` rebuilds every field of a backup by hand with the right type, because ids, dates and numbers are put into the page without escaping and a backup file can be edited by anyone. The flip side: **a field added to the data model must also be added to `importProfile`, or it is silently dropped when a student restores a backup.** The round-trip tests in `tests/run-tests.js` catch missing links (cards to notes, exams to notes) but not new fields.

> ⚠️ **Watch out:** Profiles saved before `starred`, `mistakes` and `modesUsed` existed don't have them. Always go through `Store.starred()`, `Store.mistakes()` and `Store.modesUsed()`, which create them on first use; never read `p.mistakes` directly.

### Study modes, guides, notebook and progress

Every mode works on a **source**, which is also in the page address: `cat_<topic>`, `course_<course>`, `note_<note>`, `starred` or `deck` (`Modes.parseSource`, which rejects anything else). `Modes.deck(src)` turns it into items `{ id, front, back, term, prompt, cardId | conceptId, categoryId, topic }`. Routes: `#flashcards--<src>`, `#learn--<src>`, `#match--<src>`, `#truefalse--<src>`, `#test--<src>`, `#order--<src>`, plus `#mistakes` and `#progress`. `Study.modesPanel(src)` is the "Ways to study" card on topic, course and note pages.

- **Practice test** uses the normal quiz with `startQuiz(..., { test: true, minutes })`: `answer()` moves straight on without feedback, a timer ends it, and the summary reviews every question with the student's answer.
- **True / false** questions are ordinary `mc` questions with the choices `True` / `False`; a false one pairs a term with another card's answer and explains the right one.
- **Learn** needs each card right twice in a row (choose, then type when the answer is short) and works in groups of 7.
- **Put in order** uses a guide's `## Timeline` and `## In order:` lists, and year cards (`____` + a year) from notes.
- **Mistake notebook**: `Study.record(q, correct)` is the one place an answer is saved (spaced repetition, topic stats, streak, notebook). A miss is added with `Store.addMistake(q)`; answering the same question right anywhere removes it.
- **Written answers** (`#write--<src>`, `Modes.writtenQuestions`): exam-style questions with model answers, from a guide's "Check yourself" and from cards ("Explain what X means"); marks (1–3) come from the model answer's length. Inside claude.ai Claude grades the answer (`AIFormat.gradePrompt` / `parseGrade`, which checks and caps the reply); elsewhere the student compares with the model answer and scores themselves, with a prompt to paste into any AI chat. Less than full marks adds the question to the mistake notebook.
- **AI study guides for notes:** the note page's "Study guide" tab asks AI (`AIFormat.guidePrompt`, only facts from the notes) for a guide in the same format as the built-in ones, plus a `## Concept map` section (`Center:` and `- Big idea: detail; detail`). It is saved on the note as `note.guide` (`Store.setNoteGuide`) and parsed when shown (`Modes.noteGuide`); its timeline, step lists and questions feed the order game and written answers. Outside claude.ai the student copies a prompt and pastes the answer back.
- **Study sheet** (`#sheet--<src>`): key terms, key ideas, timeline and the self-check answers on one page.
- **Light / dark switch:** the 🌓 button cycles device → light → dark and stores the choice in `localStorage` (`usg:theme`). "Match my device" never removes a `data-theme` that claude.ai set on load.
- **Badges and mastery** are computed from saved data each time (`Modes.badges()`, `Modes.topicMastery(id)`): nothing extra is stored except `modesUsed`.
- **Read aloud** uses the browser's speech (`speechSynthesis`), with LaTeX turned into words by `Study.speakable`. **Print** (public website only: claude.ai never opens the print dialog, so `printBtn()` hides it there) uses `@media print` in `css/styles.css` (`.no-print` hides buttons) and opens the self-check answers before printing.

Study guides are written in the `js/guides-*.js` files in the format documented at the top of `js/guides.js` (`@@ topic-id`, then `## Overview`, `## Key ideas`, `## Worked examples` with `Example:`/`Solution:`/`Answer:`, `## Common mistakes`, optional `## Timeline` and `## In order: …`, and `## Check yourself` with `Q:`/`A:`). The tests require every topic to have a guide, and every guide to have an overview, key ideas, common mistakes, at least 2 worked examples and 4 self-check questions, and timeline years that parse.

> ⚠️ **Watch out:** A new topic needs a guide too (the tests check it), and a new `js/guides-*.js` file must be added to `index.html` and to the `require` list in `tests/run-tests.js`.

> ⚠️ **Watch out:** A guide is the student's main explanation of a topic, so every fact, date and worked answer in it must be right. When adding one, check it against the topic's reference sheet in `js/library*.js` (they must agree) and re-solve every worked example.

> ⚠️ **Watch out:** AI replies are never inserted as HTML. A guide is parsed into text and shown through `fmt`/`md` (escaped); a grade is parsed as JSON and every field is checked, trimmed and escaped. Keep it that way: pasted answers on the public site can contain anything.

> ⚠️ **Watch out:** pdf.js and mammoth are large (about 2 MB). On the website they load from `vendor/` only when a PDF or Word file is picked. The claude.ai build embeds them as `<script type="text/plain" id="vendor-…">` blocks that `loadVendor` runs on demand, and the pdf.js worker runs from a `blob:` URL; don't turn them into normal scripts, or every page load parses them.

> ⚠️ **Watch out:** Timeline years must be different from each other (the order game needs one right answer). Write ranges as `1861–1865`, BCE dates as `3000 BCE`, and deep time as `4.6 billion years ago`; `Guides.yearOf` sorts them.

### Subjects

`Library.addSubject(name, icon, levels, raw)` registers a subject; `js/library.js` adds Math and
`js/library-subjects.js` adds the rest. Each category has a `subject` and a `level` (a group inside the
subject), and `Library.groups()` returns subjects → levels → categories for the Categories page, the
note editor and Test Prep. Practice questions for a category id live in `MSG.Generators.G[id]`
(`js/generators.js` for math, `js/generators-subjects.js` for the rest); the test suite requires every
category to have some.

Topics also have a grade `band` (0 Elementary … 4 College; `Library.BANDS`), set in the `BAND` map at the end of `js/library-more.js`; `groups()` sorts each level's topics by band. `Library.addCategories(subject, raw, newLevels)` adds topics (and new levels, first or last) to an existing subject.

AP and IB courses live in `js/courses.js`: each has `units` (from the College Board course descriptions and IB subject guides) and `topics` (built-in topic ids). `Quiz.forCourse` spreads a quiz across those topics. Course pages are `#course--<id>`.

> ⚠️ **Watch out:** A new topic needs an entry in the `BAND` map (the tests require every subject to reach from Elementary to AP/IB) and practice questions in `MSG.Generators.G[id]`. A course may only link topic ids that exist; the tests check both.

> ⚠️ **Watch out:** The tests reject any question containing "NaN" as a whole word (a broken number). Chemical formulas like NaNO₃ are fine because the check uses word boundaries; keep it that way.

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

### Look and feel

`css/styles.css` starts with the design tokens (light values on `:root`, dark values in both the `prefers-color-scheme` block and `[data-theme="dark"]`): paper background, ballpoint-blue `--primary`, highlighter `--hl-mark` (key words in guides, the current menu item), index-card `--rule` / `--rule-line` (flashcards, the landing page cards), graph-paper `--grid`, and one color per subject (`--s-math`, …). Any element with `data-subject="<slug>"` gets that subject's color as `--subj` (slug = `subjSlug(subject)` in `js/app.js`). The "Design layer" at the end of the file refines the base rules.

Fonts are Inter (text) and Bricolage Grotesque (headings), vendored in `vendor/fonts/` (SIL Open Font License) because the security policy only allows the site's own files; `tools/build-artifact.py` embeds them as data URIs for the claude.ai page.

> ⚠️ **Watch out:** Every color must be a token defined on bare `:root` first; never put a literal color in a component rule, or it breaks in dark mode.

### Security

`index.html` sets a Content-Security-Policy: scripts only from the site itself, no inline scripts or `on…=` attributes, no plugins, and network connections only to the site and Firebase. Text from notes, names and backups is always escaped (`U.esc`), and `Store.importProfile` rebuilds every field of a backup.

> ⚠️ **Watch out:** Never add an inline `<script>` or an `onclick=`/`onload=` attribute: the policy blocks it and the feature silently stops working. Put the code in a `.js` file and use `data-action`. A new outside service (an API, a CDN) needs its host added to the policy. The claude.ai build leaves the policy out, because claude.ai sets its own and the page there is one inlined file.

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

> ⚠️ **Watch out:** Saving can report its status before `js/app.js` has loaded (claude.ai's account can answer within the same tick). `status()` in `js/sync.js` stores the latest one in `MSG.syncStatus`, and `js/app.js` shows it on start; without that the footer wrongly says "saved in this browser".

> ⚠️ **Watch out:** Screens that describe saving must check where notes go: `savedToAccount()` and `accountBox()` in `js/app.js` (claude.ai account, Firebase account, or this browser only). The Firebase setup page explains itself away inside claude.ai, where Firebase cannot run.

> ⚠️ **Watch out:** Inside claude.ai each account also gets its own browser copy (`mathStudyGuide.v1:claude-<id>`), and nothing is loaded until the account is known (`MSG.Sync.loading` shows "Loading…"). Without this, on a shared computer the second person would see the first person's notes, and the "newer copy wins" rule would upload them into the second person's account.

> ⚠️ **Watch out:** Account sync keeps whichever copy has the newer `updatedAt` (set on every save). Editing on two devices while one is offline keeps only the later device's changes. Each save writes new chunk ids before switching the manifest, so an interrupted save never corrupts the saved copy; do not "simplify" that into overwriting the same chunk ids.

### Website accounts (Firebase)

Setup steps for the site owner are in `FIREBASE-SETUP.md`. With a config set, `route()` shows the
log in / create account screen until Firebase reports a signed-in user and their notes have loaded
(`MSG.Accounts.loaded`).

> ⚠️ **Watch out:** With accounts on, the browser copy is stored per account (`mathStudyGuide.v1:<uid>`, via `Store.useAccount`), and nothing is loaded while nobody is logged in. Never read or write the plain `mathStudyGuide.v1` key in account mode, or one student would see the previous student's notes on a shared computer.

> ⚠️ **Watch out:** Logging out must call `engine.flush()` before `auth.signOut()` (see `A.logOut`), or the last few seconds of changes are lost: saves are delayed 1.5 s to group edits.

> ⚠️ **Watch out:** Firebase cannot run inside the claude.ai artifact (its sandbox blocks outside connections). When publishing the artifact, publish a `js/firebase-config.js` that sets `null`, even if the repository's copy has real settings.

### Format with AI

`js/ai-format.js` holds the prompt (`AIFormat.prompt(notes)`, with rules to keep every fact and add nothing), cleans the answer (`clean()` strips code fences and lead-in lines) and finds the AI: inside claude.ai it is the `sample` capability (`claude.use('sample')`); anywhere else `available()` resolves null and the editor shows the copy-a-prompt panel instead. The UI is the `ai-*` actions in `js/app.js`.

AI is opt-in. The note editor starts with a choice, "📝 Keep my notes as I wrote them" (default) or "✨ Let AI format my notes", saved per profile as `settings.aiFormat` (`'off'` | `'on'`, also on the Profile page). Elements marked `data-ai-only` (the Format button and its help text) are hidden unless the choice is on. In AI mode, saving notes that were never formatted (`content !== AI.appliedText`) asks first: format now, or save as written. With the choice off, nothing ever calls the AI.

> ⚠️ **Watch out:** Never replace the student's notes without their choice. The editor shows both versions and changes the textarea only on "Use formatted version", keeping the original for "Undo".

> ⚠️ **Watch out:** The claude.ai page must declare `sample` along with `db`, `user` and `downloads`. Passing `capabilities` on publish replaces the whole set, so always pass all four.

> ⚠️ **Watch out:** `[hidden] { display: none !important }` in `css/styles.css` keeps the `hidden` attribute working on elements whose class sets `display` (such as the AI panel). Without it, a "hidden" panel stays on screen outside claude.ai.

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

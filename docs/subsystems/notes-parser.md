---
title: Notes parser
type: subsystem
created: 2026-11-09
updated: 2026-11-09
sources:
  - code: js/parser.js
  - code: tests/sample-notes.md
verified_at: 20b8d7f
---

# Notes parser

`parseNotes(text, { title })` (`js/parser.js:94`) turns free-form notes (handwritten
style, Markdown, or AI output with LaTeX) into card objects `{ type, front, back, term?,
topic, work? }`. It is heuristic, one line at a time; students can edit or delete
any card afterwards, so it favors finding more cards over perfect precision.

## Pipeline

1. Normalize line endings and join multi-line display math (`$$ … $$`, `\[ … \]`) into
   single lines (`joinDisplayMath`, `js/parser.js:77`).
2. Walk the lines; `#` headings (and lone labels like `Power Rule:`) set the current
   `topic`.
3. Try each recognizer in order, and stop at the first that matches:
   tables (`js/parser.js:121`), `front :: back`, `{{cloze}}`, `Q:`/`A:`
   (`js/parser.js:166`), `Example:`/`Solution:`/`Answer:` (`js/parser.js:191`),
   label-then-formula, `Term: definition` / `**Term** - def`, natural-language
   definitions (`js/parser.js:242`), standalone formulas (`js/parser.js:255`), then
   fill-in-the-blank from bold words, math vocabulary or numbers (`js/parser.js:267`).
4. Dedupe on `front|back`.

Card types: `def` (has `term`, so quizzes can ask in both directions), `qa`, `cloze`,
`problem` (keeps the full `work` and shows it as the explanation).

> ⚠️ Recognizer order matters. `Q:` and `Example:` lines contain colons, so they must be tested before the generic `Term: definition` matcher, or "Example 1: Find…" becomes a vocabulary card about the word "Example 1".

> ⚠️ `SKIP_TERM` (`js/parser.js:15`) is what stops words like Example, Note, Solution, Step 2, Definition from being treated as terms. When a new note style produces junk cards, the fix is usually adding to this list, not adding another regex.

> ⚠️ Never insert the blank (`_____`) and then call `stripMd` on the result: `stripMd` treats `__x__` as bold and collapses the blank to `_`. Strip each segment first, then join around the blank, as `unwrap` does (`js/parser.js:159`).

> ⚠️ Formula detection is deliberately strict in `defCard` (`js/parser.js:64`): a definition containing `=` is only a "formula" if it is mostly math (fewer than 4 prose words) or starts with a math delimiter. Otherwise "Critical point: a point where f'(x) = 0 …" is mislabeled "What is the formula for Critical point?".

> ⚠️ Bare LaTeX in a definition (`\pi r^2` with no delimiters) is wrapped in `$…$` by `defCard`, or it shows as raw backslashes. Fill-in-the-blank avoids blanking text inside `$…$` / `\(…\)` via `hidesLatex` (`js/parser.js:44`), so a formula is never cut in half.

## Testing a change

`tests/sample-notes.md` holds AI-style notes covering every recognizer; `tests/run-tests.js`
asserts the key cards exist. To see everything the parser produces:

`node -e 'require("./js/util.js");require("./js/parser.js");console.log(MSG.parseNotes(require("fs").readFileSync("tests/sample-notes.md","utf8")))'`

The "Add notes" page shows a live preview and card count as the student types, so
parser behavior is visible in the UI immediately.

Related: [[app-overview]].

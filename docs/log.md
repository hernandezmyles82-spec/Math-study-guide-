# Work log

Append-only. Newest entries at the bottom.

---

## [2026-11-09] setup | docs/ wiki scaffolded

- Categories: concepts - architecture - subsystems - decisions - reference - operations - history
- Baseline commit: `20b8d7f`
- Created: `docs/{CLAUDE,index,log}.md`, `raw/`, 4 `.claude/commands/docs-*`,
  and `.claude/scripts/docs-lint.py`

- Started in grow mode. Wrote [[app-overview]] (whole app, from the code just built) and
  [[notes-parser]] (`js/parser.js`). Other areas get pages as work touches them.

## [2026-11-09] review | full code run-through

- Fixed: duplicate-value choices (fractions), differential-equations question with two correct
  choices when roots were opposites, contour integral with the pole on the contour (no answer),
  answer checker accepting one-character math differences and partial multi-part answers,
  flashcard check treating "0" as correct, backup import trusting file contents.
- Cosmetic: "1x^2", "1y'", "x^0" in generated problems.
- Added tests for all of the above; browser run-through of every feature passed.
- Updated [[app-overview]] with the new traps.

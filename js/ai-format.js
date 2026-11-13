/* "Format with AI": rewrites a student's own notes into the format the notes reader understands best
   (headings, Term: definition, Q:/A:, Example/Solution/Answer), without adding or changing facts.

   Inside claude.ai the page asks Claude directly through the `sample` capability (on the student's own
   Claude usage, after they allow it). Everywhere else there is no AI to call, so the page offers the
   same prompt, with the notes included, to copy into any AI chat. */
(function (root) {
  'use strict';

  const MAX_CHARS = 60000; // well under the 256 KiB request limit, and a sensible size for one pass

  const RULES = `You are formatting a student's own study notes so a study website can turn them into flashcards and quizzes.

Rewrite the notes below using this format:

## A heading for each topic in the notes
- Term: definition
- Formula or rule name: the formula or rule (write math in LaTeX, like $x^2$ or $\\frac{a}{b}$)
- Other important points as short bullet sentences, with the key word in **bold**

Q: a question that is already in the notes
A: its answer from the notes

Example: a worked problem that is already in the notes
Solution: its steps
Answer: its final answer

Rules:
- Keep EVERY fact, definition, date, name, formula, example and answer that is in the notes.
- Do NOT add facts, explanations, examples or questions that are not in the notes.
- Do NOT change the meaning of anything, even if it looks wrong. Keep the student's wording where you can.
- Only fix the structure, and obvious spelling mistakes.
- Write in the same language as the notes.
- Reply with ONLY the formatted notes: no introduction, no comments, no code fences.

The student's notes:
"""
`;

  function prompt(notes) { return RULES + notes + '\n"""'; }

  /* Remove anything that is not the notes themselves: a surrounding code fence or a lead-in line. */
  function clean(text) {
    let t = String(text || '').trim();
    const fence = t.match(/^```[a-z]*\n([\s\S]*?)\n```$/i);
    if (fence) t = fence[1].trim();
    t = t.replace(/^(here (are|is) (the|your) (formatted|reformatted|cleaned[- ]up) notes?[^\n]*:?\s*\n)/i, '');
    return t.trim();
  }

  /* The `sample` function inside claude.ai, or null where no AI can be called from the page. */
  let cached;
  function available() {
    if (cached !== undefined) return Promise.resolve(cached);
    if (!root.claude || typeof root.claude.use !== 'function') { cached = null; return Promise.resolve(null); }
    return root.claude.use('sample').then((s) => { cached = s || null; return cached; }, () => { cached = null; return null; });
  }

  const ERRORS = {
    not_granted: 'Formatting with AI was not allowed. You can still format your notes yourself, or use the prompt with any AI chat.',
    sampling_disabled: 'Claude is not available for this account, so formatting with AI is off here.',
    rate_limited: 'Too many requests right now, or your Claude usage limit was reached. Try again in a little while.',
    session_expired: 'Your claude.ai sign-in expired. Sign in again, then try once more.',
    refused: 'Claude could not format these notes. Try formatting a smaller part at a time.',
    prompt_too_large: 'These notes are too long to format at once. Format them one section at a time.',
    empty_completion: 'Claude returned nothing. Try again, or format a smaller part.',
    upstream_error: 'Something went wrong reaching Claude. Try again.'
  };
  const PERMANENT = ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'];
  function message(e) { return ERRORS[e && e.code] || ERRORS.upstream_error; }

  /* ---------- a full study guide from the student's notes (js/study.js shows it) ---------- */
  const GUIDE_RULES = `You are writing a study guide for a student, built ONLY from their notes below.
Use exactly this format. Leave out any section the notes don't support.

## Overview
Two to four sentences on what the topic is about.

## Key ideas
- **Term or idea**: what it means, in plain words
(Group them under ### subheadings if that helps.)

## Concept map
Center: the main topic in a few words
- Big idea: related detail; related detail; related detail
(Three to six big ideas.)

## Worked examples
Example: a problem that is in the notes
Solution: its steps
Answer: its answer
(Only if the notes contain worked problems.)

## Common mistakes
- Two things in the notes that are easy to mix up, and how to tell them apart

## Timeline
- 1776: an event from the notes
(Only for dated events in the notes, oldest first, one per year.)

## In order: name of a process from the notes
- first step
- next step
(Only for processes the notes describe step by step.)

## Check yourself
Q: a question the notes answer
A: its answer from the notes
(Five to eight questions.)

Rules:
- Use ONLY facts that are in the notes. Do not add facts, dates, names, numbers, examples or questions from anywhere else.
- If something in the notes looks wrong, keep what the notes say.
- Write math in LaTeX, like \\( x^2 \\).
- Write in the same language as the notes.
- Reply with ONLY the guide, starting with "## Overview". No introduction, no code fences.

The notes are titled: `;
  const Q3 = '"""';
  function guidePrompt(notes, title) { return GUIDE_RULES + '"' + String(title || 'My notes').slice(0, 200) + '"\n' + Q3 + '\n' + notes + '\n' + Q3; }
  /* Keep only the guide: from the first "## " heading on. */
  function cleanGuide(text) { const t = clean(text); const i = t.indexOf('## '); return i < 0 ? '' : t.slice(i).trim(); }

  /* ---------- grading a written answer like a mark scheme ---------- */
  function gradePrompt({ question, model, answer, marks }) {
    return 'You are a fair teacher grading a student\'s written answer against a mark scheme.\n\n' +
      'Question (worth ' + marks + ' mark' + (marks === 1 ? '' : 's') + '):\n' + Q3 + '\n' + question + '\n' + Q3 + '\n\n' +
      'Model answer from the student\'s study material (this is the mark scheme):\n' + Q3 + '\n' + model + '\n' + Q3 + '\n\n' +
      'The student\'s answer:\n' + Q3 + '\n' + answer + '\n' + Q3 + '\n\n' +
      'Award one mark for each separate correct point that matches the model answer, up to ' + marks + '. Accept different wording if the meaning is right. Do not give marks for points the model answer doesn\'t contain, and don\'t take marks away for spelling.\n\n' +
      'Reply with ONLY this JSON and nothing else:\n{"score": <whole number from 0 to ' + marks + '>, "earned": ["what the student got right"], "missing": ["what is missing or wrong"], "tip": "one sentence on how to get full marks"}';
  }
  /* The grade from the AI's reply, checked and limited, or null if it can't be read. */
  function parseGrade(text, marks) {
    const m = String(text || '').match(/\{[\s\S]*\}/);
    if (!m) return null;
    let o;
    try { o = JSON.parse(m[0]); } catch (e) { return null; }
    const score = Math.round(Number(o && o.score));
    if (!Number.isFinite(score)) return null;
    const list = (a) => (Array.isArray(a) ? a.filter((x) => typeof x === 'string' && x.trim()).slice(0, 5).map((x) => x.trim().slice(0, 300)) : []);
    return { score: Math.max(0, Math.min(marks, score)), earned: list(o.earned), missing: list(o.missing), tip: typeof o.tip === 'string' ? o.tip.trim().slice(0, 400) : '' };
  }

  root.MSG = root.MSG || {};
  root.MSG.AIFormat = { MAX_CHARS, prompt, clean, available, message, isPermanent: (e) => PERMANENT.includes(e && e.code), guidePrompt, cleanGuide, gradePrompt, parseGrade };
})(typeof window !== 'undefined' ? window : globalThis);

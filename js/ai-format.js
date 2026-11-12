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

  root.MSG = root.MSG || {};
  root.MSG.AIFormat = { MAX_CHARS, prompt, clean, available, message, isPermanent: (e) => PERMANENT.includes(e && e.code) };
})(typeof window !== 'undefined' ? window : globalThis);

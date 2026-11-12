/* Node test runner: node tests/run-tests.js */
const path = require('path');
['util', 'store', 'parser', 'library', 'library-subjects', 'library-more', 'generators', 'generators-subjects', 'generators-more', 'courses', 'quiz'].forEach((f) => require(path.join(__dirname, '..', 'js', f + '.js')));
const { U, Library, Generators, parseNotes, Store, Quiz } = globalThis.MSG;
let fails = 0, passes = 0;
const ok = (cond, msg) => { if (cond) passes++; else { fails++; console.log('FAIL:', msg); } };

// evaluator & answer checking
ok(U.evalExpr('3/4') === 0.75, '3/4');
ok(U.evalExpr('\\frac{3}{4}') === 0.75, 'latex frac');
ok(Math.abs(U.evalExpr('25pi') - 25 * Math.PI) < 1e-9, '25pi');
ok(U.evalExpr('-2^2') === -4, '-2^2');
ok(U.evalExpr('2(3+4)') === 14, 'implicit mult');
ok(U.evalExpr('sqrt(16)') === 4, 'sqrt');
ok(U.evalExpr('x = 5') === 5, 'x = 5');
ok(U.evalExpr('75%') === 75, 'percent');
ok(isNaN(U.evalExpr('hello')), 'hello NaN');
ok(U.checkText('Slope', 'slope'), 'case');
ok(U.checkText('the derivative', 'derivative'), 'article');
ok(U.checkText('derivatve', 'derivative'), 'typo');
ok(!U.checkText('integral', 'derivative'), 'wrong word');
ok(U.checkText('0.5', '\\frac{1}{2}'), 'numeric equivalence');
ok(U.checkNumeric('78.54', Math.PI * 25, 0.01), 'tol');

// every generator, every difficulty, many times
let generated = 0;
for (const [id, gens] of Object.entries(Generators.G)) {
  ok(Library.get(id), 'library has ' + id);
  gens.forEach((g, gi) => {
    for (let d = 1; d <= 3; d++) for (let t = 0; t < 60; t++) {
      let q;
      try { q = g(d); } catch (e) { ok(false, `${id}#${gi} d${d} threw ${e.message}`); break; }
      generated++;
      const where = `${id}#${gi} d${d}: ${q && q.prompt}`;
      if (q.kind === 'input') {
        ok(Number.isFinite(q.answer), where + ' non-finite answer ' + q.answer);
        ok(U.checkNumeric(String(q.answerDisplay).split(' ')[0], q.answer, q.tol != null ? Math.max(q.tol, 0.01) : null) || /π/.test(q.answerDisplay), where + ' display ' + q.answerDisplay + ' != ' + q.answer);
      } else {
        ok(q.kind === 'mc' && q.choices.length >= 2 && q.correct >= 0, where + ' bad mc');
        ok(new Set(q.choices).size === q.choices.length, where + ' dup choices ' + q.choices);
        ok(!q.choices.some((c) => /NaN|undefined\)|Infinity/.test(c)), where + ' bad choice text ' + q.choices);
        const vals = q.choices.map((c) => U.evalExpr(c));
        vals.forEach((v, i) => vals.forEach((w, j) => { if (i < j && isFinite(v) && isFinite(w) && Math.abs(v - w) < 1e-9) ok(false, where + ' two choices have the same value: ' + q.choices[i] + ' / ' + q.choices[j]); }));
        const norm = q.choices.map((c) => c.replace(/\s+/g, ''));
        ok(new Set(norm).size === norm.length, where + ' choices identical apart from spacing ' + q.choices);
      }
      ok(!/\bNaN\b|Infinity/.test(q.prompt), where + ' bad prompt');
    }
  });
}
Library.categories.forEach((c) => ok(c.concepts.length >= 5, c.id + ' concepts'));

// parser on sample notes
const fs = require('fs');
const cards = parseNotes(fs.readFileSync(path.join(__dirname, 'sample-notes.md'), 'utf8'), { title: 'Derivatives' });
ok(cards.length >= 15, 'parser found ' + cards.length + ' cards');
ok(cards.some((c) => c.term === 'Derivative'), 'definition card');
ok(cards.some((c) => c.type === 'problem' && /8x \+ 3/.test(c.back)), 'problem card');
ok(cards.some((c) => c.front === 'What is the derivative of x^3?' && c.back === '3x^2'), 'Q/A card');
ok(cards.some((c) => c.type === 'cloze' && c.back === 'chain rule'), 'explicit cloze');

// notes from other subjects (history, biology)
const hist = parseNotes(fs.readFileSync(path.join(__dirname, 'sample-notes-history.md'), 'utf8'), { title: 'Revolution' });
ok(hist.some((c) => c.type === 'cloze' && c.back === '1776'), 'history: year blank');
ok(hist.some((c) => c.type === 'cloze' && c.back === 'Thomas Jefferson'), 'history: person blank');
ok(hist.some((c) => c.type === 'cloze' && c.back === 'Battle of Saratoga'), 'history: event blank');
ok(hist.some((c) => c.term === 'Patriots') && hist.some((c) => c.term === 'Loyalists'), 'history: definitions');
ok(hist.some((c) => c.back === 'George Washington'), 'history: Q/A');
ok(hist.some((c) => c.term === 'Osmosis'), 'biology: "X is the ..." definition');

// every subject has categories, and every category has a reference sheet
Library.groups().forEach((g) => ok(g.levels.length && g.levels.every((l) => l.cats.length), 'subject ' + g.subject + ' has categories'));
ok(Library.groups().length >= 7, 'seven or more subjects');
// every subject runs from elementary up to at least AP & IB
Library.groups().forEach((g) => {
  const bands = g.levels.flatMap((l) => l.cats.map((c) => c.band));
  ok(Math.min(...bands) === 0 && Math.max(...bands) >= 3, g.subject + ' spans elementary to AP/IB or college');
});
ok(Library.categories.every((c) => c.band >= 0 && c.band <= 4), 'every topic has a grade band');
Library.categories.forEach((c) => ok(Generators.has(c.id), c.id + ' has practice questions'));

// AP & IB courses: every course links to real topics, and a course quiz works
const { Courses } = globalThis.MSG;
ok(Courses.list.filter((c) => c.program === 'AP').length >= 30 && Courses.list.filter((c) => c.program === 'IB').length >= 20, 'AP and IB catalogs present');
ok(new Set(Courses.list.map((c) => c.id)).size === Courses.list.length, 'course ids are unique');
Courses.list.forEach((c) => {
  ok(c.units.length >= 3 && c.topics.length >= 1, c.id + ' has units and topics');
  c.topics.forEach((t) => ok(Library.get(t), c.id + ' links to existing topic ' + t));
});

// store + quiz
Store._reset();
Store.createProfile('Tester');
const note = Store.addNote({ title: 'Derivs', content: 'x' }, cards);
ok(Store.cardsForNote(note.id).length === cards.length, 'cards stored');
ok(Store.dueCards().length === cards.length, 'new cards due');
const c0 = Store.cardsForNote(note.id)[0];
Store.recordCard(c0.id, true);
ok(Store.card(c0.id).srs.interval === 1, 'interval 1 after correct');
const qs = Quiz.fromCards(Store.current().cards, Store.current().cards);
ok(qs.length === cards.length, 'quiz from cards');
qs.forEach((q) => ok(['mc', 'input', 'flash'].includes(q.kind) && q.prompt, 'question shape ' + JSON.stringify(q).slice(0, 80)));
qs.filter((q) => q.kind === 'mc').forEach((q) => ok(q.choices[q.correct] != null && new Set(q.choices).size === q.choices.length, 'mc from card'));
const cat = Quiz.forCategory('derivatives', 10, 2);
Courses.list.forEach((c) => { const qs = Quiz.forCourse(c, 12, 2); ok(qs.length === 12 && qs.every((q) => q && q.prompt), c.id + ' course quiz builds 12 questions'); });
ok(cat.length === 10, 'category quiz length');
const ex = Store.addExam({ title: 'Test', date: U.dateKey(Date.now() + 86400000), noteIds: [note.id], categoryIds: ['limits'] });
ok(Quiz.forExam(ex, 'quick').length > 0, 'exam quick');
ok(Quiz.forExam(ex, 'full').length >= cards.length, 'exam full');

// answer checker must not accept a different math expression as a "typo"
ok(!U.checkText('x^2-1', 'x^2+1'), 'one-character math difference is wrong');
ok(!U.checkText('x = 2', 'x = 2 or x = -3'), 'both roots needed');
ok(U.checkText('gradient', 'slope or gradient'), 'word alternatives');
ok(!U.checkText('II: sine', 'Quadrant I: all positive; II: sine'), 'no semicolon alternatives');
ok(Quiz.check({ kind: 'flash' }, '0') === false && Quiz.check({ kind: 'flash' }, '1') === true, 'flash grading');

// backup round trip + hostile import
const backup = Store.exportProfile();
const imported = Store.importProfile(backup);
ok(imported.cards.length === Store.current().cards.length && imported.notes.length === 1, 'backup round trip');
ok(imported.cards.filter((c) => c.noteId).every((c) => c.noteId === imported.notes[0].id), 'card note links survive import');
ok(imported.exams.length === 1 && imported.exams[0].noteIds[0] === imported.notes[0].id, 'exam links survive import');
const evil = JSON.parse(backup);
evil.profile.cards[0].id = '"><img src=x onerror=alert(1)>';
evil.profile.sessions = [{ title: 't', right: '<b>x</b>', total: 2 }];
evil.profile.exams[0].date = '<script>';
const clean = Store.importProfile(JSON.stringify(evil));
ok(/^[\w:.-]+$/.test(clean.cards[0].id), 'hostile id replaced');
ok(clean.sessions[0].right === 0, 'hostile number replaced');
ok(clean.exams.length === 0, 'hostile date dropped');
let threw = false; try { Store.importProfile('not json'); } catch (e) { threw = /not a Math Study Guide backup/.test(e.message); }
ok(threw, 'bad file gives a friendly error');

console.log(`${passes} passed, ${fails} failed (${generated} generated problems checked)`);
process.exit(fails ? 1 : 0);

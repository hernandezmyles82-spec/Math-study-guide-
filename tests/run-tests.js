/* Node test runner: node tests/run-tests.js */
const path = require('path');
['util', 'store', 'parser', 'library', 'generators', 'quiz'].forEach((f) => require(path.join(__dirname, '..', 'js', f + '.js')));
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
      }
      ok(!/NaN|Infinity/.test(q.prompt), where + ' bad prompt');
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
ok(cat.length === 10, 'category quiz length');
const ex = Store.addExam({ title: 'Test', date: U.dateKey(Date.now() + 86400000), noteIds: [note.id], categoryIds: ['limits'] });
ok(Quiz.forExam(ex, 'quick').length > 0, 'exam quick');
ok(Quiz.forExam(ex, 'full').length >= cards.length, 'exam full');

console.log(`${passes} passed, ${fails} failed (${generated} generated problems checked)`);
process.exit(fails ? 1 : 0);

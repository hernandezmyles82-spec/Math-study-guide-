/* Node test runner: node tests/run-tests.js */
const path = require('path');
['util', 'store', 'parser', 'library', 'library-subjects', 'library-more', 'generators', 'generators-subjects', 'generators-more', 'courses', 'quiz', 'guides', 'guides-content', 'guides-math', 'guides-science', 'guides-history', 'guides-english', 'guides-languages', 'guides-cs-arts', 'modes', 'ai-format', 'shared-library'].forEach((f) => require(path.join(__dirname, '..', 'js', f + '.js')));
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

// Format with AI: the prompt carries the notes and the no-new-facts rules; answers are cleaned
const { AIFormat } = globalThis.MSG;
const pr = AIFormat.prompt('Osmosis - water moving across a membrane');
ok(pr.includes('Osmosis - water moving across a membrane') && /Do NOT add facts/.test(pr) && /Keep EVERY fact/.test(pr), 'AI prompt includes the notes and the rules');
ok(AIFormat.clean('```markdown\n## Cells\n- Osmosis: water\n```') === '## Cells\n- Osmosis: water', 'AI answer: code fence removed');
ok(AIFormat.clean('Here are your formatted notes:\n## Cells') === '## Cells', 'AI answer: lead-in line removed');
ok(AIFormat.message({ code: 'not_granted' }).includes('not allowed') && AIFormat.isPermanent({ code: 'not_granted' }) && !AIFormat.isPermanent({ code: 'rate_limited' }), 'AI errors: messages and permanence');

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

// study guides
const { Guides, Modes } = globalThis.MSG;
Library.categories.forEach((c) => ok(Guides.has(c.id), 'topic ' + c.id + ' has a study guide'));
Guides.ids().forEach((id) => {
  const g = Guides.get(id);
  ok(Library.get(id), 'guide ' + id + ' is for an existing topic');
  ok(g.sections.some((x) => /overview/i.test(x.title)) && g.sections.some((x) => /key ideas/i.test(x.title)) && g.sections.some((x) => /common mistakes/i.test(x.title)), 'guide ' + id + ' has overview, key ideas and common mistakes');
  ok(g.examples.length >= 2 && g.examples.every((e) => e.problem && e.answer), 'guide ' + id + ' has worked examples with answers');
  ok(g.check.length >= 4 && g.check.every((c) => c.q && c.a), 'guide ' + id + ' has a self-check with answers');
  ok(g.timeline.every((t) => Number.isFinite(t.year)), 'guide ' + id + ' timeline years parse');
  ok(new Set(g.timeline.map((t) => t.year)).size === g.timeline.length || g.timeline.length === 0, 'guide ' + id + ' timeline has no duplicate years');
});
ok(Guides.yearOf('476 CE') === 476 && Guides.yearOf('3000 BCE') === -3000 && Guides.yearOf('1914–1918') === 1914 && Guides.yearOf('c. 1450') === 1450 && Guides.yearOf('Step 2') === null && Guides.yearOf('4.6 billion years ago') === -4.6e9 && Guides.yearOf('300,000 years ago') === -300000, 'year parsing');
const tg = Guides.parseOne('t', '## Overview\nHi\n## Timeline\n- 1776: A\n- 1492: B\n## In order: Steps\n- a\n- b\n- c\n## Check yourself\nQ: q1\nA: a1\n');
ok(tg.timeline.length === 2 && tg.orders[0].items.length === 3 && tg.check[0].a === 'a1' && tg.sections[0].text === 'Hi', 'guide format parses');

// study modes
Store._reset(); Store.createProfile('Modes');
ok(Modes.parseSource('cat_derivatives').id === 'derivatives' && Modes.parseSource('note_x"><') === null && Modes.parseSource('evil_x') === null, 'sources validated');
Library.categories.forEach((c) => {
  const d = Modes.deck('cat_' + c.id);
  ok(d && d.items.length === c.concepts.length, c.id + ' deck');
  const tf = Modes.trueFalseSet(d.items, 8);
  ok(tf.length > 0 && tf.every((q) => q.kind === 'mc' && q.choices.length === 2 && (q.correct === 0 || q.correct === 1)), c.id + ' true/false');
  tf.filter((q) => q.correct === 1).forEach((q) => ok(/^False\. /.test(q.explain), c.id + ' false statements explain the truth'));
  const rounds = Modes.matchRounds(d.items);
  rounds.forEach((r) => { ok(r.length >= 3, c.id + ' match round size'); ok(new Set(r.map((x) => U.normalize(x.back))).size === r.length, c.id + ' match answers distinct'); });
  const st = Modes.learnStart(d.items);
  let guard = 0;
  while (st && Modes.learnQuestion(st) && guard++ < 500) { const q = st.q; ok(q.kind === 'mc' ? q.choices[q.correct] != null && new Set(q.choices).size === q.choices.length : !!q.answer, c.id + ' learn question'); Modes.learnAnswer(st, guard % 5 !== 0); }
  ok(st && st.learned === st.all.length, c.id + ' learn mode finishes');
  const test = Modes.practiceTest('cat_' + c.id, 20);
  ok(test.length === 20 && test.every((q) => q && q.prompt), c.id + ' practice test builds 20 questions');
});
ok(Modes.orderSets('cat_us-history').some((s) => s.kind === 'time' && s.items.length >= 10), 'US history timeline for the order game');
const orr = Modes.orderRound(Modes.orderSets('cat_us-history')[0], 6);
ok(orr.length === 6 && new Set(orr.map((x) => x.key)).size === 6, 'order round has distinct dates');
ok(Modes.orderScore(orr.slice().sort((a, b) => a.key - b.key)) === 6, 'order score');
// notes deck, stars, mistake notebook, badges
const mnote = Store.addNote({ title: 'Mine', content: 'x' }, cards);
const nd = Modes.deck('note_' + mnote.id);
ok(nd.items.length === cards.length && Modes.practiceTest('note_' + mnote.id, 10).length === 10, 'note deck and test');
Store.toggleStar(nd.items[0].id); Store.toggleStar('lib:derivatives:1');
ok(Modes.deck('starred').items.length === 2, 'starred deck mixes notes and topics');
const mq = { kind: 'mc', prompt: 'Q?', choices: ['a', 'b'], correct: 1, conceptId: 'lib:derivatives:2' };
Store.addMistake(mq); Store.addMistake(mq);
ok(Store.mistakes().length === 1 && Store.mistakes()[0].count === 2, 'mistake recorded once, counted twice');
const mb = JSON.parse(Store.exportProfile()); mb.profile.mistakes.push({ kind: 'mc', prompt: 'x', choices: ['<img src=x onerror=1>'], correct: 9, cardId: '"><script>' });
const mi = Store.importProfile(JSON.stringify(mb));
ok(mi.mistakes.length === 1 && mi.starred['lib:derivatives:1'] === 1, 'notebook and stars survive backup; one-choice mistake dropped');
ok(Store.clearMistake(mq) === true && Store.mistakes().length === 0, 'answering right clears a mistake');
ok(Modes.badges().length >= 10 && Modes.badges().every((b) => b.name && b.how), 'badges');

// written answers, AI guides for notes, grading
Store._reset(); Store.createProfile('Write');
Library.categories.forEach((c) => { const qs = Modes.writtenQuestions('cat_' + c.id, 8); ok(qs.length >= 4 && qs.every((q) => q.question && q.model && [1, 2, 3].includes(q.marks)), c.id + ' written-answer questions'); });
ok(Modes.marksFor('Abiotic') === 1 && Modes.marksFor('It declared the 13 colonies independent from Britain, on July 4, 1776.') === 2, 'marks from model answer length');
const AF = globalThis.MSG.AIFormat;
ok(/ONLY facts that are in the notes/.test(AF.guidePrompt('n', 't')) && AF.cleanGuide('Sure!\n## Overview\nx') === '## Overview\nx' && AF.cleanGuide('no headings') === '', 'guide prompt and cleanup');
ok(AF.parseGrade('Here: {"score": 9, "earned": ["a", 5], "missing": [], "tip": "t"}', 2).score === 2 && AF.parseGrade('{"score":"x"}', 2) === null && AF.parseGrade('nothing', 2) === null, 'grade parsing is checked and capped');
ok(/worth 3 marks/.test(AF.gradePrompt({ question: 'q', model: 'm', answer: 'a', marks: 3 })), 'grade prompt');
const gn = Store.addNote({ title: 'Cells', content: 'x' }, cards);
Store.setNoteGuide(gn.id, '## Overview\nAbout cells.\n## Concept map\nCenter: Cells\n- Parts: nucleus; ribosome\n- Transport: osmosis\n## Timeline\n- 1665: Hooke sees cells\n- 1838: plant cell theory\n- 1839: animal cell theory\n- 1855: cells from cells\n## Check yourself\nQ: What holds DNA?\nA: The nucleus holds the cell\'s DNA.\nQ: What is osmosis?\nA: Diffusion of water across a membrane.');
const ng = Modes.noteGuide(Store.note(gn.id));
ok(ng.map && ng.map.branches.length === 2 && ng.check.length === 2, 'note guide parses, with a concept map');
ok(Modes.orderSets('note_' + gn.id).some((x) => x.title === 'Timeline from my study guide'), 'note guide timeline feeds the order game');
ok(Modes.writtenQuestions('note_' + gn.id, 8).some((q) => q.question === 'What holds DNA?'), 'note guide feeds written answers');
const gb = Store.importProfile(Store.exportProfile());
ok(gb.notes.find((x) => x.title === 'Cells').guide.startsWith('## Overview'), 'note guide survives backup');
Store.setNoteGuide(gn.id, null); ok(!Store.note(gn.id).guide, 'note guide can be removed');

// shared library: everything read from other people is checked
const SL = globalThis.MSG.SharedLibrary;
ok(SL.cleanMeta({ id: '../x' }, 'u') === null && SL.cleanMeta({ id: 'ABCDEF12' }, 'u') === null, 'shared guide ids are checked');
const cm = SL.cleanMeta({ id: 'abc123def', title: 'x'.repeat(500), level: 9, cards: 'lots', by: { evil: 1 } }, 'u1');
ok(cm.title.length === 120 && cm.level === null && cm.cards === 0 && cm.uid === 'u1' && typeof cm.by === 'string', 'shared guide summaries are capped and typed');
const cb = SL.cleanBody({ cards: [{ front: 'f', back: 'b', type: 'evil' }, { front: null }, ...Array(500).fill({ front: 'a', back: 'b' })], guide: 7, notes: null });
ok(cb.cards.length === 400 && cb.cards[0].type === 'qa' && cb.guide === '7' && cb.notes === '', 'shared guide bodies are capped and typed');
ok(/^https:\/\/claude\.ai\/artifact\//.test(SL.SITE_URL), 'share links point at the claude.ai page');
const sn = Store.addNote({ title: 'S', content: 'x' }, cards); Store.setNoteShared(sn.id, 'abc123def');
ok(Store.importProfile(Store.exportProfile()).notes.find((x) => x.title === 'S').sharedId === 'abc123def', 'shared id survives backup');

console.log(`${passes} passed, ${fails} failed (${generated} generated problems checked)`);
process.exit(fails ? 1 : 0);

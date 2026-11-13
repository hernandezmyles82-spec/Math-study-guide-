/* Study modes that work on any deck of cards: flashcards, learn, matching, true/false, practice test,
   put-in-order, and the mistake notebook. Logic only (no HTML), so the tests can check it.

   A "source" names where a deck comes from, and is what appears in the page address:
     cat_<topic id>   course_<course id>   note_<note id>   starred   deck (all my cards)
   A deck item is { id, front, back, term, prompt, topic, categoryId, cardId?, conceptId? }. */
(function (root) {
  'use strict';
  const { U, Store, Library, Quiz, Guides } = root.MSG;

  const ID = /^[\w.:-]{1,80}$/;
  function parseSource(src) {
    src = String(src || '');
    if (src === 'starred' || src === 'deck') return { type: src };
    const i = src.indexOf('_');
    if (i < 1) return null;
    const type = src.slice(0, i), id = src.slice(i + 1);
    if (!['cat', 'course', 'note'].includes(type) || !ID.test(id)) return null;
    return { type, id };
  }

  function fromConcept(card) {
    const deck = Store.current() && Store.card(card.id); // the concept is in the student's review deck
    return { id: card.id, front: card.term, back: card.back, term: card.term, prompt: card.front, topic: card.topic, categoryId: card.categoryId, cardId: deck ? card.id : null, conceptId: deck ? null : card.id };
  }
  function fromCard(c) {
    return { id: c.id, front: c.term || c.front, back: c.back, term: c.term || null, prompt: c.front, topic: c.topic, categoryId: c.categoryId || null, cardId: c.id, conceptId: null };
  }
  /* Any id → a deck item: a card in the profile, or a built-in concept "lib:<topic>:<n>". */
  function itemById(id) {
    const c = Store.card(id);
    if (c) return fromCard(c);
    const m = String(id).match(/^lib:([\w-]+):(\d+)$/);
    if (!m) return null;
    const k = Quiz.conceptCards(m[1])[Number(m[2])];
    return k ? fromConcept(k) : null;
  }

  /* { title, back, items, categoryIds } for a source, or null if it doesn't exist. */
  function deck(src) {
    const s = parseSource(src);
    if (!s) return null;
    if (s.type === 'cat') {
      const c = Library.get(s.id);
      if (!c) return null;
      return { title: c.name, back: '#category--' + c.id, items: Quiz.conceptCards(c.id).map(fromConcept), categoryIds: [c.id] };
    }
    if (s.type === 'course') {
      const c = root.MSG.Courses.get(s.id);
      if (!c) return null;
      const ids = c.topics.filter((t) => Library.get(t));
      return { title: c.name, back: '#course--' + c.id, items: [].concat(...ids.map((t) => Quiz.conceptCards(t).map(fromConcept))), categoryIds: ids };
    }
    if (s.type === 'note') {
      const n = Store.note(s.id);
      if (!n) return null;
      return { title: n.title, back: '#note--' + n.id, items: Store.cardsForNote(n.id).map(fromCard), categoryIds: n.categoryId ? [n.categoryId] : [], noteId: n.id };
    }
    if (s.type === 'starred') {
      return { title: 'Starred cards', back: '#dashboard', items: Object.keys(Store.starred()).map(itemById).filter(Boolean), categoryIds: [] };
    }
    return { title: 'All my cards', back: '#dashboard', items: Store.current().cards.map(fromCard), categoryIds: [] };
  }

  const norm = (s) => U.normalize(s);
  function distinctBacks(items) {
    const seen = new Set();
    return items.filter((it) => { const k = norm(it.back); if (!k || seen.has(k)) return false; seen.add(k); return true; });
  }
  const base = (it) => ({ cardId: it.cardId || null, conceptId: it.conceptId || null, categoryId: it.categoryId || null, topic: it.topic });

  /* ---------- true / false ---------- */
  function statement(it, back) {
    return it.term ? `**${it.term}**: ${back}` : `${it.prompt}\n→ ${back}`;
  }
  /* A true-or-false question about one item; false ones pair it with another item's answer. */
  function trueFalse(it, items) {
    const others = distinctBacks(items.filter((o) => o !== it && norm(o.back) !== norm(it.back)));
    const makeFalse = others.length && Math.random() < 0.5;
    const shown = makeFalse ? U.pick(others).back : it.back;
    return Object.assign({
      kind: 'mc', tf: true, prompt: 'True or false?\n' + statement(it, shown), choices: ['True', 'False'], correct: makeFalse ? 1 : 0,
      explain: makeFalse ? 'False. ' + statement(it, it.back) : ''
    }, base(it));
  }
  function trueFalseSet(items, n) {
    if (distinctBacks(items).length < 2) return [];
    return U.shuffle(items).slice(0, n).map((it) => trueFalse(it, items));
  }

  /* ---------- matching ---------- */
  /* Rounds of up to `size` pairs, each with distinct left and right sides and short answers. */
  function matchRounds(items, size) {
    size = size || 6;
    const seenL = new Set(), seenR = new Set();
    const pairs = U.shuffle(items).filter((it) => {
      const l = norm(it.front), r = norm(it.back);
      if (!l || !r || l === r || String(it.back).length > 160 || String(it.front).length > 160 || seenL.has(l) || seenR.has(r)) return false;
      seenL.add(l); seenR.add(r); return true;
    });
    if (pairs.length < 3) return [];
    const rounds = [];
    for (let i = 0; i < pairs.length; i += size) rounds.push(pairs.slice(i, i + size));
    const last = rounds[rounds.length - 1];
    if (rounds.length > 1 && last.length < 3) { rounds.pop(); rounds[rounds.length - 1] = rounds[rounds.length - 1].concat(last); }
    return rounds;
  }

  /* ---------- learn ---------- */
  /* Each card must be answered right twice in a row (first by choosing, then by typing when it's short)
     before it counts as learned; a miss sends it back a few places. Cards come in groups of 7. */
  function learnStart(items) {
    const pool = distinctBacks(items);
    if (pool.length < 2) return null;
    return { all: pool, todo: U.shuffle(pool.map((it) => ({ it, level: 0, misses: 0 }))), active: [], learned: 0, asked: 0, q: null, cur: null };
  }
  function learnFill(st) { while (st.active.length < 7 && st.todo.length) st.active.push(st.todo.shift()); }
  function learnQuestion(st) {
    learnFill(st);
    if (!st.active.length) { st.q = null; st.cur = null; return null; }
    const cur = st.active[0];
    const it = cur.it;
    const typed = cur.level >= 1 && it.term && wordCount(it.term) <= 4;
    let q;
    if (typed) q = { kind: 'input', prompt: 'Type the term:\n' + it.back, answer: it.term, answerDisplay: it.term };
    else if (cur.level >= 1 && wordCount(it.back) <= 5) q = { kind: 'input', prompt: it.prompt, answer: it.back, answerDisplay: it.back };
    else {
      const wrongs = U.shuffle(st.all.filter((o) => norm(o.back) !== norm(it.back))).slice(0, 3).map((o) => o.back);
      const choices = U.shuffle([it.back].concat(wrongs));
      q = { kind: 'mc', prompt: it.term ? 'What best describes **' + it.term + '**?' : it.prompt, choices, correct: choices.indexOf(it.back) };
    }
    st.cur = cur; st.q = Object.assign(q, base(it));
    return st.q;
  }
  function learnAnswer(st, correct) {
    const cur = st.active.shift();
    st.asked += 1;
    if (correct) {
      cur.level += 1;
      if (cur.level >= 2) { st.learned += 1; return; }
      st.active.splice(Math.min(st.active.length, 2), 0, cur); // ask again soon, the harder way
    } else {
      cur.level = 0; cur.misses += 1;
      st.active.splice(Math.min(st.active.length, 3), 0, cur);
    }
  }
  const wordCount = (s) => String(s).split(/\s+/).filter(Boolean).length;

  /* ---------- practice test ---------- */
  function practiceTest(src, n) {
    const d = deck(src);
    if (!d) return [];
    const s = parseSource(src);
    let qs = [];
    const tf = Math.round(n * 0.25);
    if (s.type === 'cat') qs = Quiz.forCategory(s.id, n - tf, 2);
    else if (s.type === 'course') qs = Quiz.forCourse(root.MSG.Courses.get(s.id), n - tf, 2);
    else qs = Quiz.fromCards(U.shuffle(d.items.map((it) => Store.card(it.cardId) || null).filter(Boolean)).slice(0, n - tf), Store.current().cards);
    qs = qs.concat(trueFalseSet(d.items, tf));
    if (qs.length < n) qs = qs.concat(trueFalseSet(d.items, n - qs.length));
    return U.shuffle(qs).slice(0, n);
  }

  /* ---------- study guides behind a source ---------- */
  /* A note's AI-made guide, parsed (or null). */
  function noteGuide(note) { return note && note.guide ? Guides.parseOne('note_' + note.id, note.guide) : null; }
  function guidesFor(src) {
    const s = parseSource(src);
    if (!s) return [];
    if (s.type === 'cat') return [Guides.get(s.id)].filter(Boolean);
    if (s.type === 'course') { const c = root.MSG.Courses.get(s.id); return c ? c.topics.map((t) => Guides.get(t)).filter(Boolean) : []; }
    if (s.type === 'note') return [noteGuide(Store.note(s.id))].filter(Boolean);
    return [];
  }

  /* ---------- written answers ---------- */
  const plain = (t) => String(t).replace(/\\\(|\\\)|\$/g, ' ');
  /* Marks for a question, from how much its model answer says. */
  function marksFor(model) { const w = wordCount(plain(model)); return w <= 6 ? 1 : w <= 20 ? 2 : 3; }
  /* Exam-style questions with model answers: a guide's self-check first, then "explain" questions from the cards. */
  function writtenQuestions(src, n) {
    const d = deck(src);
    if (!d) return [];
    const fromGuides = U.shuffle([].concat(...guidesFor(src).map((g) => g.check.map((c) => ({ question: c.q, model: c.a, categoryId: Library.get(g.id) ? g.id : null })))));
    const fromCards = U.shuffle(d.items.filter((it) => it.back && wordCount(plain(it.back)) >= 2).map((it) => ({ question: it.term ? 'Explain what **' + it.term + '** means.' : it.prompt, model: it.back, categoryId: it.categoryId || null, cardId: it.cardId || null, conceptId: it.conceptId || null })));
    const seen = new Set();
    return fromGuides.concat(fromCards).filter((q) => { const k = norm(q.question); if (!k || seen.has(k) || !String(q.model).trim()) return false; seen.add(k); return true; })
      .slice(0, n || 8).map((q) => Object.assign(q, { marks: marksFor(q.model) }));
  }

  /* ---------- put it in order ---------- */
  /* Sets that can be put in order: a guide's timeline and step lists, and year cards from notes. */
  function orderSets(src) {
    const s = parseSource(src);
    if (!s) return [];
    const out = [];
    const fromGuide = (id) => {
      const g = Guides && Guides.get(id);
      if (!g) return;
      const cat = Library.get(id);
      if (g.timeline.length >= 4) out.push({ title: (cat ? cat.name + ': ' : '') + 'timeline', kind: 'time', items: g.timeline.map((t) => ({ label: t.label, show: t.when, key: t.year })) });
      g.orders.forEach((o) => out.push({ title: o.title, kind: 'steps', items: o.items.map((x, i) => ({ label: x, show: 'Step ' + (i + 1), key: i })) }));
    };
    if (s.type === 'cat') fromGuide(s.id);
    if (s.type === 'course') { const c = root.MSG.Courses.get(s.id); if (c) c.topics.forEach(fromGuide); }
    if (s.type === 'note') {
      guidesFor(src).forEach((g) => {
        if (g.timeline.length >= 4) out.push({ title: 'Timeline from my study guide', kind: 'time', items: g.timeline.map((t) => ({ label: t.label, show: t.when, key: t.year })) });
        g.orders.forEach((o) => out.push({ title: o.title, kind: 'steps', items: o.items.map((x, i) => ({ label: x, show: 'Step ' + (i + 1), key: i })) }));
      });
      const items = [];
      Store.cardsForNote(s.id).forEach((c) => {
        const y = Guides.yearOf(String(c.back).trim());
        if (y != null && Math.abs(y) >= 100 && /_{3,}/.test(c.front)) items.push({ label: c.front.replace(/_{3,}/, '___'), show: c.back, key: y });
      });
      if (items.length >= 4) out.push({ title: 'Dates in my notes', kind: 'time', items });
    }
    return out;
  }
  /* A round: up to 6 items with different keys, shuffled. */
  function orderRound(set, size) {
    const seen = new Set();
    const items = U.shuffle(set.items).filter((x) => (seen.has(x.key) ? false : (seen.add(x.key), true))).slice(0, size || 6);
    if (set.kind === 'steps' && set.items.length <= (size || 6)) return U.shuffle(set.items.slice());
    return U.shuffle(items);
  }
  /* How many are in the right place, given the student's order. */
  function orderScore(order) {
    const right = order.slice().sort((a, b) => a.key - b.key);
    return order.reduce((s, x, i) => s + (x.key === right[i].key ? 1 : 0), 0);
  }

  /* ---------- mistake notebook ---------- */
  function mistakeQuestions() { return Store.mistakes().map((m) => Object.assign({}, m, { fromNotebook: true })); }

  /* ---------- progress: mastery and badges ---------- */
  /* Mastery of a topic: how right you are, counted fully after 20 answers. */
  function topicMastery(catId) {
    const s = Store.current().catStats[catId];
    if (!s) return 0;
    const t = s.right + s.wrong;
    return t ? Math.round(100 * (s.right / t) * Math.min(1, t / 20)) : 0;
  }
  function badges() {
    const p = Store.current();
    const st = Store.stats();
    const used = Store.modesUsed();
    const perfect = p.sessions.some((x) => x.total >= 5 && x.right === x.total);
    const topicsTried = Object.keys(p.catStats).length;
    const masteredTopics = Object.keys(p.catStats).filter((id) => topicMastery(id) >= 80).length;
    const modes = ['flash', 'learn', 'match', 'tf', 'test', 'order', 'write'].filter((m) => used[m]).length;
    const B = (id, icon, name, how, got) => ({ id, icon, name, how, got: !!got });
    return [
      B('first', '🌱', 'First steps', 'Answer your first question', st.total >= 1),
      B('q100', '💯', 'Hundred club', 'Answer 100 questions', st.total >= 100),
      B('q1000', '🚀', 'Thousand club', 'Answer 1,000 questions', st.total >= 1000),
      B('streak3', '🔥', 'On a roll', 'Study 3 days in a row', st.streak >= 3),
      B('streak7', '📅', 'Week warrior', 'Study 7 days in a row', st.streak >= 7),
      B('streak30', '🏅', 'Unstoppable', 'Study 30 days in a row', st.streak >= 30),
      B('perfect', '🏆', 'Perfect score', 'Get 100% on a quiz of 5 or more questions', perfect),
      B('notes', '📝', 'Note taker', 'Add your first notes', p.notes.length >= 1),
      B('mastered', '⭐', 'Memory master', 'Master 25 cards (each remembered for a week)', st.mastered >= 25),
      B('explorer', '🧭', 'Explorer', 'Practice 5 different topics', topicsTried >= 5),
      B('expert', '🎓', 'Topic expert', 'Reach 80% mastery in a topic', masteredTopics >= 1),
      B('modes', '🎮', 'Try everything', 'Use 4 different study modes', modes >= 4),
      B('fixer', '🔧', 'Mistake fixer', 'Clear 10 questions from your mistake notebook', (used.fixed || 0) >= 10)
    ];
  }

  root.MSG.Modes = { parseSource, deck, noteGuide, guidesFor, writtenQuestions, marksFor, itemById, trueFalse, trueFalseSet, matchRounds, learnStart, learnQuestion, learnAnswer, practiceTest, orderSets, orderRound, orderScore, mistakeQuestions, topicMastery, badges };
})(typeof window !== 'undefined' ? window : globalThis);

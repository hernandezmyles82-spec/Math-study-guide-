/* Builds quiz questions from study cards and practice-problem generators, and checks answers.
   Question shape:
     { kind: 'mc' | 'input' | 'flash', prompt, choices?, correct?, answer?, answerDisplay?, tol?,
       explain?, cardId?, categoryId?, topic? } */
(function (root) {
  'use strict';
  const { U, Library, Generators, Store } = root.MSG;

  const wc = (s) => String(s).replace(/\$[^$]*\$|\\\(.*?\\\)/g, 'M').split(/\s+/).filter(Boolean).length;
  const isNumeric = (s) => isFinite(U.evalExpr(s));
  const isFormulaish = (s) => /[=^\\$]|\b[a-z]\s*\(/.test(s);
  function shapeOf(s) { return isNumeric(s) ? 'num' : isFormulaish(s) ? 'formula' : wc(s) <= 4 ? 'short' : 'text'; }

  function conceptCards(catId) {
    const cat = Library.get(catId);
    if (!cat) return [];
    return cat.concepts.map((k, i) => ({
      id: 'lib:' + catId + ':' + i, type: 'def', term: k.term, back: k.def, front: 'What best describes "' + k.term + '"?',
      topic: cat.name, categoryId: catId, source: 'library', concept: true
    }));
  }

  function distractors(card, pool, field, correct, count) {
    const want = shapeOf(correct);
    const key = U.normalize(correct);
    const seen = new Set([key]);
    const scored = [];
    pool.forEach((c) => {
      if (c.id === card.id) return;
      const v = field === 'term' ? c.term : c.back;
      if (!v || String(v).length > 220) return;
      const k = U.normalize(v);
      if (!k || seen.has(k)) return;
      seen.add(k);
      let score = Math.random();
      if (shapeOf(v) === want) score += 2;
      if (card.noteId && c.noteId === card.noteId) score += 1;
      if (card.topic && c.topic === card.topic) score += 0.7;
      if (card.categoryId && c.categoryId === card.categoryId) score += 3;
      if (card.categoryId && !c.categoryId) score -= 2; // keep note cards out of library questions
      scored.push([score, v]);
    });
    scored.sort((a, b) => b[0] - a[0]);
    let out = scored.slice(0, count).map((x) => x[1]);
    if (out.length < count && want === 'num') {
      // invent nearby numbers for numeric answers
      const v = U.evalExpr(correct);
      const cands = [v + 1, v - 1, v * 2, -v, v + 10, v / 2].filter((x) => isFinite(x) && x !== v).map((x) => Generators.fmtNum(x));
      for (const c of U.shuffle(cands)) { if (out.length >= count) break; if (!seen.has(U.normalize(c))) { seen.add(U.normalize(c)); out.push(c); } }
    }
    return out;
  }

  function mcFrom(prompt, correct, wrongs) {
    const choices = U.shuffle([correct].concat(wrongs));
    return { kind: 'mc', prompt, choices, correct: choices.indexOf(correct) };
  }

  function weighted(options) {
    const total = options.reduce((s, o) => s + o[0], 0);
    let r = Math.random() * total;
    for (const o of options) { r -= o[0]; if (r <= 0) return o[1]; }
    return options[options.length - 1][1];
  }

  function cardQuestion(card, pool) {
    const base = { cardId: card.concept ? null : card.id, conceptId: card.concept ? card.id : null, topic: card.topic, categoryId: card.categoryId || null };
    const opts = [];
    const back = String(card.back);
    const flash = () => Object.assign({ kind: 'flash', prompt: card.front, answerDisplay: back, explain: card.work && card.work !== back ? card.work : '' }, base);

    if (card.type === 'def' && card.term) {
      const fwd = distractors(card, pool, 'back', back, 3);
      const rev = distractors(card, pool, 'term', card.term, 3);
      if (fwd.length >= 2) opts.push([3, () => Object.assign(mcFrom(card.front, back, fwd), base)]);
      if (rev.length >= 2) opts.push([2, () => Object.assign(mcFrom('Which term matches this?\n' + back, card.term, rev), base)]);
      if (wc(card.term) <= 4) opts.push([2, () => Object.assign({ kind: 'input', prompt: 'Name the term:\n' + back, answer: card.term, answerDisplay: card.term }, base)]);
      opts.push([1, flash]);
    } else if (card.type === 'cloze') {
      if (wc(back) <= 5) opts.push([3, () => Object.assign({ kind: 'input', prompt: card.front, answer: back, answerDisplay: back }, base)]);
      const ds = distractors(card, pool, 'back', back, 3);
      if (ds.length >= 2) opts.push([2, () => Object.assign(mcFrom(card.front, back, ds), base)]);
      opts.push([1, flash]);
    } else {
      const short = wc(back) <= 6 || isNumeric(back);
      if (short) opts.push([card.type === 'problem' ? 1 : 2, () => Object.assign({ kind: 'input', prompt: card.front, answer: back, answerDisplay: back, explain: card.work && card.work !== back ? card.work : '' }, base)]);
      const ds = back.length <= 160 ? distractors(card, pool, 'back', back, 3) : [];
      if (ds.length >= 2) opts.push([2, () => Object.assign(mcFrom(card.front, back, ds), base, { explain: card.work && card.work !== back ? card.work : '' })]);
      opts.push([card.type === 'problem' ? 3 : 1, flash]);
    }
    return weighted(opts)();
  }

  function fromCards(cards, pool) {
    pool = pool || cards;
    return cards.map((c) => cardQuestion(c, pool));
  }

  function profilePool(extraCats) {
    const p = Store.current();
    let pool = p ? p.cards.slice() : [];
    (extraCats || []).forEach((id) => { pool = pool.concat(conceptCards(id).filter((k) => !pool.some((c) => c.id === k.id))); });
    return pool;
  }

  function genQuestion(catId, d) {
    const q = Generators.generate(catId, d);
    if (!q) return null;
    if (q.kind === 'input') q.check = 'numeric';
    q.topic = (Library.get(catId) || {}).name;
    return q;
  }

  function forCategory(catId, n, d) {
    const concepts = U.shuffle(conceptCards(catId));
    // Wrong answer choices come from this topic first, then from the same subject (never from another subject).
    const cat = Library.get(catId) || {};
    let pool = concepts.slice();
    Library.categories.filter((c) => c.subject === cat.subject && c.level === cat.level && c.id !== catId).forEach((c) => { pool = pool.concat(conceptCards(c.id)); });
    if (pool.length < 12) Library.categories.filter((c) => c.subject === cat.subject && c.level !== cat.level).forEach((c) => { pool = pool.concat(conceptCards(c.id)); });
    const hasGen = Generators.has(catId);
    const out = [];
    let ci = 0;
    for (let i = 0; i < n; i++) {
      const useConcept = !hasGen || (Math.random() < 0.25 && ci < concepts.length);
      let q = null;
      if (useConcept && concepts.length) {
        q = cardQuestion(concepts[ci++ % concepts.length], pool);
        const deck = Store.current() && Store.card(concepts[(ci - 1) % concepts.length].id);
        if (deck) { q.cardId = deck.id; q.conceptId = null; }
      } else q = genQuestion(catId, d);
      if (q) { q.categoryId = catId; out.push(q); }
    }
    return out;
  }

  /* A course quiz spreads questions evenly across the course's topics. */
  function forCourse(course, n, d) {
    const topics = U.shuffle(course.topics.filter((id) => Library.get(id)));
    const out = [];
    topics.forEach((id, i) => {
      const share = Math.floor(n / topics.length) + (i < n % topics.length ? 1 : 0);
      if (share) out.push(...forCategory(id, share, d));
    });
    return U.shuffle(out).slice(0, n);
  }

  function examCards(exam) {
    const p = Store.current();
    return p.cards.filter((c) => exam.noteIds.includes(c.noteId) || (c.source === 'library' && exam.categoryIds.includes(c.categoryId)));
  }

  function forExam(exam, mode) {
    const pool = profilePool(exam.categoryIds);
    let cards = examCards(exam);
    // include concept cards from linked categories that aren't already in the deck
    exam.categoryIds.forEach((id) => { cards = cards.concat(conceptCards(id).filter((k) => !cards.some((c) => c.id === k.id))); });
    const now = Date.now();
    cards.sort((a, b) => (b.srs ? Store.weakness(b, now) : 0.6) - (a.srs ? Store.weakness(a, now) : 0.6));
    let qs;
    if (mode === 'quick') {
      qs = fromCards(cards.slice(0, 15), pool);
      exam.categoryIds.forEach((id, i) => { if (i < 5) { const q = genQuestion(id, 2); if (q) { q.categoryId = id; qs.push(q); } } });
      qs = U.shuffle(qs).slice(0, 20);
    } else {
      qs = fromCards(cards, pool);
      const perCat = Math.max(2, Math.min(8, Math.round(15 / Math.max(1, exam.categoryIds.length))));
      exam.categoryIds.forEach((id) => { for (let i = 0; i < perCat; i++) { const q = genQuestion(id, mode === 'cram' ? 2 : U.ri(1, 3)); if (q) { q.categoryId = id; qs.push(q); } } });
      qs = U.shuffle(qs);
    }
    return qs;
  }

  function dailyReview(limit) {
    const due = Store.dueCards().slice(0, limit || 25);
    return fromCards(U.shuffle(due), profilePool());
  }

  function weakest(n, cards) {
    const now = Date.now();
    const list = (cards || Store.current().cards).slice().sort((a, b) => Store.weakness(b, now) - Store.weakness(a, now)).slice(0, n);
    return fromCards(U.shuffle(list), profilePool());
  }

  function forNote(noteId) {
    const note = Store.note(noteId);
    return fromCards(U.shuffle(Store.cardsForNote(noteId)), profilePool(note && note.categoryId ? [note.categoryId] : []));
  }

  function check(q, response) {
    if (q.kind === 'mc') return Number(response) === q.correct;
    if (q.kind === 'input') {
      if (q.check === 'numeric') return U.checkNumeric(response, q.answer, q.tol);
      return U.checkText(response, q.answer);
    }
    return response === true || response === '1'; // flash: self-graded
  }

  root.MSG.Quiz = { cardQuestion, fromCards, forCategory, forCourse, forExam, forNote, dailyReview, weakest, check, conceptCards, examCards };
})(typeof window !== 'undefined' ? window : globalThis);

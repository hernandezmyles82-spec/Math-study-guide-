/* Profiles, notes, study cards, exams and spaced-repetition scheduling.
   Everything is saved in the browser (localStorage) so it works with no server. */
(function (root) {
  'use strict';
  const U = root.MSG.U;
  const KEY = 'mathStudyGuide.v1';
  const DAY = 86400000;
  let memory = null;

  function blank() { return { profiles: {}, currentId: null }; }
  function load() {
    try {
      const raw = root.localStorage && root.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage blocked: fall back to memory */ }
    return memory || blank();
  }
  let db = load();
  function save() {
    memory = db;
    try { root.localStorage && root.localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* ignore */ }
  }

  function newSrs(now) { return { due: now || Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0, seen: false, last: 0 }; }
  function makeCard(c, extra) {
    return Object.assign({
      id: U.uid(), type: c.type || 'qa', front: c.front, back: c.back, term: c.term || null,
      topic: c.topic || '', source: 'note', noteId: null, categoryId: null,
      srs: newSrs(), stats: { right: 0, wrong: 0 }, createdAt: Date.now()
    }, extra || {});
  }
  function cardKey(c) { return (c.front + '|' + c.back).toLowerCase(); }

  const S = {
    DAY,
    reload() { db = load(); },
    profiles() { return Object.values(db.profiles).sort((a, b) => a.createdAt - b.createdAt); },
    current() { return db.profiles[db.currentId] || null; },
    setCurrent(id) { db.currentId = id; save(); },
    createProfile(name) {
      const p = {
        id: U.uid(), name: String(name).trim() || 'Student', createdAt: Date.now(),
        notes: [], cards: [], exams: [], activity: {}, catStats: {}, sessions: [],
        settings: { quizLength: 10, dailyLimit: 25 }
      };
      db.profiles[p.id] = p; db.currentId = p.id; save();
      return p;
    },
    renameProfile(name) { const p = S.current(); if (p && name.trim()) { p.name = name.trim(); save(); } },
    deleteProfile(id) {
      delete db.profiles[id];
      if (db.currentId === id) db.currentId = null;
      save();
    },
    updateSettings(patch) { const p = S.current(); Object.assign(p.settings, patch); save(); },

    /* ---------- notes ---------- */
    note(id) { const p = S.current(); return p && p.notes.find((n) => n.id === id); },
    addNote({ title, course, categoryId, content }, parsedCards) {
      const p = S.current();
      const note = { id: U.uid(), title: title || 'Untitled notes', course: course || '', categoryId: categoryId || '', content, createdAt: Date.now(), updatedAt: Date.now() };
      p.notes.unshift(note);
      parsedCards.forEach((c) => p.cards.push(makeCard(c, { noteId: note.id })));
      save();
      return note;
    },
    updateNote(id, fields, parsedCards) {
      const p = S.current();
      const note = p.notes.find((n) => n.id === id);
      if (!note) return null;
      Object.assign(note, fields, { updatedAt: Date.now() });
      if (parsedCards) {
        // Keep progress on cards that didn't change; keep hand-made cards.
        const old = new Map(p.cards.filter((c) => c.noteId === id && c.source === 'note').map((c) => [cardKey(c), c]));
        p.cards = p.cards.filter((c) => !(c.noteId === id && c.source === 'note'));
        parsedCards.forEach((c) => {
          const prev = old.get(cardKey(c));
          p.cards.push(prev ? Object.assign(prev, { topic: c.topic }) : makeCard(c, { noteId: id }));
        });
      }
      save();
      return note;
    },
    deleteNote(id) {
      const p = S.current();
      p.notes = p.notes.filter((n) => n.id !== id);
      p.cards = p.cards.filter((c) => c.noteId !== id);
      p.exams.forEach((e) => { e.noteIds = e.noteIds.filter((x) => x !== id); });
      save();
    },

    /* ---------- cards ---------- */
    card(id) { const p = S.current(); return p && p.cards.find((c) => c.id === id); },
    cardsForNote(id) { return S.current().cards.filter((c) => c.noteId === id); },
    addManualCard(noteId, front, back, topic) {
      const c = makeCard({ type: 'qa', front, back, topic }, { noteId, source: 'manual' });
      S.current().cards.push(c); save(); return c;
    },
    updateCard(id, front, back) {
      const c = S.card(id); if (!c) return;
      c.front = front; c.back = back;
      if (c.type === 'def') c.type = 'qa';
      if (c.source === 'note') c.source = 'manual'; // protect edits from re-parsing
      save();
    },
    deleteCard(id) { const p = S.current(); p.cards = p.cards.filter((c) => c.id !== id); save(); },
    libraryCardsAdded(catId) { return S.current().cards.some((c) => c.categoryId === catId && c.source === 'library'); },
    addLibraryCards(catId, concepts) {
      const p = S.current();
      concepts.forEach((k, i) => {
        const id = 'lib:' + catId + ':' + i;
        if (p.cards.some((c) => c.id === id)) return;
        p.cards.push(makeCard({ type: 'def', term: k.term, front: 'What best describes "' + k.term + '"?', back: k.def, topic: k.topic }, { id, source: 'library', categoryId: catId }));
      });
      save();
    },
    removeLibraryCards(catId) {
      const p = S.current();
      p.cards = p.cards.filter((c) => !(c.categoryId === catId && c.source === 'library'));
      save();
    },

    /* ---------- spaced repetition ---------- */
    schedule(card, correct, now) {
      now = now || Date.now();
      const s = card.srs;
      if (correct) {
        s.reps += 1;
        s.interval = s.reps === 1 ? 1 : s.reps === 2 ? 3 : Math.round(s.interval * s.ease);
        s.ease = Math.min(3, s.ease + 0.05);
        s.due = now + s.interval * DAY;
        card.stats.right += 1;
      } else {
        s.reps = 0; s.lapses += 1; s.interval = 0;
        s.ease = Math.max(1.3, s.ease - 0.2);
        s.due = now + 10 * 60 * 1000; // see it again in 10 minutes
        card.stats.wrong += 1;
      }
      s.seen = true; s.last = now;
    },
    weakness(card, now) {
      now = now || Date.now();
      const { right, wrong } = card.stats;
      let w = (wrong + 1) / (right + wrong + 2);
      if (!card.srs.seen) w += 0.25;
      w += (2.5 - card.srs.ease) * 0.3;
      if (card.srs.due <= now) w += 0.15;
      return w;
    },
    recordCard(cardId, correct) {
      const c = S.card(cardId); if (!c) return;
      S.schedule(c, correct); save();
    },
    recordCategory(catId, correct) {
      const p = S.current();
      const st = p.catStats[catId] || (p.catStats[catId] = { right: 0, wrong: 0, last: 0 });
      correct ? st.right++ : st.wrong++;
      st.last = Date.now();
      save();
    },
    recordActivity(correct) {
      const p = S.current();
      const k = U.dateKey();
      const a = p.activity[k] || (p.activity[k] = { right: 0, total: 0 });
      a.total += 1; if (correct) a.right += 1;
      save();
    },
    logSession(title, right, total) {
      const p = S.current();
      p.sessions.unshift({ title, right, total, at: Date.now() });
      p.sessions = p.sessions.slice(0, 50);
      save();
    },
    dueCards(now) {
      now = now || Date.now();
      return S.current().cards.filter((c) => c.srs.due <= now).sort((a, b) => a.srs.due - b.srs.due);
    },
    streak() {
      const p = S.current();
      let n = 0;
      const d = new Date();
      if (!p.activity[U.dateKey(d)]) d.setDate(d.getDate() - 1);
      while (p.activity[U.dateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    stats() {
      const p = S.current();
      let right = 0, total = 0;
      Object.values(p.activity).forEach((a) => { right += a.right; total += a.total; });
      const mastered = p.cards.filter((c) => c.srs.interval >= 7).length;
      return { cards: p.cards.length, due: S.dueCards().length, right, total, accuracy: total ? Math.round(100 * right / total) : null, streak: S.streak(), mastered };
    },

    /* ---------- exams ---------- */
    exam(id) { return S.current().exams.find((e) => e.id === id); },
    addExam({ title, date, noteIds, categoryIds }) {
      const e = { id: U.uid(), title: title || 'Upcoming test', date, noteIds: noteIds || [], categoryIds: categoryIds || [], createdAt: Date.now() };
      S.current().exams.push(e); save(); return e;
    },
    deleteExam(id) { const p = S.current(); p.exams = p.exams.filter((e) => e.id !== id); save(); },
    upcomingExams() {
      return S.current().exams.filter((e) => U.daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
    },

    /* ---------- backup ---------- */
    exportProfile() { return JSON.stringify({ app: 'math-study-guide', version: 1, profile: S.current() }, null, 2); },
    importProfile(text) {
      const data = JSON.parse(text);
      const p = data && data.profile;
      if (!p || !Array.isArray(p.notes) || !Array.isArray(p.cards)) throw new Error('This file is not a Math Study Guide backup.');
      p.id = U.uid();
      p.exams = p.exams || []; p.activity = p.activity || {}; p.catStats = p.catStats || {}; p.sessions = p.sessions || [];
      p.settings = Object.assign({ quizLength: 10, dailyLimit: 25 }, p.settings || {});
      db.profiles[p.id] = p; db.currentId = p.id; save();
      return p;
    },
    _reset() { db = blank(); memory = null; save(); }
  };

  root.MSG.Store = S;
})(typeof window !== 'undefined' ? window : globalThis);

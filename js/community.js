/* Live counter of everyone who has joined (claude.ai version only; the public website has no shared database).
   Each claude.ai account that opens the site is recorded once at visitors/<their id> = { joined: <time> } —
   an opaque id and a date, nothing else. Rules: everyone reads `visitors`, each person writes only their own
   document, the owner can tidy. The count is the number of those documents, kept live with onSnapshot, and is
   shown wherever an element has data-live-count="total" or "week". */
(function (root) {
  'use strict';
  const C = { state: 'idle', total: null, week: null };
  const WEEK = 7 * 86400000;

  function paint() {
    document.querySelectorAll('[data-live-count]').forEach((el) => {
      const v = el.dataset.liveCount === 'week' ? C.week : C.total;
      if (v != null) el.textContent = v.toLocaleString();
    });
    document.querySelectorAll('[data-live-counter]').forEach((el) => { el.hidden = C.total == null; });
  }

  async function start() {
    if (C.state !== 'idle') return;
    if (!(root.MSG.Sync && root.MSG.Sync.inClaude)) { C.state = 'off'; return; }
    C.state = 'starting';
    let db = null, user = null;
    try { [db, user] = await Promise.all([root.claude.use('db'), root.claude.use('user')]); } catch (e) { /* off below */ }
    if (!db || !user) { C.state = 'off'; return; }
    C.state = 'on';
    db.collection('visitors').onSnapshot((snap) => {
      const now = Date.now();
      C.total = snap.size;
      C.week = snap.docs.filter((d) => { const j = Number(d.data() && d.data().joined); return Number.isFinite(j) && now - j < WEEK; }).length;
      paint();
    }, () => { C.state = 'error'; });
    // Count this person once (only people who can write, Contributors and up, are counted).
    try {
      const me = await user.id();
      if (me && (await user.can('data.write')) !== false) {
        const ref = db.doc('visitors/' + me);
        const snap = await ref.get();
        if (!snap.exists) await ref.set({ joined: Date.now() });
      }
    } catch (e) { /* not counted this time; the counter still shows */ }
  }

  /* The counter line, hidden until the first count arrives (and always on the public website). */
  function html(kind) {
    if (!(root.MSG.Sync && root.MSG.Sync.inClaude)) return '';
    const t = C.total == null ? '' : C.total.toLocaleString(), w = C.week == null ? '' : C.week.toLocaleString();
    return kind === 'stat'
      ? `<div class="stat live-stat" data-live-counter ${C.total == null ? 'hidden' : ''}><span><i class="live-dot" aria-hidden="true"></i><b data-live-count="total">${t}</b></span>students have joined · <b data-live-count="week">${w}</b> this week</div>`
      : `<p class="live-counter" data-live-counter ${C.total == null ? 'hidden' : ''}><i class="live-dot" aria-hidden="true"></i><b data-live-count="total">${t}</b> students have joined, <b data-live-count="week">${w}</b> this week</p>`;
  }

  root.MSG.Community = { start, html, paint, state: C };
})(typeof window !== 'undefined' ? window : globalThis);

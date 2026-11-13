/* Screens for the study modes (js/modes.js), the topic study guides (js/guides.js), the mistake notebook
   and the progress page. js/app.js calls MSG.Study.init(ui) with its helpers and merges the views,
   actions and forms returned here into its own router. Routes: #flashcards--<source>, #learn--<source>,
   #match--<source>, #truefalse--<source>, #test--<source>, #order--<source>, #mistakes, #progress
   (a source is cat_<topic>, course_<course>, note_<note>, starred or deck; see js/modes.js). */
(function (root) {
  'use strict';
  const { U, Store, Library, Quiz, Modes, Guides } = root.MSG;
  let ui = null;
  const esc = U.esc;

  /* ---------- read aloud ---------- */
  function speakable(text) {
    let t = String(text || '');
    const rep = [
      [/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1 over $2'], [/\\sqrt\{([^{}]*)\}/g, 'the square root of $1'],
      [/\^\{?2\}?/g, ' squared'], [/\^\{?3\}?/g, ' cubed'], [/\^\{([^{}]*)\}/g, ' to the power $1'], [/\^(\w)/g, ' to the power $1'],
      [/_\{([^{}]*)\}/g, ' sub $1'], [/\\pi/g, 'pi'], [/\\theta/g, 'theta'], [/\\times|\\cdot/g, ' times '], [/\\div/g, ' divided by '],
      [/\\le(q)?/g, ' is at most '], [/\\ge(q)?/g, ' is at least '], [/\\ne(q)?/g, ' is not equal to '], [/\\pm/g, ' plus or minus '],
      [/\\infty/g, 'infinity'], [/\\[a-zA-Z]+/g, ' '], [/[{}$\\]/g, ''], [/\*\*/g, ''], [/_{3,}/g, ' blank '], [/=/g, ' equals '], [/→/g, ': ']
    ];
    rep.forEach(([a, b]) => { t = t.replace(a, b); });
    return t.replace(/\s+/g, ' ').trim();
  }
  function speak(text) {
    const s = root.speechSynthesis;
    if (!s || typeof root.SpeechSynthesisUtterance !== 'function') { ui.toast('Reading aloud isn\'t available in this browser.'); return; }
    if (s.speaking) { s.cancel(); return; } // the same button stops it
    const u = new root.SpeechSynthesisUtterance(speakable(text));
    u.rate = 0.95;
    s.speak(u);
  }
  // claude.ai never opens the print dialog, so the Print button only appears on the public website.
  const canPrint = () => !(root.MSG.Sync && root.MSG.Sync.inClaude);
  const printBtn = () => (canPrint() ? '<button class="btn small ghost" type="button" data-action="print">🖨️ Print</button>' : '');
  const speakBtn = (label) => `<button class="btn small ghost no-print" type="button" data-action="speak" title="Read aloud (press again to stop)">🔊 ${label || 'Read aloud'}</button>`;

  /* ---------- the study-modes panel shown on topic, course and note pages ---------- */
  function modesPanel(src, opts) {
    opts = opts || {};
    const d = Modes.deck(src);
    if (!d) return '';
    const n = d.items.length;
    const orders = Modes.orderSets(src).length;
    const can = (min) => n >= min;
    const b = (mode, icon, label, ok, why) => ok
      ? (mode === 'truefalse' ? `<button class="mode-btn" type="button" data-action="start-tf" data-src="${esc(src)}"><span class="mode-icon">${icon}</span><span>${label}</span></button>`
        : `<a class="mode-btn" href="#${mode}--${esc(src)}"><span class="mode-icon">${icon}</span><span>${label}</span></a>`)
      : `<span class="mode-btn off" title="${esc(why)}"><span class="mode-icon">${icon}</span><span>${label}</span></span>`;
    return `<div class="card no-print">
      <h2>Ways to study</h2>
      ${n ? '' : '<p class="small muted">Add study cards first, then try these.</p>'}
      <div class="modes">
        ${b('flashcards', '🃏', 'Flashcards', can(1), 'Needs at least 1 card')}
        ${b('learn', '🧠', 'Learn', can(2), 'Needs at least 2 cards')}
        ${b('match', '🧩', 'Matching', Modes.matchRounds(d.items).length > 0, 'Needs at least 3 cards with short answers')}
        ${b('truefalse', '✅', 'True / False', can(2), 'Needs at least 2 cards')}
        ${b('test', '📝', 'Practice test', can(2) || d.categoryIds.length > 0, 'Needs at least 2 cards')}
        ${opts.order === false ? '' : b('order', '⏳', 'Put in order', orders > 0, 'Needs a timeline or step list (in the study guide, or dates in your notes)')}
        ${b('write', '✍️', 'Written answers', Modes.writtenQuestions(src, 1).length > 0, 'Needs cards with longer answers, or a study guide')}
        ${b('sheet', '📄', 'Study sheet', can(1), 'Needs at least 1 card')}
      </div>
    </div>`;
  }

  /* ---------- study guide (topic page) ---------- */
  /* A built-in topic's guide (by id) or any parsed guide (a note's AI-made one), with its source for read aloud. */
  function guideHtml(catIdOrGuide, opts) {
    opts = opts || {};
    const g = typeof catIdOrGuide === 'string' ? Guides.get(catIdOrGuide) : catIdOrGuide;
    if (!g) return '';
    const src = opts.src || 'cat_' + g.id;
    const fmt = ui.fmt, md = ui.md;
    const parts = [];
    g.sections.forEach((s) => parts.push(`<section class="guide-sec"><h3>${esc(s.title)}</h3>${md(s.text)}</section>`));
    if (g.map) parts.splice(Math.min(2, parts.length), 0, `<section class="guide-sec"><h3>Concept map</h3><div class="cmap"><div class="cmap-center">${fmt(g.map.center)}</div><div class="cmap-branches">${g.map.branches.map((b) => `<div class="cmap-branch"><b>${fmt(b.label)}</b>${b.items.length ? `<ul>${b.items.map((x) => `<li>${fmt(x)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div></div></section>`);
    if (g.examples.length) parts.splice(Math.min(2, parts.length), 0, `<section class="guide-sec"><h3>Worked examples</h3>${g.examples.map((e, i) => `<div class="example"><div class="ex-q"><b>Example ${i + 1}.</b> ${fmt(e.problem)}</div>${e.solution.length ? `<div class="ex-steps">${e.solution.map((x) => `<div>${fmt(x)}</div>`).join('')}</div>` : ''}${e.answer ? `<div class="ex-a"><b>Answer:</b> ${fmt(e.answer)}</div>` : ''}</div>`).join('')}</section>`);
    if (g.timeline.length) parts.push(`<section class="guide-sec"><h3>Timeline</h3><ol class="timeline">${g.timeline.map((t) => `<li><b>${esc(t.when)}</b> ${fmt(t.label)}</li>`).join('')}</ol></section>`);
    g.orders.forEach((o) => parts.push(`<section class="guide-sec"><h3>${esc(o.title)}</h3><ol>${o.items.map((x) => `<li>${fmt(x)}</li>`).join('')}</ol></section>`));
    if (g.check.length) parts.push(`<section class="guide-sec"><h3>Check yourself</h3>${g.check.map((c) => `<details class="check-q"><summary>${fmt(c.q)}</summary><div>${fmt(c.a)}</div></details>`).join('')}<p class="small muted no-print">Tap a question to see the answer.</p></section>`);
    return `<div class="card guide" id="guide" data-src="${esc(src)}">
      <div class="row spread"><h2>${esc(opts.title || 'Study guide')}</h2><div class="row tight no-print">${speakBtn()}${printBtn()}</div></div>
      ${opts.before || ''}${parts.join('')}${opts.after || ''}
    </div>`;
  }

  /* ---------- flashcards ---------- */
  let FC = null;
  function fcStart(src, onlyIds) {
    const d = Modes.deck(src);
    if (!d) return null;
    let items = d.items;
    if (onlyIds) items = items.filter((it) => onlyIds.has(it.id));
    FC = { src, title: d.title, back: d.back, all: d.items, items: items.slice(), i: 0, flipped: false, known: new Set(), learning: new Set(), starOnly: false, done: false };
    Store.markMode('flash');
    return FC;
  }
  function fcVisible() { return FC.starOnly ? FC.items.filter((it) => Store.isStarred(it.id)) : FC.items; }
  function flashcardsView(src) {
    if (!FC || FC.src !== src) { if (!fcStart(src)) return ui.notFound(); }
    const list = fcVisible();
    const head = `<div class="page-head"><div><a href="${FC.back}" class="muted small">← ${esc(FC.title)}</a><h1>Flashcards</h1></div>
      <div class="row tight"><button class="btn small ${FC.starOnly ? 'primary' : ''}" data-action="fc-staronly" aria-pressed="${FC.starOnly}">⭐ Starred only</button><button class="btn small" data-action="fc-shuffle">🔀 Shuffle</button></div></div>`;
    if (!list.length) return head + `<div class="card empty"><p>${FC.starOnly ? 'No starred cards here yet. Tap ☆ on a card to star it.' : 'No cards to show.'}</p></div>`;
    if (FC.done || FC.i >= list.length) {
      const k = list.filter((it) => FC.known.has(it.id)).length, l = list.filter((it) => FC.learning.has(it.id)).length;
      return head + `<div class="card summary"><h2>Deck done! 🎉</h2>
        <p><b>${k}</b> you know · <b>${l}</b> still learning${list.length - k - l ? ` · ${list.length - k - l} not sorted` : ''}</p>
        <div class="row center">${l ? `<button class="btn primary" data-action="fc-again" data-which="learning">Study the ${l} I'm still learning</button>` : ''}<button class="btn" data-action="fc-again" data-which="all">Go through all again</button><a class="btn" href="${FC.back}">Done</a></div></div>`;
    }
    const it = list[FC.i];
    const star = Store.isStarred(it.id);
    const tag = FC.known.has(it.id) ? '<span class="chip good">Know it</span>' : FC.learning.has(it.id) ? '<span class="chip bad">Still learning</span>' : '';
    return head + `
      <div class="fc-wrap">
        <div class="muted small center">Card ${FC.i + 1} of ${list.length} · ${FC.known.size} know it · ${FC.learning.size} still learning</div>
        <div class="progress"><div style="width:${(100 * FC.i) / list.length}%"></div></div>
        <button class="flashcard ${FC.flipped ? 'flipped' : ''}" data-action="fc-flip" aria-label="Flip card">
          <span class="fc-face fc-front"><span class="muted small">${it.term ? 'Term' : 'Question'} ${tag}</span><span class="fc-text">${ui.fmt(it.front)}</span><span class="muted small fc-hint">Tap to flip</span></span>
          <span class="fc-face fc-back"><span class="muted small">${it.term ? 'Definition' : 'Answer'}</span><span class="fc-text">${ui.fmt(it.back)}</span></span>
        </button>
        <div class="row center">
          <button class="btn" data-action="fc-prev" ${FC.i ? '' : 'disabled'} aria-label="Previous card">←</button>
          <button class="btn bad" data-action="fc-sort" data-ok="0">✗ Still learning</button>
          <button class="btn good" data-action="fc-sort" data-ok="1">✓ Know it</button>
          <button class="btn" data-action="fc-next" aria-label="Next card">→</button>
        </div>
        <div class="row center"><button class="btn small ghost" data-action="fc-star" data-id="${esc(it.id)}">${star ? '⭐ Starred' : '☆ Star'}</button>${speakBtn()}</div>
        <p class="muted small center key-hint">Keys: Space flips · ← → move · 1 still learning · 2 know it</p>
      </div>`;
  }

  /* ---------- learn ---------- */
  let LN = null;
  function learnView(src) {
    if (!LN || LN.src !== src) {
      const d = Modes.deck(src);
      if (!d) return ui.notFound();
      const st = Modes.learnStart(d.items);
      if (!st) return `<div class="card empty"><p>Learn mode needs at least 2 cards with different answers.</p><a class="btn" href="${d.back}">Back</a></div>`;
      LN = { src, title: d.title, back: d.back, st, answered: false, correct: false, response: null };
      Store.markMode('learn');
      Modes.learnQuestion(st);
    }
    const st = LN.st, total = st.all.length;
    const head = `<div class="quiz-head"><div><b>🧠 Learn: ${esc(LN.title)}</b><div class="muted small">${st.learned} of ${total} learned · each card twice in a row</div></div><a class="btn small ghost" href="${LN.back}">Stop</a></div>
      <div class="progress"><div style="width:${(100 * st.learned) / total}%"></div></div>`;
    if (!st.q) return `<div class="quiz">${head}<div class="card summary"><h2>You learned all ${total} cards! 🎓</h2><p>It took ${st.asked} questions. They'll stick better if you come back tomorrow.</p><div class="row center"><button class="btn primary" data-action="learn-again">Learn them again</button><a class="btn" href="${LN.back}">Done</a></div></div></div>`;
    return `<div class="quiz">${head}${questionCard(st.q, LN, 'learn')}</div>`;
  }
  /* A multiple-choice or typed question with feedback, shared by learn and true/false screens. */
  function questionCard(q, state, prefix) {
    let body;
    if (q.kind === 'mc') {
      body = `<div class="choices">${q.choices.map((c, i) => {
        const cls = state.answered ? (i === q.correct ? 'correct' : i === Number(state.response) ? 'wrong' : 'dim') : '';
        return `<button class="choice ${cls}" data-action="${prefix}-mc" data-i="${i}" ${state.answered ? 'disabled' : ''}><span class="key">${'ABCD'[i] || i + 1}</span><span>${ui.fmt(c)}</span></button>`;
      }).join('')}</div>`;
    } else {
      body = `<form data-form="${prefix}-input" class="answer-form"><input name="answer" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer" ${state.answered ? `disabled value="${esc(state.response || '')}"` : 'autofocus'} aria-label="Your answer">${state.answered ? '' : `<button class="btn primary" type="submit">Check</button><button class="btn ghost" type="button" data-action="${prefix}-dont">I don't know</button>`}</form>`;
    }
    const fb = state.answered ? `<div class="feedback ${state.correct ? 'good' : 'bad'}"><b>${state.correct ? U.pick(['Correct! 🎉', 'Nice! ✅', 'You got it! 💪']) : 'Not quite.'}</b>
      ${!state.correct ? `<div>Answer: <span class="answer">${ui.fmt(q.kind === 'mc' ? q.choices[q.correct] : q.answerDisplay)}</span></div>` : ''}${q.explain ? `<div class="explain">${ui.fmt(q.explain)}</div>` : ''}
      <div class="row">${!state.correct && q.kind === 'input' ? `<button class="btn small ghost" data-action="${prefix}-override">I was actually right</button>` : ''}<button class="btn primary" data-action="${prefix}-next" id="nextBtn">Continue →</button></div></div>` : '';
    return `<div class="card question">${q.topic ? `<span class="chip">${esc(q.topic)}</span>` : ''}<div class="prompt">${ui.fmt(q.prompt)}</div>${speakBtn()}${body}${fb}</div>`;
  }
  /* Saves one answer to spaced repetition, topic stats, the streak and the mistake notebook. */
  function record(q, correct) {
    if (q.cardId) Store.recordCard(q.cardId, correct);
    if (q.categoryId && !q.cardId) Store.recordCategory(q.categoryId, correct);
    Store.recordActivity(correct);
    if (!correct) Store.addMistake(q);
    else if (Store.clearMistake(q)) Store.markMode('fixed');
  }
  function learnAnswered(correct, response) { LN.answered = true; LN.correct = correct; LN.response = response; ui.route(); }
  function learnNext() {
    record(LN.st.q, LN.correct);
    Modes.learnAnswer(LN.st, LN.correct);
    LN.answered = false; LN.response = null;
    Modes.learnQuestion(LN.st);
    ui.route();
  }

  /* ---------- matching ---------- */
  let MT = null;
  function matchView(src) {
    if (!MT || MT.src !== src) {
      const d = Modes.deck(src);
      if (!d) return ui.notFound();
      const rounds = Modes.matchRounds(d.items);
      if (!rounds.length) return `<div class="card empty"><p>Matching needs at least 3 cards with short answers.</p><a class="btn" href="${d.back}">Back</a></div>`;
      MT = { src, title: d.title, back: d.back, rounds, r: 0, misses: 0, start: Date.now(), end: 0, sel: null, done: new Set(), wrong: null };
      MT.left = U.shuffle(rounds[0].slice()); MT.right = U.shuffle(rounds[0].slice());
      Store.markMode('match');
    }
    const head = `<div class="page-head"><div><a href="${MT.back}" class="muted small">← ${esc(MT.title)}</a><h1>Matching</h1></div></div>`;
    if (MT.end) {
      const secs = Math.round((MT.end - MT.start) / 1000);
      const pairs = MT.rounds.reduce((s, r) => s + r.length, 0);
      return head + `<div class="card summary"><h2>All matched! 🎉</h2><div class="big-score good">${fmtTime(secs)}</div><p>${pairs} pairs · ${MT.misses} wrong ${MT.misses === 1 ? 'try' : 'tries'}</p><div class="row center"><button class="btn primary" data-action="match-again">Play again</button><a class="btn" href="${MT.back}">Done</a></div></div>`;
    }
    const tile = (side, it) => {
      const id = it.id;
      const done = MT.done.has(id);
      const sel = MT.sel && MT.sel.side === side && MT.sel.id === id;
      const wrong = MT.wrong && MT.wrong[side] === id;
      return `<button class="match-tile ${done ? 'done' : ''} ${sel ? 'sel' : ''} ${wrong ? 'wrong' : ''}" data-action="match-pick" data-side="${side}" data-id="${esc(id)}" ${done ? 'disabled' : ''}>${ui.fmt(side === 'l' ? it.front : it.back)}</button>`;
    };
    return head + `<div class="muted small">Round ${MT.r + 1} of ${MT.rounds.length} · ⏱ <span id="matchTime">${fmtTime(Math.round((Date.now() - MT.start) / 1000))}</span> · ${MT.misses} wrong</div>
      <p class="small">Tap a term, then the definition that goes with it.</p>
      <div class="match-grid"><div class="stack">${MT.left.map((it) => tile('l', it)).join('')}</div><div class="stack">${MT.right.map((it) => tile('r', it)).join('')}</div></div>`;
  }
  const fmtTime = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

  /* ---------- put it in order ---------- */
  let OR = null;
  function orderView(src) {
    if (!OR || OR.src !== src) {
      const d = Modes.deck(src);
      if (!d) return ui.notFound();
      const sets = Modes.orderSets(src);
      if (!sets.length) return `<div class="card empty"><p>Nothing to put in order here yet. This works with timelines and step-by-step lists in a topic's study guide, or with dates in your notes.</p><a class="btn" href="${d.back}">Back</a></div>`;
      OR = { src, title: d.title, back: d.back, sets, s: 0, round: null, placed: [], checked: false };
      Store.markMode('order');
    }
    const set = OR.sets[OR.s];
    if (!OR.round) { OR.round = Modes.orderRound(set, 6); OR.placed = []; OR.checked = false; }
    const head = `<div class="page-head"><div><a href="${OR.back}" class="muted small">← ${esc(OR.title)}</a><h1>Put it in order</h1></div></div>`;
    const chooser = OR.sets.length > 1 ? `<div class="subject-chips">${OR.sets.map((x, i) => `<button class="chip-btn ${i === OR.s ? 'active' : ''}" data-action="order-set" data-i="${i}">${esc(x.title)}</button>`).join('')}</div>` : '';
    const how = set.kind === 'time' ? 'Tap the events from <b>earliest</b> to <b>latest</b>.' : 'Tap the steps in the order they happen.';
    const left = OR.round.filter((x) => !OR.placed.includes(x));
    let result = '';
    if (OR.checked) {
      const right = Modes.orderScore(OR.placed);
      const correct = OR.placed.slice().sort((a, b) => a.key - b.key);
      result = `<div class="feedback ${right === OR.placed.length ? 'good' : 'bad'}"><b>${right} of ${OR.placed.length} in the right place${right === OR.placed.length ? ' 🎉' : ''}</b>
        <div class="small">The right order:</div><ol class="order-list">${correct.map((x) => `<li><span class="muted small">${esc(x.show)}</span> ${ui.fmt(x.label)}</li>`).join('')}</ol>
        <div class="row"><button class="btn primary" data-action="order-new">New round</button></div></div>`;
    }
    return head + chooser + `<div class="card">
      <h2>${esc(set.title)}</h2><p class="small">${how} Tap one in your list to take it back.</p>
      <div class="order-pool">${left.map((x) => `<button class="order-tile" data-action="order-place" data-i="${OR.round.indexOf(x)}" ${OR.checked ? 'disabled' : ''}>${ui.fmt(x.label)}</button>`).join('') || (OR.checked ? '' : '<p class="muted small">All placed. Check your order!</p>')}</div>
      <h3>Your order</h3>
      <ol class="order-list">${OR.placed.map((x, i) => { const ok = OR.checked && x.key === OR.placed.slice().sort((a, b) => a.key - b.key)[i].key; return `<li><button class="order-tile placed ${OR.checked ? (ok ? 'right' : 'wrong') : ''}" data-action="order-unplace" data-i="${i}" ${OR.checked ? 'disabled' : ''}>${OR.checked ? `<span class="muted small">${esc(x.show)}</span> ` : ''}${ui.fmt(x.label)}</button></li>`; }).join('')}</ol>
      ${!OR.checked ? `<div class="row"><button class="btn primary" data-action="order-check" ${left.length ? 'disabled' : ''}>Check my order</button></div>` : ''}
      ${result}</div>`;
  }

  /* ---------- quiz-based modes: true/false and practice test ---------- */
  function startTrueFalse(src) {
    const d = Modes.deck(src);
    if (!d) return;
    const n = Math.min(20, Math.max(5, d.items.length));
    Store.markMode('tf');
    ui.startQuiz('True or false: ' + d.title, Modes.trueFalseSet(d.items, n), { back: d.back });
  }
  function testSetup(src) {
    const d = Modes.deck(src);
    if (!d) return ui.notFound();
    const p = Store.current();
    return `<div class="page-head"><div><a href="${d.back}" class="muted small">← ${esc(d.title)}</a><h1>Practice test</h1><p class="muted">Like the real thing: no answers shown until you finish, then a full review of every question.</p></div></div>
      <form class="card stack narrow" data-form="start-test" data-src="${esc(src)}">
        <label>Questions<select name="n">${[10, 20, 30, 40].map((n) => `<option ${n === 20 ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label>Time limit<select name="min"><option value="0">No time limit</option>${[5, 10, 15, 20, 30, 45, 60].map((m) => `<option value="${m}" ${m === 20 ? 'selected' : ''}>${m} minutes</option>`).join('')}</select></label>
        <button class="btn primary" type="submit">Start test</button>
        <p class="small muted">${esc(p.name)}, take it somewhere quiet, without your notes. 🍀</p>
      </form>`;
  }

  /* ---------- mistake notebook ---------- */
  function mistakesView() {
    const list = Store.mistakes();
    return `<div class="page-head"><div><h1>Mistake notebook</h1><p class="muted">Every question you miss lands here. Answer it right later and it leaves the notebook.</p></div>
      ${list.length ? `<div class="row tight"><button class="btn primary" data-action="redo-mistakes">Redo all ${list.length}</button><button class="btn small ghost" data-action="clear-mistakes">Clear notebook</button></div>` : ''}</div>
      ${list.length ? `<div class="card"><div class="card-list">${list.map((m) => `<div class="card-row"><div class="cr-main"><div class="cr-front">${ui.fmt(m.prompt)}</div><div class="cr-back">✔ ${ui.fmt(m.kind === 'mc' ? m.choices[m.correct] : m.answerDisplay || m.answer || '')}</div><div class="muted small">${m.topic ? esc(m.topic) + ' · ' : ''}missed ${m.count === 1 ? 'once' : m.count + ' times'}</div></div></div>`).join('')}</div></div>`
        : '<div class="card empty"><p>📗 Your notebook is empty.</p><p class="muted">Nice! Questions you miss in any quiz or study mode will show up here so you can fix them.</p><a class="btn" href="#dashboard">Go home</a></div>'}`;
  }

  /* ---------- progress & badges ---------- */
  function progressView() {
    const p = Store.current();
    const st = Store.stats();
    const bs = Modes.badges();
    const got = bs.filter((b) => b.got).length;
    const days = [];
    for (let i = 34; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = U.dateKey(d); const a = p.activity[k]; days.push({ k, n: a ? a.total : 0, day: d }); }
    const lvl = (n) => (n === 0 ? 0 : n < 10 ? 1 : n < 30 ? 2 : 3);
    const topics = Object.keys(p.catStats).map((id) => ({ c: Library.get(id), m: Modes.topicMastery(id), s: p.catStats[id] })).filter((x) => x.c).sort((a, b) => b.m - a.m);
    return `<div class="page-head"><div><h1>Progress</h1><p class="muted">${st.streak ? `🔥 ${ui.plural(st.streak, 'day')} streak` : 'Study today to start a streak'} · ${st.total} questions answered${st.accuracy != null ? ' · ' + st.accuracy + '% correct' : ''}</p></div></div>
      <div class="card"><h2>Last 5 weeks</h2><div class="heat" role="img" aria-label="Questions answered each day for the last 35 days">${days.map((d) => `<span class="heat-day h${lvl(d.n)}" title="${d.day.toLocaleDateString()}: ${d.n} questions"></span>`).join('')}</div>
        <p class="small muted">Each square is a day. Darker means more questions answered.</p></div>
      <div class="card"><h2>Badges <span class="muted small">${got} of ${bs.length}</span></h2><div class="badges">${bs.map((b) => `<div class="badge-tile ${b.got ? 'got' : ''}"><span class="badge-icon">${b.got ? b.icon : '🔒'}</span><b>${esc(b.name)}</b><span class="small muted">${esc(b.how)}</span></div>`).join('')}</div></div>
      <div class="card"><h2>Topic mastery</h2>${topics.length ? `<ul class="list">${topics.map((x) => `<li><div><a href="#category--${x.c.id}"><b>${x.c.icon} ${esc(x.c.name)}</b></a> <span class="muted small">${x.s.right}/${x.s.right + x.s.wrong} correct</span><div class="meter"><div style="width:${x.m}%"></div></div></div><b>${x.m}%</b></li>`).join('')}</ul><p class="small muted">Mastery is how often you're right, counted fully once you've answered 20 questions in a topic.</p>` : '<p class="muted">Practice a topic from Categories to see your mastery here.</p>'}</div>`;
  }

  /* ---------- actions & forms ---------- */
  const actions = {
    speak: (el) => {
      const box = el.closest('.guide, .question, .fc-wrap') || document.getElementById('app');
      const front = box.querySelector('.flashcard');
      let text;
      if (front) text = (FC && fcVisible()[FC.i]) ? (FC.flipped ? fcVisible()[FC.i].back : fcVisible()[FC.i].front) : '';
      else if (box.classList.contains('guide')) text = guideText(Modes.guidesFor(box.dataset.src)[0]) || box.textContent;
      else text = currentQuestionText(box);
      speak(text);
    },
    print: () => { try { root.print(); } catch (e) { ui.toast('Printing isn\'t available here. Open the site in its own tab to print.'); } },
    'fc-flip': (el) => { FC.flipped = !FC.flipped; el.classList.toggle('flipped', FC.flipped); },
    'fc-next': () => { FC.i += 1; FC.flipped = false; ui.route(); },
    'fc-prev': () => { FC.i = Math.max(0, FC.i - 1); FC.flipped = false; ui.route(); },
    'fc-sort': (el) => {
      const it = fcVisible()[FC.i]; if (!it) return;
      const ok = el.dataset.ok === '1';
      (ok ? FC.known : FC.learning).add(it.id); (ok ? FC.learning : FC.known).delete(it.id);
      Store.recordActivity(ok);
      FC.i += 1; FC.flipped = false; ui.route();
    },
    'fc-star': (el) => { const on = Store.toggleStar(el.dataset.id); ui.toast(on ? 'Starred ⭐' : 'Star removed'); ui.route(); },
    'fc-staronly': () => { FC.starOnly = !FC.starOnly; FC.i = 0; FC.flipped = false; FC.done = false; ui.route(); },
    'fc-shuffle': () => { FC.items = U.shuffle(FC.items); FC.i = 0; FC.flipped = false; FC.done = false; ui.toast('Shuffled'); ui.route(); },
    'fc-again': (el) => { const ids = el.dataset.which === 'learning' ? new Set(FC.learning) : null; const so = FC.starOnly; fcStart(FC.src, ids); FC.starOnly = so && !ids; ui.route(); },
    'learn-mc': (el) => { if (LN.answered) return; const i = Number(el.dataset.i); learnAnswered(i === LN.st.q.correct, i); },
    'learn-dont': () => learnAnswered(false, ''),
    'learn-override': () => { LN.correct = true; ui.route(); },
    'learn-next': () => learnNext(),
    'learn-again': () => { LN = null; ui.route(); },
    'match-pick': (el) => {
      if (MT.wrong) return;
      const side = el.dataset.side, id = el.dataset.id;
      if (!MT.sel || MT.sel.side === side) { MT.sel = { side, id }; ui.route(); return; }
      const other = MT.sel; MT.sel = null;
      if (other.id === id) {
        MT.done.add(id); Store.recordActivity(true);
        if (MT.done.size === MT.left.length) {
          MT.r += 1;
          if (MT.r >= MT.rounds.length) MT.end = Date.now();
          else { MT.left = U.shuffle(MT.rounds[MT.r].slice()); MT.right = U.shuffle(MT.rounds[MT.r].slice()); MT.done = new Set(); }
        }
        ui.route();
      } else {
        MT.misses += 1; Store.recordActivity(false);
        MT.wrong = { [other.side]: other.id, [side]: id };
        ui.route();
        setTimeout(() => { MT.wrong = null; ui.route(); }, 600);
      }
    },
    'match-again': () => { MT = null; ui.route(); },
    'order-set': (el) => { OR.s = Number(el.dataset.i); OR.round = null; ui.route(); },
    'order-place': (el) => { const x = OR.round[Number(el.dataset.i)]; if (x && !OR.placed.includes(x)) OR.placed.push(x); ui.route(); },
    'order-unplace': (el) => { OR.placed.splice(Number(el.dataset.i), 1); ui.route(); },
    'order-check': () => { OR.checked = true; const r = Modes.orderScore(OR.placed); Store.recordActivity(r === OR.placed.length); ui.route(); },
    'order-new': () => { OR.round = null; ui.route(); },
    'start-tf': (el) => startTrueFalse(el.dataset.src),
    'redo-mistakes': () => { Store.markMode('notebook'); ui.startQuiz('Mistake notebook', U.shuffle(Modes.mistakeQuestions()), { back: '#mistakes' }); },
    'clear-mistakes': async () => { if (await ui.ask('Clear every question from your mistake notebook?', 'Clear notebook')) { Store.clearAllMistakes(); ui.route(); } }
  };
  const forms = {
    'learn-input': (f) => { const v = f.answer.value; if (!v.trim()) { f.answer.focus(); return; } learnAnswered(Quiz.check(LN.st.q, v), v); },
    'start-test': (f) => {
      const src = f.dataset.src, n = Number(f.n.value), min = Number(f.min.value);
      const d = Modes.deck(src);
      const qs = Modes.practiceTest(src, n);
      Store.markMode('test');
      ui.startQuiz('Practice test: ' + d.title, qs, { back: d.back, test: true, minutes: min });
    }
  };
  function currentQuestionText(box) {
    const prompt = box.querySelector('.prompt');
    const choices = Array.from(box.querySelectorAll('.choice')).map((c, i) => 'Choice ' + 'ABCD'[i] + ': ' + (c.lastElementChild ? c.lastElementChild.textContent : ''));
    const src = box.dataset && box.dataset.say;
    return [src || (prompt ? prompt.dataset.say || prompt.textContent : '')].concat(choices).join('. ');
  }
  function guideText(g) {
    if (!g) return '';
    const out = [];
    g.sections.forEach((s) => out.push(s.title + '. ' + s.text.replace(/^[-*]\s+/gm, '').replace(/^#+\s*/gm, '')));
    g.examples.forEach((e, i) => out.push('Example ' + (i + 1) + '. ' + e.problem + '. ' + e.solution.join('. ') + '. Answer: ' + e.answer));
    if (g.timeline.length) out.push('Timeline. ' + g.timeline.map((t) => t.when + ': ' + t.label).join('. '));
    g.orders.forEach((o) => out.push(o.title + '. ' + o.items.join('. ')));
    if (g.map) out.push('Concept map. ' + g.map.center + '. ' + g.map.branches.map((b) => b.label + ': ' + b.items.join(', ')).join('. '));
    return out.join('\n');
  }

  /* ---------- study sheet: everything on one page for the night before ---------- */
  function sheetView(src) {
    const d = Modes.deck(src);
    if (!d) return ui.notFound();
    const fmt = ui.fmt;
    const guides = Modes.guidesFor(src);
    const ideas = guides.map((g) => g.sections.find((x) => /key ideas/i.test(x.title))).filter(Boolean);
    const timeline = [].concat(...guides.map((g) => g.timeline));
    const checks = [].concat(...guides.map((g) => g.check));
    return `<div class="page-head no-print"><div><a href="${d.back}" class="muted small">← ${esc(d.title)}</a><h1>Study sheet</h1><p class="muted">Everything on one page${canPrint() ? ', ready to print for the night before' : ''}.</p></div>${canPrint() ? '<button class="btn primary" type="button" data-action="print">🖨️ Print</button>' : ''}</div>
      <article class="card sheet">
        <h2 class="sheet-title">${esc(d.title)}</h2>
        ${d.items.length ? `<h3>Key terms</h3><dl class="sheet-terms">${d.items.map((it) => `<div><dt>${fmt(it.front)}</dt><dd>${fmt(it.back)}</dd></div>`).join('')}</dl>` : ''}
        ${ideas.length ? `<h3>Key ideas</h3>${ideas.map((x) => ui.md(x.text)).join('')}` : ''}
        ${timeline.length ? `<h3>Timeline</h3><ol class="timeline">${timeline.slice().sort((a, b) => a.year - b.year).map((t) => `<li><b>${esc(t.when)}</b> ${fmt(t.label)}</li>`).join('')}</ol>` : ''}
        ${checks.length ? `<h3>Quick quiz (answers included)</h3><ol class="sheet-qa">${checks.map((c) => `<li><span>${fmt(c.q)}</span> <b>${fmt(c.a)}</b></li>`).join('')}</ol>` : ''}
      </article>`;
  }

  /* ---------- written answers, graded like an exam ---------- */
  let WR = null;
  function writeView(src) {
    if (!WR || WR.src !== src) {
      const d = Modes.deck(src);
      if (!d) return ui.notFound();
      const qs = Modes.writtenQuestions(src, 8);
      if (!qs.length) return `<div class="card empty"><p>There aren't any questions with longer answers here yet.</p><a class="btn" href="${d.back}">Back</a></div>`;
      WR = { src, title: d.title, back: d.back, qs, i: 0, results: [], state: 'answer', grade: null, answer: '', busy: false, error: '', ai: null };
      Store.markMode('write');
      const w = WR;
      window.MSG.AIFormat.available().then((sm) => { w.ai = !!sm; const t = document.getElementById('writeAnswer'); if (WR === w && t && w.state === 'answer') { w.answer = t.value; ui.route(); } });
    }
    const total = WR.qs.reduce((n, q) => n + q.marks, 0);
    const got = WR.results.reduce((n, r) => n + r.score, 0);
    const head = `<div class="quiz-head"><div><b>✍️ Written answers: ${esc(WR.title)}</b><div class="muted small">${WR.i < WR.qs.length ? `Question ${WR.i + 1} of ${WR.qs.length} · ` : ''}${got} of ${WR.results.reduce((n, r) => n + r.max, 0)} marks so far</div></div><a class="btn small ghost" href="${WR.back}">Stop</a></div>
      <div class="progress"><div style="width:${(100 * WR.i) / WR.qs.length}%"></div></div>`;
    if (WR.i >= WR.qs.length) {
      const pctScore = total ? Math.round((100 * got) / total) : 0;
      return `<div class="quiz">${head}<div class="card summary"><h2>Done!</h2><div class="big-score ${pctScore >= 80 ? 'good' : pctScore >= 60 ? 'ok' : 'bad'}">${got} / ${total}</div><p>marks</p>
        <div class="row center"><button class="btn primary" data-action="write-again">New questions</button><a class="btn" href="${WR.back}">Done</a></div></div>
        <div class="card"><h2>Your answers</h2><div class="card-list">${WR.results.map((r, n) => `<div class="card-row"><div class="cr-main"><div class="cr-front"><b>${n + 1}.</b> ${ui.fmt(r.q.question)} <span class="chip">${r.score}/${r.max}</span></div><div class="small">You wrote: ${esc(r.answer)}</div><div class="cr-back">Model answer: ${ui.fmt(r.q.model)}</div></div></div>`).join('')}</div></div></div>`;
    }
    const q = WR.qs[WR.i];
    let body;
    if (WR.state === 'answer') {
      body = `<form data-form="write-grade" class="stack">
        <textarea id="writeAnswer" name="answer" rows="5" placeholder="Write your answer in full sentences…" aria-label="Your answer">${esc(WR.answer)}</textarea>
        ${WR.error ? `<p class="form-error" role="alert">${esc(WR.error)}</p>` : ''}
        <div class="row"><button class="btn primary" type="submit" ${WR.busy ? 'disabled' : ''}>${WR.busy ? '⏳ Grading…' : 'Grade my answer'}</button><button class="btn ghost" type="button" data-action="write-self">Check it myself</button></div>
        <p class="small muted">${WR.ai === false ? 'AI grading isn\'t available on this website, so you\'ll compare your answer with the model answer (or paste it into any AI chat). On the claude.ai version, Claude grades it for you.' : WR.ai ? 'Claude grades it against the model answer from your study material.' : ''}</p>
      </form>`;
    } else if (WR.state === 'self') {
      body = `<div class="flash-answer"><div class="muted small">Your answer</div><div>${esc(WR.answer) || '<i>(blank)</i>'}</div></div>
        <div class="feedback"><div class="muted small">Model answer</div><div>${ui.fmt(q.model)}</div></div>
        <p><b>How many marks did you earn?</b> Give yourself one for each point in the model answer you made.</p>
        <div class="row">${Array.from({ length: q.marks + 1 }, (_, m) => `<button class="btn ${m === q.marks ? 'good' : m === 0 ? 'bad' : ''}" data-action="write-self-score" data-score="${m}">${m} / ${q.marks}</button>`).join('')}</div>
        <details class="small"><summary>Grade it with an AI chat instead</summary><p class="small">Copy this and paste it into any AI chat, then score yourself from its answer.</p><pre class="ai-prompt" id="gradePrompt">${esc(window.MSG.AIFormat.gradePrompt({ question: q.question.replace(/\*\*/g, ''), model: q.model, answer: WR.answer || '(blank)', marks: q.marks }))}</pre><button class="btn small" type="button" data-action="copy-text" data-target="gradePrompt">Copy</button></details>`;
    } else {
      const g = WR.grade;
      body = `<div class="flash-answer"><div class="muted small">Your answer</div><div>${esc(WR.answer)}</div></div>
        <div class="feedback ${g.score === q.marks ? 'good' : 'bad'}"><b class="grade-score">${g.score} / ${q.marks} mark${q.marks === 1 ? '' : 's'}</b>
          ${g.earned.length ? `<ul class="grade-list good">${g.earned.map((x) => `<li>✓ ${esc(x)}</li>`).join('')}</ul>` : ''}
          ${g.missing.length ? `<ul class="grade-list bad">${g.missing.map((x) => `<li>✗ ${esc(x)}</li>`).join('')}</ul>` : ''}
          ${g.tip ? `<div class="explain">💡 ${esc(g.tip)}</div>` : ''}
          <details><summary>Model answer</summary><div>${ui.fmt(q.model)}</div></details>
          <div class="row"><button class="btn primary" data-action="write-next" id="nextBtn">${WR.i + 1 >= WR.qs.length ? 'See results' : 'Next question →'}</button></div>
        </div>`;
    }
    return `<div class="quiz">${head}<div class="card question"><span class="chip">${q.marks} mark${q.marks === 1 ? '' : 's'}</span><div class="prompt">${ui.fmt(q.question)}</div>${speakBtn()}${body}</div></div>`;
  }
  function writeRecord(q, score) {
    const full = score === q.marks;
    Store.recordActivity(score * 2 >= q.marks);
    if (q.categoryId && !q.cardId) Store.recordCategory(q.categoryId, full);
    if (q.cardId) Store.recordCard(q.cardId, full);
    const mq = { kind: 'flash', prompt: q.question, answerDisplay: q.model, categoryId: q.categoryId || null, cardId: q.cardId || null, conceptId: q.conceptId || null };
    if (!full) Store.addMistake(mq); else if (Store.clearMistake(mq)) Store.markMode('fixed');
  }
  async function writeGrade(answer) {
    const q = WR.qs[WR.i];
    WR.answer = answer; WR.error = '';
    const AF = window.MSG.AIFormat;
    const sample = await AF.available();
    if (!sample) { WR.ai = false; WR.state = 'self'; ui.route(); return; }
    WR.busy = true; ui.route();
    try {
      const res = await sample(AF.gradePrompt({ question: q.question.replace(/\*\*/g, ''), model: q.model, answer, marks: q.marks }), {});
      const g = AF.parseGrade(res.text, q.marks);
      if (!g) throw { code: 'unreadable' };
      WR.grade = g; WR.state = 'graded';
      WR.results.push({ q, answer, score: g.score, max: q.marks });
      writeRecord(q, g.score);
    } catch (e) {
      WR.error = e && e.code === 'unreadable' ? 'The grade came back in a form the site couldn\'t read. Try again, or check it yourself.' : AF.message(e) + ' You can also check it yourself.';
      if (AF.isPermanent(e)) WR.ai = false;
    }
    WR.busy = false; ui.route();
  }

  /* ---------- a note's AI-made study guide (the note page's "Study guide" tab) ---------- */
  const NG = { ctl: null };
  function noteGuideTab(note) {
    const g = Modes.noteGuide(note);
    const stale = g && note.updatedAt > note.guideAt;
    const panel = '<div id="guidePanel" class="ai-panel" hidden></div>';
    if (g) return guideHtml(g, { src: 'note_' + note.id, title: 'Study guide (made by AI from your notes)',
      before: stale ? '<p class="small feedback bad no-print">Your notes changed after this guide was made. Make it again to include the changes.</p>' : '',
      after: `<p class="small muted">AI built this only from your notes, but it can still make mistakes. Check anything important against your notes.</p><div class="row no-print"><button class="btn small" type="button" data-action="guide-make" data-id="${note.id}">✨ Make it again</button><button class="btn small ghost" type="button" data-action="guide-remove" data-id="${note.id}">Remove guide</button></div>${panel}` });
    return `<div class="card stack"><h2>Turn these notes into a full study guide</h2>
      <p>AI reads your notes and writes a study guide like the ones for built-in topics: an overview, key ideas, a concept map, worked examples, common mistakes, timelines and a self-check quiz. It uses <b>only what's in your notes</b>.</p>
      <div class="row"><button class="btn primary" type="button" data-action="guide-make" data-id="${note.id}">✨ Make a study guide with AI</button></div>
      <p class="small muted">On claude.ai, Claude writes it using your own Claude account (it asks your permission the first time). Elsewhere you'll get a prompt to paste into any AI chat.</p>
      ${panel}</div>`;
  }
  function guidePanel(html) { const p = document.getElementById('guidePanel'); if (p) { p.hidden = !html; p.innerHTML = html || ''; } return p; }
  function saveNoteGuide(id, text) {
    const AF = window.MSG.AIFormat;
    const clean = AF.cleanGuide(text);
    const g = clean && Guides.parseOne('note_' + id, clean);
    if (!g || !g.sections.length) { guidePanel(`<p class="small">That doesn't look like a study guide. It should start with "## Overview". Try again.</p><div class="row"><button class="btn small" type="button" data-action="guide-dismiss">Close</button></div>`); return false; }
    Store.setNoteGuide(id, clean); Store.markMode('guide');
    ui.toast('Study guide ready ✨'); ui.route(); return true;
  }

  Object.assign(actions, {
    'write-self': (el) => { const f = el.closest('form'); WR.answer = f ? f.answer.value : WR.answer; WR.state = 'self'; ui.route(); },
    'write-self-score': (el) => { const q = WR.qs[WR.i]; const score = Number(el.dataset.score); WR.results.push({ q, answer: WR.answer, score, max: q.marks }); writeRecord(q, score); actions['write-next'](); },
    'write-next': () => { WR.i += 1; WR.state = 'answer'; WR.grade = null; WR.answer = ''; WR.error = ''; ui.route(); root.scrollTo(0, 0); },
    'write-again': () => { WR = null; ui.route(); },
    'guide-make': async (el) => {
      const note = Store.note(el.dataset.id);
      if (!note || !note.content.trim()) { ui.toast('These notes are empty.'); return; }
      const AF = window.MSG.AIFormat;
      if (note.content.length > AF.MAX_CHARS) { guidePanel('<p class="small">These notes are too long to turn into one guide. Split them into smaller sets of notes first.</p>'); return; }
      const prompt = AF.guidePrompt(note.content, note.title);
      const sample = await AF.available();
      if (!sample) {
        guidePanel(`<p class="small"><b>Use any AI chat:</b> copy this prompt (your notes are included), paste it into ChatGPT, Claude or another AI, then paste its answer below.</p><pre class="ai-prompt" id="guidePrompt">${esc(prompt)}</pre><div class="row"><button class="btn small" type="button" data-action="copy-text" data-target="guidePrompt">Copy prompt</button></div>
          <textarea id="guidePaste" rows="6" placeholder="Paste the AI's study guide here"></textarea><div class="row"><button class="btn small primary" type="button" data-action="guide-use-pasted" data-id="${note.id}">Use this guide</button><button class="btn small ghost" type="button" data-action="guide-dismiss">Cancel</button></div>`);
        return;
      }
      if (NG.ctl) NG.ctl.abort();
      const ctl = NG.ctl = new AbortController();
      guidePanel(`<div class="ai-head"><b>✨ Writing your study guide…</b><button class="btn small ghost" type="button" data-action="guide-stop">Stop</button></div><pre class="ai-out" id="guideOut">Reading your notes… (the first time, claude.ai asks you to allow this.)</pre>`);
      try {
        const res = await sample(prompt, { signal: ctl.signal, onText: ({ text }) => { const o = document.getElementById('guideOut'); if (o) o.textContent = text; } });
        if (NG.ctl !== ctl) return;
        NG.ctl = null;
        saveNoteGuide(note.id, res.text);
        if (res.truncated) ui.toast('The guide was cut short. Try splitting your notes into smaller sets.');
      } catch (e) {
        if (NG.ctl === ctl) NG.ctl = null;
        if (e && e.code === 'cancelled') { guidePanel(''); return; }
        guidePanel(`<p class="small">${esc(AF.message(e))}</p><div class="row"><button class="btn small" type="button" data-action="guide-make" data-id="${note.id}">Try again</button><button class="btn small ghost" type="button" data-action="guide-dismiss">Close</button></div>`);
      }
    },
    'guide-stop': () => { if (NG.ctl) NG.ctl.abort(); },
    'guide-dismiss': () => { if (NG.ctl) NG.ctl.abort(); guidePanel(''); },
    'guide-use-pasted': (el) => { const t = document.getElementById('guidePaste').value; if (!t.trim()) { ui.toast('Paste the AI\'s answer first.'); return; } saveNoteGuide(el.dataset.id, t); },
    'guide-remove': async (el) => { if (await ui.ask('Remove this study guide? Your notes and cards stay.', 'Remove guide')) { Store.setNoteGuide(el.dataset.id, null); ui.route(); } }
  });
  Object.assign(forms, {
    'write-grade': (f) => { const v = f.answer.value.trim(); if (!v) { ui.toast('Write your answer first.'); f.answer.focus(); return; } writeGrade(v); }
  });

  function onKey(e) {
    const h = location.hash;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (h.startsWith('#flashcards--') && FC && !FC.done) {
      const card = document.querySelector('.flashcard');
      if (!card) return;
      if (e.key === ' ' || e.key === 'Enter') { if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('flashcard')) return; e.preventDefault(); actions['fc-flip'](card); }
      else if (e.key === 'ArrowRight') actions['fc-next']();
      else if (e.key === 'ArrowLeft' && FC.i) actions['fc-prev']();
      else if (e.key === '1' || e.key === '2') actions['fc-sort']({ dataset: { ok: e.key === '2' ? '1' : '0' } });
    } else if (h.startsWith('#learn--') && LN && LN.st.q) {
      if (LN.answered && e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); learnNext(); }
      else if (!LN.answered && LN.st.q.kind === 'mc' && /^[1-4]$/.test(e.key)) { const i = Number(e.key) - 1; if (i < LN.st.q.choices.length) learnAnswered(i === LN.st.q.correct, i); }
    }
  }

  function init(helpers) {
    ui = helpers;
    root.addEventListener('keydown', onKey);
    // Printing: show the self-check answers, which are hidden inside closed <details>.
    let opened = [];
    root.addEventListener('beforeprint', () => { opened = Array.from(document.querySelectorAll('details.check-q:not([open])')); opened.forEach((d) => { d.open = true; }); });
    root.addEventListener('afterprint', () => { opened.forEach((d) => { d.open = false; }); opened = []; });
    setInterval(() => { const t = document.getElementById('matchTime'); if (t && MT && !MT.end) t.textContent = fmtTime(Math.round((Date.now() - MT.start) / 1000)); }, 1000);
    return {
      views: {
        flashcards: flashcardsView, learn: learnView, match: matchView, order: orderView, test: testSetup, mistakes: mistakesView, progress: progressView, sheet: sheetView, write: writeView,
        truefalse: (src) => { const d = Modes.deck(src); return d ? `<div class="card empty"><p>✅ True or false: ${esc(d.title)}</p><div class="row center"><button class="btn primary" data-action="start-tf" data-src="${esc(src)}">Start</button><a class="btn" href="${d.back}">Back</a></div></div>` : ui.notFound(); }
      },
      actions, forms
    };
  }

  root.MSG.Study = { init, modesPanel, guideHtml, printBtn, noteGuideTab, speakable, record, debug: () => ({ FC, LN, MT, OR }) /* read by the browser tests */ };
})(typeof window !== 'undefined' ? window : globalThis);

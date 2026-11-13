/* UI: hash-router views for profiles, dashboard, notes, quizzes, test prep, categories and settings. */
(function () {
  'use strict';
  const { U, Store, Library, Generators, Quiz, parseNotes } = window.MSG;
  const $app = document.getElementById('app');
  const esc = U.esc;
  let session = null; // active quiz

  /* ---------- formatting ---------- */
  // A dollar amount ("$5", "$1,200.50") is shown as plain text, not as the start of a math formula:
  // putting its "$" in its own element keeps the math renderer from pairing it with another "$".
  const money = (html) => html.replace(/\$(?=\d[\d,]*(?:\.\d+)?(?![\d.,]*[A-Za-z^_\\{=+*\/$-]))/g, '<span class="cur">$</span>');
  const fmt = (s) => money(esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'));
  function md(text) {
    const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    const inline = (s) => money(esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>'));
    let html = '', list = null, table = [];
    const flushList = () => { if (list) { html += '</' + list + '>'; list = null; } };
    const flushTable = () => {
      if (!table.length) return;
      const rows = table.filter((r) => !/^[|\s:\-]+$/.test(r)).map((r) => r.replace(/^\||\|$/g, '').split('|'));
      html += '<div class="table-wrap"><table>' + rows.map((r, i) => '<tr>' + r.map((c) => (i ? '<td>' : '<th>') + inline(c.trim()) + (i ? '</td>' : '</th>')).join('') + '</tr>').join('') + '</table></div>';
      table = [];
    };
    lines.forEach((raw) => {
      const line = raw.trim();
      if (line.startsWith('|')) { flushList(); table.push(line); return; }
      flushTable();
      let m;
      if (!line) { flushList(); return; }
      if ((m = line.match(/^(#{1,6})\s+(.*)$/))) { flushList(); const lv = Math.min(6, m[1].length + 2); html += `<h${lv}>${inline(m[2])}</h${lv}>`; return; }
      if ((m = line.match(/^(?:[-*+•]\s+)(.*)$/))) { if (list !== 'ul') { flushList(); html += '<ul>'; list = 'ul'; } html += '<li>' + inline(m[1]) + '</li>'; return; }
      if ((m = line.match(/^\d+[.)]\s+(.*)$/))) { if (list !== 'ol') { flushList(); html += '<ol>'; list = 'ol'; } html += '<li>' + inline(m[1]) + '</li>'; return; }
      if (/^(-{3,}|\*{3,})$/.test(line)) { flushList(); html += '<hr>'; return; }
      flushList();
      html += '<p>' + inline(line) + '</p>';
    });
    flushList(); flushTable();
    return html;
  }
  function renderMath(el) {
    if (!window.renderMathInElement) return;
    try {
      window.renderMathInElement(el || $app, {
        delimiters: [
          { left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false }
        ],
        throwOnError: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input']
      });
    } catch (e) { /* leave raw text */ }
  }
  window.MSG.rerenderMath = () => renderMath($app);
  // KaTeX loads with `defer`; render once it is there (the security policy forbids an inline onload attribute).
  window.addEventListener('load', () => renderMath($app));
  window.MSG.route = () => route();
  window.MSG.quizState = () => session; // read by the browser tests

  const countdown = (n) => (n === 0 ? 'Today!' : n === 1 ? 'Tomorrow' : 'in ' + n + ' days');
  const pct = (r, t) => (t ? Math.round((100 * r) / t) : null);
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
  }
  /* In-page confirmation dialog. Browser confirm()/alert() are not shown inside a claude.ai artifact. */
  function ask(message, okLabel, opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      const wrap = document.createElement('div');
      wrap.className = 'modal-backdrop';
      wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="askMsg"><p id="askMsg">${esc(message)}</p><div class="row"><button class="btn ${opts.primary ? 'primary' : 'danger-solid'}" type="button" data-ok>${esc(okLabel || 'Delete')}</button><button class="btn" type="button" data-cancel>${esc(opts.cancel || 'Cancel')}</button></div></div>`;
      const done = (v) => { wrap.remove(); document.removeEventListener('keydown', onKey, true); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
      wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('[data-cancel]')) done(false); else if (e.target.closest('[data-ok]')) done(true); });
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(wrap);
      wrap.querySelector('[data-cancel]').focus();
    });
  }
  async function saveFile(filename, text) {
    // Inside claude.ai the page must ask through the "downloads" capability; elsewhere a normal download link works.
    if (window.claude && window.claude.use) {
      const dl = await window.claude.use('downloads');
      if (dl) {
        try { await dl.save({ filename, data: new Blob([text], { type: 'application/json' }) }); return true; } catch (e) { return false; }
      }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    return true;
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function mastery(cards) {
    if (!cards.length) return 0;
    return Math.round(100 * cards.reduce((s, c) => s + Math.min(1, c.srs.interval / 7), 0) / cards.length);
  }

  /* ---------- views ---------- */
  function authView() {
    const A = window.MSG.Accounts;
    if (window.MSG.Sync && window.MSG.Sync.loading) return '<div class="card empty"><p>Loading…</p><p class="muted">Getting your notes ready.</p></div>';
    if (A.error) return `<div class="card empty"><p>⚠️ ${esc(A.error)}</p></div>`;
    if (!A.ready || A.user) return '<div class="card empty"><p>Loading…</p><p class="muted">Getting your notes ready.</p></div>';
    const tab = sessionStorageGet('authTab') || 'login';
    const tabs = `<div class="tabs"><button class="tab ${tab === 'login' ? 'active' : ''}" data-action="auth-tab" data-tab="login">Log in</button><button class="tab ${tab === 'signup' ? 'active' : ''}" data-action="auth-tab" data-tab="signup">Create account</button></div>`;
    const err = '<p class="form-error" role="alert" hidden></p>';
    let form;
    if (tab === 'signup') {
      form = `<form class="stack" data-form="signup">
        <label>Your name<input id="su-name" name="name" required maxlength="40" placeholder="First name or nickname" autocomplete="nickname"></label>
        <label>Email<input id="su-email" name="email" type="email" required autocomplete="email"></label>
        <label>Password<input id="su-pass" name="password" type="password" required minlength="6" autocomplete="new-password" placeholder="At least 6 characters"></label>
        ${err}<button class="btn primary" type="submit">Create account</button></form>`;
    } else if (tab === 'reset') {
      form = `<form class="stack" data-form="reset">
        <p class="small">Enter your email and we'll send you a link to choose a new password.</p>
        <label>Email<input id="rs-email" name="email" type="email" required autocomplete="email"></label>
        ${err}<button class="btn primary" type="submit">Send reset link</button>
        <button class="btn ghost" type="button" data-action="auth-tab" data-tab="login">Back to log in</button></form>`;
    } else {
      form = `<form class="stack" data-form="login">
        <label>Email<input id="li-email" name="email" type="email" required autocomplete="email"></label>
        <label>Password<input id="li-pass" name="password" type="password" required autocomplete="current-password"></label>
        ${err}<button class="btn primary" type="submit">Log in</button>
        <button class="btn ghost small" type="button" data-action="auth-tab" data-tab="reset">Forgot your password?</button></form>`;
    }
    return `
      <section class="hero">
        <h1>Turn your notes into quizzes.</h1>
        <p class="lead">Paste notes from class, a study guide, or any AI chat. We turn them into study cards, quiz you over time, and help you cram before a test. Make a free account and everything you add is saved, on any device.</p>
      </section>
      <div class="auth card">${tabs}${form}</div>`;
  }

  const subjSlug = (name) => String(name || '').toLowerCase().replace(/&/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  function welcome() {
    const profiles = Store.profiles();
    const groups = Library.groups();
    return `
      <section class="landing">
        <div>
          <p class="eyebrow">Free · Any subject · Elementary to AP &amp; IB</p>
          <h1>Turn your notes into <mark>quizzes that stick.</mark></h1>
          <p class="lead">Paste notes from class, a study guide or any AI chat. We turn them into flashcards and quizzes, bring cards back right before you'd forget them, and get you ready for tomorrow's test.</p>
          <form data-form="create-profile" class="start-form">
            <input id="startName" name="name" required maxlength="40" placeholder="Your first name or nickname" autocomplete="off" aria-label="Your name">
            <button class="btn primary" type="submit">Start studying</button>
          </form>
          <p class="muted small">No sign-up form. Have a backup file? <label class="link-like">Import it<input type="file" accept=".json,application/json" data-change="import-backup" hidden></label></p>
          ${profiles.length ? `<div class="stack" style="margin-top:1.2rem;max-width:30rem"><p class="eyebrow" style="margin:0">Or continue as</p>${profiles.map((p) => `<button class="btn profile-btn ${Store.current() && Store.current().id === p.id ? 'active' : ''}" data-action="pick-profile" data-id="${p.id}"><span class="avatar">${esc(p.name[0] || '?').toUpperCase()}</span><span>${esc(p.name)}<small>${plural(p.notes.length, 'note')} · ${plural(p.cards.length, 'card')}</small></span></button>`).join('')}</div>` : ''}
        </div>
        <div class="desk" aria-hidden="true">
          <div class="index-card under"><span class="ic-label">Biology · Cells</span><span class="ic-q">Mitochondria</span><span class="ic-a">Makes energy for the cell</span></div>
          <div class="index-card top"><span class="ic-label">Derivatives · AP Calculus</span><span class="ic-q">What is the derivative of \\(x^3\\)?</span><span class="ic-a">\\(3x^2\\)</span></div>
        </div>
      </section>
      <ol class="how">
        <li><b>Add your notes</b><span>Paste or upload them. Messy is fine, and AI can tidy them up if you want.</span></li>
        <li><b>We build the cards</b><span>Terms, questions, dates and formulas become flashcards and quiz questions.</span></li>
        <li><b>Study six ways</b><span>Flashcards, learn mode, matching, true/false, practice tests and timelines. Missed cards come back sooner.</span></li>
      </ol>
      <div class="section-title"><h2>No notes? Start with a built-in topic</h2><span class="muted small">${Library.categories.length} topics with study guides and endless practice</span></div>
      <div class="subject-strip">${groups.map((g) => `<div class="subject-tile" data-subject="${subjSlug(g.subject)}"><span class="cat-icon">${g.icon}</span><span><b>${esc(g.subject)}</b><small>${plural(g.levels.reduce((n, l) => n + l.cats.length, 0), 'topic')}</small></span></div>`).join('')}</div>`;
  }

  function dashboard() {
    const p = Store.current();
    const st = Store.stats();
    const exams = Store.upcomingExams();
    const hour = new Date().getHours();
    const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const topicStats = {};
    p.cards.forEach((c) => {
      const k = c.topic || 'General';
      const t = topicStats[k] || (topicStats[k] = { right: 0, wrong: 0, kind: 'topic' });
      t.right += c.stats.right; t.wrong += c.stats.wrong;
    });
    Object.entries(p.catStats).forEach(([id, s]) => { const c = Library.get(id); if (c) topicStats[c.name] = { right: s.right, wrong: s.wrong, kind: 'cat', id }; });
    const weak = Object.entries(topicStats).filter(([, s]) => s.right + s.wrong >= 3).map(([k, s]) => [k, s, s.right / (s.right + s.wrong)]).sort((a, b) => a[2] - b[2]).filter((x) => x[2] < 0.85).slice(0, 4);

    return `
      <div class="page-head">
        <div><h1>${hello}, ${esc(p.name)} 👋</h1><p class="muted">${st.streak ? `🔥 ${plural(st.streak, 'day')} study streak, keep it going!` : 'Study a little every day to build a streak.'}</p></div>
        <a class="btn primary" href="#notes-new">+ Add notes</a>
      </div>
      <div class="stats">
        <div class="stat"><span>${st.due}</span>cards due</div>
        <div class="stat"><span>${st.cards}</span>study cards</div>
        <div class="stat"><span>${st.accuracy == null ? '—' : st.accuracy + '%'}</span>accuracy</div>
        <div class="stat"><span>${st.mastered}</span>mastered</div>
      </div>
      <div class="grid two">
        <div class="card highlight">
          <h2>Daily review</h2>
          ${st.cards === 0 ? `<p>You don't have any study cards yet. Add your notes and we'll build them for you, or pick a topic from the study categories.</p>
            <div class="row"><a class="btn primary" href="#notes-new">Add my notes</a><a class="btn" href="#categories">Browse categories</a></div>`
          : st.due > 0 ? `<p>You have <b>${plural(st.due, 'card')}</b> ready for review. Cards you miss come back sooner, and cards you know come back later.</p>
            <div class="row"><button class="btn primary" data-action="start-review">Start review (${Math.min(st.due, p.settings.dailyLimit)})</button><button class="btn" data-action="start-weak">Practice weakest</button></div>`
          : `<p>✅ You're all caught up! Your next cards are due ${nextDueText()}.</p>
            <div class="row"><button class="btn primary" data-action="start-weak">Practice my weakest cards</button></div>`}
        </div>
        <div class="card">
          <h2>Upcoming tests & quizzes</h2>
          ${exams.length ? `<ul class="list">${exams.slice(0, 4).map((e) => { const n = U.daysUntil(e.date); return `<li><div><b>${esc(e.title)}</b> <span class="badge ${n <= 1 ? 'hot' : ''}">${countdown(n)}</span></div><div class="row tight"><button class="btn small primary" data-action="exam-quiz" data-id="${e.id}" data-mode="${n <= 1 ? 'cram' : 'quick'}">${n <= 1 ? 'Cram now' : 'Quick quiz'}</button></div></li>`; }).join('')}</ul>`
          : `<p class="muted">Got a quiz or test coming up? Add it and we'll build a practice test from your notes.</p>`}
          <a class="btn" href="#exams">+ Add a test date</a>
        </div>
      </div>
      <div class="grid three">
        <a class="card cat-card" href="#mistakes"><span class="cat-icon">📕</span><span><b>Mistake notebook</b><span class="muted small">${Store.mistakes().length ? plural(Store.mistakes().length, 'question') + ' to fix' : 'Empty. Nice!'}</span></span></a>
        <a class="card cat-card" href="#progress"><span class="cat-icon">🏆</span><span><b>Progress & badges</b><span class="muted small">${window.MSG.Modes.badges().filter((b) => b.got).length} badges earned${st.streak ? ' · 🔥 ' + plural(st.streak, 'day') : ''}</span></span></a>
        ${Object.keys(Store.starred()).length ? `<a class="card cat-card" href="#flashcards--starred"><span class="cat-icon">⭐</span><span><b>Starred cards</b><span class="muted small">${plural(Object.keys(Store.starred()).length, 'card')} as flashcards</span></span></a>` : (st.cards ? `<a class="card cat-card" href="#flashcards--deck"><span class="cat-icon">🃏</span><span><b>All my cards</b><span class="muted small">Study ${plural(st.cards, 'card')} as flashcards</span></span></a>` : `<a class="card cat-card" href="#categories"><span class="cat-icon">📚</span><span><b>Study guides</b><span class="muted small">Guides and practice for ${Library.categories.length} topics</span></span></a>`)}
      </div>
      ${weak.length ? `<div class="card"><h2>Weak spots to work on</h2><ul class="list">${weak.map(([k, s, r]) => `<li><div><b>${esc(k)}</b> <span class="muted small">${Math.round(r * 100)}% correct (${s.right}/${s.right + s.wrong})</span></div>${s.kind === 'cat' ? `<a class="btn small" href="#category--${s.id}">Practice</a>` : `<button class="btn small" data-action="start-topic" data-topic="${esc(k)}">Practice</button>`}</li>`).join('')}</ul></div>` : ''}
      <div class="grid two">
        <div class="card">
          <h2>Recent notes</h2>
          ${p.notes.length ? `<ul class="list">${p.notes.slice(0, 4).map((n) => `<li><a href="#note--${n.id}"><b>${esc(n.title)}</b></a><span class="muted small">${plural(Store.cardsForNote(n.id).length, 'card')}</span></li>`).join('')}</ul><a href="#notes">All notes →</a>` : '<p class="muted">No notes yet.</p>'}
        </div>
        <div class="card">
          <h2>Recent quizzes</h2>
          ${p.sessions.length ? `<ul class="list">${p.sessions.slice(0, 5).map((s) => `<li><span>${esc(s.title)}</span><span class="score ${pct(s.right, s.total) >= 80 ? 'good' : pct(s.right, s.total) >= 60 ? 'ok' : 'bad'}">${s.right}/${s.total}</span></li>`).join('')}</ul>` : '<p class="muted">Your quiz results will show up here.</p>'}
        </div>
      </div>`;
  }
  function nextDueText() {
    const cards = Store.current().cards;
    if (!cards.length) return 'soon';
    const next = Math.min(...cards.map((c) => c.srs.due));
    const mins = Math.round((next - Date.now()) / 60000);
    if (mins < 60) return 'in ' + plural(Math.max(1, mins), 'minute');
    if (mins < 1440) return 'in ' + plural(Math.round(mins / 60), 'hour');
    return 'in ' + plural(Math.round(mins / 1440), 'day');
  }

  function notesList() {
    const p = Store.current();
    return `
      <div class="page-head"><div><h1>My Notes</h1><p class="muted">Every set of notes becomes study cards you can be quizzed on.</p></div><a class="btn primary" href="#notes-new">+ Add notes</a></div>
      ${p.notes.length ? `<div class="grid three">${p.notes.map((n) => {
        const cards = Store.cardsForNote(n.id);
        const cat = Library.get(n.categoryId);
        return `<div class="card note-card">
          <a href="#note--${n.id}" class="note-title">${esc(n.title)}</a>
          <div class="muted small">${esc(n.course || (cat ? cat.name : ''))} ${n.course || cat ? '·' : ''} ${new Date(n.updatedAt).toLocaleDateString()}</div>
          <div class="meter"><div style="width:${mastery(cards)}%"></div></div>
          <div class="muted small">${plural(cards.length, 'card')} · ${mastery(cards)}% mastered</div>
          <div class="row tight"><button class="btn small primary" data-action="quiz-note" data-id="${n.id}" ${cards.length ? '' : 'disabled'}>Quiz me</button><a class="btn small" href="#note--${n.id}">Open</a></div>
        </div>`; }).join('')}</div>`
      : `<div class="card empty"><p>📄 No notes yet.</p><p class="muted">Paste in notes from class, a study guide, or an AI chat and we'll turn them into quizzes.</p><a class="btn primary" href="#notes-new">Add my first notes</a></div>`}`;
  }

  const AI_PROMPT = `Turn my study guide into study notes I can paste into a quiz website. Use exactly this format:

## Topic name
- Term: definition
- Formula or rule name: the formula or rule (for math, write it in LaTeX, like $x^2$ or $\\frac{a}{b}$)

Q: a practice question
A: the answer

Example: a practice problem
Solution: the steps
Answer: the final answer

Include every key vocabulary word, every formula, and at least 10 practice questions with short answers.`;

  function categoryOptions(selected) {
    return '<option value="">— none —</option>' + Library.groups().map((g) => g.levels.map((l) => `<optgroup label="${esc(g.subject === l.level ? g.subject : g.subject + ': ' + l.level)}">${l.cats.map((c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</optgroup>`).join('')).join('');
  }

  function noteEditor(id) {
    const n = id ? Store.note(id) : null;
    const aiOn = Store.current().settings.aiFormat === 'on'; // the student's choice; off unless they pick AI
    if (id && !n) return notFound();
    return `
      <div class="page-head"><div><h1>${n ? 'Edit notes' : 'Add notes'}</h1><p class="muted">Paste notes from anywhere, or upload a .txt / .md file. Works for any subject. Math in LaTeX ($x^2$) is supported.</p></div></div>
      <div class="grid editor">
        <form class="card stack" data-form="save-note" data-id="${n ? n.id : ''}">
          <div class="grid two tight">
            <label>Title<input name="title" required maxlength="100" value="${n ? esc(n.title) : ''}" placeholder="e.g. Unit 3: The Cell"></label>
            <label>Class (optional)<input name="course" maxlength="60" value="${n ? esc(n.course) : ''}" placeholder="e.g. Biology, AP U.S. History, Spanish 2"></label>
          </div>
          <label>Subject topic (optional; adds practice questions to your quizzes)<select name="categoryId">${categoryOptions(n ? n.categoryId : '')}</select></label>
          <fieldset class="seg ai-choice"><legend>How do you want to add your notes?</legend>
            <label><input type="radio" name="aiMode" value="off" data-change="ai-mode" ${aiOn ? '' : 'checked'}><span>📝 Keep my notes as I wrote them</span></label>
            <label><input type="radio" name="aiMode" value="on" data-change="ai-mode" ${aiOn ? 'checked' : ''}><span>✨ Let AI format my notes</span></label>
          </fieldset>
          <label>Your notes
            <textarea name="content" rows="18" required data-input="preview-notes" placeholder="Paste your notes here...&#10;&#10;## The Cell&#10;- Mitochondria: releases energy from food for the cell&#10;- Osmosis: the diffusion of water across a membrane&#10;&#10;Q: What does the nucleus do?&#10;A: Controls the cell and holds its DNA">${n ? esc(n.content) : ''}</textarea>
          </label>
          <div class="row">
            <label class="btn">📎 Upload .txt / .md<input type="file" accept=".txt,.md,.markdown,text/plain,text/markdown" data-change="load-file" hidden></label>
            <button class="btn" type="button" data-action="ai-format" data-ai-only ${aiOn ? '' : 'hidden'}>✨ Format with AI</button>
            <span class="muted small" id="parseCount"></span>
          </div>
          <p class="muted small" data-ai-only ${aiOn ? '' : 'hidden'}>AI will tidy your notes into the format that makes the best quiz questions. It keeps your facts and words, and you choose which version to keep.</p>
          <div id="aiPanel" class="ai-panel" hidden></div>
          <div id="parsePreview" class="preview"></div>
          <div class="row"><button class="btn primary" type="submit">${n ? 'Save changes' : 'Save notes & build quiz'}</button><a class="btn" href="${n ? '#note--' + n.id : '#notes'}">Cancel</a></div>
        </form>
        <aside class="card tips">
          <h3>Tips for the best quizzes</h3>
          <p class="small">We understand most notes, but these patterns work best:</p>
          <ul class="small">
            <li><code>## Topic</code> headings group your cards</li>
            <li><code>Term: definition</code> → vocab question</li>
            <li><code>Formula name: formula</code> → formula question</li>
            <li><code>Q: ...</code> then <code>A: ...</code> → practice question</li>
            <li><code>Example: ...</code> then <code>Solution/Answer: ...</code> → worked problem</li>
            <li><code>**bold**</code> words in sentences → fill in the blank</li>
            <li><code>front :: back</code> → your own flashcard</li>
            <li><code>The {{chain rule}} is ...</code> → you choose the blank</li>
          </ul>
          <h3>Using ChatGPT, Claude, or another AI?</h3>
          <p class="small">Give it your study guide along with this prompt, then paste its answer here:</p>
          <pre class="ai-prompt" id="aiPrompt">${esc(AI_PROMPT)}</pre>
          <button class="btn small" type="button" data-action="copy-prompt">Copy prompt</button>
        </aside>
      </div>`;
  }

  /* ---------- Format with AI (js/ai-format.js) ---------- */
  const AI = { ctl: null, result: '', original: null, appliedText: null };
  function aiPanel(html) { const p = document.getElementById('aiPanel'); if (!p) return null; p.hidden = !html; p.innerHTML = html || ''; return p; }
  function aiCompare(form) {
    const mine = form.content.value, theirs = AI.result;
    const n1 = parseNotes(mine, { title: form.title.value }).length, n2 = parseNotes(theirs, { title: form.title.value }).length;
    aiPanel(`<div class="ai-head"><b>✨ Compare and choose</b></div>
      <div class="ai-compare">
        <div><h4>Your notes</h4><pre class="ai-out">${esc(mine)}</pre><p class="small"><b>${plural(n1, 'study card')}</b></p></div>
        <div><h4>Formatted by AI</h4><pre class="ai-out">${esc(theirs)}</pre><p class="small"><b>${plural(n2, 'study card')}</b>${n2 > n1 ? ' · more cards from the same notes' : ''}</p></div>
      </div>
      <p class="small muted">Check the formatted version: AI can make mistakes. It was told to keep your facts and add nothing new.</p>
      <div class="row"><button class="btn primary" type="button" data-action="ai-use">Use formatted version</button><button class="btn" type="button" data-action="ai-dismiss">Keep mine</button><button class="btn ghost" type="button" data-action="ai-format" data-again="1">Try again</button></div>`);
  }
  function aiFallback(form, note) {
    const promptText = window.MSG.AIFormat.prompt(form.content.value.trim());
    aiPanel(`<div class="ai-head"><b>✨ Format with any AI chat</b><button class="btn small ghost" type="button" data-action="ai-dismiss">Close</button></div>
      ${note ? `<p class="small">${esc(note)}</p>` : '<p class="small">This version of the site can\'t call an AI itself, but any AI chat can do it in three steps:</p>'}
      <ol class="small steps-list"><li>Copy this prompt. It already includes your notes.</li><li>Paste it into ChatGPT, Claude or any AI chat and send it.</li><li>Paste the AI's answer in the box below and click <b>Use this version</b>.</li></ol>
      <pre class="ai-prompt" id="aiFullPrompt">${esc(promptText)}</pre>
      <div class="row"><button class="btn small primary" type="button" data-action="copy-text" data-target="aiFullPrompt">Copy prompt with my notes</button></div>
      <label for="aiPaste">The AI's formatted notes</label>
      <textarea id="aiPaste" rows="8" placeholder="Paste the AI's answer here"></textarea>
      <div class="row"><button class="btn primary" type="button" data-action="ai-use-pasted">Use this version</button></div>`);
  }
  function aiApply(form) {
    AI.original = form.content.value;
    form.content.value = AI.result;
    AI.appliedText = AI.result;
    previewNotes(form.content);
    aiPanel(`<div class="ai-head"><b>✓ Using the formatted version</b></div><p class="small">Review it above, then save. Changed your mind?</p><div class="row"><button class="btn small" type="button" data-action="ai-undo">Undo: bring back my notes</button></div>`);
    toast('Formatted notes added. Review them, then save.');
  }

  function previewNotes(textarea) {
    const form = textarea.closest('form');
    const cards = parseNotes(textarea.value, { title: form.title.value });
    const count = document.getElementById('parseCount');
    const prev = document.getElementById('parsePreview');
    if (!count) return;
    count.textContent = textarea.value.trim() ? (cards.length ? `✨ Found ${plural(cards.length, 'study card')}` : 'No cards found yet. Try "Term: definition" lines or Q:/A: pairs.') : '';
    prev.innerHTML = cards.slice(0, 6).map((c) => `<div class="mini-card"><div>${fmt(c.front)}</div><div class="muted">${fmt(c.back)}</div></div>`).join('') + (cards.length > 6 ? `<div class="muted small">…and ${cards.length - 6} more</div>` : '');
    renderMath(prev);
  }

  function noteView(id) {
    const n = Store.note(id);
    if (!n) return notFound();
    const cards = Store.cardsForNote(id);
    const cat = Library.get(n.categoryId);
    const tab = sessionStorageGet('noteTab') || 'cards';
    return `
      <div class="page-head">
        <div><a href="#notes" class="muted small">← My Notes</a><h1>${esc(n.title)}</h1>
        <p class="muted">${[n.course ? esc(n.course) : '', cat ? `<a href="#category--${cat.id}">${esc(cat.name)}</a>` : '', plural(cards.length, 'study card'), mastery(cards) + '% mastered'].filter(Boolean).join(' · ')}</p></div>
        <div class="row tight"><button class="btn primary" data-action="quiz-note" data-id="${n.id}" ${cards.length ? '' : 'disabled'}>Quiz me on this</button><a class="btn" href="#note-edit--${n.id}">Edit</a><button class="btn danger" data-action="delete-note" data-id="${n.id}">Delete</button></div>
      </div>
      ${cards.length ? window.MSG.Study.modesPanel('note_' + n.id) : ''}
      <div class="tabs"><button class="tab ${tab === 'cards' ? 'active' : ''}" data-action="note-tab" data-tab="cards">Study cards (${cards.length})</button><button class="tab ${tab === 'notes' ? 'active' : ''}" data-action="note-tab" data-tab="notes">My notes</button></div>
      ${tab === 'notes' ? `<div class="card notes-body">${md(n.content)}</div>` : `
        <div class="card">
          ${cards.length ? '' : '<p class="muted">We couldn\'t find study cards in these notes. Edit them using the tips (like "Term: definition"), or add cards yourself below.</p>'}
          <div class="card-list">${cards.map(cardRow).join('')}</div>
          <form class="add-card" data-form="add-card" data-id="${n.id}">
            <h3>Add your own card</h3>
            <div class="grid two tight"><label>Question / front<textarea name="front" rows="2" required></textarea></label><label>Answer / back<textarea name="back" rows="2" required></textarea></label></div>
            <button class="btn" type="submit">Add card</button>
          </form>
        </div>`}`;
  }
  function cardRow(c) {
    const tot = c.stats.right + c.stats.wrong;
    return `<div class="card-row" data-card="${c.id}">
      <div class="cr-main"><div class="cr-front">${fmt(c.front)}</div><div class="cr-back">${fmt(c.back)}</div>
      <div class="muted small">${esc(c.topic || '')}${tot ? ` · ${c.stats.right}/${tot} correct` : ' · not studied yet'}${c.srs.interval >= 7 ? ' · ⭐ mastered' : ''}</div></div>
      <div class="cr-actions"><button class="icon-btn" title="${Store.isStarred(c.id) ? 'Unstar' : 'Star'}" data-action="star-card" data-id="${c.id}">${Store.isStarred(c.id) ? '⭐' : '☆'}</button><button class="icon-btn" title="Edit" data-action="edit-card" data-id="${c.id}">✏️</button><button class="icon-btn" title="Delete" data-action="delete-card" data-id="${c.id}">🗑️</button></div>
    </div>`;
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  function examsView() {
    const p = Store.current();
    const upcoming = Store.upcomingExams();
    const past = p.exams.filter((e) => U.daysUntil(e.date) < 0);
    const tomorrow = U.dateKey(Date.now() + 86400000);
    let preset = null; // from a course page's "Plan a test for this course"
    try { preset = JSON.parse(sessionStorageGet('examPreset') || 'null'); } catch (e) { preset = null; }
    if (preset) sessionStorageSet('examPreset', '');
    const presetCats = preset ? preset.cats : [];
    return `
      <div class="page-head"><div><h1>Test Prep</h1><p class="muted">Add your quiz or test date. We'll quiz you on the right notes and focus on what you miss.</p></div></div>
      <div class="grid editor">
        <div class="stack">
          ${upcoming.length ? upcoming.map(examCard).join('') : '<div class="card empty"><p>📆 No upcoming tests.</p><p class="muted">Add one, even if it\'s tomorrow. Cram mode will drill you until you get everything right.</p></div>'}
          ${past.length ? `<details class="card"><summary>Past tests (${past.length})</summary><ul class="list">${past.map((e) => `<li><span>${esc(e.title)} <span class="muted small">${e.date}</span></span><button class="btn small" data-action="delete-exam" data-id="${e.id}">Remove</button></li>`).join('')}</ul></details>` : ''}
        </div>
        <form class="card stack" data-form="add-exam">
          <h2>+ Add a test or quiz</h2>
          <label>What is it?<input name="title" required maxlength="80" placeholder="e.g. Chapter 5 Quiz" value="${preset ? esc(preset.title) : ''}"></label>
          <label>Date<input name="date" type="date" required value="${tomorrow}"></label>
          <fieldset><legend>Which of my notes are on it?</legend>
            ${p.notes.length ? p.notes.map((n) => `<label class="check"><input type="checkbox" name="noteIds" value="${n.id}"> ${esc(n.title)}</label>`).join('') : '<p class="muted small">No notes yet. <a href="#notes-new">Add notes</a> or choose topics below.</p>'}
          </fieldset>
          <fieldset><legend>Topics on it (adds practice questions)</legend>
            <div class="scroll-box">${Library.groups().map((g) => `<div class="group-subject">${g.icon} ${esc(g.subject)}</div>` + g.levels.map((l) => (g.subject === l.level ? '' : `<div class="muted small group-label">${esc(l.level)}</div>`) + l.cats.map((c) => `<label class="check"><input type="checkbox" name="categoryIds" value="${c.id}" ${presetCats.includes(c.id) ? 'checked' : ''}> ${c.icon} ${esc(c.name)}</label>`).join('')).join('')).join('')}</div>
          </fieldset>
          <button class="btn primary" type="submit">Add test</button>
        </form>
      </div>`;
  }
  function examCard(e) {
    const n = U.daysUntil(e.date);
    const cards = Quiz.examCards(e);
    const concepts = e.categoryIds.reduce((s, id) => s + ((Library.get(id) || { concepts: [] }).concepts.length), 0);
    const total = cards.length + concepts;
    const perDay = Math.ceil(total / Math.max(1, n));
    const m = mastery(cards);
    return `<div class="card exam ${n <= 1 ? 'urgent' : ''}">
      <div class="row spread"><h2>${esc(e.title)}</h2><span class="badge ${n <= 1 ? 'hot' : ''}">${countdown(n)}</span></div>
      <p class="muted small">${new Date(e.date + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
       · ${e.noteIds.map((id) => Store.note(id)).filter(Boolean).map((x) => esc(x.title)).join(', ') || 'no notes'}
       ${e.categoryIds.length ? ' · ' + e.categoryIds.map((id) => (Library.get(id) || {}).name).filter(Boolean).map(esc).join(', ') : ''}</p>
      ${cards.length ? `<div class="meter"><div style="width:${m}%"></div></div><p class="small muted">${m}% of your cards for this test are mastered.</p>` : ''}
      <p class="small">${n <= 1 ? '<b>Test is close!</b> Use <b>Cram mode</b>: it repeats every question you miss until you get it right.' : `📋 Study plan: about <b>${plural(perDay, 'question')}</b> a day until test day, then cram the night before.`}</p>
      <div class="row tight">
        <button class="btn small ${n > 1 ? 'primary' : ''}" data-action="exam-quiz" data-id="${e.id}" data-mode="quick">Quick quiz</button>
        <button class="btn small" data-action="exam-quiz" data-id="${e.id}" data-mode="full">Full practice test</button>
        <button class="btn small ${n <= 1 ? 'primary' : ''}" data-action="exam-quiz" data-id="${e.id}" data-mode="cram">🔥 Cram mode</button>
        <button class="btn small ghost" data-action="delete-exam" data-id="${e.id}">Delete</button>
      </div>
    </div>`;
  }

  const BAND_SHORT = ['Elementary', 'Middle school', 'High school', 'AP & IB', 'College'];
  function categoriesView() {
    const p = Store.current();
    const Courses = window.MSG.Courses;
    const view = sessionStorageGet('catView') === 'courses' ? 'courses' : 'topics';
    const q = (sessionStorageGet('catFilter') || '').toLowerCase();
    const groups = Library.groups();
    let subj = sessionStorageGet('subject') || 'all';
    if (subj !== 'all' && !groups.some((g) => g.subject === subj)) subj = 'all';
    const bandSel = sessionStorageGet('band') || 'all';
    const tabs = `<div class="view-tabs" role="tablist"><button class="view-tab ${view === 'topics' ? 'active' : ''}" role="tab" aria-selected="${view === 'topics'}" data-action="cat-view" data-view="topics">📚 Topics (${Library.categories.length})</button><button class="view-tab ${view === 'courses' ? 'active' : ''}" role="tab" aria-selected="${view === 'courses'}" data-action="cat-view" data-view="courses">🎓 AP &amp; IB courses (${Courses.list.length})</button></div>`;
    const subjChips = `<div class="subject-chips" role="group" aria-label="Subject">${[{ subject: 'all', icon: '✨' }].concat(groups).map((g) => `<button class="chip-btn ${subj === g.subject ? 'active' : ''}" data-action="pick-subject" data-subject="${esc(g.subject)}" aria-pressed="${subj === g.subject}">${g.icon} ${g.subject === 'all' ? 'All subjects' : esc(g.subject)}</button>`).join('')}</div>`;
    const head = (title, sub) => `<div class="page-head"><div><h1>${title}</h1><p class="muted">${sub}</p></div>
      <input class="search" type="search" placeholder="${view === 'courses' ? 'Search courses…' : 'Search topics…'}" value="${esc(q)}" data-input="filter-cats" aria-label="Search"></div>`;

    if (view === 'courses') {
      const prog = sessionStorageGet('program') || 'all';
      const progChips = `<div class="subject-chips" role="group" aria-label="Program">${[['all', 'AP & IB'], ['AP', 'AP only'], ['IB', 'IB only']].map(([v, l]) => `<button class="chip-btn ${prog === v ? 'active' : ''}" data-action="pick-program" data-program="${v}" aria-pressed="${prog === v}">${l}</button>`).join('')}</div>`;
      const list = Courses.list.filter((c) => (prog === 'all' || c.program === prog) && (subj === 'all' || c.subject === subj) && (!q || (c.name + ' ' + c.units.join(' ')).toLowerCase().includes(q)));
      const body = groups.map((g) => {
        const cs = list.filter((c) => c.subject === g.subject);
        if (!cs.length) return '';
        return `<h2 class="subject-head" data-subject="${subjSlug(g.subject)}">${esc(g.subject)}</h2><div class="grid three">${cs.map((c) => `<a class="card cat-card" data-subject="${subjSlug(c.subject)}" href="#course--${c.id}"><span class="cat-icon prog-${c.program.toLowerCase()}">${c.program}</span><span><b>${esc(c.name)}</b><span class="muted small">${c.units.length} units · practice from ${c.topics.length} topic${c.topics.length > 1 ? 's' : ''}</span></span></a>`).join('')}</div>`;
      }).join('');
      return head('Study Categories', `Every AP course and the IB Diploma subjects, each with its units and practice questions.`) + tabs + progChips + subjChips + (body || '<p class="muted">No courses match.</p>');
    }

    const bandChips = `<div class="subject-chips" role="group" aria-label="Level">${['all', 0, 1, 2, 3, 4].map((b) => `<button class="chip-btn ${String(bandSel) === String(b) ? 'active' : ''}" data-action="pick-band" data-band="${b}" aria-pressed="${String(bandSel) === String(b)}">${b === 'all' ? 'All levels' : BAND_SHORT[b]}</button>`).join('')}</div>`;
    const match = (c) => (bandSel === 'all' || String(c.band) === String(bandSel)) && (!q || (c.name + ' ' + c.blurb + ' ' + c.subject + ' ' + c.concepts.map((k) => k.term).join(' ')).toLowerCase().includes(q));
    const body = groups.filter((g) => subj === 'all' || g.subject === subj).map((g) => {
      const levels = g.levels.map((l) => ({ level: l.level, cats: l.cats.filter(match) })).filter((l) => l.cats.length);
      if (!levels.length) return '';
      return `<h2 class="subject-head" data-subject="${subjSlug(g.subject)}">${esc(g.subject)}</h2>` + levels.map((l) => (l.level === g.subject ? '' : `<h3 class="level">${esc(l.level)}</h3>`) + `<div class="grid three">${l.cats.map(catCard).join('')}</div>`).join('');
    }).join('');
    return head('Study Categories', `No notes needed: ${Library.categories.length} topics across ${groups.length} subjects, from elementary school to AP, IB and college.`) + tabs + bandChips + subjChips + (body || '<p class="muted">No topics match your search.</p>');
    function catCard(c) {
      const s = p.catStats[c.id];
      return `<a class="card cat-card" data-subject="${subjSlug(c.subject)}" href="#category--${c.id}"><span class="cat-icon">${c.icon}</span><span><b>${esc(c.name)}</b><span class="band band-${c.band}">${BAND_SHORT[c.band]}</span><span class="muted small">${esc(c.blurb)}</span>${s ? `<span class="small score ${window.MSG.Modes.topicMastery(c.id) >= 80 ? 'good' : 'ok'}">${window.MSG.Modes.topicMastery(c.id)}% mastered · ${s.right + s.wrong} answered</span>` : ''}${window.MSG.Guides.has(c.id) ? '<span class="small muted">📘 Study guide</span>' : ''}</span></a>`;
    }
  }

  function courseView(id) {
    const c = window.MSG.Courses.get(id);
    if (!c) return notFound();
    const p = Store.current();
    const diff = Number(sessionStorageGet('difficulty') || 2);
    const topics = c.topics.map((t) => Library.get(t)).filter(Boolean);
    return `
      <div class="topic-hero" data-subject="${subjSlug(c.subject)}"><div><a href="#categories" class="muted small" data-action="cat-view" data-view="courses">← AP &amp; IB courses</a><h1><span class="prog-badge prog-${c.program.toLowerCase()}">${c.program}</span> ${esc(c.name)}</h1><p class="muted">${esc(c.subject)}${c.note ? ' · ' + esc(c.note) : ''}</p></div></div>
      <div class="grid editor">
        <div class="card">
          <h2>Course units</h2>
          <ol class="units">${c.units.map((u) => `<li>${esc(u)}</li>`).join('')}</ol>
          <h3>Topics that practice this course</h3>
          <div class="topic-links">${topics.map((t) => `<a class="chip-btn" href="#category--${t.id}">${t.icon} ${esc(t.name)}</a>`).join('')}</div>
        </div>
        <div class="stack">
          ${window.MSG.Study.modesPanel('course_' + c.id)}
          <form class="card stack" data-form="practice-course" data-id="${c.id}">
            <h2>Practice this course</h2>
            <p class="small muted">Questions drawn from all ${topics.length} topics above, new every time.</p>
            <fieldset class="seg"><legend>Difficulty</legend>${['Easy', 'Medium', 'Hard'].map((l, i) => `<label><input type="radio" name="d" value="${i + 1}" ${diff === i + 1 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>
            <label>Questions<select name="n">${[10, 15, 20, 30].map((n) => `<option ${n === Math.max(10, p.settings.quizLength) ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
            <button class="btn primary" type="submit">Start practice</button>
          </form>
          <div class="card stack">
            <h3>Have a test coming up?</h3>
            <p class="small">Add it to Test Prep with these topics already picked, then add your own notes for the unit.</p>
            <button class="btn small" data-action="course-to-exam" data-id="${c.id}">Plan a test for this course</button>
          </div>
        </div>
      </div>`;
  }

  function categoryView(id) {
    const c = Library.get(id);
    if (!c) return notFound();
    const p = Store.current();
    const s = p.catStats[id];
    const added = Store.libraryCardsAdded(id);
    const diff = Number(sessionStorageGet('difficulty') || 2);
    return `
      <div class="topic-hero" data-subject="${subjSlug(c.subject)}"><div><a href="#categories" class="muted small no-print">← Categories</a><h1><span class="cat-icon">${c.icon}</span>${esc(c.name)}</h1><p class="muted"><span class="band band-${c.band}">${BAND_SHORT[c.band]}</span> ${esc(c.subject === c.level ? c.subject : c.subject + ' · ' + c.level)} · ${esc(c.blurb)}</p>${(() => { const cs = window.MSG.Courses.list.filter((k) => k.topics.includes(c.id)); return cs.length ? `<p class="small">Used in: ${cs.map((k) => `<a href="#course--${k.id}">${esc(k.name)}</a>`).join(', ')}</p>` : ''; })()}</div></div>
      <div class="grid editor">
        <div class="stack">
          ${window.MSG.Study.guideHtml(id)}
          <div class="card ref-card">
            <div class="row spread"><h2>Reference sheet</h2>${window.MSG.Guides.has(id) ? '' : '<button class="btn small ghost no-print" type="button" data-action="print">🖨️ Print</button>'}</div>
            <dl class="ref">${c.concepts.map((k) => `<dt>${esc(k.term)}</dt><dd>${esc(k.def)}</dd>`).join('')}</dl>
          </div>
        </div>
        <div class="stack">
          ${window.MSG.Study.modesPanel('cat_' + id)}
          <form class="card stack no-print" data-form="practice" data-id="${id}">
            <h2>Practice</h2>
            <p class="small muted">${Generators.has(id) ? 'A new set of problems every time, mixed with concept questions.' : 'Concept questions from the reference sheet.'}</p>
            <fieldset class="seg"><legend>Difficulty</legend>${['Easy', 'Medium', 'Hard'].map((l, i) => `<label><input type="radio" name="d" value="${i + 1}" ${diff === i + 1 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>
            <label>Questions<select name="n">${[5, 10, 15, 20].map((n) => `<option ${n === p.settings.quizLength ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
            <button class="btn primary" type="submit">Start practice</button>
          </form>
          <div class="card no-print">
            <h3>Remember it long-term</h3>
            <p class="small">${added ? 'These key concepts are in your daily review deck.' : 'Add these key concepts to your daily review so they come back over time.'}</p>
            <button class="btn small" data-action="${added ? 'remove-lib' : 'add-lib'}" data-id="${id}">${added ? 'Remove from my deck' : '+ Add ' + c.concepts.length + ' cards to my deck'}</button>
          </div>
          ${s ? `<div class="card no-print"><h3>Your stats</h3><p>${s.right} correct out of ${s.right + s.wrong} (${pct(s.right, s.right + s.wrong)}%)</p><p class="small">Mastery: <b>${window.MSG.Modes.topicMastery(id)}%</b></p><div class="meter"><div style="width:${window.MSG.Modes.topicMastery(id)}%"></div></div></div>` : ''}
        </div>
      </div>`;
  }

  /* ---------- "Set up accounts" guide for the site owner (#setup) ---------- */
  const SETUP_DOMAIN = location.hostname && location.hostname !== 'localhost' && !/claude/.test(location.hostname) ? location.hostname : 'your-site.github.io';
  const SETUP_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /chunks/{chunk} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}`;
  function setupView() {
    const A = window.MSG.Accounts;
    if (window.MSG.Sync && window.MSG.Sync.inClaude) return `
      <div class="page-head"><div><a href="#profile" class="muted small">← Back</a><h1>Student accounts</h1>
      <p class="muted">Nothing to set up here: this version already gives every person their own account.</p></div></div>
      <div class="card stack" style="max-width:760px"><p>On claude.ai, each person signs in with their own claude.ai account, and their notes are saved privately to it. Nobody else can see them, and they follow the person to any device.</p>
      <p>To let other people use it, open the page's <b>Share</b> menu and give them <b>Contributor</b> access.</p>
      <p class="muted small">The Firebase setup is only for the public website on GitHub Pages.</p></div>`;
    const on = A && A.enabled;
    const step = (n, title, body) => `<li class="setup-step"><span class="step-num" aria-hidden="true">${n}</span><div class="stack"><h3>${title}</h3>${body}</div></li>`;
    const copyBox = (id, text) => `<pre class="ai-prompt" id="${id}">${esc(text)}</pre><button class="btn small" type="button" data-action="copy-text" data-target="${id}">Copy</button>`;
    const ext = (href, label) => `<a class="btn small primary" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
    return `
      <div class="page-head"><div><a href="${Store.current() ? '#profile' : '#welcome'}" class="muted small">← Back</a><h1>Set up student accounts</h1>
      <p class="muted">${on ? '✅ Accounts are already on for this site.' : 'About 10 minutes, free. When you finish, students can create their own account, and everything they add is saved to it on any device.'}</p></div></div>
      <ol class="setup">
        ${step(1, 'Create a Firebase project', `<p>Sign in with your Google account and click <b>Create a project</b>. Name it <code>universal-study-guide</code> and click <b>Continue</b> until it's done. You can turn Google Analytics off.</p><div class="row">${ext('https://console.firebase.google.com/', 'Open Firebase')}</div>`)}
        ${step(2, 'Turn on email and password sign-in', `<p>In the left menu: <b>Build → Authentication → Get started</b>. Click <b>Email/Password</b>, switch the first toggle <b>on</b>, and click <b>Save</b>.</p>`)}
        ${step(3, 'Allow your website', `<p>Still in Authentication, open the <b>Settings</b> tab → <b>Authorized domains</b> → <b>Add domain</b>, paste this, and click <b>Add</b>:</p>${copyBox('setupDomain', SETUP_DOMAIN)}`)}
        ${step(4, 'Create the database', `<p>In the left menu: <b>Build → Firestore Database → Create database</b>. Pick a location near you, choose <b>Start in production mode</b>, and click <b>Create</b>.</p><p>Then open the <b>Rules</b> tab, delete everything there, paste these rules, and click <b>Publish</b>. They make each student's notes visible only to that student.</p>${copyBox('setupRules', SETUP_RULES)}`)}
        ${step(5, 'Register the website and copy its settings', `<p>Click the <b>gear icon</b> (top left) → <b>Project settings</b>. Scroll to <b>Your apps</b> and click the <b>&lt;/&gt;</b> (web) icon. Name it <code>website</code>, leave Firebase Hosting unchecked, and click <b>Register app</b>.</p><p>Firebase shows code that starts with <code>const firebaseConfig = {</code>. Copy that whole block.</p>`)}
        ${step(6, 'Check your settings', `<p>Paste the block here to check it before you send it. Nothing is saved or sent anywhere.</p>
          <form class="stack" data-form="check-config">
            <label for="cfgInput">Your firebaseConfig</label>
            <textarea id="cfgInput" name="cfg" rows="9" required placeholder="const firebaseConfig = {&#10;  apiKey: &quot;AIza...&quot;,&#10;  authDomain: &quot;universal-study-guide.firebaseapp.com&quot;,&#10;  projectId: &quot;math-study-guide&quot;,&#10;  ...&#10;};"></textarea>
            <div class="row"><button class="btn primary" type="submit">Check settings</button></div>
            <div id="cfgResult"></div>
          </form>`)}
        ${step(7, 'Send it to Claude', `<p>Paste the checked settings into your chat with Claude and ask for them to be added. The settings are not secret: every Firebase website includes them, and the rules from step 4 protect students' notes. Once they're added, visitors see <b>Log in / Create account</b>.</p>`)}
      </ol>`;
  }
  function checkConfig(text) {
    const cfg = {};
    const re = /([A-Za-z]+)\s*:\s*["']([^"']*)["']/g;
    let m;
    while ((m = re.exec(text))) cfg[m[1]] = m[2];
    const need = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missing = need.filter((k) => !cfg[k]);
    const problems = [];
    if (missing.length) problems.push('Missing: ' + missing.join(', ') + '. Copy the whole block from Firebase, from "const firebaseConfig = {" to "};".');
    if (cfg.apiKey && !/^AIza[\w-]{30,}$/.test(cfg.apiKey)) problems.push('The apiKey doesn\'t look complete. It should start with "AIza" and be about 39 characters long.');
    if (cfg.authDomain && !/\.(firebaseapp\.com|web\.app)$/.test(cfg.authDomain)) problems.push('The authDomain should end with ".firebaseapp.com".');
    return { cfg, problems };
  }

  function savedToAccount() {
    const A = window.MSG.Accounts, Sy = window.MSG.Sync;
    return !!((Sy && Sy.mode === 'claude') || (A && A.user));
  }
  function accountBox() {
    const A = window.MSG.Accounts, Sy = window.MSG.Sync;
    if (Sy && Sy.mode === 'claude') return '<h2>Your account</h2><p class="small">Your notes are saved privately to your claude.ai account. Only you can see them, and they follow you to any device where you sign in to claude.ai.</p>';
    if (Sy && Sy.inClaude) return '<h2>Your account</h2><p class="small">Your notes are kept in this browser only, because this page can\'t save to your claude.ai account. Ask the person who shared it for <b>Contributor</b> access, or sign in to claude.ai, to save them to your account.</p>';
    if (!A || !A.enabled) return '<h2>Student accounts</h2><p class="small">Accounts are off: notes save only in each browser. Turn them on so every student gets their own account that saves everywhere.</p><div class="row"><a class="btn" href="#setup">Set up student accounts</a></div>';
    if (!A.user) return '';
    return `<h2>Account</h2><p class="small">Logged in as <b>${esc(A.user.email || '')}</b>.</p><div class="row"><button class="btn" data-action="log-out">Log out</button></div>`;
  }
  function settingsView() {
    const p = Store.current();
    const st = Store.stats();
    return `
      <div class="page-head"><div><h1>Profile</h1><p class="muted">${plural(p.notes.length, 'note')} · ${plural(st.cards, 'card')} · ${st.total} questions answered${st.accuracy != null ? ' · ' + st.accuracy + '% correct' : ''}</p></div></div>
      <div class="grid two">
        <form class="card stack" data-form="settings">
          <h2>Settings</h2>
          <label>Name<input name="name" value="${esc(p.name)}" maxlength="40" required></label>
          <label>Default practice length<select name="quizLength">${[5, 10, 15, 20].map((n) => `<option ${n === p.settings.quizLength ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
          <label>When I add notes<select name="aiFormat"><option value="off" ${p.settings.aiFormat === 'on' ? '' : 'selected'}>📝 Keep my notes as I wrote them</option><option value="on" ${p.settings.aiFormat === 'on' ? 'selected' : ''}>✨ Let AI format my notes</option></select></label>
          <label>Max cards per daily review<select name="dailyLimit">${[10, 15, 25, 40, 60, 100].map((n) => `<option ${n === p.settings.dailyLimit ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
          <button class="btn primary" type="submit">Save</button>
        </form>
        <div class="card stack">
          ${accountBox()}
          <h2>Backup & devices</h2>
          <p class="small">${savedToAccount() ? 'Your notes are saved to your account. You can also download a backup file to keep your own copy.' : 'Your notes are stored in this browser. Download a backup to keep them safe or to move them to another computer or phone.'}</p>
          <div class="row"><button class="btn" data-action="export">⬇️ Download backup</button><label class="btn">⬆️ Import backup<input type="file" accept=".json,application/json" data-change="import-backup" hidden></label></div>
          <h2>Profiles</h2>
          <div class="row"><a class="btn" href="#welcome">Switch / add profile</a><button class="btn danger" data-action="delete-profile">Delete this profile</button></div>
        </div>
      </div>`;
  }

  function notFound() { return '<div class="card empty"><p>That page doesn\'t exist.</p><a class="btn" href="#dashboard">Go home</a></div>'; }

  /* ---------- quiz ---------- */
  function startQuiz(title, questions, opts) {
    opts = opts || {};
    questions = (questions || []).filter(Boolean);
    if (!questions.length) { toast('No questions available yet. Add some notes or pick a category first.'); return; }
    session = { title, questions, i: 0, results: [], answered: false, correct: false, response: null, requeue: !!opts.requeue, requeued: new Map(), back: opts.back || '#dashboard', record: opts.record !== false, startedAt: Date.now(),
      total0: questions.length, test: !!opts.test, endsAt: opts.minutes ? Date.now() + opts.minutes * 60000 : 0 };
    go('#quiz');
  }

  function quizView() {
    if (!session) return '<div class="card empty"><p>No quiz in progress.</p><a class="btn primary" href="#dashboard">Go home</a></div>';
    if (session.i >= session.questions.length) return quizSummary();
    const q = session.questions[session.i];
    const total = session.questions.length;
    const right = session.results.filter((r) => r.correct).length;
    let body = '';
    if (q.kind === 'mc') {
      body = `<div class="choices">${q.choices.map((c, i) => {
        let cls = '';
        if (session.answered) cls = i === q.correct ? 'correct' : i === Number(session.response) ? 'wrong' : 'dim';
        return `<button class="choice ${cls}" data-action="answer-mc" data-i="${i}" ${session.answered ? 'disabled' : ''}><span class="key">${'ABCD'[i] || i + 1}</span><span>${fmt(c)}</span></button>`;
      }).join('')}</div>`;
    } else if (q.kind === 'input') {
      body = `<form data-form="answer-input" class="answer-form">
        <input name="answer" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${q.check === 'numeric' ? 'Type a number (fractions like 3/4 work too)' : 'Type your answer'}" ${session.answered ? `disabled value="${esc(session.response || '')}"` : 'autofocus'} aria-label="Your answer">
        ${session.answered ? '' : '<button class="btn primary" type="submit">Check</button><button class="btn ghost" type="button" data-action="dont-know">I don\'t know</button>'}
      </form>`;
    } else {
      body = session.answered || session.revealed
        ? `<div class="flash-answer"><div class="muted small">Answer</div><div>${fmt(q.answerDisplay)}</div>${q.explain ? `<div class="explain">${fmt(q.explain)}</div>` : ''}</div>
           ${session.answered ? '' : '<p class="small muted">Be honest. This decides when you see it again.</p><div class="row"><button class="btn good" data-action="flash-grade" data-ok="1">✓ I knew it</button><button class="btn bad" data-action="flash-grade" data-ok="0">✗ I missed it</button></div>'}`
        : '<p class="small muted">Think of your answer (or work it out on paper), then reveal it.</p><button class="btn primary" data-action="reveal">Show answer</button>';
    }
    let feedback = '';
    if (session.answered) {
      feedback = `<div class="feedback ${session.correct ? 'good' : 'bad'}">
        <b>${session.correct ? pick(['Correct! 🎉', 'Nice work! ✅', 'You got it! 💪', 'Exactly right! ⭐']) : 'Not quite.'}</b>
        ${!session.correct && q.kind !== 'flash' ? `<div>Answer: <span class="answer">${fmt(q.kind === 'mc' ? q.choices[q.correct] : q.answerDisplay)}</span></div>` : ''}
        ${q.explain && q.kind !== 'flash' ? `<div class="explain">${fmt(q.explain)}</div>` : ''}
        <div class="row">${!session.correct && q.kind === 'input' ? '<button class="btn small ghost" data-action="override">I was actually right</button>' : ''}<button class="btn primary" data-action="next" id="nextBtn">${session.i + 1 >= session.questions.length ? 'See results' : 'Next →'}</button></div>
      </div>`;
    }
    return `
      <div class="quiz">
        <div class="quiz-head"><div><b>${esc(session.title)}</b><div class="muted small">Question ${session.i + 1} of ${total}${session.test ? '' : ' · ' + right + ' correct'}${session.requeue ? ' · 🔥 cram mode' : ''}${session.endsAt ? ` · ⏱ <span id="quizTime">${timeLeft()}</span> left` : ''}</div></div><button class="btn small ghost" data-action="end-quiz">${session.test ? 'Finish test' : 'End quiz'}</button></div>
        <div class="progress"><div style="width:${(100 * session.i) / total}%"></div></div>
        <div class="card question">
          ${q.topic ? `<span class="chip">${esc(q.topic)}</span>` : ''}
          <div class="prompt">${fmt(q.prompt)}</div>
          <button class="btn small ghost" type="button" data-action="speak" title="Read aloud (press again to stop)">🔊 Read aloud</button>
          ${body}
          ${feedback}
        </div>
        <p class="muted small center key-hint">Tip: press Enter to go to the next question${q.kind === 'mc' && !session.answered ? ', or 1–4 to choose an answer' : ''}.</p>
      </div>`;
  }
  const pick = U.pick;
  function timeLeft() { const s = Math.max(0, Math.round((session.endsAt - Date.now()) / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  setInterval(() => {
    if (!session || !session.endsAt || session.i >= session.questions.length) return;
    const t = document.getElementById('quizTime');
    if (t) t.textContent = timeLeft();
    if (Date.now() >= session.endsAt && location.hash.startsWith('#quiz')) { toast('⏰ Time\'s up!'); actions['end-quiz'](); }
  }, 1000);

  function answer(correct, response) {
    session.answered = true; session.correct = correct; session.response = response;
    if (session.test) { next(); return; } // practice test: no answers until the end
    route();
  }
  function commitAnswer() {
    const q = session.questions[session.i];
    const correct = session.correct;
    session.results.push({ q, correct, response: session.response });
    if (session.record) window.MSG.Study.record(q, correct); // spaced repetition, topic stats, streak, mistake notebook
    if (!correct && session.requeue) {
      const n = session.requeued.get(q) || 0;
      if (n < 3) {
        session.requeued.set(q, n + 1);
        let again = q;
        const card = q.cardId && Store.card(q.cardId);
        if (card) { again = Quiz.cardQuestion(card, Store.current().cards); session.requeued.set(again, n + 1); }
        session.questions.push(again);
      }
    }
  }
  function next() {
    commitAnswer();
    session.i += 1; session.answered = false; session.revealed = false; session.response = null;
    if (session.i >= session.questions.length) {
      const right = session.results.filter((r) => r.correct).length;
      if (session.record) Store.logSession(session.title, right, session.results.length);
    }
    route();
    window.scrollTo(0, 0);
  }

  function quizSummary() {
    const rs = session.results;
    const right = rs.filter((r) => r.correct).length;
    const p = pct(right, rs.length) || 0;
    const missed = rs.filter((r) => !r.correct);
    const uniqueMissed = Array.from(new Set(missed.map((r) => r.q)));
    const msg = p === 100 ? 'Perfect score! You\'re ready. 🏆' : p >= 85 ? 'Great job, almost there! 🌟' : p >= 70 ? 'Solid work. Review the misses below. 👍' : p >= 50 ? 'Getting there. Go over the misses and try again. 💪' : 'Keep practicing. Every miss now is one you won\'t miss on the test. 📚';
    return `
      <div class="quiz">
        <div class="card summary">
          <h1>${esc(session.title)}: done!</h1>
          <div class="big-score ${p >= 80 ? 'good' : p >= 60 ? 'ok' : 'bad'}">${p}%</div>
          <p>${right} of ${rs.length} correct${session.test && rs.length < session.total0 ? ` (${session.total0 - rs.length} not answered)` : ''}${session.requeue && missed.length ? ` (missed questions were repeated until you got them right)` : ''}</p>
          <p class="lead">${msg}</p>
          <div class="row center">${uniqueMissed.length ? '<button class="btn primary" data-action="retry-missed">Retry missed questions</button>' : ''}${missed.length ? '<a class="btn" href="#mistakes">📕 Mistake notebook</a>' : ''}<a class="btn" href="${session.back}">Done</a></div>
        </div>
        ${session.test ? `<div class="card"><h2>Review every question</h2><div class="card-list">${rs.map((r, n) => `<div class="card-row ${r.correct ? 'right' : 'wrong'}"><div class="cr-main"><div class="cr-front"><b>${n + 1}.</b> ${r.correct ? '✅' : '❌'} ${fmt(r.q.prompt)}</div>${r.correct ? '' : `<div class="small">Your answer: ${r.response === '' || r.response == null ? '<i>skipped</i>' : fmt(r.q.kind === 'mc' ? r.q.choices[Number(r.response)] : r.q.kind === 'flash' ? (r.response === '1' ? 'knew it' : 'missed it') : r.response)}</div>`}<div class="cr-back">✔ ${fmt(r.q.kind === 'mc' ? r.q.choices[r.q.correct] : r.q.answerDisplay)}</div>${r.q.explain ? `<div class="muted small">${fmt(r.q.explain)}</div>` : ''}</div></div>`).join('')}</div></div>` : ''}
        ${uniqueMissed.length && !session.test ? `<div class="card"><h2>Review what you missed</h2><div class="card-list">${uniqueMissed.map((q) => `<div class="card-row"><div class="cr-main"><div class="cr-front">${fmt(q.prompt)}</div><div class="cr-back">✔ ${fmt(q.kind === 'mc' ? q.choices[q.correct] : q.answerDisplay)}</div>${q.explain ? `<div class="muted small">${fmt(q.explain)}</div>` : ''}</div></div>`).join('')}</div></div>` : ''}
      </div>`;
  }

  /* ---------- router ---------- */
  const views = {
    auth: authView, setup: setupView, welcome, dashboard, notes: notesList, 'notes-new': () => noteEditor(null), note: noteView, 'note-edit': noteEditor,
    exams: examsView, categories: categoriesView, category: categoryView, course: courseView, profile: settingsView, quiz: quizView
  };
  function route() {
    // Routes are plain "#name" or "#name--id" so they also work inside a claude.ai artifact.
    const hash = location.hash.replace(/^#\/?/, '');
    const parts = hash.split('--');
    let name = parts[0] || 'dashboard';
    const arg = parts[1];
    const A = window.MSG.Accounts;
    if (window.MSG.Sync && window.MSG.Sync.loading) name = 'auth'; // claude.ai: shows "Loading…" until we know whose notes to load
    else if (A && A.enabled && (!A.ready || !A.user || A.error)) name = 'auth';
    else if (A && A.enabled && !A.loaded) name = 'auth'; // shows "Loading…" while the account's notes arrive
    else if (!Store.current() && name !== 'welcome' && name !== 'setup') name = 'welcome';
    const view = views[name] || notFound;
    $app.innerHTML = view(arg);
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name || (name.startsWith('note') && a.dataset.nav === 'notes') || ((name === 'category' || name === 'course') && a.dataset.nav === 'categories') || (['mistakes', 'progress'].includes(name) && a.dataset.nav === 'dashboard')));
    const p = Store.current();
    document.getElementById('nav').style.visibility = p ? 'visible' : 'hidden';
    const chip = document.getElementById('profileChip');
    chip.innerHTML = p ? `<span class="avatar">${esc(p.name[0] || '?').toUpperCase()}</span><span class="chip-name">${esc(p.name)}</span>` : '';
    chip.style.display = p ? '' : 'none';
    document.title = (name === 'welcome' ? '' : (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-.*/, '') + ' · ') + 'Universal Study Guide';
    renderMath($app);
    const ta = $app.querySelector('textarea[data-input="preview-notes"]');
    if (ta && ta.value) previewNotes(ta);
    const af = $app.querySelector('[autofocus]');
    if (af) af.focus();
    const nb = document.getElementById('nextBtn');
    if (nb) nb.focus();
  }

  /* ---------- actions ---------- */
  const actions = {
    'ai-format': async (el) => {
      const form = el.closest('form');
      const notes = form.content.value.trim();
      if (!notes) { toast('Paste or type your notes first.'); form.content.focus(); return; }
      const AF = window.MSG.AIFormat;
      if (notes.length > AF.MAX_CHARS) { aiPanel(`<p class="small">These notes are long (${notes.length.toLocaleString()} characters). Format them one section at a time: paste part of them, format, save, then add the rest as another set of notes.</p><div class="row"><button class="btn small" type="button" data-action="ai-dismiss">OK</button></div>`); return; }
      const sample = await AF.available();
      if (!sample) { aiFallback(form); return; }
      if (AI.ctl) AI.ctl.abort();
      const ctl = AI.ctl = new AbortController();
      aiPanel(`<div class="ai-head"><b>✨ Formatting your notes…</b><button class="btn small ghost" type="button" data-action="ai-stop">Stop</button></div>
        <pre class="ai-out" id="aiOut">Thinking… (the first time, claude.ai asks you to allow this. It uses your own Claude account.)</pre>`);
      try {
        const res = await sample(AF.prompt(notes), { signal: ctl.signal, cache: el.dataset.again ? false : undefined, onText: ({ text }) => { const o = document.getElementById('aiOut'); if (o) o.textContent = text; } });
        if (AI.ctl !== ctl) return;
        AI.ctl = null;
        AI.result = AF.clean(res.text);
        if (!AI.result) { aiPanel(`<p class="small">${esc(AF.message({ code: 'empty_completion' }))}</p>`); return; }
        aiCompare(form);
        if (res.truncated) toast('The answer was cut short. Format a smaller part at a time.');
      } catch (e) {
        if (AI.ctl === ctl) AI.ctl = null;
        if (e && e.code === 'cancelled') { aiPanel(''); return; }
        if (AF.isPermanent(e)) { aiFallback(form, AF.message(e)); return; }
        aiPanel(`<p class="small">${esc(AF.message(e))}</p><div class="row"><button class="btn small" type="button" data-action="ai-format" data-again="1">Try again</button><button class="btn small ghost" type="button" data-action="ai-dismiss">Close</button></div>`);
      }
    },
    'ai-stop': () => { if (AI.ctl) AI.ctl.abort(); },
    'ai-use': (el) => aiApply(el.closest('form')),
    'ai-use-pasted': (el) => {
      const form = el.closest('form');
      const pasted = window.MSG.AIFormat.clean(document.getElementById('aiPaste').value);
      if (!pasted) { toast('Paste the AI\'s answer first.'); return; }
      AI.result = pasted;
      aiApply(form);
    },
    'ai-dismiss': () => { if (AI.ctl) AI.ctl.abort(); aiPanel(''); },
    'ai-undo': (el) => {
      const form = el.closest('form');
      if (AI.original != null) { form.content.value = AI.original; AI.original = null; previewNotes(form.content); }
      aiPanel(''); toast('Your original notes are back.');
    },
    'cat-view': (el) => { sessionStorageSet('catView', el.dataset.view); if (location.hash !== '#categories') go('#categories'); else route(); },
    'pick-band': (el) => { sessionStorageSet('band', el.dataset.band); route(); },
    'pick-program': (el) => { sessionStorageSet('program', el.dataset.program); route(); },
    'course-to-exam': (el) => { const c = window.MSG.Courses.get(el.dataset.id); sessionStorageSet('examPreset', JSON.stringify({ title: c.name + ' test', cats: c.topics })); go('#exams'); },
    'pick-subject': (el) => { sessionStorageSet('subject', el.dataset.subject); route(); },
    'auth-tab': (el) => { sessionStorageSet('authTab', el.dataset.tab); route(); },
    'log-out': async (el) => {
      el.disabled = true;
      try { await window.MSG.Accounts.logOut(); session = null; sessionStorageSet('authTab', 'login'); location.hash = ''; toast('Logged out'); }
      catch (e) { el.disabled = false; toast(window.MSG.Accounts.message(e)); }
    },
    'pick-profile': (el) => { Store.setCurrent(el.dataset.id); go('#dashboard'); },
    'start-review': () => startQuiz('Daily review', Quiz.dailyReview(Store.current().settings.dailyLimit)),
    'start-weak': () => startQuiz('Weakest cards', Quiz.weakest(Store.current().settings.quizLength)),
    'start-topic': (el) => startQuiz(el.dataset.topic, Quiz.weakest(15, Store.current().cards.filter((c) => (c.topic || 'General') === el.dataset.topic))),
    'quiz-note': (el) => { const n = Store.note(el.dataset.id); startQuiz(n.title, Quiz.forNote(n.id).concat(n.categoryId ? Quiz.forCategory(n.categoryId, 3, 2).filter((q) => !q.conceptId) : []), { back: '#note--' + n.id }); },
    'exam-quiz': (el) => {
      const e = Store.exam(el.dataset.id); const mode = el.dataset.mode;
      startQuiz(e.title + (mode === 'cram' ? ': cram' : mode === 'full' ? ': practice test' : ': quick quiz'), Quiz.forExam(e, mode), { requeue: mode === 'cram', back: '#exams' });
    },
    'delete-exam': async (el) => { if (await ask('Delete this test?')) { Store.deleteExam(el.dataset.id); route(); } },
    'delete-note': async (el) => { if (await ask('Delete these notes and all their study cards?')) { Store.deleteNote(el.dataset.id); go('#notes'); toast('Notes deleted'); } },
    'note-tab': (el) => { sessionStorageSet('noteTab', el.dataset.tab); route(); },
    'star-card': (el) => { Store.toggleStar(el.dataset.id); route(); },
    'delete-card': (el) => { Store.deleteCard(el.dataset.id); route(); },
    'edit-card': (el) => {
      const c = Store.card(el.dataset.id);
      const row = el.closest('.card-row');
      row.innerHTML = `<form class="cr-main stack" data-form="edit-card" data-id="${c.id}"><label>Front<textarea name="front" rows="2" required>${esc(c.front)}</textarea></label><label>Back<textarea name="back" rows="2" required>${esc(c.back)}</textarea></label><div class="row tight"><button class="btn small primary" type="submit">Save</button><button class="btn small" type="button" data-action="cancel-edit">Cancel</button></div></form>`;
      row.querySelector('textarea').focus();
    },
    'cancel-edit': () => route(),
    'copy-text': (el) => {
      const t = document.getElementById(el.dataset.target).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Copied'), () => toast('Select the text and copy it.'));
    },
    'copy-prompt': () => { const t = document.getElementById('aiPrompt').textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Prompt copied! Paste it into your AI chat.'), () => toast('Select the prompt text and copy it.')); },
    'add-lib': (el) => { const c = Library.get(el.dataset.id); Store.addLibraryCards(c.id, c.concepts); toast(`Added ${c.concepts.length} cards to your review deck`); route(); },
    'remove-lib': (el) => { Store.removeLibraryCards(el.dataset.id); toast('Removed from your deck'); route(); },
    export: async () => {
      const name = 'study-guide-' + Store.current().name.replace(/\W+/g, '-').toLowerCase() + '-' + U.dateKey() + '.json';
      if (!(await saveFile(name, Store.exportProfile()))) toast('Backup not saved.');
    },
    'delete-profile': async () => { const p = Store.current(); if (await ask(`Delete the profile "${p.name}" and all its notes? This can't be undone.`, 'Delete profile')) { Store.deleteProfile(p.id); go('#welcome'); } },
    'answer-mc': (el) => { if (session.answered) return; const i = Number(el.dataset.i); answer(Quiz.check(session.questions[session.i], i), i); },
    'dont-know': () => answer(false, ''),
    reveal: () => { session.revealed = true; route(); },
    'flash-grade': (el) => answer(el.dataset.ok === '1', el.dataset.ok),
    override: () => { session.correct = true; route(); },
    next: () => next(),
    'end-quiz': () => {
      if (session.answered) commitAnswer();
      if (!session.results.length) { const back = session.back; session = null; go(back); return; }
      session.questions = session.questions.slice(0, session.results.length);
      session.i = session.questions.length; session.answered = false;
      if (session.record) Store.logSession(session.title, session.results.filter((r) => r.correct).length, session.results.length);
      route();
    },
    'retry-missed': () => {
      const missed = Array.from(new Set(session.results.filter((r) => !r.correct).map((r) => r.q)));
      const qs = missed.map((q) => { const card = q.cardId && Store.card(q.cardId); return card ? Quiz.cardQuestion(card, Store.current().cards) : q; });
      startQuiz(session.title.replace(/ \(retry\)$/, '') + ' (retry)', U.shuffle(qs), { requeue: session.requeue, back: session.back }); // answers shown again, even after a practice test
    }
  };

  async function authSubmit(f, fn, okMsg) {
    const btn = f.querySelector('button[type=submit]');
    const err = f.querySelector('.form-error');
    err.hidden = true; btn.disabled = true;
    try { await fn(); if (okMsg) toast(okMsg); }
    catch (e) { err.textContent = window.MSG.Accounts.message(e); err.hidden = false; }
    btn.disabled = false;
  }
  const forms = {
    'check-config': (f) => {
      const { cfg, problems } = checkConfig(f.cfg.value);
      const out = document.getElementById('cfgResult');
      if (problems.length) { out.innerHTML = '<div class="feedback bad">' + problems.map((p) => '<div>' + esc(p) + '</div>').join('') + '</div>'; return; }
      const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].filter((k) => cfg[k]);
      const clean = 'const firebaseConfig = {\n' + keys.map((k) => '  ' + k + ': "' + cfg[k] + '"').join(',\n') + '\n};';
      out.innerHTML = '<div class="feedback good"><div><b>✓ These settings look right</b> (project <code>' + esc(cfg.projectId) + '</code>). Copy them and send them to Claude.</div></div><pre class="ai-prompt" id="cfgClean">' + esc(clean) + '</pre><button class="btn small primary" type="button" data-action="copy-text" data-target="cfgClean">Copy settings</button>';
    },
    login: (f) => authSubmit(f, () => window.MSG.Accounts.logIn(f.email.value.trim(), f.password.value)),
    signup: (f) => authSubmit(f, () => window.MSG.Accounts.signUp(f.name.value.trim(), f.email.value.trim(), f.password.value), 'Account created. Welcome!'),
    reset: (f) => authSubmit(f, () => window.MSG.Accounts.resetPassword(f.email.value.trim()), 'Reset link sent. Check your email (and your spam folder).'),
    'create-profile': (f) => { Store.createProfile(f.name.value); toast('Welcome, ' + Store.current().name + '!'); go('#dashboard'); },
    'save-note': async (f) => {
      const aiOn = (f.querySelector('input[name=aiMode]:checked') || {}).value === 'on';
      if (aiOn && f.content.value.trim() && f.content.value !== AI.appliedText) {
        const formatFirst = await ask('You chose to let AI format these notes, but they haven\'t been formatted yet. Format them first?', '✨ Format with AI first', { primary: true, cancel: 'Save as I wrote them' });
        if (formatFirst) { const b = f.querySelector('[data-action=ai-format]'); if (b) actions['ai-format'](b); return; }
      }
      const fields = { title: f.title.value.trim(), course: f.course.value.trim(), categoryId: f.categoryId.value, content: f.content.value };
      const cards = parseNotes(fields.content, { title: fields.title });
      let note;
      if (f.dataset.id) { note = Store.updateNote(f.dataset.id, fields, cards); toast('Notes updated'); }
      else { note = Store.addNote(fields, cards); toast(cards.length ? `Saved! Built ${plural(cards.length, 'study card')}.` : 'Saved. Add cards below.'); }
      sessionStorageSet('noteTab', 'cards');
      go('#note--' + note.id);
    },
    'add-card': (f) => { Store.addManualCard(f.dataset.id, f.front.value.trim(), f.back.value.trim(), Store.note(f.dataset.id).title); toast('Card added'); route(); },
    'edit-card': (f) => { Store.updateCard(f.dataset.id, f.front.value.trim(), f.back.value.trim()); route(); },
    'add-exam': (f) => {
      const noteIds = Array.from(f.querySelectorAll('input[name=noteIds]:checked')).map((x) => x.value);
      const categoryIds = Array.from(f.querySelectorAll('input[name=categoryIds]:checked')).map((x) => x.value);
      if (!noteIds.length && !categoryIds.length) { toast('Pick at least one set of notes or a topic.'); return; }
      Store.addExam({ title: f.title.value.trim(), date: f.date.value, noteIds, categoryIds });
      toast('Test added. Good luck! 🍀'); route();
    },
    'practice-course': (f) => {
      const d = Number((f.querySelector('input[name=d]:checked') || { value: 2 }).value);
      sessionStorageSet('difficulty', d);
      const c = window.MSG.Courses.get(f.dataset.id);
      startQuiz(c.name + ' practice', Quiz.forCourse(c, Number(f.n.value), d), { back: '#course--' + c.id });
    },
    practice: (f) => {
      const d = Number((f.querySelector('input[name=d]:checked') || { value: 2 }).value);
      sessionStorageSet('difficulty', d);
      const c = Library.get(f.dataset.id);
      startQuiz(c.name + ' practice', Quiz.forCategory(c.id, Number(f.n.value), d), { back: '#category--' + c.id });
    },
    settings: (f) => { Store.renameProfile(f.name.value); Store.updateSettings({ quizLength: Number(f.quizLength.value), dailyLimit: Number(f.dailyLimit.value), aiFormat: f.aiFormat.value === 'on' ? 'on' : 'off' }); toast('Saved'); route(); },
    'answer-input': (f) => { const v = f.answer.value; if (!v.trim()) { f.answer.focus(); return; } answer(Quiz.check(session.questions[session.i], v), v); }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-form]');
    if (!f) return;
    e.preventDefault();
    const fn = forms[f.dataset.form];
    if (fn) fn(f);
  });
  let previewTimer = null;
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.input === 'preview-notes') { clearTimeout(previewTimer); previewTimer = setTimeout(() => previewNotes(t), 250); }
    if (t.dataset.input === 'filter-cats') {
      sessionStorageSet('catFilter', t.value);
      const pos = t.selectionStart;
      route();
      const s = $app.querySelector('.search');
      if (s) { s.focus(); s.setSelectionRange(pos, pos); }
    }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.change === 'ai-mode') {
      const on = t.value === 'on';
      Store.updateSettings({ aiFormat: on ? 'on' : 'off' });
      t.closest('form').querySelectorAll('[data-ai-only]').forEach((x) => { x.hidden = !on; });
      if (!on) aiPanel('');
      return;
    }
    if (!t.dataset.change || !t.files || !t.files[0]) return;
    const file = t.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (t.dataset.change === 'load-file') {
        const form = t.closest('form');
        form.content.value = (form.content.value ? form.content.value + '\n\n' : '') + reader.result;
        if (!form.title.value) form.title.value = file.name.replace(/\.[^.]+$/, '');
        previewNotes(form.content);
      } else if (t.dataset.change === 'import-backup') {
        try { const p = Store.importProfile(reader.result); toast('Imported profile ' + p.name); go('#dashboard'); }
        catch (err) { toast(err.message || 'Could not import that file.'); }
      }
    };
    reader.readAsText(file);
    t.value = '';
  });
  document.addEventListener('keydown', (e) => {
    if (!session || !location.hash.startsWith('#quiz')) return;
    if (e.target.tagName === 'TEXTAREA') return;
    const q = session.questions[session.i];
    if (!q) return;
    if (session.answered && e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); next(); return; }
    if (!session.answered && q.kind === 'mc' && /^[1-4]$/.test(e.key) && e.target.tagName !== 'INPUT') {
      const i = Number(e.key) - 1;
      if (i < q.choices.length) answer(Quiz.check(q, i), i);
    }
  });
  const SYNC_TEXT = {
    local: 'Your notes and progress are saved in this browser. Use Profile → Backup to move them to another device.',
    connecting: 'Connecting to your account…',
    synced: '✓ Saved to your account. Your notes follow you to any device where you log in.',
    signedout: 'Log in or create a free account to save your notes.',
    saving: 'Saving…',
    error: 'Could not reach your account just now. Changes are kept in this browser and will save when the connection returns.',
    full: 'Your account storage is full. Delete old notes, then keep studying; changes are kept in this browser meanwhile.'
  };
  window.MSG.onSyncStatus = (st) => {
    const f = document.getElementById('syncStatus');
    if (f) { f.textContent = SYNC_TEXT[st] || SYNC_TEXT.local; f.dataset.state = st; }
  };
  if (window.MSG.syncStatus) window.MSG.onSyncStatus(window.MSG.syncStatus); // a status sent before this script ran
  window.MSG.onCloudLoad = () => { if (!location.hash.startsWith('#quiz')) route(); else toast('Your saved notes were loaded.'); };
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', () => { Store.reload(); route(); });
  // Study modes, guides, mistake notebook and progress (js/study.js) plug into this router.
  const study = window.MSG.Study.init({ esc, fmt, md, renderMath, toast, ask, go, route, startQuiz, plural, pct, notFound });
  Object.assign(views, study.views); Object.assign(actions, study.actions); Object.assign(forms, study.forms);
  route();
})();

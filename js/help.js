/* "Help" (how to use the site, and what the site is) and "Terms of use" pages: #help and #terms. */
(function (root) {
  'use strict';
  let ui = null;
  const inClaude = () => !!(root.MSG.Sync && root.MSG.Sync.inClaude);

  const SECTIONS = [
    ['start', 'Getting started', () => `
      <ol>
        <li>Type your first name or a nickname on the start page and press <b>Start studying</b>. That makes your profile.</li>
        <li>${inClaude() ? 'On this claude.ai version, everything you add is saved to <b>your own claude.ai account</b>, privately. It follows you to any device where you sign in. If a message at the bottom says your notes are only saved in this browser, ask the person who shared the page with you for <b>Contributor</b> access.' : 'On this website, your notes and progress are saved <b>in this browser</b>. Use <b>Profile → Download backup</b> to keep a copy or move to another device. The claude.ai version saves to your own account instead.'}</li>
        <li>Use the menu at the top: <b>Home</b> (what to study today), <b>My Notes</b>, <b>Test Prep</b>, <b>Categories</b> (built-in topics), <b>Library</b> (guides others shared), <b>Help</b> and <b>Profile</b>. The 🌓 button switches light and dark mode.</li>
      </ol>`],
    ['notes', 'Add your notes', () => `
      <ol>
        <li>Go to <b>My Notes → + Add notes</b>.</li>
        <li>Paste your notes, or press <b>📎 Upload a file</b> for a PDF, a Word (.docx) file or a .txt/.md file.</li>
        <li>Choose <b>📝 Keep my notes as I wrote them</b> or <b>✨ Let AI format my notes</b>. With AI, press <b>Format with AI</b>, compare the two versions, and pick one. You can always undo.</li>
        <li>Press <b>Save notes &amp; build quiz</b>. The site turns your notes into study cards.</li>
      </ol>
      <p class="small">Notes become the best cards when they use <b>Term: definition</b> lines, <b>Q:</b>/<b>A:</b> pairs, headings, and <b>bold</b> key words. You can edit, add, star ⭐ or delete any card.</p>`],
    ['guide', 'Get a study guide for your notes', () => `
      <p>Open a set of notes and choose the <b>✨ Study guide</b> tab, then <b>Make a study guide with AI</b>. You get an overview, key ideas, a concept map, worked examples, common mistakes, timelines and a self-check quiz, built only from your notes. ${inClaude() ? 'Claude writes it with your own Claude account (it asks permission the first time).' : 'On this website you copy a prompt into any AI chat and paste its answer back.'} AI can make mistakes, so check anything important against your notes.</p>`],
    ['study', 'Eight ways to study', () => `
      <p>Every set of notes, built-in topic and AP/IB course has a <b>Ways to study</b> panel:</p>
      <ul>
        <li><b>🃏 Flashcards:</b> tap to flip, then sort into "know it" or "still learning". Star the hard ones.</li>
        <li><b>🧠 Learn:</b> keeps asking until you get each card right twice in a row.</li>
        <li><b>🧩 Matching:</b> a timed game matching terms to definitions.</li>
        <li><b>✅ True / False:</b> quick rounds.</li>
        <li><b>📝 Practice test:</b> optional timer, no answers until the end, then a full review.</li>
        <li><b>⏳ Put in order:</b> timelines and step-by-step processes.</li>
        <li><b>✍️ Written answers:</b> answer exam-style questions in your own words. ${inClaude() ? 'Claude grades them like a mark scheme.' : 'Compare with the model answer and score yourself.'}</li>
        <li><b>📄 Study sheet:</b> everything on one page for the night before.</li>
      </ul>
      <p class="small">🔊 <b>Read aloud</b> buttons read questions and guides out loud.</p>`],
    ['review', 'Daily review and test prep', () => `
      <ul>
        <li><b>Home → Daily review</b> brings back cards right before you'd forget them. Cards you miss come back sooner.</li>
        <li><b>Test Prep:</b> add your test date and pick the notes and topics on it. You get a study plan, a quick quiz, a full practice test and <b>🔥 Cram mode</b>, which repeats what you miss until you get it right.</li>
        <li><b>📕 Mistake notebook</b> (on Home) collects every question you miss so you can redo them.</li>
        <li><b>🏆 Progress</b> (on Home) shows your streak, badges and how well you've mastered each topic.</li>
      </ul>`],
    ['topics', 'No notes? Use the built-in topics', () => `
      <p>Open <b>Categories</b> for 91 topics in math, science, history, English, languages, computer science, and art and music, from elementary school to AP, IB and college. Each has a full study guide and endless new practice questions. The <b>AP &amp; IB courses</b> tab practices a whole course, unit by unit, and can plan a test for it.</p>`],
    ['library', 'Shared library', () => `
      <p>${inClaude() ? 'Open <b>Library</b> to browse study guides shared by students and teachers. <b>+ Add to my notes</b> copies one into your notes so you can study it every way. To share your own, open your notes and press <b>📚 Share</b>. Only you can change or remove what you share. Teachers can press <b>🔗 Copy link</b> and send it to the class.' : 'The shared library is on the claude.ai version of this site, where everyone has an account to share from.'}</p>`],
    ['backup', 'Backups and devices', () => `
      <p><b>Profile → Download backup</b> saves all your notes and progress to a file. <b>Import backup</b> brings them back, on any device. Several people can use one computer: each makes their own profile${inClaude() ? ', and on claude.ai each person\'s account is kept separate' : ''}.</p>`],
    ['about', 'About this site', () => `
      <p><b>Universal Study Guide</b> was created by Myles Hernandez, a student, to help other students study smarter.</p>
      <ul class="promise">
        <li><b>Free.</b> Every feature, for every student. No paywall, no trial.</li>
        <li><b>No ads.</b> Nothing to click, nothing to close.</li>
        <li><b>Your data is never sold.</b> Your notes are yours: private to you, never sold or shared unless you share them to the library yourself.</li>
        <li><b>Not-for-profit.</b> This is a free, non-commercial student project. It is not run to make money.</li>
      </ul>
      ${root.MSG.Community.html('line')}
      <p class="small muted">AP® is a trademark of the College Board and IB is a trademark of the International Baccalaureate Organization; neither is affiliated with or endorses this site.</p>`]
  ];

  function helpView() {
    root.MSG.Community.start();
    return `<div class="page-head"><div><h1>How to use Universal Study Guide</h1><p class="muted">Everything the site can do, step by step.</p></div></div>
      <div class="grid editor help">
        <div class="stack">${SECTIONS.map(([id, title, body]) => `<section class="card help-sec" id="help-${id}"><h2>${title}</h2>${body()}</section>`).join('')}
          <p class="small muted">By using this site you agree to the <a href="#terms">Terms of use</a>.</p></div>
        <nav class="card help-toc" aria-label="On this page"><h3>On this page</h3><ul>${SECTIONS.map(([id, title]) => `<li><button class="link-like" type="button" data-action="help-jump" data-to="help-${id}">${title}</button></li>`).join('')}<li><a href="#terms">Terms of use</a></li></ul></nav>
      </div>`;
  }

  function termsView() {
    return `<div class="page-head"><div><a href="#help" class="muted small">← Help</a><h1>Terms of use</h1><p class="muted">Short and plain. Last updated November 2026.</p></div></div>
      <article class="card terms">
        <h2>1. Who owns this site</h2>
        <p>Universal Study Guide, including its code, design, look, logo, name, study guides, reference sheets, practice questions and everything else that makes it work, is © 2026 Myles Hernandez. <b>All rights reserved.</b></p>
        <h2>2. What you may do</h2>
        <p>You may use the site to study, for free, as much as you like. Teachers may use it with their classes and share links to it.</p>
        <h2>3. What you may not do</h2>
        <ul>
          <li>Copy, download, save, reuse or republish the site's <b>code</b> (its HTML, CSS, JavaScript or anything else behind the page), in whole or in part.</li>
          <li>Copy or republish its <b>design</b>, its <b>study guides</b>, reference sheets or practice questions, or make a copy of the site.</li>
          <li>Take the site apart to see how it works (reverse engineering), or use bots or scripts to copy its content.</li>
          <li>Use the name "Universal Study Guide" or its logo for something else.</li>
          <li>Break, overload or attack the site, or try to get into anyone else's notes or account.</li>
        </ul>
        <p>Being able to see the code in your browser does not give you permission to use it. To ask permission for anything above, contact the site's owner.</p>
        <h2>4. Your notes</h2>
        <p>Your notes and study cards belong to you. They are private to you ${inClaude() ? '(saved to your own claude.ai account)' : '(saved in your browser)'}. If you share something to the shared library, everyone who uses the site can read it and add it to their own notes for studying; you can stop sharing at any time, and the site's owner may remove anything shared. Don't share anything personal or anything you don't have the right to share.</p>
        <h2>5. AI features</h2>
        <p>AI formatting, AI study guides and AI grading are optional. ${inClaude() ? 'On claude.ai they use your own Claude account, only when you choose them.' : 'On this website they work by copying a prompt into an AI chat of your choice.'} AI can make mistakes: check anything important against your class notes.</p>
        <h2>6. A free, not-for-profit project</h2>
        <p>The site is free, has no ads, and never sells your data. It is a non-commercial student project, provided "as is", without guarantees. It is not a replacement for your teacher or your class materials.</p>
        <h2>7. Trademarks</h2>
        <p>AP® is a trademark of the College Board. IB is a trademark of the International Baccalaureate Organization. Neither is affiliated with or endorses this site.</p>
      </article>`;
  }

  function init(helpers) {
    ui = helpers;
    return {
      views: { help: helpView, terms: termsView },
      actions: { 'help-jump': (el) => { const t = document.getElementById(el.dataset.to); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
    };
  }
  root.MSG.Help = { init };
})(typeof window !== 'undefined' ? window : globalThis);

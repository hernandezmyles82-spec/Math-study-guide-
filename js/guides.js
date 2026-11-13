/* Full study guides for the built-in topics: overview, key ideas, worked examples, common mistakes,
   a self-check, and optional timelines and step-by-step lists (used by the "Put it in order" game).

   Each guide is written in a small text format, added with MSG.Guides.add(raw):

     @@ topic-id
     ## Overview
     Paragraphs and "- bullets", with **bold** and $math$.
     ## Key ideas
     ## Worked examples
     Example: the problem
     Solution: the steps (more lines may follow)
     Answer: the final answer
     ## Common mistakes
     ## Timeline
     - 1776: Declaration of Independence        (years may be "476 CE", "3000 BCE", "1914–1918",
                                                 or "4.6 billion years ago")
     ## In order: Steps of mitosis
     - Prophase: chromosomes condense            (listed in the correct order)
     ## Check yourself
     Q: a question
     A: its answer
*/
(function (root) {
  'use strict';
  const guides = {};

  /* "1776", "476 CE", "3000 BCE", "c. 1450", "1914–1918" → a sortable number (BCE is negative). */
  function yearOf(s) {
    const ago = String(s).match(/^(?:about\s+)?([\d.,]+)\s*(thousand|million|billion)?\s+years\s+ago$/i);
    if (ago) return -Number(ago[1].replace(/,/g, '')) * ({ thousand: 1e3, million: 1e6, billion: 1e9 }[String(ago[2]).toLowerCase()] || 1);
    const m = String(s).match(/^(?:c\.\s*|about\s+)?(\d{1,4})(?:\s*[–-]\s*\d{1,4})?\s*(BCE|BC|CE|AD)?$/i);
    if (!m) return null;
    const y = Number(m[1]);
    return m[2] && /^BC/i.test(m[2]) ? -y : y;
  }

  function parseOne(id, text) {
    const g = { id, sections: [], examples: [], check: [], timeline: [], orders: [] };
    let sec = null;
    let ex = null, q = null;
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      let m;
      if ((m = line.match(/^##\s+(.*)$/))) {
        const title = m[1].trim();
        ex = null; q = null;
        if (/^in order\b/i.test(title)) { sec = { kind: 'order', title: title.replace(/^in order\s*:?\s*/i, '') || 'Put these in order', items: [] }; g.orders.push(sec); continue; }
        const kind = /^worked examples?$/i.test(title) ? 'examples' : /^check yourself$/i.test(title) ? 'check' : /^timeline$/i.test(title) ? 'timeline' : 'text';
        sec = { kind, title, lines: [] };
        if (kind === 'text') g.sections.push(sec);
        continue;
      }
      if (!sec || !line) { if (sec && sec.kind === 'text') sec.lines.push(''); continue; }
      if (sec.kind === 'text') { sec.lines.push(raw.replace(/\s+$/, '')); continue; }
      if (sec.kind === 'order') { if ((m = line.match(/^[-*]\s+(.*)$/))) sec.items.push(m[1]); continue; }
      if (sec.kind === 'timeline') {
        if ((m = line.match(/^[-*]\s+([^:]+?):\s+(.*)$/))) { const y = yearOf(m[1].trim()); if (y != null) g.timeline.push({ when: m[1].trim(), year: y, label: m[2] }); }
        continue;
      }
      if (sec.kind === 'examples') {
        if ((m = line.match(/^Example:\s*(.*)$/i))) { ex = { problem: m[1], solution: [], answer: '' }; g.examples.push(ex); continue; }
        if (!ex) continue;
        if ((m = line.match(/^Solution:\s*(.*)$/i))) { if (m[1]) ex.solution.push(m[1]); continue; }
        if ((m = line.match(/^Answer:\s*(.*)$/i))) { ex.answer = m[1]; continue; }
        ex.solution.push(line);
        continue;
      }
      if (sec.kind === 'check') {
        if ((m = line.match(/^Q:\s*(.*)$/))) { q = { q: m[1], a: '' }; g.check.push(q); continue; }
        if ((m = line.match(/^A:\s*(.*)$/)) && q) { q.a = m[1]; continue; }
        if (q && q.a) q.a += ' ' + line;
      }
    }
    g.sections.forEach((s) => { s.text = s.lines.join('\n').trim(); delete s.lines; });
    g.sections = g.sections.filter((s) => s.text);
    g.orders = g.orders.filter((o) => o.items.length >= 3);
    return g;
  }

  function add(raw) {
    String(raw).split(/^@@\s*/m).slice(1).forEach((chunk) => {
      const nl = chunk.indexOf('\n');
      const id = chunk.slice(0, nl).trim();
      if (id) guides[id] = parseOne(id, chunk.slice(nl + 1));
    });
  }

  root.MSG = root.MSG || {};
  root.MSG.Guides = { add, get: (id) => guides[id] || null, has: (id) => !!guides[id], ids: () => Object.keys(guides), yearOf, parseOne };
})(typeof window !== 'undefined' ? window : globalThis);

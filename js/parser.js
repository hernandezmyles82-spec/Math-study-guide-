/* Turns free-form math notes (handwritten-style, Markdown, or notes produced by ChatGPT / Claude / any AI)
   into study cards. Recognizes:
     - headings (# Topic, **Topic**, "Topic:" alone)       -> sets the topic for following cards
     - "Term: definition", "**Term** - definition"          -> definition cards
     - "Name: formula" / "Name:" followed by $$formula$$   -> formula cards
     - "X is defined as / means / refers to / is called"    -> definition cards
     - Q: ... A: ...                                        -> question cards
     - Example/Problem: ... Solution/Answer: ...            -> worked-problem cards
     - Markdown tables                                      -> one card per row
     - "front :: back" (explicit card) and {{cloze}} blanks
     - sentences with **bold** words, key math vocabulary, or numbers -> fill-in-the-blank cards */
(function (root) {
  'use strict';

  const SKIP_TERM = /^(examples?|ex|e\.g|i\.e|for example|notes?|tips?|hints?|solutions?|answers?|ans|steps?\s*\d*|problems?\s*\d*|exercises?|practice|remember|important|warning|caution|key (ideas?|points?|takeaways?|concepts?|terms?|formulas?)|summary|overview|why|how|so|therefore|thus|hence|given|find|solve|proof|recall|questions?|q|a|results?|goals?|objectives?|topics?|units?|chapters?|lessons?|sections?|parts?|date|name|class|period|check|work|method|then|next|first|second|third|finally|also|now|where|if|when|because|since|let|suppose|assume|case\s*\d*|output|input|graph|table|figure|source|definitions?|formulas?|rules?|properties|vocabulary|theorems?|key terms)$/i;

  const VOCAB = [
    'standard deviation', 'absolute value', 'chain rule', 'product rule', 'quotient rule', 'power rule',
    'fundamental theorem', 'pythagorean theorem', 'slope-intercept form', 'point-slope form', 'quadratic formula',
    'least common multiple', 'greatest common factor', 'common denominator', 'unit circle', 'inflection point',
    'critical point', 'local maximum', 'local minimum', 'horizontal asymptote', 'vertical asymptote',
    'derivative', 'integral', 'antiderivative', 'slope', 'intercept', 'vertex', 'asymptote', 'domain', 'range',
    'limit', 'continuous', 'polynomial', 'quadratic', 'linear', 'exponent', 'logarithm', 'radius', 'diameter',
    'circumference', 'hypotenuse', 'perpendicular', 'parallel', 'sine', 'cosine', 'tangent', 'secant', 'matrix',
    'determinant', 'eigenvalue', 'eigenvector', 'vector', 'scalar', 'mean', 'median', 'mode', 'variance',
    'probability', 'prime', 'composite', 'coefficient', 'constant', 'variable', 'numerator', 'denominator',
    'reciprocal', 'inverse', 'rational', 'irrational', 'integer', 'converges', 'diverges', 'convergent',
    'divergent', 'series', 'sequence', 'subset', 'union', 'intersection', 'homomorphism', 'isomorphism',
    'area', 'volume', 'perimeter', 'hypothesis', 'factor', 'product', 'quotient', 'sum', 'difference',
    'radian', 'degree', 'acute', 'obtuse', 'right angle', 'congruent', 'similar', 'parabola', 'hyperbola',
    'ellipse', 'function', 'exponential', 'positive', 'negative', 'zero', 'undefined', 'infinity'
  ];
  const VOCAB_RE = new RegExp('\\b(' + VOCAB.map((v) => v.replace(/[-]/g, '\\-')).join('|') + ')\\b', 'i');

  const BULLET = /^\s*(?:[-*+•▪◦‣>]|\d{1,3}[.)]|[a-z][.)])\s+/i;
  function stripBullet(s) { return s.replace(BULLET, '').trim(); }
  function stripMd(s) {
    return String(s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/`([^`]+)`/g, '$1')
      .replace(/^#+\s*/, '').trim();
  }
  function words(s) { return stripMd(s).split(/\s+/).filter(Boolean).length; }
  function mathy(s) { return /=|\\[a-z]+|\$|\^|[√π∫Σ≤≥≠±∞]|\b[a-z]\s*\(\s*[a-z]\s*\)/i.test(s); }
  function isFormula(s) { return /=|[≤≥<>]/.test(s) && mathy(s) || /^\s*(\$\$|\\\[|\$)/.test(s); }
  function hidesLatex(s, idx) {
    // true if position idx is inside $...$ or \( \) (so we don't blank out part of a formula)
    const before = s.slice(0, idx);
    const dollars = (before.match(/(?<!\\)\$/g) || []).length;
    const opens = (before.match(/\\\(/g) || []).length - (before.match(/\\\)/g) || []).length;
    return dollars % 2 === 1 || opens > 0;
  }

  /* First run of capitalized words in a sentence, allowing small joining words and Roman numerals
     ("Treaty of Versailles", "World War II"). A single capitalized word that only starts the sentence,
     or a common word like "The", does not count. */
  const NOT_NAMES = new Set(['The', 'A', 'An', 'In', 'On', 'At', 'It', 'Its', 'This', 'That', 'These', 'Those', 'He', 'She', 'They', 'We', 'I', 'You', 'His', 'Her', 'Their', 'Our', 'My',
    'When', 'After', 'Before', 'During', 'Because', 'If', 'As', 'By', 'For', 'From', 'To', 'With', 'Without', 'And', 'But', 'Or', 'So', 'Then', 'There', 'Here', 'What', 'Why', 'How', 'Who', 'Each', 'Every', 'Most', 'Many', 'Some', 'All', 'One', 'Also', 'Both']);
  const JOINERS = new Set(['of', 'the', 'and', 'de', 'del', 'la', 'von', 'van', 'du', 'des', 'for', 'on']);
  function properNoun(text) {
    const re = /[A-Za-z][A-Za-z'’.-]*/g;
    const toks = [];
    let mm;
    while ((mm = re.exec(text))) toks.push({ w: mm[0].replace(/[.'’-]+$/, ''), i: mm.index });
    const cap = (w) => /^[A-Z][a-z'’.-]*[A-Za-z]$|^[A-Z]{2,}$|^[A-Z]$/.test(w) && !NOT_NAMES.has(w);
    const roman = (w) => /^[IVX]+$/.test(w);
    for (let k = 0; k < toks.length; k++) {
      if (!cap(toks[k].w) || roman(toks[k].w)) continue;
      let end = k;
      for (let j = k + 1; j < toks.length; j++) {
        if (text.slice(toks[j - 1].i + toks[j - 1].w.length, toks[j].i).trim() !== '') break; // punctuation between words ends the name
        if (cap(toks[j].w) || roman(toks[j].w)) end = j;
        else if (JOINERS.has(toks[j].w) && j + 1 < toks.length && cap(toks[j + 1].w)) continue;
        else break;
      }
      const startsSentence = k === 0 || /[.!?:]\s*$/.test(text.slice(0, toks[k].i));
      if (startsSentence && end === k) continue; // a lone capital that just starts the sentence
      const from = toks[k].i, to = toks[end].i + toks[end].w.length;
      return { text: text.slice(from, to), idx: from };
    }
    return null;
  }

  function validTerm(t) {
    const clean = stripMd(t).replace(/[:\-–—]+$/, '').trim();
    if (!clean || clean.length > 70) return false;
    if (/[?.!]$/.test(clean)) return false;
    if (SKIP_TERM.test(clean)) return false;
    if (/^(step|example|problem|ex|q|question|answer|solution)\s*\d+/i.test(clean)) return false;
    if (clean.includes('=')) return false;
    const n = words(clean);
    return n >= 1 && n <= 8;
  }

  function proseWords(s) { return stripMd(s).replace(/\$[^$]*\$|\\\(.*?\\\)/g, ' ').split(/\s+/).filter((w) => /^[a-z]{2,}$/i.test(w)).length; }
  function defCard(term, def, topic, forceFormula) {
    term = stripMd(term).replace(/[:\-–—]+$/, '').trim();
    def = stripMd(def).trim();
    if (!def || def.length < 2) return null;
    if (/\\[a-zA-Z]+/.test(def) && !/\$|\\\(|\\\[/.test(def)) def = '$' + def + '$';
    const formula = forceFormula || /^\s*(\$|\\\[|\\\()/.test(def) || (isFormula(def) && proseWords(def) < 4);
    return {
      type: 'def', term, back: def, topic,
      front: formula ? 'What is the formula for ' + term + '?' : 'What does "' + term + '" mean?'
    };
  }

  /* Join multi-line display math ($$ ... $$ or \[ ... \]) into single lines. */
  function joinDisplayMath(lines) {
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      const open = t === '$$' || t === '\\[' || (t.startsWith('$$') && !t.slice(2).includes('$$')) || (t.startsWith('\\[') && !t.includes('\\]'));
      if (open) {
        const close = t.startsWith('$$') ? '$$' : '\\]';
        const buf = [t];
        let j = i + 1;
        while (j < lines.length && !lines[j].includes(close)) buf.push(lines[j++].trim());
        if (j < lines.length) { buf.push(lines[j].trim()); out.push(buf.join(' ')); i = j; continue; }
      }
      out.push(lines[i]);
    }
    return out;
  }

  function parseNotes(text, opts) {
    opts = opts || {};
    const lines = joinDisplayMath(String(text || '').replace(/\r\n?/g, '\n').split('\n'));
    let topic = opts.title || 'General';
    const cards = [];
    const seen = new Set();
    const add = (c) => {
      if (!c || !c.front || !c.back) return;
      c.front = c.front.trim(); c.back = String(c.back).trim();
      if (!c.back || c.front === c.back) return;
      const k = (c.front + '|' + c.back).toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      c.topic = c.topic || topic;
      cards.push(c);
    };
    const nextNonEmpty = (i) => { for (let j = i + 1; j < lines.length; j++) if (lines[j].trim()) return j; return -1; };
    const isHeadingLine = (t) => /^#{1,6}\s/.test(t);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || /^(-{3,}|\*{3,}|_{3,})$/.test(line)) continue;
      let m;

      // Headings
      if ((m = line.match(/^#{1,6}\s+(.+)$/))) { topic = stripMd(m[1]).replace(/:$/, '').trim() || topic; continue; }

      // Tables
      if (line.startsWith('|')) {
        const rows = [];
        let j = i;
        while (j < lines.length && lines[j].trim().startsWith('|')) {
          const r = lines[j].trim();
          if (!/^[|\s:\-]+$/.test(r)) rows.push(r.replace(/^\||\|$/g, '').split('|').map((x) => stripMd(x.trim())));
          j++;
        }
        i = j - 1;
        if (rows.length >= 2) {
          const head = rows[0];
          rows.slice(1).forEach((r) => {
            if (!r[0]) return;
            if (r.length === 2 || head.length === 2) {
              const generic = !head[1] || /^(definition|meaning|description|explanation|notes?|what it means|value)$/i.test(head[1]);
              const c = defCard(r[0], r[1], topic);
              if (c && !generic) c.front = head[1] + ' of ' + c.term + '?';
              add(c);
            }
            else for (let k = 1; k < r.length; k++) {
              if (r[k]) add({ type: 'qa', front: (head[k] || 'Value') + ' for ' + r[0] + '?', back: r[k], topic });
            }
          });
        }
        continue;
      }

      const s = stripBullet(line);

      // Explicit card: front :: back
      if ((m = s.match(/^(.+?)\s*::\s*(.+)$/))) { add({ type: 'qa', front: stripMd(m[1]), back: stripMd(m[2]), topic }); continue; }

      // Explicit cloze {{answer}}
      if (/\{\{[^}]+\}\}/.test(s)) {
        const re = /\{\{([^}]+)\}\}/g;
        let mm;
        while ((mm = re.exec(s))) {
          const unwrap = (x) => stripMd(x.replace(/\{\{([^}]+)\}\}/g, '$1'));
          const front = unwrap(s.slice(0, mm.index)) + ' _____ ' + unwrap(s.slice(mm.index + mm[0].length));
          add({ type: 'cloze', front, back: mm[1].trim(), topic });
        }
        continue;
      }

      // Q: ... A: ...
      if ((m = s.match(/^(?:\*\*)?(?:Q|Question|Practice Question|Quiz)\s*\d*\s*[:.)\-](?:\*\*)?\s*(.+)$/i))) {
        let q = m[1], a = '';
        const inline = q.match(/^(.*?)\s+(?:\*\*)?(?:A|Answer|Ans)\s*[:.)](?:\*\*)?\s*(.+)$/i);
        if (inline) { q = inline[1]; a = inline[2]; }
        else {
          let j = nextNonEmpty(i);
          while (j !== -1 && !a) {
            const t = stripBullet(lines[j].trim());
            const am = t.match(/^(?:\*\*)?(?:A|Answer|Ans|Solution)\s*\d*\s*[:.)\-](?:\*\*)?\s*(.*)$/i);
            if (am) {
              a = am[1];
              let k = j + 1;
              while (!a && k < lines.length && lines[k].trim()) { a = lines[k].trim(); k++; }
              i = Math.max(i, k - 1, j);
              break;
            }
            if (/^(?:\*\*)?(?:Q|Question)\s*\d*\s*[:.)]/i.test(t) || isHeadingLine(lines[j].trim())) break;
            q += ' ' + t; i = j; j = nextNonEmpty(j);
          }
        }
        if (a) add({ type: 'qa', front: stripMd(q), back: stripMd(a), topic });
        continue;
      }

      // Example / Problem with a solution
      if ((m = s.match(/^(?:\*\*)?(Example|Ex|Problem|Practice|Exercise|Try it|Try this|Sample problem)\s*#?\d*\s*[:.)\-](?:\*\*)?\s*(.*)$/i))) {
        let q = m[2] || '';
        const ansLines = [];
        let inAns = false, finalAns = '';
        let j = i + 1;
        for (; j < lines.length; j++) {
          const raw = lines[j].trim();
          if (isHeadingLine(raw)) break;
          if (!raw) { if (inAns && ansLines.length) break; continue; }
          const t = stripBullet(raw);
          if (/^(?:\*\*)?(Example|Ex|Problem|Practice|Exercise|Q|Question)\s*#?\d*\s*[:.)]/i.test(t)) break;
          const am = t.match(/^(?:\*\*)?(Solution|Answer|Ans|Final answer|Steps|Work|Result)\s*[:.)\-](?:\*\*)?\s*(.*)$/i);
          if (am) {
            inAns = true;
            if (am[2]) { ansLines.push(am[2]); if (/answer|result/i.test(am[1])) finalAns = am[2]; }
            continue;
          }
          if (inAns) ansLines.push(t); else q += (q ? ' ' : '') + t;
        }
        if (q && ansLines.length) {
          add({ type: 'problem', front: 'Solve: ' + stripMd(q), back: stripMd(finalAns || ansLines[ansLines.length - 1]), work: ansLines.map(stripMd).join('\n'), topic });
          i = j - 1;
        }
        continue;
      }

      // A label alone on a line ("Power Rule:" or "**Definition of a limit**") followed by a formula
      if ((m = s.match(/^(?:\*\*)?([^*:]{2,70}?)(?:\*\*)?\s*:?(?:\*\*)?$/)) && (s.endsWith(':') || /^\*\*.*\*\*:?$/.test(s))) {
        const j = nextNonEmpty(i);
        const nxt = j !== -1 ? lines[j].trim() : '';
        if (nxt && validTerm(m[1]) && isFormula(stripBullet(nxt)) && !/^(.{1,60}?)\s*:\s+/.test(stripBullet(nxt))) {
          add(defCard(m[1], stripBullet(nxt), topic, true));
          i = j;
        } else if (!SKIP_TERM.test(stripMd(m[1]).trim())) {
          topic = stripMd(m[1]).trim();
        }
        continue;
      }

      // Term: definition / **Term** - definition / Term — definition
      let term = null, def = null;
      const bold = s.match(/^(\*\*|__)(.+?)\1\s*(.*)$/);
      if (bold && bold[3]) {
        const rest = bold[3].replace(/^[:\-–—=]\s*/, '').trim();
        if (/^[:\-–—]/.test(bold[3]) || /[:\-–—]$/.test(bold[2])) { term = bold[2]; def = rest; }
      }
      if (!term && (m = s.match(/^([^:]{1,70}?)\s*:\s+(.+)$/)) && !/\$[^$]*$/.test(m[1])) { term = m[1]; def = m[2]; }
      if (!term && (m = s.match(/^(.{1,60}?)\s+[–—-]\s+(.+)$/)) && !mathy(m[1])) { term = m[1]; def = m[2]; }
      if (term && validTerm(term)) { add(defCard(term, def, topic)); continue; }

      // Natural-language definitions
      const plain = stripMd(s);
      if ((m = plain.match(/^(.{2,60}?)\s+is called (?:an? |the )?(.{2,50}?)\.?$/i))) {
        add({ type: 'def', term: m[2], front: 'What is "' + m[2] + '"?', back: m[1], topic }); continue;
      }
      if ((m = plain.match(/^(?:an? |the )?(.{2,50}?)\s+(?:is defined as|is defined to be|means|refers to|is known as|is when|occurs when|is the|is an?|are)\s+(.{6,})$/i)) && words(m[1]) <= 6 && !mathy(m[1]) && !/^(it|this|that|there|these|those|which|what|here|they|we|you)$/i.test(m[1])) {
        const back = m[2].replace(/\.$/, '');
        const lead = /\b(is the|is an?|are)\b/i.exec(plain);
        const glue = lead ? lead[0].replace(/^(is|are)\s*/i, '') : '';
        add({ type: 'def', term: m[1], front: 'What does "' + m[1] + '" mean?', back: (glue ? glue + ' ' : '') + back, topic });
        continue;
      }

      // Standalone formula: "A = πr^2" or "Area of a circle = πr^2"
      if (/=/.test(plain) && (plain.match(/=/g) || []).length <= 2 && mathy(plain)) {
        const eq = plain.replace(/^\$+|\$+$/g, '').replace(/^\\\[|\\\]$/g, '').trim();
        const k = eq.indexOf('=');
        const lhs = eq.slice(0, k).trim(), rhs = eq.slice(k + 1).trim();
        if (lhs && rhs && /[a-zA-Z\\]/.test(eq)) {
          if (words(lhs) >= 2 && !mathy(lhs)) add(defCard(lhs, rhs, topic, true));
          else add({ type: 'cloze', front: 'Complete the formula (' + topic + '): $' + lhs + ' = $ ?', back: '$' + rhs + '$', topic });
        }
        continue;
      }

      // Fill-in-the-blank from sentences
      if (words(plain) >= 5 && words(plain) <= 45) {
        let blank = null;
        const bm = s.match(/\*\*(.+?)\*\*/);
        if (bm && words(bm[1]) <= 5) blank = { text: stripMd(bm[1]), src: stripMd(s), idx: stripMd(s).indexOf(stripMd(bm[1])) };
        if (!blank) { // a year: history notes ("... in 1776")
          const ym = /(^|[\s(])((?:1[0-9]|20)\d{2})(?=[\s,.;)]|$)/.exec(plain);
          if (ym && !hidesLatex(plain, ym.index)) blank = { text: ym[2], src: plain, idx: ym.index + ym[1].length };
        }
        if (!blank) {
          const vm = VOCAB_RE.exec(plain);
          if (vm && !hidesLatex(plain, vm.index)) blank = { text: vm[1], src: plain, idx: vm.index };
        }
        if (!blank) { // a name: person, place, event, document ("Thomas Jefferson", "Treaty of Versailles")
          const pn = properNoun(plain);
          if (pn && !hidesLatex(plain, pn.idx)) blank = { text: pn.text, src: plain, idx: pn.idx };
        }
        if (!blank) {
          const nm = /(^|[\s(])(-?\d+(?:\.\d+)?%?)(?=[\s,.;)]|$)/.exec(plain);
          if (nm && !hidesLatex(plain, nm.index)) blank = { text: nm[2], src: plain, idx: nm.index + nm[1].length };
        }
        if (blank && blank.idx >= 0) {
          const front = blank.src.slice(0, blank.idx) + '_____' + blank.src.slice(blank.idx + blank.text.length);
          add({ type: 'cloze', front: 'Fill in the blank: ' + front, back: blank.text, topic });
        }
      }
    }
    return cards;
  }

  root.MSG = root.MSG || {};
  root.MSG.parseNotes = parseNotes;
})(typeof window !== 'undefined' ? window : globalThis);

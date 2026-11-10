/* Shared helpers: randomness, escaping, dates, math-expression evaluation and answer checking. */
(function (root) {
  'use strict';
  const U = {};

  U.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  U.ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  U.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  U.nz = (a, b) => { let v = 0; while (v === 0) v = U.ri(a, b); return v; };
  U.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  U.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  U.lcm = (a, b) => Math.abs(a * b) / U.gcd(a, b);
  U.fact = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  U.nCr = (n, r) => { if (r < 0 || r > n) return 0; let x = 1; for (let i = 1; i <= r; i++) x = x * (n - r + i) / i; return Math.round(x); };

  U.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  U.dateKey = (t) => {
    const d = new Date(t == null ? Date.now() : t);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  U.daysUntil = (dateStr) => {
    const [y, m, d] = String(dateStr).split('-').map(Number);
    const target = new Date(y, m - 1, d);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((target - now) / 86400000);
  };

  /* ---------- Safe arithmetic evaluator (no eval) ----------
     Supports + - * / ^, parentheses, sqrt, pi, e, %, implicit multiplication
     and simple LaTeX like \frac{a}{b}, \sqrt{x}, \pi, \cdot. Returns NaN if it can't parse. */
  function prep(input) {
    let s = String(input == null ? '' : input).trim().toLowerCase();
    s = s.replace(/^[a-z]\s*(\([a-z]\))?\s*=\s*/, ''); // "x = 3" -> "3"
    let prev;
    do {
      prev = s;
      s = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '(($1)/($2))')
        .replace(/\\sqrt\s*\{([^{}]*)\}/g, 'sqrt($1)');
    } while (s !== prev);
    s = s.replace(/\\left|\\right|\$|\\\(|\\\)|\\\[|\\\]|\\,|\\!|\\;/g, '')
      .replace(/\\pi|π/g, 'pi').replace(/√/g, 'sqrt').replace(/\\sqrt/g, 'sqrt')
      .replace(/\\cdot|\\times|×|·/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-')
      .replace(/\{/g, '(').replace(/\}/g, ')')
      .replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
      .replace(/\s+/g, '');
    return s;
  }

  U.evalExpr = function (input) {
    const s = prep(input);
    if (!s) return NaN;
    const re = /\d+\.?\d*|\.\d+|sqrt|pi|e|[+\-*/^()%]/y;
    const toks = [];
    re.lastIndex = 0;
    while (re.lastIndex < s.length) {
      const start = re.lastIndex;
      const m = re.exec(s);
      if (!m || m.index !== start) return NaN;
      toks.push(m[0]);
    }
    let i = 0;
    const peek = () => toks[i];
    const startsPrimary = (t) => t != null && (/^[\d.]/.test(t) || t === '(' || t === 'pi' || t === 'e' || t === 'sqrt');
    function expr() {
      let v = term();
      while (peek() === '+' || peek() === '-') { const op = toks[i++]; const r = term(); v = op === '+' ? v + r : v - r; }
      return v;
    }
    function term() {
      let v = unary();
      for (;;) {
        const t = peek();
        if (t === '*' || t === '/') { i++; const r = unary(); v = t === '*' ? v * r : v / r; }
        else if (startsPrimary(t)) { v = v * power(); }
        else break;
      }
      return v;
    }
    function unary() {
      if (peek() === '-') { i++; return -unary(); }
      if (peek() === '+') { i++; return unary(); }
      return power();
    }
    function power() {
      let b = primary();
      if (peek() === '%') i++; // "75%" is read as 75
      if (peek() === '^') { i++; return Math.pow(b, unary()); }
      return b;
    }
    function primary() {
      const t = toks[i++];
      if (t == null) throw new Error('eof');
      if (/^[\d.]/.test(t)) return parseFloat(t);
      if (t === 'pi') return Math.PI;
      if (t === 'e') return Math.E;
      if (t === 'sqrt') return Math.sqrt(power());
      if (t === '(') { const v = expr(); if (toks[i++] !== ')') throw new Error('paren'); return v; }
      throw new Error('bad token ' + t);
    }
    try {
      const v = expr();
      return i === toks.length ? v : NaN;
    } catch (e) { return NaN; }
  };

  /* Normalize free-text answers for comparison. */
  U.normalize = function (s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2')
      .replace(/\\left|\\right|\$|\\\(|\\\)|\\\[|\\\]|\*\*|__|`/g, '')
      .replace(/[−–]/g, '-')
      .replace(/^\s*(the|a|an)\s+/, '')
      .replace(/[{}\s]/g, '')
      .replace(/[.,;:!?]+$/, '');
  };

  function lev(a, b) {
    if (a === b) return 0;
    const dp = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = dp[0]; dp[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[b.length];
  }
  U.lev = lev;

  U.checkNumeric = function (input, value, tol) {
    const x = U.evalExpr(input);
    if (!isFinite(x)) return false;
    const t = tol != null ? tol : 1e-6 * Math.max(1, Math.abs(value));
    return Math.abs(x - value) <= t + 1e-12;
  };

  U.checkText = function (input, answer) {
    if (!String(input || '').trim()) return false;
    // "slope or gradient": either word is accepted. Only for plain-word answers, so that
    // "x = 2 or x = -3" still needs both roots.
    if (/^[a-z\s'-]+$/i.test(String(answer).trim())) {
      const alts = String(answer).split(/\s+or\s+/i).filter(Boolean);
      if (alts.length > 1 && alts.some((a) => U.checkText(input, a))) return true;
    }
    const a = U.normalize(input), b = U.normalize(answer);
    if (!b) return false;
    if (a === b) return true;
    const x = U.evalExpr(input), y = U.evalExpr(answer);
    if (isFinite(x) && isFinite(y)) return Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(y));
    // Allow a typo only in plain words. In math ("x^2+1" vs "x^2-1") one character changes the answer.
    if (/^[a-z'-]+$/.test(b) && b.length >= 5 && lev(a, b) <= (b.length >= 12 ? 2 : 1)) return true;
    return false;
  };

  root.MSG = root.MSG || {};
  root.MSG.U = U;
})(typeof window !== 'undefined' ? window : globalThis);

/* Randomized practice-problem generators for each library category.
   Each generator takes a difficulty d (1 = easy, 2 = medium, 3 = hard) and returns a question:
     { kind: 'input', prompt, answer: <number>, answerDisplay, tol?, explain }
     { kind: 'mc',    prompt, choices: [latex strings], correct: <index>, explain } */
(function (root) {
  'use strict';
  const U = root.MSG.U;
  const { ri, pick, nz, gcd, shuffle } = U;
  const L = String.raw;
  const m = (s) => '\\(' + s + '\\)';

  /* ---------- builders ---------- */
  function num(prompt, answer, explain, opts) {
    opts = opts || {};
    return { kind: 'input', prompt, answer, answerDisplay: opts.display != null ? opts.display : fmtNum(answer), tol: opts.tol, explain };
  }
  function mc(prompt, correct, wrongs, explain) {
    const seen = new Set([String(correct)]);
    const ws = [];
    wrongs.forEach((w) => { const k = String(w); if (!seen.has(k)) { seen.add(k); ws.push(k); } });
    const choices = shuffle([String(correct)].concat(shuffle(ws).slice(0, 3)));
    return { kind: 'mc', prompt, choices, correct: choices.indexOf(String(correct)), explain };
  }
  function fmtNum(x) {
    if (Number.isInteger(x)) return String(x);
    const f = toFrac(x);
    if (f) return f.d === 1 ? String(f.n) : f.n + '/' + f.d;
    return String(Math.round(x * 1000) / 1000);
  }
  function toFrac(x, maxD) {
    maxD = maxD || 200;
    for (let d = 1; d <= maxD; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return { n, d }; }
    return null;
  }
  function frac(n, d) { // LaTeX for n/d, simplified
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1; n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  }
  function fracVal(x) { const f = toFrac(x, 1000); return f ? frac(f.n, f.d) : String(Math.round(x * 1000) / 1000); }
  function poly(cs, v) { // coefficients from highest degree
    v = v || 'x';
    const n = cs.length - 1;
    let out = '';
    cs.forEach((c, i) => {
      const p = n - i;
      if (c === 0) return;
      const a = Math.abs(c);
      const coef = a === 1 && p > 0 ? '' : String(a);
      const term = p === 0 ? String(a) : p === 1 ? coef + v : coef + v + '^{' + p + '}';
      out += out ? (c < 0 ? ' - ' : ' + ') + term : (c < 0 ? '-' : '') + term;
    });
    return out || '0';
  }
  const evalPoly = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  function linXY(a, b) { // "ax + by" in LaTeX
    const t = (c, v, first) => {
      if (c === 0) return '';
      const mag = Math.abs(c) === 1 ? '' : Math.abs(c);
      if (first) return (c < 0 ? '-' : '') + mag + v;
      return (c < 0 ? ' - ' : ' + ') + mag + v;
    };
    const head = t(a, 'x', true);
    return head ? head + t(b, 'y', false) : t(b, 'y', true);
  }
  const sgn = (b) => (b < 0 ? '- ' + Math.abs(b) : '+ ' + b);
  const paren = (x) => (x < 0 ? '(' + x + ')' : String(x));
  function cx(re, im) { // complex number LaTeX
    if (im === 0) return String(re);
    const imPart = (Math.abs(im) === 1 ? '' : Math.abs(im)) + 'i';
    if (re === 0) return (im < 0 ? '-' : '') + imPart;
    return re + (im < 0 ? ' - ' : ' + ') + imPart;
  }
  const R = (d, a, b, c) => [a, b, c][d - 1];
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

  /* ---------- trig exact values ---------- */
  const SIN_REF = { 0: '0', 30: L`\frac{1}{2}`, 45: L`\frac{\sqrt{2}}{2}`, 60: L`\frac{\sqrt{3}}{2}`, 90: '1' };
  const TAN_REF = { 0: '0', 30: L`\frac{\sqrt{3}}{3}`, 45: '1', 60: L`\sqrt{3}`, 90: 'undefined' };
  const TRIG_VALUES = ['0', '1', '-1', L`\frac{1}{2}`, L`-\frac{1}{2}`, L`\frac{\sqrt{2}}{2}`, L`-\frac{\sqrt{2}}{2}`, L`\frac{\sqrt{3}}{2}`, L`-\frac{\sqrt{3}}{2}`, L`\sqrt{3}`, L`-\sqrt{3}`, L`\frac{\sqrt{3}}{3}`, L`-\frac{\sqrt{3}}{3}`, 'undefined'];
  function refAngle(deg) { const a = ((deg % 180) + 180) % 180; return a > 90 ? 180 - a : a; }
  function trigExact(fn, deg) {
    const r = deg * Math.PI / 180;
    const s = Math.sin(r), c = Math.cos(r);
    const ref = refAngle(deg);
    const sign = (v, str) => (Math.abs(v) < 1e-9 || str === '0' ? '0' : v < 0 ? '-' + str : str);
    if (fn === 'sin') return sign(s, SIN_REF[ref]);
    if (fn === 'cos') return sign(c, SIN_REF[90 - ref]);
    if (Math.abs(c) < 1e-9) return 'undefined';
    return sign(s * c, TAN_REF[ref]);
  }
  function radTex(deg) {
    if (deg === 0) return '0';
    const g = gcd(deg, 180), n = deg / g, d = 180 / g;
    const top = (n === 1 ? '' : n) + '\\pi';
    return d === 1 ? top : '\\frac{' + top + '}{' + d + '}';
  }
  const asText = (v) => (v === 'undefined' ? '\\text{undefined}' : v);

  const G = {};

  G.arithmetic = [
    (d) => { const a = ri(2, R(d, 50, 500, 5000)), b = ri(2, R(d, 50, 500, 5000)); return num(m(a + ' + ' + b + ' = \\ ?'), a + b, 'Add the ones, tens, hundreds... carrying when needed.'); },
    (d) => { const a = ri(10, R(d, 60, 600, 6000)), b = ri(1, a); return num(m(a + ' - ' + b + ' = \\ ?'), a - b, 'Subtract place by place, borrowing when needed.'); },
    (d) => { const a = ri(2, R(d, 12, 25, 99)), b = ri(2, R(d, 12, 15, 99)); return num(m(a + ' \\times ' + b + ' = \\ ?'), a * b, 'Multiply. Break it apart if helpful: ' + m(a + '\\times' + b) + '.'); },
    (d) => { const b = ri(2, R(d, 10, 15, 25)), q = ri(2, R(d, 12, 30, 120)); return num(m(b * q + ' \\div ' + b + ' = \\ ?'), q, 'Ask: ' + b + ' times what equals ' + b * q + '?'); },
    (d) => {
      const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9), e = ri(1, 9);
      const forms = [[`${a} + ${b} \\times ${c}`, a + b * c], [`(${a} + ${b}) \\times ${c}`, (a + b) * c], [`${a * c} \\div ${c} + ${b}`, a + b], [`${a}^2 - ${b} \\times ${e}`, a * a - b * e]];
      const [ex, v] = pick(forms.slice(0, d + 1));
      return num('Use the order of operations: ' + m(ex), v, 'Parentheses, Exponents, Multiply/Divide, then Add/Subtract.');
    },
    (d) => { const b = ri(3, 9), q = ri(3, R(d, 12, 30, 90)), r = ri(1, b - 1); return num('What is the remainder of ' + m((b * q + r) + ' \\div ' + b) + '?', r, `${b} × ${q} = ${b * q}, and ${b * q + r} − ${b * q} = ${r}.`); }
  ];

  G.fractions = [
    (d) => { const b = ri(2, 3 + 2 * d), c = ri(2, 3 + 2 * d), a = ri(1, b), e = ri(1, c); return num(m(`\\frac{${a}}{${b}} + \\frac{${e}}{${c}}`) + ' = ? (fraction is fine)', a / b + e / c, 'Common denominator ' + U.lcm(b, c) + ', then add the numerators.', { display: fmtNum(a / b + e / c) }); },
    (d) => { const b = ri(2, 4 + 2 * d), c = ri(2, 4 + 2 * d), a = ri(1, b + 2), e = ri(1, c); const v = a / b - e / c; return num(m(`\\frac{${a}}{${b}} - \\frac{${e}}{${c}}`) + ' = ?', v, 'Use a common denominator of ' + U.lcm(b, c) + '.', { display: fmtNum(v) }); },
    (d) => { const a = ri(1, 9), b = ri(2, 9), c = ri(1, 9), e = ri(2, 9); return num(m(`\\frac{${a}}{${b}} \\times \\frac{${c}}{${e}}`) + ' = ?', (a * c) / (b * e), 'Multiply straight across, then simplify.', { display: fmtNum((a * c) / (b * e)) }); },
    (d) => { const a = ri(1, 9), b = ri(2, 9), c = ri(1, 9), e = ri(2, 9); return num(m(`\\frac{${a}}{${b}} \\div \\frac{${c}}{${e}}`) + ' = ?', (a * e) / (b * c), 'Keep, change, flip: multiply by the reciprocal ' + m(`\\frac{${e}}{${c}}`) + '.', { display: fmtNum((a * e) / (b * c)) }); },
    (d) => {
      let p = ri(1, 9), q = ri(2, 12); const g = gcd(p, q); p /= g; q /= g; if (q === 1) q = 7;
      const k = ri(2, R(d, 5, 9, 15));
      const wrong = [frac(p * k, q), frac(p + 1, q), frac(p, q * 2), frac(q, p), frac(p * 2, q * 3)];
      return mc('Simplify ' + m(`\\frac{${p * k}}{${q * k}}`), m(frac(p, q)), wrong.map(m), 'Divide top and bottom by their GCF, ' + k * gcd(p, q) + '.');
    },
    (d) => { const w = ri(1, 3 + d), b = ri(2, 9), a = ri(1, b - 1); return mc('Write ' + m(`${w}\\tfrac{${a}}{${b}}`) + ' as an improper fraction.', m(`\\frac{${w * b + a}}{${b}}`), [m(`\\frac{${w + a}}{${b}}`), m(`\\frac{${w * a + b}}{${b}}`), m(`\\frac{${w * b}}{${b}}`), m(`\\frac{${w * b + a}}{${a}}`)], 'Whole × denominator + numerator, over the denominator.'); }
  ];

  G['decimals-percents'] = [
    (d) => { const p = pick(R(d, [10, 25, 50], [5, 10, 15, 20, 25, 75], [12, 15, 35, 45, 65, 85])); const n = ri(2, R(d, 20, 40, 80)) * 20; return num(m(p + '\\%') + ' of ' + n + ' = ?', p * n / 100, m(`\\frac{${p}}{100}\\times ${n}`)); },
    (d) => { const b = pick([2, 4, 5, 8, 10, 20, 25]), a = ri(1, b - 1); return num('Write ' + m(`\\frac{${a}}{${b}}`) + ' as a percent (just the number).', 100 * a / b, 'Divide, then multiply by 100.'); },
    (d) => { const old = ri(2, 20) * 10, pct = pick([10, 20, 25, 50, -10, -20, -25, -50]); const nw = old * (1 + pct / 100); return num(`A price changes from ${old} to ${nw}. What is the percent change? (negative for a decrease)`, pct, m(`\\frac{${nw} - ${old}}{${old}} \\times 100`)); },
    (d) => { const a = ri(1, 9) / 10, b = ri(1, 9) / R(d, 10, 10, 100); return num(m(a + ' \\times ' + b) + ' = ?', Math.round(a * b * 10000) / 10000, 'Multiply as whole numbers, then count the total decimal places.'); },
    (d) => { const n = ri(1, 999) / 1000; return num('Write ' + m(n) + ' as a percent (just the number).', Math.round(n * 100000) / 1000, 'Move the decimal two places right.'); },
    (d) => { const part = ri(1, 9) * 5, whole = part * pick([2, 4, 5, 10]); return num(`${part} is what percent of ${whole}?`, 100 * part / whole, m(`\\frac{${part}}{${whole}}\\times 100`)); }
  ];

  G['integers-exponents'] = [
    (d) => { const a = nz(-20 * d, 20 * d), b = nz(-20 * d, 20 * d); return num(m(paren(a) + ' + ' + paren(b)), a + b, 'Different signs: subtract and keep the sign of the larger absolute value.'); },
    (d) => { const a = nz(-12, 12), b = nz(-12, 12); return num(m(paren(a) + ' \\times ' + paren(b)), a * b, 'Same signs → positive, different signs → negative.'); },
    (d) => { const a = nz(-15, 15), b = nz(-15, 15); return num(m(paren(a) + ' - ' + paren(b)), a - b, 'Subtracting a number is adding its opposite.'); },
    (d) => { const b = ri(2, R(d, 5, 9, 12)), e = ri(0, R(d, 3, 4, 5)); return num(m(b + '^{' + e + '}'), Math.pow(b, e), e === 0 ? 'Anything (nonzero) to the 0 power is 1.' : 'Multiply ' + b + ' by itself ' + e + ' times.'); },
    (d) => { const b = ri(2, 5), e = ri(1, 3); return num(m(b + '^{-' + e + '}') + ' = ? (fraction ok)', Math.pow(b, -e), m(`${b}^{-${e}} = \\frac{1}{${b}^{${e}}}`), { display: '1/' + Math.pow(b, e) }); },
    (d) => { const r = ri(2, R(d, 12, 20, 30)); return num(m('\\sqrt{' + r * r + '}'), r, `${r} × ${r} = ${r * r}`); },
    (d) => { const a = ri(11, 99) / 10, e = ri(2, 5); return num('Write ' + m(a + ' \\times 10^{' + e + '}') + ' as a standard number.', Math.round(a * Math.pow(10, e)), 'Move the decimal ' + e + ' places right.'); }
  ];

  G.ratios = [
    (d) => { const a = ri(1, 9), b = ri(2, 12), k = ri(2, R(d, 5, 9, 15)); return num('Solve for x: ' + m(`\\frac{${a}}{${b}} = \\frac{x}{${b * k}}`), a * k, `Cross-multiply: x = ${a}·${b * k} ÷ ${b}.`); },
    (d) => { const a = ri(2, 9), b = ri(2, 9), k = ri(2, 6 + d); return num('Solve for x: ' + m(`\\frac{${a * k}}{x} = \\frac{${a}}{${b}}`), b * k, 'Cross-multiply: ' + m(`${a}x = ${a * k}\\cdot${b}`)); },
    (d) => { const n = ri(2, 12), p = ri(2, R(d, 9, 20, 50)); return num(`${n} notebooks cost ${n * p} dollars. What is the cost of one notebook (in dollars)?`, p, 'Unit rate = total ÷ number of items.'); },
    (d) => { const a = ri(1, 7), b = ri(1, 7), k = ri(2, R(d, 6, 10, 25)); return num(`Split ${(a + b) * k} in the ratio ${a}:${b}. What is the larger share?`, Math.max(a, b) * k, `There are ${a + b} parts, each worth ${k}.`); },
    (d) => { const mph = ri(3, 12) * 5, h = ri(2, 6); return num(`A car travels ${mph * h} miles in ${h} hours. How many miles per hour?`, mph, 'Rate = distance ÷ time.'); }
  ];

  G['linear-equations'] = [
    (d) => { const a = nz(-R(d, 5, 9, 15), R(d, 9, 9, 15)), x = ri(-10, 10), b = ri(-20, 20); return num('Solve for x: ' + m(`${a === 1 ? '' : a === -1 ? '-' : a}x ${sgn(b)} = ${a * x + b}`), x, `Subtract ${b} from both sides, then divide by ${a}.`); },
    (d) => { const a = ri(2, 9), c = ri(1, 9); let x = ri(-9, 9); if (a === c) return G['linear-equations'][0](d); const b = ri(-20, 20); const e = a * x + b - c * x; return num('Solve for x: ' + m(`${a}x ${sgn(b)} = ${c === 1 ? '' : c}x ${sgn(e)}`), x, 'Get the x-terms on one side and the numbers on the other.'); },
    (d) => { const a = ri(2, 6), b = nz(-6, 6), x = ri(-8, 8), c = ri(1, 9); return num('Solve for x: ' + m(`${a}(x ${sgn(b)}) ${sgn(c)} = ${a * (x + b) + c}`), x, 'Distribute (or subtract first), then isolate x.'); },
    (d) => { const k = ri(2, 9), x = ri(-12, 12); return num('Solve for x: ' + m(`\\frac{x}{${k}} = ${x}`), x * k, 'Multiply both sides by ' + k + '.'); },
    (d) => {
      const a = pick([2, 3, 4, 5, -2, -3, -4]), x = ri(-6, 6), b = ri(-10, 10), c = a * x + b;
      const sym = pick(['<', '>']);
      const flip = a < 0 ? (sym === '<' ? '>' : '<') : sym;
      const opp = flip === '<' ? '>' : '<';
      return mc('Solve: ' + m(`${a}x ${sgn(b)} ${sym} ${c}`), m(`x ${flip} ${x}`), [m(`x ${opp} ${x}`), m(`x ${flip} ${-x === x ? x + 1 : -x}`), m(`x ${opp} ${-x === x ? x - 1 : -x}`)], a < 0 ? 'Dividing by a negative number flips the inequality sign.' : 'Isolate x as you would in an equation.');
    }
  ];

  G['lines-slope'] = [
    (d) => { const x1 = ri(-9, 9), y1 = ri(-9, 9); let x2 = ri(-9, 9); if (x2 === x1) x2 = x1 + ri(1, 5); const y2 = ri(-9, 9); const v = (y2 - y1) / (x2 - x1); return num(`What is the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2})?`, v, m(`m = \\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}}`), { display: fmtNum(v) }); },
    (d) => { const mm = nz(-6, 6), b = ri(-10, 10), x = ri(-5, 5); return num(`A line has slope ${mm} and passes through (${x}, ${mm * x + b}). What is its y-intercept?`, b, m('b = y - mx')); },
    (d) => { const A = nz(-6, 6), B = nz(-6, 6), C = ri(-12, 12); return num('What is the slope of ' + m(`${linXY(A, B)} = ${C}`) + '?', -A / B, 'Solve for y: slope is ' + m('-\\frac{A}{B}'), { display: fmtNum(-A / B) }); },
    (d) => { const a = nz(-6, 6), b = pick([1, 2, 3, 4, 5]); return num(`A line has slope ${fmtNum(a / b)}. What is the slope of a line perpendicular to it?`, -b / a, 'Perpendicular slopes are negative reciprocals.', { display: fmtNum(-b / a) }); },
    (d) => { const mm = nz(-5, 5), b = ri(-9, 9); const eq = `y = ${poly([mm, b])}`; return mc('Which line is parallel to ' + m(eq) + '?', m(`y = ${poly([mm, b + ri(1, 5)])}`), [m(`y = ${poly([-mm, b])}`), m(`y = ${poly([mm + 1, b])}`), m(`y = ${poly([-mm || 1, b + 2])}`), m(`y = ${poly([mm * 2, b])}`)], 'Parallel lines have the same slope.'); }
  ];

  G.systems = [
    (d) => {
      const x = ri(-8, 8), y = ri(-8, 8);
      let a1, b1, a2, b2;
      do { a1 = nz(-R(d, 1, 4, 7), R(d, 3, 5, 7)); b1 = nz(-R(d, 1, 4, 7), R(d, 3, 5, 7)); a2 = nz(-5, 5); b2 = nz(-5, 5); } while (a1 * b2 - a2 * b1 === 0);
      if (d === 1) { a1 = 1; b1 = 1; a2 = 1; b2 = -1; }
      const ask = pick(['x', 'y']);
      const e1 = `${linXY(a1, b1)} = ${a1 * x + b1 * y}`;
      const e2 = `${linXY(a2, b2)} = ${a2 * x + b2 * y}`;
      return num(`Solve the system and give ${m(ask)}: ` + m(`\\begin{cases} ${e1} \\\\ ${e2} \\end{cases}`), ask === 'x' ? x : y, `The solution is (${x}, ${y}). Use elimination or substitution.`);
    },
    (d) => { const x = ri(-6, 6), mm = nz(-4, 4), b = ri(-9, 9); return num('Solve by substitution and give x: ' + m(`\\begin{cases} y = ${poly([mm, b])} \\\\ y = ${poly([mm + (mm > 0 ? 1 : -1), b - (mm > 0 ? 1 : -1) * x])} \\end{cases}`), x, 'Set the two expressions for y equal and solve for x.'); },
    (d) => { const mm = nz(-4, 4), b = ri(-6, 6); return mc('How many solutions does this system have? ' + m(`\\begin{cases} y = ${poly([mm, b])} \\\\ y = ${poly([mm, b + nz(-4, 4)])} \\end{cases}`), 'No solution', ['Exactly one', 'Infinitely many', 'Exactly two'], 'Same slope, different intercept → parallel lines → no solution.'); },
    (d) => { const mm = nz(-4, 4), b = ri(-6, 6), k = ri(2, 4); return mc('How many solutions does this system have? ' + m(`\\begin{cases} y = ${poly([mm, b])} \\\\ ${k}y = ${poly([k * mm, k * b])} \\end{cases}`), 'Infinitely many', ['Exactly one', 'No solution', 'Exactly two'], 'The second equation is the first multiplied by ' + k + ' — the same line.'); }
  ];

  G.polynomials = [
    (d) => { const p = ri(-9, 9), q = ri(-9, 9); const b = p + q, c = p * q; const f = (r) => (r === 0 ? 'x' : `(x ${sgn(r)})`); return mc('Factor ' + m(poly([1, b, c])), m(f(p) + f(q)), [m(f(-p) + f(-q)), m(f(p) + f(-q)), m(f(-p) + f(q)), m(f(p + 1) + f(q - 1))], `Find two numbers that multiply to ${c} and add to ${b}: ${p} and ${q}.`); },
    (d) => { const a = nz(-9, 9), b = nz(-9, 9); return num('Expand ' + m(`(x ${sgn(a)})(x ${sgn(b)})`) + '. What is the coefficient of x?', a + b, 'FOIL: the outer and inner terms give ' + m(`${a}x + ${b}x`) + '.'); },
    (d) => { const a = ri(2, 9), b = ri(2, 9); return num('Simplify ' + m(`x^{${a}} \\cdot x^{${b}} = x^{?}`), a + b, 'Product of powers: add the exponents.'); },
    (d) => { const a = ri(2, 6), b = ri(2, 5); return num('Simplify ' + m(`(x^{${a}})^{${b}} = x^{?}`), a * b, 'Power of a power: multiply the exponents.'); },
    (d) => { const a = ri(5, 12), b = ri(1, a - 1); return num('Simplify ' + m(`\\frac{x^{${a}}}{x^{${b}}} = x^{?}`), a - b, 'Quotient of powers: subtract the exponents.'); },
    (d) => { const n = ri(2, 7); const cs = [nz(-9, 9)]; for (let i = 0; i < n; i++) cs.push(ri(-9, 9)); return num('What is the degree of ' + m(poly(cs)) + '?', n, 'The degree is the highest exponent.'); },
    (d) => { const a = ri(1, 12); return mc('Factor ' + m(`x^2 - ${a * a}`), m(`(x - ${a})(x + ${a})`), [m(`(x - ${a})^2`), m(`(x + ${a})^2`), m(`(x - ${a * a})(x + 1)`)], 'Difference of squares: ' + m('a^2 - b^2 = (a-b)(a+b)')); }
  ];

  G.quadratics = [
    (d) => { const r1 = ri(-9, 9), r2 = ri(-9, 9), a = d === 3 ? pick([1, 2, -1]) : 1; return num('Solve ' + m(poly([a, -a * (r1 + r2), a * r1 * r2]) + ' = 0') + '. Give the LARGER solution.', Math.max(r1, r2), `It factors as ${m((a === 1 ? '' : a === -1 ? '-' : a) + `(x ${sgn(-r1)})(x ${sgn(-r2)})`)}, so x = ${r1} or x = ${r2}.`); },
    (d) => { const a = nz(-5, 5), b = ri(-10, 10), c = ri(-10, 10); return num('Find the discriminant of ' + m(poly([a, b, c]) + ' = 0'), b * b - 4 * a * c, m(`b^2 - 4ac = ${paren(b)}^2 - 4(${a})(${c})`)); },
    (d) => { const a = nz(-4, 4), h = ri(-6, 6), c = ri(-9, 9); const b = -2 * a * h; return num('What is the x-coordinate of the vertex of ' + m('y = ' + poly([a, b, c])) + '?', h, m(`x = -\\frac{b}{2a} = -\\frac{${b}}{${2 * a}}`)); },
    (d) => { const a = nz(-3, 3), b = ri(-8, 8), c = ri(-8, 8); const D = b * b - 4 * a * c; const ans = D > 0 ? '2 real solutions' : D === 0 ? '1 real solution' : 'No real solutions'; return mc('How many real solutions does ' + m(poly([a, b, c]) + ' = 0') + ' have?', ans, ['2 real solutions', '1 real solution', 'No real solutions', 'Infinitely many'], `Discriminant = ${D}.`); },
    (d) => { const a = nz(-3, 3), h = ri(-5, 5), k = ri(-9, 9); return num('What is the y-coordinate of the vertex of ' + m(`y = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${sgn(-h)})^2 ${sgn(k)}`) + '?', k, 'Vertex form ' + m('y = a(x-h)^2 + k') + ' has vertex (h, k).'); }
  ];

  G['exponents-logs'] = [
    (d) => { const b = pick([2, 3, 4, 5, 10]), k = ri(R(d, 0, -2, -3), R(d, 4, 4, 5)); const N = Math.pow(b, k); return num('Evaluate ' + m(`\\log_{${b}}\\left(${N < 1 ? frac(1, Math.round(1 / N)) : N}\\right)`), k, m(`${b}^{${k}} = ${N < 1 ? frac(1, Math.round(1 / N)) : N}`)); },
    (d) => { const b = pick([2, 3, 5]), k = ri(2, R(d, 4, 5, 6)); return num('Solve for x: ' + m(`${b}^{x} = ${Math.pow(b, k)}`), k, `Rewrite ${Math.pow(b, k)} as a power of ${b}.`); },
    (d) => { const k = ri(-5, 9); return num('Evaluate ' + m(`\\ln\\left(e^{${k}}\\right)`), k, 'ln and e^x are inverses.'); },
    (d) => mc('Which expression equals ' + m('\\log_b(MN)') + '?', m('\\log_b M + \\log_b N'), [m('\\log_b M \\cdot \\log_b N'), m('\\log_b M - \\log_b N'), m('N\\log_b M')], 'Product rule for logs.'),
    (d) => { const k = ri(2, 5); return mc('Which expression equals ' + m(`\\log_b(M^{${k}})`) + '?', m(`${k}\\log_b M`), [m(`(\\log_b M)^{${k}}`), m(`\\log_b ${k}M`), m(`\\log_b M + ${k}`)], 'Power rule for logs.'); },
    (d) => { const b = pick([2, 3]), a = ri(1, 3), k = ri(1, 4); return num('Solve for x: ' + m(`${b}^{x + ${a}} = ${Math.pow(b, k + a)}`), k, `So x + ${a} = ${k + a}.`); }
  ];

  G.functions = [
    (d) => { const a = nz(-6, 6), b = ri(-9, 9), x = ri(-5, 5); return num(`If ${m('f(x) = ' + poly([a, b]))}, find ${m(`f(${x})`)}.`, a * x + b, 'Substitute ' + x + ' for x.'); },
    (d) => { const a = nz(-3, 3), b = ri(-5, 5), c = ri(-5, 5), x = ri(-3, 3); return num(`If ${m('f(x) = ' + poly([a, b, c]))}, find ${m(`f(${x})`)}.`, a * x * x + b * x + c, 'Substitute carefully; square first.'); },
    (d) => { const a = nz(-4, 4), b = ri(-6, 6), c = nz(-3, 3), e = ri(-5, 5), x = ri(-3, 3); return num(`If ${m('f(x) = ' + poly([a, b]))} and ${m('g(x) = ' + poly([c, e]))}, find ${m(`f(g(${x}))`)}.`, a * (c * x + e) + b, `First g(${x}) = ${c * x + e}, then f of that.`); },
    (d) => { const a = nz(-6, 6), b = ri(-9, 9), y = ri(-12, 12); return num(`If ${m('f(x) = ' + poly([a, b]))}, find ${m(`f^{-1}(${y})`)}.`, (y - b) / a, `Solve ${m(poly([a, b]) + ' = ' + y)} for x.`, { display: fmtNum((y - b) / a) }); },
    (d) => { const a = ri(-9, 9); return mc('What is the domain of ' + m(`f(x) = \\sqrt{x ${sgn(-a)}}`) + '?', m(`x \\ge ${a}`), [m(`x \\le ${a}`), m(`x > ${a}`), m('\\text{all real numbers}'), m(`x \\ge ${-a === a ? a + 1 : -a}`)], 'The expression under a square root must be ≥ 0.'); },
    (d) => { const a = ri(-9, 9); return mc('What is the domain of ' + m(`f(x) = \\frac{1}{x ${sgn(-a)}}`) + '?', m(`x \\neq ${a}`), [m(`x > ${a}`), m(`x \\neq ${-a === a ? a + 1 : -a}`), m('\\text{all real numbers}')], 'Division by zero is not allowed.'); }
  ];

  /* Algebra 2, sections 2.1–2.3 (relations & functions, slope, graphing lines), in the style of the class study guide. */
  const pt = (x, y) => '(' + x + ', ' + y + ')';
  const setTex = (vals) => '\\{' + Array.from(new Set(vals)).sort((a, b) => a - b).join(', ') + '\\}';
  const slopeTex = (p, q) => frac(p, q);
  function slopeLine(p, q, x0, y0, k) { return [[x0, y0], [x0 + q * k, y0 + p * k]]; }
  const ALG2_GUIDE = [
    () => mc('From your study guide (Checkpoint 1): is ' + m('(-5, 2), (-3, -1), (0, 0), (0, 2), (0, 5)') + ' a function?', 'No', ['Yes', 'No'], 'Not a function: the input 0 is mapped onto 0, 2 and 5.'),
    () => mc('From your study guide (Example 1b): is the mapping ' + m('-2 \\to -2,\\ 1 \\to 0,\\ 2 \\to 2,\\ 2 \\to 3') + ' a function?', 'No', ['Yes', 'No'], 'Not a function: the input 2 is mapped onto both 2 and 3.'),
    () => mc('From your study guide (Example 1a): is the mapping ' + m('-2 \\to 1,\\ -1 \\to 0,\\ 3 \\to 0,\\ 6 \\to 4') + ' a function?', 'Yes', ['Yes', 'No'], 'A function: each input maps to exactly one output. Two inputs sharing the output 0 is allowed.'),
    () => num('From your study guide (Example 4a): ' + m('f(x) = 6x + 10') + '. Find ' + m('f(-3)') + '.', -8, m('6(-3) + 10 = -18 + 10 = -8')),
    () => num('From your study guide (Example 4b): ' + m('g(x) = 2x^2 + 4x - 1') + '. Find ' + m('g(-3)') + '.', 5, m('2(9) - 12 - 1 = 5') + '. Square the −3 first.'),
    () => num('From your study guide (Checkpoint 4): ' + m('f(x) = 2x^3 + 6 - x') + '. Find ' + m('f(-1)') + '.', 5, m('2(-1)^3 + 6 - (-1) = -2 + 6 + 1 = 5')),
    () => num('From your study guide (Example 1): find the slope of the line through (1, 3) and (6, 7). (fraction ok)', 4 / 5, m('m = \\frac{7 - 3}{6 - 1} = \\frac{4}{5}'), { display: '4/5' }),
    () => num('From your study guide (Checkpoint 1): find the slope of the line through (4, 2) and (7, 9). (fraction ok)', 7 / 3, m('m = \\frac{9 - 2}{7 - 4} = \\frac{7}{3}'), { display: '7/3' }),
    () => mc('From your study guide (Example 2b): the line through (2, −1) and (2, 2)…', 'Is vertical', ['Rises', 'Falls', 'Is horizontal', 'Is vertical'], m('m = \\frac{3}{0}') + ' is undefined, so the line is vertical.'),
    () => mc('From your study guide (Example 3): line 1 goes through (−3, −1) and (2, 5); line 2 through (3, −4) and (−3, 1). The lines are…', 'Perpendicular', ['Parallel', 'Perpendicular', 'Neither'], m('m_1 = \\frac{6}{5},\\ m_2 = -\\frac{5}{6}') + ', and their product is −1.'),
    () => num('From your study guide (Example 2): find the x-intercept of ' + m('2x + 3y = 12') + '.', 6, 'Let y = 0: 2x = 12, so x = 6.'),
    () => num('From your study guide (Checkpoint 4): find the x-intercept of ' + m('-5x + 3y = 15') + '.', -3, 'Let y = 0: −5x = 15, so x = −3.'),
    () => mc('From your study guide (Quick self-check): what is the domain of ' + m('\\{(-1, 0), (0, 2), (3, 2)\\}') + '?', m('\\{-1, 0, 3\\}'), [m('\\{0, 2\\}'), m('\\{-1, 0, 2, 3\\}'), m('\\{0, 2, 2\\}')], 'Domain = the x-values, each listed once.'),
    () => num('From your practice papers (#14): what is the slope of ' + m('y = -\\tfrac{1}{4}x - 1') + '? (fraction ok)', -1 / 4, 'In y = mx + b, m is the slope.', { display: '-1/4' }),
    () => num('From your practice papers (#11): where does ' + m('y = 2x - 5') + ' cross the y-axis? (the y-value)', -5, 'b = −5, so it crosses at (0, −5).')
  ];
  G['alg2-ch2'] = [
    (d) => {
      const n = ri(3, 4 + d), xs = shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, n);
      const pairs = xs.map((x) => [x, ri(-6, 6)]);
      const notF = Math.random() < 0.5;
      let rep = null;
      if (notF) { const i = ri(0, n - 1); rep = pairs[i][0]; pairs.push([rep, pairs[i][1] + nz(-4, 4)]); }
      return mc('Is this relation a function? ' + m(shuffle(pairs).map((q) => pt(q[0], q[1])).join(',\\ ')), notF ? 'No' : 'Yes', ['Yes', 'No'],
        notF ? `Not a function: the input ${rep} is mapped onto two different outputs.` : 'A function: no input (x-value) repeats with a different output. Outputs may repeat.');
    },
    (d) => {
      const xs = shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, ri(3, 5));
      const pairs = xs.map((x) => [x, ri(-5, 6)]);
      const ask = pick(['domain', 'range']);
      const X = pairs.map((q) => q[0]), Y = pairs.map((q) => q[1]);
      const right = ask === 'domain' ? X : Y, other = ask === 'domain' ? Y : X;
      return mc(`What is the ${ask} of ` + m('\\{' + pairs.map((q) => pt(q[0], q[1])).join(', ') + '\\}') + '?', m(setTex(right)),
        [m(setTex(other)), m(setTex(X.concat(Y))), m(setTex(right.slice(1).concat([right[0] + 7])))],
        ask === 'domain' ? 'Domain = the inputs (x-values), each listed once.' : 'Range = the outputs (y-values), each listed once.');
    },
    (d) => {
      const x = ri(-3, 3);
      const kind = d === 1 ? 'lin' : pick(['lin', 'quad', 'cube']);
      if (kind === 'lin') { const a = nz(-9, 9), b = ri(-12, 12); return num(`Evaluate ${m('f(x) = ' + poly([a, b]))} when x = ${x}.`, a * x + b, 'Substitute ' + x + ' for x: ' + m(`${a}(${x}) ${sgn(b)}`)); }
      if (kind === 'quad') { const a = nz(-3, 3), b = ri(-5, 5), c = ri(-6, 6); return num(`Evaluate ${m('g(x) = ' + poly([a, b, c]))} when x = ${x}.`, a * x * x + b * x + c, 'Square ' + paren(x) + ' first: ' + m(`${paren(x)}^2 = ${x * x}`) + '.'); }
      const a = nz(-2, 2), c = ri(-6, 6); return num(`Evaluate ${m('h(x) = ' + poly([a, 0, 0, c]))} when x = ${x}.`, a * x * x * x + c, m(`${paren(x)}^3 = ${x * x * x}`) + ' (a negative number cubed stays negative).');
    },
    (d) => {
      const a = nz(-7, 7), b = nz(-9, 9), k = ri(2, 5);
      const items = [
        ['f(x) = ' + poly([a, b]), true], ['f(x) = ' + b + ' ' + (a < 0 ? '- ' + Math.abs(a) : '+ ' + a) + 'x', true], ['f(x) = ' + b, true], ['f(x) = \\frac{x}{' + k + '} ' + sgn(b), true],
        ['f(x) = ' + poly([a, 0, b]), false], ['f(x) = ' + poly([a, 0, 0, b]), false], ['f(x) = \\frac{' + k + '}{x} ' + sgn(b), false], ['f(x) = \\sqrt{x} ' + sgn(b), false]
      ];
      const [f, lin] = pick(items);
      return mc('Is ' + m(f) + ' a linear function?', lin ? 'Linear' : 'Not linear', ['Linear', 'Not linear'],
        lin ? 'It can be written as f(x) = mx + b (a constant is mx + b with m = 0).' : 'It has an x², x³, √x or x in a denominator, so it is not of the form mx + b.');
    },
    (d) => {
      const type = pick(['Rises', 'Falls', 'Is horizontal', 'Is vertical']);
      const x1 = ri(-6, 6), y1 = ri(-6, 6);
      let x2 = x1 + ri(1, 6), y2;
      if (type === 'Rises') y2 = y1 + ri(1, 6); else if (type === 'Falls') y2 = y1 - ri(1, 6); else if (type === 'Is horizontal') y2 = y1; else { x2 = x1; y2 = y1 + nz(-6, 6); }
      const [a, b] = Math.random() < 0.5 ? [[x1, y1], [x2, y2]] : [[x2, y2], [x1, y1]];
      const top = b[1] - a[1], bot = b[0] - a[0];
      return mc(`Without graphing: the line through ${pt(a[0], a[1])} and ${pt(b[0], b[1])}…`, type, ['Rises', 'Falls', 'Is horizontal', 'Is vertical'],
        m(`m = \\frac{${b[1]} - ${paren(a[1])}}{${b[0]} - ${paren(a[0])}} = ${bot === 0 ? '\\frac{' + top + '}{0}' : frac(top, bot)}`) + (bot === 0 ? ': undefined, so vertical.' : top === 0 ? ': zero, so horizontal.' : top * bot > 0 ? ': positive, so it rises.' : ': negative, so it falls.'));
    },
    (d) => {
      const slopes = [[1, 1], [2, 1], [1, 2], [3, 2], [-2, 3], [-1, 1], [4, 1], [-3, 1], [3, 4], [-1, 2]];
      let [p, q] = pick(slopes);
      const type = pick(['Parallel', 'Perpendicular', 'Neither']);
      let p2, q2;
      if (type === 'Parallel') [p2, q2] = [p, q];
      else if (type === 'Perpendicular') [p2, q2] = q * Math.sign(p) > 0 ? [-q, Math.abs(p)] : [q, Math.abs(p)];
      else { do { [p2, q2] = pick(slopes); } while (p2 * q === p * q2 || p2 * p === -q2 * q); }
      if (type === 'Perpendicular' && p < 0) [p2, q2] = [q, -p];
      const L1 = slopeLine(p, q, ri(-5, 3), ri(-5, 3), ri(1, 2)), L2 = slopeLine(p2, q2, ri(-5, 3), ri(-5, 3), ri(1, 2));
      const m1 = frac(p, q), m2 = frac(p2, q2);
      return mc(`Line 1 goes through ${pt(L1[0][0], L1[0][1])} and ${pt(L1[1][0], L1[1][1])}; line 2 through ${pt(L2[0][0], L2[0][1])} and ${pt(L2[1][0], L2[1][1])}. The lines are…`, type, ['Parallel', 'Perpendicular', 'Neither'],
        m(`m_1 = ${m1},\\ m_2 = ${m2}`) + (type === 'Parallel' ? ': the same slope.' : type === 'Perpendicular' ? ': their product is −1.' : ': not equal, and their product is not −1.'));
    },
    (d) => {
      const A = nz(-6, 6), B = nz(-6, 6), k = nz(-2, 2), C = A * B * k;
      const ask = pick(['x', 'y']);
      return num(`Find the ${ask}-intercept of ${m(linXY(A, B) + ' = ' + C)}.`, ask === 'x' ? B * k : A * k,
        ask === 'x' ? `Let y = 0: ${A}x = ${C}, so x = ${B * k}.` : `Let x = 0: ${B}y = ${C}, so y = ${A * k}.`);
    },
    (d) => {
      const [p, q] = pick([[2, 1], [-3, 2], [1, 3], [-1, 1], [4, 3], [-2, 5], [3, 1], [-1, 4]]), b = ri(-6, 6);
      const ask = pick(['slope', 'y-intercept']);
      const eq = 'y = ' + (q === 1 ? (p === 1 ? '' : p === -1 ? '-' : p) : frac(p, q)) + 'x ' + (b ? sgn(b) : '');
      return num(`What is the ${ask} of ${m(eq.trim())}? (fraction ok)`, ask === 'slope' ? p / q : b, 'In y = mx + b, m is the slope and b is the y-intercept.', { display: ask === 'slope' ? fmtNum(p / q) : String(b) });
    },
    (d) => {
      const [p, q] = pick([[-3, 2], [2, 1], [1, 2], [-1, 3], [4, 3], [-2, 1], [3, 4]]), b = ri(-5, 5);
      const eq = 'y = ' + (q === 1 ? p : frac(p, q)) + 'x ' + (b ? sgn(b) : '');
      return mc(`To graph ${m(eq.trim())}, start at (0, ${b}). Which is a second point on the line?`, m(pt(q, b + p)),
        [m(pt(p, b + q)), m(pt(q, b - p)), m(pt(-q, b + p)), m(pt(b, q))],
        `The slope ${m(slopeTex(p, q))} means go ${p < 0 ? 'down' : 'up'} ${Math.abs(p)} and right ${q}.`);
    },
    (d) => {
      const c = nz(-6, 6), horiz = Math.random() < 0.5;
      const eq = (horiz ? 'y' : 'x') + ' = ' + c;
      return mc('Which describes the graph of ' + m(eq) + '?', horiz ? `Horizontal line through (0, ${c})` : `Vertical line through (${c}, 0)`,
        [`Horizontal line through (0, ${c})`, `Vertical line through (${c}, 0)`, `Horizontal line through (${c}, 0)`, `Vertical line through (0, ${c})`],
        horiz ? 'y = a number is a flat line; every point has that y-value. Its slope is 0.' : 'x = a number is a standing-up line; every point has that x-value. Its slope is undefined.');
    },
    (d) => {
      const items = [['A U-shaped parabola that opens up', 'Yes'], ['A sideways parabola that opens to the right', 'No'], ['An upside-down V', 'Yes'], ['A circle', 'No'],
        ['An S-shaped curve that keeps rising from left to right', 'Yes'], ['A slanted straight line', 'Yes'], ['A vertical straight line', 'No'], ['Scattered points with two dots stacked in the same column', 'No'], ['Scattered points, each with a different x-value', 'Yes']];
      const [g, a] = pick(items);
      return mc(`Vertical line test: is this graph a function? ${g}.`, a, ['Yes', 'No'], a === 'Yes' ? 'Every vertical line crosses it at most once.' : 'Some vertical line crosses it at 2 or more points.');
    },
    () => pick(ALG2_GUIDE)(),
    () => pick(ALG2_GUIDE)()
  ];

  G['geometry-area'] = [
    (d) => { const l = ri(2, R(d, 12, 25, 60)), w = ri(2, R(d, 12, 25, 60)); return num(`Area of a rectangle ${l} by ${w}?`, l * w, m('A = lw')); },
    (d) => { const l = ri(2, 30), w = ri(2, 30); return num(`Perimeter of a rectangle ${l} by ${w}?`, 2 * (l + w), m('P = 2l + 2w')); },
    (d) => { const b = ri(2, 20), h = ri(2, 10) * 2; return num(`Area of a triangle with base ${b} and height ${h}?`, b * h / 2, m('A = \\tfrac{1}{2}bh')); },
    (d) => { const r = ri(1, R(d, 6, 12, 25)); return num(`Area of a circle with radius ${r}? (round to 2 decimals, or type an answer with pi)`, Math.PI * r * r, m(`A = \\pi r^2 = ${r * r}\\pi`), { tol: 0.01, display: (Math.round(Math.PI * r * r * 100) / 100) + ' (= ' + r * r + 'π)' }); },
    (d) => { const r = ri(1, 20); return num(`Circumference of a circle with radius ${r}? (round to 2 decimals, or use pi)`, 2 * Math.PI * r, m(`C = 2\\pi r = ${2 * r}\\pi`), { tol: 0.01, display: (Math.round(2 * Math.PI * r * 100) / 100) + ' (= ' + 2 * r + 'π)' }); },
    (d) => { const a = ri(2, 15), b = ri(2, 15), h = ri(1, 6) * 2; return num(`Area of a trapezoid with bases ${a} and ${b} and height ${h}?`, (a + b) * h / 2, m('A = \\tfrac{1}{2}(b_1 + b_2)h')); }
  ];

  G.pythagorean = [
    (d) => { const [a, b, c] = pick(TRIPLES.slice(0, 2 + d)); const k = ri(1, R(d, 2, 3, 4)); return num(`A right triangle has legs ${a * k} and ${b * k}. How long is the hypotenuse?`, c * k, m(`c = \\sqrt{${a * k}^2 + ${b * k}^2}`)); },
    (d) => { const [a, b, c] = pick(TRIPLES.slice(0, 2 + d)); const k = ri(1, 3); return num(`A right triangle has hypotenuse ${c * k} and one leg ${a * k}. How long is the other leg?`, b * k, m(`b = \\sqrt{${c * k}^2 - ${a * k}^2}`)); },
    (d) => { const [a, b, c] = pick(TRIPLES.slice(0, 3)); const x1 = ri(-6, 6), y1 = ri(-6, 6); const sx = pick([1, -1]), sy = pick([1, -1]); return num(`Distance between (${x1}, ${y1}) and (${x1 + sx * a}, ${y1 + sy * b})?`, c, 'Distance formula: ' + m(`\\sqrt{${a}^2 + ${b}^2}`)); },
    (d) => { const x1 = ri(-9, 9), x2 = ri(-9, 9), y1 = ri(-9, 9), y2 = ri(-9, 9); const ask = pick(['x', 'y']); const v = ask === 'x' ? (x1 + x2) / 2 : (y1 + y2) / 2; return num(`What is the ${ask}-coordinate of the midpoint of (${x1}, ${y1}) and (${x2}, ${y2})?`, v, 'Average the coordinates.', { display: fmtNum(v) }); },
    (d) => { const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10]]); const bad = [t[0], t[1], t[2] + 1]; const isRight = Math.random() < 0.5; const s = isRight ? t : bad; return mc(`Can ${s.join(', ')} be the sides of a right triangle?`, isRight ? 'Yes' : 'No', ['Yes', 'No'], `${s[0]}² + ${s[1]}² = ${s[0] * s[0] + s[1] * s[1]}, ${s[2]}² = ${s[2] * s[2]}.`); }
  ];

  G.angles = [
    (d) => { const a = ri(5, 85); return num(`What is the complement of a ${a}° angle?`, 90 - a, 'Complementary angles add to 90°.'); },
    (d) => { const a = ri(5, 175); return num(`What is the supplement of a ${a}° angle?`, 180 - a, 'Supplementary angles add to 180°.'); },
    (d) => { const a = ri(20, 100), b = ri(10, 160 - a); return num(`A triangle has angles ${a}° and ${b}°. What is the third angle?`, 180 - a - b, 'Triangle angles add to 180°.'); },
    (d) => { const n = ri(3, R(d, 8, 12, 20)); return num(`What is the sum of the interior angles of a ${n}-sided polygon (degrees)?`, (n - 2) * 180, m('(n-2)\\cdot 180^\\circ')); },
    (d) => { const n = pick([3, 4, 5, 6, 8, 9, 10, 12]); return num(`Each interior angle of a regular ${n}-gon measures how many degrees?`, (n - 2) * 180 / n, m(`\\frac{(${n}-2)\\cdot 180}{${n}}`)); },
    (d) => { const a = ri(20, 160); return num(`Two lines intersect. One angle is ${a}°. What is its vertical angle?`, a, 'Vertical angles are equal.'); },
    (d) => { const x = ri(5, 30), a = ri(2, 4), b = ri(1, 30); const total = 180; const c = total - (a * x + b); return num('Two angles are supplementary: ' + m(`(${a}x ${sgn(b)})^\\circ`) + ' and ' + m(`${c}^\\circ`) + '. Find x.', x, `${a}x + ${b} + ${c} = 180.`); }
  ];

  G.volume = [
    (d) => { const l = ri(2, 12), w = ri(2, 12), h = ri(2, 12); return num(`Volume of a box ${l} × ${w} × ${h}?`, l * w * h, m('V = lwh')); },
    (d) => { const r = ri(1, 8), h = ri(1, 12); return num(`Volume of a cylinder with radius ${r} and height ${h}? (round to 2 decimals or use pi)`, Math.PI * r * r * h, m(`V = \\pi r^2 h = ${r * r * h}\\pi`), { tol: 0.01, display: Math.round(Math.PI * r * r * h * 100) / 100 + ' (= ' + r * r * h + 'π)' }); },
    (d) => { const r = ri(1, 6) * 3, h = ri(1, 10); return num(`Volume of a cone with radius ${r} and height ${h}? (round to 2 decimals or use pi)`, Math.PI * r * r * h / 3, m(`V = \\tfrac{1}{3}\\pi r^2 h = ${r * r * h / 3}\\pi`), { tol: 0.01, display: Math.round(Math.PI * r * r * h / 3 * 100) / 100 + ' (= ' + r * r * h / 3 + 'π)' }); },
    (d) => { const r = ri(1, 3) * 3; return num(`Volume of a sphere with radius ${r}? (round to 2 decimals or use pi)`, 4 / 3 * Math.PI * r * r * r, m(`V = \\tfrac{4}{3}\\pi r^3 = ${4 * r * r * r / 3}\\pi`), { tol: 0.01, display: Math.round(4 / 3 * Math.PI * r ** 3 * 100) / 100 + ' (= ' + 4 * r ** 3 / 3 + 'π)' }); },
    (d) => { const s = ri(2, 15); return num(`Surface area of a cube with side ${s}?`, 6 * s * s, m('SA = 6s^2')); },
    (d) => { const s = ri(2, 12); return num(`Volume of a cube with side ${s}?`, s * s * s, m('V = s^3')); }
  ];

  const STD_DEG = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  G['trig-unit-circle'] = [
    (d) => {
      const deg = pick(d === 1 ? [0, 30, 45, 60, 90] : STD_DEG), fn = pick(d === 1 ? ['sin', 'cos'] : ['sin', 'cos', 'tan']);
      const useRad = d >= 2 && Math.random() < 0.6;
      const ans = trigExact(fn, deg);
      return mc('Evaluate ' + m(`\\${fn}\\left(${useRad ? radTex(deg) : deg + '^\\circ'}\\right)`), m(asText(ans)), TRIG_VALUES.filter((v) => v !== ans).map((v) => m(asText(v))), `Reference angle ${refAngle(deg)}°; use the sign for the quadrant (ASTC).`);
    },
    (d) => { const deg = pick(STD_DEG.slice(1)); return mc(`Convert ${deg}° to radians.`, m(radTex(deg)), [m(radTex((deg + 30) % 360 || 30)), m(radTex((deg + 45) % 360 || 45)), m(radTex(deg * 2 % 360 || 60)), m(radTex((deg + 90) % 360 || 90))], 'Multiply by ' + m('\\frac{\\pi}{180}') + '.'); },
    (d) => { const deg = pick(STD_DEG.slice(1)); return num('Convert ' + m(radTex(deg)) + ' radians to degrees.', deg, 'Multiply by ' + m('\\frac{180}{\\pi}') + '.'); },
    (d) => { const deg = pick(STD_DEG.filter((x) => x % 90)); const q = deg < 90 ? 'I' : deg < 180 ? 'II' : deg < 270 ? 'III' : 'IV'; return mc(`In which quadrant does a ${deg}° angle end?`, 'Quadrant ' + q, ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], 'I: 0–90°, II: 90–180°, III: 180–270°, IV: 270–360°.'); },
    (d) => { const deg = pick(STD_DEG.filter((x) => x % 90)); return num(`What is the reference angle of ${deg}° (degrees)?`, refAngle(deg), 'The acute angle to the x-axis.'); }
  ];

  G['trig-right-triangles'] = [
    (d) => {
      const [a, b, c] = pick(TRIPLES.slice(0, 3)); const fn = pick(['sin', 'cos', 'tan']);
      const v = fn === 'sin' ? a / c : fn === 'cos' ? b / c : a / b;
      return num(`In a right triangle, the side opposite angle A is ${a}, the adjacent side is ${b}, and the hypotenuse is ${c}. What is ${m('\\' + fn + ' A')}? (fraction ok)`, v, 'SOH-CAH-TOA.', { display: fmtNum(v) });
    },
    (d) => { const h = ri(5, 30), deg = pick([20, 30, 35, 40, 50, 60, 70]); const v = h * Math.sin(deg * Math.PI / 180); return num(`A right triangle has hypotenuse ${h} and an angle of ${deg}°. Find the side opposite that angle (round to 2 decimals).`, Math.round(v * 100) / 100, m(`\\text{opp} = ${h}\\sin ${deg}^\\circ`), { tol: 0.011 }); },
    (d) => { const a = ri(5, 30), deg = pick([20, 30, 35, 40, 50, 60]); const v = a * Math.tan(deg * Math.PI / 180); return num(`A right triangle has an angle of ${deg}° with adjacent side ${a}. Find the opposite side (round to 2 decimals).`, Math.round(v * 100) / 100, m(`\\text{opp} = ${a}\\tan ${deg}^\\circ`), { tol: 0.011 }); },
    (d) => mc('Which is an identity?', m('\\sin^2\\theta + \\cos^2\\theta = 1'), [m('\\sin\\theta + \\cos\\theta = 1'), m('\\tan^2\\theta + 1 = \\csc^2\\theta'), m('\\sin 2\\theta = 2\\sin\\theta')], 'The Pythagorean identity.'),
    (d) => { const a = ri(3, 9), b = ri(3, 9); const C = 60; const c2 = a * a + b * b - a * b; return num(`A triangle has sides ${a} and ${b} with a ${C}° angle between them. What is ${m('c^2')} (the square of the third side)?`, c2, m(`c^2 = a^2 + b^2 - 2ab\\cos 60^\\circ = ${a * a} + ${b * b} - ${a * b}`)); }
  ];

  G.sequences = [
    (d) => { const a = ri(-10, 20), dd = nz(-6, 9), n = ri(5, R(d, 12, 30, 60)); return num(`Arithmetic sequence: ${a}, ${a + dd}, ${a + 2 * dd}, ... What is term #${n}?`, a + (n - 1) * dd, m(`a_n = a_1 + (n-1)d = ${a} + ${n - 1}\\cdot${paren(dd)}`)); },
    (d) => { const a = ri(1, 10), dd = ri(1, 6), n = ri(5, 20); return num(`Find the sum of the first ${n} terms of ${a}, ${a + dd}, ${a + 2 * dd}, ...`, n * (2 * a + (n - 1) * dd) / 2, m('S_n = \\frac{n}{2}(2a_1 + (n-1)d)')); },
    (d) => { const a = ri(1, 5), r = pick([2, 3, -2]), n = ri(4, R(d, 6, 7, 9)); return num(`Geometric sequence: ${a}, ${a * r}, ${a * r * r}, ... What is term #${n}?`, a * Math.pow(r, n - 1), m(`a_n = a_1 r^{n-1} = ${a}\\cdot ${paren(r)}^{${n - 1}}`)); },
    (d) => { const a = ri(1, 12), [rn, rd] = pick([[1, 2], [1, 3], [-1, 2], [2, 3], [1, 4]]); const v = a / (1 - rn / rd); return num(`Find the sum of the infinite geometric series with first term ${a} and ratio ${m(frac(rn, rd))}. (fraction ok)`, v, m('S = \\frac{a_1}{1 - r}'), { display: fmtNum(v) }); },
    (d) => { const n = ri(3, 10); return num('Evaluate ' + m(`\\sum_{k=1}^{${n}} k`), n * (n + 1) / 2, m('\\sum k = \\frac{n(n+1)}{2}')); }
  ];

  G['complex-numbers'] = [
    (d) => { const n = ri(2, R(d, 8, 30, 200)); const ans = ['1', 'i', '-1', '-i'][n % 4]; return mc('Simplify ' + m(`i^{${n}}`), m(ans), ['1', 'i', '-1', '-i'].map(m), `Powers of i repeat every 4; ${n} mod 4 = ${n % 4}.`); },
    (d) => { const a = ri(-6, 6), b = nz(-6, 6), c = ri(-6, 6), e = nz(-6, 6); return mc('Add: ' + m(`(${cx(a, b)}) + (${cx(c, e)})`), m(cx(a + c, b + e)), [m(cx(a + c, b - e)), m(cx(a - c, b + e)), m(cx(a * c, b * e))], 'Add real parts and imaginary parts separately.'); },
    (d) => { const a = ri(-5, 5), b = nz(-5, 5), c = ri(-5, 5), e = nz(-5, 5); return mc('Multiply: ' + m(`(${cx(a, b)})(${cx(c, e)})`), m(cx(a * c - b * e, a * e + b * c)), [m(cx(a * c + b * e, a * e + b * c)), m(cx(a * c - b * e, a * e - b * c)), m(cx(a * c, b * e))], m('(a+bi)(c+di) = (ac - bd) + (ad + bc)i')); },
    (d) => { const [p, q, r] = pick(TRIPLES.slice(0, 3)); const k = ri(1, 2); const s1 = pick([1, -1]), s2 = pick([1, -1]); return num('Find ' + m(`|${cx(s1 * p * k, s2 * q * k)}|`), r * k, m(`\\sqrt{${p * k}^2 + ${q * k}^2}`)); },
    (d) => { const a = ri(-9, 9), b = nz(-9, 9); return mc('What is the conjugate of ' + m(cx(a, b)) + '?', m(cx(a, -b)), [m(cx(-a, b)), m(cx(-a, -b)), m(cx(b, a))], 'Flip the sign of the imaginary part.'); }
  ];

  G.limits = [
    (d) => { const cs = [ri(-4, 4), ri(-6, 6), ri(-9, 9)]; if (!cs[0]) cs[0] = 1; const a = ri(-4, 4); return num('Evaluate ' + m(`\\lim_{x \\to ${a}} \\left(${poly(cs)}\\right)`), evalPoly(cs, a), 'Polynomials are continuous: substitute directly.'); },
    (d) => { const a = nz(-9, 9); return num('Evaluate ' + m(`\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x ${sgn(-a)}}`), 2 * a, 'Factor the top: ' + m(`(x - ${paren(a)})(x + ${paren(a)})`) + ', cancel, then substitute.'); },
    (d) => { const a = nz(-9, 9), b = nz(-9, 9), c = ri(-9, 9); const v = a / b; return num('Evaluate ' + m(`\\lim_{x \\to \\infty} \\frac{${poly([a, c, 1])}}{${poly([b, 0, ri(1, 9)])}}`) + ' (fraction ok)', v, 'Same degree on top and bottom → ratio of leading coefficients.', { display: fmtNum(v) }); },
    (d) => { const k = nz(-9, 9); return num('Evaluate ' + m(`\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{x}`), k, m(`\\frac{\\sin(${k}x)}{x} = ${k}\\cdot\\frac{\\sin(${k}x)}{${k}x} \\to ${k}`)); },
    (d) => { const a = nz(-5, 5), b = nz(-5, 5); return mc('Evaluate ' + m(`\\lim_{x \\to \\infty} \\frac{${poly([a, 1])}}{${poly([b, 0, 3])}}`), m('0'), [m(fracVal(a / b)), m('\\infty'), m('\\text{does not exist}')], 'Degree of top < degree of bottom → the limit is 0.'); }
  ];

  G.derivatives = [
    (d) => { const deg = R(d, 2, 3, 4); const cs = [nz(-5, 5)]; for (let i = 0; i < deg; i++) cs.push(ri(-6, 6)); const x = ri(-3, 3); const dcs = cs.slice(0, -1).map((c, i) => c * (deg - i)); return num(`If ${m('f(x) = ' + poly(cs))}, find ${m(`f'(${x})`)}.`, evalPoly(dcs, x), m("f'(x) = " + poly(dcs))); },
    (d) => { const a = nz(-9, 9), n = ri(2, 9); return mc('Find ' + m(`\\frac{d}{dx}\\left(${a}x^{${n}}\\right)`), m(`${a * n}x^{${n - 1 === 1 ? '' : n - 1}}`.replace('^{}', '')), [m(`${a}x^{${n - 1}}`), m(`${a * n}x^{${n}}`), m(`${a * (n + 1)}x^{${n + 1}}`), m(`${n}x^{${n - 1}}`)], 'Power rule: multiply by the exponent, then subtract 1 from it.'); },
    (d) => {
      const a = ri(2, 9);
      const items = [
        [`\\sin(${a}x)`, `${a}\\cos(${a}x)`, [`\\cos(${a}x)`, `-${a}\\cos(${a}x)`, `${a}\\sin(${a}x)`]],
        [`\\cos(${a}x)`, `-${a}\\sin(${a}x)`, [`${a}\\sin(${a}x)`, `-\\sin(${a}x)`, `-${a}\\cos(${a}x)`]],
        [`e^{${a}x}`, `${a}e^{${a}x}`, [`e^{${a}x}`, `${a}xe^{${a}x - 1}`, `\\frac{e^{${a}x}}{${a}}`]],
        [`\\ln(${a}x)`, `\\frac{1}{x}`, [`\\frac{${a}}{x}`, `\\frac{1}{${a}x}`, `${a}\\ln x`]],
        [`\\tan x`, `\\sec^2 x`, [`\\cot x`, `-\\csc^2 x`, `\\sec x \\tan x`]]
      ];
      const [f, fp, w] = pick(items);
      return mc('Find ' + m(`\\frac{d}{dx}\\left[${f}\\right]`), m(fp), w.map(m), 'Use the chain rule where there is an inner function.');
    },
    (d) => { const a = ri(2, 6), b = nz(-9, 9), n = ri(2, 6); return mc('Find ' + m(`\\frac{d}{dx}\\left(${a}x ${sgn(b)}\\right)^{${n}}`), m(`${n * a}(${a}x ${sgn(b)})^{${n - 1}}`), [m(`${n}(${a}x ${sgn(b)})^{${n - 1}}`), m(`${n * a}(${a}x ${sgn(b)})^{${n}}`), m(`${a}(${a}x ${sgn(b)})^{${n - 1}}`)], 'Chain rule: outer derivative times inner derivative (' + a + ').'); },
    (d) => mc('Find ' + m('\\frac{d}{dx}\\left(x^2 \\sin x\\right)'), m('2x\\sin x + x^2\\cos x'), [m('2x\\cos x'), m('2x\\sin x - x^2\\cos x'), m('x^2\\cos x')], 'Product rule: ' + m("f'g + fg'")),
    (d) => { const a = nz(-3, 3), b = ri(-8, 8), c = ri(-9, 9); const xc = -b / (2 * a); return num(`At what x does ${m('f(x) = ' + poly([a, b, c]))} have a critical point? (fraction ok)`, xc, 'Set ' + m("f'(x) = " + poly([2 * a, b]) + ' = 0'), { display: fmtNum(xc) }); }
  ];

  G.integrals = [
    (d) => { const cs = R(d, [nz(-3, 3), ri(-5, 5)], [nz(-3, 3) * 3, ri(-4, 4) * 2, ri(-5, 5)], [nz(-4, 4) * 4, nz(-3, 3) * 3, ri(-4, 4) * 2, ri(-5, 5)]); const a = ri(-2, 1), b = a + ri(1, 3); const deg = cs.length - 1; const F = (x) => cs.reduce((s, c, i) => s + c * Math.pow(x, deg - i + 1) / (deg - i + 1), 0); const v = F(b) - F(a); return num('Evaluate ' + m(`\\int_{${a}}^{${b}} \\left(${poly(cs)}\\right)\\,dx`) + ' (fraction ok)', v, 'Antiderivative, then F(b) − F(a).', { display: fmtNum(v) }); },
    (d) => { const a = ri(1, 9), n = ri(1, 6); const co = frac(a, n + 1) === '1' ? '' : frac(a, n + 1); return mc('Find ' + m(`\\int ${a}x^{${n}}\\,dx`), m(`${co}x^{${n + 1}} + C`), [m(`${a * n}x^{${n - 1}} + C`), m(`${a}x^{${n + 1}} + C`), m(`${frac(a, n)}x^{${n}} + C`)], 'Power rule for integrals: raise the exponent by 1, divide by the new exponent.'); },
    (d) => {
      const k = ri(2, 6);
      const items = [
        [`\\cos(${k}x)`, `\\frac{1}{${k}}\\sin(${k}x) + C`, [`${k}\\sin(${k}x) + C`, `-\\frac{1}{${k}}\\sin(${k}x) + C`, `\\sin(${k}x) + C`]],
        [`e^{${k}x}`, `\\frac{1}{${k}}e^{${k}x} + C`, [`${k}e^{${k}x} + C`, `e^{${k}x} + C`, `\\frac{e^{${k + 1}x}}{${k + 1}} + C`]],
        [`\\frac{${k}}{x}`, `${k}\\ln|x| + C`, [`-\\frac{${k}}{x^2} + C`, `\\ln|${k}x| \\cdot x + C`, `\\frac{${k}x^2}{2} + C`]],
        [`\\sin x`, `-\\cos x + C`, [`\\cos x + C`, `-\\sin x + C`, `\\sin x \\cos x + C`]]
      ];
      const [f, F, w] = pick(items);
      return mc('Find ' + m(`\\int ${f}\\,dx`), m(F), w.map(m), 'Check: differentiate your answer to get back the integrand.');
    },
    (d) => { const c = ri(2, 9), a = ri(0, 4), b = a + ri(1, 6); return num('Evaluate ' + m(`\\int_{${a}}^{${b}} ${c}\\,dx`), c * (b - a), 'The area of a rectangle: height × width.'); },
    (d) => { const n = ri(1, 4), b = ri(1, 3); const v = Math.pow(b, n + 1) / (n + 1); return num('Evaluate ' + m(`\\int_{0}^{${b}} x^{${n}}\\,dx`) + ' (fraction ok)', v, m(`\\left[\\frac{x^{${n + 1}}}{${n + 1}}\\right]_0^{${b}}`), { display: fmtNum(v) }); }
  ];

  G.series = [
    (d) => { const p = pick(['1', '2', '3', '\\tfrac{1}{2}', '0.9', '1.5', '4']); const val = U.evalExpr(p); return mc('Does ' + m(`\\sum_{n=1}^{\\infty} \\frac{1}{n^{${p}}}`) + ' converge or diverge?', val > 1 ? 'Converges' : 'Diverges', ['Converges', 'Diverges'], 'p-series converges exactly when p > 1.'); },
    (d) => { const [rn, rd] = pick([[1, 2], [2, 3], [3, 2], [5, 4], [1, 5], [-1, 3]]); return mc('Does ' + m(`\\sum_{n=0}^{\\infty} \\left(${frac(rn, rd)}\\right)^n`) + ' converge or diverge?', Math.abs(rn / rd) < 1 ? 'Converges' : 'Diverges', ['Converges', 'Diverges'], 'A geometric series converges when |r| < 1.'); },
    (d) => { const n = ri(2, 5); return num('What is the coefficient of ' + m(`x^{${n}}`) + ' in the Maclaurin series of ' + m('e^x') + '? (fraction ok)', 1 / U.fact(n), m(`\\frac{1}{${n}!}`), { display: '1/' + U.fact(n) }); },
    (d) => { const k = ri(2, 9); return num('Find the radius of convergence of ' + m(`\\sum_{n=0}^{\\infty} \\frac{x^n}{${k}^n}`), k, 'Ratio test: ' + m(`|x|/${k} < 1`)); },
    (d) => { const a = ri(1, 9); return mc('What does the nth-term test say about ' + m(`\\sum \\frac{${a}n}{n+1}`) + '?', 'It diverges', ['It converges', 'It diverges', 'The test is inconclusive'], `The terms approach ${a} ≠ 0, so the series diverges.`); }
  ];

  G.multivariable = [
    (d) => { const a = nz(-5, 5), p = ri(1, 3), q = ri(1, 3), x = ri(-2, 2), y = ri(-2, 2); const v = a * p * Math.pow(x, p - 1) * Math.pow(y, q); const pw = (v, e) => (e === 0 ? '' : e === 1 ? v : v + '^{' + e + '}'); return num(`If ${m(`f(x,y) = ${a === 1 ? '' : a === -1 ? '-' : a}${pw('x', p)}${pw('y', q)}`)}, find ${m('f_x')} at (${x}, ${y}).`, v, m(`f_x = ${a * p}${pw('x', p - 1)}${pw('y', q)}`)); },
    (d) => { const a = nz(-5, 5), b = nz(-5, 5), x = ri(-3, 3), y = ri(-3, 3); return num(`If ${m(`f(x,y) = ${poly([a, 0, 0])} ${sgn(b)}xy`)}, find ${m('\\frac{\\partial f}{\\partial y}')} at (${x}, ${y}).`, b * x, 'Treat x as a constant.'); },
    (d) => { const u = [ri(-5, 5), ri(-5, 5), ri(-5, 5)], v = [ri(-5, 5), ri(-5, 5), ri(-5, 5)]; return num(`Compute the dot product ${m(`\\langle ${u} \\rangle \\cdot \\langle ${v} \\rangle`)}.`, u[0] * v[0] + u[1] * v[1] + u[2] * v[2], 'Multiply matching components and add.'); },
    (d) => { const u = [ri(-4, 4), ri(-4, 4), ri(-4, 4)], v = [ri(-4, 4), ri(-4, 4), ri(-4, 4)]; return num(`Find the z-component of ${m(`\\langle ${u} \\rangle \\times \\langle ${v} \\rangle`)}.`, u[0] * v[1] - u[1] * v[0], m('u_1v_2 - u_2v_1')); },
    (d) => { const a = ri(1, 4), b = ri(1, 4); const v = a * a * b * b / 4; return num('Evaluate ' + m(`\\int_0^{${b}}\\int_0^{${a}} xy\\,dx\\,dy`) + ' (fraction ok)', v, m(`\\left(\\frac{${a}^2}{2}\\right)\\left(\\frac{${b}^2}{2}\\right)`), { display: fmtNum(v) }); },
    (d) => { const a = nz(-4, 4), b = nz(-4, 4); const x = ri(-3, 3), y = ri(-3, 3); return mc(`What is ${m('\\nabla f')} for ${m(`f(x,y) = ${poly([a, 0, 0])} ${sgn(b)}y^2`)} at (${x}, ${y})?`, m(`\\langle ${2 * a * x}, ${2 * b * y} \\rangle`), [m(`\\langle ${a * x}, ${b * y} \\rangle`), m(`\\langle ${2 * b * y}, ${2 * a * x} \\rangle`), m(`\\langle ${2 * a}, ${2 * b} \\rangle`)], m(`\\nabla f = \\langle ${2 * a}x, ${2 * b}y \\rangle`)); }
  ];

  const mat = (A) => '\\begin{pmatrix}' + A.map((r) => r.join(' & ')).join(' \\\\ ') + '\\end{pmatrix}';
  G['linear-algebra'] = [
    (d) => { const A = [[ri(-9, 9), ri(-9, 9)], [ri(-9, 9), ri(-9, 9)]]; return num('Find ' + m('\\det' + mat(A)), A[0][0] * A[1][1] - A[0][1] * A[1][0], m('ad - bc')); },
    (d) => { const A = [0, 1, 2].map(() => [ri(-4, 4), ri(-4, 4), ri(-4, 4)]); const [a, b, c] = A[0], [e, f, g] = A[1], [h, i, j] = A[2]; return num('Find ' + m('\\det' + mat(A)), a * (f * j - g * i) - b * (e * j - g * h) + c * (e * i - f * h), 'Cofactor expansion along the first row.'); },
    (d) => { const A = [[ri(-5, 5), ri(-5, 5)], [ri(-5, 5), ri(-5, 5)]], B = [[ri(-5, 5), ri(-5, 5)], [ri(-5, 5), ri(-5, 5)]]; const i = ri(0, 1), j = ri(0, 1); return num(`Let ${m('A = ' + mat(A))} and ${m('B = ' + mat(B))}. Find entry (${i + 1}, ${j + 1}) of ${m('AB')}.`, A[i][0] * B[0][j] + A[i][1] * B[1][j], `Row ${i + 1} of A dotted with column ${j + 1} of B.`); },
    (d) => { const l1 = ri(-6, 6), l2 = ri(-6, 6), b = ri(-9, 9); return num('What is the LARGEST eigenvalue of ' + m(mat([[l1, b], [0, l2]])) + '?', Math.max(l1, l2), 'A triangular matrix has its eigenvalues on the diagonal.'); },
    (d) => { const a = ri(-6, 6), b = ri(-6, 6), k = ri(-3, 3); const sing = Math.random() < 0.5; const A = sing ? [[a, b], [k * a, k * b]] : [[a, b], [ri(-6, 6), ri(-6, 6)]]; const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]; return mc('Is ' + m(mat(A)) + ' invertible?', det !== 0 ? 'Yes' : 'No', ['Yes', 'No'], `The determinant is ${det}.`); },
    (d) => { const n = ri(2, 3); const A = Array.from({ length: n }, () => Array.from({ length: n }, () => ri(-9, 9))); return num('Find the trace of ' + m(mat(A)), A.reduce((s, r, i) => s + r[i], 0), 'Add the diagonal entries.'); },
    (d) => { const l1 = ri(-5, 5), l2 = ri(-5, 5); const tr = l1 + l2, det = l1 * l2; return num(`A 2×2 matrix has trace ${tr} and determinant ${det}. What is its larger eigenvalue?`, Math.max(l1, l2), m(`\\lambda^2 - ${paren(tr)}\\lambda + ${paren(det)} = 0`)); }
  ];

  G['differential-equations'] = [
    (d) => { const k = nz(-5, 5), C = ri(1, 9); return mc('Solve ' + m(`y' = ${k}y`) + ' with ' + m(`y(0) = ${C}`), m(`y = ${C}e^{${k}t}`), [m(`y = e^{${k}t} + ${C}`), m(`y = ${C}e^{${-k}t}`), m(`y = ${k}${C}e^{t}`)], m("y' = ky \\Rightarrow y = Ce^{kt}")); },
    (d) => { const r1 = ri(-5, 5); let r2 = ri(-5, 5); while (Math.abs(r2) === Math.abs(r1)) r2 = ri(-5, 5); const b = -(r1 + r2), c = r1 * r2; const e = (r) => (r === 0 ? '' : `e^{${r === 1 ? '' : r === -1 ? '-' : r}t}`); const sol = (p, q) => `y = C_1${e(p) || ''} + C_2${e(q) || ''}`; const lhs = "y''" + (b ? (b < 0 ? ' - ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + "y'" : '') + (c ? (c < 0 ? ' - ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'y' : ''); return mc('General solution of ' + m(lhs + ' = 0'), m(sol(r1, r2)), [m(sol(-r1, -r2)), m(sol(r1, -r2)), m(`y = (C_1 + C_2t)e^{${r1}t}`)], `Characteristic equation ${m('r^2 ' + poly([b, c], 'r').replace(/^(?!-)/, '+ ').replace(/^-/, '- ').replace(/^\+ 0$/, '') + ' = 0')} has roots ${r1} and ${r2}.`); },
    (d) => { const n = ri(1, 4); const ys = ['y', "y'", "y''", "y'''", 'y^{(4)}']; return num('What is the order of ' + m(`${ys[n]} + ${ri(2, 5)}${ys[Math.max(0, n - 1)]} - ${ri(1, 9)}y = \\sin t`) + '?', n, 'The order is the highest derivative.'); },
    (d) => { const x0 = 0, y0 = ri(1, 5), h = pick([0.1, 0.5, 1]), a = nz(-3, 3); const v = Math.round((y0 + h * (a * x0 + y0)) * 1000) / 1000; return num(`Use one step of Euler's method with ${m('h = ' + h)} for ${m(`y' = ${a}x + y`)}, ${m(`y(0) = ${y0}`)}. Estimate ${m(`y(${h})`)}.`, v, m(`y_1 = y_0 + h\\,f(x_0,y_0) = ${y0} + ${h}(${y0})`)); },
    (d) => { const a = ri(1, 3); return mc('Solve the separable equation ' + m(`\\frac{dy}{dx} = ${a === 1 ? '' : a}xy`), m(`y = Ce^{${frac(a, 2)}x^2}`), [m(`y = Ce^{${a}x}`), m(`y = ${frac(a, 2)}x^2 + C`), m(`y = Ce^{${a}x^2}`)], m(`\\int\\frac{dy}{y} = \\int ${a}x\\,dx`)); }
  ];

  G.statistics = [
    (d) => { const n = ri(4, 7); const xs = Array.from({ length: n - 1 }, () => ri(1, 20)); const target = ri(5, 15) * n; const last = target - xs.reduce((a, b) => a + b, 0); if (last < 0 || last > 60) return G.statistics[1](d); xs.push(last); return num(`Find the mean of: ${shuffle(xs).join(', ')}`, target / n, 'Add them up and divide by ' + n + '.'); },
    (d) => { const n = pick([5, 6, 7, 8]); const xs = Array.from({ length: n }, () => ri(1, 30)); const s = xs.slice().sort((a, b) => a - b); const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; return num(`Find the median of: ${xs.join(', ')}`, med, 'Sort: ' + s.join(', ') + '.'); },
    (d) => { const xs = Array.from({ length: 6 }, () => ri(1, 40)); return num(`Find the range of: ${xs.join(', ')}`, Math.max(...xs) - Math.min(...xs), 'Max − min.'); },
    (d) => { const k = ri(1, 5); return num(`Rolling one fair die, what is P(rolling a number greater than ${k})? (fraction ok)`, (6 - k) / 6, `${6 - k} favorable outcomes out of 6.`, { display: fmtNum((6 - k) / 6) }); },
    (d) => { const s = ri(2, 12); const ways = 6 - Math.abs(7 - s); return num(`Rolling two fair dice, what is P(sum = ${s})? (fraction ok)`, ways / 36, `${ways} of 36 outcomes give ${s}.`, { display: fmtNum(ways / 36) }); },
    (d) => { const n = ri(2, 6); return num(`Flip a fair coin ${n} times. P(all heads)? (fraction ok)`, 1 / Math.pow(2, n), m(`\\left(\\frac{1}{2}\\right)^{${n}}`), { display: '1/' + Math.pow(2, n) }); },
    (d) => { const mu = ri(50, 90), sd = ri(2, 10), z = pick([-2, -1.5, -1, 0.5, 1, 1.5, 2, 2.5]); return num(`A score of ${mu + z * sd} on a test with mean ${mu} and standard deviation ${sd} has what z-score?`, z, m('z = \\frac{x - \\mu}{\\sigma}')); },
    (d) => { const w = ri(2, 10), l = ri(1, 5), p = pick([[1, 4], [1, 3], [1, 2], [2, 5]]); const v = w * p[0] / p[1] - l * (1 - p[0] / p[1]); return num(`A game pays ${w} points with probability ${m(frac(p[0], p[1]))} and loses ${l} points otherwise. Expected value? (fraction ok)`, v, m('E = \\sum x\\,P(x)'), { display: fmtNum(v) }); }
  ];

  G['discrete-math'] = [
    (d) => { const n = ri(4, R(d, 7, 10, 15)), r = ri(1, Math.min(n - 1, 5)); return num('Compute ' + m(`\\binom{${n}}{${r}}`), U.nCr(n, r), m(`\\frac{${n}!}{${r}!\\,${n - r}!}`)); },
    (d) => { const n = ri(4, 9), r = ri(1, 4); return num(`How many ways can ${r} people be chosen IN ORDER from ${n}? ${m(`P(${n},${r})`)}`, U.fact(n) / U.fact(n - r), m(`\\frac{${n}!}{${n - r}!}`)); },
    (d) => { const n = ri(0, 7); return num('Compute ' + m(n + '!'), U.fact(n), n === 0 ? 'By definition 0! = 1.' : 'Multiply ' + n + ' down to 1.'); },
    (d) => { const v = ri(1, R(d, 15, 63, 255)); return num(`Convert binary ${v.toString(2)} to decimal.`, v, 'Add powers of 2 where there is a 1.'); },
    (d) => { const v = ri(2, R(d, 15, 63, 255)); return mc(`Convert ${v} to binary.`, v.toString(2), [(v + 1).toString(2), (v ^ 2).toString(2), (v - 1).toString(2), (v << 1).toString(2)], 'Repeatedly divide by 2 and read remainders bottom-up.'); },
    (d) => { const p = pick([true, false]), q = pick([true, false]); const op = pick(['\\land', '\\lor', '\\to', '\\leftrightarrow']); const val = op === '\\land' ? p && q : op === '\\lor' ? p || q : op === '\\to' ? !p || q : p === q; return mc(`If p is ${p ? 'true' : 'false'} and q is ${q ? 'true' : 'false'}, what is ${m('p ' + op + ' q')}?`, val ? 'True' : 'False', ['True', 'False'], op === '\\to' ? 'p → q is only false when p is true and q is false.' : 'Apply the truth table.'); },
    (d) => { const n = ri(2, 10); return num(`How many subsets does a set with ${n} elements have?`, Math.pow(2, n), m(`2^{${n}}`)); },
    (d) => mc('What is the contrapositive of "If p, then q"?', 'If not q, then not p', ['If q, then p', 'If not p, then not q', 'p and not q'], 'Swap and negate both parts.')
  ];

  G['number-theory'] = [
    (d) => { const g = ri(2, 12), a = g * ri(1, 12), b = g * ri(1, 12); return num(`Find gcd(${a}, ${b}).`, gcd(a, b), 'Use the Euclidean algorithm or prime factorizations.'); },
    (d) => { const a = ri(2, 20), b = ri(2, 20); return num(`Find lcm(${a}, ${b}).`, U.lcm(a, b), m('\\text{lcm}(a,b) = \\frac{ab}{\\gcd(a,b)}')); },
    (d) => { const n = ri(3, 13), a = ri(10, R(d, 60, 200, 1000)); return num('Compute ' + m(`${a} \\bmod ${n}`), a % n, `${a} = ${n}·${Math.floor(a / n)} + ${a % n}.`); },
    (d) => { const nums = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 9, 15, 21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93]; const n = pick(nums); const isP = n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every((k) => n % k); return mc(`Is ${n} prime?`, isP ? 'Yes' : 'No', ['Yes', 'No'], isP ? 'No divisors other than 1 and itself.' : `It has a divisor besides 1 and ${n}.`); },
    (d) => { const p = pick([5, 7, 11, 13]), a = ri(2, p - 1); let inv = 1; while ((a * inv) % p !== 1) inv++; return num(`Find the inverse of ${a} modulo ${p} (a number from 1 to ${p - 1}).`, inv, `${a} × ${inv} = ${a * inv} ≡ 1 (mod ${p}).`); },
    (d) => { const n = pick([12, 18, 20, 24, 28, 30, 36, 48, 60, 72]); let c = 0; for (let k = 1; k <= n; k++) if (n % k === 0) c++; return num(`How many positive divisors does ${n} have?`, c, 'Use the prime factorization: multiply (exponent + 1).'); },
    (d) => { const n = pick([7, 9, 10, 12, 15, 16, 20]); let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return num('Compute Euler\'s totient ' + m(`\\varphi(${n})`), c, 'Count 1..n that share no factor with n.'); }
  ];

  G['abstract-algebra'] = [
    (d) => { const n = pick([6, 8, 10, 12, 15, 18, 20, 24]), k = ri(1, n - 1); return num(`What is the order of ${k} in ${m(`\\mathbb{Z}_{${n}}`)} (under addition)?`, n / gcd(n, k), m(`\\frac{n}{\\gcd(n,k)} = \\frac{${n}}{${gcd(n, k)}}`)); },
    (d) => { const n = ri(2, 6); return num('What is the order of the symmetric group ' + m(`S_{${n}}`) + '?', U.fact(n), m(`|S_n| = n!`)); },
    (d) => { const N = pick([12, 15, 18, 20, 24, 30, 36]); const divs = [], non = []; for (let k = 2; k < N; k++) (N % k ? non : divs).push(k); return mc(`A group has order ${N}. Which could be the order of a subgroup?`, String(pick(divs)), shuffle(non).slice(0, 3).map(String), "Lagrange's theorem: subgroup orders divide the group order."); },
    (d) => { const n = pick([5, 6, 8, 9, 10, 12, 15]); let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return num(`How many generators does the cyclic group ${m(`\\mathbb{Z}_{${n}}`)} have?`, c, m(`\\varphi(${n})`)); },
    (d) => mc('Which of these is NOT a group?', m('(\\mathbb{Z}, \\times)'), [m('(\\mathbb{Z}, +)'), m('(\\mathbb{Q}\\setminus\\{0\\}, \\times)'), m('(\\mathbb{R}, +)')], 'Most integers have no multiplicative inverse in ℤ.'),
    (d) => { const p = pick([2, 3, 5, 7]), k = ri(1, 3); return num(`How many elements are in the finite field ${m(`\\mathbb{F}_{${p}^{${k}}}`)}?`, Math.pow(p, k), 'A finite field has p^k elements.'); }
  ];

  G['real-analysis'] = [
    (d) => { const a = nz(-9, 9), c = nz(-9, 9), b = ri(-9, 9), e = ri(1, 9); return num('Find ' + m(`\\lim_{n\\to\\infty} \\frac{${poly([a, b], 'n')}}{${poly([c, e], 'n')}}`) + ' (fraction ok)', a / c, 'Divide top and bottom by n.', { display: fmtNum(a / c) }); },
    (d) => { const a = ri(-5, 9); return num('Find ' + m(`\\sup\\left\\{ ${a} - \\frac{1}{n} : n \\in \\mathbb{N} \\right\\}`), a, 'The terms increase toward ' + a + ' but never reach it.'); },
    (d) => { const a = ri(-5, 9); return num('Find ' + m(`\\inf\\left\\{ ${a} + \\frac{1}{n} : n \\in \\mathbb{N} \\right\\}`), a, 'The terms decrease toward ' + a + '.'); },
    (d) => { const items = [['(-1)^n', 'Diverges'], ['\\frac{1}{n}', 'Converges'], ['\\frac{\\sin n}{n}', 'Converges'], ['n^2', 'Diverges'], ['\\left(1 + \\frac{1}{n}\\right)^n', 'Converges'], ['\\cos(\\pi n)', 'Diverges']]; const [s, a] = pick(items); return mc('Does the sequence ' + m(`a_n = ${s}`) + ' converge?', a, ['Converges', 'Diverges'], a === 'Converges' ? 'It approaches a single finite limit.' : 'It oscillates or grows without bound.'); },
    (d) => { const items = [['[0, 1]', 'Yes'], ['(0, 1)', 'No'], ['[0, \\infty)', 'No'], ['\\{1, 2, 3\\}', 'Yes'], ['\\mathbb{Q} \\cap [0,1]', 'No']]; const [s, a] = pick(items); return mc('Is ' + m(s) + ' compact (as a subset of ℝ)?', a, ['Yes', 'No'], 'Heine–Borel: compact ⇔ closed and bounded.'); }
  ];

  G['complex-analysis'] = [
    (d) => { const [p, q, r] = pick(TRIPLES.slice(0, 3)); return num('Find ' + m(`|${cx(pick([1, -1]) * p, pick([1, -1]) * q)}|`), r, m('|a+bi| = \\sqrt{a^2+b^2}')); },
    (d) => { const c = nz(-9, 9), a = ri(-5, 5); return num('Find the residue of ' + m(`f(z) = \\frac{${c}}{z ${sgn(-a)}}`) + ` at ${m('z = ' + a)}.`, c, m('\\lim_{z\\to a}(z-a)f(z)')); },
    (d) => { const a = ri(0, 5); let R = ri(1, 6); if (R === a) R = a + 1; const inside = a < R; return mc('Evaluate ' + m(`\\oint_{|z| = ${R}} \\frac{dz}{z - ${a}}`), m(inside ? '2\\pi i' : '0'), [m('2\\pi i'), m('0'), m('\\pi i'), m('1')], inside ? 'The pole is inside the contour (Cauchy integral formula).' : 'The pole is outside the contour, so the integrand is analytic inside (Cauchy).'); },
    (d) => { const th = pick([['\\pi', '-1'], ['\\frac{\\pi}{2}', 'i'], ['2\\pi', '1'], ['\\frac{3\\pi}{2}', '-i']]); return mc('Evaluate ' + m(`e^{i${th[0]}}`), m(th[1]), ['1', '-1', 'i', '-i'].map(m), "Euler's formula: " + m('e^{i\\theta} = \\cos\\theta + i\\sin\\theta')); },
    (d) => { const deg = pick([0, 45, 90, 135, 180, -45, -90]); const map = { 0: [1, 0], 45: [1, 1], 90: [0, 1], 135: [-1, 1], 180: [-1, 0], '-45': [1, -1], '-90': [0, -1] }; const [a, b] = map[deg]; const k = ri(1, 4); return num('What is the argument (in degrees, between −180 and 180) of ' + m(cx(a * k, b * k)) + '?', deg, 'Find the angle of the point (a, b) from the positive real axis.'); }
  ];

  G.topology = [
    (d) => { const n = ri(1, 6); return num(`How many open sets does the discrete topology on a ${n}-point set have?`, Math.pow(2, n), 'Every subset is open: ' + m(`2^{${n}}`)); },
    (d) => { const n = ri(2, 9); return num(`How many open sets does the indiscrete topology on a ${n}-point set have?`, 2, 'Only the empty set and the whole space.'); },
    (d) => { const g = ri(0, 5); return num(`What is the Euler characteristic of a closed orientable surface of genus ${g}?`, 2 - 2 * g, m('\\chi = 2 - 2g')); },
    (d) => { const solids = [['cube', 8, 12, 6], ['tetrahedron', 4, 6, 4], ['octahedron', 6, 12, 8], ['square pyramid', 5, 8, 5], ['triangular prism', 6, 9, 5]]; const [nm, V, E, F] = pick(solids); return num(`A ${nm} has ${V} vertices, ${E} edges and ${F} faces. Compute V − E + F.`, V - E + F, 'Euler characteristic of a sphere-like surface is 2.'); },
    (d) => { const items = [['A sphere and a cube', 'Yes'], ['A coffee mug and a donut (torus)', 'Yes'], ['A sphere and a torus', 'No'], ['A circle and a line segment', 'No'], ['A square and a circle', 'Yes']]; const [s, a] = pick(items); return mc(`Are these homeomorphic? ${s}`, a, ['Yes', 'No'], a === 'Yes' ? 'One can be continuously deformed into the other.' : 'A topological invariant (holes, connectedness after removing a point) differs.'); },
    (d) => { const items = [['ℝ', 'Yes'], ['ℝ \\ {0}', 'No'], ['[0,1] ∪ [2,3]', 'No'], ['(0, 1)', 'Yes'], ['ℚ', 'No']]; const [s, a] = pick(items); return mc(`Is ${s} connected (usual topology)?`, a, ['Yes', 'No'], a === 'Yes' ? 'It is an interval, which is connected.' : 'It splits into two disjoint nonempty open pieces.'); }
  ];

  function generate(catId, d) {
    const gens = G[catId];
    if (!gens || !gens.length) return null;
    for (let tries = 0; tries < 5; tries++) {
      try {
        const q = pick(gens)(d || 2);
        if (q && (q.kind !== 'input' || isFinite(q.answer))) { q.categoryId = catId; return q; }
      } catch (e) { /* try another generator */ }
    }
    return null;
  }

  root.MSG = root.MSG || {};
  root.MSG.Generators = { G, generate, has: (id) => !!(G[id] && G[id].length), fmtNum, helpers: { num, mc, m, frac, fmtNum } };
})(typeof window !== 'undefined' ? window : globalThis);

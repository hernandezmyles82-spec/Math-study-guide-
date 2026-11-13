/* Reads uploaded PDF and Word (.docx) files into plain-text notes, entirely in the browser.
   The libraries are large, so they load only when a student picks such a file:
   - on the website from vendor/ (allowed by the security policy, which permits the site's own files);
   - in the claude.ai build they are embedded as <script type="text/plain" id="vendor-…"> blocks
     (separate files can be blocked there) and run from that text. */
(function (root) {
  'use strict';

  const SRC = { pdfjs: 'vendor/pdfjs/pdf.min.js', mammoth: 'vendor/mammoth/mammoth.browser.min.js' };
  const loading = {};
  function loadVendor(name) {
    if (loading[name]) return loading[name];
    loading[name] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      const inline = document.getElementById('vendor-' + name);
      if (inline) { s.textContent = inline.textContent; document.head.appendChild(s); resolve(); return; }
      s.src = SRC[name]; s.onload = resolve; s.onerror = () => { loading[name] = null; reject(new Error('Could not load the file reader. Check your connection and try again.')); };
      document.head.appendChild(s);
    });
    return loading[name];
  }

  let workerUrl = null;
  function pdfWorker() {
    if (workerUrl) return workerUrl;
    const inline = document.getElementById('vendor-pdfworker');
    workerUrl = inline ? URL.createObjectURL(new Blob([inline.textContent], { type: 'text/javascript' })) : 'vendor/pdfjs/pdf.worker.min.js';
    return workerUrl;
  }

  /* PDF → text, one line per line of the page, a blank line between pages. */
  async function pdf(buffer) {
    await loadVendor('pdfjs');
    const lib = root.pdfjsLib;
    lib.GlobalWorkerOptions.workerSrc = pdfWorker();
    const doc = await lib.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise;
    const pages = [];
    for (let i = 1; i <= Math.min(doc.numPages, 200); i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      let line = '', out = [];
      content.items.forEach((it) => { line += it.str; if (it.hasEOL) { out.push(line); line = ''; } });
      if (line) out.push(line);
      pages.push(out.map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n'));
    }
    const text = pages.filter(Boolean).join('\n\n');
    if (!text.trim()) throw new Error('This PDF has no text to read (it may be a scanned image). Try copying the text, or typing the key points.');
    return text;
  }

  /* Word (.docx) → Markdown-style notes: headings, bullet lists and bold words are kept,
     because the notes reader turns them into study cards. The HTML from mammoth is read with
     DOMParser, which never runs scripts or loads images, and only text is kept. */
  async function docx(buffer) {
    await loadVendor('mammoth');
    const res = await root.mammoth.convertToHtml({ arrayBuffer: buffer });
    const doc = new DOMParser().parseFromString('<body>' + res.value + '</body>', 'text/html');
    const inline = (el) => Array.from(el.childNodes).map((n) => (n.nodeType === 3 ? n.textContent : /^(STRONG|B)$/.test(n.nodeName) ? '**' + n.textContent.trim() + '**' : n.nodeName === 'BR' ? ' ' : inline(n))).join('').replace(/\s+/g, ' ').trim();
    const lines = [];
    const walk = (el) => {
      Array.from(el.children).forEach((c) => {
        const tag = c.nodeName;
        if (/^H[1-6]$/.test(tag)) lines.push('', '#'.repeat(Math.min(3, Number(tag[1]) + 1)) + ' ' + c.textContent.trim());
        else if (tag === 'P') { const t = inline(c); if (t) lines.push(t); }
        else if (tag === 'UL' || tag === 'OL') Array.from(c.children).forEach((li, i) => { const t = inline(li); if (t) lines.push((tag === 'OL' ? i + 1 + '. ' : '- ') + t); });
        else if (tag === 'TABLE') Array.from(c.querySelectorAll('tr')).forEach((tr) => lines.push('| ' + Array.from(tr.children).map((td) => td.textContent.trim().replace(/\|/g, '/')).join(' | ') + ' |'));
        else walk(c);
      });
    };
    walk(doc.body);
    const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) throw new Error('This Word file has no text to read.');
    return text;
  }

  /* Which reader a file needs, from its name: 'pdf', 'docx', 'text', or a message explaining why not. */
  function kind(name) {
    const n = String(name).toLowerCase();
    if (n.endsWith('.pdf')) return 'pdf';
    if (n.endsWith('.docx')) return 'docx';
    if (n.endsWith('.doc')) return 'Old Word files (.doc) can\'t be read. In Word, use File → Save As → .docx, then upload that.';
    if (/\.(txt|md|markdown)$/.test(n)) return 'text';
    return 'This file type can\'t be read. Upload a PDF, a Word (.docx) file, or a .txt / .md file.';
  }

  root.MSG = root.MSG || {};
  root.MSG.FileText = { pdf, docx, kind, loadVendor };
})(typeof window !== 'undefined' ? window : globalThis);

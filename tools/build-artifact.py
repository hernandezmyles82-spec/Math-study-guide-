"""Build the claude.ai version of the site as ONE self-contained page.

claude.ai's sandbox can block separate stylesheet, script and font files, which leaves the page
unstyled. This inlines every script and style, embeds the KaTeX fonts as data URIs, and turns the
Firebase config off (Firebase cannot run inside claude.ai; accounts come from claude.ai there).

    python3 tools/build-artifact.py OUTPUT.html

The output has no <html>/<head>/<body> wrapper: claude.ai adds its own when the page is published.
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def rd(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

def script(name, src):
    src = re.sub(r'</(script)', r'<\\/\1', src, flags=re.I)  # never close the tag early
    return '<script>/* %s */\n%s\n</script>' % (name, src)

def katex_css():
    css = rd('vendor/katex/katex.min.css')
    def font(m):
        w = re.search(r'url\(fonts/([^)]+\.woff2)\)', m.group(0)).group(1)
        with open(os.path.join(ROOT, 'vendor/katex/fonts', w), 'rb') as f:
            return 'src:url(data:font/woff2;base64,%s) format("woff2")' % base64.b64encode(f.read()).decode()
    css = re.sub(r'src:url\(fonts/[^;}]*', font, css)
    assert 'url(fonts/' not in css
    return css

def main(out):
    html = rd('index.html')
    head = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
    body = re.search(r'<body>(.*?)</body>', html, re.S).group(1)
    parts = [re.search(r'<title>.*?</title>', head).group(0),
             re.search(r'<meta name="description"[^>]*>', head).group(0),
             '<style>/* KaTeX */\n' + katex_css() + '\n</style>',
             '<style>/* css/styles.css */\n' + rd('css/styles.css') + '\n</style>',
             re.sub(r'\s*<script[^>]*>\s*</script>', '', body).strip()]
    for p in re.findall(r'<script (?:defer )?src="([^"]+)"', body):
        if p.startswith('vendor/katex'):
            continue
        if p == 'js/firebase-config.js':
            parts.append(script(p, 'window.MSG_FIREBASE_CONFIG = null; // claude.ai version: accounts come from claude.ai'))
            continue
        if p == 'js/app.js':  # KaTeX first, so the first screen already shows rendered math
            parts.append(script('vendor/katex/katex.min.js', rd('vendor/katex/katex.min.js')))
            parts.append(script('vendor/katex/auto-render.min.js', rd('vendor/katex/auto-render.min.js')))
        parts.append(script(p, rd(p)))
    with open(out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(parts) + '\n')
    print('wrote %s (%d KB)' % (out, os.path.getsize(out) // 1024))

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'math-study-guide.html')

"""Write docs/legal/preview.md: the built legal pages and form consent wording as plain text."""
import html, re, sys

def text(fragment):
    fragment = re.sub(r'<br\s*/?>', '\n', fragment)
    return html.unescape(re.sub(r'<[^>]+>', '', fragment)).strip()

def article(path):
    s = open(path).read()
    body = s[s.index('<article class="legal">'):s.index('</article>')]
    out = []
    for tag, inner in re.findall(r'<(h2|h3|p|li|address)[^>]*>(.*?)</\1>', body, flags=re.S):
        t = re.sub(r'[ \t]+', ' ', text(inner))
        out.append({'h2': f'\n## {t}\n', 'h3': f'\n### {t}\n', 'li': f'- {t}', 'address': '\n'.join(f'> {l}' for l in t.splitlines())}.get(tag, f'\n{t}'))
    date = text(re.search(r'<p class="legal-date">(.*?)</p>', s, flags=re.S).group(1))
    return date, '\n'.join(out)

dist = sys.argv[1] if len(sys.argv) > 1 else 'dist'
parts = ['# Legal wording preview\n',
         'Generated from the build (`python3 scripts/legal-preview.py`). Not published. `[[...]]` marks facts or decisions still open.\n']
for title, f in [('Privacy Policy', 'privacy-policy.html'), ('Terms & Conditions', 'terms-and-conditions.html')]:
    date, body = article(f'{dist}/{f}')
    parts.append(f'\n---\n\n# {title}\n\n_{date}_\n{body}\n')
home = open(f'{dist}/index.html').read()
optin = text(re.search(r'<label for="hf-optin"[^>]*>(.*?)</label>', home, flags=re.S).group(1))
notice = text(re.search(r'<p class="form-privacy">(.*?)</p>', home, flags=re.S).group(1))
parts.append(f'\n---\n\n# Inquiry form wording (Home and Contact)\n\n**Marketing checkbox (optional, unticked):** {optin}\n\n**Notice under the button:** {notice}\n')
open('docs/legal/preview.md', 'w').write('\n'.join(parts))
print('wrote docs/legal/preview.md')

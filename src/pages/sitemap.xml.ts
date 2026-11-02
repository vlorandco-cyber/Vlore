import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import { absolute, pages } from '../lib/site';

// lastmod is the date of the last commit that changed the page's source, so it only moves when
// the page does (the deploy workflow checks out full history). Without git, the build date.
const today = new Date().toISOString().slice(0, 10);
function lastmod(path: string): string {
  const file = `src/pages/${path === '/' ? 'index' : path.slice(1)}.astro`;
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim() || today;
  } catch {
    return today;
  }
}

export const GET: APIRoute = () => {
  const urls = pages
    .map((p) => [
      '  <url>',
      `    <loc>${absolute(p.path)}</loc>`,
      `    <lastmod>${lastmod(p.path)}</lastmod>`,
      `    <image:image><image:loc>${absolute(p.image)}</image:loc></image:image>`,
      '  </url>',
    ].join('\n'))
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};

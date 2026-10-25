import type { APIRoute } from 'astro';
import { absolute, pages } from '../lib/site';

const lastmod = new Date().toISOString().slice(0, 10);

export const GET: APIRoute = () => {
  const urls = pages
    .map((p) => [
      '  <url>',
      `    <loc>${absolute(p.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      `    <image:image><image:loc>${absolute(p.image)}</image:loc></image:image>`,
      '  </url>',
    ].join('\n'))
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};

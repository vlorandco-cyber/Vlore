import type { APIRoute } from 'astro';
import { absolute } from '../lib/site';

// Every public page may be crawled. The 404 page and the /portfolio redirect stay crawlable so
// search engines can read their noindex and canonical; neither is in the sitemap.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });

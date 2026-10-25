import type { APIRoute } from 'astro';
import { absolute } from '../lib/site';

// Search engines and AI assistants are all welcome: being read and cited is the point.
const aiCrawlers = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot'];

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      ...aiCrawlers.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
      `Sitemap: ${absolute('/sitemap.xml')}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain' } },
  );

import type { APIRoute } from 'astro';
import { absolute, business, pages, services } from '../lib/site';

// A plain-text guide for AI assistants (https://llmstxt.org): who VLORE is and where to read more.
export const GET: APIRoute = () => {
  const body = [
    `# ${business.name}`,
    '',
    `> ${business.description}`,
    '',
    `- Location: ${business.locality}, Ontario, Canada; serves businesses across North America`,
    `- Email: ${business.email}`,
    `- Instagram: ${business.instagram}`,
    `- Founder: ${business.founder.name} (${business.founder.sameAs[0]})`,
    `- Free strategy session: ${absolute('/contact')} (reply within 48 hours, no obligation)`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- [${s.name}](${absolute(s.path)}): ${s.description}`),
    '',
    '## Pages',
    '',
    ...pages.map((p) => `- [${p.name}](${absolute(p.path)}): ${p.summary}`),
    '',
    '## Areas of expertise',
    '',
    business.knowsAbout.join(', '),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

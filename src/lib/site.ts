// The canonical origin comes from `site` in astro.config.mjs.
export const site = import.meta.env.SITE.replace(/\/$/, '');

/** Absolute URL for a clean, slash-less path ("/" stays as the bare origin + "/"). */
export function absolute(path: string): string {
  return site + (path === '/' ? '/' : path.replace(/\/$/, ''));
}

/**
 * Facts about the business, used by the structured data (JSON-LD) and /llms.txt.
 * Everything here is stated on the site itself; keep it that way so search engines and
 * AI assistants never see a claim the pages don't back up.
 */
export const business = {
  name: 'VLORE',
  legalName: 'VLORE',
  alternateName: 'VLORE Marketing & Business Development Agency',
  tagline: 'Web design, web development and marketing agency in Toronto',
  description:
    'VLORE is a Toronto web design, web development and digital marketing agency. We build websites, brands, SEO and content, Google and Meta ad campaigns, email automation and AI tools as one connected growth system for businesses across North America.',
  email: 'hello@vlore.ca',
  locality: 'Toronto',
  region: 'ON',
  country: 'CA',
  areaServed: ['Toronto', 'Ontario', 'Canada', 'United States'],
  logo: '/images/vl-ff36aa8937.png',
  shareImage: '/images/vlore-og-share.jpg',
  // The business's public profiles (add the Google Business Profile URL here when it's live).
  sameAs: ['https://www.instagram.com/vlore.ca'],
  instagram: 'https://www.instagram.com/vlore.ca',
  founder: { name: 'Niusha Meymandinejad', jobTitle: 'Founder & CEO', sameAs: ['https://www.linkedin.com/in/niusha-meymandinejad'] },
  reviewUrl: 'https://g.page/r/CaL18KkEj33oEAE/review',
  knowsAbout: [
    'Web design',
    'Web development',
    'Website design for small businesses',
    'E-commerce and Shopify development',
    'Landing pages',
    'Search engine optimization (SEO)',
    'Local SEO',
    'Content marketing',
    'Google Ads',
    'Meta Ads',
    'Social media marketing',
    'Brand strategy and visual identity',
    'Email marketing and marketing automation',
    'CRM setup',
    'Conversion rate optimization',
    'AI agents and workflow automation',
  ],
};

/** The headline services, as listed on the home page; each has a page that covers it. */
export const services = [
  { name: 'Website Design & Development', path: '/website-development', description: 'Fast, mobile-first, SEO-ready websites and online stores built like a sales funnel to turn visitors into leads and customers.' },
  { name: 'Brand Strategy & Identity', path: '/services', description: 'Brand positioning, logo and visual identity, messaging, photography and video that make a business instantly recognizable.' },
  { name: 'Google & Meta Ads', path: '/services', description: 'Google Search, Performance Max, Meta, Instagram, TikTok and LinkedIn campaigns built around real enquiries.' },
  { name: 'SEO & Content', path: '/services', description: 'Technical, on-page and local SEO, content marketing and Google Business Profile management that bring the right people.' },
  { name: 'Email Marketing & Automation', path: '/services', description: 'CRM setup, email and SMS campaigns, and marketing automation that turn enquiries into customers and bring buyers back.' },
  { name: 'AI Tools & Business Apps', path: '/services', description: 'AI agents, AI receptionists and chatbots, workflow automation and custom growth apps.' },
];

/** Every indexable page: sitemap.xml and llms.txt are built from this list. */
export const pages = [
  { path: '/', name: 'Home', summary: 'Who VLORE is: a Toronto web design, web development and marketing agency; services, selected work and a free consultation.', image: '/images/vl-hero-desktop.webp', changefreq: 'monthly', priority: '1.0' },
  { path: '/website-development', name: 'Web Design & Web Development', summary: 'How VLORE designs and builds websites that sell: the seven-step funnel, what is included, client websites and FAQs.', image: '/images/vl-hero-webdev-d.webp', changefreq: 'weekly', priority: '0.9' },
  { path: '/services', name: 'Marketing Agency Services', summary: '42 services in seven stages (strategy, brand, web, retention, SEO, paid ads, AI), a goal-based plan builder, engagement options and FAQs.', image: '/images/vl-hero-services-d.webp', changefreq: 'monthly', priority: '0.9' },
  { path: '/about', name: 'About VLORE', summary: 'Why VLORE exists, the principles it works by, the six-step client journey and who it serves.', image: '/images/vl-hero-about-d.webp', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', name: 'Contact', summary: 'Book a free, no-obligation strategy session; replies within 48 hours.', image: '/images/vl-hero-contact-d.webp', changefreq: 'monthly', priority: '0.7' },
];

// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The domain GitHub Pages serves (public/CNAME); used for canonical URLs, Open Graph tags,
  // structured data, sitemap.xml, robots.txt and llms.txt.
  site: 'https://vlore.ca',
  // Clean URLs: /about, /services, /contact (no trailing slash, no .html).
  trailingSlash: 'never',
  // One file per page (about.html, …): GitHub Pages serves /about from about.html directly,
  // where a folder (about/index.html) would answer /about with a redirect to /about/.
  build: { format: 'file' },
});

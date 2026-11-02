# VLORE

Website for VLORE, a Toronto web design, web development and marketing agency: <https://vlore.ca>.

Built with [Astro](https://astro.build) as a static site and published to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Pages

| URL | Source |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/website-development` | `src/pages/website-development.astro` |
| `/services` | `src/pages/services.astro` |
| `/about` | `src/pages/about.astro` |
| `/contact` | `src/pages/contact.astro` |
| `/portfolio` | redirects to `/website-development` |

Shared header, footer and FAQ live in `src/components/`, the page shell (SEO tags and
structured data) in `src/layouts/Base.astro`, styles and scripts in `public/styles/` and
`public/scripts/`, images in `public/images/` (`.webp` on the pages; `.jpg` originals kept).

## SEO and AI search (GEO)

- **Titles and descriptions**: set per page on `<Base title=… description=…>`.
- **Business facts**: `src/lib/site.ts` is the single source for the structured data
  (JSON-LD), `/llms.txt` and `/sitemap.xml`. Add your social profile URLs to `sameAs` there.
- **FAQs**: each page's `faq` list renders the visible questions and their FAQPage data.
- **Generated files**: `/sitemap.xml` (canonical, indexable pages; `lastmod` is each page's
  last commit), `/robots.txt` (all crawlers allowed, points to the sitemap) and `/llms.txt`,
  built from `src/pages/*.ts`.
- **Not indexed**: the 404 page (`noindex`, no canonical) and `/portfolio` (an instant redirect
  with a canonical to `/website-development`). Both are left out of the sitemap.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

Node 22.12 or newer.

## Hosting

GitHub Pages, with **Settings > Pages > Source: GitHub Actions** and the custom domain in
`public/CNAME` (`vlore.ca`). DNS at the domain registrar:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| `@` | AAAA | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| `www` | CNAME | `vlorandco-cyber.github.io` |

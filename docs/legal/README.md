# Legal pages: audit, open questions and review notes

Working notes for `/privacy-policy`, `/terms-and-conditions` and the inquiry-form consent.
Not published (this folder is outside `src/` and `public/`).

**Status: draft, not ready to publish.** Unconfirmed facts render as `[[PLACEHOLDERS]]`, and
`npm run check:placeholders` (run by the deploy workflow) fails until all are resolved.
Have an Ontario lawyer review both pages before publishing.

## 1 · Audit (November 2026)

Code means this repository. "Indicated" means seen in DNS records you shared, not verified.

| Area | Finding | Basis |
|---|---|---|
| Hosting | GitHub Pages (static files). GitHub logs and stores visitors' IP addresses for security. | Code, deploy workflow; [GitHub docs](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) |
| Forms | Home and Contact share `#contactForm`: name\*, email\*, business name, website, message; Contact adds service-interest checkboxes; hidden `public_key`, `_honeypot`; now an optional marketing opt-in. No phone field. | Code |
| Form destination | `https://crm.vlore.ca/functions/publicFormSubmit` (Vlore CRM): name, email, phone (empty), message (other fields, page, marketing choice appended), honeypot. | Code (`public/scripts/crm-form.js`) |
| CRM provider | `crm.vlore.ca` is a CNAME to `base44.onrender.com`, which suggests a Base44 app (the CRM code is not in GitHub, so the app itself could not be inspected). Base44 documentation says:<br>• App data is stored in the US by default; EU, UK or Australia residency is available on Enterprise plans only.<br>• Data is encrypted in transit and at rest.<br>• **On all plans except Enterprise, workspace data "can be used to train AI models".**<br>• Its subprocessors include SendGrid, Render, Google Cloud, OpenAI, Anthropic, Wix.com (Israel), Datadog, Langfuse (Germany), Logfire (UK) and MongoDB.<br>• A DPA is available on request.<br>Still **unknown**: your plan, what the CRM app stores, IP logging, AI features in the app, suppression lists. | DNS; [Base44 privacy docs](https://docs.base44.com/Community-and-support/Privacy-and-security), [Base44 security](https://base44.com/security) |
| Mailbox | A `privateemail._domainkey` DKIM record suggests Namecheap Private Email for hello@vlore.ca. Namecheap lists Private Email servers in its US data centre (Phoenix). | DNS; [Namecheap data centres](https://www.namecheap.com/support/knowledgebase/article.aspx/136/22/where-are-your-datacenters-located-how-can-i-request-to-change-the-datacenter/) |
| Email sending | SendGrid records on `em.app` / `s1._domainkey.app` suggest SendGrid sends mail for `app.vlore.ca`. Whether it sends VLORE marketing or CRM mail is **unknown**. | Indicated (DNS) |
| Other subdomains | `app.vlore.ca` and `crm.vlore.ca` both point to Render/Base44. Not part of this website's code. | Indicated (DNS) |
| Google | Google Search Console verification (DNS TXT record). Search Console does not track visitors. | Indicated (DNS) |
| Analytics / ad pixels | **None.** No Google Analytics, Tag Manager, Meta Pixel, Hotjar, Clarity or similar. | Code + browser test (no third-party requests on any page) |
| Cookies / storage | **None set by the site.** No `document.cookie`, `localStorage` or `sessionStorage`; browser test found no cookies or storage on any page. Hosting response headers were not inspected live. | Code + browser test |
| Embeds, fonts, scripts | None from third parties (system fonts, self-hosted images and scripts). | Code + browser test |
| Spam protection | Hidden honeypot field only (no CAPTCHA). | Code |
| Booking / payments | None on the website. Consultations are requested by form. Meeting and scheduling tools are **unknown**. | Code |
| AI services | None in the website. Use of AI in the CRM or with inquiry data is **unknown**. | Code |
| Outbound links | Instagram, LinkedIn (founder, structured data), Google review link, client websites. Plain links, no embeds. | Code |

## 2 · Questions to answer (fills the placeholders)

1. **Legal identity:** the exact legal name (sole proprietor's name, partnership or corporation), and whether "VLORE" is a registered business or operating name. Is the business incorporated?
2. **Mailing address** to publish (needed in the marketing consent wording and every marketing email). A P.O. box or virtual office is acceptable if it receives mail.
3. **Privacy contact:** the person or role accountable for privacy, and whether requests should go to hello@vlore.ca or a separate address.
4. **CRM:** which platform runs crm.vlore.ca (Base44?), and where it stores data. Does it log IP or browser data, send notifications, or use AI on submissions? Does it have a field for marketing consent and an unsubscribe or suppression list?
5. **Email:** is hello@vlore.ca on Namecheap Private Email? Which tool, if any, will send marketing emails (and does it handle unsubscribes automatically)? What is SendGrid used for?
6. **Other tools** that receive prospect information: scheduling, video calls (recorded or transcribed?), proposals or e-signature, accounting, file sharing, AI assistants.
7. **Retention:** how long you keep inquiries that don't become clients, and client business records.
8. **Safeguards** you actually use, such as multi-factor authentication on email and CRM, and who has access.
9. **Selling or sharing:** confirm VLORE does not sell personal information or share it with third parties for their own marketing.
10. **Marketing plans:** will you actually send marketing emails? If not, remove the opt-in box rather than collect consent you won't use.
11. **Effective dates** for both pages, set on the day you publish.
12. **Testimonials and portfolio:** see section 5.

When answered, edit `src/lib/legal.ts` (name, address, contact, dates) and replace each
`<Fact todo="…" />` in `src/pages/privacy-policy.astro` and `terms-and-conditions.astro`
with confirmed text, or delete the line where it doesn't apply.

## 3 · What is law, what is recommended, what is your choice

**Legal requirements (verified against official sources):**

- PIPEDA governs commercial personal information in Ontario. Ontario has no substantially similar general private-sector law. ([OPC](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/))
- Consent must be meaningful: plain-language purposes, readily available information, and the ability to withdraw consent. ([OPC Guidelines for obtaining meaningful consent](https://www.priv.gc.ca/en/privacy-topics/collecting-personal-information/consent/gl_omc_201805/))
- Access requests: respond within 30 days (an extension is possible with notice), correct inaccurate information, and tell people about their right to complain to the OPC. ([OPC](https://www.priv.gc.ca/en/privacy-topics/accessing-personal-information/obligations-for-organizations/02_05_d_54_ati_02/))
- Processing outside Canada: be transparent that information may be processed abroad and be accessible to foreign authorities. ([OPC cross-border guidelines](https://www.priv.gc.ca/en/privacy-topics/airports-and-borders/gl_dab_090127/))
- CASL express-consent requests must:
  - be sought separately and not bundled with terms;
  - use a box the person actively ticks;
  - state the purpose, the sender's name, a mailing address plus email, phone or web contact, and that consent can be withdrawn;
  - and the sender must keep proof of consent.
  ([CRTC 2012-548](https://crtc.gc.ca/eng/archive/2012/2012-548.htm), [Regulations SOR/2012-36](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2012-36/page-1.html))
- Every marketing email: identification, a mailing address, and an unsubscribe mechanism valid for 60 days that takes effect within 10 business days. ([ISED](https://ised-isde.canada.ca/site/canada-anti-spam-legislation/en/getting-consent-send-email), [CRTC FAQ](https://crtc.gc.ca/eng/com500/faq500.htm))
- Inquiries: replying to someone's inquiry is exempt from CASL's consent requirement. An inquiry gives implied consent for other commercial messages for six months only, so dated records matter. ([CRTC guidance](https://crtc.gc.ca/eng/com500/guide.htm))
- Performance claims need adequate and proper testing before they are made. Testimonials are not proof, and must be genuine, authorized and accurately conveyed, with any material connection disclosed. ([Competition Bureau](https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/advertising-dos-and-donts))

**Recommended practices (implemented):**

- A short privacy notice beside the forms, linking to the policy.
- The marketing box is separate, optional and unticked, and a consultation never requires it.
- A consent record (the exact wording, time and page) is written into each CRM submission.
- No analytics or advertising tracking, so no cookie banner is needed today.
- If you add analytics or pixels later, keep them off until the visitor opts in, with Accept, Reject and Manage choices and a footer link to change the choice. This is a privacy-forward choice. The OPC accepts opt-out for some non-sensitive tracking under conditions ([OBA guidelines](https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/tracking-and-ads/gl_ba_1112/)), and stricter rules apply in Quebec and elsewhere.

**Your business choices (for you and your lawyer):** a liability cap, forum or choice-of-courts clause, indemnities, deposits, cancellation and refunds, payment terms, and IP ownership of deliverables. These belong in the client agreement (see `client-contract-checklist.md`), not invented in website terms.

**Watch:** Bill C-36 (45th Parliament, 1st session), *An Act to enact the Protecting Privacy and Consumer Data Act, to amend the Personal Information Protection and Electronic Documents Act and to make amendments to other Acts*. It was introduced and given first reading in the House of Commons on June 15, 2026, sponsored by the Minister of Artificial Intelligence and Digital Innovation. LEGISinfo status (checked November 17, 2026): "At second reading in the House of Commons". Second reading has not passed, and there is no Senate stage or Royal Assent, so PIPEDA still applies. ([LEGISinfo record](https://www.parl.ca/legisinfo/en/bill/45-1/c-36), JSON export checked directly) Serving clients or people in Quebec (Law 25) or the U.S. (state privacy laws) may add obligations.

## 4 · Not implemented, and why

- **Cookie banner:** there are no optional cookies or trackers to control, so a banner would be decorative. Add a real consent manager when you add tracking.
- **Unsubscribe handling:** this lives in whatever tool sends marketing emails (unknown). Confirm it adds a working unsubscribe link and suppresses opted-out addresses, and record manual unsubscribes in the CRM.
- **Consent as a CRM field:** the CRM accepts name, email, phone and message only (as far as known), so the consent record is written into `message`. If the CRM can store a separate consent field and timestamp, map it there.
- **Site menu accessibility (existing):** the slide-out menu is `aria-hidden` while closed but its links stay focusable. Adding `inert` to the closed menu would fix it. Left as is because it is outside this task.

## 5 · Claims and testimonials to review

Each item needs evidence on file, permission to publish, or rewording. A disclaimer does not cure a misleading claim.

| Where | Claim | What's needed |
|---|---|---|
| Home, testimonials | "$28,000 in 30 days" (Google Ads client) | Records showing the figure (revenue? sales? ad-attributed?) and period; the client's permission; wording that matches what the records show. |
| Home, testimonials | "100+ new leads" (Growth app client) | Lead records for the stated app and period; the client's permission. |
| Home, testimonials | "Easier to find. Easier to choose." (Website & SEO client) | The client's permission; the quote must be the client's actual words. |
| Home, testimonials | All three are anonymous | Check they are real, unedited in meaning, and that no material connection (discount, free work, relative) is undisclosed. |
| Contact | "Within 48 hours" / "reply within 48 hours" | Only promise it if you consistently meet it. |
| Contact | "Limited quarterly intake" | Must be true (a real capacity limit), not artificial urgency. |
| Services | "Cyber Security: Audits, testing, and protection…" | Confirm you deliver this, with the qualifications and insurance to do so. Security testing carries extra liability; reword or remove if not offered in-house. |
| Services / Web dev | "deliver qualified leads", "Revenue before ad spend", "Lightning-fast loading", "A website that works while you sleep" | Mostly puffery, but avoid wording that reads as a guaranteed result; keep proof for measurable claims such as speed. |
| About | "Clear pricing, clear reporting, fast fixes" | Make sure contracts and practice match. |
| Web dev / Home | Client websites, logos and screenshots (Body Revive, Elite Kitchen & Bath, Luxerra, Manifestation Club, Mahsa Moon) | Written permission to show each client's name, work and results. |
| Gallery | Photos of people (e.g. "Body Revive Medspa portrait", "Client consultation", "jawline contouring") | Model releases or consent from people shown, and the right to use each image (owned, licensed or AI-generated and disclosed if relevant). |

## 6 · For Ontario lawyer review

- Both drafts in full, especially the limitation of liability and "as is" wording, governing law and forum, and IP wording.
- Whether website terms bind visitors as written (browse-wrap). Key commercial terms must be in the signed client agreement.
- The marketing consent wording once name and address are filled in.
- Whether Quebec Law 25 or U.S. state privacy laws apply to your clients or visitors.
- Consumer clients: if you serve individuals, not only businesses, Ontario's consumer protection law adds rules (written agreements, cancellation rights).
- A data processing agreement template for client CRM, email and AI work (see the checklist).
- Monitor Bill C-36.

## 7 · CRM checks still needed (cannot be done from the website code)

The website writes the marketing choice into the CRM message. That alone does **not** prove the
CRM keeps it reliably, links it to the contact, or stops marketing to people who unsubscribed.
Before publishing the opt-in box, someone with access to the Base44 CRM should:

1. Submit a test inquiry with the box ticked, and another without, and confirm both full messages (including the consent line) appear on the prospect record and are not cut short.
2. Check whether the CRM has, or can be given, a dedicated consent field (yes or no, date, wording) instead of relying on the message text.
3. Confirm which tool sends marketing emails and that it skips anyone without consent and anyone who unsubscribed, including unsubscribes received by email.
4. Check whether the CRM sends any automatic emails to people who submit the form (autoreplies are fine as inquiry replies; anything promotional is not).
5. Check what Base44 logs with each submission (IP address, browser), and whether the CRM app uses AI features on submissions.
6. Confirm the Base44 plan, because AI training depends on it (see the audit table).

## 8 · Retention sources

- CRA: keep business tax records for six years from the end of the last tax year they relate to (with exceptions). ([Canada.ca](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/keeping-records/where-keep-your-records-long-request-permission-destroy-them-early.html))
- Ontario *Limitations Act, 2002*: the basic limitation period is 2 years from discovery of a claim (s. 4), and the ultimate limit is 15 years from the act or omission (s. 15). ([Ontario e-Laws](https://www.ontario.ca/laws/statute/02l24))
- CASL: implied consent from an inquiry lasts 6 months, so keeping an inquiry longer does not allow marketing to that person.

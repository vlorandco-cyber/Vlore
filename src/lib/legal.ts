/**
 * Facts the legal pages and the inquiry forms' consent wording depend on.
 *
 * Anything still `null` renders as a highlighted [[PLACEHOLDER]] (see components/Fact.astro), and
 * `npm run check:placeholders` fails the build, and so the deploy, while any placeholder is
 * left in the output. Fill these in only with facts you have confirmed.
 */
export const legal = {
  /** Registered or legal name of the business, e.g. a corporation or the owner's name. */
  legalName: null as string | null,
  /** The brand the business operates under. */
  operatingName: 'VLORE',
  /** Business mailing address (CASL requires one in marketing-consent requests and messages). */
  mailingAddress: null as string | null,
  /** Person or role accountable for privacy, e.g. "Founder & CEO, privacy officer". */
  privacyContact: null as string | null,
  /** Where privacy requests go. hello@vlore.ca is the published address; change if you set up another. */
  privacyEmail: 'hello@vlore.ca',
  /** Date each policy takes effect, written out, e.g. "January 5, 2027". */
  privacyEffectiveDate: null as string | null,
  termsEffectiveDate: null as string | null,
};

export type LegalFact = keyof typeof legal;

/** Placeholder labels shown while a fact is unknown. */
export const placeholderLabel: Record<LegalFact, string> = {
  legalName: 'LEGAL BUSINESS NAME',
  operatingName: 'OPERATING NAME',
  mailingAddress: 'BUSINESS MAILING ADDRESS',
  privacyContact: 'PRIVACY CONTACT (NAME OR ROLE)',
  privacyEmail: 'PRIVACY EMAIL',
  privacyEffectiveDate: 'EFFECTIVE DATE',
  termsEffectiveDate: 'EFFECTIVE DATE',
};

/** Legal pages: listed in the footer, sitemap.xml and llms.txt, not in the main navigation. */
export const legalPages = [
  { path: '/privacy-policy', name: 'Privacy Policy', summary: 'How VLORE collects, uses, shares and protects personal information from this website, its inquiry forms and marketing emails, and how to exercise privacy rights.' },
  { path: '/terms-and-conditions', name: 'Terms & Conditions', summary: 'Terms for using the VLORE website, including content ownership, third-party links, and how quotes and services are governed by a separate written agreement.' },
];

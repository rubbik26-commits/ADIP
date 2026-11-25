# ADIP redesign — written summary

## 1. What this build is
"Midnight Garden" — a from-scratch redesign of Another Day in Paradise
(anotherdayinparadise.la), the wearable-art store of LA artist Farhad Rabbany.
Nothing from the live site's structure survives: no page keeps its old
sections, order, compositions, or sentences. What carries over is only
infrastructure: the verified facts (products, prices, policies), the verified
photograph URLs, the buy-path into the live WooCommerce store, and the
SEO/AEO layer.

## 2. The design system
- **Palette:** deep green-black (#060D09 → #0F2417) with warm bone (#F2EEE3)
  light rooms, and a single animated iridescent gradient (mint #7FE3B0, sky
  #9ADCF5, lilac #D9A7F2, sun #F2C14E) drawn from *Empathy in Color, Series II*
  — the one series in color. Iridescence is spent only on what matters: the
  logo, primary buttons, prices, the drawn line itself.
- **Type:** Syne (display), Manrope (body), Space Grotesk (labels) — loaded
  from Google Fonts, self-documented in every page's colophon.
- **Chrome:** fixed glass header (blur + visible nav: Shop / Gallery /
  Process / Commission / Farhad / Contact + Bag), an iridescent
  scroll-progress bar, and a full-screen glass Index menu (Nº 00–10).
- **Motion is the drawing:** the hero line draws itself on arrival; the
  Process page's artwork draws and undraws with the visitor's scroll; a
  hold-to-draw interaction on the product page; pointer-tracked light on
  tiles and panels. Task pages (cart, contact, FAQ) stay calm.
  `prefers-reduced-motion` is honored throughout.

## 3. The pages
- **index — The Gate.** Full-viewport hero: the iridescent line draws itself
  under "Paradise is one unbroken line." Then the line worn (full-bleed
  photograph), three garments, the color-series feature, the Commission, a
  sideways rail of prints, and the Paradise List.
- **shop — The Wall.** All products as one sideways-travelling wall of tiles
  (price always printed beside the name), a Commission panel, then a compact
  Index table of every piece for fast finding. Two honest notes: the Paradise
  Heart Hoodie has no verified photograph anywhere, so it is listed without
  one rather than dressed in another hoodie's picture; "Flow of Serenity"
  stays off the wall (it was listed at $0 on the old site).
- **product — Golden Heart Hoodie.** Before/after front↔back slider, size
  chips with a live readout, total-cost honesty lines, provenance table,
  hold-to-draw, an unhidden zero-reviews panel.
- **print — Heart of Paradise.** Artwork first, full width; the five-size
  ladder ($200/$220/$250/$300/$350) as chips that update the price readout;
  "frame not included" stated plainly.
- **gallery.** Sixteen works in four series chapters, alternating dark and
  bone rooms — including a printed correction: two works shared one
  photograph on the old site; every tile here was checked against its own
  file, and Dancing with Gratitude is named without a tile until it has a
  photograph of its own.
- **commission.** The $300 hand-drawn cap: glow hero, itemized inclusions
  and money terms ($100 deposit / $200 before signing) printed before any
  form, a working configurator (cap colour swaps the real photo, motif
  re-draws, word + initials feed a live summary), the 7 steps Day 0 → ships.
- **kit.** The $39 draw-your-first-paradise kit: contents, a free tile on
  the Process page first, an honestly empty "wall of other people's lines."
  The kit is not a live store product yet, so its button routes to the
  Paradise List and says so.
- **process.** "Scroll is the hand" — the scroll-drawn artwork, the three
  steps, and a working draw-along tile (mirror modes, clear, PNG export).
- **watch.** The three video formats as storyboard panels, with the research
  numbers printed on the page (Blossom analysis of 1,774 art videos: hook
  21.11×, sound 22.80×, before/after 8.67×; the Devon Rodriguez gift format).
- **journal / about / faq / contact / cart.** Editorial journal; the artist
  page written once (the old site duplicated its About copy); all 15 FAQs
  under six headings with one 14-day rule; a routed contact form (five
  subjects, each with its own routing line and a 2-business-day commitment);
  a calm bag page that shows the commission as $100 today + $200 later and
  hands off to the live store's cart/checkout.

## 4. Store wiring
Repo = storefront, WooCommerce = register. Every tile/row/buy button opens
the product's own live product page (new tab). Cart page: Express → live
/checkout/, guest → live /cart/, Remove → live /cart/. Commission CTA → the
$300 cap's live page. Social links (Instagram/Threads @a.d.i.p.la, Facebook)
are real on every page; Open Graph/Twitter/product meta on every page.

## 5. SEO / AEO
Canonical + robots meta + theme-color on all 14 pages; JSON-LD: Organization
+ WebSite graph (home), Product records (product/print/commission/kit),
ItemList (shop), FAQPage generated from the FAQ page's own 15 Q&As,
BreadcrumbList on all inner pages. robots.txt explicitly allows AI crawlers;
sitemap.xml lists all 14 pages; llms.txt carries the brand brief including
the "not food" disambiguator (a London chef owns the bare name on social).
Real image dimensions + lazy loading below the fold. Note: rankings accrue
to the real domain only when this is deployed at anotherdayinparadise.la.

## 6. Verification performed on this build
- Every image URL on every page curl-checked: all return 200 (22 unique).
- Every href/src machine-checked against the verified source corpus: zero
  invented URLs; the QR-code graphic that the old site used as the $300
  cap's photo appears nowhere.
- Local browser QA: zero horizontal overflow on all 14 pages at 1440px and
  390px; interaction smoke tests pass (menu + Esc, scroll progress, size
  chips, before/after slider, print price readout, commission configurator,
  draw-along canvas, rail progress, contact routing).
- Live verification at the pinned link follows in the commit history below.

## 7. Open gaps (need Farhad's / Robert's input — unchanged from prior work)
a. Commission money split: these pages promise $100 deposit + $200 balance;
   the live store sells the cap flat at $300 — needs a deposits plugin or a
   copy decision on the live product.
b. The $39 kit does not exist in WooCommerce yet; its button routes to the
   Paradise List until it does.
c. "Flow of Serenity" is still $0 on the live store — price it or unpublish.
d. Meta product tagging needs Farhad's WordPress/Facebook logins.
e. TikTok/Pinterest/YouTube accounts don't exist yet; TikTok Shop would
   additionally need Farhad's ID/bank details.
f. GitHub Pages (Settings → Pages) would give this repo a canonical
   rubbik26-commits.github.io/ADIP/ address; until then the shareable link
   is the commit-pinned githack mirror.
g. If this design is accepted for the live store: deployment happens on
   WordPress only after Farhad's logins arrive and Robert approves; then
   canonical/OG/sitemap/llms URLs re-point to anotherdayinparadise.la and
   Search Console is connected.

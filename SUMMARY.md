# ADIP redesign — written summary

## 1. What this build is
"Glass" — the redesign of Another Day in Paradise (anotherdayinparadise.la),
the wearable-art store of LA artist Farhad Rabbany, built to the brief as
given: a total A-to-Z redesign — menus, scrolling, fonts, color scheme — with
the research moves implemented inside the pages, a functioning store, and
SEO/AEO across the board. No page keeps the live site's structure, order, or
sentences; what carries over is only infrastructure: the verified facts
(products, prices, policies), the verified photograph URLs, the buy-path into
the live WooCommerce store, and the SEO layer.

## 2. The design system
- **Palette:** black (#050505) and white (#FFFFFF) — the colors of the
  artwork itself — and nothing else. Surfaces are frosted glass (translucent
  white over black, backdrop blur, a lit top edge); type, prices, the logo,
  and primary buttons are polished metal: an animated silver gradient with a
  shine that sweeps on hover. Glow is a soft white halo, spent sparingly.
- **Type:** Space Grotesk (display) + Inter (body), from Google Fonts,
  named in every page's colophon.
- **Chrome:** fixed glass header with the full nav visible at every width —
  on phones the six links (Shop / Gallery / Process / Commission / Farhad /
  Contact) wrap into their own row under the logo instead of hiding behind a
  button — plus a metallic scroll-progress line and a full-screen glass
  Index (Nº 00–10) for the whole site map.
- **No overlays:** there is no timed popup, no exit-intent trap, no caption
  sitting on top of a photograph. The Paradise List is a section on the page,
  not an interruption.
- **Motion is the drawing:** the hero line draws itself on arrival; the
  Process artwork draws and undraws with the visitor's scroll; a
  hold-to-draw interaction on the product page; pointer-tracked light on
  tiles and panels. Task pages (cart, contact, FAQ) stay calm.
  `prefers-reduced-motion` is honored throughout.

## 3. The pages
- **index.** Full-viewport hero: the metal line draws itself under "Paradise
  is one unbroken line." Then the line worn (full-bleed photograph, caption
  below it — never on it), three garments, the one color series (Empathy in
  Color), the Commission, a sideways rail of prints, the Paradise List.
- **shop — The Wall.** All products as one sideways-travelling wall of tiles
  (price always beside the name), a Commission panel, then a compact Index
  table of every piece. Two honest notes: the Paradise Heart Hoodie has no
  verified photograph anywhere, so it is listed without one rather than
  dressed in another hoodie's picture; "Flow of Serenity" stays off the wall
  (it was listed at $0 on the old site).
- **product — Golden Heart Hoodie.** Before/after front↔back slider, size
  chips with a live readout, total-cost honesty lines, provenance table,
  hold-to-draw, an unhidden zero-reviews panel.
- **print — Heart of Paradise.** Artwork first, full width; the five-size
  ladder ($200/$220/$250/$300/$350) as chips that update the price readout;
  "frame not included" stated plainly.
- **gallery.** Sixteen works in four series chapters — including a printed
  correction: two works shared one photograph on the old site; every tile
  here was checked against its own file, and Dancing with Gratitude is named
  without a tile until it has a photograph of its own.
- **commission.** The $300 hand-drawn cap: itemized inclusions and money
  terms ($100 deposit / $200 before signing) printed before any form, a
  working configurator (cap colour swaps the real photo, motif re-draws,
  word + initials feed a live summary), the 7 steps Day 0 → ships.
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
- Every page was screenshot-checked by eye at phone width (390px) AND
  desktop width (1440px) with the real production fonts (Space Grotesk +
  Inter) loaded — not fallback fonts. All 14 pages, both widths.
- Element-level overflow scan: no element extends past the viewport on any
  page at either width (the intentional nav row and product rails scroll
  inside their own containers).
- Interaction smoke tests pass: menu + Esc, scroll progress, size chips,
  before/after slider, print price readout, commission configurator,
  draw-along canvas, rail progress, contact routing, mobile nav visibility.
- Timed-popup test: after 17 seconds on the home page, nothing appears —
  the popup does not exist in this build.
- Two real defects were caught by this process and fixed before delivery:
  class-based two-column layouts not stacking on phones, and a product-page
  grid column forced to image width (1256px) by a missing min-width rule.
- Every image URL returns 200 (22 unique); every href/src machine-checked
  against the verified source corpus — zero invented URLs; the QR-code
  graphic the old site used as the $300 cap's photo appears nowhere.
- Live verification at the pinned link (desktop + phone widths) follows in
  the delivery note.

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

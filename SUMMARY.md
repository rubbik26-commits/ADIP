# SUMMARY — the ADIP recreation (2026-11-25)

## The order, in Robert's words
Start from the beginning. Take the website he gave (anotherdayinparadise.la),
recreate it as a mockup that looks completely different, with every image and
100% functionality. No shortcuts.

## What was built
A recreation of the entire site in a new design world — "the dark gallery":
warm-black walls, art on lit off-white mats, a vermillion seal accent,
Archivo + Space Mono. 17 pages mapping the original's full page set (Home,
Shop, Product, Gallery, About, FAQ, Contact, Cart, Checkout, My Account,
Commission, Shipping, Returns, Terms, Privacy, Cookies, Accessibility).

## Fidelity to the original (the part that is NOT redesigned)
- Catalogue extracted from the live WooCommerce product table: all 23
  products, real names, real prices, real options (apparel sizes; the canvas
  ladder 11x14 $200 / 16x20 $220 / 18x24 $250 / 24x36 $300 / 30x40 $350 taken
  from the products' own option strings), and the products' complete description copy,
  pulled in full from the live WooCommerce Store API (the crawl summaries
  truncated mid-sentence; the pages now carry the finished text).
- Every image: all 65 product photos (galleries of 4–10 on apparel) plus the
  site's art and homepage shelf photography — 77 unique URLs, each
  curl-verified 200 before the push. Four 12–27 MB studio props use the
  site's own mid-size renditions for speed.
- His homepage hero (the dictionary definition of "inspiration") and his
  About/Contact texts are kept and restaged; his eight hoodie FAQ answers
  are kept verbatim in substance and the page is completed for the rest of
  the store; policy pages carry the documented substance of his policies.
- Two of the original's own contradictions are resolved openly: returns are
  one 14-day rule everywhere (his FAQ said 14, his returns page said 30),
  and Flow of Serenity — listed at $0 — is price-on-request instead of
  carrying an invented price. The accessibility page's "[Insert Client
  Email]" placeholder is filled with the real address.

## Verification (observed, not asserted)
- Local QA with the real fonts loaded (Archivo + Space Mono woff2, local
  @font-face): all 17 pages at 390px and 1440px — fonts confirmed, no
  page-level horizontal scroll, no element overflow (one rail-bleed found
  and clipped).
- Full functionality executed at phone width: shop filters (23 / 16 prints /
  3 hoodies), product gallery switching across all 10 tee photos, lightbox
  open/step/close, canvas ladder repricing to $350 at 30x40, the cap
  configurator (word PARADISE + Waves) reserving its $100 deposit, Flow of
  Serenity showing price-on-request with no buy button, cart math
  ($350 + $100 = $450, free shipping), checkout → order ADIP-6744 confirmed,
  the order appearing on the Account page, and the contact form composing.
- Screenshots of every page at both widths read by eye before the push.
- After the push: every file read back byte-identical from
  raw.githubusercontent.com, then the live pinned link re-verified in a
  real browser (see delivery note for the commit).

## The one remaining wire
Real card capture needs the studio's own payment account (PayPal /
WooPayments, as on his live store). Until Farhad provides it, checkout
records and confirms orders on screen and the studio confirms payment by
email. Stated on the checkout page itself.

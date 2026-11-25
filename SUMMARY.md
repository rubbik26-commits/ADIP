# SUMMARY — the ADIP store build (2026-11-25)

## What was asked, in Robert's words
A mockup that looks nothing like the existing site — a redesign and a rebrand —
in the repository Robert created, as **a functioning online store**. The earlier
builds failed this twice over: they kept the old site's page-for-page skeleton,
and they were skins whose buy buttons, checkout and cart all linked back to the
old WooCommerce site. This build fixes both, and claims nothing beyond what was
verified below.

## What this build is
- **A store, not a skin.** Catalogue (`products.js`), product pages, bag,
  totals, shipping rule, checkout and order confirmation all run inside this
  repo (`store.js`). No page links to anotherdayinparadise.la to buy, check
  out, or view a cart. The only old-domain assets are Farhad's own product
  photographs (his media library is the only place those files exist; they
  move with the store when it gets hosting).
- **A new structure.** 8 pages with a storefront's architecture — one dynamic
  product page serves all 23 products; the old site's 14-page mirror is gone.
  The 8 leftover page names from the previous mockup are redirect doors.
- **The approved design.** Glass/metal/glow/shine on black and white, Space
  Grotesk + Inter, the self-drawing line as the one signature motion, visible
  navigation (Shop / Commission / Story / FAQ + Bag, all visible at phone
  width without opening a menu), no popup anywhere.

## The catalogue (verified, not copied from the old skin)
Rebuilt from the WooCommerce product table: 23 sellable pieces with real
names, prices and main photographs — including 15 canvas prints at the real
$200–$350 size ladder. Two evidence-driven changes from earlier builds:
(1) the Paradise Heart Hoodie **does** have photographs (July uploads) — the
"no photo" claim from the first crawl is retired; (2) ten print names in the
earlier builds were invented — replaced with the products' real titles and
their real main images. Every image URL in the build was curl-verified (200);
one 404 (a kit photo that does not exist) was caught and the kit became an
honest spec card instead.

## Verification (all observed, none asserted)
- Local QA with the **real fonts loaded** (downloaded woff2, local @font-face):
  all 8 pages at 390px and 1440px — no page-level horizontal scroll, no
  element overflow (the hero line's 3px SVG bleed is inside its viewBox),
  fonts confirmed loaded.
- **Full purchase flow, executed end-to-end** at phone width: shop filters
  (23 all / 15 wall / 4 under $100) → cap added from the grid → hoodie PDP
  (size M × 2 = $350) → print PDP (24×36 = $300) → commission configured
  (word HOPE) and reserved → cart showed all four lines, goods $819, free
  shipping, total $819 → checkout form → **order ADIP-2559 confirmed on
  screen**, bag cleared to Bag (0).
- Screenshots of every page at both widths were read by eye; three defects
  found and fixed before push: tile name/price ran together (no CSS existed
  for the tile meta), the Bag link was hidden on phones (now visible in the
  header at 390px and 360px), small-phone header height (padding rule added
  ≤374px).
- Push read-back: every file compared byte-for-byte against
  raw.githubusercontent.com after the push (see the delivery note for the
  commit). Live verification at the pinned link follows the same flow test.

## The one remaining wire (stated in the open, on the checkout page too)
Real card capture needs the studio's own payment account (Farhad's Stripe or
PayPal). Until he provides it, checkout records the order and confirms it on
screen, and the studio confirms payment by email before shipping; no card is
charged by the page. This is the single step that cannot be completed from
this side — it needs Farhad's account, nobody else's.

## Remaining gaps (need Farhad / Robert)
Payment account (above); Flow of Serenity's $0 price on the old store;
TikTok/Pinterest/YouTube don't exist yet; Meta tagging needs Farhad's logins;
GitHub Pages toggle is Robert's one click in Settings; deploying at
anotherdayinparadise.la when accepted + his hosting logins arrive.

# ADIP.LA — Another Day in Paradise, by Farhad Rabbany

The complete redesign of **anotherdayinparadise.la** — "Noir Champagne": a near-black,
champagne-gold, smoked-glass storefront for Farhad Rabbany's hand-drawn meditation art
(Bodoni Moda + Jost; bordeaux for the Commission), built as 14 static pages with no
build step and no framework.

## The pages

| File | Page |
|---|---|
| `index.html` | Front page — the poster stack, the price ladder, the Drop |
| `shop.html` | The Ledger — every product, numbered, with live buy links |
| `product.html` | The Golden Heart Hoodie — product page |
| `print.html` | Heart of Paradise — canvas product page (5 sizes, $200–350) |
| `commission.html` | The Commission — the $300 hand-drawn cap, configurator + timeline |
| `kit.html` | The $39 Kit — Draw Your First Paradise |
| `gallery.html` | The Wall — the works, hung side by side |
| `process.html` | Process — scroll-drawn line + draw-your-own tile |
| `watch.html` | Watch — the three video formats |
| `about.html` | Farhad — about the artist |
| `journal.html` | The Journal |
| `faq.html` | FAQ + Shipping & Returns — one 14-day rule |
| `contact.html` | Contact the studio |
| `cart.html` | Your bag |

## How the store works

This repo is the storefront; the register is the brand's existing WooCommerce store at
anotherdayinparadise.la, which already holds the real products, stock, and checkout.

- Every product's buy button, ledger row, and gallery tile links to that product's live
  page on the WooCommerce store (real variants, real stock, real checkout).
- Cart/checkout buttons link to the live store's cart and checkout.
- Product photography is served from the live store's own uploads at full resolution.
- Social profiles (Instagram / Threads @a.d.i.p.la, Facebook) are linked in every footer,
  and every page carries Open Graph + Twitter Card metadata for clean sharing.

## Run / deploy

No build. Serve the folder with any static host, e.g. `python3 -m http.server` in this
directory, or read it straight from GitHub via a CDN mirror
(`https://cdn.statically.io/gh/rubbik26-commits/ADIP/main/index.html`).
Fonts load from Google Fonts (Anton, Libre Franklin, Courier Prime, Permanent Marker).

See `SUMMARY.md` for the full delivery report: store and link structure, social setup,
the research behind the choices (with sources), and the remaining gaps.

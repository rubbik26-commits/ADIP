# ADIP — Another Day in Paradise: THE STORE

A self-contained online store for Farhad Rabbany's hand-drawn art, built to the
approved design: glass, metal, glow and shine on black and white — Space Grotesk
and Inter — with a structure that owes nothing to the old WordPress site.

## What this is
A complete store that runs in this repository. Browsing, product pages, the bag,
checkout and order confirmation all happen inside these pages. **Nothing links
out to the old site to buy.** The only assets loaded from anotherdayinparadise.la
are Farhad's own product photographs, served from his media library — when the
store gets its own hosting, the same photo files move with it.

## Run it
Open `index.html` from any static host (or `python3 -m http.server` in this
folder). No build step, no server code: `products.js` is the catalogue,
`store.js` is the store engine (bag, totals, checkout, orders — kept in the
buyer's browser), `app.js` is the site chrome, `assets.css` the design system.

## The pages
- `index.html` — the storefront: the line draws itself, the Golden Heart Hoodie
  leads with its price, the best-first rail, the commission, the kit.
- `shop.html` — all 23 pieces, filterable (To wear / For the wall / For the
  hand / Under $100), prices on everything.
- `product.html?id=<slug>` — every product: sizes or canvas sizes with live
  prices, quantity, add to bag.
- `commission.html` — the configurator: cap, motif, your word, certificate;
  reserving puts the $100 deposit in the bag and sends you to it.
- `cart.html` — the bag: quantities, removals, goods/shipping/total. US
  shipping $12 flat, free at $200 of goods.
- `checkout.html` — checkout inside the store; placing an order confirms on
  screen with an order number (ADIP-####) and clears the bag.
- `story.html` — Farhad and the method. `faq.html` — answers + the one
  14-day returns rule (with FAQ schema).
- The eight page names left over from the earlier mockup (gallery, print, kit,
  about, process, watch, journal, contact) are redirect doors into the store.

## The catalogue
23 pieces, every one a real product at its real price under its real name
(verified against the WooCommerce catalogue): 3 hoodies $175, the tee $75,
2 caps $69, the hand-drawn commission $300 ($100 deposit), 15 canvas prints
in five sizes ($200–$350), and the new $39 drawing kit. "Flow of Serenity" is
excluded — it is listed at $0 on the old store; Farhad prices it or retires it.
The kit has no photograph (it exists here first), so it is presented as an
honest spec card, never a faked photo.

## The one remaining wire
Card capture activates with the studio's own payment account (Stripe or
PayPal — Farhad's). Until he provides it, checkout records the order, confirms
it on screen, and the studio confirms payment by email before anything ships;
the checkout page says exactly that, in the open. Everything else — catalogue,
bag, totals, shipping rule, order flow — is live now.

## Gaps that need Farhad (unchanged)
TikTok/Pinterest/YouTube accounts; Meta product tagging needs his logins;
GitHub Pages is one toggle in repo Settings; deploying at
anotherdayinparadise.la (and re-pointing canonical/OG/sitemap there) happens
when the store is accepted and his hosting logins arrive.

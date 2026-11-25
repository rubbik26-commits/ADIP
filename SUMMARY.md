# ADIP Poster Wall — Delivery Summary

**Repo:** https://github.com/rubbik26-commits/ADIP (branch `main`)
**Browse the site (no password, no expiry):**
https://raw.githack.com/rubbik26-commits/ADIP/main/index.html
(a public CDN mirror of this repo — every page, image, and link below works from it)

## 1. What was pushed

17 files in the first push, this summary and share metadata in the second:

- All 14 pages of the Poster Wall build: `index, shop, product, print, commission, kit,
  gallery, process, watch, about, journal, faq, contact, cart` (`.html`)
- `assets.css` (the whole design system) and `app.js` (menu, capture popup, sliders,
  configurator, draw-along tile, hold-to-draw)
- `README.md` — what the site is, how the store works, how to run/deploy it
- `SUMMARY.md` — this report

Every pushed file was read back off GitHub and compared byte-for-byte against the
source: 17/17 identical. Photography is not stored in the repo (the push channel is
text-only); each photo is served from the live store's own uploads at full resolution —
the same originals the store itself uses.

## 2. Store and link structure

The architecture: **this repo is the storefront; the existing WooCommerce store at
anotherdayinparadise.la is the register.** It already holds all 23 real products, real
stock, and a working checkout, so nothing had to be migrated or rebuilt.

- **Buy buttons** on the product, canvas, and commission pages link straight to that
  product's live page on the WooCommerce store (new tab), where size/variant selection,
  the real cart, and payment happen.
- **The Ledger (shop)** — every product row links to its own product: the two showcase
  products (Golden Heart Hoodie, Heart of Paradise canvas) open their design pages here;
  the other 13 rows link directly to their live store pages.
- **The Wall (gallery)** — each of the 14 works' "Canvas from $200" link goes to that
  work's own live product page.
- **Bag page** — express checkout links to the live store's `/checkout/`, guest path to
  its `/cart/`, and the page states in print that checkout runs on the live store.
- **The $39 Kit** has no live product yet, so its button honestly routes to the Paradise
  List (first-printing signup) instead of a fake checkout.
- **Link audit:** all 14 internal page targets exist; all 27 external links (22 product
  pages, cart, checkout, 3 social profiles) were requested and returned 200.

## 3. Social media setup

- **Profile links:** Instagram and Threads (@a.d.i.p.la) and the Facebook page are
  linked in the footer of all 14 pages (verified live).
- **Share metadata:** every page carries the full Open Graph set (title, type, image,
  url, description, site name) plus Twitter Card tags, so any page pasted into
  Instagram, Facebook, X, or a message thread renders with the artwork, the page title,
  and its one-line description. Product pages also carry price and availability meta.
- **The plan is printed on the site itself** (Watch page): the three video formats, the
  posting rhythm, and the @a.d.i.p.la handle disambiguation ("Not food. Hand-drawn
  meditation art by Farhad, Los Angeles.").
- **Recommended order** (from the research, §4): profile links first (done) → Meta
  product catalog/tagging next → TikTok Shop last.

## 4. Research behind the choices (sources)

- **Static front-end + WooCommerce back-end is an established pattern.** WooCommerce's
  own documentation covers add-to-cart URLs (`?add-to-cart=ID`, variation IDs for
  variable products, `/checkout/?add-to-cart=` redirects) —
  https://woocommerce.com/document/quick-guide-to-woocommerce-add-to-cart-urls/ — and
  its Store API is stable and built for custom front-ends —
  https://developer.woocommerce.com/2022/03/25/store-api-is-now-considered-stable/
  Because apparel needs a size choice, the research recommends linking to the product
  page for variable products (an add-to-cart link requires a specific variation ID) —
  which is exactly how the buy buttons here are wired.
- **Keep WooCommerce checkout.** All three options charge the same US card rate
  (2.9% + $0.30): WooPayments has no setup or monthly fee; Stripe Payment Links match
  the rate but don't sync inventory/orders with WooCommerce (useful later as a
  secondary QR/DM channel — https://stripe.com/pricing); Shopify Basic adds
  $29–39/month and a full migration for no rate advantage —
  https://www.shopify.com/pricing
- **Social commerce order.** Meta Shops eligibility needs a Professional Instagram
  account, a Facebook Page, a catalog in Commerce Manager, a verified domain, and
  products buyable on the business's own site; since September 2025 Meta Shops check
  out on the business's website — so tagging will send buyers to the WooCommerce store,
  not a competing checkout. The free official Meta for WooCommerce plugin syncs the
  catalogue — https://metricool.com/instagram-shopping-how-to-use-it/ TikTok Shop US
  requires an 18+ US seller with US ID, SSN last-4/ITIN, and a US bank account, and
  charges a 6% referral fee — a later step, and Farhad's documents, not ours —
  https://smallshopkit.com/tiktok-shop-seller/
- **Share metadata.** The Open Graph protocol requires four properties — title, type,
  image, url (https://ogp.me) — all present on every page, with a 1200px artwork image;
  X falls back to Open Graph for title/description/image but requires its own
  `twitter:card` tag, which is also on every page.
- **Comparables.** Single-artist stores repeat the same structure this build uses:
  shop and portfolio as separate sections, product pages that run story → specs →
  price/availability → shipping/returns on one page, collections by product type, and
  newsletter capture in the footer — e.g. Making Madi (makingmadi.com), the James Jean
  store (visitjamesjean.shop), Lisa Congdon (lisacongdon.com), Threadless Artist Shops.

## 5. How to run and deploy

- **Run locally:** any static server in this folder (`python3 -m http.server`), or just
  open the githack link above — it serves this repo directly.
- **Deploy elsewhere:** copy the folder to any static host (Netlify, Vercel,
  Cloudflare Pages); there is no build step. Fonts load from Google Fonts.
- **Canonical address option:** in the repo's Settings → Pages, set Source to the
  `main` branch and the same files also serve at
  `https://rubbik26-commits.github.io/ADIP/` — a repo-owner toggle I can't flip from
  the connected tools.

## 6. Remaining gaps — need Farhad's / Robert's input

1. **Commission money split.** The commission page promises a $100 deposit + $200
   balance; the live store sells the cap at a flat $300. Pick one: install a
   WooCommerce deposits plugin so the page's split is real at checkout, or change the
   page copy to flat $300.
2. **The $39 Kit product** doesn't exist in WooCommerce yet. Create it there and the
   kit page's button becomes a buy button (today it routes to the list).
3. **"Flow of Serenity" is still priced $0** on the live store — a standing launch
   blocker from the original audit. Price it or unpublish it; it is excluded from
   this site meanwhile.
4. **Meta product tagging** needs the free Meta for WooCommerce plugin installed in
   the WordPress admin plus a Commerce Manager catalog review — needs Farhad's
   website/Facebook logins (already awaited).
5. **TikTok / Pinterest / YouTube** accounts don't exist yet; claiming @a.d.i.p.la
   there and any TikTok Shop registration need Farhad (his ID and bank details for
   the Shop).
6. **GitHub Pages toggle** (§5) — one settings click by the repo owner if the
   canonical github.io address is wanted instead of the mirror link.

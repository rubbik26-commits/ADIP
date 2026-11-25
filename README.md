# ADIP — Another Day in Paradise · "Midnight Garden" build

A complete redesign of anotherdayinparadise.la for Farhad Rabbany's hand-drawn
meditation art — built from scratch: new structure, new compositions, new copy,
new visual world. Only the facts, the verified photographs, the live-store
wiring, and the SEO layer carry over from earlier work.

**The world:** a deep green-black "midnight garden" lit by one iridescent
gradient (mint → sky → lilac → sun), taken from *Empathy in Color* — the one
series Farhad paints in color. Set in Syne & Manrope. Glass header with a
visible nav bar, an iridescent scroll-progress line, and a full-screen index.

**The idea:** paradise is one unbroken line. The home page opens with the line
drawing itself across the screen; the Process page lets the visitor's own
scroll draw (and undraw) the work; the Shop is a wall you travel along
sideways; the Commission configurator is live.

## Pages (14)
index · shop · product (Golden Heart Hoodie) · print (Heart of Paradise) ·
gallery · commission · kit · process · watch · journal · about · faq ·
contact · cart — plus assets.css, app.js, robots.txt, sitemap.xml, llms.txt.

## The store
This repo is the storefront; the register is the existing WooCommerce store at
anotherdayinparadise.la. Every buy button opens the product's own live product
page; the bag page hands off to the live /cart/ and /checkout/. Prices, sizes,
and policies on these pages match the live store's facts, with one deliberate
standardization: a single 14-day returns rule everywhere (the old site
contradicted itself, 14 vs 30 days).

## Run it
Open index.html, or serve the folder: `python3 -m http.server` — no build step,
no dependencies. Fonts come from Google Fonts; product photography is served
from the live store's media library.

Full details, verification notes, and open gaps: see SUMMARY.md.

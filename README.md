# ADIP — Another Day in Paradise · "Glass" build

A complete redesign of anotherdayinparadise.la for Farhad Rabbany's hand-drawn
meditation art — every page rebuilt: new structure, new compositions, new
copy, new menus, new scrolling, new fonts, new color scheme.

**The world:** black and white — the colors of the work itself. Frosted glass
surfaces, polished-metal type and buttons with an animated shine, and a soft
white glow. The artwork is black line on white paper; the site is built from
the same two colors and nothing else.

**The idea:** paradise is one unbroken line. The home page opens with the line
drawing itself across the screen; the Process page lets the visitor's own
scroll draw (and undraw) the work; the Shop is a wall you travel along
sideways; the Commission configurator is live. Navigation is always visible —
on a phone the six section links sit in their own row under the logo, never
hidden behind a button. Nothing pops up over the page, ever.

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
no dependencies. Fonts (Space Grotesk + Inter) come from Google Fonts; product
photography is served from the live store's media library.

Full details, verification notes, and open gaps: see SUMMARY.md.

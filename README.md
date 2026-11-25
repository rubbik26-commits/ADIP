# ADIP — Another Day in Paradise: THE RECREATION

The whole of anotherdayinparadise.la — every page, every image, every function —
recreated from the beginning in a completely different design: a dark gallery.
Warm-black walls, the art hung on lit off-white mats, one vermillion seal accent,
Archivo type, Space Mono labels. Nothing about the presentation resembles the
original site; everything about the content is the original site.

## Run it
Open `index.html` from any static host (or `python3 -m http.server`). No build
step. `catalog.js` is the catalogue (extracted from the live WooCommerce
catalogue), `shop.js` is the engine (galleries, lightbox, bag, checkout,
orders, account), `rec.css` is the design system.

## Every page of the original, recreated
Home (his dictionary-definition hero, the illustration, the studio shelf, the
business block) · Shop (all 23 products, category filters) · Product pages
(full photo galleries — up to 10 photos — with thumbnails and a lightbox,
real size options, canvas size ladder at the real prices) · Gallery (every
drawing, lightbox) · About · FAQ (his eight hoodie answers, kept, plus the
rest of the store) · Contact (working form + the details his page omitted) ·
Cart · Checkout (order confirmation with an order number) · My Account
(your orders) · the hand-drawn cap's page · Shipping · Returns · Terms ·
Privacy · Cookies · Accessibility.

## Every image
All 65 product photographs across the 23 products, plus the site's own art:
the illustration, the draft, the hand drawing, the yoga doodle, the pen
detail, the hang tag, and the homepage's studio shelf. Every URL was
curl-verified before the push. The only files not hotlinked at full size are
four studio props the site serves at 12–27 MB; those use the site's own
mid-size renditions so pages stay fast.

## Functionality
Filters, galleries, lightbox, size/canvas variants with live prices,
quantities, bag with totals and the shipping rule ($12 flat, free at $200),
checkout with validation and on-screen order confirmation, an account page
that lists your orders, the commission configurator on the cap's page
(word + motif + $100 deposit into the bag), and a contact form that composes
your message. One print — Flow of Serenity — is price-on-request, because the
catalogue lists it at $0 and this site does not invent prices.

## The one remaining wire
Card capture activates with the studio's own payment account (the live store
uses PayPal / WooPayments). Until Farhad provides it, checkout records the
order and confirms it on screen, and the studio confirms payment by email
before shipping — stated openly on the checkout page.

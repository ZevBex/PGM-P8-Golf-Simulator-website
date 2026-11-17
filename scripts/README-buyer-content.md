# Buyer planning content

The published site is static. These helpers update only the existing room guide,
P8 product page, and their sitemap modification dates.

1. Use Python with `reportlab` to run `scripts/build-room-worksheet.py`.
   It writes the printable worksheet under `output/pdf/` and copies the same bytes
   into the website's `assets/` directory.
2. Use Python with `Pillow` and Poppler's `pdftoppm` on PATH to run
   `scripts/build-catalog-reference.py`. It checks the original catalog SHA256 and
   renders its complete Global Projects page without changing the photographs.
3. Run `node scripts/enhance-buyer-pages.mjs` after any other HTML generator.
   Repeated runs produce the same HTML. The local full-site build invokes this
   step last. Regenerate guarded local previews separately when available.

`pgm-catalog-facts.json` records the visually checked package prices and source
pages. The scanned source PDF has no extractable text. The owner confirmed on
2026-11-17 that all three prices are in US dollars (USD); the facts file records
this separately from the catalog review. The Product has three named Offer
entries matching the visible package table, not an AggregateOffer price range.
Do not invent availability, ratings, expiry dates or offer conditions. Reconfirm
with the owner before changing the currency or catalog amounts.

The catalog project photographs identify applications, not named customers,
countries, installation dates or business results. Exact computer and projector
models still need a separate supplied-equipment specification.

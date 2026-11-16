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
pages. The scanned source PDF has no extractable text. Its printed dollar sign
does not establish an ISO currency code. Update `priceCurrency` only from the
owner's confirmation; do not invent availability, ratings or offer conditions.

The catalog project photographs identify applications, not named customers,
countries, installation dates or business results. Exact computer and projector
models still need a separate supplied-equipment specification.

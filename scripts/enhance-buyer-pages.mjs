import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Run after the existing static-site generator. Only these two pages and their
// sitemap dates are changed; product facts remain tied to the published catalog.
const root = path.resolve(import.meta.dirname, '..');
const origin = 'https://mypgmgolf.com';
const base = '../../';
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'scripts/pgm-catalog-facts.json'), 'utf8'));
const worksheet = `${base}assets/pgm-room-measurement-worksheet.pdf`;
const video = 'https://gv.videocdn.alibaba.com/icbu_vod_video/video_target/gva1-a4119ccb-a1ac22a4-a134933e-2a2b/trans/aidc/a424sn-h264-hd.mp4';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const section = (id, title, body, intro = '') => `<section class="section" id="${id}"><div class="wrap"><div class="section-intro"><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ''}</div>${body}</div></section>`;
function insert(html, name, content, before) {
  const start = `<!-- buyer-guidance:${name}:start -->`, end = `<!-- buyer-guidance:${name}:end -->`;
  const block = `${start}${content}${end}`;
  if (html.includes(start)) {
    const a = html.indexOf(start), b = html.indexOf(end, a);
    assert.ok(b > a, `Unclosed content block: ${name}`);
    return html.slice(0, a) + block + html.slice(b + end.length);
  }
  assert.ok(html.includes(before), `Missing insertion point: ${before}`);
  return html.replace(before, block + before);
}
const roomWorksheet = section('room-worksheet', 'Build a room brief your installer can review.', `
<div class="split"><div class="prose"><h3>Download the room measurement worksheet.</h3><p>Use the one-page worksheet to collect clear width, depth and height in one set of units. Record the lowest beam or light fitting, doors, windows and the players who will use the bay.</p><p>Sketch your room and mark the equipment you already own. Email the completed sheet with room photos, or copy the measurements into the enquiry form below.</p><p>A floor plan and photos help the team review the proposed screen, hitting position, projector and access together. The worksheet is a planning brief, not an installation drawing or approval of swing clearance.</p></div><aside class="buyer-download" aria-labelledby="worksheet-download-title"><span class="eyebrow">Room planning worksheet</span><h3 id="worksheet-download-title">Measure once. Keep the details together.</h3><p>A printable sheet for your room dimensions, obstructions, players and existing equipment.</p><a class="button" href="${worksheet}" download>Download measurement sheet · PDF</a><p class="fine-print">1 page · no sign-up required</p><a href="mailto:tracy@pgmgolf.com">Email your completed brief →</a></aside></div>
<div class="buyer-next"><h3>Use the room brief to choose your next step.</h3><p>Review the <a href="${base}products/pgm-p8-golf-simulator/#packages">PGM P8 package comparison</a> for the complete system, or discuss <a href="${base}solutions/commercial-golf-simulator/">commercial bay layout and circulation</a> for a venue. A larger overall room does not remove the need to check equipment positions and the full swing envelope.</p><a class="button secondary" href="#inquiry">Send my room dimensions →</a></div>`, 'Turn your golf simulator room dimensions into a practical configuration enquiry.');

const packageChoice = `<div class="buyer-next" id="package-choice"><h3>Which P8 package should I ask about?</h3><ul class="list"><li><strong>Start with the required projection:</strong> the catalog lists 2K for Standard and 4K for Flagship and Performance. Ask for the exact projector model and check it against your screen and mounting plan.</li><li><strong>Decide whether you want a motion swing plate:</strong> the Performance package lists the PGM 8-way motion swing plate. Ask how it affects the finished floor, equipment layout and installation scope.</li><li><strong>Confirm the supplied computer:</strong> the catalog gives descriptive grades, not CPU, GPU or memory specifications. Compare the actual computer models in the written quotation.</li></ul><p>Package names do not determine the right fit on their own. Share your intended use, room dimensions and existing equipment before agreeing the final configuration.</p></div>`;

const demonstration = section('product-demonstration', 'Watch the PGM simulator demonstration.', `<figure class="buyer-demo"><video controls muted playsinline preload="none" aria-label="PGM golf simulator demonstration" poster="${base}assets/optimized/golf-simulator-hero-1500w-0cada4ab717f.webp"><source src="${video}" type="video/mp4">Your browser does not support HTML video.</video><figcaption>PGM product demonstration from our existing website. Scenes may show optional equipment; the package table and your written quotation define the supplied system. The player starts muted; sound is optional.</figcaption></figure><p class="fine-print"><a href="${video}" target="_blank" rel="noopener noreferrer">Open the demonstration video separately ↗</a> if the embedded player is unavailable.</p>`, 'See the simulator in use, then check the components and configuration that apply to your own project.');

const quoteChecklist = section('quote-checklist', 'What determines a PGM P8 golf simulator price?', `<div class="prose"><p>A useful P8 quotation separates the chosen equipment from delivery, local preparation and any ongoing services. Use an itemized scope to confirm the supplied equipment and the work your local team will arrange.</p><ol class="list"><li><strong>Hardware and options:</strong> identify the package, projector and computer models, screen format, motion plate and any additional components.</li><li><strong>Room work and installation:</strong> list what the supplier provides and what your local team must prepare, install or commission.</li><li><strong>Delivery to your destination:</strong> confirm packing, freight, agreed delivery terms and who handles destination charges.</li><li><strong>Software and ongoing services:</strong> distinguish the catalog's permanent free OTA updates from commercial-use rights, course access and separately supplied services.</li><li><strong>Support responsibilities:</strong> confirm written warranty terms by component, the diagnostic process and replacement-part arrangements.</li></ol><p>No fixed system price, installation fee or recurring charge is stated here. The final amount and responsibilities depend on the agreed configuration and destination.</p></div><div class="buyer-next"><h3>Send a brief the team can quote against.</h3><p>Include your country, home or commercial use, preferred package, clear room dimensions and equipment you already own. Use the <a href="${worksheet}" download>room measurement worksheet (PDF)</a> if you are still collecting the site information.</p><a class="button" href="#inquiry">Request an itemized P8 quote →</a></div>`, 'Compare the complete scope of supply.');

const catalogPriceNote = `<p class="note" id="catalog-price-note">Catalog package prices are reproduced from <a href="${base}${catalog.source}#page=${catalog.packagePdfPage}">PDF page ${catalog.packagePdfPage} / printed page ${catalog.packagePrintedPage}</a>, reviewed 16 November 2026. ${catalog.priceCurrency ? `All three package prices are in US dollars (${escape(catalog.priceCurrency)}), confirmed by PGM on 17 November 2026.` : 'The $ symbol is reproduced as printed; confirm the applicable currency with PGM.'} Confirm the current quotation, included equipment, delivery, destination charges and installation scope before ordering.</p>`;
const catalogProjects = section('catalog-projects', 'Installation photographs in the PGM catalog.', `<div class="split"><div class="prose"><h3>See home, commercial and golf-store examples.</h3><p>The catalog's Global Projects page includes photographs labelled Commercial Project, Home Project, Golf Store and Trade Show, alongside other application examples.</p><p>Use these photographs to discuss the screen layout, room finish and type of installation you have in mind. For a reference relevant to your project, ask the team about its configuration, room dimensions and installation scope.</p><a class="button secondary" href="${base}${catalog.source}#page=${catalog.projectPdfPage}" target="_blank" rel="noopener noreferrer">View catalog project photographs · PDF ↗</a><p class="fine-print">Source: PGM catalog, PDF page ${catalog.projectPdfPage} / printed page ${catalog.projectPrintedPage}. Reviewed 16 November 2026.</p></div><figure class="buyer-case"><a href="${base}${catalog.source}#page=${catalog.projectPdfPage}" target="_blank" rel="noopener noreferrer"><img src="${base}${catalog.projectImage}" width="${catalog.projectImageWidth}" height="${catalog.projectImageHeight}" alt="PGM catalog Global Projects page with commercial, home and golf-store installation photographs" loading="lazy" decoding="async"></a><figcaption>Complete catalog project page. Open the source PDF for a larger view.</figcaption></figure></div>`);

const configurations = [
  {file:'guides/golf-simulator-room-size/index.html', title:'Golf Simulator Room Dimensions & Ceiling Height | PGM', description:'Check PGM golf simulator room dimensions in metres and feet, compare screen layouts and ceiling height, and download a room measurement worksheet.', heading:'Golf simulator room dimensions & ceiling height.', kind:'room', modified:'2026-11-16'},
  {file:'products/pgm-p8-golf-simulator/index.html', title:'PGM P8 Golf Simulator Prices, Packages & Room Size', description:'Compare PGM P8 catalog prices and Standard, Flagship and Performance packages. Watch the demo, view installation photographs and check room requirements.', heading:'PGM P8 golf simulator prices.', kind:'product', modified:'2026-11-17'}
];
for (const config of configurations) {
  const file = path.join(root, config.file);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<title>.*?<\/title>/, `<title>${escape(config.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(config.description)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escape(config.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escape(config.description)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escape(config.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escape(config.description)}">`)
    .replace(/<h1>.*?<\/h1>/, `<h1>${escape(config.heading)}</h1>`);
  if (!html.includes('assets/buyer-planning.css')) html = html.replace('</head>', `<link rel="stylesheet" href="${base}assets/buyer-planning.css?v=20261116"></head>`);
  if (config.kind === 'room') {
    html = html.replace(/Room planning guide · updated \d+ November 2026/, 'Room planning guide · updated 16 November 2026');
    if (!html.includes('class="button secondary" href="'+worksheet)) html = html.replace('<a class="button" href="#inquiry">Ask about my room →</a>', `<a class="button" href="#inquiry">Ask about my room →</a><a class="button secondary" href="${worksheet}" download>Room worksheet · PDF ↓</a>`);
    if (!html.includes('href="#room-worksheet"')) html = html.replace('<a href="#clearance">Ceiling & swing clearance</a>', '<a href="#clearance">Ceiling & swing clearance</a><a href="#room-worksheet">Measurement worksheet</a>');
    html = insert(html, 'room-worksheet', roomWorksheet, '<section class="section alt" id="height-reference">');
    html = insert(html, 'room-faq', '<details><summary>Are golf simulator room dimensions the same as enclosure dimensions?</summary><p>No. Enclosure dimensions describe a component, while room dimensions describe the usable space for the screen, equipment, player and circulation. Review the enclosure footprint and all required clearances together in the room plan.</p></details><details><summary>How do I send my dimensions for a configuration review?</summary><p>Use one set of units and record clear depth, width and height below the lowest obstruction. Add a sketch, room photos, intended players and the equipment you already have. Download the measurement worksheet above and email it to PGM, or enter the measurements in the enquiry form.</p></details>', '</div></div></section><section class="section alt" id="inquiry">');
    html = html.replace(/(<textarea[^>]*name="message"[^>]*placeholder=")[^"]+/, '$1Clear depth × width × height and units; lowest beam or light fitting; intended players; home or commercial use; country; equipment already owned.');
  } else {
    // Put the existing factual comparison before generic technology copy.
    const packages = html.match(/<section class="section(?: alt)?" id="packages">[\s\S]*?<\/section>/)?.[0];
    assert.ok(packages, 'P8 package comparison missing');
    const comparisonAnchor = html.includes('<!-- buyer-guidance:product-demonstration:start -->')
      ? '<!-- buyer-guidance:product-demonstration:start -->' : '<section class="section" id="technology">';
    html = html.replace(packages, '').replace(comparisonAnchor, packages + comparisonAnchor);
    html = insert(html, 'package-choice', packageChoice, '<p class="fine-print">Source: <a href="../../assets/pgm-golf-simulator-catalog.pdf#page=9">');
    const prices = `<tr data-catalog-prices><th scope="row">Catalog package price${catalog.priceCurrency ? ' ('+escape(catalog.priceCurrency)+')' : ' (as printed)'}</th>${catalog.packages.map((p,i)=>`<td id="p8-price-${i+1}"><strong>${escape(p.printedPrice)}</strong></td>`).join('')}</tr>`;
    if (html.includes('<tr data-catalog-prices>')) html = html.replace(/<tr data-catalog-prices>[\s\S]*?<\/tr>/, prices);
    else html = html.replace('<tbody><tr><th scope="row">Laser projector</th>', '<tbody>'+prices+'<tr><th scope="row">Laser projector</th>');
    html = insert(html, 'catalog-price-note', catalogPriceNote, '<!-- buyer-guidance:package-choice:start -->');
    html = insert(html, 'product-demonstration', demonstration, '<section class="section" id="technology">');
    html = insert(html, 'catalog-projects', catalogProjects, '<section class="section alt" id="applications">');
    html = insert(html, 'quote-checklist', quoteChecklist.replace('No fixed system price, installation fee or recurring charge is stated here.', 'The package prices above are catalog references. Confirm the applicable offer and any installation or ongoing-service charges in your quotation.'), '<section class="section alt" id="inquiry">');
    html = html.replace(/(<details><summary>How much does a P8 setup cost\?<\/summary><p>)[\s\S]*?(<\/p><\/details>)/, `$1The current catalog prints Standard at ${catalog.packages[0].printedPrice}, Flagship at ${catalog.packages[1].printedPrice} and Performance at ${catalog.packages[2].printedPrice}. ${catalog.priceCurrency ? 'The currency is '+escape(catalog.priceCurrency)+'.' : 'Confirm the applicable currency with PGM.'} See the source-linked package table above, then request hardware, software, freight, installation and any ongoing charges separately in your quotation.$2`);
    if (!html.includes('href="#product-demonstration"')) html = html.replace('<a href="#space">Room & installation</a>', '<a href="#space">Room & installation</a><a href="#product-demonstration">Watch demonstration</a><a href="#quote-checklist">Quote checklist</a>');
    html = html.replace('placeholder="Home, training or commercial use? Include clear room dimensions, destination and any components you already have."', 'placeholder="Country and intended use; preferred P8 package; clear room dimensions and units; projector/computer already owned; options and installation support required."');
    html = html.replace('<h2>Discuss your PGM configuration.</h2>', '<h2>Request an itemized P8 configuration.</h2>');
  }
  html = html.replaceAll('Reviewed 11 November 2026.', 'Reviewed 16 November 2026.');
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_, text) => {
    const data = JSON.parse(text);
    for (const item of data['@graph'] || [data]) {
      if (item.url === origin + '/' + config.file.replace(/index\.html$/, '') && ['Article','ItemPage'].includes(item['@type'])) {
        item.name = config.title; item.description = config.description; item.dateModified = config.modified;
        if (item.headline) item.headline = config.heading;
      }
      if (config.kind === 'product' && item['@type'] === 'Product') {
        item.description = config.description;
        if (catalog.priceCurrency) {
          // Keep each named configuration and its exact price. A variant price
          // range must not be represented as an AggregateOffer.
          item.offers = catalog.packages.map((pack, index) => ({
            '@type': 'Offer',
            '@id': `${item.url}#catalog-offer-${index + 1}`,
            name: `PGM P8 ${pack.name}`,
            url: `${item.url}#p8-price-${index + 1}`,
            price: String(pack.amount),
            priceCurrency: catalog.priceCurrency,
            description: `${pack.name} catalog package price. Confirm the current quotation, included equipment, delivery, destination charges and installation scope before ordering.`,
            seller: {'@id': `${origin}/#organization`}
          }));
        } else {
          delete item.offers;
        }
      }
    }
    return `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`;
  });
  fs.writeFileSync(file, html);
}
const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
for (const {file, modified} of configurations) {
  const url = origin + '/' + file.replace(/index\.html$/, '');
  const expression = new RegExp(`(<loc>${url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}</loc>\\s*<lastmod>)[^<]+`);
  assert.ok(expression.test(sitemap), 'Missing sitemap URL: '+url);
  sitemap = sitemap.replace(expression, `$1${modified}`);
}
fs.writeFileSync(sitemapFile, sitemap);
console.log('Updated two buyer pages and their sitemap modification dates.');

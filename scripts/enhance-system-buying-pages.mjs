import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Apply after enhance-buyer-pages.mjs. Scope: P8, commercial, their sitemap dates.
const root = path.resolve(import.meta.dirname, '..');
const origin = 'https://mypgmgolf.com';
const facts = JSON.parse(fs.readFileSync(path.join(root, 'scripts/pgm-catalog-facts.json'), 'utf8'));
assert.equal(facts.priceCurrency, 'USD', 'Only use the owner-confirmed catalog currency');
const b = '../../';
const source = `${b}${facts.source}#page=${facts.packagePdfPage}`;
const worksheet = `${b}assets/pgm-room-measurement-worksheet.pdf`;
const section = (id, title, intro, body, alt = false) => `<section class="section${alt ? ' alt' : ''}" id="${id}"><div class="wrap"><div class="section-intro"><h2>${title}</h2><p>${intro}</p></div>${body}</div></section>`;
function insert(html, name, content, before) {
  const start = `<!-- system-buying:${name}:start -->`, end = `<!-- system-buying:${name}:end -->`;
  const block = start + content + end;
  if (html.includes(start)) {
    const a = html.indexOf(start), z = html.indexOf(end, a);
    assert.ok(z > a, `Unclosed block ${name}`);
    return html.slice(0, a) + block + html.slice(z + end.length);
  }
  assert.ok(html.includes(before), `Missing insertion point ${before}`);
  return html.replace(before, () => block + before);
}
// Attribute replacement callbacks preserve dollar signs as literal copy.
function updateHead(html, title, description, heading) {
  const attr = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${attr(title)}</title>`);
  for (const key of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
    html = html.replace(new RegExp(`(<meta ${key} content=")[^"]*`), (_, p) => p + attr(description));
  }
  for (const key of ['property="og:title"', 'name="twitter:title"']) {
    html = html.replace(new RegExp(`(<meta ${key} content=")[^"]*`), (_, p) => p + attr(title));
  }
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, () => `<h1>${heading}</h1>`);
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_, text) => {
    const data = JSON.parse(text);
    for (const node of data['@graph'] || [data]) {
      if (['WebPage', 'ItemPage'].includes(node['@type'])) {
        node.name = title; node.description = description; node.dateModified = '2026-11-17';
      }
      if (node['@type'] === 'Product') node.description = description;
    }
    return `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
  });
}

const p8File = 'products/pgm-p8-golf-simulator/index.html';
let p8 = fs.readFileSync(path.join(root, p8File), 'utf8');
p8 = updateHead(p8, 'PGM P8 Golf Simulator Packages, Prices & Room Size',
  'Compare complete PGM P8 golf simulator packages: Standard $13,300, Flagship $15,100 and Performance $19,400 USD. Check equipment, room size and quotation scope.',
  'PGM P8 complete golf simulator packages.');
p8 = p8.replace(/<p class="lead">[\s\S]*?<\/p>/, () => '<p class="lead">Choose a complete PGM P8 simulator system with shot tracking, software, projection, computer and playing surfaces. Compare three catalog packages from $13,300 USD, then confirm the configuration and delivery scope for your home or commercial venue.</p>');
p8 = p8.replace('<a class="button" href="#inquiry">Request a P8 configuration →</a>', '<a class="button" href="#inquiry">Request a complete-system quote →</a>');
p8 = p8.replace('<button class="button" type="submit">Request a complete-system quote →</button>', '<button class="button" type="submit">Request a P8 configuration →</button>');
p8 = p8.replace('<h2>Confirm the final order and installation scope.</h2>', '<h2>What to confirm in a complete golf simulator system.</h2>');
const route = `<div class="buyer-next" id="system-buying-route"><h3>Buying a whole system? Start with your space and intended use.</h3><p>For a home studio, use the <a href="${b}guides/golf-simulator-room-size/">room-size guide</a> to record the full swing area and equipment positions. For a paid venue, review <a href="${b}solutions/commercial-golf-simulator/#packages">commercial packages and project costs</a>, including software rights, circulation and local installation work.</p><p>The catalog equipment list is the starting point for the supplied system. The room itself, transport arrangements and installation responsibilities still need an agreed project scope.</p><a class="button secondary" href="#inquiry">Ask which complete package fits →</a></div>`;
p8 = insert(p8, 'buying-route', route, '<p class="fine-print">Source: <a href="../../assets/pgm-golf-simulator-catalog.pdf#page=9">');
fs.writeFileSync(path.join(root, p8File), p8);

const commercialFile = 'solutions/commercial-golf-simulator/index.html';
let commercial = fs.readFileSync(path.join(root, commercialFile), 'utf8');
commercial = updateHead(commercial, 'Commercial Golf Simulator Packages & Cost Planning | PGM',
  'Plan a complete PGM P8 commercial golf simulator system. Compare USD catalog package prices, included equipment, bay requirements and the scope of a venue quote.',
  'Commercial golf simulator packages for your venue.');
commercial = commercial.replace(/<p class="lead">[\s\S]*?<\/p>/, () => '<p class="lead">Compare complete PGM P8 systems for a golf studio, training facility or hospitality venue. Start with the equipment package, then plan bay layout, commercial software rights and the full cost of getting your venue ready to play.</p>');
commercial = commercial.replace('<a class="button" href="#inquiry">Discuss a commercial project →</a>', '<a class="button" href="#inquiry">Request a commercial system quote →</a>');
commercial = commercial.replace('<button class="button" type="submit">Request a commercial system quote →</button>', '<button class="button" type="submit">Discuss a commercial project →</button>');
commercial = commercial.replace(/<nav class="jump-links" aria-label="On this page">[\s\S]*?<\/nav>/, () => '<nav class="jump-links" aria-label="On this page"><a href="#packages">Packages & cost</a><a href="#applications">Venue types</a><a href="#planning">Bay planning</a><a href="#operation">Daily operation</a><a href="#venue-brief">Prepare a quote brief</a></nav>');
if (!commercial.includes('href="../../assets/buyer-planning.css')) commercial = commercial.replace('</head>', '<link rel="stylesheet" href="../../assets/buyer-planning.css?v=20261116"></head>');

const priceRows = facts.packages.map((p, i) => `<tr><th scope="row">${p.name}</th><td><strong>${p.printedPrice} USD</strong></td><td>${i === 0 ? '2K laser projector' : '4K laser projector'}</td><td>${i === 2 ? 'PGM 8-way motion swing plate listed' : 'Motion swing plate not listed'}</td></tr>`).join('');
const packages = section('packages', 'Commercial golf simulator cost: start with the equipment package.',
  'The PGM catalog lists three P8 system packages. Use these equipment prices as a starting point for an itemized commercial project quotation.',
  `<div class="table-scroll" role="region" aria-label="P8 commercial equipment package references, scroll to compare" tabindex="0"><table><caption>PGM P8 catalog package prices · USD · scroll to compare →</caption><thead><tr><th scope="col">Package</th><th scope="col">Catalog equipment price</th><th scope="col">Projection</th><th scope="col">Motion option</th></tr></thead><tbody>${priceRows}</tbody></table></div>
<div class="grid two"><article class="card"><h3>What the three system packages include</h3><ul class="list"><li>PGM four-lens high-speed detector and P8 Genuine System.</li><li>Automatic tee-up and a 23.5-inch mirror touchscreen kiosk.</li><li>Stereo sound and a double-layer impact screen.</li><li>Professional hitting mat and artificial grass floor.</li><li>A laser projector and computer, with specifications varying by package.</li></ul><p>All three lists state permanent free OTA updates. Commercial-use rights, course access and separately supplied services need confirmation.</p></article><article class="card"><h3>What the project quote must also resolve</h3><ul class="list"><li>Exact computer and projector models, screen size and bay structure.</li><li>Any local room preparation, electrical work, acoustics and installation.</li><li>Packing, freight, delivery terms, import taxes and destination charges.</li><li>Software permissions, ongoing charges and commissioning responsibilities.</li><li>Written support, warranty and replacement-part arrangements.</li></ul><p>A catalog system price alone does not establish a delivered and installed venue budget.</p></article></div>
<p class="note">Source: <a href="${source}">PGM catalog, PDF page ${facts.packagePdfPage} / printed page ${facts.packagePrintedPage}</a>, reviewed 16 November 2026. PGM confirmed USD on 17 November 2026. Confirm the current quotation and commercial configuration before ordering.</p>
<div class="actions"><a class="button" href="#inquiry">Request my commercial P8 quote →</a><a class="button secondary" href="${b}products/pgm-p8-golf-simulator/#packages">Full P8 package comparison →</a></div>`, true);
commercial = insert(commercial, 'commercial-packages', packages, '<section class="section alt" id="planning">');

const brief = section('venue-brief', 'Prepare a brief for your complete simulator system.',
  'Give the team the information needed to compare configurations and define the work at your venue.',
  `<div class="split"><div class="prose"><ol class="list"><li><strong>Venue and destination:</strong> country, venue type, intended use and preferred number of bays.</li><li><strong>Usable space:</strong> clear depth, width and height for each proposed bay, with units, floor plan and photos of beams, doors and access.</li><li><strong>Players and operation:</strong> left- and right-handed use, coaching or social play, supervision and any booking requirements.</li><li><strong>System preference:</strong> P8 package, projection resolution, motion plate and exact models of equipment you already own.</li><li><strong>Delivery and installation:</strong> target opening date, receiving access, local contractor availability and the support you want quoted.</li></ol><p>Review <a href="${b}guides/golf-simulator-room-size/">golf simulator room dimensions</a> before choosing the bay count. The catalog's 6.0 × 4.0 × 3.0 m layout is a reference configuration; safe swing clearance and the finished layout require a project review.</p></div><aside class="buyer-download" aria-labelledby="commercial-worksheet-title"><span class="eyebrow">Site information</span><h3 id="commercial-worksheet-title">Bring your bay measurements together.</h3><p>Use the existing one-page room worksheet for each proposed bay. Include a separate plan for walkways, waiting areas and other venue functions.</p><a class="button" href="${worksheet}" download>Download room worksheet · PDF</a><p class="fine-print">1 printable page · no sign-up</p><a href="#inquiry">Send my project brief →</a></aside></div>`);
commercial = insert(commercial, 'venue-brief', brief, '<section class="section alt" id="process">');

const projects = section('catalog-projects', 'See the installation settings shown in the PGM catalog.',
  'Review the original catalog photographs when discussing the look and layout of your own system.',
  `<div class="split"><div class="prose"><h3>Home, commercial and golf-store settings</h3><p>The catalog brings several installation photographs onto one page. Use them to discuss the screen, hitting area and surrounding room with PGM.</p><p>These images do not identify customer names, countries, installation dates or operating results. The equipment and site work for your venue must be specified separately.</p><p><a href="${b}${facts.source}#page=${facts.projectPdfPage}">View the original project page in the catalog →</a></p><a class="button secondary" href="#inquiry">Discuss a similar layout →</a></div><figure class="buyer-case"><a href="${b}${facts.source}#page=${facts.projectPdfPage}"><img src="${b}${facts.projectImage}" alt="Complete PGM catalog page showing home, commercial and golf-store installation photographs" width="${facts.projectImageWidth}" height="${facts.projectImageHeight}" loading="lazy" decoding="async"></a><figcaption>PGM catalog · PDF page ${facts.projectPdfPage} / printed page ${facts.projectPrintedPage}. Supplied configuration varies by project.</figcaption></figure></div>`);
commercial = insert(commercial, 'catalog-projects', projects, '<section class="section" id="questions">');
const costFaq = `<details><summary>How much does a complete commercial golf simulator cost?</summary><p>The PGM catalog lists P8 Standard at $13,300 USD, Flagship at $15,100 USD and Performance at $19,400 USD. These are catalog equipment-package references. Your commercial quote must also identify software rights, freight, destination charges, site preparation, installation and any ongoing costs.</p></details><details><summary>What is included in the complete P8 system?</summary><p>The catalog lists shot tracking, P8 software, automatic tee-up, a mirror touchscreen kiosk, sound, an impact screen, playing surfaces, a projector and a computer. Projection, computer grade and the motion plate vary by package. Compare the <a href="#packages">three packages</a> and confirm the supplied models and local work in writing.</p></details>`;
commercial = insert(commercial, 'commercial-faq', costFaq, '<details><summary>Can PGM P8 be discussed for a commercial golf venue?</summary>');
commercial = commercial.replace('<h2>Let’s work through your venue.</h2>', '<h2>Request a complete commercial system quote.</h2>');
fs.writeFileSync(path.join(root, commercialFile), commercial);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
for (const file of [p8File, commercialFile]) {
  const url = origin + '/' + file.replace(/index\.html$/, '');
  const re = new RegExp(`(<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]+`);
  assert.ok(re.test(sitemap), `Sitemap URL missing: ${url}`);
  sitemap = sitemap.replace(re, (_, p) => p + '2026-11-17');
}
fs.writeFileSync(sitemapFile, sitemap);
console.log('Updated P8 and commercial complete-system buying content.');

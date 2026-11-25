import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('./pgm-catalog-facts.json', import.meta.url), 'utf8'));
const [standard, flagship, performance] = catalog.packages;
const usd = amount => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: catalog.priceCurrency, maximumFractionDigits: 0
}).format(amount);

export const solutionsTitle = 'Home Golf Simulator Packages, Garage & Commercial Setups | PGM';
export const solutionsDescription = 'Compare PGM P8 home golf simulator packages, check garage door and ceiling clearance, and plan a quote for a dedicated room, shared garage or commercial venue.';
export const solutionsHeading = 'Golf simulator packages for your home, garage or venue';
export const solutionsLead = 'Choosing a P8 for home starts with two decisions. Will the bay stay set up between sessions, and which projector and playing surface do you want? For a paid venue, start with the commercial bay budget.';

export function homePackages(base) {
  return `<div class="wrap"><nav class="jump-links" aria-label="On this page"><a href="#home-packages">Home packages</a><a href="#garage-setup">Garage fit</a><a href="#applications">Commercial &amp; training</a></nav></div><section class="section" id="home-packages"><div class="wrap">
<div class="section-intro"><h2>Compare home golf simulator packages</h2><p>All three P8 packages pair shot tracking and software with a computer, laser projector, impact screen, hitting mat and automatic tee-up. The main choices for a home studio are projection resolution and the motion swing plate.</p></div>
<div class="grid three">
<article class="card"><h3>Standard · ${usd(standard.amount)} USD</h3><p>Start here for a fixed hitting surface and 2K projection. Measure the proposed screen width so the installer can check the projector position and image size.</p></article>
<article class="card"><h3>Flagship · ${usd(flagship.amount)} USD</h3><p>For ${usd(flagship.amount - standard.amount)} more than Standard, the catalog lists 4K projection and a higher-specification computer. Ask for the quoted projector and computer models before choosing the upgrade.</p></article>
<article class="card"><h3>Performance · ${usd(performance.amount)} USD</h3><p>Choose this configuration if you want an eight-way motion swing plate with 4K projection. Have the installer check the finished playing height and how the plate will meet the surrounding floor.</p></article>
</div><p class="fine-print">Equipment prices from the <a href="${base}${catalog.source}#page=${catalog.packagePdfPage}">PGM catalog</a>. Ask for an itemized quote covering delivery to your address and the work required in your room.</p>
<div class="actions"><a class="button" href="${base}support/request-a-quote/?product=P8&amp;from=solutions#inquiry">Get a quote for my home setup →</a><a class="button secondary" href="${base}products/pgm-p8-golf-simulator/#packages">Compare the full P8 equipment lists →</a></div>
</div></section>
<section class="section alt" id="garage-setup"><div class="wrap">
<div class="section-intro"><h2>Will a garage golf simulator package work with your door and parking space?</h2></div>
<div class="grid two"><article class="card"><h3>If a car still uses the garage</h3><p>Mark the parking space, the proposed screen line and the area the door passes through as it opens. Photograph the rails, opener and crossbars with the door open and closed. Tell PGM which floor area must be clear again after play.</p><p>Ask which components would stay fixed, which could be moved and whether they would need realignment. Confirm the changeover plan before ordering.</p></article>
<article class="card"><h3>If the bay can stay in place</h3><p>Measure the usable depth and width and the height below the lowest obstruction. The PGM standard flat-screen reference is 6.0 × 4.0 × 3.0 m (about 19.7 × 13.1 × 9.8 ft). Player handedness, swing space, screen clearance and mounting positions still need a layout review.</p><p><a href="${base}guides/golf-simulator-room-size/#single-bay-plan">See the dimensioned plan and measurement worksheet →</a></p></article></div>
<p>For a home quote, include your destination, preferred package, room measurements, door photos and any equipment you want to reuse. For a business, see the <a href="${base}solutions/commercial-golf-simulator/#one-bay-budget">single-bay opening budget</a>.</p>
</div></section>`;
}

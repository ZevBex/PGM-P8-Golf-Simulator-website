(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const config = window.SITE_CONFIG || {};
  function wireTabs(selector, activate) {
    const tabs = [...document.querySelectorAll(selector)];
    function select(tab, focus = false) { tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; }); activate(tab); if (focus) tab.focus(); }
    tabs.forEach((tab, index) => { tab.addEventListener('click', () => select(tab)); tab.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % tabs.length; if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; if (next !== undefined) { event.preventDefault(); select(tabs[next], true); } }); });
  }
  const modes = {
    range: {label:'PRACTICE / REFINE / REPEAT', title:'Make every session count.', copy:'Explore slope practice, precision challenges and a futuristic driving range. Choose a focus and build a practice session around it.', word:'FOCUS.'},
    course: {label:'EXPLORE / DISCOVER / PLAY', title:'A different round awaits.', copy:'Move from the practice range to detailed course environments. P8 also includes imaginative settings such as underwater ruins and a family-friendly fantasy world.', word:'EXPLORE.'},
    games: {label:'COMPETE / LAUGH / REPEAT', title:'Everyone has a shot.', copy:'Try target scoring, distance challenges and wedge-based games. A new way to introduce friends and family to golf, with a little friendly competition.', word:'PLAY.'},
    online: {label:'CONNECT / COMPETE / SHARE', title:'Close the distance.', copy:'Play with golfers online or arrange a private room with friends. Ask about internet requirements, accounts and the online features available in your configuration.', word:'CONNECT.'}
  };
  wireTabs('[data-mode]', tab => { const data = modes[tab.dataset.mode]; $('#mode-panel').setAttribute('aria-labelledby', tab.id); $('#mode-label').textContent = data.label; $('#mode-title').textContent = data.title; $('#mode-copy').textContent = data.copy; $('#mode-word').textContent = data.word; });
  const layouts = {
    single: {name:'Single screen',title:'A focused playing space.',description:'A straight-screen layout for a dedicated room, training studio or private golf space.',image:'./assets/pgm-single.png',dimensions:[[4.5,3,2.6],[6,4,3],[8,5.2,3.2]]},
    curved: {name:'Curved screen',title:'A wider view of the game.',description:'A wraparound screen configuration for a more expansive golf room, lounge or premium hospitality space.',image:'./assets/pgm-curved.png',dimensions:[[5,5,2.6],[6,5.5,3],[8,6,3.2]]}
  };
  let layout = 'single';
  let unit = 'm';
  function renderDimensions() {
    const rows = ['Minimum*','Standard','With lounge'];
    $('#dimensions').replaceChildren(...layouts[layout].dimensions.map((values, index) => { const row = document.createElement('tr'); const heading = document.createElement('th'); heading.scope = 'row'; heading.textContent = rows[index]; row.append(heading); values.forEach(value => { const cell = document.createElement('td'); cell.textContent = (unit === 'ft' ? value / .3048 : value).toFixed(1); row.append(cell); }); return row; }));
    ['depth','width','height'].forEach(label => { $(`#${label}-heading`).textContent = `${label[0].toUpperCase()+label.slice(1)} (${unit})`; });
  }
  wireTabs('[data-space]', tab => { layout = tab.dataset.space; const data = layouts[layout]; $('#space-panel').setAttribute('aria-labelledby', tab.id); $('#space-title').textContent = data.title; $('#space-description').textContent = data.description; $('#space-image').src = data.image; $('#space-image').alt = `${data.name} PGM golf simulator layout`; $('#space-caption').textContent = `${data.name.toUpperCase()} / INSTALLATION REFERENCE`; $('#selected-layout').value = data.name; $('#layout-cta').textContent = `Plan a ${layout}-screen setup`; renderDimensions(); });
  document.querySelectorAll('[data-unit]').forEach(button => button.addEventListener('click', () => { unit = button.dataset.unit; document.querySelectorAll('[data-unit]').forEach(item => item.setAttribute('aria-pressed',String(item === button))); renderDimensions(); }));

})();

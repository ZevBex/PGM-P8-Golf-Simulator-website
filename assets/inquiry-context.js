(() => {
  'use strict';
  const products = Object.freeze({
    P8: { name: 'PGM P8 complete simulator', type: 'system', path: 'products/pgm-p8-golf-simulator/' },
    MNQHQJ002: { name: 'MNQHQJ002 automatic ball return', type: 'component', path: 'products/ball-return.html' },
    DGPT001: { name: 'DGPT001 8-way motion platform', type: 'component', path: 'products/motion-platform.html' },
    MNQKZT002: { name: 'MNQKZT002 mirror touch console', type: 'component', path: 'products/mirror-console.html' },
    MKPC001: { name: 'MKPC001 modular golf enclosure', type: 'component', path: 'products/quick-assembly-enclosure-mkpc001.html' },
    MKPC002: { name: 'MKPC002 integrated golf enclosure', type: 'component', path: 'products/quick-assembly-enclosure-mkpc002.html' },
    DJD039: { name: 'DJD039 stripe hitting mat', type: 'component', path: 'products/hitting-mats.html#djd039' },
    DJD036: { name: 'DJD036 long-grass tee-up mat', type: 'component', path: 'products/hitting-mats.html#djd036' },
    MNQ010: { name: 'MNQ010 double-layer impact screen', type: 'component', path: 'products/impact-screen.html' },
    OTHER: { name: 'Help me choose / other equipment', type: 'system', path: 'products/' }
  });
  const sources = Object.freeze({
    home: '', products: 'products/', solutions: 'solutions/', dealer: 'partners/golf-simulator-distributor/',
    commercial: 'solutions/commercial-golf-simulator/', guide: 'guides/golf-simulator-room-size/',
    installation: 'installation.html', about: 'about.html', projects: 'projects.html',
    quote: 'support/request-a-quote/', support: 'support/software-and-warranty/'
  });
  const aliases = Object.freeze({ 'pgm-p8': 'P8', 'p8-simulator': 'P8', 'motion-platform': 'DGPT001', 'ball-return': 'MNQHQJ002', 'mirror-console': 'MNQKZT002', 'quick-assembly-enclosure-mkpc001': 'MKPC001', 'quick-assembly-enclosure-mkpc002': 'MKPC002', 'impact-screen': 'MNQ010' });
  const types = Object.freeze({ system: 'Complete system', component: 'Individual component', installation: 'Room & installation planning', dealer: 'Dealer cooperation' });
  const own = (object, key) => Object.hasOwn(object, key);
  function resolve(search = '') {
    const query = new URLSearchParams(search);
    const model = query.get('model');
    const raw = query.get('product');
    const productId = own(products, model) ? model : own(products, raw) ? raw : own(aliases, raw) ? aliases[raw] : null;
    const source = query.get('from');
    const type = query.get('type');
    return { productId, sourceId: own(sources, source) || own(products, source) ? source : null, inquiryType: own(types, type) ? type : null };
  }
  function attach(form) {
    const product = form.querySelector('[name="product_id"]');
    const type = form.querySelector('[name="inquiry_type"]');
    if (!product || !type) return null;
    const requested = resolve(location.search);
    const defaultProduct = own(products, form.dataset.product) ? form.dataset.product : 'P8';
    const defaultType = own(types, form.dataset.inquiryType) ? form.dataset.inquiryType : products[defaultProduct].type;
    product.value = requested.productId || defaultProduct;
    type.value = requested.inquiryType || (requested.productId ? products[product.value].type : defaultType);
    const sourceId = requested.sourceId || form.dataset.sourceId || 'quote';
    const sourcePath = own(sources, sourceId) ? sources[sourceId] : own(products, sourceId) ? products[sourceId].path : sources.quote;
    const summary = form.querySelector('[data-inquiry-summary]');
    const update = () => { if (summary) summary.textContent = `${products[product.value].name} · ${types[type.value]}`; };
    product.addEventListener('change', () => {
      if (!['dealer', 'installation'].includes(type.value)) type.value = products[product.value].type;
      update();
    });
    type.addEventListener('change', update);
    form.addEventListener('reset', () => queueMicrotask(() => {
      product.value = requested.productId || defaultProduct;
      type.value = requested.inquiryType || (requested.productId ? products[product.value].type : defaultType);
      update();
    }));
    update();
    return Object.freeze({ read() {
      const productId = own(products, product.value) ? product.value : defaultProduct;
      const inquiryType = own(types, type.value) ? type.value : defaultType;
      return { productId, inquiryType, productName: products[productId].name, inquiryLabel: types[inquiryType], sourceId, sourcePath };
    } });
  }
  window.pgmInquiry = Object.freeze({ products, productIds: Object.freeze(Object.keys(products)), sourceIds: Object.freeze([...Object.keys(sources), ...Object.keys(products)]), types, resolve, attach });
})();

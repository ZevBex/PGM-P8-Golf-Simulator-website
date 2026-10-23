(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  if (!$('#inquiry-form')) return;
  const config = window.SITE_CONFIG || {};
  const productInterest = $('#product-interest');
  const projectType = $('#purpose');
  const layoutField = $('#selected-layout');
  const messageField = $('#message');
  const syncProductInterest = () => {
    const p8Package = ['Complete P8 system', 'P8 Standard package', 'P8 Flagship package', 'P8 Premium package'].includes(productInterest.value);
    const spaceProduct = p8Package || ['Complete P8 system', 'Quick-assembly enclosure', 'Golf space capsule'].includes(productInterest.value);
    layoutField.disabled = !p8Package;
    if (!spaceProduct && projectType.value === 'Home installation') projectType.value = 'Standalone component';
    if (spaceProduct && projectType.value === 'Standalone component') projectType.value = 'Home installation';
  };
  const modelField = $('#selected-model');
  const modelWrapper = $('#model-field');
  const modelOptions = {
    'Complete P8 system': ['P8'],
    'P8 Standard package': ['P8'],
    'P8 Flagship package': ['P8'],
    'P8 Premium package': ['P8'],
    'Double-layer impact screen': ['MNQ010'],
    'Automatic ball return system': ['MNQHQJ002'],
    '8-way motion platform': ['DGPT001'],
    'Mirror touch control console': ['MNQKZT002'],
    'Hitting mats': ['DJD039', 'DJD036', 'DJD055'],
    'Quick-assembly enclosure': ['MKPC001', 'MKPC002'],
    'Golf space capsule': ['MTKC001', 'MTKC002'],
    'Custom impact padding': ['MNQ014']
  };
  const setModel = value => { modelField.value = value; modelField.disabled = !value; modelWrapper.hidden = !value; };
  const requested = new URLSearchParams(window.location.search);
  const requestedProduct = requested.get('product');
  if ([...productInterest.options].some(option => option.value === requestedProduct)) {
    productInterest.value = requestedProduct;
    const requestedModel = requested.get('model');
    if ((modelOptions[requestedProduct] || []).includes(requestedModel)) setModel(requestedModel);
    messageField.placeholder = `Tell us about your ${requestedProduct.toLowerCase()} enquiry, quantity, existing setup and timing.`;
  }
  const requestedPurpose = requested.get('purpose');
  if ([...projectType.options].some(option => option.value === requestedPurpose)) projectType.value = requestedPurpose;
  const requestedLayout = requested.get('layout');
  if (['Single screen', 'Curved screen'].includes(requestedLayout)) layoutField.value = requestedLayout;
  productInterest.addEventListener('change', () => { setModel(''); syncProductInterest(); });
  document.querySelectorAll('[data-component]').forEach(link => link.addEventListener('click', () => {
    setModel('');
    productInterest.value = link.dataset.component;
    projectType.value = 'Standalone component';
    messageField.placeholder = `Tell us about your ${link.dataset.component.toLowerCase()} enquiry, existing setup and timing.`;
    syncProductInterest();
  }));
  syncProductInterest();

  const email = String(config.contactEmail || '').trim();
  const token = String(config.formSubmitToken || '').trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validToken = /^[a-zA-Z0-9-]{16,128}$/.test(token);
  const recipient = validToken ? token : validEmail ? email : '';
  const form = $('#inquiry-form');
  const send = $('#send-inquiry');
  const status = $('#form-status');
  if (validEmail) { $('#contact-email').href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('PGM P8 simulator enquiry')}`; $('#contact-email').hidden = false; }
  if (recipient) {
    // Native POST keeps FormSubmit's own CAPTCHA and real response page.
    // No success state is shown locally before the service accepts the request.
    form.action = `https://formsubmit.co/${encodeURIComponent(recipient)}`;
    send.disabled = false;
    status.textContent = 'Submit your enquiry via FormSubmit. You may be asked to complete a security check on the next page.';
  }
  for (const id of ['name','location','message']) { const field = $(`#${id}`); field.addEventListener('input', () => { field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.'); }); }
  form.addEventListener('submit', event => {
    if (!recipient) { event.preventDefault(); status.textContent = 'Online enquiries are not available yet. Nothing has been sent.'; return; }
    let valid = true;
    for (const id of ['name','location','message']) { const field = $(`#${id}`); field.value = field.value.trim(); field.setCustomValidity(field.value ? '' : 'Please complete this field.'); if (!field.value) valid = false; }
    if (!valid || !form.reportValidity()) { event.preventDefault(); form.reportValidity(); return; }
    if ($('#website').value) { event.preventDefault(); status.textContent = 'Unable to send this enquiry. Please contact the team directly.'; return; }
    send.disabled = true;
    send.textContent = 'Opening secure submission…';
    status.textContent = 'Please complete any security check on the next page. Your enquiry is not confirmed until the submission service responds.';
  });
  window.addEventListener('pageshow', () => { send.disabled = !recipient; send.textContent = 'Send enquiry'; });
})();

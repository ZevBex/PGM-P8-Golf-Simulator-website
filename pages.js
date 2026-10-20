(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  document.querySelectorAll('[data-company]').forEach(element => {
    const value = String(config[element.dataset.company] || '').trim();
    element.textContent = value;
    element.hidden = !value;
  });
  document.querySelectorAll('[data-company-row]').forEach(row => {
    row.hidden = !String(config[row.dataset.companyRow] || '').trim();
  });
  const profile = document.querySelector('#company-profile');
  const unavailable = document.querySelector('#company-unavailable');
  if (profile && unavailable) {
    const hasName = Boolean(String(config.companyName || '').trim());
    profile.hidden = !hasName;
    unavailable.hidden = hasName;
  }
  const contactNote = document.querySelector('[data-contact-note]');
  if (contactNote) {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(config.contactEmail || '').trim());
    const token = /^[a-zA-Z0-9-]{16,128}$/.test(String(config.formSubmitToken || '').trim());
    const rawPhone = String(config.whatsappNumber || '').trim();
    const digits = rawPhone.replace(/[+\s().-]/g, '');
    const phone = /^[1-9]\d{6,14}$/.test(digits) && !/[^+\d\s().-]/.test(rawPhone);
    if (email || token || phone) contactNote.textContent = 'Use the enquiry form or an available contact channel to discuss your products, room and configuration.';
  }
  const unitButtons = document.querySelectorAll('[data-reference-unit]');
  unitButtons.forEach(button => button.addEventListener('click', () => {
    const unit = button.dataset.referenceUnit;
    unitButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-metres]').forEach(cell => {
      const metres = Number(cell.dataset.metres);
      cell.textContent = (unit === 'ft' ? metres / 0.3048 : metres).toFixed(1);
    });
    document.querySelectorAll('[data-reference-label]').forEach(label => { label.textContent = `(${unit})`; });
  }));
})();

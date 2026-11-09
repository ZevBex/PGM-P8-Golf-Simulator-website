(() => {
  'use strict';
  const menu = document.getElementById('contentNav');
  const toggle = document.getElementById('contentMenu');
  const closeMenu = () => { menu?.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => { const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('open')) { closeMenu(); toggle.focus(); } });
  const form = document.getElementById('contentInquiry');
  if (!form) return;
  const status = document.getElementById('inquiryStatus');
  const submit = form.querySelector('[type="submit"]');
  const production = location.protocol === 'https:' && ['mypgmgolf.com', 'www.mypgmgolf.com'].includes(location.hostname) && !window.__PGM_LOCAL_PREVIEW__;
  let widget, loading, busy = false;
  function message(text, error = false) { status.textContent = text; status.classList.toggle('error', error); }
  function loadVerification() {
    if (!production) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const render = () => {
        try {
          widget = window.turnstile.render('#inquiryVerification', { sitekey: '0x4AAAAAAFxdTlGHk155eZ73', action: 'inquiry', theme: 'dark', size: 'flexible' });
          resolve();
        } catch (error) { loading = null; reject(error); }
      };
      if (window.turnstile) return render();
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true;
      const timer = setTimeout(() => { script.remove(); loading = null; reject(new Error('Verification could not load. Please try again.')); }, 15000);
      script.onload = () => { clearTimeout(timer); render(); };
      script.onerror = () => { clearTimeout(timer); script.remove(); loading = null; reject(new Error('Verification could not load. Please check your connection.')); };
      document.head.append(script);
    });
    return loading;
  }
  if (production) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadVerification().catch(error => message(error.message, true)); }
    }, { rootMargin: '150px' });
    observer.observe(form);
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    if (!production) return message('Local preview only — no inquiry was sent.');
    busy = true; submit.disabled = true; message('');
    const original = submit.textContent; submit.textContent = 'SENDING…';
    const controller = new AbortController();
    let timer;
    try {
      await loadVerification();
      const token = window.turnstile.getResponse(widget);
      if (!token) throw new Error('Please complete the verification above the send button.');
      const values = new FormData(form);
      const country = String(values.get('country') || '').trim();
      const company = String(values.get('companyInfo') || '').trim();
      const payload = {
        kind: 'inquiry', token,
        name: String(values.get('name') || '').trim(), email: String(values.get('email') || '').trim(),
        spaceType: form.dataset.space, interest: form.dataset.interest,
        message: `Country / market: ${country}\nCompany / website: ${company || 'Not provided'}\n\n${String(values.get('message') || '').trim()}`,
        inquiry_source: form.dataset.source, source_page: document.title,
        source_button: original.trim(), source_url: location.origin + location.pathname
      };
      timer = setTimeout(() => controller.abort(), 30000);
      const response = await fetch('https://catalog-api.mypgmgolf.com/', {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: controller.signal
      });
      let result;
      try { result = await response.json(); } catch { throw new Error('The service returned an unexpected response.'); }
      if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('The inquiry could not be confirmed. Please email tracy@pgmgolf.com for help.');
      window.pgmAnalytics?.event('generate_lead', { form_id: form.dataset.formId });
      form.reset(); message('Thank you — your inquiry has been received. The PGM team will reply by email.');
    } catch (error) {
      message(error.name === 'AbortError' || error instanceof TypeError
        ? 'Delivery could not be confirmed. Please contact tracy@pgmgolf.com before submitting again.' : error.message, true);
    } finally {
      clearTimeout(timer); busy = false; submit.disabled = false; submit.textContent = original;
      if (widget !== undefined) { try { window.turnstile.reset(widget); } catch { /* A later attempt can reload verification. */ } }
    }
  });
})();

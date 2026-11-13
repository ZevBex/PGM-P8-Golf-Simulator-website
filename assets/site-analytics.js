(() => {
  'use strict';
  const id = 'G-T2VTP5TWQL';
  const key = 'pgm-analytics-choice-v1';
  const production = location.protocol === 'https:' && ['mypgmgolf.com', 'www.mypgmgolf.com'].includes(location.hostname);
  const panel = document.getElementById('analyticsChoice');
  const settings = document.getElementById('analyticsSettings');
  if (!panel || !settings) return;
  let allowed = false;
  let loaded = false;
  let returnFocus = null;
  const campaignKey = 'pgm-campaign-v1';
  // Fixed marketing labels only: never retain arbitrary query values or personal data.
  const campaignValues = {
    utm_source: ['whatsapp', 'email-sig', 'cold-email', 'catalog-pdf', 'alibaba', 'tradeshow', 'parcel-insert', 'linkedin', 'youtube', 'reddit', 'facebook', 'instagram', 'google', 'bing', 'chatgpt.com', 'perplexity.ai', 'claude.ai', 'copilot.microsoft.com', 'gemini.google.com'],
    utm_medium: ['email', 'referral', 'social', 'video', 'cpc', 'qr', 'partner'],
    utm_campaign: ['always-on', 'dealer-outreach', 'p8-launch', 'commercial-project', 'room-planning']
  };
  const campaignFields = { utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name' };
  const aiSources = new Set(['chatgpt.com', 'perplexity.ai', 'claude.ai', 'copilot.microsoft.com', 'gemini.google.com']);
  const aiAliases = { chatgpt: 'chatgpt.com', perplexity: 'perplexity.ai', claude: 'claude.ai' };
  function cleanCampaign(input) {
    input = { ...input, utm_source: Object.hasOwn(aiAliases, input.utm_source) ? aiAliases[input.utm_source] : input.utm_source };
    if (aiSources.has(input.utm_source) && !input.utm_medium) input.utm_medium = 'referral';
    const result = {};
    for (const [field, values] of Object.entries(campaignValues)) {
      const value = input[field];
      if (values.includes(value)) result[campaignFields[field]] = value;
    }
    return result.campaign_source && result.campaign_medium ? result : null;
  }
  const query = new URLSearchParams(location.search);
  let internalTest = false;
  try {
    if (query.get('pgm_test') === '1') sessionStorage.setItem('pgm-internal-test', '1');
    if (query.get('pgm_test') === '0') sessionStorage.removeItem('pgm-internal-test');
    internalTest = sessionStorage.getItem('pgm-internal-test') === '1';
  } catch { internalTest = query.get('pgm_test') === '1'; }
  if (internalTest) document.documentElement.dataset.pgmInternalTest = 'true';
  const landingCampaign = cleanCampaign(Object.fromEntries(Object.keys(campaignValues).map(field => [field, query.get(field)])));
  function readCampaign() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(campaignKey));
      if (!saved || saved.expires <= Date.now()) { sessionStorage.removeItem(campaignKey); return null; }
      return cleanCampaign(Object.fromEntries(Object.entries(campaignFields).map(([input, output]) => [input, saved.values?.[output]])));
    } catch { return null; }
  }
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const consent = state => ({ analytics_storage: state, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  gtag('consent', 'default', consent('denied'));

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved && saved.expires > Date.now() && ['accepted', 'declined'].includes(saved.state) ? saved.state : null;
    } catch { return null; }
  }
  function clearAnalyticsCookies() {
    const host = location.hostname;
    const domains = new Set(['', host, '.' + host, 'mypgmgolf.com', '.mypgmgolf.com']);
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
      for (const domain of domains) document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
    }
  }
  function apply(state) {
    allowed = state === 'accepted' && production && !window.__PGM_LOCAL_PREVIEW__ && !internalTest;
    window['ga-disable-' + id] = !allowed;
    gtag('consent', 'update', consent(allowed ? 'granted' : 'denied'));
    if (!allowed) {
      clearAnalyticsCookies();
      try { sessionStorage.removeItem(campaignKey); } catch { /* Storage unavailable. */ }
      return;
    }
    if (loaded) return;
    loaded = true;
    gtag('js', new Date());
    let referrer = '';
    try { const url = new URL(document.referrer); referrer = url.origin + (url.origin === location.origin ? url.pathname : '/'); } catch { /* No referrer. */ }
    const campaign = landingCampaign || readCampaign();
    if (landingCampaign) {
      try { sessionStorage.setItem(campaignKey, JSON.stringify({ values: campaign, expires: Date.now() + 30 * 60 * 1000 })); } catch { /* Current-page attribution still works. */ }
    }
    gtag('config', id, {
      page_location: location.origin + location.pathname,
      page_referrer: referrer,
      page_title: document.querySelector('meta[property="og:title"]')?.content || document.title,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ...(campaign || {})
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function hide() {
    panel.hidden = true;
    if (panel.contains(document.activeElement)) (returnFocus?.isConnected ? returnFocus : settings).focus({ preventScroll: true });
  }
  function save(state) {
    try { localStorage.setItem(key, JSON.stringify({ state, expires: Date.now() + 180 * 86400000 })); } catch { /* Current-page choice still works. */ }
    apply(state);
    hide();
  }
  settings.addEventListener('click', () => {
    returnFocus = settings;
    panel.hidden = false;
    panel.querySelector('h2').focus({ preventScroll: true });
  });
  panel.querySelector('[data-analytics-accept]').addEventListener('click', () => save('accepted'));
  panel.querySelector('[data-analytics-decline]').addEventListener('click', () => save('declined'));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && readChoice()) { event.preventDefault(); hide(); }
  });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    const state = readChoice();
    apply(state);
    panel.hidden = !!state;
  });

  // Only fixed labels are allowed. Never pass form values, email addresses or link URLs.
  const labels = {
    generate_lead: { form_id: ['demo', 'contact', 'partner', 'product', 'commercial', 'guide', 'quote'], product_id: window.pgmInquiry?.productIds || [], inquiry_type: ['system', 'component', 'installation', 'dealer'], source_page_id: window.pgmInquiry?.sourceIds || [] },
    catalog_request_success: {},
    contact_click: { method: ['whatsapp', 'email', 'phone'] }
  };
  window.pgmAnalytics = Object.freeze({
    event(name, params = {}) {
      if (!allowed || !Object.hasOwn(labels, name)) return;
      const clean = {};
      for (const [field, values] of Object.entries(labels[name])) if (values.includes(params[field])) clean[field] = params[field];
      gtag('event', name, clean);
    }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    let method;
    try {
      const url = new URL(link.href);
      if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) method = 'whatsapp';
      else if (url.protocol === 'mailto:') method = 'email';
      else if (url.protocol === 'tel:') method = 'phone';
    } catch { return; }
    if (method) window.pgmAnalytics.event('contact_click', { method });
  });
  const saved = readChoice();
  apply(saved);
  panel.hidden = !!saved;
})();

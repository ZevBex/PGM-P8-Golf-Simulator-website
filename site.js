(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (menu && navigation) {
    const close = () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { close(); menu.focus(); }
    });
  }

  // Explicit keys keep the platform video correct when it appears on its own page.
  const demoVideos = {
    swing: 'https://gv.videocdn.alibaba.com/icbu_vod_video/video_target/gv9d-85fcac6b-a187c84c-9c2cf7f0-36a6/trans/aidc/w2rdf1-h264-hd.mp4',
    platform: 'https://gv.videocdn.alibaba.com/icbu_vod_video/video_target/gv9e-e3c4cf64-a1ac22a4-9e15fea5-4cba/trans/aidc/ffjvve-h264-hd.mp4'
  };
  document.querySelectorAll('[data-video]').forEach(shell => {
    const video = shell.querySelector('video');
    const button = shell.querySelector('.video-play');
    const errorMessage = shell.parentElement.querySelector('.video-error');
    const source = demoVideos[shell.dataset.video];
    if (!video || !button || !source) return;
    const showError = () => {
      if (errorMessage) errorMessage.hidden = false;
      button.hidden = false;
      button.disabled = false;
      video.controls = false;
    };
    button.addEventListener('click', async () => {
      document.querySelectorAll('[data-video] video').forEach(other => { if (other !== video) other.pause(); });
      button.disabled = true;
      if (errorMessage) errorMessage.hidden = true;
      video.src = source;
      video.controls = true;
      try {
        await video.play();
        button.hidden = true;
      } catch {
        video.removeAttribute('src');
        video.load();
        showError();
      }
    });
    video.addEventListener('error', () => { if (video.currentSrc) showError(); });
  });

  const rawPhone = String(config.whatsappNumber || '').trim();
  const digits = rawPhone.replace(/[+\s().-]/g, '');
  const validPhone = /^[1-9]\d{6,14}$/.test(digits) && !/[^+\d\s().-]/.test(rawPhone);
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (validPhone) {
      const product = link.dataset.product;
      const model = link.dataset.model;
      const message = product
        ? `Hello, I am interested in ${product}${model ? ` (${model})` : ''}. Could you send me product details and a quotation?`
        : config.whatsappMessage || 'Hello, I am interested in the PGM P8 simulator.';
      link.href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      link.setAttribute('aria-label', 'Chat with us on WhatsApp (opens a new tab)');
      link.querySelector('.availability')?.remove();
    } else {
      link.addEventListener('click', event => {
        event.preventDefault();
        const status = document.querySelector('#contact-channel-status') || document.querySelector('#form-status');
        if (status) { status.hidden = false; status.textContent = 'WhatsApp contact is not available yet. Please check back soon.'; }
      });
    }
  });
})();

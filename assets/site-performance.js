(() => {
  'use strict';
  const hero = document.querySelector('#home');
  const poster = hero?.querySelector('.hero-poster img');
  const video = hero?.querySelector('.hero-video');
  const desktop = matchMedia('(min-width: 761px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let heroVisible = true;
  let ready = false;
  function canAutoplay() {
    return desktop.matches && !reducedMotion.matches && !navigator.connection?.saveData && !document.hidden && heroVisible;
  }
  function updatePlayback() {
    if (!video) return;
    if (ready && canAutoplay()) {
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.muted = true;
      video.play().catch(() => video.classList.remove('is-playing'));
    } else {
      video.pause();
      video.classList.remove('is-playing');
      if (!desktop.matches && video.hasAttribute('src')) {
        video.removeAttribute('src'); video.load();
      }
    }
  }
  async function prepareHero() {
    try { await poster.decode(); } catch { /* Keep the rest of the page usable if an image fails. */ }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => { ready = true; updatePlayback(); }, 1200);
    }));
  }
  if (video && poster) {
    video.addEventListener('playing', () => { if (canAutoplay()) video.classList.add('is-playing'); });
    video.addEventListener('error', () => video.classList.remove('is-playing'));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting; updatePlayback();
      }, { threshold: 0.05 }).observe(hero);
    }
    desktop.addEventListener('change', updatePlayback);
    reducedMotion.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    prepareHero();
  }
  const fullVideo = document.querySelector('#videoModal video');
  const status = document.querySelector('#videoLoadStatus');
  document.querySelector('#watchVideo')?.addEventListener('click', () => {
    if (status) status.hidden = true;
    fullVideo?.play().catch(() => { /* Native play controls remain available. */ });
  });
  fullVideo?.addEventListener('error', () => { if (status) status.hidden = false; });
  const deferredPosters = [...document.querySelectorAll('video[data-poster]')];
  function showPoster(player) {
    if (player.dataset.poster) { player.poster = player.dataset.poster; delete player.dataset.poster; }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { showPoster(entry.target); observer.unobserve(entry.target); }
    }, { rootMargin: '400px' });
    deferredPosters.forEach(player => observer.observe(player));
  } else deferredPosters.forEach(showPoster);
  document.querySelector('#watchVideo')?.addEventListener('click', () => { if (fullVideo) showPoster(fullVideo); });
})();

(() => {
  'use strict';
  const hero = document.querySelector('#home');
  const poster = hero?.querySelector('.hero-poster img');
  const video = hero?.querySelector('.hero-video');
  const toggle = hero?.querySelector('#heroPlaybackToggle');
  const playbackStatus = hero?.querySelector('#heroPlaybackStatus');
  const desktop = matchMedia('(min-width: 761px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let heroVisible = true;
  let ready = false;
  let userPlayback = null;
  let starting = false;
  function wantsPlayback() {
    return userPlayback ?? (desktop.matches && !reducedMotion.matches && !navigator.connection?.saveData);
  }
  function canPlay() {
    return wantsPlayback() && !document.hidden && heroVisible;
  }
  function syncToggle() {
    if (!toggle) return;
    const playing = !video.paused;
    toggle.textContent = playing ? 'Ⅱ PAUSE BACKGROUND' : '▶ PLAY BACKGROUND';
    toggle.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    toggle.title = !playing && userPlayback === null && reducedMotion.matches
      ? 'Reduced motion is enabled. Select to play the background video.' : '';
  }
  function updatePlayback() {
    if (!video) return;
    if (ready && canPlay()) {
      if (starting || !video.paused) return;
      if (playbackStatus) playbackStatus.textContent = '';
      if (!video.getAttribute('src')) {
        video.src = video.dataset.src;
        video.load();
      }
      video.muted = true;
      starting = true;
      video.play().catch(error => {
        video.classList.remove('is-playing');
        if (canPlay() && error.name !== 'AbortError' && playbackStatus) {
          playbackStatus.textContent = error.name === 'NotAllowedError'
            ? 'Select Play background to start the video.'
            : 'Background video could not load. Select Play background to retry.';
        }
      }).finally(() => { starting = false; syncToggle(); });
    } else {
      video.pause();
      video.classList.remove('is-playing');
      if (!desktop.matches && userPlayback !== true && video.hasAttribute('src')) {
        video.removeAttribute('src'); video.load();
      }
    }
    syncToggle();
  }
  async function prepareHero() {
    try { await poster.decode(); } catch { /* Keep the rest of the page usable if an image fails. */ }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => { ready = true; updatePlayback(); }, 1200);
    }));
  }
  if (video && poster) {
    toggle?.removeAttribute('hidden');
    toggle?.addEventListener('click', () => {
      userPlayback = video.paused;
      ready = true;
      if (userPlayback && video.error) video.load();
      updatePlayback();
    });
    video.addEventListener('playing', () => {
      if (canPlay()) video.classList.add('is-playing');
      else video.pause();
      syncToggle();
    });
    video.addEventListener('pause', () => { video.classList.remove('is-playing'); syncToggle(); });
    video.addEventListener('error', () => {
      video.classList.remove('is-playing');
      if (playbackStatus) playbackStatus.textContent = 'Background video could not load. Select Play background to retry.';
      syncToggle();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting; updatePlayback();
      }, { threshold: 0.05 }).observe(hero);
    }
    desktop.addEventListener('change', updatePlayback);
    reducedMotion.addEventListener('change', updatePlayback);
    navigator.connection?.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    window.addEventListener('pageshow', updatePlayback);
    syncToggle();
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

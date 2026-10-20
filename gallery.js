(() => {
  'use strict';
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;
  const items = [...gallery.querySelectorAll('[data-gallery-src]')];
  const mainLink = gallery.querySelector('[data-gallery-enlarge]');
  const mainImage = mainLink.querySelector('img');
  const caption = gallery.querySelector('[data-gallery-caption]');
  const count = gallery.querySelector('[data-gallery-count]');
  const modal = document.querySelector('#product-lightbox');
  const enlargedImage = modal.querySelector('[data-lightbox-image]');
  const video = gallery.querySelector('[data-gallery-video]');
  let selected = 0;
  const applyImage = (image, item) => {
    image.src = item.dataset.gallerySrc;
    image.alt = item.dataset.galleryAlt;
    image.width = Number(item.dataset.galleryWidth);
    image.height = Number(item.dataset.galleryHeight);
  };
  const select = index => {
    selected = (index + items.length) % items.length;
    const item = items[selected];
    const isVideo = Boolean(item.dataset.galleryVideoSrc);
    if (video) {
      video.pause();
      video.hidden = !isVideo;
      mainLink.hidden = isVideo;
      if (isVideo && !video.getAttribute('src')) video.src = item.dataset.galleryVideoSrc;
    }
    applyImage(mainImage, item);
    mainLink.href = item.dataset.gallerySrc;
    caption.textContent = item.dataset.galleryCaption;
    count.textContent = `${selected + 1} / ${items.length}`;
    items.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
    applyImage(enlargedImage, item);
    modal.querySelector('[data-lightbox-caption]').textContent = `${item.dataset.galleryCaption} · ${selected + 1} / ${items.length}`;
  };
  items.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      select(event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : selected + (event.key === 'ArrowRight' ? 1 : -1));
      items[selected].focus();
    });
  });
  mainLink.addEventListener('click', event => {
    if (typeof modal.showModal !== 'function') return; // Keep the full-image link as a fallback.
    event.preventDefault();
    select(selected);
    modal.showModal();
  });
  const movePhoto = direction => {
    let next = (selected + direction + items.length) % items.length;
    while (items[next].dataset.galleryVideoSrc) next = (next + direction + items.length) % items.length;
    select(next);
  };
  modal.querySelector('[data-lightbox-previous]').addEventListener('click', () => movePhoto(-1));
  modal.querySelector('[data-lightbox-next]').addEventListener('click', () => movePhoto(1));
  modal.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    movePhoto(event.key === 'ArrowRight' ? 1 : -1);
  });
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => mainLink.focus());
})();

(() => {
  'use strict';
  const buttons = [...document.querySelectorAll('[data-play-preview]')];
  const dialog = document.querySelector('#play-lightbox');
  if (!buttons.length || !dialog) return;
  const image = dialog.querySelector('[data-play-preview-image]');
  let selected = 0;
  let opener;
  let previousOverflow;
  function select(index) {
    selected = (index + buttons.length) % buttons.length;
    const button = buttons[selected];
    const card = button.closest('.play-image-card');
    const thumbnail = button.querySelector('img');
    image.src = button.dataset.playPreview;
    image.alt = thumbnail.alt;
    image.width = thumbnail.width;
    image.height = thumbnail.height;
    dialog.querySelector('#play-preview-title').textContent = card.querySelector('.eyebrow').textContent.split(' / ')[1];
    dialog.querySelector('[data-play-preview-description]').textContent = card.querySelector('.play-card-copy h3').textContent + ' ' + card.querySelector('.play-card-copy > p:last-child').textContent;
    dialog.querySelector('[data-play-count]').textContent = `${selected + 1} / ${buttons.length}`;
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    select(index);
    opener = button;
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('[data-play-previous]').addEventListener('click', () => select(selected - 1));
  dialog.querySelector('[data-play-next]').addEventListener('click', () => select(selected + 1));
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    select(selected + (event.key === 'ArrowRight' ? 1 : -1));
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus();
  });
})();

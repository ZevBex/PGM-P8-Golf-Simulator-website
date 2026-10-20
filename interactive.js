(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading,.play-image-card,.p8-package-card,.detector-benefits article,.mcu-visual,.component-card,.catalog-card').forEach(element => {
      // Visible content stays visible; reveal only content below the viewport.
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-pending');
      observer.observe(element);
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending'));
    });
  }
  document.querySelectorAll('[data-package-finder]').forEach(finder => {
    const inputs = [...finder.querySelectorAll('input')];
    const result = finder.querySelector('[data-package-result]');
    const detail = finder.querySelector('[data-package-detail]');
    const quote = finder.querySelector('[data-package-quote]');
    function update() {
      const motion = finder.querySelector('[name="motion"]').checked;
      const karaoke = finder.querySelector('[name="karaoke"]').checked;
      const fourK = finder.querySelector('[name="projection"][value="4K"]').checked;
      const name = motion || karaoke ? 'Premium' : fourK ? 'Flagship' : 'Standard';
      result.textContent = `Your package match: P8 ${name}`;
      detail.textContent = name === 'Premium'
        ? 'Includes 4K laser projection, the 8-way motion platform and a home karaoke package.'
        : name === 'Flagship'
          ? '4K laser projection with a top-specification simulator computer.'
          : '2K laser projection with a high-specification simulator computer.';
      quote.href = './contact.html?' + new URLSearchParams({ product: `P8 ${name} package`, model: 'P8' }) + '#contact';
      quote.textContent = `Request a ${name} quote`;
      document.querySelectorAll('.p8-package-card').forEach(card => {
        card.classList.toggle('package-match', card.querySelector('h3').textContent === name);
      });
    }
    inputs.forEach(input => input.addEventListener('change', update));
    update();
    finder.hidden = false;
  });
})();

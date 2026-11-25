(() => {
  'use strict';

  const form = document.getElementById('room-size-form');
  const inquiry = document.getElementById('inquiryMessage');
  const addToInquiry = document.getElementById('room-size-add-to-inquiry');
  const feedback = document.getElementById('room-size-feedback');
  const dimensions = ['depth', 'width', 'height'];
  const metresPerFoot = 0.3048;
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  // Single-screen layouts from the PGM catalog, in clear depth, width and height.
  const references = [
    { output: document.getElementById('room-size-standard'), label: 'Standard single-screen layout', metres: [6, 4, 3] },
    { output: document.getElementById('room-size-minimum'), label: 'Minimum single-screen layout without ball return', metres: [4.5, 3, 2.6] }
  ];
  let measurementLine = '';
  let copiedLine = '';

  form.hidden = false;
  form.addEventListener('input', () => {
    references.forEach(({ output }) => { output.hidden = true; });
    feedback.hidden = true;
    addToInquiry.hidden = true;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const unit = form.elements.namedItem('unit').value;
    const fields = dimensions.map(dimension => form.elements.namedItem(dimension));
    const measurements = fields.map(field => field.valueAsNumber);
    const unitInMetres = unit === 'ft' ? metresPerFoot : 1;
    for (const { output, label, metres } of references) {
      const shortages = [];
      measurements.forEach((value, index) => {
        const deficit = metres[index] / unitInMetres - value;
        if (deficit <= 0) return;
        const amount = deficit < 0.01 ? 'less than 0.01' : number.format(deficit);
        shortages.push(`${dimensions[index]} short by ${amount} ${unit}`);
      });
      output.textContent = shortages.length
        ? `${label}: ${shortages.join(', ')}.`
        : `${label}: your room meets all three catalog dimensions.`;
      output.hidden = false;
    }

    const values = fields.map(field => field.value).join(' × ');
    measurementLine = `Clear room dimensions (depth × width × lowest height): ${values} ${unit}.`;
    feedback.hidden = true;
    addToInquiry.hidden = false;
  });

  addToInquiry.addEventListener('click', () => {
    const existing = inquiry.value;
    const lines = existing.split('\n');
    const measurementIndex = copiedLine ? lines.indexOf(copiedLine) : -1;
    if (measurementIndex >= 0) lines[measurementIndex] = measurementLine;
    const nextMessage = measurementIndex >= 0
      ? lines.join('\n')
      : [existing, measurementLine].filter(Boolean).join('\n\n');
    if (nextMessage.length > inquiry.maxLength) {
      feedback.textContent = 'There is not enough room in your inquiry message to add these dimensions. Shorten your message and try again.';
      feedback.hidden = false;
      return;
    }

    inquiry.value = nextMessage;
    copiedLine = measurementLine;
    feedback.textContent = 'Measurements added to your inquiry. Review them before sending.';
    feedback.hidden = false;
    inquiry.focus();
  });
})();

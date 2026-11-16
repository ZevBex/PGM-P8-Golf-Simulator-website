"""Render the complete, unaltered catalog project page for a source-linked preview."""
from pathlib import Path
import subprocess
import json
import hashlib
from PIL import Image

root = Path(__file__).resolve().parent.parent
file = root / 'scripts' / 'pgm-catalog-facts.json'
facts = json.loads(file.read_text(encoding='utf-8'))
source = root / facts['source']
assert hashlib.sha256(source.read_bytes()).hexdigest() == facts['sha256'], 'Catalog changed; recheck the page and prices before rebuilding'
temporary = root / 'tmp' / 'pdfs' / 'catalog-projects'
temporary.parent.mkdir(parents=True, exist_ok=True)
result = subprocess.run(['pdftoppm', '-f', str(facts['projectPdfPage']), '-l', str(facts['projectPdfPage']), '-scale-to-x', '900', '-scale-to-y', '-1', '-singlefile', '-png', str(source), str(temporary)], capture_output=True, check=True)
image = Image.open(temporary.with_suffix('.png')).convert('RGB')
target = root / facts['projectImage']
image.save(target, format='WEBP', quality=85, method=6)
facts['projectImageWidth'], facts['projectImageHeight'] = image.size
file.write_text(json.dumps(facts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Catalog page {facts["projectPdfPage"]}: {image.size}, {target.stat().st_size} bytes. Source preserved.')

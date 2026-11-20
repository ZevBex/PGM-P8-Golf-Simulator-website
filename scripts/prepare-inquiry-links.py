"""Tag links in the Pages artifact and embed their public labels in the form script."""
import hashlib
import html
import json
import re
import subprocess
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

SITE = "https://mypgmgolf.com"
QUOTE = "/support/request-a-quote/"
HREF = re.compile(r"""(?i)(\s+href\s*=\s*)(["'])(.*?)\2""", re.S)
CONTAINERS = {"header", "nav", "main", "section", "footer", "aside"}
SECTIONS = {"inquiry":"页面咨询区", "single-bay-plan":"单球位方案", "room-worksheet":"房间测量表",
            "packages":"配置方案", "quote-checklist":"报价清单", "venue-brief":"场地需求",
            "catalog-projects":"项目案例", "brief":"项目需求", "next":"下一步"}


class Links(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.offsets = [0] + [m.end() for m in re.finditer("\n", source)]
        self.items = []
        self.current = None
        self.stack = []
        self.forms = set()
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in CONTAINERS:
            self.stack.append((tag, attrs.get("id", "")))
        if tag == "form":
            self.forms.add(attrs.get("id", ""))
        if tag == "a" and "href" in attrs:
            line, col = self.getpos()
            self.current = dict(raw=self.get_starttag_text(), offset=self.offsets[line-1]+col,
                                href=attrs["href"], text=[], section=self.section())
            self.items.append(self.current)

    def handle_endtag(self, tag):
        if tag == "a":
            self.current = None
        if tag in CONTAINERS:
            for i in range(len(self.stack)-1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break

    def handle_data(self, data):
        if self.current is not None:
            self.current["text"].append(data)

    def section(self):
        if any(tag in {"header", "nav"} for tag, _ in self.stack):
            return "顶部导航"
        if any(tag == "footer" for tag, _ in self.stack):
            return "页脚"
        name = next((name for tag, name in reversed(self.stack) if tag == "section" and name), "")
        return SECTIONS.get(name, name or "页面主区域")


def prepare(root, tracked=False):
    if tracked:
        files = [root / name for name in subprocess.check_output(
            ["git", "-C", str(root), "ls-files", "*.html"], text=True).splitlines()]
    else:
        files = sorted(root.rglob("*.html"))
    pages = {}
    for file in files:
        path = "/" + file.relative_to(root).as_posix().removesuffix("index.html")
        source = file.read_text(encoding="utf-8")
        pages[path] = file, source, Links(source)
    entries = {}
    for path, (file, source, doc) in pages.items():
        edits = []
        counts = Counter()
        for item in doc.items:
            href = item["href"]
            target = urlsplit(urljoin(SITE+path, href))
            if target.scheme == "https" and target.netloc == "wa.me":
                params = dict(parse_qsl(target.query, keep_blank_values=True))
                if "text" not in params:
                    topic = "the PGM P8 simulator" if path == "/products/pgm-p8-golf-simulator/" else "this page"
                    params["text"] = f"Hi PGM, I have a question about {topic}: {SITE}{path}"
                    updated = urlunsplit(target._replace(query=urlencode(params)))
                    match = HREF.search(item["raw"])
                    replacement = match[1] + match[2] + html.escape(updated, quote=True) + match[2]
                    edits.append((item["offset"]+match.start(), item["offset"]+match.end(), replacement))
                continue
            if target.scheme != "https" or target.netloc != "mypgmgolf.com" or target.path not in pages:
                continue
            forms = pages[target.path][2].forms
            relative = urlsplit(href)
            is_quote = target.path == QUOTE and bool(relative.path) and "contentInquiry" in forms
            anchored = (target.fragment == "inquiry" and "contentInquiry" in forms or
                        target.fragment == "contact" and "inlineContactForm" in forms)
            if not (is_quote or anchored):
                continue
            params = [(k, v) for k, v in parse_qsl(relative.query, keep_blank_values=True) if k != "entry"]
            label = " ".join(" ".join(item["text"]).split()).strip(" →↗↓")
            if not label:
                raise ValueError(f"Missing inquiry link label on {path}: {href}")
            key = json.dumps([path, item["section"], label, target.path, params], ensure_ascii=False)
            counts[key] += 1
            entry = hashlib.sha256(f"{key}/{counts[key]}".encode()).hexdigest()[:16]
            section = item["section"]
            if counts[key] > 1:
                section += " · " + str(counts[key])
            if entry in entries:
                raise ValueError(f"Duplicate inquiry marker on {path}")
            entries[entry] = dict(path=path, section=section, button=label, destination=target.path)
            params.append(("entry", entry))
            url = urlunsplit(relative._replace(query=urlencode(params)))
            match = HREF.search(item["raw"])
            if not match:
                raise ValueError(f"Missing quoted href on {path}: {href}")
            new_href = match[1] + match[2] + html.escape(url, quote=True) + match[2]
            if not relative.path and not relative.netloc and "data-pgm-form-jump" not in item["raw"]:
                new_href += ' data-pgm-form-jump'
            edits.append((item["offset"]+match.start(), item["offset"]+match.end(), new_href))
        for start, end, replacement in reversed(edits):
            source = source[:start]+replacement+source[end:]
        if edits:
            file.write_text(source, encoding="utf-8")
    script = root / "assets/inquiry-context.js"
    source = script.read_text(encoding="utf-8")
    marker = r"(?m)^(  const entries = /\* published inquiry links \*/ )\{.*\};$"
    registry = json.dumps(entries, ensure_ascii=False, separators=(",", ":"))
    compiled, count = re.subn(marker, lambda m:m[1]+registry+";", source)
    if count != 1 or not entries:
        raise ValueError("Could not publish the inquiry entry registry")
    script.write_text(compiled, encoding="utf-8")
    version = hashlib.sha256(compiled.encode("utf-8")).hexdigest()[:12]
    for path, (file, _, doc) in pages.items():
        source = file.read_text(encoding="utf-8")
        updated, matches = re.subn(r"(assets/inquiry-context\.js)\?v=[\w-]+", r"\g<1>?v="+version, source)
        if doc.forms & {"contentInquiry", "inlineContactForm"} and not matches:
            raise ValueError(f"Missing inquiry script on {path}")
        if updated != source:
            file.write_text(updated, encoding="utf-8")
    print(f"Validated {len(entries)} inquiry links across {len(pages)} pages, script {version}")


if __name__ == "__main__":
    prepare(Path(sys.argv[1]), "--tracked" in sys.argv[2:])

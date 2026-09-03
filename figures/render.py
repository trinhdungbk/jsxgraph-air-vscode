"""Headless renderer that reproduces the AIR preview environment exactly.

The page assembled here is byte-for-byte the same shape as `buildStandaloneHtml()`
in JSXGraph-AIR-VSCode.html: same CDN build, same `#box` div, same `BOARD`
constant. Anything that renders here renders identically in the live preview.

Usage:
    uv run --with playwright python figures/render.py                 # all figures
    uv run --with playwright python figures/render.py 02-q2-triangle  # one figure
"""

import asyncio
import sys
from pathlib import Path

FIGURES = Path(__file__).parent
CDN = "https://cdn.jsdelivr.net/npm/jsxgraph/distrib"

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>JSXGraph Construction</title>
<script src="{cdn}/jsxgraphcore.js"></script>
<link rel="stylesheet" href="{cdn}/jsxgraph.css">
<style>
html, body{{ margin:0; padding:0; width:100%; height:100%; background:#fff; }}
#box, .jxgbox{{ border:none; box-shadow:none; }}
</style>
</head>
<body>
<div id="box" class="jxgbox" style="width:{w}px; height:{h}px; display:block; box-sizing:border-box;"></div>
<script>
const BOARD = 'box';
window.__err = null; window.__done = false;
try {{
{code}
window.__done = true;
}} catch (e) {{ window.__err = String(e && e.stack || e); }}
</script>
</body>
</html>"""


# Checks the model cannot see, run in the page once the board is built. Every one
# corresponds to a numbered item in PROMPT-RULES.md section E, and every one has
# caught a real defect: a clipped HTML label throws nothing and simply is not
# there, and a stray `point` renders a dot the model has no way to notice.
AUDIT = """(() => {
    const div = document.getElementById('box');
    const frame = div.getBoundingClientRect();
    const board = JXG.boards[Object.keys(JXG.boards)[0]];

    const points = Object.values(board.objects)
        .filter(o => o.elType === 'point' && o.evalVisProp('visible'))
        .map(o => o.name || o.id);

    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const clipped = [];
    const note = r => { x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
                        x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); };

    const svg = div.querySelector('svg');
    if (svg) {
        const b = svg.getBBox();
        note({ left: frame.left + b.x, top: frame.top + b.y,
               right: frame.left + b.x + b.width, bottom: frame.top + b.y + b.height });
    }
    div.querySelectorAll('.JXGtext').forEach(t => {
        const r = t.getBoundingClientRect();
        note(r);
        const over = Math.max(frame.left - r.left, r.right - frame.right,
                              frame.top - r.top, r.bottom - frame.bottom);
        if (over > 0.5) clipped.push(t.textContent.trim() + ' by ' + Math.round(over) + 'px');
    });

    return {
        points,
        clipped,
        fill: +Math.max((x1 - x0) / frame.width, (y1 - y0) / frame.height).toFixed(3)
    };
})()"""


def report(audit: dict) -> list[str]:
    out = []
    if audit["points"]:
        out.append(f"B1 static figure has visible point(s): {', '.join(audit['points'])}")
    for c in audit["clipped"]:
        out.append(f"E5 label clipped outside the board: {c}")
    if audit["fill"] < 0.80:
        out.append(f"D5 frame too loose: content fills {audit['fill']:.0%} of the long side")
    return out


def read_size(code: str) -> tuple[int, int]:
    """A figure declares its canvas as `// @size W H` on any line; default 640x480.

    WHY a comment and not a JS variable: the same construction.js must stay
    loadable by the AIR bridge, which evaluates it as-is and knows nothing
    about a size hint.
    """
    for line in code.splitlines():
        if line.strip().startswith("// @size"):
            parts = line.split()
            return int(parts[2]), int(parts[3])
    return 640, 480


def build(folder: Path) -> str:
    """Concatenate the shared notation lib with the figure body.

    The emitted construction.js is self-contained on purpose: the AIR bridge
    loads exactly one file, so a figure must be droppable into the live preview
    with no build step of its own.
    """
    lib = (FIGURES / "_lib.js").read_text()
    body = (folder / "figure.js").read_text()
    # Lib first: its helpers close over `board`, which the body creates. `var`
    # hoisting makes the reference legal, and nothing in the lib runs at load.
    code = (
        f"// GENERATED from figures/_lib.js + {folder.name}/figure.js -- edit figure.js\n"
        f"{lib}\n{body}"
    )
    (folder / "construction.js").write_text(code)
    return code


async def render_one(browser, folder: Path) -> str:
    code = build(folder)
    w, h = read_size(code)
    # WHY a fresh page per figure rather than set_content() on a shared one:
    # jsxgraphcore.js is only fetched once, so on every later set_content() the
    # cached script resolves instantly and the screenshot beats the first paint
    # -- the board is fully built in the DOM and the PNG still comes out blank.
    page = await browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
    try:
        await page.set_content(PAGE.format(cdn=CDN, code=code, w=w, h=h), wait_until="load")
        await page.wait_for_function("window.__done === true || window.__err !== null")
        await page.evaluate("document.fonts.ready")
        err = await page.evaluate("window.__err")
        warnings = [] if err else report(await page.evaluate(AUDIT))
        await page.locator("#box").screenshot(path=str(folder / "render.png"), scale="device")
    finally:
        await page.close()
    flag = "FAIL" if err else ("WARN" if warnings else "ok  ")
    lines = [f"{flag} {folder.name}  {w}x{h}"]
    if err:
        lines.append(f"     {err}")
    lines += [f"     {warn}" for warn in warnings]
    return "\n".join(lines)


async def main() -> None:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    folders = sorted(f for f in FIGURES.iterdir() if f.is_dir() and (f / "figure.js").exists())
    if only:
        folders = [f for f in folders if only in f.name]
    if not folders:
        print("no figures found")
        return

    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for folder in folders:
            print(await render_one(browser, folder))
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

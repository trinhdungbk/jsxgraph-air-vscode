"""Rewrite a figure's `boundingbox` and `@size` from what it actually draws.

WHY a tool and not a rule for the author: the frame has to be sized from the
LABELS, dimension apexes included, and none of that is in the geometry the
figure computes -- rule D5 is arithmetic over rendered HTML boxes. Doing it by
hand is what left three figures with a loose frame and four with a clipped
letter, and doing it by hand AGAIN is what a change of proportions forces.

The margin is half a letter height, which is what D5 asks for. `@size` is set
to the frame's aspect so unitX == unitY and nothing is wasted.

Usage: uv run --with playwright python figures/refit.py 16-q1 17-q2 ...
"""

import asyncio
import re
import sys
from pathlib import Path

from render import PAGE, CDN, build, read_size  # noqa: E402

FIGURES = Path(__file__).parent
MARGIN = 0.31          # half a letter height, in board units
LONG_SIDE = 700        # px, the long dimension of the rewritten canvas

# Content bounds in BOARD coordinates: the SVG's own bbox unioned with every
# label's client rect, mapped back through the board's transform. A label is
# absolutely-positioned HTML and is not in the SVG bbox, which is exactly why
# sizing the frame from the geometry clips letters.
BOUNDS = """(() => {
    const div = document.getElementById('box');
    const frame = div.getBoundingClientRect();
    const board = JXG.boards[Object.keys(JXG.boards)[0]];
    const toBoard = (px, py) => [
        (px - frame.left - board.origin.scrCoords[1]) / board.unitX,
        (frame.top + board.origin.scrCoords[2] - py) / board.unitY
    ];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const eat = (l, t, r, b) => {
        const [ax, ay] = toBoard(l, t), [bx, by] = toBoard(r, b);
        x0 = Math.min(x0, ax, bx); x1 = Math.max(x1, ax, bx);
        y0 = Math.min(y0, ay, by); y1 = Math.max(y1, ay, by);
    };
    const svg = div.querySelector('svg');
    if (svg) {
        const b = svg.getBBox();
        eat(frame.left + b.x, frame.top + b.y,
            frame.left + b.x + b.width, frame.top + b.y + b.height);
    }
    div.querySelectorAll('.JXGtext').forEach(t => {
        const r = t.getBoundingClientRect();
        eat(r.left, r.top, r.right, r.bottom);
    });
    return [x0, y0, x1, y1];
})()"""


async def refit(browser, folder: Path) -> str:
    code = build(folder)
    w, h = read_size(code)
    page = await browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
    try:
        await page.set_content(PAGE.format(cdn=CDN, code=code, w=w, h=h), wait_until="load")
        await page.wait_for_function("window.__done === true || window.__err !== null")
        await page.evaluate("document.fonts.ready")
        if await page.evaluate("window.__err"):
            return f"FAIL {folder.name}: {await page.evaluate('window.__err')}"
        x0, y0, x1, y1 = await page.evaluate(BOUNDS)
    finally:
        await page.close()

    x0, y0, x1, y1 = x0 - MARGIN, y0 - MARGIN, x1 + MARGIN, y1 + MARGIN
    span_x, span_y = x1 - x0, y1 - y0
    if span_x >= span_y:
        nw, nh = LONG_SIDE, round(LONG_SIDE * span_y / span_x)
    else:
        nh, nw = LONG_SIDE, round(LONG_SIDE * span_x / span_y)

    src = (folder / "figure.js").read_text()
    src = re.sub(r"// @size \d+ \d+", f"// @size {nw} {nh}", src, count=1)
    src = re.sub(
        r"boundingbox: \[[^\]]*\]",
        "boundingbox: [%.2f, %.2f, %.2f, %.2f]" % (x0, y1, x1, y0),
        src,
        count=1,
    )
    (folder / "figure.js").write_text(src)
    return f"ok   {folder.name}  {nw}x{nh}  [{x0:.2f}, {y1:.2f}, {x1:.2f}, {y0:.2f}]"


async def main() -> None:
    names = sys.argv[1:]
    folders = [
        f for f in sorted(FIGURES.iterdir())
        if f.is_dir() and (f / "figure.js").exists()
        and (not names or any(n in f.name for n in names))
    ]
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for folder in folders:
            print(await refit(browser, folder))
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

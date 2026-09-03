"""Stack each reference crop beside its render, at matched height.

Comparing by eye across two separate images does not work: the two are at
different scales, so proportion errors -- the ones that actually make a
reproduction look wrong -- stay invisible. Side by side at equal height they
are obvious.

Usage: uv run --with pillow python figures/compare.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

FIGURES = Path(__file__).parent
H = 380
PAD = 14


def fit(im: Image.Image) -> Image.Image:
    return im.resize((max(1, round(im.width * H / im.height)), H), Image.LANCZOS)


def main() -> None:
    # Folders are discovered rather than listed: the reference crop for
    # `NN-name` is `reference/name.png`, and a figure with no crop yet is
    # skipped instead of needing an entry removed from a table.
    for folder in sorted(f for f in FIGURES.iterdir() if (f / "render.png").exists()):
        rendered = folder / "render.png"
        original = FIGURES / "reference" / f"{folder.name.split('-', 1)[1]}.png"
        if not original.exists():
            continue
        left, right = fit(Image.open(original).convert("RGB")), fit(Image.open(rendered).convert("RGB"))
        sheet = Image.new("RGB", (left.width + right.width + PAD * 3, H + PAD * 2 + 22), "#dddddd")
        sheet.paste(left, (PAD, PAD + 22))
        sheet.paste(right, (PAD * 2 + left.width, PAD + 22))
        d = ImageDraw.Draw(sheet)
        d.text((PAD, 6), "ORIGINAL", fill="#000000")
        d.text((PAD * 2 + left.width, 6), "RENDER", fill="#000000")
        out = FIGURES / "out" / f"{folder.name}-compare.png"
        sheet.save(out)
        print(out.name)


if __name__ == "__main__":
    main()

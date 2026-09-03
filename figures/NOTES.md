# Build notes

例題34 (figures 01–06), 例題35 (07–12) and 例題36 (13–15): the question figures
and, where the page shows them, the 解説 figures, reproduced in JSXGraph against
the scanned page.

## Layout

```
figures/
  _lib.js                 JP notation primitives, prepended to every figure
  render.py               headless renderer, reproduces AIR's exact page
  compare.py              side-by-side sheets: original | render
  reference/*.png         per-figure crops of the source scan, 4x
  NN-name/figure.js       the figure (edit this)
  NN-name/construction.js GENERATED = _lib.js + figure.js, self-contained
  NN-name/render.png      the render
  out/*-compare.png       comparison sheets
```

```bash
uv run --with playwright python figures/render.py            # all
uv run --with playwright python figures/render.py 02-q2      # one
uv run --with pillow     python figures/compare.py
```

`render.py` also audits each figure in the page and prints `WARN` for a visible
`point`, a clipped label, or a frame with more than 20% slack — see
PROMPT-RULES.md section E. `compare.py` discovers folders and pairs `NN-name`
with `reference/name.png`, skipping any figure whose crop is missing.

`construction.js` is generated but committed on purpose: the AIR bridge loads
exactly one file, so each figure must be droppable into the live preview with
no build step. To preview one, `cp figures/NN-name/construction.js construction.js`.

## 例題34 — what actually went wrong

### 1. Every render after the first came out blank

`wait_until="networkidle"` on a shared page. `jsxgraphcore.js` is fetched once;
every later `set_content()` hits the HTTP cache, so networkidle resolves before
the construction script has run. The board was fully built — 29 objects, 22 SVG
children, `window.__err` null — and the PNG was still white.

Two fixes, both needed: a fresh page per figure, and waiting on a `window.__done`
flag the injected script sets itself.

**Never gate a screenshot on network state. Gate it on a signal the construction
raises.** A blank PNG with a healthy DOM is the failure mode to expect.

### 2. The reflex-angle trap — the big one

```js
angleMark(D, 0.72, dir(D, C), dir(D, B), 'x');   // 218° over the top of D
angleMark(D, 0.72, dir(D, B), dir(D, C), 'x');   // 142° underneath — correct
```

JSXGraph arcs and the `angle` element always sweep **counter-clockwise from the
first direction**. Swap the two arms and you silently get the reflex complement:
still a plausible arc, drawn on the wrong side, with the label dragged with it.

There is no error and the figure still looks like a figure. This is the single
most common way a generated geometry figure is wrong.

### 3. Nine labels flew off the board, silently

`at(p, r, angle, s)` offsets **from** `p`. For the star I passed `R + 0.92` — an
absolute radius from the centre — so the offset was added to the vertex's own
radius and every letter landed at radius 9.5 on a board that ends at 5.9.

The board reported 10 text objects. Zero were visible. Clipped HTML labels
produce no error, no warning, nothing in `window.__err`.

Any helper taking a distance must be unambiguous about its origin.

### 4. Type has to be sized in board units

The textbook sets a vertex letter at roughly half the length of a short
construction step — about 0.5 board units. A px `fontSize` that looks right at
one canvas size is wrong at the next, and letter-to-figure proportion is the
first thing that makes a reproduction stop looking like the book.

```js
var TYPE = 0.62;                                   // em, in board units
function px(u) { return u * board.unitX; }         // convert at create time
```

### 5. Narrow wedges cannot hold their own label

Triangle PFG in 解説(3) is 20°–20°–140°. On the bisector at any readable radius
the letters `a` and `b` land on top of P. The book's own answer: keep the **arc**
inside the wedge and push the **letter** out across the opposite side.

So arc and label placement have to be separable. A single
`angleMark(v, r, from, to, label, gap)` covers the easy 80% and cannot express
this — which is exactly the case where the figure is most crowded.

### 6. Measure the source, don't eyeball it

In 問題(2) the outer trisectors are **not** full cevians. They stop in mid-air.
I guessed a length first, then measured pixel coordinates off the scan and
tested a hypothesis: each outer trisector runs to where it crosses the *other*
vertex's inner trisector produced past D.

| | predicted | measured on scan |
|---|---|---|
| B stub | (3.73, 2.45) | (3.7, 2.09) |
| C stub | (7.55, 2.26) | (7.5, 2.24) |

Confirmed. A guessed length would have been visibly wrong and permanently
un-diagnosable.

Likewise the base angles: ∠B = 50°, ∠C = 64° come from the answer
(66 + 3a + 3b = 180, so a + b = 38) cross-checked against the drawn proportions
— not from picking numbers that "look like a triangle".

### 7. Smaller things

- `dash: 3` is a dashed rule. The 補助線 is finely dotted: `dash: 1`.
- In 解説(1) the auxiliary line runs horizontally **through** B, so a `B` label
  anchored middle-vertically sits on it. Lift it above the vertex.
- The auxiliary line overshoots B on the **left** too. Without that it reads as
  a ray starting at B, and step ③ loses its left arm.
- None of JSXGraph's seven arrow heads is an open V of straight strokes: 1–2 and
  4–6 are filled, 3 is a bar, 7 draws Bezier wings. Hand-draw the head.
- The book uses two different heads: open V terminates `l` and `m`, a small
  solid triangle marks the auxiliary line's direction.

## Workflow

**Crop the source per figure at 4x before writing any code.** The page is 731px
wide; at that size you cannot see whether a vertex carries a dot, how many
strokes leave B, or where a label sits. Every geometric decision above came out
of a 4x crop.

**Verify by replaying the figure's own code, not a rewrite of its formulas.**
Load `_lib.js + figure.js` into a `new Function` against a two-line JXG stub and
append `return {A, B, C, …};`. The check then runs on the very expressions that
draw the figure — re-deriving the coordinates in a separate script proves the
derivation, not the drawing, and the two drift.

**Compare side by side at matched height.** On its own, a render always looks
fine. Against the original at the same height, framing and proportion errors are
immediate. Three of the six figures needed their bounding box tightened after
the first comparison and none of it was visible before.

**Never create a `point` in a static annotation figure.** JSXGraph draws a
visible dot for it and makes it draggable. Everything in `_lib.js` is `curve`,
`segment` or `text`; `meet()` returns plain coordinates rather than an
`intersection` element for exactly this reason. This matches the book, which
puts a dot only on a circle centre, a moving point or a division point — never
on a polygon vertex.

## Not built

The ☆ margin note (平行線と角… with its 同位角 / 錯角 / 同側内角 mini-diagrams) is
in the source page but is not a question or solution figure. It is a different
asset class — Japanese body text with curved leader arrows pointing into two
small diagrams — and needs leader-arrow and text-block primitives that none of
the six figures use.

---

# 例題35 — what actually went wrong

## 1. The givens make figure (1) a tall thin strip, and that is correct

問題(1) marks 70° at D of square ABCD, with E on CD produced and F where the
diagonal AC meets BE. Work it forward — F from the 70° ray, E from BF — and
∠ABF comes out 20°, which puts E at tan 70° = **2.75 side lengths** above B. The
book draws E at roughly 0.6 of a side. Its figure cannot be to scale and no
amount of care will make a correct reproduction resemble it.

The frame ended up 5.4 × 11.6 board units, `@size 363 780`. That is the answer,
not a bug, but it has to be flagged to whoever asked for the figure — a
reproduction that looks nothing like the source is otherwise read as a mistake.

Same story in (2): the scan's 「正三角形ABC」 has sides 73/114/135 px.

## 2. Four labels had been silently clipped, two of them for weeks

Adding the DOM audit to `render.py` immediately turned up `E` losing its top
24px in 07/10 and `G` 1px in 09/12 — and `A` losing 4px in **02-q2-triangle and
05-s2-triangle**, figures finished in the previous session and never noticed.

A clipped JSXGraph label raises nothing: the text is absolutely-positioned HTML
outside the board div, the board still reports the object, and a partly-clipped
letter still looks like a letter. Eyeballing does not catch it. See rule E5.

The first version of the audit also flagged every figure for creating `point`
objects. False alarm: `board.create('segment', [p, q])` builds `point1`/`point2`
internally and they default to `visible: false`. The check has to be *visible*
points, or it cries wolf on every figure and gets ignored.

## 3. Hatching at 45° can land on an edge

Triangle GEA in (3) has edges at 0°, 41° and 60°. The house 45° hatching runs 4°
off GE, and the region stops reading as hatched — it reads as a printing fault.
Rotating to 120° puts the strokes at least 55° from every edge. Choose the angle
against the region's edges; do not take 45° on faith.

## 4. A step number sometimes does need an arc

例題34's rule was "circled numbers carry no arc" because every numbered vertex
already had a 108° arc to collide with. 例題35(1) is the opposite case: ① owns
vertex B by itself, and its wedge is 20° wide pinned against side AB, so
`0.31/sin 10° ≈ 1.8` board units out before the bisector can hold the glyph —
by which point it lands on F's label. The book's own answer is an arc inside the
wedge and the number across the arm. The rule now conditions on what else is at
the vertex.

At D the opposite constraint bites: ② and the given 70° share the vertex and
between them fill the whole 90° corner, so their arcs need clearly different
radii (0.95 and 0.65) or they read as a single right-angle sweep.

## 5. An offset label drifts off its own vertex

P in (2) is a crossing of two lines, and an offset big enough to clear both put
the letter visibly adrift. The gap between the arms climbing to A and to D is
120° wide and points nearly straight up; on that bisector, 0.44 units is enough.
Any vertex with more than two arms wants `at(v, r, bisector)`, not a hand-picked
dx/dy — the same lesson as B2, relearned.

## 6. New primitives

`_lib.js` gained `hatch`, `ticks`, `rightAngle`, `midpoint`, `HEAVY` and `SHADE`.
Two are worth remembering:

- A curve's path breaks at any non-finite coordinate, so **one** `curve` element
  carries a whole set of unconnected strokes. Hatching a region and drawing tick
  marks would otherwise cost one JSXGraph object per stroke.
- Hatching is line-clipping against a convex polygon: project the vertices onto
  the hatch normal to get the range of offsets, then clip each line to the
  polygon by intersecting half-planes. `clipToPolygon` returns the parameter
  interval, or null when the line misses.

## Not built

例題35 has no `reference/` crops — the source arrived as a pasted image rather
than a file, so `compare.py` skips 07–12. Drop crops at 4x into
`figures/reference/q1-square.png` and so on and the sheets appear with no other
change.

---

# 例題36 — what actually went wrong

## 1. (1) could not be read, so it was not drawn

問題(1) is a square ABCD with F the foot of the perpendicular from C to AE, and
asks for ∠DCF. Two facts decide the construction and neither is legible at the
resolution the page arrived at:

- **what the 30° at E subtends** — ∠AEC and ∠DEC place E differently;
- **what G is** — no intersection of any candidate line pair lands within 45px
  of its label, while H sits on BD within 3px of the square's centre.

What *was* established, and how, is worth keeping because it is the method:

| claim | how |
|---|---|
| F is the foot of the perpendicular from C to AE | dot product on measured pixels: −175 against magnitudes ~200 × 210, cos ≈ 0.004 |
| ∠DCF = ∠EAD always | CF ⊥ AE, so CF makes with CD the angle AE makes with AD — an identity to test readings against |
| E is NOT on BD extended | that reading solves to ∠DCF = ∠AEC = 30°, i.e. the answer equals its own given, and only at one specific position (s = 1.366). A coincidence, not a design |

Rule F1 came out of this: ship the missing facts, not a plausible figure. The
cost of guessing here is not a wrong figure, it is a figure that looks finished
and whose own marked angle is false.

## 2. A length is a brace, and two braces on one baseline must stack

Both figures measure lengths, and neither uses a witness line with tick ends:
the page draws a shallow arc across the two endpoints. `_lib.js` gained
`dimension(p, q, str, bulge, side)` — the circle through the endpoints and the
apex, `R = h/2 + c²/(8h)`, picking whichever of the two arcs the apex lies on.

BD and DC in (3) share the base BC. At equal sagittas the two arcs abut and read
as one brace under the whole base, so they take 0.45 and 0.85 — which is what the
source does too.

### The value BREAKS the arc; it does not sit outside it

The first version drew a continuous arc and hung the value beyond the apex. The
source does neither: it cuts the curve at the apex and seats the number in the
gap, so the mark reads as two strokes reaching out from the number to the
endpoints. Rule B9 now says so.

A white box behind the text is the wrong fix for the same picture — it notches a
curve with a straight edge, it needs a white ground, and it knocks a hole in
whatever else runs behind, the base line included. The gap has to be in the
curve. Its width is measured off `label.rendNode.offsetWidth`, not guessed from
the character count: `3` and `10` want very different gaps, and the node exists
as soon as the text does.

**The 2π trap.** Splitting one arc into two means feeding `arc()` an angle that
came from `dir()`, i.e. a raw `atan2` in (−π, π]. The second run's start can
land numerically ABOVE its end, `sweep()` lifts the end by a full turn, and the
mark renders as a complete circle across the whole figure. Work in absolute
angles from a single `a0` — `span = sweep(a0, a1) - a0`, `end = a0 + span` — and
never hand a raw `dir()` value to the second half of a split arc. This is the
reflex-angle trap of 例題34 §2 wearing a different hat: same cause, same silence,
and it renders as something that still looks like a figure.

## 3. C in (2) has five arms

The centre of the small square is also a corner of the big one, so C carries two
sides of ABCD, two dotted half-diagonals, and the hatched region's edge. Exactly
one 45° sector is free. This is rule B4: enumerate the arms, take the widest gap,
halve it — an offset chosen by eye lands on one of the five.

## 4. The frame audit paid for itself a third time

`10` overflowed the left edge by 10px, because the dimension arc bulges 0.75
board units OUTSIDE the side it measures and its label sits 0.5 beyond that —
neither is part of the geometry the frame was sized from. Size the frame from
the labels, dimension apexes included.

## 5. 13 — 例題36(1): one question unlocked the whole panel

Held back under F1 because two facts were unreadable. Asking which angle the
30° marks — the answer was ∠DEC — settled everything else without a crop:

| tested | predicted | measured on the scan |
|---|---|---|
| E on the circle where DC subtends 30° | R = 1 side | 1.014 |
| ∠DEC at the measured E | 30° | 29.2° |
| E on BD produced | y/x = 1 | 0.974 |

Three independent checks, so the reading is established rather than assumed
(rule F2). Solving `2t² − 2t − 1 = 0` puts E at `t = (1 + √3)/2` side lengths
along BD, and then `tan ∠DAE = 2 − √3` **exactly**, i.e. ∠DCF = 15° — half its
own given, and EA = EC = AC, so ACE is equilateral and ∠AEC = 60°.

That last number is what clears the earlier rejection in section 1: the reading
thrown out there had ∠AEC = 30°, and here ∠AEC comes out 60°. The two readings
were never the same one, so nothing contradicts.

**G is still unread.** H measures within 2px of the diagonals' crossing, but G
misses every candidate line by ~6px — the same order as the error in reading
positions off a panel this size. So 13 ships with A–F and without G, and its
header says so. A 4x crop of that one panel closes it.

## Not built

例題36 has no `reference/` crops, so `compare.py` skips 13–15.

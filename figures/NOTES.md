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

---

# Angle notation as a JSXGraph extension (ai-tutor)

The four angle cases of 例題34 — a value (20°), an unknown (x), bare equal arcs
(the star), ● / ○ glyphs — became two elements in ai-tutor,
`src/interfaces/module/figure_gen/js/anglemark.js`, shipped the way `dimension`
is: read by `board_extensions.py`, sentinel-wrapped, emitted by
`_board_init_code(anglemarks=True)` before `initBoard` (the board deep-copies
`JXG.Options`, so a later registration has no defaults branch), stripped again by
`_strip_board_scaffold` before a retry is shown its own code, documented for the
model in `jsxgraph_kb.py::_LOCAL_ELEMENTS`, gated by `validation/code_anglemark.py`,
retrieved by `stages/retrieval.py`, mirrored to the jsxgraph fork's `extensions/`.

## What actually went wrong

1. **The reference implementation I meant to follow did not exist where I
   thought.** `dimension()` lives in this repo's `_lib.js`; ai-tutor's
   `dimension` element is a 797-line JSXGraph extension the user built between
   sessions, on a different architecture (style and extensions travel INSIDE the
   figure code), and my web-side theme sat in a stash it had superseded. Read the
   target repo's `git log` before building "the same way as before".
2. **Two values at one vertex collided** ("45°" over a nested "24°"): both on
   their bisectors at radius+gap. Fixed in the element — each mark records its
   seat radius; a later value at the same vertex seats outside the earlier one.
3. **The production flag was never thrown.** See rule G3; both `dimensions=` and
   `anglemarks=` are now computed at the two call sites from the spec.
4. **A false alarm that cost an hour: the dots "in the wrong place".** My check
   used the fitted board's px/unit (72) on the un-fitted render (46). The dots
   were exactly where the maths put them. Recompute the scale from the picture
   you are actually looking at.
5. **Two renderer artefacts that were not the element** — bold sans labels on
   the 1.11.1 evaluation template (its own legacy halo), and the auto-fit
   clipping a 19-unit-wide body in a 900×420 frame (identical box with the
   element removed). Both reported, neither "fixed" in the element.

## Verified

199 unit tests green (`uv run --no-sync pytest -W error tests/unit_tests/generate_figure/`),
ruff clean, the assembled figure rendered on jsxgraph 1.11.1 and 1.12.2 with no
error and 36 objects, control renders isolating the fit behaviour.

---

# 例題36 比の合成 — what actually went wrong

Figures 16–21. A different 例題36 from figures 13–15, out of a different book:
parallelogram ABCD, one ratio along BC and another along DC, and — new asset
class — the 解説's 線分図, a bare line carrying both ratios at once.

| | |
|---|---|
| 16 | 問題(1) BP:PQ:QD — E the midpoint of BC, F on DC at ①:②, AE and AF cutting BD |
| 17 | 問題(2) DG:GE — E on BC at □1:□2, F on DC at ③:②, AF crossing DE |
| 18 | 解説(1) the same figure with every side carried in its own unit system |
| 19 | 解説(1) 線分図 — BD carrying □1:□2 and ③:① at once, scaled to △12 |
| 20 | 解説(2) AF and BC produced to P (角出し) |
| 21 | 解説(2) 傍注 — the extension alone, with the two similar pairs marked |

## 1. Three alphabets of ratio unit, and two of them do not exist

The whole method is that ①:② and □1:□2 are ratios in *different* units, which
is why they cannot be compared until both are scaled to △. The enclosure is not
decoration: without it 例題36(2) reads "1:2 and 3:2" and says nothing about how
BE compares with DF.

Unicode has ①-⑳ and nothing else. U+20DE and U+20E4, the combining enclosing
square and enclosing triangle, are **absent from Times New Roman** — they render
as nothing at all, silently, and the figure ships with a bare `1` where a boxed
one should be. That is the E5 failure mode again: no error, no missing object,
just missing ink. `enclose()` strokes the shape round the glyph at its measured
`offsetWidth`/`offsetHeight` instead, and `unit(x, y, n, kind)` is the
free-standing form.

## 2. The shortest brace in the 線分図 dictated the whole layout

BD divides as 4:5:3, so the four braces span 4, 8, 9 and 3 of 12 units. A brace
is a circular arc through its endpoints, and its sagitta cannot exceed half its
chord or the arc goes MAJOR and renders as a balloon — so the QD brace caps at
about 0.9 while the others are comfortable at 1.1.

Six layouts were tried and each died the same way. Every arrangement that seats
the composed value △3 *inside* the ① brace needs two rows under a chord of 3,
and there is no sagitta that gives them: 1.1 is already a 167° arc and 1.2 is a
semicircle. It is not a spacing problem and no nudge fixes it.

What works is putting the derived value and the multiplier OUTSIDE the brace, on
the same normal, where nothing constrains them — and it reads better anyway,
because outward from the line the column is the sentence: □1, ×4, △4.

The second collision was subtler. △9 spans B→Q, so it wants x = 4.5; P sits at
x = 4. A row holding both is impossible whichever side of the line it goes on,
and it was only after moving the letters three times that the cause became
clear: **a brace endpoint always lands on the letter of the point it bounds.**
Insetting both ends of every brace by 0.28 of a 12-unit line frees every letter
at once (rule B12), and the letters then sit on the line row unmolested.

## 3. A mark and a label wanted the same seat

In 21, G has four arms and two 106° gaps, and both of them carry a
vertical-angle ● — that is what a vertical-angle pair *means*. B4's "widest gap"
put the letter in the same wedge as a mark, and the render shows a black blob
behind the G. The letter has to take a 74° gap. Marks are placed first because
a mark cannot move; a letter can (rule B4, extended).

## 4. The parallelogram's shape is free, so the scan owns it

A4 says the scan is evidence of topology, never of proportion — but that is
about proportions the givens fix. Nothing in either question constrains the
parallelogram: any one answers it. So its shape was measured off both panels
(base 138 and 130 px, rise 112, top shifted 16 and 17) and taken as base 6, rise
4.9, lean 0.7. Rule A6 now names the distinction, because applying A4 blindly
here would mean inventing a shape.

Where the givens DO speak, they won as usual: P is where AF meets BC produced,
which is 10 on a base of 6 — the page draws it at about 8.8, and the figure is
1.6 base-widths wide as a result.

## 5. Verified

Replaying each figure's own code against the JXG stub (see Workflow above) and
measuring the finished coordinates:

| | measured | stated |
|---|---|---|
| 16 BE:EC, DF:FC | 1.0000, 0.5000 | 1, 1:2 |
| 16 BP:PD, BQ:QD | 0.5000, 3.0000 | 1:2, 3:1 |
| 16 BP:PQ:QD | 1.333 : 1.667 : 1.000 | 4:5:3 |
| 20 CP:AD, AD:EP | 0.6667, 0.7500 | 2:3, 3:4 |
| 20 DG:GE | 0.7500 | 3:4 |

P and Q lie on BD to 4e-15; A, G, F, P are collinear exactly; P is on BC
exactly.

`dimension` was refactored onto a shared `bulgeArc`, so it now backs the ratio
braces as well. All fifteen earlier figures re-render byte-identical in shape
and still pass the audit.

## Not built

**解説(1)'s inner arcs.** The source panel carries several arcs inside the
parallelogram, around P, Q and D. At the resolution the page arrived at it could
not be settled whether they mark the vertical angles of the two similar pairs or
brace the parts of BD — the two readings put ink in completely different places,
and neither is recoverable from the givens. Figure 18 ships without them and its
header says so (rule F1, the same call as G in figure 13). A 4x crop of that one
panel closes it.

**The [2] on CP in 解説(2).** The solution derives CP = [2] and the figure does
not mark it; the source does not appear to either, so it was left off rather
than added on the strength of the text.

例題36 比の合成 has no `reference/` crops — the source arrived pasted, not as a
file — so `compare.py` skips 16–21.

---

# Evaluating the ai-tutor extensions (anglemark, equalangle, dimension)

Three layers, cheapest and most deterministic first, all in ai-tutor:

1. **Code gates** — `_static_validate`, including `code_anglemark.py` and
   `code_dimension.py`: one element per annotation, no hand-placed value text.
2. **Rendered-DOM audit** — `evaluation/utils/notation_audit.py`. Renders the
   assembled figure in a BARE page (the evaluation template's own legacy halo
   would otherwise colour the result), then reads the DOM: visible dots (B1),
   clipped labels (E5), label overlaps (B4), non-monochrome strokes (D1), frame
   fill (D5), every anglemark's measured sweep (A1), and each expected mark
   present and drawn by the right element. The three elements are
   `JXG.Composition`s and are NOT in `board.objectsList`; the audit reads
   `board.__anglemarks`, `board.__equalangles`, `board.__dimensions`.
3. **LLM judge** — a fourth severity metric `notation_marks.md` in the existing
   rubric format, so the report shows it beside the other three.

Evalset entries: `evaluate_dataset/figure_generation/extensions/data.jsonl` — the
eight reference figures of 例題34–36 with their reference PNGs from this repo and
an `expected_notation` block each; and the ADK evalset the CLAUDE.md prompt-change
rule asks for, `google_adk/services/generate_figure/tests/eval/`.

## Result for the two extensions

Driven with hand-written code against the elements (no model), all eight figures
pass every notation check: every value, unknown, bare arc, ●/○ group and length is
present and owned by the right element; no reflex sweep, no dot, no colour. Three
of eight are fully clean; five carry only E5 clips of base or apex labels, which a
control render without the elements reproduces byte for byte — the auto-fit's
behaviour in a host-shaped frame, not the elements'. The LLM layer could not be
run here: the runner requires `LITELLM_EVAL_API_KEY`, a budget-separated virtual
key, and refuses to fall back to a direct Google call.

## What actually went wrong

1. **The first audit blamed the elements for its own three bugs.** Compositions
   are absent from `objectsList` (so every element counted as missing); the
   inventory scanned the assembled scaffold and counted the element source's own
   header-comment examples; and a fixed 760×560 frame made the fit clip. A first
   run of a new auditor is a test of the auditor.
2. **The audit caught a wrong given in my own dataset** — see E8.
3. **The work was stashed twice between sessions** and the tree switched
   branches; nothing was lost, but the eval files only survived because the
   stash was taken with `-u`, and the dataset only because `evaluate_dataset/`
   is a submodule. Check `git stash list` and the branch before rebuilding.

---

# Arc size: the house style moved, and only ai-tutor followed

The angle notation shipped with a 1.5-label-height arc. Measured on the rendered
figure that is 19.2% of the square's side in 例題35(1) — and the 15 figures in
this repo, drawn by hand, use 0.62–1.15 board units, i.e. 18.2% on the same
figure. The two systems agreed. The style owner looked at the render and called
it too big by half, so the extension is now 0.75 (9.6%) with the right-angle
square scaled to match.

**The reference figures in this repo were NOT changed** and still draw at ~19%.
Each `angleMark()` call passes its own radius (17 call sites across 15 figures),
so there is no single constant to turn; halving them would also invalidate 15
committed renders. Until that is done, a side-by-side of an ai-tutor figure
against `figures/NN-name/render.png` will disagree on arc size by 2×, and that
disagreement is expected rather than a defect.

The measurement lesson is rule B10's second half: an em is 0.62 board units in
`_lib.js` and came out 0.435 in ai-tutor on the same figure, so the two systems
cannot be compared by their em constants at all.

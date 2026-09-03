# Prompt rules — JP textbook figure style (JSXGraph)

Rules to add to the figure-generation prompt so output matches a Japanese
textbook figure. Every one is derived from a defect actually observed while
reproducing 例題34, 例題35 and 例題36, and every one is stated so it can be
checked mechanically.

Ordered by how often violating it ruins the figure.

---

## A. Geometry the model gets wrong silently

**A1. Arcs sweep counter-clockwise from the first arm. Always name the arms in
counter-clockwise order.**
An `angle`, `arc` or hand-built wedge given its arms in the wrong order draws the
reflex complement — a plausible arc on the wrong side of the vertex, with its
label dragged along. Nothing errors. For the interior angle of a polygon listed
counter-clockwise, that means naming the *previous* vertex first.
*Check: for every marked angle, the drawn sweep is < 180°.*

**A2. Derive coordinates from the givens; never hardcode a plausible-looking
position.** If the question says ∠A = 66° and the base angles are trisected,
compute the apex from the two base angles. A vertex placed by eye puts the
trisectors visibly off and the error cannot be diagnosed later.
*Check: every stated angle and length measures correct on the finished figure.*

**A3. Recover unstated angles from the answer.** 例題34(2) gives only ∠A = 66°;
∠B = 50° and ∠C = 64° follow from 66 + 3a + 3b = 180 with the drawn proportions.
Reconstruct them rather than inventing a pair that merely sums correctly.

**A4. The source scan is evidence of topology, never of proportion — and the
givens own the frame.** These pages are squashed to fit a column, by a lot: a
「正五角形」 measured 106/101/96/98/94 px on its five sides, a 「正三角形ABC」 came out
73/114/135. In 例題35(1) the given 70° forces E to sit tan 70° = 2.75 side lengths
above B; the book draws it at about 0.6. Build from the givens and let the aspect
land where it lands — then say so, because a correctly-built figure that looks
unlike the book is a surprise the reader has to be warned about. Read off the
scan only which segments exist, which vertices carry marks, and roughly where the
labels sit.
*Check: every stated measure holds numerically before the figure is called done.*

**A5. A construction line stops where the construction says, not at the figure
edge.** In 例題34(2) the outer trisectors end where they cross the other vertex's
inner trisector produced — they hang in mid-air. Drawing them as full cevians to
the opposite side is the single most obvious tell.

---

## B. Marks and their placement

**B1. Vertices carry no dot.** A dot appears only on a circle centre, a moving
point, or a division point. In JSXGraph that means: build static figures from
`curve`, `segment` and `text` only, and never create a `point`. A `point` is
draggable and renders a visible dot. For an intersection, compute the
coordinates; do not use the `intersection` element.

**B2. Place a label radially out from its vertex, not at a hand-picked
coordinate.** Vertex letters go on the outward ray from the figure's centre;
angle values go on the wedge bisector.
*Check: no label overlaps a stroke.*

**B3. When the wedge is too narrow for its label, keep the arc inside and move
the letter out.** Below roughly 25°, a label on the bisector collides with
whatever is at the far end of the wedge. Draw the arc and place the label as two
separate calls — a combined helper cannot express this, and narrow wedges are
exactly where figures are most crowded.
The arithmetic: a wedge of half-angle θ has width 2r·sin θ at radius r, and a
glyph needs about one em (0.62 board units). So the bisector only becomes usable
beyond r = 0.31/sin θ — for a 10° half-angle that is r ≈ 1.8, which is usually
outside the figure or on top of something else. Compute it rather than nudging.

**B4. Label a vertex on the bisector of its WIDEST gap, and count the arms
first.** C in 例題36(2) carries five: two sides of ABCD, two dotted
half-diagonals, and the hatched region's boundary. The gap left over is a single
45° sector, and any offset picked by eye lands on one of the five. Enumerate the
arm directions, take the widest gap, halve it.

**B5. A label must clear lines that pass *through* its vertex, not just the arms
that stop there.** An auxiliary line drawn through B makes any label anchored
level with B sit on the line.

**B6. Equal-angle marks are ● for the first group, ○ for the second, × for the
third — one per wedge, all at the same radius** so the group reads as one. When
the solution names the value, the letter sits further out on the same bisector:
the mark says "these are equal", the letter names what they equal.

**B7. Equal-length marks are 1/2/3 ticks at the segment midpoint** (JSXGraph
`hatch`), one tick count per equivalence class, consistent across the figure.

**B8. Two marks at one vertex need visibly different radii.** 例題35(1) puts ② and
the given 70° both at D, filling the whole 90° corner between them. At similar
radii the two arcs read as one 90° sweep and the figure silently loses its
argument. Keep at least a 1.4× ratio, tighter arc on the wider angle.

**B9. A length is a shallow arc spanning its two endpoints, BROKEN at its apex
by the value** — not a witness line with tick ends, not a bare number floating
beside the segment, and not a continuous arc with the number parked outside it.
The printed mark is two strokes reaching out from the number to the endpoints,
so the gap is cut in the curve itself and sized to the glyphs it makes room for.
A white box behind the text is not the same thing: a rectangle cuts a
straight-edged notch out of a curve, it fails on any ground that is not white,
and it hides whatever else passes behind the number — including the base line
the arc sits under. 例題36 measures AB, FG, BD and DC this way, and it is the
same brace `geometry_2d_dimension` describes for the generated figures.
Two lengths that share a baseline (BD and DC on BC) are told apart by giving
them **different sagittas** so the arcs stack; equal sagittas read as one long
brace under the whole base. They must also bulge the **same way**: a side picked
independently per mark comes out alternating, and the pair reads as a wave
rather than as two braces. Decide the side once for the line.
*Check: the arc's apex is on the far side of the segment from the figure, the
curve has a gap there, and the value sits in it.*

---

## F. When NOT to draw

**F1. A figure whose givens cannot be read is not drawn.** 例題36(1) — square
ABCD, F the foot of the perpendicular from C to AE, find ∠DCF — could not be
built from the pasted page: at that resolution neither *what the 30° subtends*
nor *what point G is* is legible, and both change the construction. A guessed
reading produces a figure whose own marked angle is false, looks finished, and
is permanently un-diagnosable (rule A2/A4). Say which facts are missing and
stop; do not ship a plausible figure.

**F2. Test a candidate reading against an identity the figure must satisfy.**
Before giving up on 例題36(1) each reading was checked against a consequence of
the construction: CF ⊥ AE in a square forces ∠DCF = ∠EAD, and the perpendicular
foot was confirmed by a dot product on measured pixels (−175 against magnitudes
of ~200 × 210, i.e. cos ≈ 0.004). That is how the perpendicular was *established*
rather than assumed. **A reading whose answer comes out equal to its own given is
evidence against that reading**, not a discovery — "E on BD extended" made
∠DCF = ∠AEC = 30° by numerical coincidence at one specific position, which no
one designs a question around.

---

## C. Type

**C1. Size type in board units, not pixels.** A vertex letter's em box is about
0.6 board units — roughly half a short construction step. Convert at creation:
`fontSize: 0.62 * board.unitX`. A px size that looks right on one canvas is wrong
on the next, and letter-to-figure proportion is the first thing that reads as
"not the book".

**C2. Serif throughout. Variables italic, everything else upright.**
`x`, `a`, `b`, `l`, `m` are italic; `A`–`I`, `20°`, `108°`, `①` are upright.
`font-family:"Times New Roman",Times,serif`.

**C3. A step number carries an arc only when it is the sole mark at its
vertex.** The default is the bare circled glyph — `&#9312;`… — dropped into the
wedge: in 例題34 every numbered vertex already carried a 108° arc, and a second
arc collided with it. But in 例題35(1) step ① owns vertex B alone and its wedge is
20° pinned against a side, so the glyph has nowhere legible to sit; there the arc
marks the angle and the number goes just across the arm, exactly as the book
prints it. Condition on what else is at the vertex, not on habit.

---

## D. Line and page

**D1. Monochrome. No fill, no grid, no axes.** Regions are marked by hatching,
never a grey tint — the page is line art and a tint prints as a muddy block.
45° is the default, but **rotate it when it falls within about 20° of any edge of
the region.** Triangle GEA in 例題35(3) has edges at 0°, 41° and 60°; hatched at
45° the strokes run 4° off GE and the whole thing reads as a shading fault. 120°
clears all three edges by 55° or more. Pick the angle that maximises the minimum
separation from the edges, modulo 180°.

**D2. Auxiliary lines are finely dotted at the same stroke weight as the figure**
— `dash: 1`, not `dash: 2` or `3`, which read as dashed rules. Style distinguishes
them, never weight.

**D3. An auxiliary line drawn *through* a point overshoots it on both sides.**
Starting it at the point turns it into a ray and destroys the angle on the far
side.

**D4. Named lines (ℓ, m) get an open-V arrowhead; construction direction gets a
small solid triangle.** None of JSXGraph's seven built-in heads is an open V of
straight strokes — 1–2 and 4–6 are filled, 3 is a bar, 7 draws Bezier wings — so
draw both heads by hand as short curves.

**D5. Frame tight.** Leave about half a letter-height of margin beyond the
outermost label. Generous padding is the most common difference between a
generated figure and a printed one, and it is invisible until you put the two
side by side at the same height.

---

## E. Verification the pipeline should run, not the model

These are cheap, deterministic, and catch what the model cannot see. Items 3, 5
and 7 now run automatically: `render.py` evaluates a DOM audit after every figure
builds and prints `WARN` lines against these numbers. The rest are still on the
author.

1. Every marked angle sweeps < 180° (catches A1).
2. Every stated measure holds numerically on the finished coordinates (A2/A3).
3. Zero *visible* `point` elements in a static figure (B1). Not zero points:
   every `segment` quietly builds `point1`/`point2`, which default to
   `visible: false`. Checking the raw count only produces false alarms.
4. No two label bounding boxes overlap; no label box crosses a stroke (B2/B4).
5. Every label's centre is inside the board's bounding box — **a clipped HTML
   label throws nothing and appears nowhere** (this cost nine missing letters).
6. Every element's stroke is black or grey (D1).
7. Rendered content bounds fill ≥ 80% of the canvas in the long dimension (D5).

Check 5 deserves emphasis: JSXGraph renders text as absolutely-positioned HTML.
A label placed outside the board is simply clipped — the object exists, the
board reports it, and it is not on screen. Partial clipping is worse than total,
because the figure still looks finished: the audit caught `E` losing its top 24px
in 例題35(1), `G` losing 1px in (3), and — on figures that had been called done
weeks earlier — `A` losing 4px in 例題34(2) and its 解説. Nobody had noticed.

Sizing the frame from the labels, not the geometry, is what prevents it: a label
anchored `bottom` at `y + 0.30` reaches `y + 0.30 + 0.62`, and rule D5 wants
another half letter-height beyond that. Then pick `@size` to match the frame's
aspect, so `unitX == unitY` and nothing is wasted.

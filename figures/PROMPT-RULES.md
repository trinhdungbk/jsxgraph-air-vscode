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

**A6. The scan IS the authority on whatever the givens leave free.** A4 holds
for proportions the givens fix. 例題36's parallelogram is fixed by nothing — any
parallelogram answers the question — so its shape comes off the page: base 6,
rise 0.82 of the base, top side shifted right 0.12 of it, measured on both
panels and agreeing to within a pixel. Decide which of the two kinds an unstated
quantity is before drawing it: "derive from the givens" has nothing to derive
when the givens are silent, and "read it off the scan" is wrong the moment they
are not. Read it off **per panel**: 例題36's two panels agreed on the shape, and
the two panels of the 問題 after it do not — 0.14 of the base of lean against
0.32. Nothing makes them agree, so nothing should force them to.

**A7. A ratio answer must be invariant under the figure's free parameters, and
that is what establishes a reading.** The free parameters are exactly the ones
A6 identifies. Recompute the answer on several of them — the 問題 pair above was
checked on four parallelograms including a left-leaning one and a squat one, and
returned 9:11:10 and 6:7 every time — and a candidate reading whose answer MOVES
is reading a constraint the question never gave. This is far stronger evidence
than "the answer came out a nice number" (F2's warning), costs one loop, and
needs no crop: it is the one check that can settle a reading off an illegible
panel.
*Check: the answer is identical on at least three random admissible shapes.*

**A8. Measure the source from a FILE. An image pasted into a conversation is
evidence of topology and of nothing else.** The same page, eyeballed off the
paste and then measured off the file:

| | eyeballed | measured |
|---|---|---|
| rise / base, panel (1) | 0.82 | 0.664 |
| rise / base, panel (2) | 0.71 | 0.660 |
| lean / base, panel (1) | 0.12 | 0.154 |
| lean / base, panel (2) | 0.32 | 0.142 |

Every number is wrong, the rise by a quarter — and the eyeball made two panels
that are identical to within a pixel look like different shapes, which then got
written into the figures as a deliberate difference and into the notes as a
finding. Measuring is one pass: threshold the file, take the rows carrying a
long dark run, and the two parallel sides fall out with their x-extents.
A6 still holds — the scan owns what the givens leave free — but only a scan you
can measure. Ask for the file.
*Check: the shape constants trace to pixel measurements, not to a description of
the picture.*

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

**Arms that all leave along one line hand the letter a whole half-plane.** E on
AD in the 問題 above has both its side-arms along AD and one cevian leaving
downward, so the widest gap is a full 180° and its bisector is exactly the
outward normal — the degenerate case the rule handles correctly, and the case
where the letter and a brace label both want "straight up". They coexist at
different radii, the letter inside (B8's two-radii argument, applied to a label
against a mark rather than two marks).

**Compute the angle, never type it.** `labelAt(v, r, arms, str)` puts the letter
on the bisector of the widest gap between the arms at v. A typed angle is
correct for exactly one set of proportions and goes silently stale the moment
the shape changes: it still points somewhere plausible, so nothing looks broken
and the letter has drifted onto a stroke. Nine figures carried typed bisectors
until the shape was corrected, and every one of them was then wrong.

**The widest-gap rule is DEGENERATE at a crossing, and the tie has to be broken
deliberately.** Vertical angles are equal by construction, so a point where two
lines cross has its widest gap tied — twice over — and which side the letter
takes is then decided by floating-point noise in the sort. Nothing errors, the
figure looks finished, and the letter can flip to the other side of the crossing
on any edit that perturbs the arithmetic. Pass the side the source uses and let
the helper pick the tied-widest gap nearest it: same side as the book, with the
clearance the wide gap gives.

**Count the marks too, and place them first.** A mark and a label want the same
seat, and the mark is the one that cannot move: an equal-angle mark belongs on
one specific wedge's bisector, a letter will take any free direction. G in
例題36's margin note has four arms and two 106° gaps, and BOTH carry a
vertical-angle mark — so the letter takes a 74° gap. Run the mark pass, then the
label pass; a label placed first lands under the mark that follows it.

**B5. A label must clear lines that pass *through* its vertex, not just the arms
that stop there.** An auxiliary line drawn through B makes any label anchored
level with B sit on the line.

**B6. Equal-angle marks are ● for the first group, ○ for the second, × for the
third — one per wedge, all at the same radius** so the group reads as one. When
the solution names the value, the letter sits further out on the same bisector:
the mark says "these are equal", the letter names what they equal.

**B7. Equal-length marks are 1/2/3 ticks at the segment midpoint** (JSXGraph
`hatch`), one tick count per equivalence class, consistent across the figure.

**But a glyph mark's scope can be the DIVISION rather than the figure, and this
book's is.** 例題37 puts an open circle on both halves of AB *and* on both
halves of AC in one diagram, and the two are not equal to each other; the
中点連結定理 margin note does the same. So the circle reads "these parts are equal
to each other" and stops at the side it sits on. Two consequences, both of them
mistakes already made on this page: read as a figure-wide equivalence class the
mark is simply false, and read as an ANGLE mark it lands at the wrong vertices
entirely — a previous attempt put ● and ○ at A and C, where the source marks
nothing at all. Decide which scope the source is using before copying a glyph,
and say so in the figure.

**B8. Two marks at one vertex need visibly different radii — and two VALUES at
one vertex need different seats.** Different radii keep the arcs apart; the
values then still land on each other, because both sit on nearly the same
bisector at "radius + gap" (例題34's 108° and ④ at A; a 45° with a 24° nested in
it). The later value seats OUTSIDE the earlier one's seat plus a label height.
Both are mechanical once the marks at a vertex can see each other, which is the
argument for making the mark an element rather than a recipe (see G). 例題35(1) puts ② and
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
brace under the whole base. **Only when the values differ, and only when the
division point is bare.** BE and EC in 例題36's 解説(1) are both boxed ①, and
staggering them would deny the equality the ticks assert. And ③:④ over AD in
the 問題 after it stays level despite differing, because B12's inset already
opens a gap at E — a gap holding E's own letter — so the pair cannot read as one
brace. Stagger only when nothing sits between the two arcs where they meet;
that is the entire failure the stagger was invented for.
**When you do stagger, the deeper brace is the one with the LONGER chord.** DE
and EC on DC are 3.10 and 1.55 units, and the short one's sagitta is capped at
0.47 by B11 — so the depth the pair needs has nowhere to go except onto DE. They must also bulge the **same way**: a side picked
independently per mark comes out alternating, and the pair reads as a wave
rather than as two braces. Decide the side once for the line — **by which side
is emptier, which is not always the outward one.** FG and GC on the cevian FC
of 例題37(1) have to bulge INWARD: outward from that line is the base and the
other cevian, and the two values land on both. Outwardness is the usual answer
to emptiness, never a substitute for measuring it.
*Check: the arc's apex is on the far side of the segment from the figure, the
curve has a gap there, and the value sits in it.*

**B10. A ratio unit is a digit inside a SHAPE, and the shape carries the
meaning.** 比の合成 runs two ratios in different unit systems until it scales
them onto a common one, and the systems are told apart by the enclosure alone:
circled, boxed, triangled. Strip the shapes off 例題36(2) and the question reads
"1:2 and 3:2", which says nothing whatever about how BE compares with DF. One
shape per system, the same shape in the question figure and in its 解説, and a
third shape for the common unit the two are scaled into.
Only the circled digits exist in Unicode. U+20DE and U+20E4 — the combining
enclosing square and enclosing triangle — are absent from Times New Roman and
render as **nothing at all**, with no error and no warning: the same silent
invisibility as a clipped label (E5), and it survives every check that counts
objects rather than looking at them. Stroke the enclosure round the glyph at its
rendered size instead.

**B11. A brace's depth is capped by its own chord, and the shortest span in the
figure sets the layout for all of them.** The circle through the two endpoints
with sagitta h becomes a MAJOR arc the moment h > c/2, and the mark renders as a
balloon; h ≤ 0.3c is the usable range. On 例題36's 線分図 the spans are 4, 8, 9
and 3 of 12, so the QD brace caps at about 0.9 while the others sit at 1.1 — and
**nothing can be stacked inside any brace**, because the shortest one has no
room and a row that exists on one span must exist on all four. The derived value
and its multiplier go OUTSIDE, on the same normal, where no chord constrains
them; read outward the column is then the sentence it should be, □1 ×4 △4.
Discover this before laying the diagram out, not after: every arrangement that
puts a row inside a brace dies on the shortest span, and there is no nudge that
rescues it.
A sagitta is never carried over from a figure that looked similar: 0.78 drew
例題36's FC correctly and would have made this 問題's EC a semicircle, because
the chord fell from 3.3 to 1.55 units. Compute the cap from the chord at hand.
*Check: every brace has h/c ≤ 0.3.*

**B12. Inset a brace from the division points it bounds.** A brace that reaches
its own endpoint arrives exactly where that point's letter is, and neither can
give way — the letter belongs at the point and the brace belongs under the span.
Moving the letter fails at every division point simultaneously. Pull both ends
in by half a letter width and every letter on the line is clear, with nothing
else changed.
**The inset is an absolute distance, not a fraction of the span.** A fraction is
the obvious first guess and it is wrong: AF spans 4 units and FD spans 2, so a
fractional inset gives FD half the clearance — while the letter it has to clear,
F, is the same size on both. `braceOn` takes board units and defaults to
0.5 em.

**B10. An angle arc measures about 10% of the figure's reference length, not
20%.** Settled 2026-09-04 by measurement, against the eye of the person who
owns the style: the notation shipped at 1.5 label heights, which renders at
**19.2%** of a square's side once the auto-fit has settled — a wide annulus for
a 70° angle where the page prints a tick of a curve. Halved to 0.75 label
heights (**9.6%**). The right-angle square scales with it (0.6 × the arc
radius), or the one angle that is not an arc becomes the heaviest mark in the
figure.

The equal-angle GLYPH does not scale with it: its radius is set by whether the
glyph fits its wedge, not by legibility of a curve. A trisected 50° angle has
half-angle 8°, so the wedge is only `r·sin 8°` wide — at 0.75 that is 0.11
label heights against a 0.16 glyph, and the mark spills over both arms. It
stays at 1.5.

**Sizes are in label heights, and a label height is not the same length in both
systems.** `_lib.js` sets `fontSize = 0.62 · board.unitX`, so an em is 0.62
board units by construction; ai-tutor sets it from the canvas diagonal and then
re-fits, so an em came out 0.435 board units on the same figure. Comparing the
two by their em constants says they agree when the pictures do not. Measure the
arc as a fraction of a length in the figure.

---

**B13. Marks of different KINDS on one line go on opposite sides.** The median
in 解説37(2) carries two lengths (`y`, `4`) and two ratio units (②, ①). Put all
four on one side and they queue up, and nothing tells the reader which mark is a
measurement and which is a proportion. Lengths below, units above.

---

## F. When NOT to draw

**F1. A figure whose givens cannot be read is not drawn — ask for the one fact
you are missing.** 例題36(1) — square ABCD, F the foot of the perpendicular from
C to AE, find ∠DCF — could not be built from the pasted page: at that resolution
neither *what the 30° subtends* nor *what point G is* was legible, and both
change the construction. A guessed reading produces a figure whose own marked
angle is false, looks finished, and is permanently un-diagnosable (rule A2/A4).

---

## H. Question/answer layer rules

**H1. Draw the question and the answer as different layer states.** The question
shows givens and unknowns; the answer adds the proof marks.  A solution figure
for midpoint theorem or centroid work should add ticks, dotted auxiliaries,
heavier argued segments, and derived values.  Do not merely copy the question
figure and append answer text.

**H2. Midpoint and centroid constraints are coordinate constraints.** If the
solution says M is a midpoint, compute it with `midpoint()`.  If G is a
centroid on median BM, compute it with `along(B, M, 2 / 3)`.  If nested midpoint
conditions force trisection points, solve those constraints instead of placing
the points by eye.

**H3. Captions and proof text must not share seats with geometry labels.**
`図1`, `図2`, theorem snippets, and answer text are a separate layout layer.
Make a reserved side column or vertical gap for them before tuning labels.
Audit catches clipping, but only a visual pass catches text that is technically
inside the board while overlapping another label.

**H4. Use compact textbook notation inside figures.** English prose inside a
rendered geometry asset reads like app UI, not like the source page.  Prefer
short Japanese theorem phrases, formulas, and `Ans.` result lines; keep longer
explanation in the surrounding solution text.

**H5. Margin theorem diagrams are sparse theorem reminders.** They carry only
the marks needed to state the theorem: midpoint ticks and `MN // BC` /
`MN = 1/2 BC`, or medians through a centroid with one `2:1` cue.  They should
not inherit the problem's unknowns, values, or full proof layer.

**H6. A compare run does not cover figures without crops.** `render.py` can
audit every figure, but `compare.py` only emits side-by-side images where
`figures/reference/<name>.png` exists.  For new figures, add crops first; without
them, use a contact sheet against older renders and report that the comparison
is style-level rather than source-level.
The cost of holding was one question: told the 30° is ∠DEC, the rest fell out
(E on BD produced, ∠DCF = 15°, and triangle ACE equilateral) and F2 then
confirmed it three ways. G is still unread, so the figure ships without it and
says so. Name what is missing, ship what is verified, and do not fill the gap
with something plausible.

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

## G. When a rule belongs in an element, not in the prompt

**G1. A placement rule the model cannot check from the code belongs in the
element that draws the mark.** The angle notation is now two JSXGraph elements
in ai-tutor (`anglemark`, `equalangle`, in src/interfaces/module/figure_gen/js/,
injected into the figure by board_extensions.py like `dimension`). Four
decisions moved out of the prompt and into code that re-runs on every board
update, when the finished figure exists to be measured:

| decision | rule it enforces |
|---|---|
| interior sweep — arms swapped when [from, at, to] passes 180° | A1 |
| value seated on the bisector beyond the arc; moved out until `2·d·sin(θ/2)` holds it; past a cap, stepped across the arm | B2, B3 |
| second mark at a vertex takes ×1.4 radius; second VALUE seats outside the first | B8 |
| 90° with no text → corner square; lone letter → italic; glyph groups ● ○ × at one radius, no arc | C2, B6 |

Every size is in label heights, not board units: a board unit is a different
amount of ink on every figure, an em is not.

**G2. A filled glyph drawn through a style layer that caps every fill is a
thick STROKE, not a fill.** ai-tutor's monochrome layer caps `fillOpacity` on
every create to a light tint, so a black ● built as a filled circle comes out
grey. Draw the circle at half the glyph radius with a stroke as wide as the
glyph and the stroke alone fills it.

**G5. B10, B11, B12 and the mark-before-label pass are element rules, not
prompt rules.** Each is a fact about the finished drawing that the model cannot
see from the code it just wrote, and each re-decides itself on every board
update:

| decision | rule it enforces |
|---|---|
| a ratio unit strokes its enclosure round the rendered glyph, because U+20DE / U+20E4 are not in the face | B10 |
| `dimension` clamps its sagitta to 0.3 of the chord instead of emitting a major arc | B11 |
| `dimension` insets both ends, in em and not in span-fractions, when its endpoints are named points | B12 |
| the staggered brace of a pair is chosen by chord length, not by drawing order | B9, B11 |
| the label pass runs after every mark has claimed its wedge | B4 |

**G12. The vertex letter's seat is the largest single rule that had to leave
the prompt.** ai-tutor told the generator to write `label: {offset: [dx, dy]}`
and to "pick the offset direction that lands in FREE space — not on a segment,
arc, fill, angle mark, or another label". That is a claim about the finished
figure, and the generator has never seen one; every offset it writes is a guess.
The rule is now a pass over the finished board (`board_style.py`, emitted
between the construction and the auto-fit, since the frame is measured from the
labels). It reproduces the hand-drawn figures exactly from a construction whose
every offset was the same wrong `[10, 10]`:

| what the pass measures | rule |
|---|---|
| the direction of every stroke meeting the point, curves walked over their parameter range | B4 |
| a stroke passing THROUGH the point occupies BOTH directions along it | B5 |
| the tie at a crossing — vertical angles are equal by construction — broken outward, away from the figure's own ink | B4 (degenerate case) |
| a gap that is widest but has ink at the letter's own radius (an angle arc, a brace) is skipped for the next one | B4, B8 |
| the seat is a fixed 0.95 font sizes out, and no two letters take one seat | B2 |

What stays in the prompt is what the model alone knows: which points exist and
what they are called. What leaves is every judgement about the drawing.

**G13. Side notation is the SAME element as the length, and which element a
mark takes is decided by what it can attach to.** An equal-length mark is the
third thing that can be said about a segment, after its length and its share of
a ratio, so it is `dimension` with no value: `{marks: 1|2|3}` for tick strokes,
`{glyph: 'circle'|'cross'}` for a glyph on the line. It sits on the segment,
carries no number, and has no side to choose, so none of the placement
machinery applies to it.
It does not replace `hatch`, which is already the tick mark on a whole segment.
The split is mechanical: **`hatch` takes a segment ELEMENT, so a mark on a PART
of a divided side has nothing to attach to** — AE where the drawn segment is AB
— and creating helper sub-segments to carry the marks puts three strokes on one
path, which is a defect a figure of 例題37 actually shipped with. `dimension`
takes the two endpoints, so a division needs no helpers.
Two sizes that are not interchangeable: the tick half-length is `tickLength`
(0.45 em, calibrated for the bar form's ends) and the glyph radius is its own
0.17 em. Drawn at `tickLength` a circle is nearly as wide as a letter and reads
as a ring hung on the side rather than a mark on it.

**G14. A fixed-point loop cannot converge if the setter silently transforms
your request — adding passes is not a fix.** The auto-fit measures what the
figure drew, pads it, and hands the box to `setBoundingBox(box, true)`. With
`keepaspectratio` the board reshapes a box whose aspect differs from its
container's, and it does so by taking the box IN on the wide axis: 641px of
geometry ended up in a 627px frame, with the figure's own corner vertices
outside it. No number of passes helps, because every pass measures the same
content, asks for the same box and gets the same trim — the loop had converged,
on the wrong answer. Twelve passes and an early exit changed nothing. The fix is
to expand the box to the frame's aspect first, so the reshape is a no-op.
Two things worth carrying: the frame-fill audit had been reporting >100% all
along and that is a *finding*, not a rounding artefact; and when a loop will not
converge, find out what the setter does to the value before adding iterations.

**G15. "No figure drawn before this changes" is not a property worth keeping
when the figures were wrong.** B11's sagitta floor — an arc may never sit closer
to its segment than a bare number would — was applied to enclosed units only,
deliberately, so that no existing figure would move. The rendered audit then
found the `6` of 例題37(1) sitting on the BD stroke: FG is short, and 0.08 of
its span puts the value straight back on the line the brace lifted it off. The
floor now applies to a bare length too. A scope chosen to avoid churn is a
scope chosen for the wrong reason.

**G6. An attribute the element reads must be named in LOWER CASE.**
`JXG.copyAttributes` returns every key lower-cased, so `attr.tickLength` comes
back `undefined` however the Options block spells it, `undefined * height` is
NaN, and a path breaks at a non-finite coordinate — so the bar form had been
rendering as a bare bar with no end ticks since it was written, silently. Read
`attr.ticklength`. This is the fourth member of the same family as a clipped
label, a missing Unicode enclosure, `Composition.add`'s arity and the
`initBoard` options deep-copy: nothing throws, an element is still on the board,
and part of the mark is simply not there.

**G7. A knock-out plate cannot live inside a drawn enclosure.** The plate is the
glyph's line box, about 1.15 em tall; a 四角数字 is 0.88 em square. A plate
sized to the text therefore overhangs the box it sits in and erases the middle
of its top and bottom edges — the mark reads as `[2]`. Enlarging the box to
swallow the plate gives the unit the wrong proportions, and filling the shape
instead is not available (G2: the style layer caps every fill). So an enclosed
unit takes no plate, and its interior is simply not knocked out — which is also
true of the circle and the triangle, so at least it is consistent.

**G8. An enclosed unit is always braced, and a span too short to hold one falls
back to a bare glyph.** A bare *length* can be set plain because the number is
its own measurement; a bare *ratio unit* cannot, because a glyph beside a
segment reads as a caption on nothing — what says "this stretch is 2 units" is
the brace. But the enclosure is wide, and on a short sub-segment the gap the
SHAPE needs eats the chord and leaves two 2px stubs under a circle. The page
does the same thing there and sets the unit bare, so the element falls back
rather than draw a cup. Both decisions need the finished figure, so both belong
here and not in the prompt.
The same width is why the arc's depth needs a FLOOR as well as B11's cap for an
enclosed unit: a sagitta given as a fraction of the span drops a whole circled
digit within a hair of the segment it measures. The floor is the clearance the
plain form already keeps — *an arc may never sit closer to its segment than a
bare number would.*

**G9. A rule the model can get wrong in the CODE belongs in the validator, not
in the element.** G1 sends placement rules to the element because the model
cannot see the finished figure. The complement: a rule about how the value is
SPELLED is visible in the emitted source, so it is statically checkable and
belongs in the gate. `{name: '②'}` is the case — a pre-composed circled digit
gets a second circle drawn around it, and the boxed and triangled forms are not
characters at all. Told once in the prompt, it will still be emitted; a regex
over the enclosed-alphanumerics ranges catches it every time.
Same split for the count: the gate cannot match one element to one annotation
(variable names are the generator's choice), but it can require that as many
dimensions name a unit system as the spec has ratio units.

**G10. A shared vocabulary feeding two gates is never widened in place.**
`_length_annotations` fed the 2D dimension gate AND the 3D dimension-arc gate.
Adding the ratio spellings to it would have silently started demanding a
`curve3d` for every ratio in every 3D figure — a mark the 3D recipe cannot draw,
since it has no enclosure. Two sets and one parameterised reader; the 3D gate
keeps the length set alone.

**G11. Verify a prompt or KB addition by rendering the prompt the model will
see, not by reading the file you edited.** ai-tutor's KB formatter truncates an
element's description at 400 characters and emits only the FIRST example
(`break  # one example per element keeps the context prompt-sized`). The first
attempt at the ratio entry appended a sentence to a description already at the
cap and added the ratio example second: both were silently dropped, the dict
looked right, and `enclose` reached the generator as a bare attribute name with
no example. One `retrieve_context(['ratio'])` call found it. The same check
shows `anglemark`'s 721-character description losing its last third today.

**G3. "Emitted only when the spec calls for it" must be asserted at the
production call site, not only in a test that passes the flag by hand.** The
`dimension` element shipped with `dimensions=True` in its unit tests and
`dimensions=` at neither of the two production `_board_init_code()` call
sites, so no generated figure ever received it. The test proved the switch
worked and never that it was thrown.

**G4. Check the element on every renderer that will run it, and know which
picture is the renderer's.** Two verified here: the evaluation renderer
(jsxgraph 1.11.1 from CDN) and the web build (1.12.2 from npm). The geometry
agreed on both; the labels did not — the evaluation template still carries its
own bold-sans halo from before the style layer moved generation-side, and no
serif face ever reaches it. A comparison render that shows bold sans is
reporting that template, not the element. Likewise the auto-fit clipping a wide
figure in a fixed 900×420 frame is the fit assuming a container already shaped
to `figureAspectRatio`, and reproduces with the element removed.

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
author. In ai-tutor the same audit is `evaluation/utils/notation_audit.py`, run
by `evaluation.execute.run_extension_audit` (the elements alone) and before the
LLM judge inside `evaluation.execute.run_figure_generation` — and it also checks
each mark the source figure shows (`expected_notation`) reached the page through
the right element, which is the question an extension has to answer.

**E8. Verify an EXPECTED value by measuring the drawn geometry, not by reading
the figure.** The ai-tutor audit reports every `anglemark`'s measured sweep.
That is how a wrong given in the evaluation dataset was caught: a "right angle
at F" written into 例題35(1) measured 115°, because the perpendicular belongs to
例題36(1) and had been carried across by memory. A test set is a reading of the
source too, and rule F2 applies to it.

**E10. A mark whose correctness is invisible must expose its decision.** The
audit cannot read a design choice off pixels: whether a ratio unit's shape is a
circle or a box, which side a brace chose, whether a value was braced or set
plain. `dimension` exposes `Enclose()`, `Style()` and `Side()`, `anglemark`
exposes `Value()`. Observability is a design requirement for these elements, not
an afterthought — without it the only checkable thing is that *some* element
exists, which is what the code gates already do.

**E9. Audit in the frame the host will give the figure, never a fixed one.**
`board.figureAspectRatio` is stamped for the host to shape its container BEFORE
the auto-fit runs; a fixed frame of another aspect makes the fit clip both ends
and every label there reports as cut off. A width floor must grow the height,
not clamp the width — and size the frame by its **diagonal**, not by one side:
the style layer sets type as a fraction of the diagonal, so a fixed height made
a 4.25 figure ask for a 103px font and the auto-fit never converged. Confirm any
residual clipping with a control render that removes the element under test —
identical clipping means the frame, not the element.

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
8. The answer is invariant under the figure's free parameters: rebuild it on
   three random admissible shapes and compare (A7). This is the only check in
   the list that validates the *reading* rather than the drawing, and it is the
   cheapest one here.
9. The frame is computed from what the figure DRAWS, by a tool, not by the
   author (`refit.py`). It renders the figure, unions the SVG's bbox with every
   label's client rect, maps that back through the board transform and rewrites
   `boundingbox` and `@size` with half a letter height of margin. Hand
   arithmetic over rendered HTML boxes is what left three figures loose and four
   with a clipped letter — and one change of proportions invalidates every
   hand-computed frame in the set at once. Run it TWICE: the first pass measures
   inside the old frame, so whatever the old frame clipped is measured short.
10. A compare sheet against the original, at matched height, for every figure
    that has a source panel (`compare.py`). It is the only check that catches a
    wrong SHAPE: a render alone looked right for two sessions with its rise a
    quarter too tall.

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

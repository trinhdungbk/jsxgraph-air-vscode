// GENERATED from figures/_lib.js + 02-q2-triangle/figure.js -- edit figure.js
// ---------------------------------------------------------------------------
// JP textbook notation primitives  (prepended to every figure by render.py)
// ---------------------------------------------------------------------------
// Nothing here creates a JSXGraph `point`. Every mark is a `curve`, a `segment`
// or a `text`. Two reasons: a point is draggable and would let a reader break
// the figure, and JSXGraph draws a visible dot for it by default -- but a
// Japanese textbook puts a dot ONLY on a circle centre, a moving point or a
// division point, never on a polygon vertex.

var INK = { strokeColor: 'black', strokeWidth: 1.4, fixed: true, highlight: false };
var DOTTED = {
    strokeColor: 'black', strokeWidth: 1.4, fixed: true, highlight: false,
    dash: 1, lineCap: 'round'
};
var SERIF = 'font-family:"Times New Roman",Times,serif;';

var HEAD_LEN = 0.30, HEAD_HALF = 0.11;

// Type is sized in BOARD UNITS, not pixels, so a figure keeps the textbook's
// letter-to-figure proportion whatever canvas it is rendered at. Measured off
// the source scan: a vertex letter's em box is a little over half the length of
// a short construction step. Getting this wrong is the single most visible way
// a reproduction stops looking like the book -- px-sized type silently shrinks
// as the board grows.
var TYPE = 0.62;
function px(units) { return units * board.unitX; }

function rad(d) { return d * Math.PI / 180; }
function polar(p, r, a) { return [p[0] + r * Math.cos(a), p[1] + r * Math.sin(a)]; }
function dir(p, q) { return Math.atan2(q[1] - p[1], q[0] - p[0]); }
function midpoint(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }

// An arc is always drawn counter-clockwise from `from`; lifting `to` above
// `from` is what keeps a 20-degree wedge from rendering as its 340-degree
// reflex complement.
function sweep(from, to) { while (to < from) { to += 2 * Math.PI; } return to; }

function text(x, y, s, ax, ay, size) {
    return board.create('text', [x, y, s], {
        anchorX: ax || 'middle', anchorY: ay || 'middle',
        fontSize: px(size || TYPE), strokeColor: 'black',
        cssStyle: SERIF, fixed: true, highlight: false
    });
}

// Label placed radially out from `p` -- the only way to keep a label clear of
// the strokes that meet at a vertex without hand-tuning pixel offsets.
function at(p, r, a, s, size) {
    var q = polar(p, r, a);
    return text(q[0], q[1], s, 'middle', 'middle', size);
}

function seg(p, q, style) { return board.create('segment', [p, q], style || INK); }

function path(pts, style) {
    return board.create('curve', [
        pts.map(function (p) { return p[0]; }),
        pts.map(function (p) { return p[1]; })
    ], style || INK);
}

function closed(pts, style) { return path(pts.concat([pts[0]]), style); }

function arc(v, r, from, to, style) {
    var end = sweep(from, to);
    return board.create('curve', [
        function (t) { return v[0] + r * Math.cos(t); },
        function (t) { return v[1] + r * Math.sin(t); },
        from, end
    ], style || INK);
}

// Arc plus its value, the value sitting `gap` beyond the arc on the bisector.
function angleMark(v, r, from, to, s, gap, size) {
    var end = sweep(from, to);
    arc(v, r, from, end);
    if (s) { return at(v, r + gap, (from + end) / 2, s, size); }
}

// The equal-angle marks: filled for the first group, open for the second.
function mark(v, r, from, to, filled) {
    var c = polar(v, r, (from + sweep(from, to)) / 2), rr = 0.075;
    return board.create('curve', [
        function (t) { return c[0] + rr * Math.cos(t); },
        function (t) { return c[1] + rr * Math.sin(t); },
        0, 2 * Math.PI
    ], {
        strokeColor: 'black', strokeWidth: 1.2, fixed: true, highlight: false,
        fillColor: filled ? 'black' : 'white', fillOpacity: 1
    });
}

// None of JSXGraph's seven built-in arrow heads is an open V of straight
// strokes: types 1-2 and 4-6 are filled, 3 is a bar, and 7 -- the only unfilled
// one -- draws its wings as Bezier curves. So the head is two plain strokes
// drawn back from the tip.
function arrowHead(tip, a, scale) {
    var len = HEAD_LEN * (scale || 1), half = HEAD_HALF * (scale || 1),
        ux = Math.cos(a), uy = Math.sin(a),
        bx = tip[0] - ux * len, by = tip[1] - uy * len;
    return board.create('curve', [
        [bx - uy * half, tip[0], bx + uy * half],
        [by + ux * half, tip[1], by - ux * half]
    ], INK);
}

// The auxiliary-line arrow in the book is a small solid triangle, unlike the
// open V that terminates l and m -- a filled head reads as "direction of the
// construction", an open one as "this line continues".
function solidHead(tip, a, scale) {
    var len = HEAD_LEN * (scale || 1), half = HEAD_HALF * (scale || 1),
        ux = Math.cos(a), uy = Math.sin(a),
        bx = tip[0] - ux * len, by = tip[1] - uy * len;
    return board.create('curve', [
        [tip[0], bx - uy * half, bx + uy * half, tip[0]],
        [tip[1], by + ux * half, by - ux * half, tip[1]]
    ], {
        strokeColor: 'black', strokeWidth: 1, fixed: true, highlight: false,
        fillColor: 'black', fillOpacity: 1
    });
}

// Circled step numbers. They carry no arc of their own: the book drops the
// bare glyph into the wedge, and an arc would collide with the 108 marks that
// already sit at the same vertices.
var CIRCLED = ['&#9312;', '&#9313;', '&#9314;', '&#9315;', '&#9316;', '&#9317;'];
function step(v, dist, from, to, n, size) {
    return at(v, dist, (from + sweep(from, to)) / 2, CIRCLED[n - 1], size);
}

// Intersection of line p1p2 with line q1q2, as plain coordinates -- JSXGraph's
// own 'intersection' element would create a draggable point with a visible dot.
function meet(p1, p2, q1, q2) {
    var a1 = p2[1] - p1[1], b1 = p1[0] - p2[0], c1 = a1 * p1[0] + b1 * p1[1],
        a2 = q2[1] - q1[1], b2 = q1[0] - q2[0], c2 = a2 * q1[0] + b2 * q1[1],
        det = a1 * b2 - a2 * b1;
    return [(b2 * c1 - b1 * c2) / det, (a1 * c2 - a2 * c1) / det];
}

// Emphasis weight for the congruent pair a solution figure is arguing about.
// The book distinguishes them by weight alone -- never by colour or by dashing,
// which is reserved for auxiliary lines.
var HEAVY = { strokeColor: 'black', strokeWidth: 2.8, fixed: true, highlight: false };
var SHADE = { strokeColor: 'black', strokeWidth: 0.9, fixed: true, highlight: false };

// A curve's path breaks at any non-finite coordinate, so one element can carry a
// whole set of unconnected strokes. Hatching and tick marks would otherwise cost
// one JSXGraph object per stroke.
function strokeSet(runs, style) {
    var xs = [], ys = [];
    runs.forEach(function (run) {
        xs.push(run[0][0], run[1][0], NaN);
        ys.push(run[0][1], run[1][1], NaN);
    });
    return board.create('curve', [xs, ys], style || INK);
}

// Parameter interval of the line origin + t * step lying inside a convex
// counter-clockwise polygon, or null when the line misses it.
function clipToPolygon(pts, origin, step) {
    var lo = -Infinity, hi = Infinity, i, p, q, nx, ny, denom, gap, t;
    for (i = 0; i < pts.length; i++) {
        p = pts[i];
        q = pts[(i + 1) % pts.length];
        nx = p[1] - q[1];
        ny = q[0] - p[0];
        denom = step[0] * nx + step[1] * ny;
        gap = (origin[0] - p[0]) * nx + (origin[1] - p[1]) * ny;
        if (Math.abs(denom) < 1e-12) {
            if (gap < 0) { return null; }
        } else {
            t = -gap / denom;
            if (denom > 0) { lo = Math.max(lo, t); } else { hi = Math.min(hi, t); }
        }
    }
    return hi - lo > 1e-9 ? [lo, hi] : null;
}

function counterClockwise(pts) {
    var area = 0, i, p, q;
    for (i = 0; i < pts.length; i++) {
        p = pts[i];
        q = pts[(i + 1) % pts.length];
        area += p[0] * q[1] - q[0] * p[1];
    }
    return area > 0 ? pts : pts.slice().reverse();
}

// The region a question asks for is marked by 45-degree hatching, never a grey
// tint: the page is monochrome line art and a tint prints as a muddy block.
function hatch(region, spacing, angleDeg) {
    var ring = counterClockwise(region),
        a = rad(angleDeg === undefined ? 45 : angleDeg),
        step = [Math.cos(a), Math.sin(a)],
        nx = -step[1], ny = step[0],
        depth = ring.map(function (p) { return p[0] * nx + p[1] * ny; }),
        lo = Math.min.apply(null, depth),
        hi = Math.max.apply(null, depth),
        gap = spacing || 0.45,
        runs = [], d, origin, span;
    for (d = Math.ceil(lo / gap) * gap; d < hi; d += gap) {
        origin = [nx * d, ny * d];
        span = clipToPolygon(ring, origin, step);
        if (span) {
            runs.push([polar(origin, span[0], a), polar(origin, span[1], a)]);
        }
    }
    return strokeSet(runs, SHADE);
}

// Equal-length marks: n ticks across the midpoint, one tick count per
// equivalence class. Sized in board units like the type, so the ticks keep
// their proportion to the figure whatever canvas it renders at.
function ticks(p, q, n, size) {
    var a = dir(p, q), half = size || 0.16,
        along = a, across = a + Math.PI / 2,
        centre = midpoint(p, q),
        runs = [], i, base;
    for (i = 0; i < n; i++) {
        base = polar(centre, (i - (n - 1) / 2) * half * 1.3, along);
        runs.push([polar(base, -half, across), polar(base, half, across)]);
    }
    return strokeSet(runs);
}

// The right angle is a corner square, not an arc -- an arc at 90 degrees is
// indistinguishable from any other angle mark in the same figure.
function rightAngle(v, a1, a2, size) {
    var s = size || 0.42, p = polar(v, s, a1), q = polar(v, s, a2);
    return path([p, [p[0] + q[0] - v[0], p[1] + q[1] - v[1]], q]);
}

// A length in these pages is not a straight witness line with tick ends: it is
// a shallow arc spanning the two endpoints, BROKEN at its apex by the value.
// The mark reads as two strokes reaching out from the number to the endpoints,
// so the gap is cut in the curve and sized to the glyphs -- a white box behind
// the text is not the same thing: it notches the curve with a straight edge and
// knocks a hole in whatever else runs behind, the base line included.
// `side` is +1 to bulge left of p->q, -1 to bulge right; `bulge` is the sagitta
// in board units, so two dimensions sharing a baseline can be stacked by giving
// them different bulges instead of overlapping. Both must take the SAME side.
function dimension(p, q, str, bulge, side) {
    var h = bulge || 0.5,
        s = side === undefined ? -1 : side,
        chord = Math.sqrt((q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1])),
        outward = dir(p, q) + s * Math.PI / 2,
        mid = midpoint(p, q),
        // Circle through p, q and the apex: R = h/2 + chord^2/(8h).
        r = (chord * chord / 4 + h * h) / (2 * h),
        // h - r is negative, so this steps AWAY from the bulge.
        centre = polar(mid, h - r, outward),
        apex = polar(mid, h, outward),
        from = dir(centre, p),
        to = dir(centre, q),
        // Of the two arcs between p and q, take the one the apex lies on.
        a0 = sweep(from, dir(centre, apex)) <= sweep(from, to) ? from : to,
        a1 = a0 === from ? to : from,
        label = text(apex[0], apex[1], str),
        // Absolute angles from here on. a1 is a raw atan2 value and may be
        // numerically BELOW the apex angle; feeding that to arc() lets sweep()
        // lift it by a full turn and the mark comes out as a whole circle.
        span = sweep(a0, a1) - a0,
        end = a0 + span,
        mid_a = a0 + span / 2,
        // Measured off the rendered glyphs, not guessed from the character
        // count: '3' and '10' need very different gaps, and the node exists as
        // soon as the text does.
        half = labelHalfWidth(label, str),
        cut = Math.min(half / r, span / 2 * 0.72);
    arc(centre, r, a0, mid_a - cut);
    arc(centre, r, mid_a + cut, end);
    return label;
}

// Half the rendered width of a label, in board units, plus the breathing space
// a break needs either side of it.
function labelHalfWidth(label, str) {
    var node = label && label.rendNode,
        size = px(TYPE),
        w = node && node.offsetWidth ? node.offsetWidth : 0.6 * size * String(str).length;
    return (w / 2 + 0.4 * size) / board.unitX;
}

// @size 613 470
// 例題34 (2) 問題 -- angle A = 66, angles B and C each cut into three equal
// parts (same mark = same size), find x = angle BDC.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.4, 8.8, 11.4, -1.1],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The book's own numbers, recovered from the answer: 66 + 3a + 3b = 180 gives
// a + b = 38, and the drawn triangle reads as 50/64 at B and C. Picking any
// other pair would still "look like a triangle" but the trisectors would no
// longer land where the printed figure puts them.
var ANG_B = 50, ANG_C = 64;
var a = ANG_B / 3, b = ANG_C / 3;

var B = [0, 0], C = [10, 0];

// Apex from the two base angles rather than a guessed coordinate, so angle A
// really is 180 - 50 - 64 = 66 instead of merely looking like it.
function apex(base1, base2, ang1, ang2) {
    var t1 = Math.tan(rad(ang1)), t2 = Math.tan(rad(ang2)),
        x = (base2[0] - base1[0]) * t2 / (t1 + t2);
    return [base1[0] + x, x * t1];
}
var A = apex(B, C, ANG_B, ANG_C);

// Ray from a base vertex at `deg` above the base line, as a far-away point.
function fromB(deg) { return polar(B, 40, rad(deg)); }
function fromC(deg) { return polar(C, 40, rad(180 - deg)); }

var D = meet(B, fromB(a), C, fromC(b));

// The outer trisector is NOT drawn to the far side: the book stops it where it
// crosses the other vertex's inner trisector produced beyond D. That is what
// makes it read as a stub hanging in space, and it is the detail that most
// obviously gives the figure away if you draw a full cevian instead.
var stubB = meet(B, fromB(2 * a), C, D);
var stubC = meet(C, fromC(2 * b), B, D);

closed([A, B, C]);
seg(B, D); seg(D, C);
seg(B, stubB); seg(C, stubC);

text(A[0], A[1] + 0.34, 'A', 'middle', 'bottom');
text(B[0] - 0.34, B[1] - 0.12, 'B', 'right', 'middle');
text(C[0] + 0.34, C[1] - 0.12, 'C', 'left', 'middle');

angleMark(A, 1.15, dir(A, B), dir(A, C), '66&deg;', 1.05);
// B before C, not C before B: the arc always sweeps counter-clockwise from
// the first direction, and (C, B) traces the 218-degree reflex angle over the
// top of D instead of the 142 degrees underneath it that the question asks for.
angleMark(D, 0.72, dir(D, B), dir(D, C), '<i>x</i>', 0.78);

// Equal-angle marks: filled at B, open at C -- one per wedge, all at the same
// radius so the three read as one group.
var RB = 1.62, RC = 1.52;
mark(B, RB, 0, rad(a), true);
mark(B, RB, rad(a), rad(2 * a), true);
mark(B, RB, rad(2 * a), rad(3 * a), true);
mark(C, RC, rad(180 - b), Math.PI, false);
mark(C, RC, rad(180 - 2 * b), rad(180 - b), false);
mark(C, RC, rad(180 - 3 * b), rad(180 - 2 * b), false);

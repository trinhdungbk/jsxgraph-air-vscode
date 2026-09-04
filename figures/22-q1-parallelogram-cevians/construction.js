// GENERATED from figures/_lib.js + 22-q1-parallelogram-cevians/figure.js -- edit figure.js
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
// The point t of the way from p to q. A division point given as a ratio is
// placed with this rather than typed in as coordinates -- 1:2 has to be true of
// the finished drawing, not merely written beside it.
function along(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }

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
function dimension(p, q, str, bulge, side, kind) {
    var g = bulgeArc(p, q, bulge || 0.5, side === undefined ? -1 : side),
        label = text(g.apex[0], g.apex[1], str),
        // Measured off the rendered glyphs, not guessed from the character
        // count: '3' and '10' need very different gaps, and the node exists as
        // soon as the text does. An enclosed unit is wider than its digit.
        half = kind ? enclose(label, kind) + 0.30 * TYPE : labelHalfWidth(label, str),
        // Absolute angles from here on. The far end is a raw atan2 value and may
        // be numerically BELOW the apex angle; feeding that to arc() lets
        // sweep() lift it by a full turn and the mark comes out as a whole
        // circle across the figure.
        mid_a = g.a0 + g.span / 2,
        cut = Math.min(half / g.r, g.span / 2 * 0.72);
    arc(g.centre, g.r, g.a0, mid_a - cut);
    arc(g.centre, g.r, mid_a + cut, g.a0 + g.span);
    return label;
}

// A brace inset from the two points it bounds. A brace that reaches its own
// endpoint arrives exactly where that point's letter is, and neither can give
// way -- the letter belongs at the point and the brace belongs under the span.
// The inset is an absolute distance, NOT a fraction of the span: the letter it
// has to clear is the same size on a span of 2 as on a span of 8, and a
// fractional inset leaves the short span's letter touching the arc.
function braceOn(p, q, str, bulge, side, kind, inset) {
    var d = inset === undefined ? 0.5 * TYPE : inset;
    return dimension(polar(p, d, dir(p, q)), polar(q, d, dir(q, p)),
                     str, bulge, side, kind);
}

// Half the rendered width of a label, in board units, plus the breathing space
// a break needs either side of it.
function labelHalfWidth(label, str) {
    var node = label && label.rendNode,
        size = px(TYPE),
        w = node && node.offsetWidth ? node.offsetWidth : 0.6 * size * String(str).length;
    return (w / 2 + 0.4 * size) / board.unitX;
}

// ---------------------------------------------------------------------------
// Ratio units
// ---------------------------------------------------------------------------
// 比の合成 works by carrying two ratios in DIFFERENT unit systems until they are
// scaled to a common one, and the page tells the systems apart by the shape
// around the digit: circled, boxed, triangled. Drop the shapes and the figure
// stops meaning anything -- (1) reads "1 : 2" against "3 : 1" with no way to
// see that the units differ.
//
// Only the circled digits exist in Unicode. U+20DE and U+20E4, the combining
// enclosing square and triangle, are absent from Times New Roman: they render
// as nothing at all, silently, which is exactly the failure E5 was written for.
// So the box and the triangle are STROKED around the glyph at its measured
// size.

var GLYPH = { strokeColor: 'black', strokeWidth: 1.1, fixed: true, highlight: false };

// Draws the enclosure around an existing label and returns its half-width in
// board units, so a caller that has to make room for the mark can ask for it.
function enclose(label, kind) {
    var w = label.rendNode.offsetWidth / board.unitX,
        h = label.rendNode.offsetHeight / board.unitY,
        x = label.X(), y = label.Y(), s, r;
    if (kind === 'box') {
        s = Math.max(w + 0.44 * TYPE, 0.88 * TYPE) / 2;
        closed([[x - s, y - s], [x + s, y - s], [x + s, y + s], [x - s, y + s]], GLYPH);
        return s;
    }
    // An upward triangle wastes its lower corners, so the digit needs a bigger
    // circumradius than a box of the same apparent weight. The glyph sits at
    // the centroid, which for an equilateral triangle is also the incentre.
    r = Math.max(w, 0.62 * h) * 1.30;
    closed([polar([x, y], r, rad(90)), polar([x, y], r, rad(210)),
            polar([x, y], r, rad(330))], GLYPH);
    return r * 0.87;
}

// One ratio unit, free-standing: unit(x, y, 3, 'circle') is the glyph, the two
// others are a digit inside a drawn shape.
function unit(x, y, n, kind, size) {
    var label;
    if (kind === 'circle') { return text(x, y, CIRCLED[n - 1], 'middle', 'middle', size); }
    label = text(x, y, String(n), 'middle', 'middle', size);
    enclose(label, kind);
    return label;
}

// The circle through p and q whose apex stands `h` off the chord, `s` = +1 to
// bulge left of p->q. Shared by every brace-shaped mark so they cannot drift
// apart; `forward` says whether the counter-clockwise sweep runs p->q, which is
// what an arrowhead needs and an unheaded brace does not.
function bulgeArc(p, q, h, s) {
    var dx = q[0] - p[0], dy = q[1] - p[1],
        chord = Math.sqrt(dx * dx + dy * dy),
        outward = dir(p, q) + s * Math.PI / 2,
        mid = midpoint(p, q),
        r = (chord * chord / 4 + h * h) / (2 * h),
        centre = polar(mid, h - r, outward),
        apex = polar(mid, h, outward),
        from = dir(centre, p),
        to = dir(centre, q),
        a0 = sweep(from, dir(centre, apex)) <= sweep(from, to) ? from : to;
    return {
        centre: centre, r: r, apex: apex, out: outward, a0: a0,
        span: sweep(a0, a0 === from ? to : from) - a0,
        forward: a0 === from
    };
}

// @size 650 464
// 問題 (1) -- parallelogram ABCD with E on AD at AE:ED = (3):(4) and F the
// midpoint of DC. BE and BF cut the diagonal AC at G and H. Find AG:GH:HC.
//
// Two ratios on AC, in two unit systems, composed:
//   AG:GC = AE:CB = (3):(7)   from triangle AGE ~ CGB
//   AH:HC = AB:CF = [2]:[1]   from triangle AHB ~ CHF
// (3):(7) x3 and [2]:[1] x10 both total 30, so AG:GH:HC = 9 : 11 : 10.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.90, 5.28, 7.78, -0.92],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Nothing in the question constrains the parallelogram, so its shape is the one
// thing read off the scan (rule A6): base 124px, rise 88, top shifted right 17.
// This panel and the next disagree about the lean, so each takes its own.
var BASE = 6, RISE = 4.25, LEAN = 0.85;

var B = [0, 0], C = [BASE, 0], A = [LEAN, RISE], D = [BASE + LEAN, RISE];

var E = along(A, D, 3 / 7),
    F = midpoint(D, C),
    G = meet(A, C, B, E),
    H = meet(A, C, B, F);

closed([A, B, C, D]);
seg(A, C);
seg(B, E);
seg(B, F);

ticks(D, F, 1);
ticks(F, C, 1);

// Level, not stacked, even though (3) and (4) differ: B12's inset already opens
// a gap at E wide enough for E's own letter, so the pair cannot read as one
// brace over the whole side -- which is the only thing B9's stagger buys.
braceOn(A, E, CIRCLED[2], 0.42, 1);
braceOn(E, D, CIRCLED[3], 0.42, 1);

at(A, 0.55, rad(129.3), 'A');
at(B, 0.55, rad(219.3), 'B');
at(C, 0.55, rad(309.3), 'C');
at(D, 0.55, rad(39.3), 'D');
// E's arms leave along AD in both directions, so the whole upper half is free
// and the letter goes straight up -- inside the braces' row, at a smaller
// radius than their labels (rule B8's two-radii argument).
at(E, 0.42, rad(90), 'E');
at(F, 0.55, dir(D, C) + Math.PI / 2, 'F');
// G and H each sit on two crossing lines; these are the downward bisectors,
// which is the side the page labels them on.
at(G, 0.50, rad(275.8), 'G');
at(H, 0.50, rad(259.4), 'H');

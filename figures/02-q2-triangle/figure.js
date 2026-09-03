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

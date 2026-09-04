// @size 620 508
// 例題36 (1) 問題 -- parallelogram ABCD with E the midpoint of BC and F on DC
// with DF:FC = 1:2. AE and AF cut the diagonal BD at P and Q. Find BP:PQ:QD.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.95, 7.65, -1.10],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The shape of the parallelogram is the one thing the question does not fix, so
// it is the one thing taken from the scan: base 6, rise 0.82 of the base, top
// side shifted right by 0.12 of it (measured on both panels of the page).
var BASE = 6, RISE = 4.9, LEAN = 0.7;

var B = [0, 0], C = [BASE, 0], A = [LEAN, RISE], D = [BASE + LEAN, RISE];

var E = midpoint(B, C),
    F = along(D, C, 1 / 3);

// P and Q are intersections, so they are computed. Placing them by eye would
// make the answer 4:5:3 false of the drawing while the drawing still looked
// finished.
var P = meet(A, E, B, D),
    Q = meet(A, F, B, D);

closed([A, B, C, D]);
seg(B, D);
seg(A, E);
seg(A, F);

ticks(B, E, 2);
ticks(E, C, 2);

// The DC partition is unequal, so the two braces stack (rule B9); an equal pair
// would have to stay level, because level is what says they are equal.
var OUT = dir(D, C) + Math.PI / 2;     // the outward normal of side DC
dimension(D, F, CIRCLED[0], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

// Every letter on the bisector of its widest gap, arms counted first (rule B4).
at(A, 0.55, rad(130.9), 'A');
at(B, 0.55, rad(220.9), 'B');
at(C, 0.55, rad(310.9), 'C');
at(D, 0.55, rad(40.9), 'D');
at(E, 0.50, rad(270), 'E');
// F sits between side DC and its own braces: the two arcs leave F along DC, so
// the outward normal is the only clear direction, and 0.62 clears the nearer
// arc by a third of a letter.
at(F, 0.62, OUT, 'F');
at(P, 0.50, rad(165.7), 'P');
at(Q, 0.50, rad(100.2), 'Q');

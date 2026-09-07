// @size 700 495
// 例題36 (1) 問題 -- parallelogram ABCD with E the midpoint of BC and F on DC
// with DF:FC = 1:2. AE and AF cut the diagonal BD at P and Q. Find BP:PQ:QD.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.06, 7.86, -1.17],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Measured off the source page as a FILE, not eyeballed off the page in a
// chat: base 143px, rise 0.66 of the base, top side shifted right 0.15 of it.
// Both panels of the page agree to within a pixel. The eyeball estimate had the
// rise 24% too tall and put the two panels at different leans.
var BASE = 6, RISE = 3.96, LEAN = 0.90;

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
dimension(D, F, CIRCLED[0], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

// Arms counted first, letter on the bisector of the widest gap they leave
// (rule B4) -- computed from the arms rather than typed, so a change of
// proportions carries the letters with it instead of stranding them.
labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, E), dir(A, F)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C), dir(B, D)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, B), dir(D, C)], 'D');
labelAt(E, 0.50, [dir(E, B), dir(E, C), dir(E, A)], 'E');
// F's widest gap is the whole outward side, which is where its two braces are
// too: the letter sits inside their apexes (rule B8's two radii).
labelAt(F, 0.62, [dir(F, D), dir(F, C), dir(F, A)], 'F');
labelAt(P, 0.50, [dir(P, B), dir(P, D), dir(P, A), dir(P, E)], 'P', 0, rad(151));
labelAt(Q, 0.50, [dir(Q, B), dir(Q, D), dir(Q, A), dir(Q, F)], 'Q', 0, rad(191));

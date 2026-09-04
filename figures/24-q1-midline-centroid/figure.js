// @size 560 420
// 例題37 (1) 問題 -- midpoint theorem nested twice.  The printed question is
// crowded with shallow length arcs; the topology matters more than metric
// fidelity, but the midpoint relations are still true of the coordinates.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.35, 7.15, -0.65],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var A = [3.05, 4.55], B = [0, 0], C = [6.15, 0];

// The solution says E and D are midpoints of AF and AC, and F is the midpoint
// of BE.  Those two midpoint facts force F and E to be the trisection points of
// AB; deriving them prevents the "solution figure" from lying about the proof.
var F = along(A, B, 1 / 3),
    E = along(A, B, 2 / 3),
    D = midpoint(A, C),
    G = midpoint(B, D);

closed([A, B, C]);
seg(B, D);
seg(F, C);
seg(E, D);
seg(G, C);
seg(F, G);

// The source uses several light arcs over the small triangles.  They behave as
// visual grouping marks, not independent data, so keep them shallow and below
// the vertex labels.
dimension(E, D, '<i>x</i>', 0.26, 1);
dimension(F, G, '6', 0.25, -1);
dimension(G, C, '<i>y</i>', 0.34, -1);

// Small equal-angle style dots from the scan.  They are annotation glyphs, not
// draggable JSXGraph points.
mark(A, 0.56, dir(A, B), dir(A, D), true);
mark(A, 0.86, dir(A, D), dir(A, C), false);
mark(C, 0.60, dir(C, D), dir(C, G), true);
mark(C, 0.90, dir(C, G), dir(C, B), false);

at(A, 0.34, rad(92), 'A');
at(B, 0.34, rad(222), 'B');
at(C, 0.34, rad(318), 'C');
at(D, 0.34, rad(9), 'D');
at(E, 0.30, rad(178), 'E');
at(F, 0.30, rad(180), 'F');
at(G, 0.28, rad(248), 'G');

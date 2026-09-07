// @size 700 560
// 例題37 (2) 問題 -- G is the centroid of triangle ABC, M is on AC, and the
// median BM carries G. Given AM = 6 and GM = 4: x = MC = 6 (the centroid lies
// on the median, so M bisects AC) and y = BG = 4 x 2 = 8 (the centroid divides
// a median 2:1 from the vertex).
//
// The given「G は重心」is page TEXT beside the panel, not part of the drawing,
// so it is not in the figure -- and G's position is derived from it rather than
// placed: G sits two thirds along BM, which is what makes the 2:1 true of the
// coordinates instead of merely written beside them.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.90, 5.33, 6.88, -0.88],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Free shape, taken off the paste and so unreliable (rule A8). This panel's
// apex sits further right than (1)'s.
var BASE = 6, RISE = 4.25, APEX = 3.78;

var B = [0, 0], C = [BASE, 0], A = [APEX, RISE];

var M = midpoint(A, C),
    G = along(B, M, 2 / 3);

closed([A, B, C]);
seg(B, M);

// AM and MC share the line AC, y and 4 share the median: each pair stays level
// and the inset holds the division point's own letter (B9, B12).
braceOn(A, M, '6', 0.42, 1);
braceOn(M, C, '<i>x</i>', 0.42, 1);
braceOn(B, G, '<i>y</i>', 0.42, -1);
braceOn(G, M, '4', 0.42, -1);

labelAt(A, 0.42, [dir(A, B), dir(A, C)], 'A');
labelAt(B, 0.42, [dir(B, A), dir(B, C), dir(B, M)], 'B');
labelAt(C, 0.42, [dir(C, A), dir(C, B)], 'C');
labelAt(M, 0.40, [dir(M, A), dir(M, C), dir(M, B)], 'M');
labelAt(G, 0.40, [dir(G, B), dir(G, M)], 'G');

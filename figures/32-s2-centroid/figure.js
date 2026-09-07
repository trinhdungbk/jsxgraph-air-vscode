// @size 700 560
// 解説37 (2) -- the two centroid facts made visible on the figure: M bisects AC
// because the centroid lies on the median (so x = 6), and the centroid divides
// the median 2:1 from the vertex (so y = 4 x 2 = 8).
//
// The ratio units go ABOVE the median and the lengths stay BELOW it. Four marks
// on one line otherwise queue up on the same side, and a reader cannot tell
// which of them is a measurement and which is a proportion.

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

equalLength(A, M, false);
equalLength(M, C, false);

braceOn(A, M, '6', 0.42, 1);
braceOn(M, C, '<i>x</i>', 0.42, 1);
braceOn(B, G, '<i>y</i>', 0.42, -1);
braceOn(G, M, '4', 0.42, -1);
braceOn(B, G, CIRCLED[1], 0.42, 1);
braceOn(G, M, CIRCLED[0], 0.42, 1);

labelAt(A, 0.42, [dir(A, B), dir(A, C)], 'A');
labelAt(B, 0.42, [dir(B, A), dir(B, C), dir(B, M)], 'B');
labelAt(C, 0.42, [dir(C, A), dir(C, B)], 'C');
labelAt(M, 0.40, [dir(M, A), dir(M, C), dir(M, B)], 'M');
labelAt(G, 0.40, [dir(G, B), dir(G, M)], 'G');

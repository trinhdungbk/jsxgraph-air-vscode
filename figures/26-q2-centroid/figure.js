// @size 520 360
// 例題37 (2) 問題 -- G is the centroid.  The figure asks for the missing half
// of AC and the long part of median BM.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.85, 5.85, 7.95, -0.65],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var A = [3.95, 5.0], B = [0, 0], C = [7.0, 0],
    M = midpoint(A, C),
    G = along(B, M, 2 / 3);

closed([A, B, C]);
seg(B, M);
seg(G, C);

dimension(A, M, '6', 0.22, 1);
dimension(M, C, '<i>x</i>', 0.25, 1);
dimension(G, M, '4', 0.24, -1);
dimension(B, G, '<i>y</i>', 0.34, -1);

mark(G, 0.42, dir(G, B), dir(G, C), false);

at(A, 0.32, rad(92), 'A');
at(B, 0.33, rad(221), 'B');
at(C, 0.33, rad(320), 'C');
at(M, 0.31, rad(15), 'M');
at(G, 0.28, rad(142), 'G');

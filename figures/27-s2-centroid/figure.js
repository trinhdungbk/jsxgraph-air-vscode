// @size 560 380
// 解説37 (2) -- centroid facts made visible: M is the midpoint of AC and G
// divides the median BM in the ratio 2:1 from the vertex.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.85, 5.95, 11.35, -0.75],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var A = [3.95, 5.0], B = [0, 0], C = [7.0, 0],
    M = midpoint(A, C),
    G = along(B, M, 2 / 3);

closed([A, B, C]);
seg(B, M, HEAVY);
seg(G, C, DOTTED);

ticks(A, M, 1, 0.13);
ticks(M, C, 1, 0.13);

dimension(A, M, '6', 0.22, 1);
dimension(M, C, '<i>x</i>', 0.25, 1);
dimension(G, M, '4', 0.24, -1);
dimension(B, G, '<i>y</i>', 0.34, -1);

unit(2.10, 1.48, 2, 'circle', 0.50);
unit(4.55, 2.78, 1, 'circle', 0.50);
text(7.55, 4.60, 'M is midpoint', 'left', 'middle', 0.40);
text(7.55, 3.75, 'BG : GM = 2 : 1', 'left', 'middle', 0.40);
text(7.55, 1.20, 'Ans.  <i>x</i> = 6,  <i>y</i> = 8', 'left', 'middle', 0.40);

at(A, 0.32, rad(92), 'A');
at(B, 0.33, rad(221), 'B');
at(C, 0.33, rad(320), 'C');
at(M, 0.31, rad(15), 'M');
at(G, 0.28, rad(142), 'G');

// @size 520 520
// 例題37 margin note -- the two facts used by the problem: triangle midline
// theorem and centroid ratio.  Margin diagrams are sparse; too many marks make
// them read as another worked example instead of a theorem reminder.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.65, 10.15, 7.65, -0.95],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

function midlineNote(dx, dy) {
    var A = [dx + 2.7, dy + 3.2], B = [dx, dy], C = [dx + 5.4, dy],
        M = midpoint(A, B), N = midpoint(A, C);
    closed([A, B, C]);
    seg(M, N, HEAVY);
    ticks(A, M, 1, 0.11); ticks(M, B, 1, 0.11);
    ticks(A, N, 2, 0.11); ticks(N, C, 2, 0.11);
    at(A, 0.28, rad(90), 'A');
    at(B, 0.28, rad(220), 'B');
    at(C, 0.28, rad(320), 'C');
    at(M, 0.25, rad(170), 'M');
    at(N, 0.25, rad(10), 'N');
    text(dx + 2.7, dy - 0.70, 'M, N が中点  ⇔  MN = 1/2 BC', 'middle', 'top', 0.42);
    text(dx + 2.7, dy - 1.28, 'MN // BC', 'middle', 'top', 0.42);
}

function centroidNote(dx, dy) {
    var A = [dx + 2.7, dy + 3.35], B = [dx, dy], C = [dx + 5.4, dy],
        M = midpoint(B, C), N = midpoint(A, C), P = midpoint(A, B),
        G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    closed([A, B, C]);
    seg(A, M); seg(B, N); seg(C, P);
    ticks(B, M, 1, 0.10); ticks(M, C, 1, 0.10);
    ticks(A, N, 2, 0.10); ticks(N, C, 2, 0.10);
    ticks(A, P, 3, 0.10); ticks(P, B, 3, 0.10);
    unit(along(A, G, 0.48)[0], along(A, G, 0.48)[1], 2, 'circle', 0.42);
    unit(along(G, M, 0.48)[0], along(G, M, 0.48)[1], 1, 'circle', 0.42);
    at(A, 0.28, rad(90), 'A');
    at(B, 0.28, rad(220), 'B');
    at(C, 0.28, rad(320), 'C');
    at(G, 0.25, rad(310), 'G');
    text(dx + 2.7, dy - 0.70, '重心は中線を 2 : 1 に分ける', 'middle', 'top', 0.42);
}

midlineNote(0.55, 6.25);
centroidNote(0.55, 0.35);

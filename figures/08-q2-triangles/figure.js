// @size 700 430
// 例題35 (2) 問題 -- equilateral ABC and equilateral DCE standing on one line
// through B, C, E; P is where BD crosses AE. Find angle BPE.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 4.5, 8.0, -1.0],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The two triangles are independent sizes -- the 120 degrees answer does not
// depend on the ratio, and the book draws the right-hand one smaller.
var BC = 4, CE = 3.2, H = Math.sqrt(3) / 2;

var B = [0, 0], C = [BC, 0], E = [BC + CE, 0],
    A = [BC / 2, BC * H],
    D = [BC + CE / 2, CE * H],
    P = meet(B, D, A, E);

closed([A, B, C]);
closed([D, C, E]);
seg(B, D);
seg(A, E);

text(A[0], A[1] + 0.30, 'A', 'middle', 'bottom');
text(B[0] - 0.16, B[1] - 0.16, 'B', 'right', 'top');
text(C[0], C[1] - 0.30, 'C', 'middle', 'top');
text(D[0] + 0.30, D[1] + 0.10, 'D', 'left', 'middle');
text(E[0] + 0.16, E[1] - 0.16, 'E', 'left', 'top');
// P has four arms. The gap between the one climbing to A and the one climbing
// to D is 120 degrees wide and points almost straight up, so the letter goes on
// that bisector -- an offset picked by hand ends up visibly detached instead.
at(P, 0.44, (dir(P, A) + dir(P, D)) / 2, 'P');

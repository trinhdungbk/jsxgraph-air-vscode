// @size 700 430
// 解説35 (2) -- triangles BCD and ACE are congruent (BC = AC, CD = CE, and the
// included angle is 60 + 60 at C), so the marked angles pair off. The exterior
// angle of triangle DBC at C is 60, hence dot + ring = 60; the same theorem on
// triangle PBE makes angle APB = 60, so angle BPE = 120.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 4.5, 8.0, -1.0],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var BC = 4, CE = 3.2, H = Math.sqrt(3) / 2;

var B = [0, 0], C = [BC, 0], E = [BC + CE, 0],
    A = [BC / 2, BC * H],
    D = [BC + CE / 2, CE * H],
    P = meet(B, D, A, E);

closed([A, B, C]);
closed([D, C, E]);
seg(B, D);
seg(A, E);

// The congruent pair, inked heavy: B-C-D against A-C-E.
seg(B, C, HEAVY);
seg(C, D, HEAVY);
seg(D, B, HEAVY);
seg(A, C, HEAVY);
seg(C, E, HEAVY);
seg(E, A, HEAVY);

text(A[0], A[1] + 0.30, 'A', 'middle', 'bottom');
text(B[0] - 0.16, B[1] - 0.16, 'B', 'right', 'top');
text(C[0], C[1] - 0.30, 'C', 'middle', 'top');
text(D[0] + 0.30, D[1] + 0.10, 'D', 'left', 'middle');
text(E[0] + 0.16, E[1] - 0.16, 'E', 'left', 'top');
at(P, 0.44, (dir(P, A) + dir(P, D)) / 2, 'P');

// The exterior angle that drives the whole argument.
angleMark(C, 0.72, dir(C, E), dir(C, D), '60&deg;', 0.62);

// Both equal-angle groups sit at one radius so each group reads as a set:
// filled for the pair carried by the congruence at B and A, open for the pair
// at D and E.
var MARK_R = 0.95;
mark(B, MARK_R, dir(B, C), dir(B, D), true);
mark(A, MARK_R, dir(A, C), dir(A, E), true);
mark(D, MARK_R, dir(D, B), dir(D, C), false);
mark(E, MARK_R, dir(E, A), dir(E, C), false);

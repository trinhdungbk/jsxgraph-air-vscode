// @size 690 395
// 解説36 (2) 傍注 -- the same extension with the ratio marks stripped out, which
// is what the margin note is for: it shows only WHY the line is produced.
//   triangle FCP ~ FDA   at F, the open pair
//   triangle AGD ~ PGE   at G, the filled pair
// Both similarities rest on a pair of vertical angles, so the marks go there.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.90, 5.90, 11.15, -1.00],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var BASE = 6, RISE = 4.9, LEAN = 0.7;

var B = [0, 0], C = [BASE, 0], A = [LEAN, RISE], D = [BASE + LEAN, RISE];

var E = along(B, C, 1 / 3),
    F = along(D, C, 3 / 5),
    G = meet(A, F, D, E),
    P = meet(A, F, B, C);

closed([A, B, C, D]);
seg(A, F);
seg(D, E);
seg(F, P, DOTTED);
seg(C, P, DOTTED);

// Counter-clockwise arms, or the mark lands in the reflex complement on the
// wrong side of the vertex (rule A1).
mark(G, 0.45, dir(G, D), dir(G, A), true);
mark(G, 0.45, dir(G, E), dir(G, P), true);
mark(F, 0.52, dir(F, D), dir(F, A), false);
mark(F, 0.52, dir(F, C), dir(F, P), false);

at(A, 0.55, rad(130.9), 'A');
at(B, 0.55, rad(220.9), 'B');
at(C, 0.55, rad(285), 'C');
at(D, 0.55, rad(40.9), 'D');
at(E, 0.52, rad(270), 'E');
at(F, 0.62, dir(D, C) + Math.PI / 2, 'F');
// Both of G's wide gaps are spoken for by the vertical-angle marks, so the
// letter takes the widest one LEFT, not the widest one: a mark and a label want
// the same seat, and the mark is the one that cannot move.
at(G, 0.55, rad(189.2), 'G');
at(P, 0.55, rad(346.1), 'P');

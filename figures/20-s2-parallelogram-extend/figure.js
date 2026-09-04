// @size 700 437
// 解説36 (2) -- AF and BC produced to meet at P (角出し), which is what puts
// DG:GE inside a pair of similar triangles:
//   triangle FCP ~ FDA  gives  CP:AD = CF:FD = 2:3, so CP = [3] x 2/3 = [2]
//   triangle AGD ~ PGE  gives  DG:GE = AD:EP = [3] : ([2]+[2]) = 3:4
// Both sides carry their own unit system -- boxed along BC, circled along DC --
// and P lands at 10 on a base of 6 because that is where the givens put it, not
// where the page draws it.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 6.15, 11.15, -1.40],
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

// The extension is the construction, so it is dotted at the figure's own weight
// (rule D2) and runs past F and past C to the same point.
seg(F, P, DOTTED);
seg(C, P, DOTTED);

var OUT = dir(D, C) + Math.PI / 2;

dimension(A, D, '3', 0.55, 1, 'box');
dimension(A, B, CIRCLED[4], 0.50, -1);
dimension(B, E, '1', 0.45, -1, 'box');
dimension(E, C, '2', 0.80, -1, 'box');
dimension(D, F, CIRCLED[2], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

at(A, 0.55, rad(130.9), 'A');
at(B, 0.55, rad(220.9), 'B');
// C now carries four arms -- CB, CD and the dotted CP leaving along the base,
// plus nothing below it -- so the letter drops straight into the gap under the
// produced base rather than sitting on it.
at(C, 0.55, rad(285), 'C');
at(D, 0.55, rad(40.9), 'D');
at(E, 0.52, rad(270), 'E');
at(F, 0.62, OUT, 'F');
at(G, 0.50, rad(99.2), 'G');
at(P, 0.55, rad(346.1), 'P');

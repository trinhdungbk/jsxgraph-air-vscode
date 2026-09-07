// @size 700 389
// 解説36 (2) -- AF and BC produced to meet at P (角出し), which is what puts
// DG:GE inside a pair of similar triangles:
//   triangle FCP ~ FDA  gives  CP:AD = CF:FD = 2:3, so CP = [3] x 2/3 = [2]
//   triangle AGD ~ PGE  gives  DG:GE = AD:EP = [3] : ([2]+[2]) = 3:4
// Both sides carry their own unit system -- boxed along BC, circled along DC --
// and P lands at 10 on a base of 6 because that is where the givens put it, not
// where the page draws it.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.18, 11.02, -1.47],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Measured off the source page as a FILE, not eyeballed off an image pasted
// into a chat: base 143px, rise 0.66 of the base, top side shifted right 0.15
// of it, and both panels of the page agree to within a pixel. The eyeball
// estimate had the rise 24% too tall and put the two panels at different leans.
var BASE = 6, RISE = 3.96, LEAN = 0.90;

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


dimension(A, D, '3', 0.55, 1, 'box');
dimension(A, B, CIRCLED[4], 0.50, -1);
dimension(B, E, '1', 0.45, -1, 'box');
dimension(E, C, '2', 0.80, -1, 'box');
dimension(D, F, CIRCLED[2], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, F)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C)], 'B');
// C carries three arms along the produced base and the side, so the letter
// drops into the gap below rather than sitting on the base.
labelAt(C, 0.55, [dir(C, B), dir(C, D), dir(C, P)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C), dir(D, E)], 'D');
labelAt(E, 0.52, [dir(E, B), dir(E, C), dir(E, D)], 'E');
labelAt(F, 0.62, [dir(F, D), dir(F, C), dir(F, A), dir(F, P)], 'F');
labelAt(G, 0.50, [dir(G, A), dir(G, F), dir(G, D), dir(G, E)], 'G', 0, rad(213));
labelAt(P, 0.55, [dir(P, C), dir(P, F)], 'P');

// @size 700 367
// 解説36 (2) 傍注 -- the same extension with the ratio marks stripped out, which
// is what the margin note is for: it shows only WHY the line is produced.
//   triangle FCP ~ FDA   at F, the open pair
//   triangle AGD ~ PGE   at G, the filled pair
// Both similarities rest on a pair of vertical angles, so the marks go there.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.06, 11.02, -1.22],
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
seg(F, P, DOTTED);
seg(C, P, DOTTED);

// Counter-clockwise arms, or the mark lands in the reflex complement on the
// wrong side of the vertex (rule A1).
mark(G, 0.45, dir(G, D), dir(G, A), true);
mark(G, 0.45, dir(G, E), dir(G, P), true);
mark(F, 0.52, dir(F, D), dir(F, A), false);
mark(F, 0.52, dir(F, C), dir(F, P), false);

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, F)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D), dir(C, P)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C), dir(D, E)], 'D');
labelAt(E, 0.52, [dir(E, B), dir(E, C), dir(E, D)], 'E');
labelAt(F, 0.62, [dir(F, D), dir(F, C), dir(F, A), dir(F, P)], 'F');
// Both of G's wide gaps are spoken for by the vertical-angle marks, so the
// letter takes the widest one LEFT: a mark and a label want the same seat and
// the mark is the one that cannot move. rank 2 skips the pair.
labelAt(G, 0.55, [dir(G, A), dir(G, P), dir(G, D), dir(G, E)], 'G', 2, rad(213));
labelAt(P, 0.55, [dir(P, C), dir(P, F)], 'P');

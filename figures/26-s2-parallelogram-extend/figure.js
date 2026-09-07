// @size 700 403
// 解説 (2) -- AE and BC produced to meet at Q (角出し), which puts AG:GE inside
// two similar pairs sharing the line AQ:
//   triangle EDA ~ ECQ  gives  CQ:AD = EC:ED = [1]:[2], so CQ = AD / 2
//   triangle AGF ~ QGB  gives  AG:GQ = AF:BQ
// The circled system is DOUBLED here -- (2):(1) becomes (4):(2) and AD becomes
// (6) -- because CQ is half of AD and a unit system exists to be rescaled.
// Then BQ = (6)+(3) = (9) and AG:GQ = (4):(9), which composes with
// AE:EQ = [2]:[1] on figure 27.
//
// RECONSTRUCTED from the method; the page prints no 解説.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.94, 5.12, 10.07, -1.22],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Measured off the source page as a FILE, not eyeballed off an image pasted
// into a chat: base 143px, rise 0.66 of the base, top side shifted right 0.15
// of it, and both panels of the page agree to within a pixel. The eyeball
// estimate had the rise 24% too tall and put the two panels at different leans.
var BASE = 6, RISE = 3.96, LEAN = 0.90;

var B = [0, 0], C = [BASE, 0], A = [LEAN, RISE], D = [BASE + LEAN, RISE];

var F = along(A, D, 2 / 3),
    E = along(D, C, 2 / 3),
    G = meet(A, E, B, F),
    Q = meet(A, E, B, C);

closed([A, B, C, D]);
seg(A, E);
seg(B, F);

// The construction, dotted at the figure's own weight (rule D2): AE produced
// past E and the base produced past C, both to Q.
seg(E, Q, DOTTED);
seg(C, Q, DOTTED);


braceOn(A, F, CIRCLED[3], 0.42, 1);
braceOn(F, D, CIRCLED[1], 0.42, 1);
braceOn(B, C, CIRCLED[5], 0.42, -1);
braceOn(C, Q, CIRCLED[2], 0.42, -1);

// DE and EC are unequal and share DC, so they stack -- and the deeper one has
// to be DE, because EC's chord is 1.55 units and caps its own sagitta.
dimension(D, E, '2', 0.58, 1, 'box');
dimension(E, C, '1', 0.40, 1, 'box');

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, E)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C), dir(B, F)], 'B');
// C divides the produced base, so its letter drops into the gap the two
// circled braces leave at their inset ends.
labelAt(C, 0.55, [dir(C, B), dir(C, D), dir(C, Q)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C)], 'D');
labelAt(E, 0.62, [dir(E, D), dir(E, C), dir(E, A), dir(E, Q)], 'E');
labelAt(F, 0.42, [dir(F, A), dir(F, D), dir(F, B)], 'F');
labelAt(G, 0.50, [dir(G, A), dir(G, E), dir(G, B), dir(G, F)], 'G', 0, rad(213));
labelAt(Q, 0.55, [dir(Q, C), dir(Q, E)], 'Q');

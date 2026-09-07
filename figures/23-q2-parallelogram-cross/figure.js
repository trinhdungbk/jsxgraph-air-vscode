// @size 700 495
// 問題 (2) -- parallelogram ABCD with F on AD at AF:FD = (2):(1) and E on DC at
// DE:EC = [2]:[1]. AE and BF cross at G. Find AG:GE.
//
// AE produced meets BC produced at Q, and the composition runs on AQ (figure 27):
//   AG:GQ = AF:BQ = (4):(9)   from triangle AGF ~ QGB, AF // BQ
//   AE:EQ = [2]:[1]           from triangle EDA ~ ECQ
// (4):(9) x3 and [2]:[1] x13 both total 39, so AG:GE = 12 : 14 = 6 : 7.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.12, 7.86, -1.10],
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
    G = meet(A, E, B, F);

closed([A, B, C, D]);
seg(A, E);
seg(B, F);

braceOn(A, F, CIRCLED[1], 0.42, 1);
braceOn(F, D, CIRCLED[0], 0.42, 1);

// DE and EC are unequal and share the side DC, so they stack (rule B9) -- and
// the deeper one has to be DE: EC's chord is 1.35 units, which caps its own
// sagitta at 0.3 x 1.35 before the arc goes major (rule B11).
dimension(D, E, '2', 0.60, 1, 'box');
dimension(E, C, '1', 0.35, 1, 'box');

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, E)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C), dir(B, F)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C)], 'D');
labelAt(F, 0.42, [dir(F, A), dir(F, D), dir(F, B)], 'F');
// E's clear side is east, which is also where its two braces are; 0.62 keeps
// the letter inside the nearer apex.
labelAt(E, 0.62, [dir(E, D), dir(E, C), dir(E, A)], 'E');
labelAt(G, 0.50, [dir(G, A), dir(G, E), dir(G, B), dir(G, F)], 'G', 0, rad(213));

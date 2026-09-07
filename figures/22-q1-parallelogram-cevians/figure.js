// @size 700 494
// 問題 (1) -- parallelogram ABCD with E on AD at AE:ED = (3):(4) and F the
// midpoint of DC. BE and BF cut the diagonal AC at G and H. Find AG:GH:HC.
//
// Two ratios on AC, in two unit systems, composed on figure 25:
//   AG:GC = AE:CB = (3):(7)   from triangle AGE ~ CGB
//   AH:HC = AB:CF = [2]:[1]   from triangle AHB ~ CHF
// (3):(7) x3 and [2]:[1] x10 both total 30, so AG:GH:HC = 9 : 11 : 10.

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

var E = along(A, D, 3 / 7),
    F = midpoint(D, C),
    G = meet(A, C, B, E),
    H = meet(A, C, B, F);

closed([A, B, C, D]);
seg(A, C);
seg(B, E);
seg(B, F);

ticks(D, F, 1);
ticks(F, C, 1);

// Level, not stacked, even though (3) and (4) differ: B12's inset already opens
// a gap at E wide enough for E's own letter, so the pair cannot read as one
// brace over the whole side -- which is the only thing B9's stagger buys.
braceOn(A, E, CIRCLED[2], 0.42, 1);
braceOn(E, D, CIRCLED[3], 0.42, 1);

// Arms counted first, letter on the bisector of the widest gap they leave.
labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, C)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C), dir(B, E), dir(B, F)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D), dir(C, A)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C)], 'D');
// E's arms both leave along AD, so the whole upper half is free and the letter
// goes straight up -- inside the braces' row, at a smaller radius than their
// labels (rule B8's two radii).
labelAt(E, 0.42, [dir(E, A), dir(E, D), dir(E, B)], 'E');
labelAt(F, 0.55, [dir(F, D), dir(F, C), dir(F, B)], 'F');
// G and H each sit on two crossing lines; rank 1 takes the lower of the two
// equally wide wedges, which is the side the page labels them on.
labelAt(G, 0.50, [dir(G, A), dir(G, C), dir(G, B), dir(G, E)], 'G', 0, rad(270));
labelAt(H, 0.50, [dir(H, A), dir(H, C), dir(H, B), dir(H, F)], 'H', 0, rad(225));

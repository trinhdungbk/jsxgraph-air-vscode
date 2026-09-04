// @size 650 464
// 問題 (1) -- parallelogram ABCD with E on AD at AE:ED = (3):(4) and F the
// midpoint of DC. BE and BF cut the diagonal AC at G and H. Find AG:GH:HC.
//
// Two ratios on AC, in two unit systems, composed:
//   AG:GC = AE:CB = (3):(7)   from triangle AGE ~ CGB
//   AH:HC = AB:CF = [2]:[1]   from triangle AHB ~ CHF
// (3):(7) x3 and [2]:[1] x10 both total 30, so AG:GH:HC = 9 : 11 : 10.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.90, 5.28, 7.78, -0.92],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Nothing in the question constrains the parallelogram, so its shape is the one
// thing read off the scan (rule A6): base 124px, rise 88, top shifted right 17.
// This panel and the next disagree about the lean, so each takes its own.
var BASE = 6, RISE = 4.25, LEAN = 0.85;

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

at(A, 0.55, rad(129.3), 'A');
at(B, 0.55, rad(219.3), 'B');
at(C, 0.55, rad(309.3), 'C');
at(D, 0.55, rad(39.3), 'D');
// E's arms leave along AD in both directions, so the whole upper half is free
// and the letter goes straight up -- inside the braces' row, at a smaller
// radius than their labels (rule B8's two-radii argument).
at(E, 0.42, rad(90), 'E');
at(F, 0.55, dir(D, C) + Math.PI / 2, 'F');
// G and H each sit on two crossing lines; these are the downward bisectors,
// which is the side the page labels them on.
at(G, 0.50, rad(275.8), 'G');
at(H, 0.50, rad(259.4), 'H');

// @size 680 436
// 問題 (2) -- parallelogram ABCD with F on AD at AF:FD = (2):(1) and E on DC at
// DE:EC = [2]:[1]. AE and BF cross at G. Find AG:GE.
//
// AE produced meets BC produced at Q, and the composition runs on AQ:
//   AG:GQ = AF:BQ = [4]:[9]   from triangle AGF ~ QGB, AF // BQ
//   AE:EQ = (2):(1)           from triangle EDA ~ ECQ
// [4]:[9] x3 and (2):(1) x13 both total 39, so AG:GE = 12 : 14 = 6 : 7.
// Q is the 解説's auxiliary point and is not on this panel.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.90, 5.28, 8.82, -0.95],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// This panel is sheared noticeably harder than (1) -- 38px of lean on a 120px
// base against 17 on 124 -- and the shape is free, so the difference is kept.
var BASE = 6, RISE = 4.25, LEAN = 1.90;

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
// the deeper one has to be DE: EC's chord is only 1.55 units, which caps its
// sagitta at 0.3 x 1.55 before the arc goes major (rule B11).
var OUT = dir(D, C) + Math.PI / 2;
dimension(D, E, '2', 0.58, 1, 'box');
dimension(E, C, '1', 0.40, 1, 'box');

at(A, 0.55, rad(122.9), 'A');
at(B, 0.55, rad(212.9), 'B');
at(C, 0.55, rad(302.9), 'C');
at(D, 0.55, rad(32.9), 'D');
at(F, 0.42, rad(90), 'F');
// E's clear side is east, which is also where its two braces are; 0.62 keeps
// the letter inside the nearer apex.
at(E, 0.62, OUT, 'E');
at(G, 0.50, rad(272.4), 'G');

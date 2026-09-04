// @size 610 521
// 例題36 (2) 問題 -- parallelogram ABCD with E on BC at BE:EC = 1:2 and F on DC
// at DF:FC = 3:2. AF and DE cross at G. Find DG:GE.
//
// The two ratios are in different unit systems -- boxed along BC, circled along
// DC -- and the question is unreadable without the shapes: "1:2 and 3:2" says
// nothing about how BE compares with DF.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.95, 7.65, -1.40],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var BASE = 6, RISE = 4.9, LEAN = 0.7;

var B = [0, 0], C = [BASE, 0], A = [LEAN, RISE], D = [BASE + LEAN, RISE];

var E = along(B, C, 1 / 3),
    F = along(D, C, 3 / 5),
    G = meet(A, F, D, E);

closed([A, B, C, D]);
seg(A, F);
seg(D, E);

var OUT = dir(D, C) + Math.PI / 2;

dimension(B, E, '1', 0.45, -1, 'box');
dimension(E, C, '2', 0.80, -1, 'box');
dimension(D, F, CIRCLED[2], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

at(A, 0.55, rad(130.9), 'A');
at(B, 0.55, rad(220.9), 'B');
at(C, 0.55, rad(310.9), 'C');
at(D, 0.55, rad(40.9), 'D');
// E's letter sits under BC, in the notch where the two boxed braces meet.
at(E, 0.52, rad(270), 'E');
at(F, 0.62, OUT, 'F');
at(G, 0.50, rad(99.2), 'G');

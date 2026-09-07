// @size 700 519
// 例題36 (2) 問題 -- parallelogram ABCD with E on BC at BE:EC = 1:2 and F on DC
// at DF:FC = 3:2. AF and DE cross at G. Find DG:GE.
//
// The two ratios are in different unit systems -- boxed along BC, circled along
// DC -- and the question is unreadable without the shapes: "1:2 and 3:2" says
// nothing about how BE compares with DF.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.06, 7.86, -1.47],
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
    G = meet(A, F, D, E);

closed([A, B, C, D]);
seg(A, F);
seg(D, E);


dimension(B, E, '1', 0.45, -1, 'box');
dimension(E, C, '2', 0.80, -1, 'box');
dimension(D, F, CIRCLED[2], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, F)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C), dir(D, E)], 'D');
// E's letter sits under BC, in the notch where the two boxed braces meet.
labelAt(E, 0.52, [dir(E, B), dir(E, C), dir(E, D)], 'E');
labelAt(F, 0.62, [dir(F, D), dir(F, C), dir(F, A)], 'F');
labelAt(G, 0.50, [dir(G, A), dir(G, F), dir(G, D), dir(G, E)], 'G', 0, rad(213));

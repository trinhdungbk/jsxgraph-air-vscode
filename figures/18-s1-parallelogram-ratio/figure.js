// @size 700 514
// 解説36 (1) -- the question figure with every side carried in its own unit
// system, which is what makes the two similar-triangle ratios comparable:
//   BP:PD = BE:AD = [1]:[2]   from triangle PBE ~ PDA
//   BQ:QD = AB:FD = (3):(1)   from triangle ABQ ~ FDQ
// The composition itself happens on the segment diagram, figure 19.
//
// INCOMPLETE: the source panel also carries several arcs inside the
// parallelogram, around P, Q and D. At the resolution the page arrived at it
// could not be settled whether they mark the vertical angles of the two similar
// pairs or brace the parts of BD; the two readings put ink in different places
// and neither is recoverable from the givens. Rule F1: ship what is verified.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.18, 7.86, -1.29],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// Measured off the source page as a FILE, not eyeballed off an image pasted
// into a chat: base 143px, rise 0.66 of the base, top side shifted right 0.15
// of it, and both panels of the page agree to within a pixel. The eyeball
// estimate had the rise 24% too tall and put the two panels at different leans.
var BASE = 6, RISE = 3.96, LEAN = 0.90;

var B = [0, 0], C = [BASE, 0], A = [LEAN, RISE], D = [BASE + LEAN, RISE];

var E = midpoint(B, C),
    F = along(D, C, 1 / 3),
    P = meet(A, E, B, D),
    Q = meet(A, F, B, D);

closed([A, B, C, D]);
seg(B, D);
seg(A, E);
seg(A, F);

ticks(B, E, 2);
ticks(E, C, 2);


// BE and EC are EQUAL, so their braces stay level: staggering them would deny
// the equality the ticks assert. DF and FC are unequal and stack (rule B9).
// 0.62 rather than 0.45 so the boxes clear the equal-length ticks, which sit at
// the same midpoints and reach 0.16 below the base.
dimension(B, E, '1', 0.62, -1, 'box');
dimension(E, C, '1', 0.62, -1, 'box');
dimension(A, D, '2', 0.55, 1, 'box');
dimension(A, B, CIRCLED[2], 0.50, -1);
dimension(D, F, CIRCLED[0], 0.42, 1);
dimension(F, C, CIRCLED[1], 0.78, 1);

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, E), dir(A, F)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C), dir(B, D)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, B), dir(D, C)], 'D');
labelAt(E, 0.50, [dir(E, B), dir(E, C), dir(E, A)], 'E');
labelAt(F, 0.62, [dir(F, D), dir(F, C), dir(F, A)], 'F');
labelAt(P, 0.50, [dir(P, B), dir(P, D), dir(P, A), dir(P, E)], 'P', 0, rad(151));
labelAt(Q, 0.50, [dir(Q, B), dir(Q, D), dir(Q, A), dir(Q, F)], 'Q', 0, rad(191));

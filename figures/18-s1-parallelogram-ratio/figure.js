// @size 610 518
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
    boundingbox: [-0.95, 6.15, 7.65, -1.15],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var BASE = 6, RISE = 4.9, LEAN = 0.7;

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

var OUT = dir(D, C) + Math.PI / 2;

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

at(A, 0.55, rad(130.9), 'A');
at(B, 0.55, rad(220.9), 'B');
at(C, 0.55, rad(310.9), 'C');
at(D, 0.55, rad(40.9), 'D');
at(E, 0.50, rad(270), 'E');
at(F, 0.62, OUT, 'F');
at(P, 0.50, rad(165.7), 'P');
at(Q, 0.50, rad(100.2), 'Q');

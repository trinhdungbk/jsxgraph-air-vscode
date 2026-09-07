// @size 700 558
// 解説37 (1) 図1 -- the first layer, inked heavy: in triangle AFC, E and D are
// the midpoints of AF and AC, so ED // FC and ED:FC = 1:2. That ratio is what
// the second layer (図2) then feeds on.
//
// The circles mark the two BISECTED SIDES of this triangle -- AF and AC. They
// are equal-length marks on the segments, not angle marks at A and C: a
// previous attempt at this page read them as angles and put them at the wrong
// vertices, which is easy to do and impossible to see afterwards.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.89, 5.34, 6.88, -0.87],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The triangle is free -- nothing in the question fixes it -- and this page is
// NOT available as a file, so its proportions come off the paste and are
// unreliable by rule A8. Flagged rather than trusted; a crop closes it.
var BASE = 6, RISE = 4.25, APEX = 3.37;

var B = [0, 0], C = [BASE, 0], A = [APEX, RISE];

var E = along(A, B, 1 / 3),
    F = along(A, B, 2 / 3),
    D = midpoint(A, C),
    G = midpoint(B, D);

closed([A, B, C]);
seg(B, D);
seg(F, C);
seg(E, D);

// The triangle the argument turns on, distinguished by WEIGHT alone (never by
// colour, never by dashing -- dashing is the auxiliary line's).
seg(A, F, HEAVY);
seg(F, C, HEAVY);
seg(C, A, HEAVY);
seg(E, D, HEAVY);

equalLength(A, E, false);
equalLength(E, F, false);
equalLength(A, D, false);
equalLength(D, C, false);

braceOn(E, D, '<i>x</i>', 0.42, 1);

labelAt(A, 0.42, [dir(A, B), dir(A, C), dir(A, D), dir(A, E)], 'A');
labelAt(B, 0.42, [dir(B, A), dir(B, C), dir(B, D)], 'B');
labelAt(C, 0.42, [dir(C, A), dir(C, B), dir(C, F)], 'C');
labelAt(D, 0.42, [dir(D, A), dir(D, C), dir(D, B), dir(D, E)], 'D');
labelAt(E, 0.38, [dir(E, A), dir(E, B), dir(E, D)], 'E');
labelAt(F, 0.38, [dir(F, A), dir(F, B), dir(F, C)], 'F');
labelAt(G, 0.40, [dir(G, B), dir(G, D), dir(G, F), dir(G, C)], 'G', 0, rad(250));

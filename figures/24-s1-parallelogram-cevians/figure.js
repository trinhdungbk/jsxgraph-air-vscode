// @size 700 500
// 解説 (1) -- the question figure with every side that matters carried in its
// own unit system, which is what makes the two similar-triangle ratios
// comparable on AC:
//   AG:GC = AE:CB = (3):(7)   from triangle AGE ~ CGB, AE // CB
//   AH:HC = AB:CF = [2]:[1]   from triangle AHB ~ CHF, AB // CF
// The composition itself happens on the segment diagram, figure 25.
//
// RECONSTRUCTED: the pasted page carries the two question panels and no 解説,
// so this figure and 25-27 are built from the method rather than copied off a
// printed panel. Every marked unit is checked against the finished coordinates
// instead (rule A7 as well: the answer is invariant under the shape).

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 5.12, 7.86, -1.16],
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


// The circled system is AD and the base it is compared with; the boxed system
// is AB and the half of DC it is compared with. One shape per system, the same
// shape wherever that system appears -- AD and BC are the SAME system even
// though they are different segments, because one stated ratio relates them.
braceOn(A, E, CIRCLED[2], 0.42, 1);
braceOn(E, D, CIRCLED[3], 0.42, 1);
braceOn(B, C, CIRCLED[6], 0.42, -1);
braceOn(A, B, '2', 0.42, -1, 'box');
// DF and FC are EQUAL, so their braces stay level and F's own letter sits in
// the gap the inset opens between them.
braceOn(D, F, '1', 0.42, 1, 'box');
braceOn(F, C, '1', 0.42, 1, 'box');

labelAt(A, 0.55, [dir(A, B), dir(A, D), dir(A, C)], 'A');
labelAt(B, 0.55, [dir(B, A), dir(B, C), dir(B, E), dir(B, F)], 'B');
labelAt(C, 0.55, [dir(C, B), dir(C, D), dir(C, A)], 'C');
labelAt(D, 0.55, [dir(D, A), dir(D, C)], 'D');
labelAt(E, 0.42, [dir(E, A), dir(E, D), dir(E, B)], 'E');
labelAt(F, 0.55, [dir(F, D), dir(F, C), dir(F, B)], 'F');
labelAt(G, 0.50, [dir(G, A), dir(G, C), dir(G, B), dir(G, E)], 'G', 0, rad(270));
labelAt(H, 0.50, [dir(H, A), dir(H, C), dir(H, B), dir(H, F)], 'H', 0, rad(225));

// @size 700 558
// 解説37 (1) 図2 -- the second layer: in triangle BDE, F is the midpoint of BE
// and FG // ED (from 図1), so FG:ED = 1:2 and G bisects BD. With FG = 6 that
// gives x = ED = 12, and back in triangle AFC, FC = 2 x 12 = 24, so
// y = GC = 24 - 6 = 18.
//
// The circles here mark BE's halves -- a DIFFERENT division from 図1's, on the
// same drawing. Which side carries the marks is what tells the two layers
// apart, so the two figures are separate assets rather than one board with two
// captions.

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

seg(B, E, HEAVY);
seg(E, D, HEAVY);
seg(D, B, HEAVY);
seg(F, G, HEAVY);

sideMark(B, F, { glyph: 'circle' });
sideMark(F, E, { glyph: 'circle' });

braceOn(E, D, '<i>x</i>', 0.42, 1);
braceOn(F, G, '6', 0.42, 1);
braceOn(G, C, '<i>y</i>', 0.42, 1);

labelAt(A, 0.42, [dir(A, B), dir(A, C), dir(A, D), dir(A, E)], 'A');
labelAt(B, 0.42, [dir(B, A), dir(B, C), dir(B, D)], 'B');
labelAt(C, 0.42, [dir(C, A), dir(C, B), dir(C, F)], 'C');
labelAt(D, 0.42, [dir(D, A), dir(D, C), dir(D, B), dir(D, E)], 'D');
labelAt(E, 0.38, [dir(E, A), dir(E, B), dir(E, D)], 'E');
labelAt(F, 0.38, [dir(F, A), dir(F, B), dir(F, C)], 'F');
labelAt(G, 0.40, [dir(G, B), dir(G, D), dir(G, F), dir(G, C)], 'G', 0, rad(250));

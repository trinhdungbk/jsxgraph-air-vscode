// @size 663 445
// 例題36 (3) 問題 -- right isosceles triangle ABC (right angle at A, 45 at B),
// D on BC with BD = 3 and DC = 6, and E the image of D when triangle ABD is
// turned about A onto AC. Find the area of ABC, the length EC, the area of ADE.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.2, 5.9, 10.6, -2.0],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var BD = 3, DC = 6;

var B = [0, 0],
    D = [BD, 0],
    C = [BD + DC, 0];

// The right angle at A plus 45 at B force A: the apex of the isosceles right
// triangle on BC sits over the midpoint at half the hypotenuse.
var A = [(BD + DC) / 2, (BD + DC) / 2];

// E is D turned about A through the angle that carries B to C -- a quarter
// turn, because angle BAC is right. Deriving E this way rather than placing it
// is what makes EC = BD and EC perpendicular to BC true in the drawing.
var turn = dir(A, C) - dir(A, B);
var E = polar(A, Math.sqrt((D[0] - A[0]) * (D[0] - A[0]) + (D[1] - A[1]) * (D[1] - A[1])),
    dir(A, D) + turn);

seg(B, C);
seg(A, B);
seg(A, D);
seg(A, C);
seg(A, E);
seg(D, E);

// The turn lands E directly above C, so the book shows EC dotted: it is the
// segment being measured, not a side of either triangle.
seg(E, C, DOTTED);

at(A, 0.5, rad(90), 'A');
at(B, 0.5, rad(215), 'B');
at(D, 0.5, rad(255), 'D');
at(C, 0.5, rad(325), 'C');
at(E, 0.5, rad(20), 'E');

rightAngle(A, dir(A, B), dir(A, C), 0.5);
angleMark(B, 0.95, dir(B, C), dir(B, A), '45&#176;', 0.62);
angleMark(D, 0.95, dir(D, E), dir(D, A), '45&#176;', 0.62);

// Stacked at different depths so the two arcs read as two measurements rather
// than one long brace under the whole base.
dimension(B, D, '3', 0.45, -1);
dimension(D, C, '6', 0.85, -1);

// @size 363 780
// 解説35 (1) -- the same figure with the two congruent triangles inked heavy.
// 2 = 90 - 70 = 20 at D; triangles ABF and ADF are congruent about the
// diagonal, so 1 = 2; and AB // EC makes angle FED the alternate angle of 1.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.0, 10.6, 4.4, -1.0],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var SIDE = 3.4, GIVEN = 70;

var A = [0, SIDE], B = [0, 0], C = [SIDE, 0], D = [SIDE, SIDE],
    F = meet(A, C, D, polar(D, 1, rad(270 - GIVEN))),
    E = meet(B, F, C, D);

closed([A, B, C, D]);
seg(D, E);
seg(B, E);
seg(A, C);
seg(D, F);

// The congruent pair the argument turns on. AF is the shared side and lies
// along the diagonal, which is both the bisector of angle A and the
// perpendicular bisector of BD -- either reading gives the congruence.
seg(A, B, HEAVY);
seg(B, F, HEAVY);
seg(F, A, HEAVY);
seg(A, D, HEAVY);
seg(D, F, HEAVY);

text(A[0] - 0.32, A[1], 'A', 'right', 'middle');
text(B[0] - 0.14, B[1] - 0.16, 'B', 'right', 'top');
text(C[0] + 0.14, C[1] - 0.16, 'C', 'left', 'top');
text(D[0] + 0.32, D[1], 'D', 'left', 'middle');
text(E[0], E[1] + 0.30, 'E', 'middle', 'bottom');
text(F[0] - 0.30, F[1] - 0.18, 'F', 'right', 'top');

var RIGHT = 0, LEFT = Math.PI;

// Step 1 is a 20-degree wedge pinned against side AB, and no radius on the
// bisector is wide enough to hold the glyph: at the radius where the wedge
// finally opens up, the glyph lands on F's own label. So the arc stays inside
// the wedge and the number goes across AB, which is what the book does too.
arc(B, 0.85, dir(B, E), dir(B, A));
text(B[0] - 0.16, B[1] + 0.85, '&#9312;', 'right', 'middle');

// Step 2 shares vertex D with the given 70, so the two arcs need clearly
// different radii or they read as one 90-degree sweep. The number itself does
// fit inside its sliver, but only well out along the bisector.
arc(D, 0.95, dir(D, A), dir(D, F));
step(D, 1.90, dir(D, A), dir(D, F), 2);

angleMark(D, 0.65, dir(D, F), dir(D, C), '70&deg;', 0.85);

// @size 672 530
// 解説35 (3) -- drop the perpendicular GH from G onto EA produced. Triangles
// ABC and AHG are congruent (AB = AH, angle B = angle H = 90, AC = AG), so
// GH = CB = 7 and the hatched triangle is 4 x 7 / 2 = 14.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.0, 12.2, 16.0, -1.2],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var EA = 4, BC = 7;

var D = [0, 0], B = [EA, 0], C = [EA + BC, 0],
    E = [0, EA], A = [EA, EA],
    v = [C[0] - A[0], C[1] - A[1]],
    F = [C[0] - v[1], C[1] + v[0]],
    G = [F[0] - v[0], F[1] - v[1]],
    H = [G[0], A[1]];    // foot of the perpendicular, on EA PRODUCED past A

// Edges of EAG run at 0, 41 and 60 degrees, so the default 45-degree
// hatching would sit almost on top of GE. 120 keeps it clear of all three.
hatch([E, A, G], 0.45, 120);

closed([A, B, D, E]);
closed([A, C, F, G]);
seg(B, C);
seg(G, E);

// H falls beyond A, so the auxiliary work is two dotted strokes: EA produced
// as far as H, and the perpendicular itself. Dotted, at the figure's own stroke
// weight -- style marks them as construction, never weight.
seg(A, H, DOTTED);
seg(G, H, DOTTED);

rightAngle(H, Math.PI, Math.PI / 2);
rightAngle(B, Math.PI / 2, 0);

// One tick for the pair equal to 4, two for the pair equal to 7 -- the ticks
// carry the congruence so the numbers need not be repeated on GH and AH.
ticks(A, B, 1);
ticks(A, H, 1);
ticks(B, C, 2);
ticks(H, G, 2);

text(D[0] - 0.16, D[1] - 0.22, 'D', 'right', 'top');
text(B[0] - 0.12, B[1] - 0.26, 'B', 'right', 'top');
text(C[0] + 0.18, C[1] - 0.22, 'C', 'left', 'top');
text(E[0] - 0.30, E[1], 'E', 'right', 'middle');
text(A[0] - 0.22, A[1] + 0.44, 'A', 'right', 'middle');
text(G[0] - 0.12, G[1] + 0.32, 'G', 'right', 'bottom');
text(F[0] + 0.32, F[1], 'F', 'left', 'middle');
text(H[0] + 0.20, H[1] - 0.30, 'H', 'left', 'top');

text(midpoint(E, A)[0], midpoint(E, A)[1] - 0.34, '4', 'middle', 'top');
text(midpoint(B, C)[0], midpoint(B, C)[1] - 0.36, '7', 'middle', 'top');

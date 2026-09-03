// @size 672 530
// 例題35 (3) 問題 -- squares ABDE and ACFG meeting at A, with D, B, C on one
// line. EA = 4, BC = 7. Find the area of the hatched triangle GEA.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.0, 12.2, 16.0, -1.2],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var EA = 4, BC = 7;

var D = [0, 0], B = [EA, 0], C = [EA + BC, 0],
    E = [0, EA], A = [EA, EA];

// The second square is not free either: turning A->C left through 90 degrees
// gives C->F, and stepping back along A->C from F closes it at G. Doing this by
// vector rotation rather than by hand keeps AC = AG exactly, which is the whole
// reason triangles ABC and AHG are congruent in the solution.
var v = [C[0] - A[0], C[1] - A[1]],
    F = [C[0] - v[1], C[1] + v[0]],
    G = [F[0] - v[0], F[1] - v[1]];

// Edges of EAG run at 0, 41 and 60 degrees, so the default 45-degree
// hatching would sit almost on top of GE. 120 keeps it clear of all three.
hatch([E, A, G], 0.45, 120);

closed([A, B, D, E]);
closed([A, C, F, G]);
seg(B, C);      // D, B and C are collinear; BD is a square side, BC is not
seg(G, E);      // closes the triangle being measured

text(D[0] - 0.16, D[1] - 0.22, 'D', 'right', 'top');
text(B[0] - 0.12, B[1] - 0.26, 'B', 'right', 'top');
text(C[0] + 0.18, C[1] - 0.22, 'C', 'left', 'top');
text(E[0] - 0.30, E[1], 'E', 'right', 'middle');
// A is the shared vertex with five arms; the only clear direction is up and
// left, inside the hatched triangle. Text is HTML and always paints above the
// hatching, so it stays legible there.
text(A[0] - 0.22, A[1] + 0.44, 'A', 'right', 'middle');
text(G[0] - 0.12, G[1] + 0.32, 'G', 'right', 'bottom');
text(F[0] + 0.32, F[1], 'F', 'left', 'middle');

// The two givens, each just clear of the segment it measures.
text(midpoint(E, A)[0], midpoint(E, A)[1] - 0.34, '4', 'middle', 'top');
text(midpoint(B, C)[0], midpoint(B, C)[1] - 0.36, '7', 'middle', 'top');

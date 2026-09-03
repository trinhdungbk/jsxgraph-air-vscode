// @size 363 780
// 例題35 (1) 問題 -- square ABCD, E on ray CD produced, F where the diagonal
// AC meets BE. Find angle FED.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.0, 10.6, 4.4, -1.0],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var SIDE = 3.4,
    GIVEN = 70;     // the angle FDC printed in the question

var A = [0, SIDE], B = [0, 0], C = [SIDE, 0], D = [SIDE, SIDE];

// The chain of dependence runs given -> F -> E, and it has to be built in that
// order. DC points straight down, so the ray from D that closes 70 degrees on
// it leaves at 270 - 70; where it crosses the diagonal AC is F; extending BF to
// the line CD gives E. Placing E by eye instead is what makes this figure look
// like the book -- and wrong: the given forces E a full tan(70) = 2.75 side
// lengths above B, which is why the frame is so tall.
var F = meet(A, C, D, polar(D, 1, rad(270 - GIVEN))),
    E = meet(B, F, C, D);

closed([A, B, C, D]);
seg(D, E);          // CD produced upward
seg(B, E);          // passes through F
seg(A, C);          // the diagonal, also through F
seg(D, F);

text(A[0] - 0.32, A[1], 'A', 'right', 'middle');
text(B[0] - 0.14, B[1] - 0.16, 'B', 'right', 'top');
text(C[0] + 0.14, C[1] - 0.16, 'C', 'left', 'top');
text(D[0] + 0.32, D[1], 'D', 'left', 'middle');
text(E[0], E[1] + 0.30, 'E', 'middle', 'bottom');
// F sits on two crossing lines; the wide gap at F opens to the lower left,
// between the arm running down to B and the arm running up to A.
text(F[0] - 0.30, F[1] - 0.18, 'F', 'right', 'top');

angleMark(D, 0.65, dir(D, F), dir(D, C), '70&deg;', 0.85);

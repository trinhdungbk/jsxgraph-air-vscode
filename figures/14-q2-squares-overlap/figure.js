// @size 620 583
// 例題36 (2) 問題 -- square ABCD of side 10 and square EFGH of side 6, whose
// CENTRE is the corner C of ABCD. Find the area of quadrilateral EPCQ.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-12.0, 11.0, 4.8, -4.8],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var BIG = 10,
    SMALL = 6,
    TURN = 15;      // how far EFGH is rotated off the axes in the source

// C carries the right angle of ABCD and is the centre of EFGH. That single
// incidence is the whole problem: two perpendicular lines through the centre
// cut a square into four congruent quarters, so EPCQ is a quarter of EFGH
// whatever TURN is. Hardcoding E, P, Q instead would hide that.
var C = [0, 0],
    B = [-BIG, 0],
    D = [0, BIG],
    A = [-BIG, BIG];

var half = SMALL * Math.SQRT2 / 2;
var E = polar(C, half, rad(135 + TURN)),
    F = polar(C, half, rad(225 + TURN)),
    G = polar(C, half, rad(315 + TURN)),
    H = polar(C, half, rad(45 + TURN));

var P = meet(E, F, B, C),
    Q = meet(E, H, C, D);

hatch([E, P, C, Q], 0.4);

closed([A, B, C, D]);
closed([E, F, G, H]);

// The two half-diagonals the solution needs, dotted because they are the
// construction that shows C is the centre rather than part of either square.
seg(C, F, DOTTED);
seg(C, G, DOTTED);

at(A, 0.55, rad(135), 'A');
at(B, 0.55, rad(225), 'B');
at(D, 0.55, rad(45), 'D');
// C has five arms; the clear sector is between CD and the dotted CG.
at(C, 0.62, rad(45), 'C');
// Each vertex of EFGH is labelled straight out from the centre, which is the
// one direction no edge of either square occupies.
at(E, 0.55, rad(135 + TURN), 'E');
at(F, 0.55, rad(225 + TURN), 'F');
at(G, 0.55, rad(315 + TURN), 'G');
at(H, 0.55, rad(45 + TURN), 'H');
// P and Q each sit on two lines; these are the bisectors of their widest gap.
at(P, 0.55, rad(232), 'P');
at(Q, 0.55, rad(142), 'Q');

dimension(A, B, '10', 0.75, -1);
dimension(F, G, '6', 0.75, -1);

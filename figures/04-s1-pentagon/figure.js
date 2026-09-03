// @size 640 460
// 解説34 (1) -- the question figure plus the one auxiliary line the solution
// turns on: a parallel to l drawn through B. Steps 1-4 are the circled
// numbers; alternate angles carry 3 = 4 and 1 = 2.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-5.3, 7.4, 6.8, -1.1],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var GAP = 6, TILT = 20;

var head = [0, 1, 2, 3, 4].map(function (k) { return rad(-TILT - 72 * k); });
var side = GAP / -(Math.sin(head[0]) + Math.sin(head[1]) + Math.sin(head[2]));

var ring = [[0, GAP]];
head.forEach(function (h) { ring.push(polar(ring[ring.length - 1], side, h)); });
var A = ring[0], E = ring[1], D = ring[2], C = ring[3], B = ring[4];

var RIGHT = 0, LEFT = Math.PI;

function ray(y, label) {
    seg([-4.0, y], [5.9, y]);
    arrowHead([5.9, y], RIGHT);
    text(-4.4, y, label, 'right', 'middle');
}
ray(GAP, '<i>l</i>');
ray(0, '<i>m</i>');

closed([A, E, D, C, B]);

// The auxiliary parallel. It overshoots B on the LEFT as well, which is what
// makes it read as a line drawn through B rather than a ray starting at it --
// and the left overshoot is what gives angle 3 a visible left arm.
seg([B[0] - 1.35, B[1]], [3.35, B[1]], DOTTED);
solidHead([2.1, B[1]], RIGHT, 0.72);

text(A[0], A[1] + 0.30, 'A', 'middle', 'bottom');
// B rides ABOVE its vertex, not beside it: the auxiliary line runs straight
// through B horizontally, and a label placed level with the vertex sits on it.
text(B[0] - 0.16, B[1] + 0.20, 'B', 'right', 'bottom');
text(C[0], C[1] - 0.30, 'C', 'middle', 'top');
text(D[0] + 0.32, D[1], 'D', 'left', 'middle');
text(E[0] + 0.32, E[1], 'E', 'left', 'middle');

// Given and asked, unchanged from the question figure.
angleMark(A, 0.95, dir(A, E), RIGHT, '20&deg;', 0.75);
angleMark(C, 0.95, RIGHT, dir(C, D), '<i>x</i>', 0.75);

// Interior angles of the regular pentagon, at the two vertices the chain of
// reasoning passes through. The 108 arc is drawn tighter than the 20 arc so
// the two do not collide on the AE side of A.
angleMark(A, 0.72, dir(A, B), dir(A, E), '108&deg;', 0.72);
angleMark(C, 0.72, dir(C, D), dir(C, B), '108&deg;', 0.55);

// The four steps, each a bare glyph on the bisector of its wedge.
step(A, 1.30, LEFT, dir(A, B), 4);
step(B, 1.24, RIGHT, dir(B, A), 3);
step(B, 1.24, dir(B, C), RIGHT, 2);
step(C, 1.48, dir(C, B), LEFT, 1);

// @size 640 450
// 例題34 (1) 問題 -- regular pentagon ABCDE wedged between l // m, find angle x.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-5.3, 7.4, 6.8, -1.1],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var GAP = 6,        // vertical distance from l down to m
    TILT = 20;      // the given angle between l and side AE

// Walk the pentagon clockwise from A, turning 72 degrees at every vertex. The
// side length is not free: it is whatever drops C exactly onto m, which is the
// single constraint that makes the given 20 degrees and the parallel pair
// consistent. Hardcoding coordinates instead would put C slightly off m and
// the whole point of the figure would be a rendering accident.
var head = [0, 1, 2, 3, 4].map(function (k) { return rad(-TILT - 72 * k); });
var side = GAP / -(Math.sin(head[0]) + Math.sin(head[1]) + Math.sin(head[2]));

var ring = [[0, GAP]];
head.forEach(function (h) {
    var tail = ring[ring.length - 1];
    ring.push(polar(tail, side, h));
});
var A = ring[0], E = ring[1], D = ring[2], C = ring[3], B = ring[4];

var RIGHT = 0;

function ray(y, label) {
    seg([-4.0, y], [5.9, y]);
    arrowHead([5.9, y], RIGHT);
    text(-4.4, y, label, 'right', 'middle');
}
ray(GAP, '<i>l</i>');
ray(0, '<i>m</i>');

closed([A, E, D, C, B]);

text(A[0], A[1] + 0.30, 'A', 'middle', 'bottom');
text(B[0] - 0.32, B[1], 'B', 'right', 'middle');
text(C[0], C[1] - 0.30, 'C', 'middle', 'top');
text(D[0] + 0.32, D[1], 'D', 'left', 'middle');
text(E[0] + 0.32, E[1], 'E', 'left', 'middle');

// The two given/asked angles both open to the RIGHT, between a horizontal
// ray and a pentagon side.
angleMark(A, 0.95, dir(A, E), RIGHT, '20&deg;', 0.75);
angleMark(C, 0.95, RIGHT, dir(C, D), '<i>x</i>', 0.75);

// @size 540 530
// 解説34 (3) -- join FG, call P the meeting of EG and FH. The nine tips then
// equal pentagon FGIBD plus pentagon PHACE, less the three angles a, b, c of
// triangle PFG, and a + b + c = 180.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-5.9, 5.8, 5.9, -5.8],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var N = 9, STEP = 2, R = 4.3, START = 110;
var NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
var O = [0, 0];

var V = NAMES.map(function (_, i) { return polar(O, R, rad(START + 360 / N * i)); });
var P = {};
NAMES.forEach(function (n, i) { P[n] = V[i]; });

var order = [];
for (var i = 0; i < N; i++) { order.push(V[(i * STEP) % N]); }
closed(order);

V.forEach(function (v, i) {
    arc(v, 0.62, dir(v, V[(i + STEP) % N]), dir(v, V[(i - STEP + N) % N]));
    at(v, 0.75, dir(O, v), NAMES[i]);
});

// The construction the solution adds.
seg(P.F, P.G, DOTTED);
var Pt = meet(P.E, P.G, P.F, P.H);

text(Pt[0] - 0.10, Pt[1] - 0.10, 'P', 'right', 'top');

// Triangle PFG is a 20-20-140 splinter, so its base wedges are far too narrow
// to hold a letter: on the bisector at any readable radius the letter lands on
// top of P. The book keeps the arc inside the wedge and pushes the letter out
// across FG, onto the side away from P. Splitting arc from label is the only
// way to get both.
arc(P.F, 0.60, dir(P.F, P.G), dir(P.F, Pt));
at(P.F, 1.05, dir(P.F, P.G) - rad(22), '<i>a</i>');
arc(P.G, 0.60, dir(P.G, Pt), dir(P.G, P.F));
at(P.G, 1.05, dir(P.G, P.F) + rad(22), '<i>b</i>');

// c is marked on the VERTICAL angle at P, not on angle FPG itself. Same size,
// but it is the one that sits inside pentagon PHACE -- which is the pentagon
// the argument actually counts.
angleMark(Pt, 0.78, dir(Pt, P.H), dir(Pt, P.E), '<i>c</i>', 0.72);

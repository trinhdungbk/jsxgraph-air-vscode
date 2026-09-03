// @size 540 530
// 例題34 (3) 問題 -- the {9/2} star polygon. Find the sum of the nine marked
// tip angles. (Each tip is 180(9-4)/9 = 100, so the sum is 900.)

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-5.9, 5.8, 5.9, -5.8],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var N = 9,
    STEP = 2,          // {9/2}: every second vertex is joined
    R = 4.3,
    START = 110;       // A sits left of top, so A and I straddle the vertical

var NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
var O = [0, 0];

// Counter-clockwise from A, which is what puts B on the upper left and I on
// the upper right, matching the printed lettering.
var V = NAMES.map(function (_, i) { return polar(O, R, rad(START + 360 / N * i)); });

// gcd(STEP, N) === 1, so stepping by two closes a single path through all nine
// vertices; the inner nonagon is the by-product, never drawn on its own.
var order = [];
for (var i = 0; i < N; i++) { order.push(V[(i * STEP) % N]); }
closed(order);

V.forEach(function (v, i) {
    var prev = V[(i - STEP + N) % N], next = V[(i + STEP) % N];
    // Sweeping from `next` to `prev` keeps the arc inside the 100-degree tip;
    // the other way round would mark its 260-degree reflex.
    arc(v, 0.62, dir(v, next), dir(v, prev));
    // `at` offsets FROM the vertex; passing R + something here would add the
    // vertex radius to it again and fling the letter off the board.
    at(v, 0.68, dir(O, v), NAMES[i]);
});

// @size 700 301
// 解説 (2) 線分図 -- AQ carrying both decompositions at once:
//   (4):(9) on A-G-Q, times 3   ->  <12>:<27>
//   [2]:[1] on A-E-Q, times 13  ->  <26>:<13>
// Both totals come to <39>, so AG:GE = 12 : (26-12) = 12 : 14 = 6 : 7.
//
// RECONSTRUCTED from the method; the page prints no 解説.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.54, 4.21, 18.08, -3.81],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var UNIT = 0.45, TOTAL = 39, GX = 12, EX = 26;

function on(u) { return [u * UNIT, 0]; }

seg(on(0), on(TOTAL));
strokeSet([
    [[GX * UNIT, -0.20], [GX * UNIT, 0.20]],
    [[EX * UNIT, -0.20], [EX * UNIT, 0.20]]
]);

// The row depths are set by the WIDEST value in the diagram, not per mark: a
// triangled '21' has half again the circumradius of a '9', and a row that
// follows each glyph's own size stops being a row. 3.10 clears a two-digit
// triangle under the multiplier; the flat strip comes from lengthening the
// line, since the stack's height is fixed in board units whatever UNIT is.
function scaled(u, depth, times, n) {
    text(u * UNIT, depth * 1.80, '&#215;' + times, 'middle', 'middle', 0.55);
    unit(u * UNIT, depth * 3.10, n, 'triangle');
}

braceOn(on(0), on(GX), CIRCLED[3], 1.10, 1);
braceOn(on(GX), on(TOTAL), CIRCLED[8], 1.10, 1);
scaled(GX / 2, 1, 3, 12);
scaled((GX + TOTAL) / 2, 1, 3, 27);

braceOn(on(0), on(EX), '2', 1.10, -1, 'box');
braceOn(on(EX), on(TOTAL), '1', 1.10, -1, 'box');
scaled(EX / 2, -1, 13, 26);
scaled((EX + TOTAL) / 2, -1, 13, 13);

text(0, 0.52, 'A');
text(GX * UNIT, 0.52, 'G');
text(EX * UNIT, 0.52, 'E');
text(TOTAL * UNIT, 0.52, 'Q');

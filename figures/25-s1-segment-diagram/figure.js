// @size 700 295
// 解説 (1) 線分図 -- AC carrying both decompositions at once:
//   (3):(7) on A-G-C, times 3   ->  <9>:<21>
//   [2]:[1] on A-H-C, times 10  ->  <20>:<10>
// Both totals come to <30>, so the two can finally be read off one line:
// AG:GH:HC = 9 : (20-9) : 10 = 9 : 11 : 10.
//
// RECONSTRUCTED from the method; the page prints no 解説.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.53, 4.22, 18.52, -3.82],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The common unit is <30>, drawn at half a board unit each so the whole line
// fits a page-width strip. The positions ARE the answer, so they are written
// once, here, and everything else derives from them.
var UNIT = 0.6, TOTAL = 30, GX = 9, HX = 20;

function on(u) { return [u * UNIT, 0]; }

seg(on(0), on(TOTAL));
strokeSet([
    [[GX * UNIT, -0.20], [GX * UNIT, 0.20]],
    [[HX * UNIT, -0.20], [HX * UNIT, 0.20]]
]);

// The scaled value sits outside its brace, past the multiplier, so the column
// reads outward as the sentence it is: (3), times 3, is <9>.
// The row depths are set by the WIDEST value in the diagram, not per mark: a
// triangled '21' has half again the circumradius of a '9', and a row that
// follows each glyph's own size stops being a row. 3.10 clears a two-digit
// triangle under the multiplier; the flat strip comes from lengthening the
// line, since the stack's height is fixed in board units whatever UNIT is.
function scaled(u, depth, times, n) {
    text(u * UNIT, depth * 1.80, '&#215;' + times, 'middle', 'middle', 0.55);
    unit(u * UNIT, depth * 3.10, n, 'triangle');
}

braceOn(on(0), on(GX), CIRCLED[2], 1.10, 1);
braceOn(on(GX), on(TOTAL), CIRCLED[6], 1.10, 1);
scaled(GX / 2, 1, 3, 9);
scaled((GX + TOTAL) / 2, 1, 3, 21);

braceOn(on(0), on(HX), '2', 1.10, -1, 'box');
braceOn(on(HX), on(TOTAL), '1', 1.10, -1, 'box');
scaled(HX / 2, -1, 10, 20);
scaled((HX + TOTAL) / 2, -1, 10, 10);

text(0, 0.52, 'A');
text(GX * UNIT, 0.52, 'G');
text(HX * UNIT, 0.52, 'H');
text(TOTAL * UNIT, 0.52, 'C');

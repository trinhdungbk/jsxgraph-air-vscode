// @size 700 369
// 解説36 (1) 線分図 -- BD carrying both ratios at once, which is the whole method:
//   [1]:[2] on B-P-D, times 4  ->  <4>:<8>
//   (3):(1) on B-Q-D, times 3  ->  <9>:<3>
// Both totals come to <12>, so the two decompositions can finally be read off
// one line: BP:PQ:QD = 4 : (9-4) : 3.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.55, 3.45, 12.55, -3.45],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The positions ARE the answer -- P at 4 and Q at 9 of 12 is what the diagram
// exists to establish, so they are written once, here, and everything else is
// derived from them.
var BD = 12, PX = 4, QX = 9;

// Braces are inset from the division points. A brace that reaches the point it
// bounds runs into the point's own letter, and the two cannot both be moved:
// the letter belongs at the point and the brace belongs under the span.
var IN = 0.28;
function on(x) { return [x, 0]; }

seg(on(0), on(BD));
strokeSet([[[PX, -0.20], [PX, 0.20]], [[QX, -0.20], [QX, 0.20]]]);

// The composed value sits OUTSIDE its brace, past the multiplier, so the column
// reads inward-out as the sentence it is: [1], times 4, is <4>. Nothing can be
// stacked inside a brace here -- QD spans 3 units of 12, and a brace on a chord
// that short is already half a circle before anything fits under it.
function scaled(x, depth, times, n) {
    text(x, depth * 1.82, '&#215;' + times, 'middle', 'middle', 0.55);
    unit(x, depth * 2.58, n, 'triangle');
}

dimension(on(IN), on(PX - IN), '1', 1.10, 1, 'box');
dimension(on(PX + IN), on(BD - IN), '2', 1.10, 1, 'box');
scaled(PX / 2, 1, 4, 4);
scaled((PX + BD) / 2, 1, 4, 8);

dimension(on(IN), on(QX - IN), CIRCLED[2], 1.10, -1);
// Shallower than the others because its chord is shorter, not for looks: at the
// same 1.10 sagitta this brace is a 167-degree balloon.
dimension(on(QX + IN), on(BD - IN), CIRCLED[0], 0.85, -1);
scaled(QX / 2, -1, 3, 9);
scaled((QX + BD) / 2, -1, 3, 3);

text(0, 0.52, 'B');
text(PX, 0.52, 'P');
text(QX, 0.52, 'Q');
text(BD, 0.52, 'D');

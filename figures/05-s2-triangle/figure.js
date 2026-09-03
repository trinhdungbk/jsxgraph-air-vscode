// @size 613 470
// 解説34 (2) -- the question figure with the two unknowns named: every filled
// mark is a, every open mark is b. D is labelled so the text can talk about
// triangle DBC.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.4, 8.8, 11.4, -1.1],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var ANG_B = 50, ANG_C = 64;
var a = ANG_B / 3, b = ANG_C / 3;

var B = [0, 0], C = [10, 0];

function apex(base1, base2, ang1, ang2) {
    var t1 = Math.tan(rad(ang1)), t2 = Math.tan(rad(ang2)),
        x = (base2[0] - base1[0]) * t2 / (t1 + t2);
    return [base1[0] + x, x * t1];
}
var A = apex(B, C, ANG_B, ANG_C);

function fromB(deg) { return polar(B, 40, rad(deg)); }
function fromC(deg) { return polar(C, 40, rad(180 - deg)); }

var D = meet(B, fromB(a), C, fromC(b));
var stubB = meet(B, fromB(2 * a), C, D);
var stubC = meet(C, fromC(2 * b), B, D);

closed([A, B, C]);
seg(B, D); seg(D, C);
seg(B, stubB); seg(C, stubC);

text(A[0], A[1] + 0.34, 'A', 'middle', 'bottom');
text(B[0] - 0.34, B[1] - 0.12, 'B', 'right', 'middle');
text(C[0] + 0.34, C[1] - 0.12, 'C', 'left', 'middle');
text(D[0], D[1] + 0.30, 'D', 'middle', 'bottom');

angleMark(A, 1.15, dir(A, B), dir(A, C), '66&deg;', 1.05);
angleMark(D, 0.72, dir(D, B), dir(D, C), '<i>x</i>', 0.78);

// Mark and letter sit on the same bisector at two different radii: the mark
// says "these three are equal", the letter gives the equal value its name.
// Putting the letter anywhere else breaks the pairing the solution relies on.
var RB = 1.62, RC = 1.52, LETTER = 2.35;
[0, 1, 2].forEach(function (k) {
    mark(B, RB, rad(k * a), rad((k + 1) * a), true);
    at(B, LETTER, rad((k + 0.5) * a), 'a');
    mark(C, RC, rad(180 - (k + 1) * b), rad(180 - k * b), false);
    at(C, LETTER, rad(180 - (k + 0.5) * b), 'b');
});

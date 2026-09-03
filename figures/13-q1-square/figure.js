// @size 620 610
// 例題36 (1) 問題 -- square ABCD, E on diagonal BD produced with ∠DEC = 30°,
// F the foot of the perpendicular from C to AE. Find ∠DCF.
//
// INCOMPLETE: the source panel also labels G and H inside the square and this
// figure does not carry them. Their positions could not be read off the page
// at the resolution available -- H measures within 2px of the centre (the
// crossing of the diagonals) but G misses every candidate line by ~6px, which
// is the same order as the reading error. Rule F1: name what is missing rather
// than place it plausibly.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-1.35, 9.55, 9.75, -1.35],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

var S = 6;
var A = [0, S], B = [0, 0], C = [S, 0], D = [S, S];

// E is NOT free: it sits on BD produced, at the one distance the given 30°
// allows. With DC subtending 30° at a point (t, t) of the diagonal,
// 2t² − 2t − 1 = 0, so t = (1 + √3)/2 side lengths from B. Deriving it is
// what makes the marked 30° true on the finished figure rather than a
// number written beside an arc that measures something else (rule A2).
var t = (1 + Math.sqrt(3)) / 2;
var E = [S * t, S * t];

// F is the foot of the perpendicular from C to AE -- the right angle there is
// the whole construction, so it is built as one, not placed by eye.
var F = meet(A, E, C, polar(C, 1, dir(A, E) + Math.PI / 2));

closed([A, B, C, D]);
seg(A, C);
seg(B, E);      // the diagonal BD, produced past D to E
seg(A, E);      // F lies on this
seg(C, E);
seg(C, F);

// The 30° wedge is narrow, so the arc stays tight and the value sits well out
// on the bisector -- 0.31/sin 15° ≈ 1.2 board units before a glyph clears both
// arms (rule B3).
angleMark(E, 1.05, dir(E, D), dir(E, C), '30&deg;', 0.62);
rightAngle(F, dir(F, A), dir(F, C), 0.42);

// Every letter on the bisector of its widest gap, arms counted first (rule B4).
// A has four arms but three of them leave to the right, so the whole left is
// free; C carries five -- CB, CD, CA, CE, CF -- and only the outward corner
// is clear.
at(A, 0.58, rad(142.5), 'A');
at(B, 0.58, rad(225), 'B');
at(C, 0.58, rad(307.5), 'C');
at(D, 0.58, rad(112.5), 'D');
at(E, 0.58, rad(45), 'E');
at(F, 0.58, rad(105), 'F');

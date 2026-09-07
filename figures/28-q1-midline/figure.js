// @size 700 558
// 例題37 (1) 問題 -- the midpoint connector theorem applied twice over. E and F
// TRISECT AB, and that is forced, not chosen: the solution needs E to be the
// midpoint of AF and F to be the midpoint of BE, so AE = EF = FB. The order
// along AB is A, E, F, B -- getting it backwards makes every mark in the figure
// contradict the argument it is drawn for.
//
//   in triangle AFC: E, D midpoints of AF, AC  =>  ED // FC, ED:FC = 1:2
//   in triangle BDE: F midpoint of BE, FG // ED =>  FG:ED = 1:2, so G bisects BD
// Given FG = 6: x = ED = 12, FC = 24, y = GC = 24 - 6 = 18.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.89, 5.34, 6.88, -0.87],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

// The triangle is free -- nothing in the question fixes it -- and this page is
// NOT available as a file, so its proportions are taken from the paste and are
// therefore unreliable by rule A8: eyeballing a paste had the last page 24% out.
// Flagged rather than trusted; a crop closes it.
var BASE = 6, RISE = 4.25, APEX = 3.37;

var B = [0, 0], C = [BASE, 0], A = [APEX, RISE];

var E = along(A, B, 1 / 3),
    F = along(A, B, 2 / 3),
    D = midpoint(A, C),
    G = midpoint(B, D);

closed([A, B, C]);
seg(B, D);
// ONE segment from F to C, with G on it. The stretches FG and GC are braced
// separately; drawing F-G and G-C as their own segments would lay a second
// stroke over the first.
seg(F, C);
seg(E, D);

equalLength(A, E, false);
equalLength(E, F, false);
equalLength(F, B, false);
equalLength(A, D, false);
equalLength(D, C, false);

braceOn(E, D, '<i>x</i>', 0.42, 1);
// FG and GC share the line FC. They stay level rather than stacking, because
// B12's inset opens a gap at G that holds G's own letter (rule B9's condition).
// Both bulge UP, into the free strip between FC and BD. Downward they land on
// the BD stroke and on the base: the side is decided once for the LINE (B9),
// and the emptier side of this one is the inside.
braceOn(F, G, '6', 0.42, 1);
braceOn(G, C, '<i>y</i>', 0.42, 1);

labelAt(A, 0.42, [dir(A, B), dir(A, C), dir(A, D), dir(A, E)], 'A');
labelAt(B, 0.42, [dir(B, A), dir(B, C), dir(B, D)], 'B');
labelAt(C, 0.42, [dir(C, A), dir(C, B), dir(C, F)], 'C');
labelAt(D, 0.42, [dir(D, A), dir(D, C), dir(D, B), dir(D, E)], 'D');
labelAt(E, 0.38, [dir(E, A), dir(E, B), dir(E, D)], 'E');
labelAt(F, 0.38, [dir(F, A), dir(F, B), dir(F, C)], 'F');
// G is a crossing, so its widest gap is tied twice over; the page seats the
// letter below the median, so that is the side the tie is broken toward.
labelAt(G, 0.40, [dir(G, B), dir(G, D), dir(G, F), dir(G, C)], 'G', 0, rad(250));

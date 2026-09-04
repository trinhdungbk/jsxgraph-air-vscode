// @size 640 470
// 解説37 (1) -- two reduced solution diagrams.  Reusing the same construction
// twice is intentional: the answer's figures differ by which midpoint theorem
// layer is being argued, not by geometry.

var board = JXG.JSXGraph.initBoard(BOARD, {
    boundingbox: [-0.95, 10.55, 12.75, -1.85],
    axis: false, grid: false, keepaspectratio: true,
    showNavigation: false, showCopyright: false
});

function addDiagram(dx, dy, mode, caption) {
    var A = [dx + 3.0, dy + 4.05], B = [dx, dy], C = [dx + 5.8, dy],
        F = along(A, B, 1 / 3),
        E = along(A, B, 2 / 3),
        D = midpoint(A, C),
        G = midpoint(B, D);

    closed([A, B, C]);
    seg(B, D);
    seg(F, C);
    seg(E, D, mode === 1 ? HEAVY : INK);
    seg(G, C, mode === 2 ? HEAVY : INK);
    seg(F, G, mode === 2 ? HEAVY : INK);

    if (mode === 1) {
        seg(E, F, DOTTED);
        seg(D, C, DOTTED);
        ticks(A, F, 1, 0.12);
        ticks(F, E, 1, 0.12);
        ticks(A, D, 2, 0.12);
        ticks(D, C, 2, 0.12);
        dimension(E, D, '<i>x</i>', 0.24, 1);
        dimension(F, C, '24', 0.44, -1);
    } else {
        seg(E, D, DOTTED);
        ticks(B, F, 1, 0.12);
        ticks(F, E, 1, 0.12);
        ticks(B, G, 2, 0.12);
        ticks(G, D, 2, 0.12);
        dimension(F, G, '6', 0.22, -1);
        dimension(E, D, '12', 0.30, 1);
        dimension(G, C, '<i>y</i>', 0.32, -1);
        dimension(F, C, '24', 0.48, -1);
    }

    at(A, 0.30, rad(92), 'A');
    at(B, 0.30, rad(222), 'B');
    at(C, 0.30, rad(318), 'C');
    at(D, 0.30, rad(9), 'D');
    at(E, 0.27, rad(178), 'E');
    at(F, 0.27, rad(180), 'F');
    at(G, 0.27, rad(248), 'G');
    text(dx + 2.9, dy - 0.50, caption, 'middle', 'top', 0.46);
}

addDiagram(0, 5.70, 1, '図1');
addDiagram(0, -0.35, 2, '図2');

// The arithmetic labels sit apart from the drawings in the book, but a
// stand-alone figure needs the result visible in the asset itself.
text(8.2, 8.30, '<i>x</i> = 6 &#215; 2 = 12', 'left', 'middle', 0.52);
text(8.2, 7.50, 'FC = 12 &#215; 2 = 24', 'left', 'middle', 0.52);
text(8.2, 2.00, '<i>y</i> = 24 - 6 = 18', 'left', 'middle', 0.52);
text(8.2, 1.10, 'Ans.  <i>x</i> = 12,  <i>y</i> = 18', 'left', 'middle', 0.52);

var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-4.5, 4, 5.5, -4.5], axis: false, showNavigation: false, showCopyright: false, grid: false, keepaspectratio: true});
board.figureAspectRatio = 1.1765;
/* figure-scaffold:style:begin */
(function () {
    var INK = '#000000',
        SERIF = 'font-family:\"Times New Roman\",Times,serif;',
        WEIGHT = 1.4,
        TYPE = 0.042,
        SHADE = 0.18,
        STATIC = true,
        DOTS = false,
        options = board.options,
        SIZE = typeSize(),
        DOTLESS = {point: 1, glider: 1, intersection: 1, midpoint: 1, circumcenter: 1, incenter: 1, orthogonalprojection: 1, perpendicularpoint: 1, parallelpoint: 1, mirrorpoint: 1, otherintersection: 1, polepoint: 1, point3d: 1};

    function typeSize() {
        var r = board.containerObj.getBoundingClientRect(),
            diagonal = Math.sqrt(r.width * r.width + r.height * r.height);
        return Math.max(9, Math.min(72, Math.round(TYPE * diagonal)));
    }

    function monochrome(a) {
        if (a.strokeColor !== undefined) { a.strokeColor = INK; }
        if (a.highlightStrokeColor !== undefined) { a.highlightStrokeColor = INK; }
        if (a.fillColor !== undefined) { a.fillColor = INK; }
        if (a.highlightFillColor !== undefined) { a.highlightFillColor = INK; }
        if (a.fillOpacity !== undefined) { a.fillOpacity = 0; }
        if (a.highlightFillOpacity !== undefined) { a.highlightFillOpacity = 0; }
    }

    // Door 1 -- the board's own defaults, the only door a composite element's
    // internally built sub-elements pass through.
    //
    // The walk RECURSES because those defaults nest: a polygon's auto-created
    // corners read 'options.polygon.vertices', a border segment reads
    // 'options.polygon.borders', and a one-level sweep leaves both of them
    // JSXGraph's vermillion. Depth-limited and cycle-guarded -- board.options
    // holds back-references, and this runs before every figure.
    function defaults(node, depth, seen) {
        if (!node || typeof node !== 'object' || depth > 3) { return; }
        if (seen.indexOf(node) >= 0) { return; }
        seen.push(node);
        monochrome(node);
        if (node.fontSize !== undefined) { node.fontSize = SIZE; }
        if (node.cssDefaultStyle !== undefined) { node.cssDefaultStyle = SERIF; }
        if (node.highlightCssDefaultStyle !== undefined) {
            node.highlightCssDefaultStyle = SERIF;
        }
        Object.keys(node).forEach(function (key) {
            var child = node[key];
            if (child && typeof child === 'object' && !Array.isArray(child)) {
                defaults(child, depth + 1, seen);
            }
        });
    }
    Object.keys(options).forEach(function (key) {
        defaults(options[key], 0, []);
    });
    if (!DOTS) {
        Object.keys(DOTLESS).forEach(function (key) {
            var a = options[key];
            if (!a) { return; }
            a.size = 0;
            a.strokeOpacity = 0;
            a.highlightStrokeOpacity = 0;
        });
    }
    options.text.strokeColor = INK;
    options.text.fontSize = SIZE;
    // cssDefaultStyle, not cssStyle: a dimension label carries its own
    // cssStyle for the white knock-out behind the digits, and setting the
    // family there would be overwritten by it.
    options.text.cssDefaultStyle = SERIF;
    options.text.highlightCssDefaultStyle = SERIF;
    options.label.strokeColor = INK;
    options.label.fontSize = SIZE;
    options.label.cssDefaultStyle = SERIF;
    options.label.highlightCssDefaultStyle = SERIF;
    // The book marks an angle with an ARC, never a filled wedge.
    options.angle.fillOpacity = 0;
    options.angle.highlightFillOpacity = 0;

    function normalize(a, kind) {
        a.strokeColor = INK;
        a.highlightStrokeColor = INK;
        a.fillColor = INK;
        a.highlightFillColor = INK;
        // A region the question shades keeps its fill, but as grey ink and
        // capped: the page is line art and a saturated tint prints as a
        // muddy block.
        if (a.fillOpacity === undefined) { a.fillOpacity = 0; }
        a.fillOpacity = Math.min(a.fillOpacity, SHADE);
        a.highlightFillOpacity = a.fillOpacity;
        if (kind === 'angle') { a.fillOpacity = 0; a.highlightFillOpacity = 0; }
        if (a.strokeWidth === undefined) { a.strokeWidth = WEIGHT; }
        a.highlightStrokeWidth = a.strokeWidth;
        a.highlight = false;
        if (STATIC && a.fixed === undefined) { a.fixed = true; }
        if (DOTLESS[kind] && !DOTS) {
            a.size = 0;
            a.strokeOpacity = 0;
            a.fillOpacity = 0;
        }
        if (a.label && typeof a.label === 'object') {
            a.label.strokeColor = INK;
            a.label.fontSize = SIZE;
        }
        return a;
    }

    // Door 2 -- every explicit create call.
    var create = board.create;
    board.create = function (kind, parents, attributes) {
        return create.call(board, kind, parents,
            normalize(attributes || {}, String(kind).toLowerCase()));
    };

    // Door 3 -- setAttribute, which never touches create.
    var proto = JXG.GeometryElement.prototype, setAttribute = proto.setAttribute;
    proto.setAttribute = function (attributes) {
        var a = attributes || {};
        if (this.board === board) {
            normalize(a, String(this.elType).toLowerCase());
        }
        return setAttribute.call(this, a);
    };
})();
/* figure-scaffold:style:end */
var maxShownStep = (typeof showStep === 'undefined' || showStep === null) ? Infinity : showStep;

// Let's solve the geometry exactly.
// We want a regular pentagon ABCDE.
// Let side length be s.
// A is at (0, 2.5).
// Line l is horizontal through A: y = 2.5.
// The angle of AE with line l (to the right, i.e. positive x-direction) is 20°.
// Since E is to the right and below A (or above? The draft has E at (2.349, 1.645), which is below A(0, 2.5)).
// So the vector AE makes an angle of -20° with the positive x-axis.
// Let's set s = 3.0.
// Then E is at (0 + s * cos(-20°), 2.5 + s * sin(-20°))
// cos(-20°) = 0.9396926, sin(-20°) = -0.3420201
// E = (2.8191, 1.4739)
// Since ABCDE is a regular pentagon, going counter-clockwise: A -> B -> C -> D -> E -> A.
// Thus, the interior angle is 108°.
// The vector EA goes from E to A. Its direction is 160°.
// To go from E to D, we rotate EA by -108° (clockwise, since A->B->C->D->E is counter-clockwise, so E->D is clockwise relative to E->A).
// Direction of ED = 160° - 108° = 52°.
// D = E + (s * cos(52°), s * sin(52°))? No, let's use standard regular polygon formulas.
// Let's define A = (0, 2.5).
// Since we want to use JSXGraph's regularpolygon [A, B, 5], we need to find B.
// In a regular pentagon ABCDE (counter-clockwise), the interior angle at A is 108°.
// The side AE is at angle -20° (or 340°) from A.
// The side AB is at angle -20° - 108° = -128° (or 232°) from A.
// So B = A + (s * cos(-128°), s * sin(-128°))
// cos(-128°) = -0.615661, sin(-128°) = -0.788011
// For s = 3.0:
// B_x = 0 + 3.0 * (-0.615661) = -1.8470
// B_y = 2.5 + 3.0 * (-0.788011) = 0.1360

var point_a = board.create('point', [0.0, 2.5], {name: 'A', withLabel: true, label: {offset: [-10, 12], anchorY: 'bottom'}});
var point_b = board.create('point', [-1.8470, 0.1360], {name: 'B', withLabel: true, label: {offset: [-12, -5]}});

var p_l_right = board.create('point', [4.5, 2.5], {visible: false});
var p_l_left = board.create('point', [-3.5, 2.5], {visible: false});

// Line l
var line_l = board.create('segment', [p_l_left, p_l_right], {name: '<i>l</i>', withLabel: true, label: {position: 'rt', offset: [-15, 10]}});
line_l.setStraight(true, true);

// Regular pentagon ABCDE
var poly = board.create('regularpolygon', [point_a, point_b, 5], {withLines: false, fillOpacity: 0.0});

var point_c = poly.vertices[2];
point_c.setAttribute({name: 'C', withLabel: true, label: {offset: [-10, -12], anchorY: 'top'}});

var point_d = poly.vertices[3];
point_d.setAttribute({name: 'D', withLabel: true, label: {offset: [12, -5]}});

var point_e = poly.vertices[4];
point_e.setAttribute({name: 'E', withLabel: true, label: {offset: [12, 10]}});

// Create explicit segments for the pentagon sides
var segment_ab = board.create('segment', [point_a, point_b], {strokeColor: '#333', strokeWidth: 2});
var segment_bc = board.create('segment', [point_b, point_c], {strokeColor: '#333', strokeWidth: 2});
var segment_cd = board.create('segment', [point_c, point_d], {strokeColor: '#333', strokeWidth: 2});
var segment_de = board.create('segment', [point_d, point_e], {strokeColor: '#333', strokeWidth: 2});
var segment_ea = board.create('segment', [point_e, point_a], {strokeColor: '#333', strokeWidth: 2});

// Line m parallel to l through C
var line_m = board.create('parallel', [line_l, point_c], {name: '<i>m</i>', withLabel: true, label: {position: 'rt', offset: [-15, -15]}});
line_m.setStraight(true, true);

// Helper point for line m to the right of C
var p_m_right = board.create('point', [function() { return point_c.X() + 4.0; }, function() { return point_c.Y(); }], {visible: false});

// Angles
var angle_l_ae = board.create('angle', [p_l_right, point_a, point_e], {name: '20°', withLabel: true, radius: 0.8, label: {offset: [5, -2]}});
var angle_x = board.create('angle', [point_d, point_c, p_m_right], {name: '<i>x</i>', withLabel: true, radius: 0.8, label: {offset: [5, 5]}});

// Step-gated elements
var segment_ad = board.create('segment', [point_a, point_d], {visible: (2 <= maxShownStep), dash: 1});
var segment_ac = board.create('segment', [point_a, point_c], {visible: (4 <= maxShownStep), dash: 1});

var polygon_aed = board.create('polygon', [point_a, point_e, point_d], {visible: (2 <= maxShownStep), fillOpacity: 0.1, withLines: false});
var polygon_acd = board.create('polygon', [point_a, point_c, point_d], {visible: (4 <= maxShownStep), fillOpacity: 0.1, withLines: false});
var polygon_bca = board.create('polygon', [point_b, point_c, point_a], {visible: (4 <= maxShownStep), fillOpacity: 0.1, withLines: false});

board.update();
/* figure-scaffold:fit:begin */
(function () {
    // Frame the board on what it actually DREW, labels included.
    //
    // WHY here and not asked of the generator: a generated boundingBox is
    // padded by eye and routinely leaves the figure floating in a third of its
    // canvas, and a label placed outside that box is silently CLIPPED --
    // JSXGraph renders text as absolutely-positioned HTML, so it throws
    // nothing, the board still reports the object, and the letter is simply
    // not on screen. Fitting to the drawn extent makes both impossible.
    //
    // Skipped for dynamic figures (the geometry moves after this runs, so a
    // frame fitted at rest would clip it) and for coordinate figures (the
    // reader takes values off the axes, so the visible range is part of the
    // question).
    try {
        var TYPE = 0.042, PAD = 0.55, PASSES = 2,
            container = board.containerObj;

        function user(x, y) {
            var c = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x, y], board);
            return [c.usrCoords[1], c.usrCoords[2]];
        }

        function contentBox() {
            var frame = container.getBoundingClientRect(),
                svg = container.querySelector('svg'),
                lo = [Infinity, Infinity], hi = [-Infinity, -Infinity],
                drawn = false, box;

            function note(left, top, right, bottom) {
                var a = user(left, top), b = user(right, bottom);
                lo[0] = Math.min(lo[0], a[0], b[0]);
                hi[0] = Math.max(hi[0], a[0], b[0]);
                lo[1] = Math.min(lo[1], a[1], b[1]);
                hi[1] = Math.max(hi[1], a[1], b[1]);
                drawn = true;
            }

            if (svg) {
                box = svg.getBBox();
                if (box.width || box.height) {
                    note(box.x, box.y, box.x + box.width, box.y + box.height);
                }
            }
            Array.prototype.forEach.call(
                container.querySelectorAll('.JXGtext'),
                function (t) {
                    var r = t.getBoundingClientRect();
                    if (!r.width && !r.height) { return; }
                    note(r.left - frame.left, r.top - frame.top,
                         r.right - frame.left, r.bottom - frame.top);
                }
            );
            return drawn && isFinite(lo[0]) && hi[0] > lo[0] && hi[1] > lo[1]
                ? [lo[0], hi[1], hi[0], lo[1]] : null;
        }

        function retype() {
            var r = container.getBoundingClientRect(),
                diagonal = Math.sqrt(r.width * r.width + r.height * r.height),
                size = Math.max(9, Math.min(72, Math.round(TYPE * diagonal)));
            board.options.text.fontSize = size;
            board.options.label.fontSize = size;
            board.objectsList.forEach(function (element) {
                if (element.elType === 'text') {
                    element.setAttribute({fontSize: size});
                }
                if (element.label) { element.label.setAttribute({fontSize: size}); }
            });
        }

        // WHY figureAspectRatio is stamped from the spec's boundingBox in the
        // init line above and NOT measured here: an infinite 'line' always
        // spans its container, so the drawn extent's aspect just echoes
        // whatever shape the container happens to have. Measure it, reshape to
        // it, measure again and it walks. This pass only trims the slack
        // inside the container it is given.
        function fit() {
            var pass, box;
            for (pass = 0; pass < PASSES; pass++) {
                box = contentBox();
                if (!box) { return; }
                board.setBoundingBox(
                    [box[0] - PAD, box[1] + PAD, box[2] + PAD, box[3] - PAD], true
                );
                retype();
                board.fullUpdate();
            }
        }

        fit();
        // A host that reshapes its container to figureAspectRatio calls this
        // afterwards, and the figure re-fits into the shape it asked for.
        board.figureRefit = fit;
    } catch (error) {
        if (window.console) { console.warn('figure auto-fit skipped:', error); }
    }
})();
/* figure-scaffold:fit:end */
var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-1, 4.5, 8, -1], axis: false, showNavigation: false, showCopyright: false, grid: false, keepaspectratio: true});
board.figureAspectRatio = 1.6364;
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
    // A polygon in stock JSXGraph is visible ONLY by its fill: its own
    // strokeColor is null and its borders carry no strokeColor key at all, so
    // they paint stroke:none and the shape is a coloured area with no outline.
    // Turning the fill off -- which monochrome line art must -- therefore
    // erases the polygon completely unless its borders are given ink here.
    // A figure whose shapes are polygons renders as a blank page otherwise.
    ['polygon', 'regularpolygon', 'polygonalchain', 'parallelogram'].forEach(
        function (key) {
            var a = options[key];
            if (!a) { return; }
            a.strokeColor = INK;
            a.highlightStrokeColor = INK;
            a.borders = a.borders || {};
            a.borders.strokeColor = INK;
            a.borders.highlightStrokeColor = INK;
            a.borders.strokeOpacity = 1;
            a.borders.highlightStrokeOpacity = 1;
            a.borders.strokeWidth = WEIGHT;
            a.borders.highlightStrokeWidth = WEIGHT;
        }
    );
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
var pB = board.create('point', [0.0, 0.0], {name: 'B', withLabel: true, label: {offset: [-10, -10]}});
var pC = board.create('point', [4.0, 0.0], {name: 'C', withLabel: true, label: {offset: [0, -12]}});
var pA = board.create('point', [2.0, 3.4641], {name: 'A', withLabel: true, label: {offset: [0, 12]}});
var pE = board.create('point', [7.0, 0.0], {name: 'E', withLabel: true, label: {offset: [10, -10]}});
var pD = board.create('point', [5.5, 2.5981], {name: 'D', withLabel: true, label: {offset: [10, 10]}});

var polyABC = board.create('polygon', [pA, pB, pC], {hasInnerPoints: false});
var polyDCE = board.create('polygon', [pD, pC, pE], {hasInnerPoints: false});

var sAB = board.create('segment', [pA, pB]);
var sBC = board.create('segment', [pB, pC]);
var sAC = board.create('segment', [pA, pC]);
var sCE = board.create('segment', [pC, pE]);
var sCD = board.create('segment', [pC, pD]);
var sDE = board.create('segment', [pD, pE]);

var sBD = board.create('segment', [pB, pD]);
var sAE = board.create('segment', [pA, pE]);

var pP = board.create('intersection', [sBD, sAE, 0], {name: 'P', withLabel: true, label: {offset: [-10, 10]}, strokeWidth: 2.8});

var angleBPE = board.create('angle', [pB, pP, pE], {name: '120°', withLabel: true, radius: 0.4});
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
        var TYPE = 0.042, PAD = 0.55, PASSES = 3,
            container = board.containerObj;

        function user(x, y) {
            var c = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x, y], board);
            return [c.usrCoords[1], c.usrCoords[2]];
        }

        function contentBox() {
            var frame = container.getBoundingClientRect(),
                svg = container.querySelector('svg'),
                lo = [Infinity, Infinity], hi = [-Infinity, -Infinity],
                drawn = false, box, pad, a, b;

            // Measured and padded in PIXELS, converted to board units once at
            // the end. A pad carried in board units is a different amount of
            // ink after every refit -- the frame shrinks, the unit grows, and
            // the margin that was half a letter-height stops being one. That
            // is what left a label clipped by a few pixels.
            function note(left, top, right, bottom) {
                lo[0] = Math.min(lo[0], left, right);
                hi[0] = Math.max(hi[0], left, right);
                lo[1] = Math.min(lo[1], top, bottom);
                hi[1] = Math.max(hi[1], top, bottom);
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
            if (!drawn || !isFinite(lo[0]) || hi[0] <= lo[0] || hi[1] <= lo[1]) {
                return null;
            }
            pad = PAD * (board.options.text.fontSize || 12);
            a = user(lo[0] - pad, lo[1] - pad);
            b = user(hi[0] + pad, hi[1] + pad);
            return [
                Math.min(a[0], b[0]), Math.max(a[1], b[1]),
                Math.max(a[0], b[0]), Math.min(a[1], b[1])
            ];
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
            // retype FIRST: the type size follows the container, not the box,
            // so it is settled before anything is measured -- measuring at one
            // size and then growing the letters is how the frame ends up a few
            // pixels short of the label it was fitted to.
            retype();
            for (pass = 0; pass < PASSES; pass++) {
                box = contentBox();
                if (!box) { return; }
                board.setBoundingBox(box, true);
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
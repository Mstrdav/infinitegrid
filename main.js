var canvas, ctx;
var zoom = 12.5;
var x = 0;
var y = 0;

// the grid is a hashtable
var grid = {};

// compute hash from coordinates
function hash(x, y) {
    return x + "," + y;
}

// when doument is loaded, initialize canvas
window.onload = function () {
    initCanvas();
    initGrid();
    drawGrid();
    initEventListeners();
}

// initialize canvas
function initCanvas() {
    // get canvas
    canvas = document.getElementById('grid');
    // get context
    ctx = canvas.getContext('2d');
    // set canvas width and height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // translate canvas to center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // set canvas background color
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // set canvas color
    ctx.fillStyle = '#fff';
}

// initialize grid
function initGrid() {
    // fill grid with empty cells
    for (var i = Math.floor(x - canvas.width / zoom / 2); i < x + canvas.width / zoom / 2; i++) {
        for (var j = Math.floor(y - canvas.height / zoom / 2); j < y + canvas.height / zoom / 2; j++) {
            grid[hash(i, j)] = /* random between 0 and 1 */ Math.floor(Math.random() * 2);
        }
    }
}

// draw grid
function drawGrid() {
    // clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0 - canvas.width / 2, 0 - canvas.height / 2, canvas.width, canvas.height);
    // draw grid
    ctx.fillStyle = '#fff';

    for (var i = Math.floor(x-canvas.width / zoom / 2); i < x + canvas.width / zoom / 2; i++) {
        for (var j = Math.floor(y - canvas.height / zoom / 2); j < y + canvas.height / zoom / 2; j++) {
            if (grid[hash(i, j)] == 1) {
                ctx.fillRect((i-x) * zoom, (j-y) * zoom, zoom, zoom);
            }
        }
    }
}

// change canvas size when window is resized
window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // refill canvas with background color
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // add previously unseen cells to grid
    for (let i = Math.floor(x - canvas.width / zoom / 2); i < x + canvas.width / zoom / 2; i++) {
        for (let j = Math.floor(y - canvas.height / zoom / 2); j < y + canvas.height / zoom / 2; j++) {
            if (!(hash(i, j) in grid)) {
                grid[hash(i, j)] = /* random between 0 and 1 */ Math.floor(Math.random() * 2);
            }
        }
    }

    // draw grid
    drawGrid();
}

// move grid
function moveGrid(dx, dy) {
    x -= dx;
    y -= dy;

    for (let i = Math.floor(x - canvas.width / zoom / 2); i < x + canvas.width / zoom / 2; i++) {
        for (let j = Math.floor(y - canvas.height / zoom / 2); j < y + canvas.height / zoom / 2; j++) {
            if (!(hash(i, j) in grid)) {
                grid[hash(i, j)] = /* random between 0 and 1 */ Math.floor(Math.random() * 2);
            }
        }
    }

    // draw grid
    drawGrid();
}

// zoom grid
function zoomGrid(dz) {
    zoom += dz;

    // if zoom is too small, set it to 1
    if (zoom < 6) {
        zoom = 6;
    }

    // if zoom is too big, set it to max
    if (zoom > 100) {
        zoom = 100;
    }

    // add missing cells to grid
    for (let i = Math.floor(x - canvas.width / zoom / 2); i < x + canvas.width / zoom / 2; i++) {
        for (let j = Math.floor(y - canvas.height / zoom / 2); j < y + canvas.height / zoom / 2; j++) {
            if (!(hash(i, j) in grid)) {
                grid[hash(i, j)] = /* random between 0 and 1 */ Math.floor(Math.random() * 2);
            }
        }
    }

    drawGrid();
}

function initEventListeners() {
    // move grid when mouse is dragged
    canvas.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        // if mouse isnt pressed return
        if (!e.buttons) {
            return;
        }

        let dx = e.movementX;
        let dy = e.movementY;

        moveGrid(dx/zoom, dy/zoom);
    });

    // zoom grid when mouse wheel is scrolled
    canvas.addEventListener('wheel', function (e) {
        let dz = e.deltaY;
        zoomGrid(dz/zoom);
    });
}
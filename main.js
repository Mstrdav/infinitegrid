var canvas, ctx;
var zoom = 1;
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
    // draw grid at animation frame
    window.requestAnimationFrame(function () {
        drawGrid();
        window.requestAnimationFrame(arguments.callee);
    });
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
    // set canvas background color
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // set canvas color
    ctx.fillStyle = '#fff';
}

// initialize grid
function initGrid() {
    // fill grid with empty cells
    for (var i = 0; i < canvas.width; i += 10 * zoom) {
        for (var j = 0; j < canvas.height; j += 10 * zoom) {
            grid[hash(i, j)] = (i + j)/10%2;
        }
    }
}

// draw grid
function drawGrid() {
    // clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw grid
    ctx.fillStyle = '#fff';

    for (var i = 0; i < canvas.width; i += 10 * zoom) {
        for (var j = 0; j < canvas.height; j += 10 * zoom) {
            if (grid[hash(i, j)] == 1) {
                ctx.fillRect(i, j, 10 * zoom, 10 * zoom);
            }
        }
    }
}

// change canvas size when window is resized
window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // refill canvas with background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
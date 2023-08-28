var canvas = document.getElementById("myCanvas");

const width = canvas.width = 1600;
const height = canvas.height = 800;
const ctx = canvas.getContext('2d');

const gridSize = 40;
const lineWidth = 3;
var endL = 0, endH = 0;
const endofGridL = width;
const endofGridH = height;
var numGrids = 0;

var gridsL = 0, gridsH = 0;

export function createCanvas() {
    ctx.fillStyle = 'rgb(0,0,0)';
    for (var i = 0; i < (endofGridL - lineWidth); i += (lineWidth + gridSize)) {
        ctx.fillRect(i, 0, lineWidth, endofGridH);
        numGrids++;
    }
    gridsL = numGrids - 1;
    numGrids = 0;

    for (var y = 0; y < (endofGridH - lineWidth); y += (lineWidth + gridSize)) {
        ctx.fillRect(0, y, endofGridL, lineWidth);
        numGrids++;
    }
    gridsH = numGrids - 1;

    i -= gridSize;
    y -= gridSize;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(i, 0, endofGridL, y);
    ctx.fillRect(0, y, i, endofGridH);

    return canvas;
}

export function getCanvas() {
    return canvas;
}

export function getGridInfo() {
    //*,#gridsLengthWise(n),*,#gridsHeightWise(m),*,*
    return [endofGridL, gridsL, endofGridH, gridsH, lineWidth, gridSize];
}
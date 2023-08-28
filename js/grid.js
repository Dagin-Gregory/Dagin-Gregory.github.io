import * as logic from './gameLogic.js'

var grid;
export function createGrid(rows, cols) {
    var i = 0;
    grid = document.getElementById('gameGrid');
    for (var r = 0; r < rows; ++r) {
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c = 0; c < cols; ++c) {
            var cell = tr.appendChild(document.createElement('td'));
            cell.className = '.grid td';
            cell.id = c + "," + r;
            cell.addEventListener('click', function () {
                var str = this.id.split(',');
                var x = parseInt(str[0]), y = parseInt(str[1]);
                logic.cellClicked(x, y);
            });
        }
    }
    document.body.appendChild(grid);
    return grid;
}

export function getValue(x, y) {
    return grid.rows[y].cells[x].innerHTML;
}

export function setValue(x, y, newValue) {
    grid.rows[y].cells[x].innerHTML = newValue;
}

export function getCell(x, y) {
    var cell = document.getElementById(x + "," + y);
    return cell;
}

export function getCoord(x, y) {
    return x + "," + y;
}
import playerCharacter from './playerCharacter.js'
import * as g from './grid.js'

var testChar = new playerCharacter("Kahl");
var testChar1 = new playerCharacter("Jeff");

let chars = new Map(null);
let charInfoKeys = new Map(null);
populateCharInfoMap();
let keys = ['Name', 'Health', 'Movement Actions', 'Actions', 'Level'];

let selectedChar;
let prevChar;

let width = 40;
let height = 30;
let diagMult = 1.4;
var grid = g.createGrid(height, width);

var healthButton = document.getElementById('healthChange');
var characterButton = document.getElementById('addCharacter');
var delCharacter = document.getElementById('delCharacter');
var plusOneMA = document.getElementById('movementAdd');
var mapFiles = document.getElementById('mapInput');

healthButton.addEventListener('click', healthChange);
characterButton.addEventListener('click', addCharacter);
delCharacter.addEventListener('click', deleteCharacter);
plusOneMA.addEventListener('click', addMovementAction);
mapFiles.addEventListener('change', changeMap);

testChar.drawChar(10, 10, chars);
testChar1.drawChar(15, 15, chars);

function healthChange() {
    if (selectedChar != undefined) {
        var iHealth = prompt("New health : ");
        selectedChar.health = iHealth;
        overwriteInfoBox(selectedChar);
    }
    return;
}

function addCharacter() {
    var isEnemy = prompt("Is the character an enemy?(Y|N) : ");
    isEnemy = (isEnemy.toLowerCase() == 'y') ? true : false;
    //var speed = parseInt(prompt("Character speed : "));
    var speed = 30;
    var actions = 1;
    var movementActions = 1;
    var level = 1;
    var name = prompt("Character name : ");
    var health = parseInt(prompt("Character health : "));
    var location = prompt("Position on grid ('x,y' No spaces) : ");
    location = location.split(',');
    var x = parseInt(location[0]), y = parseInt(location[1]);

    var newCharacter = new playerCharacter(name, x, y, speed, actions, movementActions, level, health, isEnemy);
    newCharacter.drawChar(x, y, chars);
}

function deleteCharacter() {
    if (selectedChar != undefined) {
        var ensure = prompt("Are you sure you want to delete " + selectedChar.name + " ? (Y|N)");
        if (ensure.toLowerCase() == 'y') {
            overwriteInfoBox(selectedChar, true);
            chars = selectedChar.eraseChar(chars);
            var p = selectedChar.coords;
            shadeSquaresNormal(p[0], p[1], selectedChar.moveSpeed);
            selectedChar = undefined;
            prevChar = undefined;
        }
    }
}

function addMovementAction() {
    if (selectedChar != undefined)
        selectedChar.movementActions += 1;
    overwriteInfoBox(selectedChar);
}

function changeMap() {
    const fileList = this.files;
    var newMap = fileList[0];
    newMap = URL.createObjectURL(newMap);
    //var newMap = document.getElementById("mapInput").files[0];
    grid.style.backgroundImage = `url("${newMap}")`;
}

export function cellClicked(c, r) {
    var coord = g.getCoord(c, r);
    var t = chars.get(coord);
    var cell = g.getCell(c, r);

    var isCharacter = (t instanceof playerCharacter);

    if (selectedChar != undefined) {
        var stats = selectedChar.toJSON();
        if (!isCharacter && stats.movementActions > 0 && cell.className === "valid") {
            var prevPos = selectedChar.coords;
            shadeSquaresNormal(prevPos[0], prevPos[1], selectedChar.moveSpeed);

            chars = selectedChar.movePC(c, r, chars);
        }
    }

    if (isCharacter) {
        selectedChar = t;

        if (prevChar != undefined) {
            var prevPos = prevChar.coords;
            shadeSquaresNormal(prevPos[0], prevPos[1], prevChar.moveSpeed);
            //var currCell = g.getCell(prevPos[0], prevPos[1]);
            //currCell.className = (prevChar.isEnemy) ? "enemy" : "player";
        }

        this.overwriteInfoBox(selectedChar);
        shadeSquaresValid(c, r, selectedChar.moveSpeed);
        //var coords = selectedChar.coords;
        //var currCell = g.getCell(coords[0], coords[1]);
        //currCell.className = (selectedChar.isEnemy) ? "enemy" : "player";

        prevChar = selectedChar;
    }
}

export function overwriteInfoBox(playerChar, clear) {
    if (clear != undefined) {
        for (var i = 0; i < keys.length; i++) {
            replaceText(keys[i], '');
        }
        return;
    }
    if (playerChar != undefined && (clear == false || clear == undefined)) {
        var characterInfo = playerChar.toJSON();
        for (var i = 0; i < keys.length; i++) {
            var pcKey = charInfoKeys.get(keys[i]);
            var pcVal = characterInfo[pcKey];
            replaceText(keys[i], pcVal);
        }
    }
}

function populateCharInfoMap() {
    charInfoKeys.set('Name', 'charName');
    charInfoKeys.set('Health', 'health');
    charInfoKeys.set('Movement Actions', 'movementActions');
    charInfoKeys.set('Actions', 'actions');
    charInfoKeys.set('Level', 'level');
    return;
}

function replaceText(box, newValue) {
    document.getElementById(box).innerText = box + ": " + newValue;
    return;
}


function shadeSquaresValid(c, r, ms) {
    if (ms < 5 || c <= -1 || c >= width || r <= -1 || r >= height)
        return;

    var cell = g.getCell(c, r);
    //if (cell.className == "valid" && (ms%30 == 0 || ms%15 == 0))
    //    return;

    if (cell.className != "player" && cell.className != "enemy")
        cell.className = "valid";

    if (ms >= 5) {
        if (ms >= 5 * diagMult) {
            shadeSquaresValid(c - 1, r - 1, ms - (5 * diagMult));
            shadeSquaresValid(c + 1, r + 1, ms - (5 * diagMult));

            shadeSquaresValid(c + 1, r - 1, ms - (5 * diagMult));
            shadeSquaresValid(c - 1, r + 1, ms - (5 * diagMult));
        }

        shadeSquaresValid(c - 1, r, ms - 5);
        shadeSquaresValid(c + 1, r, ms - 5);

        shadeSquaresValid(c, r - 1, ms - 5);
        shadeSquaresValid(c, r + 1, ms - 5);
    }
}

function shadeSquaresNormal(c, r, ms) {
    if (ms < 5 || c <= -1 || c >= width || r <= -1 || r >= height)
        return;

    var cell = g.getCell(c, r);
    //if (cell.className == ".grid td" && (ms % 30 == 0 || ms % 15 == 0))
    //    return;

    if (cell.className != "player" && cell.className != "enemy")
        cell.className = ".grid td";

    if (ms >= 5) {
        if (ms >= 5 * diagMult) {
            shadeSquaresNormal(c - 1, r - 1, ms - (5 * diagMult));
            shadeSquaresNormal(c + 1, r + 1, ms - (5 * diagMult));

            shadeSquaresNormal(c + 1, r - 1, ms - (5 * diagMult));
            shadeSquaresNormal(c - 1, r + 1, ms - (5 * diagMult));
        }

        shadeSquaresNormal(c - 1, r, ms - 5);
        shadeSquaresNormal(c + 1, r, ms - 5);

        shadeSquaresNormal(c, r - 1, ms - 5);
        shadeSquaresNormal(c, r + 1, ms - 5);
    }
}
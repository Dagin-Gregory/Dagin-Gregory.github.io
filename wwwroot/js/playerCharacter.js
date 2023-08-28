import * as g from './grid.js'
import * as l from './gameLogic.js'

export default class playerCharacter{
    #x = -1;
    #y = -1;
    #speed = 30;
    #actions = 1;
    #movementActions = 1;
    #charName = "N/A";
    #level = 1;
    #health = -1;


    #isEnemey = false;

    constructor(iCname, iX = -1, iY = -1, iSpeed = 30, iActions = 1, iMovement = 1, iLvl = 1, iHealth = 4, iEnemey = false) {
        this.#x = iX;
        this.#y = iY;
        this.#speed = iSpeed;
        this.#actions = iActions;
        this.#movementActions = iMovement;
        this.#charName = iCname;
        this.#level = iLvl;
        this.#isEnemey = iEnemey;
        this.#health = iHealth;
    }

    movePC(nX, nY, map) {
        if (this.#movementActions > 0) {
            map = this.eraseChar(map);
            map = this.drawChar(nX, nY, map);
            this.#movementActions -= 1;
            l.overwriteInfoBox(this);
        }
        return map;
    }

    drawChar(nX, nY, map) {

        var cell = g.getCell(nX, nY);

        cell.innerHTML = this.#charName;
        cell.className = (this.#isEnemey == false) ? "player" : "enemy";

        this.#x = nX, this.#y = nY;
        var coord = g.getCoord(nX, nY);
        map.set(coord, this);

        return map;
    }

    eraseChar(map) {
        if (this.#x != -1 && this.#y != -1) {
            var cell = g.getCell(this.#x, this.#y);
            var coord = g.getCoord(this.#x, this.#y);
            cell.innerHTML = '';
            cell.className = ".grid td";
            map.delete(coord);
        }
        return map;
    }

    set movementActions(m) {
        this.#movementActions = m;
    }

    set health(h) {
        this.#health = (h < 0) ? 0 : h;
    }

    set name(n) {
        this.#charName = n;
    }

    getMapCoord(x, y) {
        return x + "," + y;
    }

    get name() {
        return this.#charName;
    }

    get coords() {
        return [this.#x, this.#y];
    }

    get moveSpeed() {
        return this.#speed;
    }

    get isEnemy() {
        return this.#isEnemey;
    }

    get movementActions() {
        return this.#movementActions;
    }

    toJSON() {
        return {
            charName: this.#charName,
            health: this.#health,
            movementActions: this.#movementActions,
            actions: this.#actions,
            level: this.#level,
            isEnemy: this.#isEnemey,
            x: this.#x,
            y: this.#y,
            speed: this.#speed
        }
    }

    objectJson() {
        var r = JSON.stringify(this);
        return r;
    }
}
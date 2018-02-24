'use strict';

import Block from './block.js';
import Config from '../config/config.js';
import CONSTS from '../helpers/consts.js';

export default class Snake {
    constructor() {
        this._blocks = null;
        this._food = null;
        this._keypressHandler = null;
        this._movingDirection = null;
        this._onCrash = () => {};
        this._onEat = () => {};
        this.rendered = false;

        this._initBlocks();
        this._initControls();
        this._upcomingMovingDirection = CONSTS.LEFT;
    }

    get hasFood() {
        return Boolean(this._food);
    }

    get movingDirection() {
        return this._movingDirection;
    }

    set movingDirection(val) {
        if (val !== CONSTS.LEFT && val !== CONSTS.RIGHT && val !== CONSTS.UP && val !== CONSTS.DOWN) {
            throw new Error('Error! Incorrect `set movingDirection()` argument');
        }

        this._movingDirection = val;
    }

    get onEat() {
        return this._onEat;
    }

    set onEat(val) {
        if (typeof val !== 'function') {
            throw new Error('Error! Invalid onCrash() parameter');
        }

        this._onEat = val;
    }

    get onCrash() {
        return this._onCrash;
    }

    set onCrash(val) {
        if (typeof val !== 'function') {
            throw new Error('Error! Invalid onCrash() parameter');
        }

        this._onCrash = val;
    }

    _initBlocks() {
        this._blocks = [];

        for (let i = 0; i < Config.INITIAL_SNAKE_LENGTH; i++) {
            const x = (i + 1) * CONSTS.BLOCK_WIDTH_HEIGHT + Config.SNAKE_START_X;

            this._blocks.push(new Block([ x, Config.SNAKE_START_Y ]))
        }
    }

    _initControls() {
        this._keypressHandler = (key) => {
            if (key.keyCode === 37 && this.movingDirection !== CONSTS.RIGHT) {
                this._upcomingMovingDirection = CONSTS.LEFT;
            }

            if (key.keyCode === 39 && this.movingDirection !== CONSTS.LEFT) {
                this._upcomingMovingDirection = CONSTS.RIGHT;
            }

            if (key.keyCode === 38 && this.movingDirection !== CONSTS.DOWN) {
                this._upcomingMovingDirection = CONSTS.UP;
            }

            if (key.keyCode === 40 && this.movingDirection !== CONSTS.UP) {
                this._upcomingMovingDirection = CONSTS.DOWN;
            }
        };

        document.addEventListener('keydown', this._keypressHandler, false);
    }

    _checkWallsCollision() {
        const firstBlockCoords = this._blocks[ 0 ].getCoordinates();

        if (this.movingDirection === CONSTS.UP && firstBlockCoords[ 1 ] === 0) {
            return true;
        }

        if (this.movingDirection === CONSTS.DOWN && firstBlockCoords[ 1 ] + CONSTS.BLOCK_WIDTH_HEIGHT === CONSTS.FIELD_HEIGHT) {
            return true;
        }

        if (this.movingDirection === CONSTS.LEFT && firstBlockCoords[ 0 ] === 0) {
            return true;
        }

        if (this.movingDirection === CONSTS.RIGHT && firstBlockCoords[ 0 ] + CONSTS.BLOCK_WIDTH_HEIGHT === CONSTS.FIELD_WIDTH) {
            return true;
        }

        return false;
    }

    _getAdjustedCoordinates() {
        const firstBlockCoords = this._blocks[ 0 ].getCoordinates();

        if (this.movingDirection === CONSTS.UP) {
            firstBlockCoords[ 1 ] -= CONSTS.BLOCK_WIDTH_HEIGHT;
        }

        if (this.movingDirection === CONSTS.DOWN) {
            firstBlockCoords[ 1 ] += CONSTS.BLOCK_WIDTH_HEIGHT;
        }

        if (this.movingDirection === CONSTS.LEFT) {
            firstBlockCoords[ 0 ] -= CONSTS.BLOCK_WIDTH_HEIGHT;
        }

        if (this.movingDirection === CONSTS.RIGHT) {
            firstBlockCoords[ 0 ] += CONSTS.BLOCK_WIDTH_HEIGHT;
        }

        return firstBlockCoords;
    }

    _checkBodyCollision() {
        const firstBlockCoords = this._getAdjustedCoordinates();

        return this._blocks.some(block => block.getCoordinates().toString() === firstBlockCoords.toString());
    }

    _checkFoodCollision() {
        const firstBlockCoords = this._getAdjustedCoordinates();

        return firstBlockCoords.toString() === this._food.getCoordinates().toString();
    }

    move() {
        this.movingDirection = this._upcomingMovingDirection;

        if (this._checkWallsCollision() || this._checkBodyCollision()) {
            this.onCrash();
            return;
        }

        if (this._checkFoodCollision()) {
            this._blocks.push(this._food);
            this._food = null;
            this.onEat();
        }

        const lastBlock = this._blocks.splice(this._blocks.length - 1)[ 0 ];
        const firstBlockCoords = this._blocks[ 0 ].getCoordinates();

        if (this.movingDirection === CONSTS.UP) {
            lastBlock.x = firstBlockCoords[ 0 ];
            lastBlock.y = firstBlockCoords[ 1 ] - CONSTS.BLOCK_WIDTH_HEIGHT;
        }

        if (this.movingDirection === CONSTS.DOWN) {
            lastBlock.x = firstBlockCoords[ 0 ];
            lastBlock.y = firstBlockCoords[ 1 ] + CONSTS.BLOCK_WIDTH_HEIGHT;
        }

        if (this.movingDirection === CONSTS.LEFT) {
            lastBlock.x = firstBlockCoords[ 0 ] - CONSTS.BLOCK_WIDTH_HEIGHT;
            lastBlock.y = firstBlockCoords[ 1 ];
        }

        if (this.movingDirection === CONSTS.RIGHT) {
            lastBlock.x = firstBlockCoords[ 0 ] + CONSTS.BLOCK_WIDTH_HEIGHT;
            lastBlock.y = firstBlockCoords[ 1 ];
        }

        this._blocks.unshift(lastBlock);
    }

    setFood(val) {
        this._food = val;
    }

    getAllCoords() {
        return this._blocks.map(block => block.getCoordinates());
    }

    render() {
        if (!this.rendered) {
            this._blocks.forEach(block => block.render());
            this.rendered = true;
        }

        return this;
    }

    destroy() {
        this._food && this._food.destroy();
        this._blocks.forEach(block => block.destroy());
        document.removeEventListener('keydown', this._keypressHandler);
    }
}

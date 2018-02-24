'use strict';

import Block from './block.js';
import Helper from '../helpers/helpers.js';
import Snake from './snake.js';

export default class Game {
    constructor() {
        this._onEnd = () => {};
        this._score = 0;
        this._snake = null;
        this._timer = null;
    }

    get onEnd() {
        return this._onEnd;
    }

    set onEnd(val) {
        if (typeof val !== 'function') {
            throw new Error('Error! Invalid onEnd() parameter');
        }

        this._onEnd = val;
    }

    get score() {
        return this._score;
    }

    set score(val) {
        this._score = val;
        document.getElementById('score').firstElementChild.innerHTML = this.score;
    }

    start() {
        this._snake = new Snake();
        this._snake.render();
        this._snake.onCrash = () => {
            clearInterval(this._timer);
            this.onEnd();
        };
        this._snake.onEat = () => this.score += 50;

        this._timer = setInterval(() => {
            if (!this._snake.hasFood) {
                const foodCoords = Helper.getRandomCoordinates();

                if (!this._snake.getAllCoords().find(coords => coords.toString() === foodCoords.toString())) {
                    this._snake.setFood(new Block(foodCoords).render());
                }
            }

            this._snake.move();
        }, 200);

        return this;
    }

    destroy() {
        clearInterval(this._timer);
        this._snake.destroy();
        this.score = 0;
    }
}

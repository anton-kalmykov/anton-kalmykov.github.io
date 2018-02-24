'use strict';

import CONSTS from './consts.js';

export default {
    getRandomCoordinates: () => {
        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const x = getRandomInt(0, (CONSTS.FIELD_WIDTH / CONSTS.BLOCK_WIDTH_HEIGHT) - 1) * CONSTS.BLOCK_WIDTH_HEIGHT;
        const y = getRandomInt(0, (CONSTS.FIELD_HEIGHT / CONSTS.BLOCK_WIDTH_HEIGHT) - 1) * CONSTS.BLOCK_WIDTH_HEIGHT;

        return [x, y];
    }
}

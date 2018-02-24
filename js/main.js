'use strict';

import Game from './classes/game.js';

(() => {

    const game = new Game();
    const field = document.getElementById('field');

    document.getElementById('start-link').addEventListener('click', () => {

        document.getElementById('start').style.display = 'none';
        game.start();

    }, false);

    document.getElementById('replay-link').addEventListener('click', () => {
        document.getElementById('replay').style.display = 'none';

        field.classList.remove('flash');
        field.classList.remove('animated');

        game.destroy();
        game.start();

    }, false);

    game.onEnd = () => {
        document.getElementById('replay').style.display = 'block';

        field.classList.add('flash');
        field.classList.add('animated');
    };

})();

'use strict';

export default class Block {
    constructor(val) {
        this._x = null;
        this._y = null;
        this._elem = null;
        this.rendered = false;

        this._initDOMElem();
        this.setCoordinates([ val[ 0 ], val[ 1 ] ]);
    }

    get x() {
        return this._x;
    }

    set x(val) {
        if (!Number.isInteger(val)) {
            throw new Error('Error! Incorrect `set x()` argument');
        }

        this._x = val;

        if (this._elem) {
            this._elem.style.left = `${val}px`;
        }
    }

    get y() {
        return this._y;
    }

    set y(val) {
        if (!Number.isInteger(val)) {
            throw new Error('Error! Incorrect `set y()` argument');
        }

        this._y = val;

        if (this._elem) {
            this._elem.style.top = `${val}px`;
        }
    }

    _initDOMElem() {
        const elem = document.createElement('div');

        elem.innerHTML = '<div class="inner"></div>';
        elem.className = 'block';

        this._elem = elem;
    }

    getCoordinates() {
        return [ this.x, this.y ];
    }

    setCoordinates(val) {
        this.x = val[ 0 ];
        this.y = val[ 1 ];

        return this;
    }

    render() {
        if (!this.rendered) {
            document.getElementById('field').appendChild(this._elem);
            this.rendered = true;
        }

        return this;
    }

    destroy() {
        this._elem.remove();
    }
}

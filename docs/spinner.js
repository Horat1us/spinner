/**
 * Created by horat1us on 7/24/17.
 */
function Spinner() {
    this.panel = document.querySelector('#spinner');
    this.button = document.querySelector('#spin');
    this.image = document.querySelector('#spinner-img');
}

Spinner.prototype = {
    angle: 0,
    timer: null,
    direction: 0,

    bindEvents: function () {
        this.enableRotate = this.enableRotate.bind(this);
        this.disableRotate = this.disableRotate.bind(this);
        this.rotate = this.rotate.bind(this);

        this.button.addEventListener('click', this.enableRotate);
    },

    enableRotate: function () {
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(this.rotate, 8 + Math.random() * (32 - 8));

        this.direction = Math.random() > 0.5 ? 1 : -1;

        this.button.addEventListener('click', this.disableRotate);
        this.button.removeEventListener('click', this.enableRotate);
    },

    disableRotate: function () {
        this.timer && clearInterval(this.timer);

        this.button.addEventListener('click', this.enableRotate);
        this.button.removeEventListener('click', this.disableRotate);
    },

    rotate: function () {
        this.changeAngle(this.direction);
    },

    changeAngle: function (angle) {
        this.angle += angle;
        if (this.angle < 0) {
            this.angle += 360;
        } else if (this.angle > 360) {
            this.angle -= 360;
        }

        this.panel.setAttribute('style', this.getStyle());
        this.image.setAttribute('style', this.getStyle(-1));
    },

    getStyle: function (angleRate) {
        var value = 'rotate(' + (this.angle * (angleRate || 1)) + 'deg)';
        var keys = [
            '-ms-transform',
            '-webkit-transform',
            'transform',
        ];
        return keys.map(function (key) {
            return key + ': ' + value;
        }).join(';');
    }
};

var page = new Spinner();
page.bindEvents();
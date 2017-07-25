/**
 * Created by horat1us on 7/24/17.
 */
function Spinner() {
    this.panel = document.querySelector('#spinner');
    this.button = document.querySelector('#spin');
    this.image = document.querySelector('#spinner-img');
    this.title = document.querySelector('#spinner h1');
    this.copyright = document.querySelector('#spinner .copyright');

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
}

Spinner.prototype = {
    tick: 8,
    angle: 0,
    timer: null,
    direction: 0,
    power: 0, // Angle to spin in one tick
    inertness: 0,

    ticks: 0,

    mouse: null,

    bindEvents: function () {
        this.enableRotate = this.enableRotate.bind(this);
        this.disableRotate = this.disableRotate.bind(this);
        this.rotate = this.rotate.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.button.addEventListener('click', this.enableRotate);
        this.image.addEventListener('mousedown', this.handleMouseDown);
        this.image.addEventListener('dragstart', function (e) {
            e.preventDefault();
        })
    },

    handleMouseDown: function (e) {
        e.preventDefault();

        this.canvas.getContext('2d').drawImage(this.image, 0, 0, this.image.width, this.image.height);

        var isBackgroundClick = this.canvas
            .getContext('2d')
            .getImageData(e.offsetX, e.offsetY, 1, 1)
            .data
            .reduce(function (carry, item) {
                return carry && item === 0;
            }, true);

        if (isBackgroundClick) {
            return;
        }

        this.mouse = {
            x: e.clientX,
            y: e.clientY,
            start: new Date(),
        };

        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mouseleave', this.handleMouseUp);

    },

    handleMouseUp: function (e) {
        if (this.timer) {
            this.disableRotate();
        }
        e.preventDefault();

        var xDiff = this.mouse.x - e.clientX;
        var yDiff = this.mouse.y - e.clientY;
        var distance = Math.pow((xDiff * xDiff + yDiff * yDiff), 0.5);

        var width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var power = (distance / width) * 720;

        var delta = (this.mouse.start - new Date());
        var inertness = 0.5 + (1 / Math.abs(2000 / delta));

        var direction;
        if (xDiff > yDiff) {
            direction = xDiff > 0 ? -1 : 1;
        } else {
            direction = yDiff > 0 ? -1 : 1;
        }

        this.enableRotate(undefined, inertness, power, direction);

        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mouseleave', this.handleMouseUp);
        this.mouse = null;
    },

    enableRotate: function (e, inerness, power, direction) {
        this.clearInterval();
        this.timer = setInterval(this.rotate, this.tick);

        this.direction = direction === undefined ? Math.random() > 0.5 ? 1 : -1 : direction;
        this.inertness = inerness === undefined ? (0.5 + Math.random() * 0.5) : inerness;
        this.power = power || (Math.random() * 720); // Per second

        console.log(
            "Enabling rotation with: "
            + "\nDirection: " + this.direction
            + "\nInertness: " + this.inertness
            + "\nPower: " + this.power
        );

        this.inertness *= this.tick / 1000; // Per tick
        this.power *= this.tick / 1000; // Per tick

        console.log(
            "Rotate per tick: " + this.power,
            "De-spinning per tick:" + this.inertness * this.power
        );

        this.ticks = 0;

        this.button.addEventListener('click', this.disableRotate);
        this.button.removeEventListener('click', this.enableRotate);
        this.button.innerText = 'Despin';
    },

    disableRotate: function () {
        this.clearInterval();

        this.button.addEventListener('click', this.enableRotate);
        this.button.removeEventListener('click', this.disableRotate);
        this.button.innerText = 'Spin';
    },

    clearInterval: function () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    rotate: function () {
        this.power -= this.power * this.inertness;

        if (this.power <= 0.01) {
            console.log("Finishing rotate. Ticks: " + this.ticks);
            this.disableRotate();
        }

        this.changeAngle(this.power * this.direction);
        this.ticks++;
    },

    changeAngle: function (angle) {
        this.angle += angle;
        if (this.angle < 0) {
            this.angle += 360;
        } else if (this.angle > 360) {
            this.angle -= 360;
        }

        this.panel.setAttribute('style', this.getStyle(1));

        var elementStyle = this.getStyle(-1);

        this.image.setAttribute('style', elementStyle);
        this.title.setAttribute('style', elementStyle);
        this.button.setAttribute('style', elementStyle);
        this.copyright.setAttribute('style', elementStyle);
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

console.clear();
var page = new Spinner();
page.bindEvents();
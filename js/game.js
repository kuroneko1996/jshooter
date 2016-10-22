"use strict";
(function () {

    class Game {

        constructor(params) {
            this.fps = params.fps || 30;
            this.scl = params.scl;
            this.width = params.width;
            this.height = params.height;
            this.drawing = params.drawing;

            this.score = 0;
            this.now = 0;
            this.then = Date.now();
            this.interval = 1000 / this.fps;
            this.delta = 0;

            this.Key = {
                LEFT:     37,
                UP:       38,
                RIGHT:    39,
                DOWN:     40,
                SPACE:    32,
                Z:        90,

                _pressed: {},

                isDown: function(keyCode) {
                    return this._pressed[keyCode];
                },
                onKeydown: function(event) {
                    this._pressed[event.keyCode] = true;
                },
                onKeyup: function(event) {
                    delete this._pressed[event.keyCode];
                }
            }
        }

        start() {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            this.OnEachFrame = requestAnimationFrame.bind(window); 

            this.OnEachFrame(this.run.bind(this));
        }

        run() {
            this.OnEachFrame(this.run.bind(this));

            this.now = Date.now();
            this.delta = this.now - this.then;

            if (this.delta > this.interval) {
                this.then = this.now - (this.delta % this.interval);

                this.drawing.clear();
                this.logic();
            }
        }

        addKeyboardInput() {
            var self = this;
            document.addEventListener('keydown', function(event) {
                if (self.getKeyByValue(self.Key, event.keyCode)) {
                    event.preventDefault();
                }

                self.Key.onKeydown(event);
            }, false);

            document.addEventListener('keyup', function(event) {
                if (self.getKeyByValue(self.Key, event.keyCode)) {
                    event.preventDefault();
                }
                
                self.Key.onKeyup(event);
            }, false);
        }

        dist(x1, y1, x2, y2) {
            var d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
            return d;
        }

        rnd(min, max)
        {
          return Math.floor(Math.random() * (max - min)) + min;
        }

        getKeyByValue(object, value) {
          return Object.keys(object).find(key => object[key] === value);
        }
    }

    window.KGame = Game;
})();

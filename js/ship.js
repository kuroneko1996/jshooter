"use strict";
(function () {

    class Ship {
        constructor(game, startX = 0, startY = 0) {
            this.x = this.startX = startX;
            this.y = this.startY = startY;

            this.game = game;
            this.drawing = game.drawing;
            this.Key = game.Key;

            this.color = '#597dce';
            this.speed = 4;

            this.xdir = this.ydir = 0;

            this.width = 20;
            this.height = 20;
        }

        move() {
            var newX = this.x + this.xdir * this.speed;
            var newY = this.y + this.ydir * this.speed;

            // reposition near bounds
            if (newX < 0) {
                newX = 0;
            }
            if (newY < 0) {
                newY = 0;
            }
            if ( (newX + this.width)  >= this.game.width) {
                newX = this.game.width - this.width;
            }
            if ( (newY + this.height) >= this.game.height) {
                newY = this.game.height - this.height;
            }

            this.x = newX;
            this.y = newY;
        }

        dir(x, y) {
            this.xdir = x;
            this.ydir = y;
        }

        update() {
            // handle player's input
            let Key = this.Key;
            if (Key.isDown(Key.UP)) this.ydir = -1;
            if (Key.isDown(Key.DOWN)) this.ydir = 1;
            if (Key.isDown(Key.LEFT)) this.xdir = -1;
            if (Key.isDown(Key.RIGHT)) this.xdir = 1;

            this.move();

            this.xdir = this.ydir = 0;
        }

        draw() {
            this.drawing.rect(this.x, this.y, this.width, this.height, this.color);
        }
    }

    window.KGame.Ship = Ship;
})();

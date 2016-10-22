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
            this.hp = 4;
            this.immortality = false;
            this.immortalityTimer = 0;
            this.immortalityFrames = 30;

            this.xdir = this.ydir = 0;

            this.width = 16;
            this.height = 16;

            this.box = {
                x1: 2, y1: 1, x2: 13, y2: 13
            };
        }

        setSprite(img) {
            this.sprite = img;
        }

        setFire(func) {
            this.fire = func;
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

        takeLife() {
            this.immortality = 1;
            this.immortalityTimer = 0;
            this.hp -= 1;
        }

        update() {
            // handle player's input
            let Key = this.Key;
            if (Key.isDown(Key.UP)) this.ydir = -1;
            if (Key.isDown(Key.DOWN)) this.ydir = 1;
            if (Key.isDown(Key.LEFT)) this.xdir = -1;
            if (Key.isDown(Key.RIGHT)) this.xdir = 1;
            if (Key.isDown(Key.SPACE)) this.fire();
            if (Key.isDown(Key.Z)) this.fire();

            this.move();

            this.xdir = this.ydir = 0;

            if (this.immortality) {
                this.immortalityTimer += 1;

                if (this.immortalityTimer > this.immortalityFrames) {
                    this.immortality = false;
                    this.immortalityTimer = 0;
                }
            }
        }

        draw() {
            if (!this.immortality || (this.immortalityTimer % 8) < 4) {
                this.drawing.context.drawImage(this.sprite, this.x, this.y);
            }
        }
    }

    window.KGame.Ship = Ship;
})();

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

            this.width = 16;
            this.height = 16;

            this.bullets = [];
            this.bulletWidth = 2;
            this.bulletHeight = 4;
            this.bulletColor = '#d04648';
        }

        setSprite(img) {
            this.sprite = img;
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

        moveBullets() {
            for (var i = this.bullets.length - 1; i >= 0; i--) {
                let bullet = this.bullets[i];
                bullet.x += bullet.xspeed;
                bullet.y += bullet.yspeed;
                // remove bullets beyond the screen
                if (bullet.x < 0 || bullet.x > this.game.width || bullet.y < 0 || bullet.y > this.game.height) {
                    this.bullets.splice(i, 1);
                }
            }
        }

        dir(x, y) {
            this.xdir = x;
            this.ydir = y;
        }

        fire() {
            let bullet = {
                x: this.x + this.width / 2 - this.bulletWidth / 2,
                y: this.y - 2,
                xspeed: 0,
                yspeed: -this.speed-1
            };
            this.bullets.push(bullet);
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
            this.moveBullets();

            this.xdir = this.ydir = 0;
        }

        draw() {
            var self = this;
            if (!this.sprite) {
                this.drawing.rect(this.x, this.y, this.width, this.height, this.color);
            } else {
                this.drawing.context.drawImage(this.sprite, this.x, this.y);
            }

            this.bullets.forEach(function (bullet) {
                self.drawing.rect(bullet.x, bullet.y, self.bulletWidth, self.bulletHeight, self.bulletColor);
            });
        }
    }

    window.KGame.Ship = Ship;
})();

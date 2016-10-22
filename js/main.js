"use strict";
(function () {
    var width = 256;
    var height = 256;
    var scl = 1;

    var sprites = loadAssets();

    var stars = [];
    var enemies = [];
    var bullets = [];

    var bulletWidth = 2;
    var bulletHeight = 4;
    var bulletColor = '#d04648';

    var drawing = new Drawing('mycanvas');
    var game = new KGame({drawing: drawing, width: width, height: height, scl: scl});
    drawing.font('12px "Lucida Console", Monaco, monospace');
    var ship = new KGame.Ship(game, width / 2, height - 40);
    ship.setSprite(sprites['ship']);

    ship.setFire(function() {
        let bullet = {
                x: this.x + this.width / 2 - bulletWidth / 2,
                y: this.y - 2,
                xspeed: 0,
                yspeed: -this.speed-1,
                box: {
                    x1: 0, y1: 0, x2: bulletWidth, y2: bulletHeight
                }
            };
        bullets.push(bullet);
    });


    for (let i = 0; i < 128; i++) {
        stars.push({
            x: game.rnd(0, game.width),
            y: game.rnd(0, game.height),
            speed: game.rnd(1, 4) + 1
        });
    }

    for (let i = 0; i < 10; i++) {
        enemies.push({
            x: 8 + i*32,
            y: 40 + i*8,
            sprite: sprites['enemy1'],
            box: {
                x1: 1, y1: 4, x2: 14, y2: 11
            }
        });
    }

    game.addKeyboardInput();

    game.logic = function () {
        // update
        ship.update();
        for (let i = stars.length - 1; i >= 0; i--) {
            let star = stars[i];
            star.y += star.speed;
            if (star.y > game.height) {
                star.x = game.rnd(1, game.width);
                star.y = 0;
            }
        }
        moveBullets();


        // draw
        for (let i = stars.length - 1; i >= 0; i--) {
            drawing.rect(stars[i].x, stars[i].y, 2, 2, '#8595a1')
        }
        for (let i = enemies.length - 1; i >= 0; i--) {
            drawing.context.drawImage(enemies[i].sprite, enemies[i].x, enemies[i].y);
        }

        ship.draw();
        drawBullets();
        drawScore();
    };

    assignTouchControls();

    game.start();

    // functions
    function moveBullets() {
        for (var i = bullets.length - 1; i >= 0; i--) {
            let bullet = bullets[i];
            bullet.x += bullet.xspeed;
            bullet.y += bullet.yspeed;

            // remove bullets beyond the screen
            if (bullet.x < 0 || bullet.x > game.width || bullet.y < 0 || bullet.y > game.height) {
                bullets.splice(i, 1);
            }

            enemies.forEach(function (enemy, i) {
                if (game.collision(bullet, enemy)) {
                    enemies.splice(i, 1);
                    game.score += 10;
                }
            });
        }
    }

    function drawBullets() {
        bullets.forEach(function (bullet) {
            drawing.rect(bullet.x, bullet.y, bulletWidth, bulletHeight, bulletColor);
        });
    }

    function drawScore() {
        drawing.fill('#deeed6');
        drawing.text(4, 12, game.score);
    }


    function assignTouchControls() {
        var name2dir = {
            'arrow_up': [0, -1], 'arrow_down': [0, 1], 'arrow_left': [-1, 0], 'arrow_right': [1, 0]
        };

        for (let btnName in name2dir) {
            document.getElementById(btnName).addEventListener('click', function (event) {
                ship.dir(...name2dir[btnName]);
            });
        }
    }

    function loadAssets() {
        let sprites = [];
        sprites['ship'] = document.getElementById('ship_image')
        sprites['enemy1'] = document.getElementById('enemy1_image');
        return sprites;
    }
})();

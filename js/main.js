"use strict";
(function () {
    var width = 256;
    var height = 256;
    var scl = 1;

    var drawing = new Drawing('mycanvas');
    var game = new KGame({drawing: drawing, width: width, height: height, scl: scl});
    drawing.font('14px "Lucida Console", Monaco, monospace');
    var ship = new KGame.Ship(game, width / 2, height - 40);
    ship.setSprite(document.getElementById('ship_image'));

    var stars = [];

    for (let i = 0; i < 128; i++) {
        stars.push({
            x: game.rnd(0, game.width),
            y: game.rnd(0, game.height),
            speed: game.rnd(1, 3) + 1
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


        // draw
        for (let i = stars.length - 1; i >= 0; i--) {
            drawing.rect(stars[i].x, stars[i].y, 2, 2, '#8595a1')
        }
        ship.draw();
    };

    assignTouchControls();

    game.start();

    // functions
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
})();

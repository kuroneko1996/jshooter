"use strict";
(function () {
    var width = 256;
    var height = 256;
    var scl = 1;

    var drawing = new Drawing('mycanvas');
    var game = new KGame({drawing: drawing, width: width, height: height, scl: scl});
    drawing.font('14px "Lucida Console", Monaco, monospace');
    var ship = new KGame.Ship(game, width / 2, height - 40);

    game.addKeyboardInput();

    game.logic = function () {
        ship.update();
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
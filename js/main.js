"use strict";
(function () {
	var width = 256;
	var height = 256;
	var scl = 1;

	var KEY = {
		LEFT:     37,
	    UP:       38,
	    RIGHT:    39,
	    DOWN:     40,
	    SPACE:    32
	}


	var drawing = new Drawing('mycanvas');
	var game = new KGame({drawing: drawing, width: width, height: height, scl: scl});
	drawing.font('14px "Lucida Console", Monaco, monospace');
	var ship = new KGame.Ship(game, width / 2, height - 40);

	game.logic = function () {

		ship.update();
		ship.draw();
	};

	game.addKeyDown(function (event) {
		var keyCode = event.keyCode;
		if (keyCode == KEY.UP) {
			ship.dir(0, -1);
		} else if (keyCode == KEY.DOWN) {
			ship.dir(0, 1);
		} else if (keyCode == KEY.LEFT) {
			ship.dir(-1, 0);
		} else if (keyCode == KEY.RIGHT) {
			ship.dir(1, 0);
		}
	});

	game.addKeyUp(function (event) {
		ship.dir(0, 0);
	});

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
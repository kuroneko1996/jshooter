"use strict";
(function () {

	class Game {

		constructor(drawing, width, height, scl) {
			this.fps = 10;
			this.scl = scl;
			this.width = width;
			this.height = height;
			this.score = 0;

			this.drawing = drawing;

			this.now = 0;
			this.then = Date.now();
			this.interval = 1000 / this.fps;
			this.delta = 0;
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

		addKeydown(onkeydown) {
			document.addEventListener('keydown',    onkeydown,    false);
		}

		dist(x1, y1, x2, y2) {
			var d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
			return d;
		}
	}

	window.GameEngine = Game;
})();

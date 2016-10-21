"use strict";
(function () {
    class Draw {
        constructor(canvas_id) {
            this.canvas = document.getElementById(canvas_id);
            this.context = this.canvas.getContext('2d');
        }

        rect(sx, sy, ex, ey, fillStyle = 'white') {
            var context = this.context;
            context.beginPath();
            context.rect(sx, sy, ex, ey);
            context.fillStyle = fillStyle;
            context.fill();
            context.stroke();
        }

        clear() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        text(x, y, str) {
            this.context.fillText(str, x, y);
        }

        fill(color) {
            this.context.fillStyle = color;
        }

        stroke(color) {
            this.context.strokeStyle = color;
        }

        font(fnt) {
            this.context.font = fnt;
        }
    }
    window.Drawing = Draw;
})();
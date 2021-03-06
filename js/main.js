"use strict";
(function () {
    var STATES = {INIT: 0, MENU: 1, PLAYING: 2, GAMEOVER: 3, PAUSED: 4};
    var gameState = STATES.INIT;

    var width = 256;
    var height = 256;
    var scl = 1;
    var sprScale = 2;
    var t = 0; // frame counter

    var maxHealth = 4;

    var stars = [];
    var enemies = [];
    var bullets = [];
    var explosions = [];

    var bulletWidth = 2*sprScale;
    var bulletHeight = 4*sprScale;
    var bulletColor = '#d04648';

    var explosionRadius = 4*sprScale;
    var explosionLineWidth = 2;
    var explosionColors = ['#deeed6', '#d04648', '#d27d2c', '#dad45e'];
    var explosionFrames = 13;
    var enemyWidth = 32;
    var enemyHeight = 32;
    var enemyBoundingBox = { x1: 1*sprScale, y1: 4*sprScale, x2: 14*sprScale, y2: 11*sprScale };

    var drawing = new Drawing('mycanvas');
    var game = new KGame({drawing: drawing, width: width, height: height, scl: scl});
    drawing.font('12px "Lucida Console", Monaco, monospace');

    var shipBoundingBox = { x1: 1*sprScale, y1: 3*sprScale, x2: 14*sprScale, y2: 14*sprScale };
    var ship = new KGame.Ship(game, width / 2, height - 40, 7, 32, 32, shipBoundingBox);

    var shakeDuration = 800;
    var shakeStartTime = -1;
    var shakeFactor = 9;

    // loading assets and starting game
    var sounds = {};
    var sprites = {};
    var soundFileNames = ['explosion', 'hit_hurt', 'laser_shoot'];
    var spriteFileNames = ['ship_2', 'propulsion', 'enemy1', 'heart', 'heart_g'];
    loadSprites(spriteFileNames).then(function (loadedSprites) {
        sprites = loadedSprites;
    }).then(loadSounds(soundFileNames).then(function (loadedSounds) {
        sounds = loadedSounds;
    })).then(startGame);

    // functions
    function startGame() {
        ship.setSprite(sprites['ship_2']);
        ship.setPropulsionSprite(sprites['propulsion']);
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
            if (game.score - 1 > 0) {
                game.score -= 1;
            }
            sounds['laser_shoot'].play();
        });

        // stars
        for (let i = 0; i < 128; i++) {
            stars.push({
                x: game.rnd(0, game.width),
                y: game.rnd(0, game.height),
                speed: game.rnd(1, 4) + 1
            });
        }
        respawnEnemies();

        game.addKeyboardInput();

        game.logic = function () {
            if (gameState === STATES.PAUSED) {
                if (game.Key.isDown(game.Key.SPACE)) {
                    gameState = STATES.PLAYING;
                    game.Key.clear(game.Key.SPACE); // prevent shooting
                }
                drawPauseScreen();
            } else if (gameState === STATES.PLAYING) {
                t += 1;
                if (t > 5000) { // prevent overflow
                    t = 1;
                }

                if (game.Key.isDown(game.Key.P)) {
                    gameState = STATES.PAUSED;
                    return;
                }

                // update
                ship.update();
                updateEnemies();
                updateBullets();
                updateExplosions();
                updateStars();


                // draw
                preShake();

                drawStars();
                ship.draw(t);
                drawEnemies();
                drawBullets();
                drawExplosions();
                drawScore();
                drawHealth();

                postShake();
            } else if (gameState == STATES.GAMEOVER) {
                drawGameOver();
            }
        };

        assignTouchControls();

        gameState = STATES.PAUSED;
        game.start();
    }   
    
    function updateBullets() {
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
                    game.score += enemy.score;
                    explode(enemy.x + enemyWidth / 2, enemy.y + enemyHeight / 2);
                }
            });
        }
    }

    function explode(x, y) {
        explosions.push({
            x: x, y: y, t: 0
        });
        sounds['explosion'].play();
    }

    function updateStars() {
        for (let i = stars.length - 1; i >= 0; i--) {
            let star = stars[i];
            star.y += star.speed;
            if (star.y > game.height) {
                star.x = game.rnd(1, game.width);
                star.y = 0;
            }
        }
    }

    function updateExplosions() {
        explosions.forEach(function (explosion, i) {
            explosion.t += 1;
            if (explosion.t >= explosionFrames) {
                explosions.splice(i, 1);
            }
        });
    }

    function updateEnemies() {
        if (enemies.length < 1) {
            respawnEnemies();
        }

        enemies.forEach(function (enemy, i) {
            // sine wave
            enemy.startY += 3;
            enemy.x = 12 * Math.sin(enemy.d * t/6) + enemy.startX;
            enemy.y = 12 * Math.cos(t/6) + enemy.startY;

            if (game.collision(enemy, ship) && !ship.immortality) {
                ship.loseLife();
                if (ship.hp == 0) {
                    gameState = STATES.GAMEOVER;
                }
                sounds['hit_hurt'].play();
                startShake();
            }

            if (enemy.y > (game.height + 40)) {
                enemies.splice(i, 1);
            }
        });
    }

    function drawStars() {
        for (let i = stars.length - 1; i >= 0; i--) {
            drawing.rect(stars[i].x, stars[i].y, 2, 2, '#8595a1')
        }
    }

    function drawEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            drawing.context.drawImage(enemies[i].sprite, enemies[i].x, enemies[i].y);
        }
    }

    function drawBullets() {
        bullets.forEach(function (bullet) {
            drawing.rect(bullet.x, bullet.y, bulletWidth, bulletHeight, bulletColor);
        });
    }

    function drawExplosions() {
        var context = drawing.context;
        explosions.forEach(function (explosion) {
            context.beginPath();
            context.arc(explosion.x, explosion.y, explosion.t/2 + explosionRadius, 0, 2 * Math.PI, false);

            context.lineWidth = explosionLineWidth;
            context.strokeStyle = explosionColors[explosion.t % 3]; // check?
            context.stroke();
        });
    }

    function drawScore() {
        drawing.fill('#deeed6');
        drawing.text(4, 12, game.score);
    }

    function drawHealth() {
        for (let i = 1; i <= maxHealth; i++) {
            let x = game.width - (10 * maxHealth * sprScale + 12 * sprScale) + i * 10 * sprScale;
            let y = 4 * sprScale;
            if (i <= ship.hp) {
                drawing.context.drawImage(sprites['heart'], x, y);
            } else {
                drawing.context.drawImage(sprites['heart_g'], x, y);
            }
        }
    }

    function drawGameOver() {
        drawing.fill('#d04648');
        drawing.text(game.width / 2 - 35, game.height / 2 - 12, "GAME OVER");

        drawing.fill('#deeed6');
        drawing.text(game.width / 2 - 32, game.height / 2 + 8, game.zeropad(game.score, 8));
        drawing.text(game.width / 2 - 65, game.height / 2 + 12 + 12, "refresh to restart")
    }

    function drawPauseScreen() {
        drawing.fill('#deeed6');
        drawing.text(game.width / 2 - 25, game.height / 2 - 12, "PAUSED");

        drawing.text(game.width / 2 - 72, game.height / 2 + 12, "press space to resume")
    }

    function respawnEnemies() {
        let maxEnemies = 8;
        let minEmenies = 2;
        let number = game.rnd(minEmenies, maxEnemies);

        for (let i = 0; i < number; i++) {
            let d = -1; // sine wave direction
            if (Math.random() < 0.5) {
                d = 1;
            }

            enemies.push({
                x: 0,
                y: -64,
                startX: 12 + i*32,
                startY: -64 + i*8,
                d: d,
                sprite: sprites['enemy1'],
                box: enemyBoundingBox,
                score: 25
            });
        }
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

    function loadSounds(names) {
        return new Promise(function (resolve, reject) {
            var result = {};
            var count = names.length;
            var canplay = function () {
                if (--count == 0) resolve(result);
            }
            for (let i = 0; i < names.length; i++) {
                let name = names[i];
                result[name] = document.createElement('audio');
                result[name].addEventListener('canplay', canplay, false);
                result[name].src = 'sounds/' + name + '.mp3';
            }
        });
    }

    function loadSprites(names) {
        return new Promise(function (resolve, reject) {
            var result = {};
            var count = names.length;
            var onload = function () {
                if (--count == 0) resolve(result);
            }
            for (let i = 0; i < names.length; i++) {
                let name = names[i];
                result[name] = document.createElement('img');
                result[name].addEventListener('load', onload);
                result[name].src = 'imgs/' + name + '.png';
            }
        });  
    }

    function preShake() {
      if (shakeStartTime == -1) return;
      var dt = Date.now()-shakeStartTime;
      if (dt > shakeDuration) {
          shakeStartTime = -1; 
          return;
      }
      var easingCoef = dt / shakeDuration;
      var easing = Math.pow(easingCoef-1,3) +1;
      drawing.context.save();  
      var dx = easing*(Math.cos(dt*0.1 ) + Math.cos( dt *0.3115))*shakeFactor;
      var dy = easing*(Math.sin(dt*0.05) + Math.sin(dt*0.057113))*shakeFactor;
      drawing.context.translate(dx, dy);  
    }

    function postShake() {
      if (shakeStartTime == -1) return;
      drawing.context.restore();
    }

    function startShake() {
       shakeStartTime = Date.now();
    }
})();

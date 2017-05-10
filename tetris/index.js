var $container = document.getElementById('container');
var $game = document.getElementById('game');
function resize() {
    $game.setAttribute('width', $container.offsetWidth);
    $game.setAttribute('height', $container.offsetWidth);
}
resize();
var t = new Tetris('game');
window.onresize = function() {
    resize();
    t = new Tetris('game');
}
document.addEventListener('keyup', function(e){
    switch (e.keyCode) {
        case 37:
            clearInterval(t.interval.left);
            t.status.moving = false;
            break;
        case 38:
            if (t.status.running) {
                t.rotate();
            }
            break;
        case 39:
            clearInterval(t.interval.right);
            t.status.moving = false;
            break;
        case 40:
            clearInterval(t.interval.down);
            if (t.status.running){
                t.interval.down = setInterval('t.move()', t.interval.time);
            }
            break;
        case 32:
            if (t.status.over) {
                t.storage.clear();
                t = new Tetris('game');
                t.move();
                t.interval.down = setInterval('t.move()', t.interval.time);
                t.status.running = true;
                t.status.over = false;
                return;
            }
            if (t.status.running) {
                clearInterval(t.interval.down);
                t.status.running = false;
            } else {
                t.move();
                t.interval.down = setInterval('t.move()', t.interval.time);
                t.status.running = true;
            }
            t.drawNow();
            break;
    }
}, false);
document.addEventListener('keydown', function(e){
    switch (e.keyCode) {
        case 37:
            if (t.status.running && !t.status.moving) {
                t.moveLeft();
                t.interval.left = setInterval('t.moveLeft()', t.interval.moveRush);
                t.status.moving = true;
            }
            break;
        case 39:
            if (t.status.running && !t.status.moving) {
                t.moveRight();
                t.interval.right = setInterval('t.moveRight()', t.interval.moveRush);
                t.status.moving = true;
            }
            break;
        case 40:
            if (t.status.over || !t.status.running) {
                return;
            }
            clearInterval(t.interval.down);
            t.move();
            t.interval.down = setInterval('t.move()', t.interval.rushTime);
            break;
    }
});
var $container = document.getElementById('container');
var $game = document.getElementById('game');

function resize() {
    $game.setAttribute('width', $container.offsetWidth);
    $game.setAttribute('height', $container.offsetWidth + HeaderBoard.prototype.height);
}

resize();
var g = new Game2048('game');

$game.addEventListener('click', function(e){
    e.preventDefault();
    var x = e.clientX - this.offsetLeft;
    var y = e.clientY - this.offsetTop;
    if(g.header.isStart(x, y)){
        g.destroy();
        g = new Game2048('game');
    }
});
window.onresize = function() {
    resize();
    g = new Game2048('game');
}
document.addEventListener('keyup', function(e){
    switch (e.keyCode) {
        case 37:
            g.moveLeft();
            break;
        case 38:
            g.moveUp();
            break;
        case 39:
            g.moveRight();
            break;
        case 40:
            g.moveDown();
            break;
    }
}, false);
var startX = 0, startY = 0;
var moveX = 0, moveY = 0;
$game.addEventListener('touchstart', function(e){
    if(e.targetTouches.length == 1){
        var touch = e.targetTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        moveX = touch.clientX;
        moveY = touch.clientY;
    }
});
$game.addEventListener('touchmove', function(e){
    e.preventDefault();
    if(e.targetTouches.length == 1){
        var touch = e.targetTouches[0];
        moveX = touch.clientX;
        moveY = touch.clientY;
    }
});
$game.addEventListener('touchend', function(e){
    var x = moveX - startX;
    var y = moveY - startY;
    if(Math.abs(x) - Math.abs(y) > $game.width * 0.2){
        if (x < 0) {
            g.moveLeft();
        } else {
            g.moveRight();
        }
    } else if (Math.abs(y) - Math.abs(x) > $game.width * 0.2) {
        if (y < 0) {
            g.moveUp();
        } else {
            g.moveDown();
        }
    }
    startX = 0, startY = 0, moveX = 0, moveY = 0;
});
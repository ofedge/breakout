function Tetris(elementId){
    this.obj = document.getElementById(elementId);
    this.width = this.obj.width;
    this.height = this.obj.height;
    this.ctx = this.obj.getContext('2d');
    this.storage = new Storage();
    if (this.storage.get(this.key.status)) {
        this.__proto__.status = JSON.parse(this.storage.get(this.key.status));
        this.status.running = false;
    } else {
        this.__proto__.status = {
            running: false,
            over: false,
            moving: false
        }
    }
    this.leftWidth = this.width * this.param.gameScale;
    this.rightWidth = this.width * (1 - this.param.gameScale);
    this.gamePaddingX = this.leftWidth * this.param.padding;
    this.gamePaddingY = this.height * this.param.padding;
    this.borderWidth = this.leftWidth - this.gamePaddingX * 2;
    this.borderHeight = this.height - this.gamePaddingY * 2;
    this.drawBg();
    this.gameOffsetX = this.gamePaddingX + this.param.gameBorder;
    this.gameOffsetY = this.gamePaddingY + this.param.gameBorder;
    this.gameWidth = this.leftWidth - this.gamePaddingX * 2 - this.param.gameBorder * 2;
    this.gameHeight = this.height - this.gamePaddingY * 2 - this.param.gameBorder * 2;
    this.game = new Game(this);
    this.info = new Info(this);
    this.next = new Next(this);
    this.drawNow();
}
Tetris.prototype.param = {
    gameScale: 0.6,
    padding: 0.1,
    gameBorder: 5,
    gameColor: '#FFFFCC',
    infoColor: '#CCFFFF',
    borderColor: '#FFCCCC',
}
Tetris.prototype.key = {
    bricks: 'bricks',
    next: 'next',
    randomQueue: 'randomQueue',
    status: 'status',
    line: 'line',
    score: 'score',
}
Tetris.prototype.interval = {
    time: 500,
    rushTime: 200,
    down: undefined,
    left: undefined,
    right: undefined
}
Tetris.prototype.drawBg = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.leftWidth, this.height);
    this.ctx.fillStyle = this.param.gameColor;
    this.ctx.fill();
    this.ctx.closePath();
    
    this.ctx.beginPath();
    this.ctx.lineWidth = this.param.gameBorder;
    this.ctx.strokeStyle = this.param.borderColor;
    this.ctx.rect(this.gamePaddingX, this.gamePaddingY, this.borderWidth, this.borderHeight);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.rect(this.leftWidth, 0, this.rightWidth, this.height);
    this.ctx.fillStyle = this.param.infoColor;
    this.ctx.fill();
    this.ctx.closePath();
}
Tetris.prototype.drawNow = function() {
    this.drawBg();
    this.game.drawBricks();
    this.game.drawNext();
    this.info.drawInfo();
    this.next.drawRandom();
}
Tetris.prototype.move = function() {
    if (this.next.randomQueue && this.game.next) {
        if (this.game.checkCollision()) {
            this.game.mergeNext();
            this.next.queueToNext();
            this.param.intervalT = 1000;
        } else {
            this.game.moveDown();
        }
    } else {
        this.next.random();
        this.next.queueToNext();
    }
    t.game.clearRow();
    if (this.game.checkFull()) {
        clearInterval(this.interval.down);
        this.status.running = false;
        this.status.over = true;
    }
    this.drawNow();
}
Tetris.prototype.moveLeft = function() {
    this.game.moveLeft();
    this.drawNow();
}
Tetris.prototype.moveRight = function() {
    this.game.moveRight();
    this.drawNow();
}
Tetris.prototype.rotate = function() {
    var tmpNext = this.game.next.clone();
    this.next.rotate();
    this.game.tmpNext = this.game.next.clone();
    var rotated = false;
    if (this.game.checkCoincide()) {
        if (this.game.moveLeft() || (this.game.moveLeft() && this.game.moveLeft())) {
            rotated = true;
        } else if (this.game.moveRight() || (this.game.moveRight() && this.game.moveRight())) {
            rotated = true;
        } else if (this.game.moveUp() || (this.game.moveRight() && this.game.moveRight())) {
            rotated = true;
        }
    } else {
        rotated = true;
    }
    if (rotated) {
        this.drawNow();
    } else {
        this.game.next = tmpNext;
    }
    return rotated;
}
function Game2048(gameId){
    this.gameObj = document.getElementById(gameId);
    this.__proto__.width = this.gameObj.width;
    this.__proto__.spaceWidth = this.width * this.spaceProportion / (this.n + 1);
    this.canvasObj = this.gameObj.getContext('2d');
    this.storage = new Storage();
    this.grid = new Grid(this);
    this.header = new HeaderBoard(this);
    this.drawNow();
    this.grid.checkMove();
    return this;
}
Game2048.prototype.n = 4;
Game2048.prototype.spaceProportion = 0.15;
Game2048.prototype.floor = {
    bgColor: '#bbada0',
    shadowColo: '#cdc1b4'
}
Game2048.prototype.drawFloor = function(){
    this.canvasObj.beginPath();
    this.canvasObj.rect(0, this.header.height, this.width, this.width);
    this.canvasObj.fillStyle = this.floor.bgColor;
    this.canvasObj.fill();
    this.canvasObj.closePath();
    for (var i = 0; i < this.n; i++) {
        for(var j = 0; j < this.n; j++) {
            this.canvasObj.beginPath();
            this.canvasObj.rect((i + 1) * this.spaceWidth + i * this.grid.width,
                                (j + 1) * this.spaceWidth + j * this.grid.width + this.header.height,
                                this.grid.width, this.grid.width);
            this.canvasObj.fillStyle = this.grid.colorMap['empty'];
            this.canvasObj.fill();
            this.canvasObj.closePath();
        }
    }
}
Game2048.prototype.drawNow = function() {
    this.canvasObj.clearRect(0, 0, this.width, this.height + this.header.height);
    this.drawFloor();
    this.header.drawHeader();
    this.grid.drawGrid();
}
Game2048.prototype.destroy = function() {
    this.grid.initGrid();
}
Game2048.prototype.moveLeft = function() {
    if (this.grid.moveLeft()) {
        this.grid.endMove('left');
        this.grid.randomNew();
        this.drawNow();
        this.grid.checkMove();
    }
}
Game2048.prototype.moveRight = function() {
    if (this.grid.moveRight()){
        this.grid.endMove('right');
        this.grid.randomNew();
        this.drawNow();
        this.grid.checkMove();
    }
}
Game2048.prototype.moveUp = function() {
    if (this.grid.moveUp()) {
        this.grid.endMove('up');
        this.grid.randomNew();
        this.drawNow();
        this.grid.checkMove();
    }
}
Game2048.prototype.moveDown = function() {
    if (this.grid.moveDown()) {
        this.grid.endMove('down');
        this.grid.randomNew();
        this.drawNow();
        this.grid.checkMove();
    }
}
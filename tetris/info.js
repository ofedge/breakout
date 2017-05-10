function Info(tetris) {
    this.__proto__.offsetX = tetris.leftWidth;
    this.__proto__.width = tetris.rightWidth;
    this.__proto__.height = tetris.height;
    this.tetris = tetris;
    this.ctx = tetris.ctx;
    this.nextWidth = this.tetris.game.brick.width * 4;
    this.nextHeight = this.tetris.game.brick.height * 4;
    this.nextOffsetX = this.offsetX + (this.width - this.nextWidth) / 2;
    this.nextOffsetY = this.height * 0.1;
    this.drawInfo();
}
Info.prototype.drawInfo = function() {
    this.ctx.font = this.text.fontSize + 'px ' + this.text.fontFamily;
    this.ctx.fillStyle = this.text.color;
    var nextTextWidth = this.ctx.measureText(this.text.next).width;
    this.ctx.fillText(this.text.next, this.offsetX + (this.width - nextTextWidth) / 2, this.text.fontSize);
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '';
    this.ctx.rect(this.nextOffsetX, this.nextOffsetY, this.nextWidth, this.nextHeight);
    this.ctx.stroke();
    var lineTextWidth = this.ctx.measureText(this.text.line).width;
    this.ctx.fillText(this.text.line, this.offsetX + (this.width - lineTextWidth) / 2 , this.height * 0.3 + this.text.fontSize);
    var line = this.tetris.game.line | 0;
    var lineWidth = this.ctx.measureText(line).width;
    this.ctx.fillText(line, this.offsetX + (this.width - lineWidth) / 2 , this.height * 0.4 + this.text.fontSize);
    var scoreTextWidth = this.ctx.measureText(this.text.score).width;
    this.ctx.fillText(this.text.score, this.offsetX + (this.width - scoreTextWidth) / 2 , this.height * 0.5 + this.text.fontSize);
    var score = this.tetris.game.score | 0;
    var scoreWidth = this.ctx.measureText(score).width;
    this.ctx.fillText(score, this.offsetX + (this.width - scoreWidth) / 2 , this.height * 0.6 + this.text.fontSize);
    this.drawStatus();
}
Info.prototype.text = {
    fontSize: 30,
    fontFamily: 'Verdana',
    color: '#996600',
    next: 'NEXT',
    line: 'LINE',
    score: 'SCORE'
}
Info.prototype.status = {
    fontSize: 30,
    fontFamily: 'Arial',
    color: '#FF0000',
    paused: 'PAUSED',
    over: 'OVER'
}
Info.prototype.drawStatus = function(){
    this.ctx.font = this.status.fontSize + 'px ' + this.status.over
    this.ctx.fillStyle = this.status.color;
    if (this.tetris.status.over) {
        var width = this.ctx.measureText(this.status.over).width;
        this.ctx.fillText(this.status.over, this.offsetX + (this.width - width) / 2 , this.height * 0.8 + this.status.fontSize);
    } else if (!this.tetris.status.running) {
        var width = this.ctx.measureText(this.status.paused).width;
        this.ctx.fillText(this.status.paused, this.offsetX + (this.width - width) / 2 , this.height * 0.8 + this.status.fontSize);
    }
}
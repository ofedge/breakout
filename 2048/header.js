function HeaderBoard(game){
    this.game = game;
    this.ctx = game.canvasObj;
    this.space.height = this.height - this.scoreHeight;
    return this;
}
HeaderBoard.prototype.minWidth = 300;
HeaderBoard.prototype.height = 70;
HeaderBoard.prototype.scoreHeight = 60;
HeaderBoard.prototype.scoreProportion = 0.25;
HeaderBoard.prototype.drawHeader = function() {
    this.drawScore();
    this.drawBest();
    this.drawStart();
    this.drawSpace();
}
HeaderBoard.prototype.score = {
    text: '分数',
    minWidth: 100,
    bgColor: '#edc22e',
    color: '#555555',
    fontSize: 20,
    fontFamily: 'KaiTi',
    width: 100
};
HeaderBoard.prototype.best = {
    text: '最高分',
    minWidth: 100,
    bgColor: '#f59563',
    color: '#555555',
    fontSize: 20,
    fontFamily: 'KaiTi',
    width: 100
}
HeaderBoard.prototype.start = {
    text: '开始',
    bgColor: '#f2b179',
    color: '#555555',
    fontSize: 40,
    fontFamily: 'KaiTi',
    width: 0
}
HeaderBoard.prototype.space = {
    height: 0,
    bgColor: '#ffffff'
}
HeaderBoard.prototype.drawScore = function(){
    this.ctx.beginPath();
    this.score.width = this.game.width * this.scoreProportion > this.score.minWidth ? this.game.width * this.scoreProportion : this.score.minWidth;
    this.ctx.rect(0, 0, this.score.width, this.scoreHeight);
    this.ctx.fillStyle = this.score.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.font = this.score.fontSize + 'px ' + this.score.fontFamily;
    this.ctx.fillStyle = this.score.color;
    var textWidth = this.ctx.measureText(this.score.text).width;
    this.ctx.fillText(this.score.text, this.score.width / 2 - textWidth / 2, this.scoreHeight / 4 + this.score.fontSize / 2.6);
    var score = this.game.grid.score;
    textWidth = this.ctx.measureText(score).width;
    this.ctx.fillText(score, this.score.width / 2 - textWidth / 2, this.scoreHeight - this.scoreHeight / 4 + this.score.fontSize / 2.6);
}
HeaderBoard.prototype.drawBest = function(){
    this.ctx.beginPath();
    this.best.width = this.game.width * this.scoreProportion > this.best.minWidth ? this.game.width * this.scoreProportion : this.best.minWidth;
    this.ctx.rect(this.score.width, 0, this.best.width, this.scoreHeight);
    this.ctx.fillStyle = this.best.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.font = this.best.fontSize + 'px ' + this.best.fontFamily;
    this.ctx.fillStyle = this.best.color;
    var textWidth = this.ctx.measureText(this.best.text).width;
    this.ctx.fillText(this.best.text, this.score.width + this.best.width / 2 - textWidth / 2, this.scoreHeight / 4 + this.best.fontSize / 2.6);
    var best = this.game.grid.best;
    textWidth = this.ctx.measureText(best).width;
    this.ctx.fillText(best, this.score.width + this.best.width / 2 - textWidth / 2, this.scoreHeight - this.scoreHeight / 4 + this.best.fontSize / 2.6);
}
HeaderBoard.prototype.drawStart = function() {
    this.start.width = this.game.width - this.score.width - this.best.width;
    if(this.start.width > 0) {
        this.ctx.beginPath();
        this.ctx.rect(this.score.width + this.best.width, 0, this.start.width, this.scoreHeight);
        this.ctx.fillStyle = this.start.bgColor;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.font = this.start.fontSize + 'px ' + this.start.fontFamily;
        this.ctx.fillStyle = this.start.color;
        var textWidth = this.ctx.measureText(this.start.text).width;
        this.ctx.fillText(this.start.text, this.score.width + this.best.width + this.start.width / 2 -textWidth / 2, this.scoreHeight / 2 + this.start.fontSize / 2.6);
    }
}
HeaderBoard.prototype.drawSpace = function() {
    this.ctx.beginPath();
    this.ctx.rect(0, this.scoreHeight, this.game.width, this.space.height);
    this.ctx.fillStyle = this.space.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
}
HeaderBoard.prototype.isStart = function(x, y) {
    if(x > (this.score.width + this.best.width) && x < this.game.width && y > 0 && y < this.scoreHeight) {
        return true;
    }
    return false;
}
function Game(tetris){
    this.tetris = tetris;
    this.ctx = tetris.ctx;
    this.__proto__.offsetX = tetris.gameOffsetX;
    this.__proto__.offsetY = tetris.gameOffsetY;
    this.__proto__.width = tetris.gameWidth;
    this.__proto__.height = tetris.gameHeight;
    this.__proto__.brick.width = this.width / this.brick.column;
    this.__proto__.brick.height = this.height / this.brick.row;
    this.storage = new Storage();
    this.line = this.storage.get(this.tetris.key.line) | 0;
    this.score = this.storage.get(this.tetris.key.score) | 0;
    if (this.storage.get(this.tetris.key.bricks)) {
        this.bricks = JSON.parse(this.storage.get(this.tetris.key.bricks));
        for (var i = 0; i < this.brick.column; i++) {
            for (var j = 0; j < this.brick.row; j++) {
                this.bricks[i][j].x = i * this.brick.width + this.brick.border;
                this.bricks[i][j].y = j * this.brick.height + this.brick.border;
            }
        }
    } else {
        this.bricks = [];
        for (var i = 0; i < this.brick.column; i++) {
            var column = [];
            for (var j = 0; j < this.brick.row; j++) {
                column.push({
                    x: i * this.brick.width + this.brick.border,
                    y: j * this.brick.height + this.brick.border,
                    code: ''
                });
            }
            this.bricks.push(column);
        }
    }
    if (this.storage.get(this.tetris.key.next)) {
        this.next = JSON.parse(this.storage.get(this.tetris.key.next));
    }
    this.drawBricks();
}
Game.prototype.brick = {
    row: 18,
    column: 10,
    border: 1
}
Game.prototype.drawBricks = function() {
    for (var i = 0; i < this.brick.column; i++) {
        for (var j = 0; j < this.brick.row; j++) {
            if (this.bricks[i][j].code) {
                this.ctx.beginPath();
                this.ctx.rect(this.offsetX + this.bricks[i][j].x + 1, this.offsetY + this.bricks[i][j].y + 1, this.brick.width - 2, this.brick.height - 2);
                this.ctx.fillStyle = this.colorMap[this.bricks[i][j].code];
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }
}
Game.prototype.colorMap = {
    'I': '#800000',
    'J': '#C71585',
    'L': '#7B68EE',
    'O': '#8B4513',
    'Z': '#DAA520',
    'T': '#008080',
    'S': '#808000'
}
Game.prototype.drawNext = function() {
    var next = this.next;
    if (!next) {
        return;
    }
    for (var i = 0; i < next.bricks.length; i++) {
        var brick = next.bricks[i];
        if ((brick.y - next.init + next.move.y) >= 0) {
            var x = brick.x + 3 + next.move.x;
            var y = brick.y - next.init + next.move.y;
            this.ctx.beginPath();
            this.ctx.rect(this.offsetX + this.bricks[x][y].x + 1, this.offsetY + this.bricks[x][y].y + 1, this.brick.width - 2, this.brick.height - 2);
            this.ctx.fillStyle = this.colorMap[next.code];
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
}
Game.prototype.moveDown = function() {
    this.next.move.y = this.next.move.y + 1;
    this.save();
}
Game.prototype.moveLeft = function() {
    this.tmpNext = this.next.clone();
    this.tmpNext.move.x = this.tmpNext.move.x - 1;
    if (!this.checkCoincide()) {
        this.next.move.x = this.next.move.x - 1;
        this.save();
        return true;
    }
    return false;
}
Game.prototype.moveRight = function() {
    this.tmpNext = this.next.clone();
    this.tmpNext.move.x = this.tmpNext.move.x + 1;
    if (!this.checkCoincide()) {
        this.save();
        this.next.move.x = this.next.move.x + 1;
        return true;
    }
    return false;
}
Game.prototype.moveUp = function() {
    this.tmpNext = this.next.clone();
    this.tmpNext.move.y = this.tmpNext.move.y - 1;
    if (!this.checkCoincide()) {
        this.next.move.y = this.next.move.y - 1;
        this.save();
        return true;
    }
    return false;
}
Game.prototype.checkCoincide = function() {
    var coincide = false;
    var bricks = this.tmpNext.bricks;
    for (var i = 0; i < bricks.length; i++) {
        var x = bricks[i].x + 3 + this.tmpNext.move.x;
        if (x < 0 || x >= this.brick.column) {
            coincide = true;
            break;
        }
        var y = bricks[i].y - this.tmpNext.init + this.tmpNext.move.y;
        if (y > 0 && y < this.brick.row && this.bricks[x][y].code) {
            coincide = true;
            break;
        }
    }
    return coincide;
}
Game.prototype.checkFull = function() {
    var full = false;
    var n = this.brick.row;
    for (var i = 0; i < this.brick.column; i++) {
        for (var j = 0; j < this.brick.row; j++) {
            if (this.bricks[i][j].code) {
                if (n > j) {
                    n = j;
                }
            }
        }
    }
    if (n == 0) {
        full = true;
    } else if (n > 0 && n <= 3) {
        this.tmpNext = this.next.clone();
        this.tmpNext.move.y = this.tmpNext.move.y + 1;
        if (this.checkCoincide()) {
            var bricks = this.next.bricks;
            for (var i = 0; i < bricks.length; i++) {
                var y = bricks[i].y - this.next.init + this.next.move.y;
                if (y <= 0) {
                    full = true;
                    break;
                }
            } 
        }

    }
    return full;
}
Game.prototype.checkCollision = function() {
    var collision = false;
    var bricks = this.next.bricks;
    for (var i = 0; i < bricks.length; i++) {
        var y = bricks[i].y - this.next.init + this.next.move.y;
        if (this.brick.row - y <= 1) {
            collision = true;
            break;
        }
        var x = bricks[i].x + 3 + this.next.move.x;
        if (x < 0 || x >= this.brick.column) {
            continue;
        }
        if (y < 0) {
            continue;
        }
        for (var j = y; j < this.brick.row; j++) {
            if (this.bricks[x][j].code) {
                if (j - y <= 1) {
                    collision = true;
                    break;
                }
            }
        }
    }
    return collision;
}
Game.prototype.mergeNext = function() {
    var bricks = this.next.bricks;
    for (var i = 0; i < bricks.length; i++) {
        var x = bricks[i].x + 3 + this.next.move.x;
        var y = bricks[i].y - this.next.init + this.next.move.y;
        if (this.bricks[x][y])
            this.bricks[x][y].code = this.next.code;
    }
    this.next = undefined;
    this.save();
}
Game.prototype.lineScoreMap = {
    1: 10,
    2: 30,
    3: 50,
    4: 80
}
Game.prototype.clearRow = function() {
    var rows = [];
    for (var j = 0; j < this.brick.row; j++) {
        var full = true;
        for (var i = 0; i < this.brick.column; i++) {
            if (!this.bricks[i][j].code) {
                full = false;
                break;
            }
        }
        if (full) {
            rows.push(j);
        }
    }
    if (rows.length > 0) {
        this.line = this.line + rows.length;
        this.score = this.score + this.lineScoreMap[rows.length];
        rows.sort(function(a, b){
            return a > b;
        });
        for (var n = 0; n < rows.length; n++) {
            for (var j = rows[n]; j > 0; j--) {
                for (var i = 0; i < this.brick.column; i++) {
                    this.bricks[i][j].code = this.bricks[i][j - 1].code;
                }
                for (var i = 0; i < this.brick.column; i++) {
                    this.bricks[i][0].code = '';
                }
            }
        }
    }
    this.save();
}
Game.prototype.save = function() {
    this.storage.put(this.tetris.key.bricks, JSON.stringify(this.bricks));
    this.storage.put(this.tetris.key.next, JSON.stringify(this.next));
    this.storage.put(this.tetris.key.line, this.line);
    this.storage.put(this.tetris.key.score, this.score);
}
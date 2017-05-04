function Grid(game) {
    this.game = game;
    this.storage = this.game.storage;
    this.ctx = this.game.canvasObj
    var grids = eval(this.storage.get(this.keys.grids));
    if (grids && grids.length > 0) {
        this.grids = grids;
    } else {
        this.initGrid();
    }
    this.gridStatus = {
        move: {
            up: false,
            right: false,
            down: false,
            left: false
        },
        win: false,
        showedWin: false
    };
    this.__proto__.width = this.game.width * (1 - this.game.spaceProportion) / this.game.n
    this.score = this.storage.get(this.keys.score) | 0;
    this.best = this.storage.get(this.keys.best) | 0;
}
Grid.prototype.target=2048;
Grid.prototype.keys = {
    grids: 'grids',
    score: 'currentScore',
    best: 'bestScore'
}
Grid.prototype.colorMap = {
    'empty': '#cdc1b4',
    'lighter': '#f9f6f2',
    'darker': '#776e65',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    4096: '#edc22e'
}
Grid.prototype.message = {
    succeed: 'You Win!',
    over: 'Game Over!',
    fontSize: 50,
    fontFamily: 'Verdana',
    color: '#663333'
}
Grid.prototype.get = function(index){
    var x = index % this.game.n;
    var y = Math.floor(index / this.game.n);
    return this.grids[x][y];
}
Grid.prototype.initGrid = function() {
    this.grids = [];
    for (var x = 0; x < this.game.n; x++) {
        var rows = [];
        for(var y = 0; y < this.game.n; y++){
            rows.push({n: 0})
        }
        this.grids.push(rows);
    }
    var r1 = Math.floor(Math.random() * this.game.n * this.game.n);
    var tmp = Math.floor(Math.random() * (this.game.n * this.game.n - 1));
    var r2 = r1 > tmp ? tmp : (tmp + 1);
    this.get(r1).n = Math.random() < 0.9 ? 2 : 4;
    this.get(r2).n = Math.random() < 0.9 ? 2 : 4;
    this.score = 0;
    this.save();
}
Grid.prototype.save = function() {
    this.storage.put(this.keys.grids, JSON.stringify(this.grids));
    this.storage.put(this.keys.score, this.score);
    this.storage.put(this.keys.best, this.best);
}
Grid.prototype.drawGrid = function(){
    for (var x = 0; x < this.game.n; x++) {
        for (var y = 0; y < this.game. n; y++) {
            if(this.grids[x][y].n != 0) {
                var startX = (x + 1) * this.game.spaceWidth + x * this.width;
                var startY = (y + 1) * this.game.spaceWidth + y * this.width + this.game.header.height;
                this.ctx.beginPath();
                this.ctx.rect(startX, startY, this.width, this.width);
                this.ctx.fillStyle = this.colorMap[this.grids[x][y].n];
                this.ctx.fill();
                this.ctx.font = this.width / 3 + 'px Verdana';
                if(this.grids[x][y].n < 10){
                    this.ctx.fillStyle = this.colorMap.darker;
                } else {
                    this.ctx.fillStyle = this.colorMap.lighter;
                }
                var offsetX = (this.width - this.ctx.measureText(this.grids[x][y].n).width) / 2;
                var offsetY = this.width / 1.7;
                this.ctx.fillText(this.grids[x][y].n, startX + offsetX, startY + offsetY);
                this.ctx.closePath();
            }
        }
    }
}
Grid.prototype.animation = {
    time: 100,
    intervalTime: 10,
    i: 0,
    intervalId: undefined
}
Grid.prototype.animationMove = function(){
    this.ctx.clearRect(0, 0, this.width, this.game.height + this.game.header.height);
    this.game.drawFloor();
    this.game.header.drawHeader();
    var maxFrame = this.animation.time / this.animation.intervalTime;
    var step = (this.width + this.game.spaceWidth) / maxFrame;
    this.animation.i++;
    for (var x = 0; x < this.game.n; x++) {
        for (var y = 0; y < this.game. n; y++) {
            if(this.grids[x][y].n != 0) {
                var startX = (x + 1) * this.game.spaceWidth + x * this.width;
                var startY = (y + 1) * this.game.spaceWidth + y * this.width + this.game.header.height;
                if (this.grids[x][y].left) {
                    startX = startX - this.animation.i * step * this.grids[x][y].left.step;
                }
                if (this.grids[x][y].right) {
                    startX = startX + this.animation.i * step * this.grids[x][y].right.step;
                }
                if (this.grids[x][y].up) {
                    startY = startY - this.animation.i * step * this.grids[x][y].up.step;
                }
                if (this.grids[x][y].down) {
                    startY = startY + this.animation.i * step * this.grids[x][y].down.step;
                }
                this.ctx.beginPath();
                this.ctx.rect(startX, startY, this.width, this.width);
                this.ctx.fillStyle = this.colorMap[this.grids[x][y].n];
                this.ctx.fill();
                this.ctx.font = this.width / 3 + 'px Verdana';
                if(this.grids[x][y].n < 10){
                    this.ctx.fillStyle = this.colorMap.darker;
                } else {
                    this.ctx.fillStyle = this.colorMap.lighter;
                }
                var offsetX = (this.width - this.ctx.measureText(this.grids[x][y].n).width) / 2;
                var offsetY = this.width / 1.7;
                this.ctx.fillText(this.grids[x][y].n, startX + offsetX, startY + offsetY);
                this.ctx.closePath();
            }
        }
    }
    if (this.animation.i >= maxFrame) {
        clearInterval(this.animation.intervalId);
        this.animation.i = 0;
    }
}
Grid.prototype.drawResult = function() {
    var move = this.gridStatus.move;
    if (this.gridStatus.win && !this.gridStatus.showedWin) {
        this.ctx.font = this.message.fontSize + 'px ' + this.message.fontFamily;
        this.ctx.fillStyle = this.message.color;
        var offsetX = this.ctx.measureText(this.message.succeed).width / 2;
        this.ctx.fillText(this.message.succeed, this.game.width / 2 - offsetX, this.game.spaceWidth + this.game.width / 2 + this.message.fontSize)
        this.gridStatus.showedWin = true;
    } else if (!move.left && !move.right && !move.up && !move.down) {
        this.ctx.font = this.message.fontSize + 'px ' + this.message.fontFamily;
        this.ctx.fillStyle = this.message.color;
        var offsetX = this.ctx.measureText(this.message.over).width / 2;
        this.ctx.fillText(this.message.over, this.game.width / 2 - offsetX, this.game.spaceWidth + this.game.width / 2 + this.message.fontSize)
    }
}
Grid.prototype.checkMove = function(){
    this.gridStatus.move = {
        left: false,
        right: false,
        up: false,
        down: false
    }
    for(var x = 0; x < this.game.n; x++){
        for(var y = 0; y < this.game.n; y++) {
            if(this.grids[x][y].n != 0){
                var tx = x, ty = y;
                if(!this.gridStatus.win && this.grids[x][y].n >= this.target){
                    this.gridStatus.win = true;
                }
                if (this.grids[x][y] != 0 &&　!this.gridStatus.move.left) {
                    if (tx > 0) {
                        tx--;
                        if(this.grids[tx][ty].n == 0 || this.grids[tx][ty].n == this.grids[x][y].n) {
                            this.gridStatus.move.left = true;
                        }
                    }
                    tx = x;
                }
                if (this.grids[x][y] != 0 &&　!this.gridStatus.move.right) {
                    if (tx < (this.game.n - 1)) {
                        tx++;
                        if(this.grids[tx][ty].n == 0 || this.grids[tx][ty].n == this.grids[x][y].n) {
                            this.gridStatus.move.right = true;
                        }
                    }
                    tx = x;
                }
                if (this.grids[x][y] != 0 &&　!this.gridStatus.move.up) {
                    if (ty > 0) {
                        ty--;
                        if(this.grids[tx][ty].n == 0 || this.grids[tx][ty].n == this.grids[x][y].n) {
                            this.gridStatus.move.up = true;
                        }
                    }
                    ty = y;
                }
                if (this.grids[x][y] != 0 &&　!this.gridStatus.move.down) {
                    if (ty < (this.game.n - 1)) {
                        ty++;
                        if(this.grids[tx][ty].n == 0 || this.grids[tx][ty].n == this.grids[x][y].n) {
                            this.gridStatus.move.down = true;
                        }
                    }
                    ty = y;
                }
            }
        }
    }
    this.drawResult();
}
Grid.prototype.randomNew = function() {
    var emptyGrids = [];
    for (var i = 0; i < this.game.n * this.game.n; i++) {
        if (this.get(i).n == 0) {
            emptyGrids.push(this.get(i));
        }
    }
    if (emptyGrids.length > 0) {
        emptyGrids[Math.floor(Math.random() * emptyGrids.length)].n = Math.random() < 0.9 ? 2 : 4;
    }
    this.save();
}
Grid.prototype.moveLeft = function() {
    var moved = false;
    for (var y = 0; y < this.game.n; y++) {
        for (var x = 0; x < this.game.n; x++) {
            var grid = this.grids[x][y];
            if(grid.n != 0) {
                grid.left = {
                    move: false,
                    step: 0,
                    merge: false,
                    beMerged: false
                }
                var tx = x;
                while(tx > 0){
                    tx--;
                    var tmpGrid = this.grids[tx][y];
                    var tmpStep = tmpGrid.left ? tmpGrid.left.step : 0;
                    if (tmpStep > 0) {
                        grid.left.move = true;
                    }
                    grid.left.step = grid.left.step + tmpStep;
                    if (tmpGrid.n ==0) {
                        grid.left.move = true;
                        grid.left.step = grid.left.step + 1;
                        moved = true;
                    } else if(tmpGrid.n == grid.n) {
                        grid.left.move = true;
                        if(tmpGrid.left.merge == false){
                            grid.left.step = grid.left.step + 1;
                            grid.left.merge = true;
                            tmpGrid.left.beMerged = true;
                        }
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            } else {
                delete grid.left;
            }
        }
    }
    this.gridStatus.lastMove = 'left'
    return moved;
}
Grid.prototype.moveRight = function() {
    var moved = false;
    for (var y = 0; y < this.game.n; y++) {
        for (var x = this.game.n - 1; x >= 0; x--) {
            var grid = this.grids[x][y];
            if (grid.n != 0) {
                grid.right = {
                    move: false,
                    step: 0,
                    merge: false,
                    beMerged: false
                }
                var tx = x;
                while (tx < this.game.n - 1) {
                    tx++;
                    var tmpGrid = this.grids[tx][y];
                    var tmpStep = tmpGrid.right ? tmpGrid.right.step : 0;
                    if (tmpStep > 0) {
                        grid.right.move = true;
                    }
                    grid.right.step = grid.right.step + tmpStep;
                    if (tmpGrid.n == 0) {
                        grid.right.move = true;
                        grid.right.step = grid.right.step + 1;
                        moved = true;
                    } else if (tmpGrid.n == grid.n) {
                        grid.right.move = true;
                        if (tmpGrid.right.merge == false) {
                            grid.right.step = grid.right.step + 1;
                            grid.right.merge = true;
                            tmpGrid.right.beMerged = true;
                        }
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                    
                }
            } else {
                delete grid.right;
            }
        }
    }
    this.gridStatus.lastMove = 'right'
    return moved;
}
Grid.prototype.moveUp = function() {
    var moved = false;
    for (var x = 0; x < this.game.n; x++) {
        for (var y = 0; y < this.game.n; y++) {
            var grid = this.grids[x][y];
            if (grid.n != 0) {
                grid.up = {
                    move: false,
                    step: 0,
                    merge: false,
                    beMerged: false
                }
                var ty = y;
                while (ty > 0) {
                    ty--;
                    var tmpGrid = this.grids[x][ty];
                    var tmpStep = tmpGrid.up ? tmpGrid.up.step : 0;
                    if (tmpStep > 0) {
                        grid.up.move = true;
                    }
                    grid.up.step = grid.up.step + tmpStep;
                    if (tmpGrid.n == 0) {
                        grid.up.move = true;
                        grid.up.step = grid.up.step + 1;
                        moved = true;
                    } else if (tmpGrid.n == grid.n) {
                        grid.up.move = true;
                        if (tmpGrid.up.merge == false) {
                            grid.up.step = grid.up.step + 1;
                            grid.up.merge = true;
                            tmpGrid.up.beMerged = true;
                        }
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            } else {
                delete grid.up;
            }
        }
    }
    this.gridStatus.lastMove = 'up'
    return moved;
}
Grid.prototype.moveDown = function() {
    var moved = false;
    for (var x = 0; x < this.game.n; x++) {
        for (var y = this.game.n - 1; y >= 0; y--) {
            var grid = this.grids[x][y];
            if (grid.n != 0) {
                grid.down = {
                    move: false,
                    step: 0,
                    merge: false,
                    beMerged: false
                }
                var ty = y;
                while (ty < this.game.n - 1) {
                    ty++;
                    var tmpGrid = this.grids[x][ty];
                    var tmpStep = tmpGrid.down ? tmpGrid.down.step : 0;
                    if (tmpStep > 0) {
                        grid.down.move = true;
                    }
                    grid.down.step = grid.down.step + tmpStep;
                    if (tmpGrid.n == 0) {
                        grid.down.move = true;
                        grid.down.step = grid.down.step + 1;
                        moved = true;
                    } else if (tmpGrid.n == grid.n) {
                        grid.down.move = true;
                        if (tmpGrid.down.merge == false) {
                            grid.down.step = grid.down.step + 1;
                            grid.down.merge = true;
                            tmpGrid.down.beMerged = true;
                        }
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            } else {
                delete grid.down;
            }
        }
    }
    this.gridStatus.lastMove = 'down'
    return moved;
}
Grid.prototype.endMove = function() {
    var direction = this.gridStatus.lastMove;
    var tmpGrids = [];
    for (var i = 0; i < this.grids.length; i++) {
        var tmpRow = [];
        for(var j = 0; j < this.grids[i].length; j++) {
            var tmpGrid = {n: this.grids[i][j].n};
            if (this.grids[i][j][direction]) {
                tmpGrid[direction] = this.grids[i][j][direction];
            }
            tmpRow.push(tmpGrid);
        }
        tmpGrids.push(tmpRow);
    }
    for (var x = 0; x < this.game.n; x++) {
        for (var y = 0; y < this.game.n; y++) {
            this.grids[x][y] = {n: 0};
        }
    }
    for (var x = 0; x < tmpGrids.length; x++) {
        for (var y = 0; y < tmpGrids[x].length; y++) {
            var tmpGrid = tmpGrids[x][y];
            if (tmpGrid[direction]){
                if (tmpGrid[direction].move && !tmpGrid[direction].beMerged) {
                    if (direction == 'left') {
                        this.grids[x - tmpGrid[direction].step][y].n = tmpGrid[direction].merge ? tmpGrid.n * 2 : tmpGrid.n;
                    } else if (direction == 'right') {
                        this.grids[x + tmpGrid[direction].step][y].n = tmpGrid[direction].merge ? tmpGrid.n * 2 : tmpGrid.n;
                    } else if (direction == 'up') {
                        this.grids[x][y - tmpGrid[direction].step].n = tmpGrid[direction].merge ? tmpGrid.n * 2 : tmpGrid.n;
                    } else if (direction == 'down') {
                        this.grids[x][y + tmpGrid[direction].step].n = tmpGrid[direction].merge ? tmpGrid.n * 2 : tmpGrid.n;
                    }
                    if (tmpGrid[direction].merge) {
                        this.score += tmpGrid.n * 2;
                        this.best = this.score > this.best ? this.score : this.best;
                    }
                } else {
                    if (!tmpGrid[direction].beMerged) {
                        this.grids[x][y].n = tmpGrid.n;
                    }
                }
            }
        }
    }
    this.save();
}
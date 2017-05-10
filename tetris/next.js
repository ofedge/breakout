function Next(tetris) {
    this.tetris = tetris;
    this.offsetX = tetris.info.nextOffsetX;
    this.offsetY = tetris.info.nextOffsetY;
    this.width = tetris.info.nextWidth;
    this.height = tetris.info.nextHeight;
    this.game = tetris.game;
    this.colorMap = tetris.game.colorMap;
    this.brick = tetris.game.brick;
    this.ctx = tetris.ctx;
    this.storage = new Storage();
    if (this.storage.get(this.tetris.key.randomQueue)) {
        this.randomQueue = JSON.parse(this.storage.get(this.tetris.key.randomQueue));
    }
    this.init();
}
Next.prototype.init = function() {
    this.queues = {};
    // Shape "I"
    this.queues[0] = { code: 'I', next: 1, bricks: [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1} ], init: 1 }
    this.queues[1] = { code: 'I', next: 0, bricks: [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3} ], init: 3 }
    // Shape "J"
    this.queues[2] = { code: 'J', next: 3, bricks: [ {x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    this.queues[3] = { code: 'J', next: 4, bricks: [ {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    this.queues[4] = { code: 'J', next: 5, bricks: [ {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 1, y: 2} ], init: 2 }
    this.queues[5] = { code: 'J', next: 2, bricks: [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2} ], init: 2 }
    // Shape "L"
    this.queues[6] = { code: 'L', next: 7, bricks: [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    this.queues[7] = { code: 'L', next: 8, bricks: [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 0, y: 2} ], init: 2 }
    this.queues[8] = { code: 'L', next: 9, bricks: [ {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2} ], init: 2 }
    this.queues[9] = { code: 'L', next: 6, bricks: [ {x: 2, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    // Shape "O"
    this.queues[10] = { code: 'O', next: 10, bricks: [ {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    // Shape "Z"
    this.queues[11] = { code: 'Z', next: 12, bricks: [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    this.queues[12] = { code: 'Z', next: 11, bricks: [ {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2} ], init: 2 }
    // Shape "T"
    this.queues[13] = { code: 'T', next: 14, bricks: [ {x: 1, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2} ], init: 2 }
    this.queues[14] = { code: 'T', next: 15, bricks: [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2} ], init: 2 }
    this.queues[15] = { code: 'T', next: 16, bricks: [ {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2} ], init: 2 }
    this.queues[16] = { code: 'T', next: 13, bricks: [ {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2} ], init: 2 }
    // Shape "S"
    this.queues[17] = { code: 'S', next: 18, bricks: [ {x: 1, y: 1}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 1, y: 2} ], init: 2 }
    this.queues[18] = { code: 'S', next: 17, bricks: [ {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2} ], init: 2 }
}
Next.prototype.random = function() {
    var total = 0;
    for (var key in this.queues) {
        if (key != 'clone') {
            total++;
        }
    }
    var randomInt = Math.floor(Math.random() * total);
    this.randomQueue = this.queues[randomInt];
    this.save();
}
Next.prototype.drawRandom = function() {
    if (!this.randomQueue) {
        return;
    }
    for (var i = 0; i < this.randomQueue.bricks.length; i++) {
        var brick = this.randomQueue.bricks[i];
        this.ctx.beginPath();
        this.ctx.rect(this.offsetX + brick.x * this.brick.width + 1, this.offsetY + brick.y * this.brick.height + 1, this.brick.width - 2, this.brick.height - 2);
        this.ctx.fillStyle = this.colorMap[this.randomQueue.code];
        this.ctx.fill();
        this.ctx.closePath();
    }
}
Next.prototype.queueToNext = function() {
    if (!this.randomQueue) {
        return;
    }
    this.game.next = this.randomQueue.clone();
    this.game.next.move = {x: 0, y: 0};
    this.random();
}
Next.prototype.rotate = function() {
    var move = this.game.next.move;
    var next = this.queues[this.game.next.next].clone();
    this.game.next = next;
    this.game.next.move = move;
}
Next.prototype.save = function() {
    this.storage.put(this.tetris.key.randomQueue, JSON.stringify(this.randomQueue));
}
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 小球的圆心
var x = canvas.width / 2;
var y = canvas.height - 30;

// 小球每次移动像素
var dx = 2;
var dy = -2;

// 小球半径
var ballRadius = 10;

// 挡板的宽, 高和距左侧的位置
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

// 存储左右按键事件
var rightPressed = false;
var leftPressed = false;

// 砖块属性
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// 分数
var score = 0;

// 玩家生命
var lives = 3;

// 游戏是否结束
var gameEnd = false;

// 将砖块信息放在一个二维数组里
var bricks = [];
for(c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for(r = 0; r < brickRowCount; r++) {
		bricks[c][r] = {x: 0, y: 0, status: 1};
	}
}

// 绘制小球
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

// 绘制挡板
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

// 绘制砖块
function drawBricks() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

// 小球移动
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawBricks();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
		dx = -dx;
	}
	if(y + dy < ballRadius){
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		if(x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if (!lives){
				gameEnd = true;
				drawResult('GAME OVER!');
			} else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}
	x += dx;
	y += dy;
}

// 监听键盘
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// 按下按键监听
function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

// 松开按键监听
function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

// 小球撞击砖块事件
function collisionDetection(){
	for(c = 0; c < brickColumnCount; c++) {
		for(r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1){
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score == brickRowCount * brickColumnCount) {
						gameEnd = true;
						drawResult("YOU WIN, CONGRATULATIONS!");
					}
				}
			}
		}
	}
}

// 绘制分数
function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

// 绘制玩家生命信息
function drawLives() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#0095DD';
	ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// 绘制游戏结果
function drawResult(msg) {
	clearInterval(interval);
	ctx.font = '16px Arial';
	ctx.fillStyle = '#0095DD';
	ctx.fillText(msg, canvas.width / 2 -65, canvas.height / 2 - 30);
}

// 鼠标移动监听
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e){
	var relativeX = e.clientX - canvas.offsetLeft;
	var relativeY = e.clientY - canvas.offsetTop;
	if (relativeX > 0 && relativeX < canvas.width && relativeY > 0 && relativeY < canvas.height) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

draw();

document.getElementsByTagName('a')[0].onclick = function(e){
	if (!gameEnd)
		interval = setInterval(draw, 10);
}

document.getElementsByTagName('a')[1].onclick = function(e){
	if (!gameEnd)
		clearInterval(interval);
}

document.getElementsByTagName('a')[2].onclick = function(e){
	document.location.reload();
}
//draw();
//requestAnimationFrame(draw);
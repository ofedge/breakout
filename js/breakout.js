var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 小球的圆心
var x = canvas.width / 2;
var y = canvas.height - 30;

// 每次移动像素
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

// 小球移动
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
		dx = -dx;
	}
	if(y + dy > canvas.height - ballRadius || y + dy < ballRadius){
		dy = -dy;
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

setInterval(draw, 10);
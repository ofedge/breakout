var canvas = document.getElementById("myCanVas");
var ctx = canvas.getContext("2d");

// 初始化变量
// 区域宽度
var len = 600;
// 分割成多少份
var $divide = document.getElementById('divide');
var divide = $divide.value;
$divide.onchange = function(){
	draw(len, this.value);
}

draw(len, divide);

/**
 * 绘制所有图形
 * 
 * @param len
 *            区域宽度
 * @param divide
 *            分割成多少份
 */
function draw(len, divide) {
	ctx.clearRect(0, 0, len, len);
	drawCircle(len);
	var squares = getSquares(len, divide);
	drawLines(squares);
}


/**
 * 获取正方形数组
 * 
 * @param len
 *            区域宽度
 * @param divide
 *            分割多少份
 */
function getSquares(len, divide) {
	var squares = [];
	var length = len / divide; // 正方形边长
	for (var i = 0; i < divide; i++) {
		squares[i] = [];
		for (var j = 0; j < divide; j++) {
			squares[i][j] = {
					leftTop: { // 左上角点坐标
						x: i * length,
						y: j * length
					},
					sideLength: length,
					quadrant: 0 // 象限, 顺时针开始,右上: 1, 右下: 2, 左下: 3, 左上: 4
			};
		}
	}
	return squares;
}


/**
 * 在正方形区域内绘制一个最大的圆
 * 
 * @param areaWidth
 *            区域宽度
 * <br><br>
 * ctx.arc(x, y, r, startAngle, endAngle, counterclockwise)<br>
 * x: 圆心坐标x<br>
 * y: 圆心坐标y<br>
 * r: 圆球半径<br>
 * startAngel: 起始角,以弧度计 三点钟方向是0度 endAngle: 结束角, 以弧度计 counterclockwise: 可选,
 * 顺时针或逆时针绘图, false: 顺时针, true: 逆时针<br>
 */
function drawCircle(areaWidth) {
	ctx.beginPath();
	ctx.arc(areaWidth/2, areaWidth/2 , areaWidth/2, 0, Math.PI*2);
	ctx.stroke();
}

/**
 * 绘制所有的正方形
 * 
 * @param squares
 *            存放所有正方形的数组
 * <br><br>
 * ctx.strokeRect(x, y, width, height)<br>
 * x: 矩形左上角x坐标<br>
 * y: 矩形左上角y坐标<br>
 * width: 矩形宽度, 像素<br>
 * height: 矩形高度, 像素<br>
 */
function drawLines(squares) {
	ctx.beginPath();
	for (var i = 0; i < squares.length; i++) {
		for (var j = 0; j < squares[i].length; j++) {
			var square = squares[i][j];
			ctx.strokeRect(square.leftTop.x, square.leftTop.y, square.sideLength, square.sideLength);
		}
	}
	ctx.stroke();
}
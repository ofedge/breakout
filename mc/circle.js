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
	// 清除区域内所有图形
	ctx.clearRect(0, 0, len, len);
	// 得到正方形数组
	var squares = getSquares(len, divide);
	// 给正方形分组
	groupSquares(squares, len);
	// 画正方形
	drawLines(len, squares);
	// 画圆
	drawCircle(len);
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
					sideLength: length, // 边长
					quadrant: 0 // 位置, 顺时针开始,右上: 1, 右下: 2, 左下: 3, 左上: 4
			};
		}
	}
	return squares;
}

/**
 * 给正方形按照位置数组分组
 * 
 * @param squares
 *            正方形数组
 * @param areaWidth
 *            区域宽度
 */
function groupSquares(squares, areaWidth) {
	var halfWidth = areaWidth / 2; // 区域半边长
	for (var i = 0; i < squares.length; i++) {
		for (var j = 0; j < squares[i].length; j++) {
			var square = squares[i][j];
			if (square.leftTop.x < halfWidth && square.leftTop.y < halfWidth){
				square.quadrant = 1;
				square.rightBottom = {
					x: square.leftTop.x + square.sideLength,
					y: square.leftTop.y + square.sideLength
				}
			} else if (square.leftTop.x >= halfWidth && square.leftTop.x < areaWidth && square.leftTop.y < halfWidth) {
				square.quadrant = 2;
				square.rightTop = {
					x: square.leftTop.x + square.sideLength,
					y: square.leftTop.y
				}
				square.leftBottom = {
					x: square.leftTop.x,
					y: square.leftTop.y + square.sideLength
				}
			} else if (square.leftTop.x >= halfWidth & square.leftTop.x < areaWidth && square.leftTop.y >= halfWidth && square.leftTop.y < areaWidth) {
				square.quadrant = 3;
				square.rightBottom = {
					x: square.leftTop.x + square.sideLength,
					y: square.leftTop.y + square.sideLength
				}
			} else if (square.leftTop.x < halfWidth && square.leftTop.y >= halfWidth && square.leftTop.y < areaWidth) {
				square.quadrant = 4;
				square.rightTop = {
					x: square.leftTop.x + square.sideLength,
					y: square.leftTop.y
				}
				square.leftBottom = {
					x: square.leftTop.x,
					y: square.leftTop.y + square.sideLength
				}
			}
		}
	}
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
 * @param areaWidith
 * 	          区域宽度
 * @param squares
 *            存放所有正方形的数组
 * <br><br>
 * ctx.strokeRect(x, y, width, height)<br>
 * x: 矩形左上角x坐标<br>
 * y: 矩形左上角y坐标<br>
 * width: 矩形宽度, 像素<br>
 * height: 矩形高度, 像素<br>
 */
function drawLines(areaWidth, squares) {
	var radius = areaWidth / 2;
	var center = {x: radius, y: radius};
	ctx.beginPath();
	for (var i = 0; i < squares.length; i++) {
		for (var j = 0; j < squares[i].length; j++) {
			var square = squares[i][j];
			if (square.quadrant == 1) {
				if (calcDistance(square.leftTop, center) >= radius && calcDistance(square.rightBottom, center) <= radius) {
					ctx.fillStyle = '#0000ff';
					ctx.fillRect(square.leftTop.x, square.leftTop.y, square.sideLength, square.sideLength);
				}
			} else if (square.quadrant == 2) {
				if (calcDistance(square.rightTop, center) >= radius && calcDistance(square.leftBottom, center) <= radius) {
					ctx.fillStyle = '#0000ff';
					ctx.fillRect(square.leftTop.x, square.leftTop.y, square.sideLength, square.sideLength);
				}
			} else if (square.quadrant == 3) {
				if (calcDistance(square.rightBottom, center) >= radius && calcDistance(square.leftTop, center) <= radius) {
					ctx.fillStyle = '#0000ff';
					ctx.fillRect(square.leftTop.x, square.leftTop.y, square.sideLength, square.sideLength);
				}
			} else if (square.quadrant == 4) {
				if (calcDistance(square.leftBottom, center) >= radius && calcDistance(square.rightTop, center) <= radius) {
					ctx.fillStyle = '#0000ff';
					ctx.fillRect(square.leftTop.x, square.leftTop.y, square.sideLength, square.sideLength);
				}
			}
			ctx.strokeRect(square.leftTop.x, square.leftTop.y, square.sideLength, square.sideLength);
		}
	}
	ctx.stroke();
}

/**
 * 计算两个点的最短距离
 * 
 * @param a
 *            点a
 * @param b
 *            点b
 */
function calcDistance(a, b) {
	var i = Math.abs(a.x - b.x);
	var j = Math.abs(a.y - b.y);
	return Math.sqrt(i*i + j*j);
}
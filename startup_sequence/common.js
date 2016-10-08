var common = {
    init: function(){
        common.fillHtml();
        common.drawReset();
        common.drawTable();
    },
    fillHtml: function(){
        $('td').append('<img src="huaji.png">');
        for (var i = 0; i < $('img').size(); i++){
            $('img').eq(i).attr('data', i).css('width', '0px');
        }
    },
    drawReset: function(){
        var ctx = document.getElementById('resetCanvas').getContext('2d');
        ctx.clearRect(0, 0, 100, 100);
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fillStyle='#8ac007';
        ctx.fill();
        ctx.fillStyle='#ffffff';
        ctx.font = '30px Consolas';
        ctx.fillText('Reset', 10, 60);
    },
    drawSuccess: function(){
        var ctx = document.getElementById('resetCanvas').getContext('2d');
        ctx.clearRect(0, 0, 100, 100);
        var successImg = new Image();
        successImg.src='huaji.png';
        ctx.drawImage(successImg, 20, 20);
    },
    drawTable: function(){
        var ctx = document.getElementById('myCanvas').getContext('2d');
        ctx.beginPath();
        for(var i = 0; i < 5; i++){
            ctx.moveTo(0, i * 100 + 2);
            ctx.lineTo(400, i* 100 + 2);
        }
        for(var j = 0; j < 5; j++){
            ctx.moveTo(j * 100 + 2, 0);
            ctx.lineTo(j * 100 + 2, 400);
        }
        ctx.closePath();
        ctx.lineWidth=4;
        ctx.strokeStyle = '#8ac007'; 
        ctx.stroke();
    }
}
common.init();
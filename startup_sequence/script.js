var script = {
    init: function(){
        $('#resetCanvas').on('click', function(){
            common.drawReset();
            script.renew();
        }).click();
        $('img').on('click', function(){
            if ($(this).css('width') == '0px')
                return;
            var value = $(this).attr('data');
            var leftValue = parseInt(value) % 5 == 0 ? parseInt(value) + 4 : parseInt(value) - 1; 
            var rightValue = (parseInt(value) + 1) % 5 == 0 ? parseInt(value) - 4 : parseInt(value) + 1;
            var upValue = parseInt(value) - 5;
            var downValue = parseInt(value) + 5;
            console.log('click: ' + value + ', left: ' + leftValue + ', right: ' + rightValue + ', up: ' + script.roundNum(upValue) + ', down: ' + script.roundNum(downValue));
            if (script.check()){
                script.showOrHide(value);
                common.drawSuccess();
            } else {
                script.showOrHide(value);
                script.showOrHide(leftValue);
                script.showOrHide(rightValue);
                script.showOrHide(upValue);
                script.showOrHide(downValue);
            }
        });
    },
    roundNum: function(n){
        if (n >= 0 && n < 25){
            return n;
        } else if (n < 0){
            return script.roundNum(25 + n);
        } else {
            return script.roundNum(n - 25);
        }
    },
    showOrHide: function(n){
        var $this = $('img[data=' + script.roundNum(n) + ']');
        if ($this.css('width') == '64px') {
            $this.animate({width: '0'}, 200);
        } else if ($this.css('width') == '0px') {
            $this.animate({width: '64px'}, 200);
        }
    },
    check: function(){
        for(var i = 0; i < 25; i++){
            if (i == 12){
                if ($('img[data=' + i + ']').css('width') != '64px'){
                    return false;
                }
            } else {
                if ($('img[data=' + i + ']').css('width') != '0px'){
                    return false;
                }
            }
        }
        return true;
    },
    renew: function(){
        for (var i = 0; i < 25; i++){
            $('img[data=' + i + ']').animate({width: '0px'}, 200);
        }
        var showPic = [0, 4, 7, 11, 12, 13, 17, 20, 24];
        for (var j = 0; j < showPic.length; j++){
            $('img[data=' + showPic[j] + ']').animate({width: '64px'}, 200);
        }
    },
    destroy: function(){
        for (var i = 0; i < 25; i++){
            $('img[data=' + i + ']').css('width', '0px');
        }
        common.drawReset();
        $('#resetCanvas').off('click');
        $('img').off('click');
    }
}
script.init();
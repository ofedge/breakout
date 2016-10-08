var addons = {
    init: function(){
        common.drawReset();
        addons.resetSnapshot();
        addons.snapshotToHtml();
    },
    resetSnapshot: function(){
        addons.snapshot = {table:{}, step:[]};
        for(var i = 0; i < 25; i++){
            addons.snapshot.table[i] = false;
        }
        var showPic = [0, 4, 7, 11, 12, 13, 17, 20, 24]
        for(var j = 0; j < showPic.length; j++){
            addons.snapshot.table[showPic[j]] = true;
        }
    },
    snapshotToHtml: function(){
        for(var i = 0; i < 25; i++){
            var $this = $('img[data=' + i + ']');
            if ($this.css('width') == '64px' && !addons.snapshot.table[i]){
                $this.animate({width: '0'}, 200);
            } else if ($this.css('width') == '0px' && addons.snapshot.table[i]){
                $this.animate({width: '64px'}, 200);
            }
        }
    },
    roundNum: function(n){
        if (n >= 0 && n < 25){
            return n;
        } else if (n < 0){
            return addons.roundNum(25 + n);
        } else {
            return addons.roundNum(n - 25);
        }
    },
    check: function(){
        for(var i = 0; i < 25; i++){
            if (i == 12){
                if (!addons.snapshot.table[i]){
                    return false;
                }
            } else {
                if (addons.snapshot.table[i]){
                    return false;
                }
            }
        }
        return true;
    },
    click: function(i){
        if (addons.check()){
            common.drawSuccess();
        } else {
            var left = i % 5 == 0 ? i + 4 : i - 1;
            var right = (i + 1) % 5 == 0 ? i - 4 : i + 1;
            var up = addons.roundNum(i - 5);
            var down = addons.roundNum(i + 5);
            addons.snapshot.table[left] = addons.snapshot.table[left] ? false : true;
            addons.snapshot.table[right] = addons.snapshot.table[right] ? false : true;
            addons.snapshot.table[up] = addons.snapshot.table[up] ? false : true;
            addons.snapshot.table[down] = addons.snapshot.table[down] ? false : true;
        }
        addons.snapshot.table[i] = addons.snapshot.table[i] ? false : true;
        addons.snapshot.step.push(i);
        addons.snapshotToHtml();
    },
    destroy: function(){
        for (var i = 0; i < 25; i++){
            $('img[data=' + i + ']').css('width', '0px');
        }
        common.drawReset();
    },
    display: function(){
        addons.init();
        var order = [0, 24, 4, 20, 7, 17, 11, 13, 1, 23, 5, 19, 12];
        for(var i = 0; i < order.length; i++){
            setTimeout('addons.click(' + order[i] + ')', (i + 1) * 1000);
        }
    }
}
addons.init();
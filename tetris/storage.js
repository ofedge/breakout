function Storage(){
    if(!this.isSupported()){
        console.log('Local storage is not supported!');
    }
    return this;
}
Storage.prototype.isSupported = function() {
    try {
        localStorage.setItem('test', 0);
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}
Storage.prototype.put = function(key, value) {
    if(this.isSupported())
        return localStorage.setItem(key, escape(value));
}
Storage.prototype.get = function(key) {
    if(this.isSupported()){
        var value = localStorage.getItem(key);
        if (value) {
            return unescape(value);
        }
    }
    return '';
}
Storage.prototype.remove = function(key) {
    if(this.isSupported())
        return localStorage.removeItem(key);
}
Storage.prototype.clear = function() {
    if(this.isSupported())
        return localStorage.clear();
}

Object.prototype.clone = function(){
    var newObj = this.constructor === Array ? [] : {};
    for (var i in this) {
        if (typeof this[i] === 'object') {
            newObj[i] = this[i].clone();
        } else {
            newObj[i] = this[i];
        }
    }
    delete this.clone;
    return newObj;
}
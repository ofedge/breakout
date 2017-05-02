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
    if(this.isSupported())
        return unescape(localStorage.getItem(key));
}
Storage.prototype.remove = function(key) {
    if(this.isSupported())
        return localStorage.removeItem(key);
}
Storage.prototype.clear = function() {
    if(this.isSupported())
        return localStorage.clear();
}
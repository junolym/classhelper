CookieManager = {
    cookies : {},
    add : function(cookie, username) {
        this.cookies[cookie] = username;
        setTimeout(function() {
            CookieManager.del(cookie);
        }, 6*60*60*1000); // 6 hours
    },
    check : function(cookie) {
        return !!this.cookies[cookie];
    },
    del : function(cookie) {
        delete this.cookies[cookie];
    },
    getUser : function(cookie) {
        return this.cookies[cookie] || 'ERROR!!';
    }
}

module.exports = CookieManager;
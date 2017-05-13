QrcodeManager = {
    qrcodes : {},
    clock : {},
    add : (thing, config) => {
        if (!thing) {
            throw new Error('Invalid object to add into qrcodes');
        }
        config = config || {};
        config.maxAge = config.maxAge || 60*60*1000;
        config.length = config.length || 4;

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        var key;
        do {
            key = "";
            for (var i = 0; i < config.length; i++) {
                key += chars[Math.floor(Math.random()*chars.length)];
            }
        } while(QrcodeManager.get(key));

        QrcodeManager.qrcodes[key] = thing;
        QrcodeManager.clock[key] = setTimeout(() => {
            QrcodeManager.del(key);
        }, config.maxAge);

        return key;
    },
    del : (key) => {
        delete QrcodeManager.qrcodes[key];
        clearTimeout(clock[key]);
    },
    get : (key) => {
        return QrcodeManager.qrcodes[key];
    }
}

module.exports = QrcodeManager;
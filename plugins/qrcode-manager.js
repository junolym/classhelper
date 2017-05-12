QrcodeManager = {
    qrcodes : {},
    clock : {},
    add : (thing, maxLength, maxAge) => {
        if (!thing) {
            throw new Error('Invalid object to add into qrcodes');
        }
        maxAge = maxAge || 6*60*60*1000;
        maxLength = maxLength || 10;

        var key;
        do {
            key = Math.random().toString(36).substr(2, maxLength);
        } while(QrcodeManager.get(key));

        QrcodeManager.qrcodes[key] = thing;
        QrcodeManager.clock[key] = setTimeout(() => {
            QrcodeManager.del(key);
        }, maxAge);

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
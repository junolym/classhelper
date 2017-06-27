KeyManager = {
    pool : {},
    clock : {},
    add : (thing, config) => {
        if (!thing) {
            throw new Error('Invalid object to add into pool');
        }
        config = config || {};
        config.maxAge = config.maxAge || 60*60*1000;
        config.length = config.length || 4;

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        var key;
        var count = 0;
        do {
            if (++count > 1000) {
                config.length++;
            }
            key = "";
            for (var i = 0; i < config.length; i++) {
                key += chars[Math.floor(Math.random()*chars.length)];
            }
        } while(KeyManager.get(key));

        KeyManager.pool[key] = thing;
        KeyManager.clock[key] = setTimeout(() => {
            KeyManager.del(key);
        }, config.maxAge);

        return key;
    },
    del : (key) => {
        delete KeyManager.pool[key];
        clearTimeout(KeyManager.clock[key]);
    },
    get : (key) => {
        return KeyManager.pool[key];
    }
}

module.exports = KeyManager;
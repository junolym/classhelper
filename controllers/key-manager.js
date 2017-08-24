const nanoid = require('nanoid');

const KeyManager = {
  pool: {},
  lastUsed: {},
  maxAge: {},
  add(thing, { maxAge = 3600, length = 4 } = {}) {
    if (!thing) {
      throw new Error('Invalid object to be added into pool');
    }

    const key = nanoid(length);
    if (this.pool[key]) {
      return this.add(thing, { maxAge, length: length + 1 });
    }

    this.pool[key] = thing;
    this.lastUsed[key] = new Date();
    this.maxAge[key] = maxAge * 1000;

    return key;
  },
  del(key) {
    delete this.pool[key];
    delete this.lastUsed[key];
    delete this.maxAge[key];
  },
  get(key) {
    const obj = this.pool[key];
    this.lastUsed[key] = new Date();
    return obj;
  },
};

setInterval(() => {
  const now = new Date();
  for (const key in KeyManager.pool) {
    if (now - KeyManager.lastUsed[key] > KeyManager.maxAge[key]) {
      KeyManager.del(key);
    }
  }
}, 60 * 1000);

module.exports = KeyManager;

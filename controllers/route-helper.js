const dao = require('../dao/dao.js');

const UserError = dao.UserError;

const checkArgs = (args) => {
  for (const arg in args) {
    if (!args[arg]) {
      return Promise.reject(new UserError(`${arg}不能为空`));
    }
  }
  return Promise.resolve();
};

const checkLogin = req => new Promise((resolve, reject) => {
  if (req.session.user) {
    resolve(req.session.user);
  } else {
    const err = new UserError('请先登录再操作');
    err.needLogin = true;
    reject(err);
  }
});

const catchError = (req, res, next, reload, userError) => (err) => {
  if (err.needLogin) {
    if (reload) {
      res.status(207).send(JSON.stringify({
        reload: '/login',
      }));
    } else {
      res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
    }
  } else if (err.userError && userError) {
    userError(err);
  } else {
    next(err);
  }
};

const jsonOrScript = (res, err, data, callback) => {
  const obj = {
    success: !err,
    data: err ? err.message : data,
  };
  if (callback) {
    res.send(`${callback}(${JSON.stringify(obj)})`);
  } else {
    res.json(obj);
  }
};

const dateConverter = (name = 'time') => (obj) => {
  if (!obj[name]) return;
  const d = new Date(obj[name]);
  obj[name] = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ` +
      `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

const parseStu = (cid, stuJson) => new Promise((resolve, reject) => {
  stuJson = JSON.parse(stuJson);
  const stuMap = new Map();
  for (let i = 0; i < stuJson.length; i++) {
    stuJson[i][0] = parseInt(stuJson[i][0]);
    if (!isNaN(stuJson[i][0]) &&
        stuJson[i][0].toString().length <= 15 &&
        stuJson[i][1].length <= 40) {
      stuMap[stuJson[i][0]] = stuJson[i][1];
    }
  }
  const stuArray = [];
  for (const i in stuMap) {
    stuArray.push([i, stuMap[i]]);
  }
  resolve({ cid, stuArray });
});

module.exports = {
  checkLogin,
  catchError,
  jsonOrScript,
  dateConverter,
  parseStu,
  checkArgs,
};

var cm = require('./cookie-manager');

module.exports = {
    checkCookie : checkCookie,
    catchError : catchError,
    dateConverter : dateConverter,
    parseStu : parseStu
};

function checkCookie(req, res) {
    return new Promise((resolve, reject) => {
        if(req.cookies && cm.check(req.cookies.id)) {
            resolve(cm.getCookie(req.cookies.id));
        } else {
            var err = new Error('请先登录再操作');
            err.needLogin = true;
            reject(err);
        }
    });
}

function catchError(res, next) {
    return function(err) {
        if (err.needLogin) {
            res.render('home/redirect', { location : '/login' });
        } else {
            next(err);
        }
    }
}

function dateConverter(d) {
    d.time = (new Date(d.time)).toLocaleString('zh-CN', { hour12 : false })
        .replace(/[\/|-]/, '年').replace(/[\/|-]/, '月').replace(/ /, '日 ');
}

function parseStu(cid, stuJson) {
    return new Promise((resolve, reject) => {
        stuJson = JSON.parse(stuJson);
        var stuMap = {};
        var stuArray = [];
        for (var i = 0; i < stuJson.length; i++) {
            stuJson[i][0] = parseInt(stuJson[i][0]);
            if (!isNaN(stuJson[i][0])
                && stuJson[i][0].toString().length <= 15
                && stuJson[i][1].length <= 40) {
                stuMap[stuJson[i][0]] = stuJson[i][1];
            }
        }
        for (var i in stuMap) {
            stuArray.push([i, stuMap[i]]);
        }
        resolve({ cid : cid, stuArray : stuArray });
    });
}

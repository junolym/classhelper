module.exports = {
    checkLogin : checkLogin,
    catchError : catchError,
    dateConverter : dateConverter,
    parseStu : parseStu
};

function checkLogin(req, res) {
    return new Promise((resolve, reject) => {
        if (req.session.user) {
            resolve(req.session.user);
        } else {
            var err = new Error('请先登录再操作');
            err.needLogin = true;
            reject(err);
        }
    });
}

function catchError(req, res, next, reload, userError) {
    return function(err) {
        if (err.needLogin) {
            if (reload) {
                res.status(207).send(JSON.stringify({
                    reload: '/login'
                }));
            } else {
                res.redirect('/login?next='+encodeURIComponent(req.originalUrl));
            }
        } else if (err.userError && userError) {
            userError(err);
        } else {
            next(err);
        }
    }
}

function dateConverter(name) {
    name = name || 'time';
    return (obj) => {
        if (!obj[name]) return;
        var d = new Date(obj[name]);
        obj[name] = d.getFullYear() + '年' + d.getMonth() + '月' +  d.getDate() + '日 '
            + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };
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

String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        str = str.replace('{}', arguments[i]);
    }
    return str;
}
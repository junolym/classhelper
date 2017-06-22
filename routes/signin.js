var express = require('express');
var router = express.Router();
var qrcode = require('../controllers/qrcode-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../controllers/route-helper.js');
var str = helper.stringFormat;

router.get('/create', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.addsign(req.query.cid);
    }).then((result) => {
        var key = qrcode.add({ cid: req.query.cid, sid: result });
        res.redirect('/qrcode#/s?k={}'.format(key));
    }).catch(helper.catchError(req, res, next, false, (err) => {
        res.redirect('/result?msg=请求试卷失败&err={}'.format(err.message));
    }));
});

router.get('/showqrcode', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid);
    }).then(() => {
        var key = qrcode.add({ cid: req.query.cid, sid: req.query.sid });
        res.redirect('/qrcode#/s?k={}'.format(key));
    }).catch(helper.catchError(req, res, next, false));
});

router.get('/detail', (req, res, next) => {
    var data = {
        cid : req.query.cid,
        course_name : '',
        sid : req.query.sid
    }
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        data.course_name = result.course_name;
        return dao.getsignbyid(req.query.sid)
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        result.forEach(helper.dateConverter());
        data.signindetail = result;
        res.render('home/signindetail', data);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/delete', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.delsign(req.query.sid);
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#signin',
            notify: ['本次签到已删除', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/deletesign', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checksign(user, req.query.cid, req.query.sid)
    }).then(() => {
        return dao.delstusign(req.query.sid, req.query.stu);
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#signin/detail?cid={}&sid={}'.format(req.query.cid, req.query.sid),
            notify: ['学生签到记录已删除', 'danger']
        }));
    }).catch(helper.catchError(req, res, next, true, err => {
        res.status(207).send(JSON.stringify({
            reload: '#signin/detail?cid={}&sid={}'.format(req.query.cid, req.query.sid),
            notify: ['删除失败', 'danger']
        }));
    }));
});

module.exports = router;

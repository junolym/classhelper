var express = require('express');
var router = express.Router();
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');
var qrcode = require('../plugins/qrcode-manager.js');
var examManager = require('../plugins/exam-manager.js');

router.get('/create', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        res.render('home/coursedetail', { title: '添加课程' });
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/create', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.addcourse(user, req.body.form_coursename, req.body.form_coursetime, req.body.form_courseinfo);
    }).then((cid) => {
        return helper.parseStu(cid, req.body.students);
    }).then((result) => {
        if (result.stuArray.length) {
            return dao.addstutocourse(result.cid, result.stuArray);
        }
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#course',
            notify: ['课程添加成功', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});

router.post('/edit', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.updatecourse(req.query.cid, req.body.form_coursename,
            req.body.form_coursetime, req.body.form_courseinfo);
    }).then(() => {
        return dao.delstuofcourse(req.query.cid);
    }).then(() => {
        return helper.parseStu(req.query.cid, req.body.students);
    }).then((result) => {
        if (result.stuArray.length) {
            return dao.addstutocourse(result.cid, result.stuArray);
        }
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#course',
            notify: ['课程修改成功', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/delete', (req, res, next) => {
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.delcourse(req.query.cid);
    }).then(() => {
        res.status(207).send(JSON.stringify({
            reload: '#course',
            notify: ['课程已删除', 'success']
        }));
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/edit', (req, res, next) => {
    var coursedetail = {};
    helper.checkLogin(req).then((user) => {
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        coursedetail = JSON.parse(JSON.stringify(result))[0];
        coursedetail.course_id = req.query.cid;
        return dao.getstubycourse(req.query.cid);
    }).then((result) => {
        coursedetail.students = JSON.parse(JSON.stringify(result));
        res.render('home/coursedetail', coursedetail);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/detail', (req, res, next) => {
    var data = {
        onlystu : req.query.only == 'stu',
        cid : req.query.cid,
        course_name : ''
    };
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        data.course_name = result.course_name;
        return dao.statssignbycourse(req.query.cid);
    }).then((result) => {
        data.students = JSON.parse(JSON.stringify(result));
        return dao.statsexambycourse(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        for (var i = 0; i < data.students.length || i < result.length; i++) {
            data.students[i] = data.students[i] || {};
            Object.assign(data.students[i], result[i]);
        }
        return dao.getsignbycourse(req.query.cid);
    }).then((result) => {
        data.signins = JSON.parse(JSON.stringify(result)).slice(0,3);
        data.signins.forEach(helper.dateConverter());
        return dao.getexambycourse(req.query.cid);
    }).then((result) => {
        data.exams = JSON.parse(JSON.stringify(result)).slice(0,3);
        res.render('home/courseinfo', data);
    }).catch(helper.catchError(req, res, next, true));
});

router.get('/student', (req, res, next) => {
    var data = {
        cid : req.query.cid,
        course_name : '',
        stu_id : req.query.stu,
        stu_name : '',
        sign_total : 0,
        sign_num : 0,
        exam_total: 0,
        exam_num : 0,
        sum_score : 0
    };
    helper.checkLogin(req).then((user) => {
        Object.assign(data, req.session);
        return dao.checkcourse(user, req.query.cid);
    }).then(() => {
        return dao.getcoursebyid(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        data.course_name = result.course_name;
        return dao.getstubycourse(req.query.cid);
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        for (var i in result) {
            if (result[i].id==data.stu_id) {
                data.stu_name = result[i].name;
                break;
            }
        }
        return dao.statssigndetail(req.query.cid, req.query.stu);
    }).then((result) => {
        data.signins = JSON.parse(JSON.stringify(result));
        data.sign_total = data.signins.length;
        data.signins.forEach(s => {
            if (s.stu_time) data.sign_num++;
            helper.dateConverter()(s);
            helper.dateConverter('stu_time')(s);
        });
        return dao.statsexamdetail(req.query.cid, req.query.stu);
    }).then((result) => {
        data.exams = JSON.parse(JSON.stringify(result));
        data.exam_total = data.exams.length;
        data.exams.forEach(e => {
            if (e.time) data.exam_num++;
            data.sum_score += e.score || 0;
            helper.dateConverter()(e);
        });
        res.render('home/studetail', data);
    }).catch(helper.catchError(req, res, next, true));
});


module.exports = router;

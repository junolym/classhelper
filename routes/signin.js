const express = require('express');
const qrcode = require('../controllers/key-manager.js');
const dao = require('../dao/dao-promise.js');
const helper = require('../controllers/route-helper.js');

const router = express.Router();

router.get('/create', async (req, res, next) => {
  try {
    const {cid} = req.query;
    const user = await helper.checkLogin(req);
    await dao.checkCourse(user, cid);
    const sid = await dao.addSign(cid);
    const key = qrcode.add({cid, sid});
    res.redirect(`/qrcode#/s?k=${key}`);
  } catch(err) {
    next(err);
  }
});

router.get('/showqrcode', async (req, res, next) => {
  try {
    const {cid, sid} = req.query;
    const user = await helper.checkLogin(req);
    await dao.checkSign(user, cid, sid);
    const key = qrcode.add({cid, sid});
    res.redirect(`/qrcode#/s?k=${key}`);
  } catch(err) {
    next(err);
  }
});

router.get('/detail', async (req, res, next) => {
  try {
    const {cid, sid} = req.query;
    const user = await helper.checkLogin(req);
    await dao.checkSign(user, cid, sid);
    const course = await dao.getCourseById(cid);
    const signindetail = await dao.getSignById(sid);
    signindetail.forEach(helper.dateConverter());
    const data = {cid, sid, ...req.session, ...course, signindetail};
    res.render('home/signindetail', data);
  } catch(err) {
    next(err);
  }
});

router.get('/delete', async (req, res, next) => {
  try {
    const {cid, sid} = req.query;
    const user = await helper.checkLogin(req);
    await dao.checkSign(user, cid, sid);
    await dao.delSign(sid);
    res.status(207).send(JSON.stringify({
      reload: '#signin',
      notify: ['本次签到已删除', 'success']
    }));
  } catch(err) {
    next(err);
  }
});

router.get('/deletesign', async (req, res, next) => {
  try {
    const {cid, sid, stu} = req.query;
    const user = await helper.checkLogin(req);
    await dao.checkSign(user, cid, sid);
    await dao.delStudentSign(sid, stu);
    res.status(207).send(JSON.stringify({
      reload: `#signin/detail?cid=${cid}&sid=${sid}`,
      notify: ['学生签到记录已删除', 'danger'],
    }));
  } catch(err) {
    next(err);
  }
});

module.exports = router;

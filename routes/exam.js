var express = require('express');
var router = express.Router();
var qrcode = require('../plugins/qrcode-manager.js');
var dao = require('../dao/dao.js');
var helper = require('../plugins/route-helper.js');

router.get('/', (req, res, next) => {
    if (req.query.k) {
        dao.getexambyid(qrcode.get(req.query.k).eid)
	    .then((result) => {
	        result = JSON.parse(JSON.stringify(result));
        	result.forEach(helper.dateConverter);
        	var test = JSON.parse(result[0]['exam_question']);
        	var question = [{}];
        	for (var j in test) {
        		if (test[j][1] == 0) {
        			var sels =  test[j][3];
		        	for (var i in sels) {
		        		sels[i] = {selection : sels[i]};
		        	}
        			question[j] = {question_selection:true,
        						question_detail: test[j][2],
        						selection:sels};
        		}
        		else if (test[j][1] == 1) {
        			question[j] = {question_judgeanswer:true,
        						question_detail: test[j][2]};
        		}
        		else if (test[j][1] == 2) {
        			question[j] = {question_detail: test[j][2]};
        		}
        	}
        	res.render('exam', { title : '测试', exam_name: result[0]['exam_name'], question: question});
	    }).catch((err) => {
	        if (err.userError) {
	            res.redirect('/result?msg=测试失败&err=' + err.message);
	        } else {
	            res.render('error', { error: err });
	        }
	    });
    } else {
        res.render('exam', { title : '测试' });
    }
});

router.post('/', (req, res, next) => {
    res.send(JSON.stringify(req.body));
});

module.exports = router;
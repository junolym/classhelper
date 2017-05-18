var dao = require('../dao/dao.js');

ExamManager = {
    exams : {},
    /*
    // Data Structure
    eid : {
        cid : 1,
        examname : name,
        exam : [
            {
                type : 0,
                description : description,
                standardAnswer : { // A & C
                    0: 1,
                    2: 1
                },
                selectionSet : [selection, selection, selection]
            }, {
                type : 1,
                description : description,
                standardAnswer : 0, // false
                selectionSet : []
            }, {
                type : 2,
                description : description,
                standardAnswer : answer, // answer string
                selectionSet : []
            }
        ],
        answers : {
            stuId : {
                questionNumber : {
                    answer : answer,
                    grade : number
                }
            }
        },
        statistics : {
            questionNumber : {
                count : {
                    answer : number
                }
                averageGrade : number,
            }
        },
        examWithAnswer : [],
        lastused : Date
    }
    */
    createExam : (cid, examname, exam) => {
        var exam_question = JSON.stringify(exam);
        return dao.addexam(cid, examname, exam_question).then((eid) => {
            ExamManager.exams[eid] = {
                cid : cid,
                examname : examname,
                exam : exam,
                examWithAnswer : JSON.parse(exam_question),
                lastused : new Date()
            }
            ExamManager.resolveExam(eid);
        })
    },
    getExam : (eid) => {
        if (ExamManager.exams[eid]) {
            // update last used
            ExamManager.exams[eid].lastused = new Date();
            return new Promise((resolve) => {
                resolve(ExamManager.exams[eid]);
            });
        }
        return dao.getexambyid(eid).then((result) => {
            result = JSON.parse(JSON.stringify(result))[0];
            ExamManager.exams[eid] = {
                cid : result.ex_coz_id,
                examname : result.exam_name,
                exam : JSON.parse(result.exam_question),
                examWithAnswer : JSON.parse(result.exam_question),
                lastused : new Date()
            };
            ExamManager.resolveExam(eid);
            return new Promise((resolve) => {
                resolve(ExamManager.exams[eid]);
            });
        });
    },
    // Add data for rendering exam page
    resolveExam : (eid) => {
        var exam = ExamManager.exams[eid];
        var types = ['question_selection', 'question_judgeanswer', 'question_detail'];
        var judgeAnswers = ['answer_wrong', 'answer_right'];
        exam.exam.forEach((e) => {
            e[types[e.type]] = true;
        });
        exam.examWithAnswer.forEach((e) => {
            e[types[e.type]] = true;
            if (e.question_selection) {
                e.answer = [];
                for (var i in e.standardAnswer) {
                    e.answer[i] = 'checked';
                }
                console.log(e);
            } else if (e.question_judgeanswer) {
                e[judgeAnswers[e.standardAnswer]] = 'checked';
            } else {
                e.answer = e.standardAnswer;
            }
        });
    },
    deleteExam : (eid) => {
        delete ExamManager.exams[eid];
        return dao.delexam(req.query.eid);
    },
    addStuAnswer : (eid, stuId, answers) => {
        console.log('answer added: %s', JSON.stringify(answer));
        ExamManager.exams[eid].answers[stuId] = answers;
    },
    getStuAnswer : (eid, stuId) => {
        console.log('answer returned: %s', JSON.stringify(ExamManager.exams[eid].answers[stuId]));
        return ExamManager.exams[eid].answers[stuId];
    },
    getStatistics : (eid) => {
        console.log('statistics returned: %s', JSON.stringify(ExamManager.exams[eid].statistics));
        return ExamManager.exams[eid].statistics;
    }
}

// check (per hour) and clear useless exam ( > 3 hours )
setInterval(() => {
    var now = new Date();
    for (var i in ExamManager.exams) {
        var lastused = ExamManager.exams[i].lastused;
        if (now - lastused > 1000*60*60*3) { // 3 hours
            delete ExamManager.exams[i];
        }
    }
}, 1000*60*60);

module.exports = ExamManager;
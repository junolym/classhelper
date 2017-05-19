var dao = require('../dao/dao.js');
var UserError = dao.UserError;
var helper = require('./route-helper.js');

ExamManager = {
    exams : {},
    /*
    // Data Structure
    eid : {
        cid : 1,
        examname : name,
        questions : [
            {
                type : 0,
                description : description,
                standardAnswer : [0, 2], // A & C
                selectionSet : [selection, selection, selection]
            }, {
                type : 1,
                description : description,
                standardAnswer : 0, // false
                selectionSet : []
            }, {
                type : 2,
                description : description,
                standardAnswer : string,
                selectionSet : []
            }
        ],
        answers : {
            stuId : {
                name : string,
                score : number,
                time : Date,
                questionNumber : {
                    answer : answer,
                    grade : number
                }
            }
        },
        statistics : [
            {
                count : [number, number, number],
                right: number,
                wrong: number
            }
        ],
        questionsWithAnswer : [],
        lastused : Date
    }
    */
    createExam : (cid, examname, questions) => {
        var exam_question = JSON.stringify(questions);
        return dao.addexam(cid, examname, exam_question).then((eid) => {
            var exam = {
                cid : cid,
                examname : examname,
                questions : questions,
                questionsWithAnswer : JSON.parse(exam_question),
                lastused : new Date(),
                answers : {},
                statistics : []
            }
            ExamManager.exams[eid] = exam;
            ExamManager.resolveExam(exam);
        })
    },
    getExam : (eid) => {
        if (ExamManager.exams[eid]) {
            ExamManager.exams[eid].lastused = new Date();
            return Promise.resolve(ExamManager.exams[eid]);
        }
        return dao.getexambyid(eid).then((result) => {
            result = JSON.parse(JSON.stringify(result))[0];
            var exam = {
                cid : result.ex_coz_id,
                examname : result.exam_name,
                questions : JSON.parse(result.exam_question),
                questionsWithAnswer : JSON.parse(result.exam_question),
                lastused : new Date(),
                answers : {},
                statistics : []
            };
            ExamManager.resolveExam(exam);
            ExamManager.exams[eid] = exam;
            return new Promise((resolve) => {
                resolve(exam);
            });
        });
    },
    // Add data for rendering exam page
    resolveExam : (exam) => {
        var types = ['question_selection', 'question_judgeanswer', 'question_detail'];
        var judgeAnswers = ['answer_wrong', 'answer_right'];
        exam.questions.forEach((e, index) => {
            e[types[e.type]] = true;
            if (e.type < 2) {
                exam.statistics[index] = {};
                exam.statistics[index].right = 0;
                exam.statistics[index].wrong = 0;
                exam.statistics[index].count = [];
            }
            if (e.question_selection) {
                e.label = [];
                e.selectionSet.forEach((s, i) => {
                    e.label[i] = String.fromCharCode(65 + i);
                    exam.statistics[index].count[i] = 0;
                });
            }
        });
        exam.questionsWithAnswer.forEach((e, index) => {
            e[types[e.type]] = true;
            e.id = index;
            if (e.question_selection) {
                e.label = [];
                e.selectionSet.forEach((s, i) => {
                    e.label[i] = String.fromCharCode(65 + i);
                });
                e.answer = [];
                e.standardAnswer.forEach((a) => {
                    e.answer[a] = 'checked';
                });
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
    addStuAnswer : (eid, answer) => {
        return ExamManager.getExam(eid).then((exam) => {
            return dao.checkstudent(answer.studentid, exam.cid, answer.name);
        }).then(() => {
            answer.time = new Date();
            helper.dateConverter(answer);
            ExamManager.resolveAnswer(ExamManager.exams[eid], answer);
            ExamManager.exams[eid].answers[answer.studentid] = answer;
            return dao.addanswer(eid, answer.studentid, answer.name,
                answer.score, JSON.stringify(answer));
        });
    },
    resolveAnswer : (exam, answer) => {
        answer.score = 100;
        var right = 0, wrong = 0;
        exam.questions.forEach((q, i) => {
            if (q.type < 2) {
                if (q.standardAnswer.toString() == answer[i].toString()) {
                    right++;
                    exam.statistics[i].right++;
                } else {
                    wrong++;
                    exam.statistics[i].wrong++;
                }
                if (q.type == 0) {
                    answer[i].forEach((a) => {
                        exam.statistics[i].count[a]++;
                    })
                } else {
                    exam.statistics[i].count[answer[i]]++;
                }
            }
        });
        if (right + wrong > 0) {
            answer.score = 100 * right / (right + wrong);
            answer.score = Math.round(answer.score * 2) / 2;
        }
    },
    getStuAnswer : (eid, stuId) => {
        console.log('answer returned: %s', JSON.stringify(ExamManager.exams[eid].answers[stuId]));
        return ExamManager.exams[eid].answers[stuId];
    },
    getAnswers : (eid) => {
        return ExamManager.getExam(eid).then((exam) => {
            var ans = exam.answers;
            return Promise.resolve(Object.keys(ans).map(key => ans[key]));
        });
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
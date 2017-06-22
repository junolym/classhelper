var dao = require('../dao/dao.js');
var UserError = dao.UserError;
var helper = require('./route-helper.js');

ExamManager = {
    exams : {},
    /*
    // Data Structure
    eid : {
        cid : 1,
        eid : 26,
        examname : name,
        questions : [
            {
                idplus1 : 1,
                type : 0,
                description : description,
                standardAnswer : [0, 2], // A & C
                selectionSet : [selection, selection, selection]
            }, {
                idplus1 : 2,
                type : 1,
                description : description,
                standardAnswer : 0, // false
                selectionSet : []
            }, {
                idplus1 : 3,
                type : 2,
                description : description,
                standardAnswer : string,
                selectionSet : []
            }
        ],
        answers : {
            stuId : {
                studentid : stuId,
                name : string,
                score : number,
                time : Date,
                questionNumber : {
                    answer : answer,
                    grade : number
                }
            }
        },
        statistics : {
            questions: [
                {
                    count : [number, number, number],
                    right: number,
                    wrong: number
                }
            ],
            studentnum: number,
            answernum: number,
            maxscore: number,
            minscore: number,
            avescore: number,
            sumscore: number
        },
        questionsWithAnswer : [],
        lastused : Date
    }
    */
    createExam : createExam,
    editExam : editExam,
    getExam : getExam,
    resolveExam : resolveExam,
    initExam : initExam,
    deleteExam : deleteExam,
    addStuAnswer : addStuAnswer,
    resolveAnswer : resolveAnswer,
    getStuAnswer : getStuAnswer,
    getAnswers : getAnswers
}

function createExam(cid, examname, questions) {
    var exam_question = JSON.stringify(questions);
    var exam = {
        cid : cid,
        examname : examname,
        questions : questions,
        questionsWithAnswer : JSON.parse(exam_question),
        lastused : new Date(),
        answers : {},
        statistics : {},
        staJSON: '{}'
    }
    ExamManager.initExam(exam);
    return dao.getcoursebyid(cid).then((res) => {
        res = JSON.parse(JSON.stringify(res));
        exam.statistics.studentnum = res[0].student_num;
        return dao.addexam(cid, examname, exam_question);
    }).then((eid) => {
        exam.eid = eid;
        ExamManager.exams[eid] = exam;
        ExamManager.resolveExam(exam);
        return dao.updatestatistics(eid, JSON.stringify(exam.statistics));
    });
}
function editExam(eid, examname, questions) {
    var exam_question = JSON.stringify(questions);
    return ExamManager.getExam(eid).then(exam => {
        exam.examname = examname;
        exam.questions = questions;
        exam.questionsWithAnswer = JSON.parse(exam_question);
        ExamManager.resolveExam(exam);
        return dao.updateexam(eid, examname, exam_question);
    });
}
function getExam(eid) {
    if (ExamManager.exams[eid]) {
        ExamManager.exams[eid].lastused = new Date();
        return Promise.resolve(ExamManager.exams[eid]);
    }
    return dao.getexambyid(eid).then(result => {
        result = JSON.parse(JSON.stringify(result))[0];
        var exam = {
            cid : result.ex_coz_id,
            eid : eid,
            examname : result.exam_name,
            questions : JSON.parse(result.exam_question),
            questionsWithAnswer : JSON.parse(result.exam_question),
            lastused : new Date(),
            answers : {},
            statistics : JSON.parse(result.exam_statistics),
            staJSON: result.exam_statistics
        };
        ExamManager.resolveExam(exam);
        ExamManager.exams[eid] = exam;
        return dao.getanswerbyexam(eid);
    }).then(result => {
        result = JSON.parse(JSON.stringify(result));
        result.forEach((r) => {
            var ans = ExamManager.exams[eid].answers;
            ans[r.student_id] = JSON.parse(r.answer);
        });
        return Promise.resolve(ExamManager.exams[eid]);
    });
}
function initExam (exam) {
    var st = exam.statistics;
    st.questions = [];
    st.answernum = 0;
    st.sumscore = 0;
    exam.questions.forEach((e, index) => {
        if (e.type < 2) {
            st.questions[index] = {};
            st.questions[index].type = e.type;
            st.questions[index].right = 0;
            st.questions[index].wrong = 0;
            st.questions[index].count = [0, 0];
            e.selectionSet.forEach((s, i) => {
                st.questions[index].count[i] = 0;
            });
        }
    });
}
// Add data for rendering exam page
function resolveExam(exam) {
    var types = ['question_selection', 'question_judgeanswer', 'question_detail'];
    exam.questions.forEach((e, index) => {
        e[types[e.type]] = true;
        if (e.question_selection) {
            e.label = [];
            e.selectionSet.forEach((s, i) => {
                e.label[i] = String.fromCharCode(65 + i);
            });
        }
    });
    exam.questionsWithAnswer.forEach((e, index) => {
        e[types[e.type]] = true;
        e.idplus1 = index+1;
        e.answer = [];
        if (e.question_selection) {
            e.label = [];
            e.selectionSet.forEach((s, i) => {
                e.label[i] = String.fromCharCode(65 + i);
            });
            e.standardAnswer.forEach((a) => {
                e.answer[a] = 'checked';
            });
        } else if (e.question_judgeanswer) {
            e.answer[e.standardAnswer] = 'checked';
        } else {
            e.answer = e.standardAnswer;
        }
    });
}
function deleteExam(eid) {
    delete ExamManager.exams[eid];
    return dao.delexam(eid);
}
function addStuAnswer(eid, answer) {
    var exam;
    return ExamManager.getExam(eid).then(result => {
        exam = result;
        return dao.checkstudent(answer.studentid, exam.cid, answer.name);
    }).then(() => {
        if (exam.answers[answer.studentid]) {
            return Promise.reject(new UserError('请勿重复交卷'));
        }
        answer.time = new Date();
        helper.dateConverter()(answer);
        ExamManager.resolveAnswer(exam, answer);
        exam.answers[answer.studentid] = answer;
        return dao.addanswer(eid, answer.studentid, answer.name,
            answer.score, JSON.stringify(answer));
    }).then(() => {
        return dao.updatestatistics(eid, JSON.stringify(exam.statistics));
    });
}
function resolveAnswer(exam, answer) {
    var st = exam.statistics;
    answer.score = 100;
    var right = 0, wrong = 0;
    exam.questions.forEach((q, i) => { // 第i题，问题是q，回答是answer[i]
        if (!answer[i]) {
            wrong++;
            st.questions[i].wrong++;
            return;
        }
        if (q.type < 2) {
            if (q.standardAnswer.toString() == answer[i].toString()) {
                right++;
                st.questions[i].right++;
            } else {
                wrong++;
                st.questions[i].wrong++;
            }
            if (answer[i].length > 1) { // 回答是多选，每个选项是a
                answer[i].forEach((a) => {
                    st.questions[i].count[a]++;
                })
            } else {
                st.questions[i].count[answer[i]]++;
            }
        }
    });
    if (right + wrong > 0) {
        answer.score = 100 * right / (right + wrong);
        answer.score = Math.round(answer.score * 2) / 2;
    }
    st.answernum++;
    st.sumscore += answer.score;
    if (st.answernum > 1) {
        st.maxscore = Math.max(st.maxscore, answer.score);
        st.minscore = Math.min(st.minscore, answer.score);
        st.avescore = Math.round(st.sumscore * 2 / st.answernum) / 2;
    } else {
        st.maxscore = st.minscore = st.avescore = answer.score;
    }
    exam.staJSON = JSON.stringify(st);
}
function getStuAnswer(eid, stuId) {
    return ExamManager.getExam(eid).then(exam => {
        if (!exam.answers[stuId]) {
            return Promise.reject(new UserError('无该学生答卷'));
        }
        var ans = exam.answers[stuId];
        var paper = JSON.parse(JSON.stringify(exam.questions));
        paper.forEach((e, i) => {
            if (e.type == 2) {
                e.answer = ans[i];
            } else {
                e.answer = [];
                if (ans[i] && ans[i].length > 1) {
                    ans[i].forEach((a) => {
                        e.answer[a] = 'checked';
                    });
                } else {
                    e.answer[ans[i]] = 'checked';
                }
            }
        });
        return Promise.resolve({ cid: exam.cid, eid: eid,
            studentid: stuId, name: ans.name, score: ans.score,
            examname: exam.examname, paper: paper});
    });
}
function getAnswers(eid) {
    return ExamManager.getExam(eid).then(exam => {
        var ans = exam.answers;
        return Promise.resolve(Object.keys(ans).map(key => ans[key]));
    });
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

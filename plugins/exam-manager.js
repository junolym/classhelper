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
        }
    }
    */
    createExam : (cid, examname, exam) => {
        return dao.addexam(cid, examname, JSON.stringify(exam)).then((eid) => {
            ExamManager.exams[eid] = {
                cid : cid,
                examname : examname,
                exam : exam
            }
            console.log('exam created: %s', JSON.stringify(exam));
        });
    },
    getExam : (eid) => {
        if (ExamManager.exams[eid]) {
            return new Promise((resolve) => {
                resolve(ExamManager.exams[eid]);
            });
        }
        return dao.getexambyid(eid).then((result) => {
            result = JSON.parse(JSON.stringify(result))[0];
            ExamManager.exams[eid] = {
                cid : result.ex_coz_id,
                examname : result.exam_name,
                exam : JSON.parse(result.exam_question)
            };
            return new Promise((resolve) => {
                resolve(ExamManager.exams[eid]);
            });
        });
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

module.exports = ExamManager;
var dao = require('../dao/dao.js');

function num2char(n) {
    var c = '';
    do {
        c = String.fromCharCode(--n % 26 + 65) + c;
    } while(n = Math.floor(n / 26) > 0);
    return c;
}

// 将最后的wookbook传给前端，前端使用XLSX和writeas即可导出excel
function exportall(course_id) {
    var signsheet = {};
    var examsheet = {};
    var student = {}; // id, name
    var sign = {};
    var exam = {};

    var p1 = dao.getstubycourse(course_id).then(result => {
        for (var i = 0; i < result.length; i++) {
            student[result[i].id] =  i + 2;
            signsheet['A' + (i+2)] = {v: result[i].id};
            signsheet['B' + (i+2)] = {v: result[i].name};
            examsheet['A' + (i+2)] = {v: result[i].id};
            examsheet['B' + (i+2)] = {v: result[i].name};
        }
        student['length'] = result.length;
        return Promise.resolve();
    });

    var p2 = dao.getsignbycourse(course_id).then(result => {
        for (var i = 0; i < result.length; ++i) {
            sign[result[i].sign_id] = num2char(result.length - i + 2);
            signsheet[num2char(result.length-i+2) + 1] = {v: result[i].time};
        }
        sign['length'] = result.length;
        return Promise.resolve();
    });

    var p3 = dao.getexambycourse(course_id).then(result => {
        for (var i = 0; i < result.length; ++i) {
            exam[result[i].exam_id] = num2char(i + 3);
            examsheet[num2char(i + 3) + 1] = {v: result[i].exam_name}
        }
        exam['length'] = result.length;
        return Promise.resolve();
    });

    return Promise.all([p1, p2, p3]).then(result => {
        var p4 = dao.getallsignbycourse(course_id).then(result => {
            for (i in result) {
                var t = result[i];
                if (t.sign == null) {
                    signsheet[sign[t.sign_id] + student[t.stu_id]] = {v: 'X'};
                }
            }
            return Promise.resolve();
        });
        var p5 = dao.getallexambycourse(course_id).then(result => {
            for (i in result) {
                var t = result[i];
                if (t.score == null) {
                    t.score = 0;
                }
                examsheet[exam[t.exam_id] + student[t.stu_id]] = {'v': t.score, 't': 'n'};
            }
            return Promise.resolve();
        });
        return Promise.all([p4, p5]);
    }).then(result => {
        var signcol = [
            {wch:10},
            {wch:10}
        ]
        for (var i = 0; i < sign.length; ++i) {
            signcol.push({wch: 20});
        }
        signcol.push({wch: 10});

        var examcol = [
            {wch:10},
            {wch:10}
        ]
        for (var i = 0; i < exam.length; ++i) {
            examcol.push({wch: 10});
        }
        examcol.push({wch: 10});

        signsheet['!ref'] = "A1:" + num2char(sign.length+3) + (student.length+2);
        signsheet['!cols'] = signcol;

        signsheet['A1'] = {v: '学号'};
        signsheet['B1'] = {v: '姓名'};
        signsheet['B'+(student.length+2)] = {v: '统计'}
        signsheet[num2char(sign.length+3)+1] = {v: '统计'}

        examsheet['!ref'] = "A1:" + num2char(exam.length+3) + (student.length+2);
        examsheet['!cols'] = examcol;
        examsheet['A1'] = {v: '学号'};
        examsheet['B1'] = {v: '姓名'};
        examsheet['B'+(student.length+2)] = {v: '平均分'}
        examsheet[num2char(exam.length+3)+1] = {v: '平均分'}
        // 按次统计
        for (var i = 0; i < sign.length; ++i) {
            signsheet[num2char(i+3)+(student.length+2)] = {
                f: 'COUNTBLANK(' + num2char(i+3) + '2:' + num2char(i+3) + (student.length+1) + ')'
            }
        }

        for (var i = 0; i <exam.length; ++i) {
            examsheet[num2char(i+3)+(student.length+2)] = {
                f: 'AVERAGE(' + num2char(i+3) + '2:' + num2char(i+3) + (student.length+1) + ')'
            }
        }

        // 按学生统计
        for (var i = 0; i < student.length; ++i) {
            signsheet[num2char(sign.length+3)+(i+2)] = {
                f: 'COUNTBLANK(C' +(i+2) + ':' + num2char(sign.length+2) + (i+2) + ')'
            }
        }

        for (var i = 0; i < student.length; ++i) {
            examsheet[num2char(exam.length+3)+(i+2)] = {
                f: 'AVERAGE(C' +(i+2) + ':' + num2char(exam.length+2) + (i+2) + ')'
            }
        }

        var workbook = {
            SheetNames: ['签到情况', '测验情况'],
            Sheets: {
                '签到情况' : signsheet,
                '测验情况' : examsheet
            }
        }
        return Promise.resolve(workbook);
    });
}

module.exports = exportall;

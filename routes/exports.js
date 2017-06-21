var dao = require(../dao/dao.js);

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
            signsheet[num2char(result.length - i + 2) + 1] = {v: result[i].time};
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

    Promise.all([p1, p2, p3]).then(result => {
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
                examsheet[exam[t.exam_id] + student[t.stu_id]] = {v: t.score};
            }
            return Promise.resolve();
        });
        return Promise.all([p4, p5]);
    }).then(result => {
        signsheet['!ref'] = "A1:" + num2char(sign.length + 2) + (student.length+2);
        signsheet['A1'] = {v: '学号'};
        signsheet['B1'] = {v: '姓名'};
        examsheet['!ref'] = "A1:" + num2char(exam.length + 2) + (student.length+2);
        examsheet['A1'] = {v: '学号'};
        examsheet['B1'] = {v: '姓名'};
        var workbook = {
            SheetNames: ['签到情况', '测验情况'],
            Sheets: {
                '签到情况' : signsheet,
                '测验情况' : examsheet
            }
        }
    });
}

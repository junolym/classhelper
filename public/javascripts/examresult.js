var bgColors = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
];
function updateCanvas(statistics) {
    if (!statistics.questions) {
        return;
    }
    var qs = [], data = [], bg = [];
    statistics.questions.forEach((q, i) => {
        qs.push(i+1);
        var rightrate = Math.round(100*q.right/statistics.answernum)/100;
        data.push(rightrate);
        bg.push(bgColors[i%6]);
        var cbg = [], lb = [];
        q.count.forEach((c, ii) => {
            cbg.push(bgColors[(ii+i)%6]);
            if (q.type) {
                lb.push(ii?'正确':'错误');
            } else {
                lb.push(String.fromCharCode(65+ii));
            }
        });
        chartCvAnswer(i, lb, q.count, cbg, q.detail);
    });
    chartCvQuestion(qs, data, bg);
}
function chartCvQuestion(labels, data, backgroundColor) {
    var myChart = new Chart('cv_questions', {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '正确率',
                data: data,
                backgroundColor: backgroundColor
            }]
        },
        options: {
            title: {
                display: true,
                text: '正确率'
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}
function chartCvAnswer(index, labels, data, backgroundColor, details) {
    var myChart = new Chart('cv_answers_'+index, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor
            }]
        },
        options: {
            title: {
                display: true,
                text: '答案分布'
            },
            legend: {
                display: false
            },
            onClick: function(event, obj) {
                var d = obj[0];
                showAnswerList(index+1, d._view.label, details[d._index]);
            }
        }
    });
}
function showAnswerList(i, lb, detail) {
    var table = $('<table class="table table-striped" id="ansList" style="width:100%"></table>').DataTable({
        data: detail,
        columns: [
            { title: "学号", data: "id" },
            { title: "姓名", data: "name" }
        ],
        paging: false
    }).table();
    bootbox.dialog({
        title:'第 '+i+' 题选择 '+lb+' 的同学（点击列表项查看答卷）',
        message : table.node()
    });
    $('#ansList tbody tr').css('cursor', 'pointer');
    $('#ansList tbody').on('click', 'tr', function () {
        bootbox.hideAll();
        var data = table.row(this).data();
        document.location.hash = document.location.hash.replace('/result', '/studentanswer')
            + '&student=' + data.id;
    });
}

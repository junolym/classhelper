//添加选择题
function addselectquestion() {
    var table = $('#questiontable')[0];
    var questions = $('#questiontable')[0].getElementsByTagName("tr");
    var quesNum = questions.length;

    var newques = table.insertRow(quesNum);
    var id = newques.insertCell(0);
    var description = newques.insertCell(1);
    var answer = newques.insertCell(2);
    var operation = newques.insertCell(3);
    //题号
    id.innerText = quesNum;
    //描述
    description.innerHTML +=
    "<div><textarea cols=50 rows=4></textarea></div>"
    //答案
    var addsecId = "select" + quesNum;
    var delsecId = "delsect" + quesNum;
    answer.innerHTML +=
    "<div class='eachquestion'>\
      <div class='rightans'>\
      </div>\
      <div class='allSelection'>\
        <div class='examselection'>\
          <input type='checkbox'>A<textarea  cols=40 rows=1 overflow-y='scroll' class='seletext'></textarea>\
        </div>\
        <div class='examselection'>\
          <input type='checkbox'>B<textarea  cols=40 rows=1 overflow-y='scroll' class='seletext'></textarea>\
        </div>\
      </div>\
      <div id='secbtn'>\
        <button class='btn btn-default delsec' style='font-size:12px' onclick='deleteselection(this.id)'>删除选项</button>\
        <button class='btn  btn-default addsec'  style='font-size:12px' onclick='addselection(this.id)'>添加选项</button>\
      </div>\
    </div>"
      // <a class='btn addselectionbtn' onclick='addselection(this.id)'>+</a>\
    answer.getElementsByTagName('button')[0].id = delsecId;
    answer.getElementsByTagName('button')[1].id = addsecId;

    //操作
    var deleteid = "deletebtn" + quesNum;
    operation.innerHTML =
    // "<div class='deletequestion'><a class='btn btn-default' style='margin-left:5px'>删除题目</a></div>"
    "<button class='btn btn-large' style='font-size:4px' onclick='deleteQuestion(this.id)'>删除题目</button>"
    operation.getElementsByTagName("button")[0].id = deleteid;
}

function addjudgequestion() {
  var table = $('#questiontable')[0];
  var questions = $('#questiontable')[0].getElementsByTagName("tr");
  var quesNum = questions.length;

  var newques = table.insertRow(quesNum);
  var id = newques.insertCell(0);
  var description = newques.insertCell(1);
  var answer = newques.insertCell(2);
  var operation = newques.insertCell(3);
  //题号
  id.innerText = quesNum;
  //描述
  description.innerHTML +=
  "<div><textarea  cols=50 rows=4></textarea></div>"

  //答案
  answer.innerHTML +=
  "<div>\
    <input type='radio' name='"+quesNum+"' value='1' checked='checked'>正确<br>\
    <input type='radio' name='"+quesNum+"' value='0'>错误\
  </div>";

  //操作
  var deleteid = "deletebtn" + quesNum;
  operation.innerHTML =
  // "<div class='deletequestion'><a class='btn btn-default' style='margin-left:5px'>删除题目</a></div>"
  "<button class='btn btn-large' style='font-size:4px' onclick='deleteQuestion(this.id)'>删除题目</button>"
  operation.getElementsByTagName("button")[0].id = deleteid;
}

function addlongquestion() {
  var table = $('#questiontable')[0];
  var questions = $('#questiontable')[0].getElementsByTagName("tr");
  var quesNum = questions.length;

  var newques = table.insertRow(quesNum);
  var id = newques.insertCell(0);
  var description = newques.insertCell(1);
  var answer = newques.insertCell(2);
  var operation = newques.insertCell(3);
  //题号
  id.innerText = quesNum;
  //描述
  description.innerHTML +=
  "<div><textarea  cols=50 rows=4></textarea></div>"

  //答案
  answer.innerHTML +=
  "<div><textarea  cols=50 rows=4></textarea></div>";

  //操作
  var deleteid = "deletebtn" + quesNum;
  operation.innerHTML =
  // "<div class='deletequestion'><a class='btn btn-default' style='margin-left:5px'>删除题目</a></div>"
  "<button class='btn btn-large' style='font-size:4px' onclick='deleteQuestion(this.id)'>删除题目</button>"
  operation.getElementsByTagName("button")[0].id = deleteid;
}

//添加选项
function addselection(id) {
  var num = parseInt(id.substr(6, id.length));
  var questions = $('#questiontable')[0].getElementsByTagName("tr")[num];
  // var selections = $('.allSelection')[num-1];
  var selections = questions.getElementsByTagName('td')[2]
  .getElementsByTagName('div')[0].getElementsByTagName('div')[1];

  var newSelection = document.createElement('div');
  newSelection.setAttribute('class', 'examselection');
  var num = selections.getElementsByTagName('div').length;
  var alpha = String.fromCharCode(64 + parseInt(num + 1));
  newSelection.innerHTML = "<input type='checkbox'>" + alpha + "<textarea  cols=40 rows=1 overflow-y='scroll' class='seletext'></textarea>";
  selections.appendChild(newSelection);
}

//删除最后一个选项
function deleteselection(id) {
  var num = parseInt(id.substr(7, id.length));
  var questions = $('#questiontable')[0].getElementsByTagName("tr")[num];
  var node = questions.getElementsByTagName('td')[2]
  .getElementsByTagName('div')[0].getElementsByTagName('div')[1].getElementsByTagName('div');
  if (node.length == 2) {
    window.alert("至少需要两个选项");
  }
  else {
    // var node = $('.allSelection')[num-1].getElementsByTagName('div');
    var lastnode = node[node.length-1];
    lastnode.parentNode.removeChild(lastnode);
  }
}

//删除试题
function deleteQuestion(id) {
  //删除表格中对应的行
  var num = parseInt(id.substr(9,id.length));
  var questions = $('#questiontable')[0].getElementsByTagName("tr");
  questions[num].remove();
  //重新排列题号
  if (num < questions.length) {
    for (var i = num; i < questions.length; i++) {
      var td = questions[i].getElementsByTagName('td');
      td[0].innerText = i;
      if (td[2].getElementsByTagName('button') == 2) {
        td[2].getElementsByTagName('button')[0].id = "delsect" + i;
        td[2].getElementsByTagName('button')[1].id = "select" + i;
        td[3].getElementsByTagName('button')[0].id = "deletebtn" + i;
      }
      else {
        td[3].getElementsByTagName('button')[0].id = "deletebtn" + i;
      }
    }
  }
}

//提交试题
function getquestion(){
  var exams = [];
  $('#examname')[0].value = $("#exam_name")[0].value;

  var questions = $('#questiontable')[0].getElementsByTagName("tr");

  for (var i = 1; i < questions.length; i++) {
      var type = 2; // 0为选择， 1为判断，2为解答 求求求你别再由填空题或者连线题或者小作文之类的
      //题号，描述
      var td = questions[i].getElementsByTagName("td");
      var id = parseInt(td[0].innerText);
      var description = td[1].getElementsByTagName("textarea")[0].value;
      //选项
      var selectionset = [];
      var selections = td[2].getElementsByTagName("textarea");
      if (selections.length > 1) {
        type = 0;
        for (var j = 0; j < selections.length; j++) {
          selectionset.push(selections[j].value);
        }
      }
      var answer;
      if (type == 0) {
        answer = [];
        var checks = td[2].getElementsByTagName('input');
        for (var j = 0; j < checks.length; j++) {
          if (checks[j].checked) {
            answer.push(j);
          }
        }
      } else {
        var checks = td[2].getElementsByTagName('input');
        if (checks.length) {
          type = 1;
          answer = checks[0].checked ? 1 : 0;
        } else {
          answer = selections[0].value;
        }
      }

      var exam = {
        type : type,
        description : description,
        standardAnswer : answer,
        selectionSet : selectionset
      };
      exams.push(exam);
  }

  $('#examinput')[0].value = JSON.stringify(exams);
}
function exportExam() {
    getquestion();
    savefile($('#examinput')[0].value, "text/json",
        $("#exam_name")[0].value + '.json');
}
function importExam(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            try {
                obj = JSON.parse(this.result);
                $('#examname')[0].value = $("#exam_name")[0].value;
                $('#examinput')[0].value = this.result;
                formSubmit('#examForm');
            } catch(e) {
                error('导入文件解析失败');
            }
        }
        reader.readAsText(file);
    }
}

function savefile(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}

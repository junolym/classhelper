sidebar = false;
$(document).ready(function () {
    var trigger = $('.hamburger');

    if (document.body.clientWidth >= 768) {
    	$('#wrapper').toggleClass('toggled');
        sidebar = true;
    }

    contentResize();

    trigger.click(function () {
      $('#wrapper').toggleClass('toggled');
      sidebar = !sidebar;
      contentResize();
    });

    window.onresize = function(){
        if (document.body.clientWidth >= 768 && sidebar == false) {
            $('#wrapper').toggleClass('toggled');
            sidebar = true;
        }
        else if (document.body.clientWidth < 768 && sidebar == true) {
            $('#wrapper').toggleClass('toggled');
            sidebar = false;
        }
        contentResize();
    }

    $('#rightpage').click(function() {
        if (document.body.clientWidth < 768 && sidebar) {
            $('#wrapper').toggleClass('toggled');
            sidebar = false;
            contentResize();
        }
    });

    if (document.location.hash.length <= 1) {
        document.location.hash = "#user";
    } else {
        hashChange();
    }
});

function hashChange() {
    var hash = document.location.hash;
    if (hash.length > 1) {
        loadContent(hash.slice(1));
    }
}
window.onhashchange = hashChange;

function contentResize() {
    $('#rightpage')[0].style.width = document.body.clientWidth - (sidebar ? 240 : 0) + 'px';
}

function responseHandler(res) {
    var rst = res.responseText;
    var loc = document.location;
    if (res.status == 302) {
        if (loc.hash == rst && rst.length > 1) {
            loadContent(rst.slice(1));
        } else {
            loc.href = rst;
        }
    } else {
        $('#content').html(rst);
    }
}

function loadContent(content) {
    $.get('/home/'+content).complete(responseHandler);
}


function formSubmit(selector) {
    $.post($(selector)[0].action, $(selector).serialize()).complete(responseHandler);
    return false;
};

function setEditable() {
        //设置表格可编辑
    var trs = $('#stutable')[0].getElementsByTagName("tr");
    var trLength = trs.length;
    for (var i = 1; i < trLength; i ++) {
        var td = trs[i].getElementsByTagName("td");
        td[0].setAttribute("contentEditable", "true");
        td[1].setAttribute("contentEditable", "true");
    }
}

function getstudents() {
    var list = [];
    var trs = $('#stutable')[0].getElementsByTagName("tr");

    for (var i = 1; i < trs.length; i++) {
        var td = trs[i].getElementsByTagName("td");
        list.push([td[0].innerText,td[1].innerText]);
    }

    document.getElementById("stulistinput").value = JSON.stringify(list);
}

function addstudent() {
    var table = $('#stutable')[0];
    var trs = $('#stutable')[0].getElementsByTagName("tr");

    var tr = table.insertRow(trs.Length);
    var td0 = tr.insertCell(0);
    var td1 = tr.insertCell(1);
}

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
    "<div><textarea  cols=50 rows=4></textarea></div>"
    //答案
    var addsecId = "select" + quesNum;
    var delsecId = "delsect" + quesNum;
    answer.innerHTML +=
    "<div class='eachquestion'>\
      <div class='rightans'>\
        <p>正确答案:</p>\
        <textarea cols=5 rows=1></textarea>\
      </div>\
      <div class='allSelection'>\
        <div class='examselection'>\
          <p>A</p>\
          <textarea  cols=40 rows=2 overflow-y='scroll'></textarea>\
        </div>\
        <div class='examselection'>\
          <p>B</p>\
          <textarea  cols=40 rows=2 overflow-y='scroll'></textarea>\
        </div>\
      </div>\
      <div id='secbtn'>\
        <button class='btn btn-primary delsec' style='font-size:12px' onclick='deleteselection(this.id)'>删除选项</button>\
        <button class='btn  btn-primary addsec'  style='font-size:12px' onclick='addselection(this.id)'>添加选项</button>\
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
    <select class='judgeanswer'>\
      <option value ='right'>right</option>\
      <option value ='wrong'>wrong</option>\
    </select>\
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
  newSelection.innerHTML =
    "<p>" + alpha + "</p>\
    <textarea  cols=40 rows=2 overflow-y='scroll'></textarea>"

  selections.appendChild(newSelection);
}

//删除最后一个选项
function deleteselection(id) {
  var num = parseInt(id.substr(7, id.length));
  var questions = $('#questiontable')[0].getElementsByTagName("tr")[num];
  var node = questions.getElementsByTagName('td')[2]
  .getElementsByTagName('div')[0].getElementsByTagName('div')[1].getElementsByTagName('div');
  if (node.length == 2) {
    window.alert("至少有两个！");
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
function getqusetion(){
  var list = [];
  var title = [];

  //课程名称
  var name = $("#exam_name")[0].value;
  title.push(name);

  var questions = $('#questiontable')[0].getElementsByTagName("tr");

  for (var i = 1; i < questions.length; i++) {
      var type = 2; // 0为选择， 1为判断，2为解答 求求求你别再由填空题或者连线题或者小作文之类的
      //题号，描述
      var td = questions[i].getElementsByTagName("td");
      var id = td[0].innerText;
      var description = td[1].getElementsByTagName("textarea")[0].value;
      //选项
      var selectionset = [];
      var selections = td[2].getElementsByTagName("textarea");
      if (selections.length >= 1) {
        type = 0;
        for (var j = 1; j < selections.length; j++) {
          selectionset.push(selections[j].value);
        }
      }
      //判断答案
      var answer = "";
      var judgeanswer = 0; // 1 is true , 0 is false
      var judge = td[2].getElementsByTagName('select');
      if (judge.length > 0) {
        type = 1;
        var judgeanswer = 1 - parseInt(judge[0].selectedIndex);
      }

      //其他答案
      else {
         answer = selections[0].value;
      }
      list.push([id, type, description, selectionset, judgeanswer, answer]);
  }

  document.getElementById("examinput").value = JSON.stringify(list);
  document.getElementById("examname").value = JSON.stringify(title);
}

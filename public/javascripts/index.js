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
    "<div><textarea  cols=50 rows=4>描述</textarea></div>"
    //答案
    answer.innerHTML +=
    "<div><p>正确答案:</p><textarea cols=5 rows=1></textarea></div>\
    A<div><textarea  cols=40 rows=2 overflow-y='scroll'>选项A</textarea></div>\
    B<div><textarea  cols=40 rows=2 overflow-y='scroll'>选项B</textarea></div>\
    C<div><textarea  cols=40 rows=2 overflow-y='scroll'>选项C</textarea></div>\
    D<div><textarea  cols=40 rows=2 overflow-y='scroll'>选项D</textarea></div>\
    "
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
  "<div><textarea  cols=50 rows=4>描述</textarea></div>"

  //答案
  answer.innerHTML +=
  "<div><textarea  cols=50 rows=4>答案</textarea></div>";

  //操作
  var deleteid = "deletebtn" + quesNum;
  operation.innerHTML =
  // "<div class='deletequestion'><a class='btn btn-default' style='margin-left:5px'>删除题目</a></div>"
  "<button class='btn btn-large' style='font-size:4px' onclick='deleteQuestion(this.id)'>删除题目</button>"
  operation.getElementsByTagName("button")[0].id = deleteid;
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

      var btn = td[3].getElementsByTagName('button')[0].id = "deletebtn" + i;
    }
  }
}

//提交试题
function getqusetion(){
  var list = [];
  var title = [];

  //课程名称
  var name = $("#exam_name")[0].value;
  title.push([name]);

  var questions = $('#questiontable')[0].getElementsByTagName("tr");

  for (var i = 1; i < questions.length; i++) {
      //题号，描述
      var td = questions[i].getElementsByTagName("td");
      var id = td[0].innerText;
      var description = td[1].getElementsByTagName("textarea")[0].value;
      //选项
      var selectionset = [];
      var selections = td[2].getElementsByTagName("textarea");
      if (selections.length >= 1) {
        for (var j = 1; j < selections.length; j++) {
          selectionset.push(selections[j].value);
        }
      }

      //答案
      var answer = selections[0].value;

      list.push([id, description, selectionset, answer]);
  }

  document.getElementById("examinput").value = JSON.stringify(list);
  document.getElementById("examname").value = JSON.stringify(title);
}

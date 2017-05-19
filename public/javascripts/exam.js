function submitanswer() {
  var answer = [];
  // var number = document.getElementById('stuid').value;
  // var name = document.getElementById('stuname').value;
  var questions = document.getElementsByTagName('ol')[0].getElementsByTagName('li');
  for (var i = 0; i < questions.length; i++) {
    var myans = "";
    var eachques = questions[i].getElementsByTagName('div');

    if (eachques.length == 0) { //解答题
        myans += questions[i].getElementsByTagName('textarea')[0].value;
    }

    else if(eachques[0].getElementsByTagName('input')[0].value == "1") { // 判断题
        if(eachques[0].getElementsByTagName('input')[0].checked)
          myans+= "1"; //true
        else if (eachques[1].getElementsByTagName('input')[0].checked) {
          myans+="0"; //false
        }
        else {
          myans += "2"; //not do
        }
    }

    else {
      for (var j = 0; j < eachques.length; j++) {
        var checkans = eachques[j].getElementsByTagName('input')[0];
        if (checkans.checked == true) {
          myans += String.fromCharCode(64 + parseInt(j + 1));
        }
      }
    }
    answer.push([myans]);
  }
}

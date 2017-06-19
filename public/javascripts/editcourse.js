function setDataTable() {
  var dt = $('table.data-table');
  if (dt.DataTable) {
    dt.DataTable({
      'paging': false,
      'searching': false,
      'info':   false
    });
  } else {
    setTimeout(function() {
      setDataTable();
    }, 100);
  }
}

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
    var invalid = false;

    for (var i = 1; i < trs.length; i++) {
        var td = trs[i].getElementsByTagName("td");
        if (parseInt(td[0].innerText) > 0 &&
            td[0].innerText.length <= 15 &&
            td[1].innerText.length > 0 &&
            td[1].innerText.length <= 40) {

            list.push([td[0].innerText,td[1].innerText]);

        } else if (td[0].innerText.length || td[1].innerText.length) {
            invalid = true;
        }
    }

    document.getElementById("stulistinput").value = JSON.stringify(list);
    if (invalid) {
        warning('学生名单中含有无效信息，已自动忽略');
    }
}

function addstudent() {
    var table = $('#stutable')[0];
    var trs = $('#stutable')[0].getElementsByTagName("tr");

    var tr = table.insertRow(trs.Length);
    var td0 = tr.insertCell(0);
    var td1 = tr.insertCell(1);
}

function importlist(fls) {
    if (fls && fls.length > 0) {
        ImportFile = fls[0];
        var fileX = ImportFile.name.split(".").reverse()[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            // 二进制读取
            try {
                workbook = XLSX.read(data, {
                    type: 'binary'
                });
                var sheetNames = workbook.SheetNames;

                // 删除现有数据
                clearTable();

                // 读取excel, 第一个worksheet
                var worksheet = workbook.Sheets[sheetNames[0]];
                var json = XLSX.utils.sheet_to_json(worksheet);
                if (json.length==0 || !json[0]['学号'] || !json[0]['姓名']) {
                    $.notify({
                        message: '格式错误！请确认表头为“学号”和“姓名”，允许有其他无关的列。'
                    },{
                        type: 'warning'
                    });
                } else {
                    for (var i in json) {
                        var table = $("#stutable");
                        table.append("<tr><td>" + json[i]['学号'] + "</td><td>" + json[i]['姓名'] + "</td></tr>");
                    }
                    $.notify({
                        message: '学生名单导入成功'
                    },{
                        type: 'success'
                    });
                }
                setEditable();
            } catch(err) {
                if (/Unsupported file/.test(err.message)) {
                    $.notify({
                        message: '不支持该文件类型，请选择xlsx文件'
                    },{
                        type: 'danger'
                    });
                } else {
                    $.notify(err, {
                        type: 'danger'
                    });
                }
            }
        }
        reader.onerror = () => {
            console.log(123);
        }
        reader.readAsBinaryString(ImportFile);
    }
}

function exportlist(filename) {
    var table = {};

    var trs = $('#stutable')[0].getElementsByTagName("tr");

    table['!ref'] = "A1:B" + trs.length;
    table['A1'] = {v: "学号"};
    table['B1'] = {v: "姓名"};
    for (var i = 1; i < trs.length; i++) {
        var td = trs[i].getElementsByTagName("td");
        table['A' + (i + 1)] = {v: td[0].innerText};
        table['B' + (i + 1)] = {v: td[1].innerText};
    }

    var workbook = {
        SheetNames: ['sheet1'],
        Sheets: {
            'sheet1': table
        }
    }

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    var wbout = XLSX.write(workbook,wopts);
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename+".xlsx");
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function clearTable() {
    var tr = $("#stutable").find("tr")[0];
    $("#stutable").html(tr);
}

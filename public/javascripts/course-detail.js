function importlist(fls) {
    if (fls && fls.length > 0) {
        ImportFile = fls[0];
        var fileX = ImportFile.name.split(".").reverse()[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            // 二进制读取
            workbook = XLSX.read(data, {
                type: 'binary'
            });
            var sheetNames = workbook.SheetNames;

            // 删除现有数据
            var tr = $("#stutable").find("tr")[0];
            $("#stutable").html(tr);

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
        }
        reader.readAsBinaryString(ImportFile);
    }
}

function exportlist(filename) {
    var table = {};

    var trs = $('#stutable')[0].getElementsByTagName("tr");

    table['!ref'] = "A1:B" + trs.length;

    for (var i = 0; i < trs.length; i++) {
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

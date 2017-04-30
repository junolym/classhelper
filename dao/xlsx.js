// 使用js-xlsx处理Excel表格
// node 安装 npm install xlsx
// 建议在前端处理，node处理示例如下：
// 教师上传一个含有学号、姓名列的Excel表格(可以含有其他数据)
// 得到一个[[id1, name1], [id2,name2]]

XLSX = require('xlsx');

try {
    var workbook = XLSX.readFile('filename');
} catch (err) {
    console.log(err);
}

if (workbook) {
    var sheetNames = workbook.SheetNames;
    for (var i in sheetNames) {
        var worksheet = workbook.Sheets[sheetNames[i]];
        var json = XLSX.utils.sheet_to_json(worksheet);
        var info = [];
        if (json.length==0 || !json[0]['学号'] || !json[0]['姓名']) {
            console.log("表格格式错误！");
        } else {
            for (var i in json) {
                if (json[i]['学号'] > '15000000')
                    info.push([json[i]['学号'], json[i]['姓名']]);
            }
        }
    }
} else {
    console.log("打开文件失败！");
}


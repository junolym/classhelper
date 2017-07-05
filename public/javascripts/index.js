function loadJsAsync(filename) {
  jsloaded = window.jsloaded || {};
  if (!jsloaded[filename]) {
    var d = document, s = d.createElement('script');
    s.src = filename;
    (d.head || d.body).appendChild(s);
    jsloaded[filename] = true;
  }
}
loadJsAsync('/javascripts/bootstrap-notify.min.js');
loadJsAsync('/javascripts/bootbox.min.js');

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
    var h = hash.match(/^#[\w]+/)[0];
    var a = $('#sidebar-wrapper li [href=' + h + ']');
    if (a.length) {
        navactive(a.parent());
        $('title').html('课堂助手 - '+a[0].getAttribute('value'));
    }
    if (hash.length > 1) {
        loadContent(hash.slice(1));
    }
}
window.onhashchange = hashChange;

function contentResize() {
    $('#rightpage')[0].style.width = document.body.clientWidth - (sidebar ? 240 : 20) + 'px';
}

function responseHandler(res) {
    var rst = res.responseText;
    var loc = document.location;
    if (res.status == 207) {
        res = JSON.parse(rst);
        if (res.notify) {
          $.notify({
            message: res.notify[0]
          },{
            type: res.notify[1],
            delay: 1000
          });
        }
        if (res.reload) {
          if (loc.hash == res.reload) {
            loadContent(res.reload.slice(1));
          } else {
              if (res.reload[0] == '#') {
                  loc.hash = res.reload;
              } else {
                  loc.href = res.reload + loc.hash;
              }
          }
        }
    } else if (loc.href.slice(-3) == '.md') {
        $('#content').val(rst);
        loadMd();
    } else {
        $('#content').html(rst);
        $('#content').scrollTop(0)
        var keyword = window.tablefiltertext;
        $('#tablefilter').val(keyword);
        if (keyword) {
          tablefilter(keyword);
        }
        window.tablefiltertext = "";
        typeof(setDataTable) == 'undefined' || setDataTable();
    }
}

function loadMd() {
    if (!window.showdown)
        return setTimeout(loadMd, 100);
    var converter = new showdown.Converter(),
        html      = converter.makeHtml($('#content').val());
    html = html.replace(/href="(?!http|\/)/g, 'href="#docs/');
    $('#content').html(html);
};

function warning(message) {
    $.notify(message , {
       type : 'warning',
       delay : 2000
    });
}

function loadContent(content) {
    $.get(content).complete(responseHandler);
}

function formSubmit(selector) {
    $.post($(selector)[0].action, $(selector).serialize()).complete(responseHandler);
    return false;
};

function deleteConfirm(what, message, deleteCallback) {
  bootbox.confirm({
    title: '确认删除'+what+'？',
    message: message,
    buttons: {
        confirm: {
            label: '删除',
            className: 'btn-danger'
        },
        cancel: {
            label: '取消',
            className: 'btn-success'
        }
    },
    callback: function (result) {
        if (result) {
          deleteCallback();
        }
    }
  });
}

function navactive(obj) {
    $('#sidebar-wrapper li').removeClass('active');
    $(obj).addClass('active');
}

function tablefilter(keyword) {
    var trs = $('tbody tr');
    for (var i = 0; i < trs.length; i++) {
        if (trs[i].outerHTML.match(keyword)) {
            $(trs[i]).removeClass('hidden');
        } else {
            $(trs[i]).addClass('hidden');
        }
    }
}

function setFilter(keyword) {
    window.tablefiltertext = keyword;
}

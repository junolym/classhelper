$(document).ready(function () {
    var trigger = $('.hamburger');
    var flag = false;

    if (document.body.clientWidth >= 767) {
    	$('#wrapper').toggleClass('toggled');
        flag = true;
    }

    trigger.click(function () {
      $('#wrapper').toggleClass('toggled');
    });

    window.onresize = function(){
        if (document.body.clientWidth >= 767 && flag == false) {
            $('#wrapper').toggleClass('toggled');
            flag = true;
        }
        else if (document.body.clientWidth < 767 && flag == true) {
            $('#wrapper').toggleClass('toggled');
            flag = false;
        }
    }
});

function loadContent(content) {
    contentstack = window.contentstack || [];
    if (content == '.') {
        content = contentstack[contentstack.length-1];
    } else if (content == '..') {
        contentstack.pop();
        content = contentstack[contentstack.length-1];
    } else if (content != contentstack[contentstack.length-1]) {
        contentstack.push(content);
    }
    $.get('/index/'+content, function(data, status) {
        if (status == 'success') {
            $('#content').html(data);
        } else {
            console.log(status);
        }
    });
}
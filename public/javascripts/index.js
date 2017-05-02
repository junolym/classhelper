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

    $('#content').click(function() {
        if (document.body.clientWidth < 768 && sidebar) {
            $('#wrapper').toggleClass('toggled');
            sidebar = false;
            contentResize();
        }
    });
});

function contentResize() {
    $('#rightpage')[0].style.width = document.body.clientWidth - (sidebar ? 240 : 0) + 'px';
}

lc = function loadContent(content) {
    contentstack = window.contentstack || [];
    if (content == '.') {
        content = contentstack[contentstack.length-1];
    } else if (content == '..') {
        contentstack.pop();
        content = contentstack[contentstack.length-1];
    } else if (content != contentstack[contentstack.length-1]) {
        contentstack.push(content);
    }
    $.get('/home/'+content).complete(function(res) {
        $('#content').html(res.responseText);
    });
}


function formSubmit() {
    $.post($("#contentForm")[0].action, $("#contentForm").serialize())
    .complete(function(res) {
        $('#content').html(res.responseText);
    });
    return false;
};
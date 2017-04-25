$(document).ready(function () {
    var trigger = $('.hamburger');

    if (!isMobile()) {
    	$('#wrapper').toggleClass('toggled');
    }
    
    trigger.click(function () {
      $('#wrapper').toggleClass('toggled');
    });


    function isMobile(){ //judge if is in phone
        if(/android/i.test(navigator.userAgent)){
                //document.write("This is Android'browser.");//这是Android平台下浏览器
                return true;
        }
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
                //document.write("This is iOS'browser.");//这是iOS平台下浏览器
                return true;
        }
        if(/Linux/i.test(navigator.userAgent)){
                //document.write("This is Linux'browser.");//这是Linux平台下浏览器
                return true;
        }
        if(/Linux/i.test(navigator.platform)){
                //document.write("This is Linux operating system.");//这是Linux操作系统平台
                return true;
        }
        if(/MicroMessenger/i.test(navigator.userAgent)){
                //document.write("This is MicroMessenger'browser.");//这是微信平台下浏览器
                return true;
        }
        
        return false;
	}
});


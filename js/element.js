$(function(){

    var imageList = $("#element.elemen .mainContent .image li");
    var imageSwitchBtn = $("#element .mainContent .ver ul li a");

    var gritchParam = {
        blink_num  : 12,
        blink_spd  : 10,
        divide_num : 500
    };

    $(window).load(function(){
        setTimeout(function(){
            imageList.eq(0).addClass("current").find("img").gritch(gritchParam);
        }, 500);
    });

    imageSwitchBtn.click(function(){
        var index = imageSwitchBtn.index(this);
        imageSwitchBtn.removeClass("current");
        $(this).addClass("current");
        var _gritchParam = $.extend(true, {}, gritchParam);
        _gritchParam.callback = function(){
            imageList.removeClass("current").eq(index).addClass("current").find("img").gritch(gritchParam);
        };
        _gritchParam.out = true;
        $("#element.elemen .mainContent .image li.current").find("img").gritch(_gritchParam);
        return false;
    });

});

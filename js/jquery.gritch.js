
(function($){

    var c = 0;
    var idpfx = "juery_gritch_";

    $.fn.gritch = function(prop){

        var options = $.extend({
            blink_num  : 46,          // 何回点滅するか
            blink_spd  : 5,           // 点滅のスピード msec
            divide_num : 120,         // 縦に何分割するか
            out        : false,       // 消えていくかどうか
            callback   : function(){} // コールバック
        }, prop)

        return this.each(function(){

            c ++;
            var id = idpfx + c;

            var jqueryObj   = $(this),
                w           = $(this).width(),
                h           = $(this).height() * 2,
                url         = $(this).attr("src");

            var img         = new Image(),
                originalImg = new Image(),
                bnt         = w / 2 / options.blink_num,
                hrH         = Math.ceil(h / options.divide_num),
                bc          = 0,
                bn          = options.out ? w / 2 : 0,
                canvas, ctx;

            originalImg.src = url;
            img.src = url.replace(".png", "_x1.png");
            img.onload = function(){
                jqueryObj.replaceWith("<span id='" + id + "_con' style='display:block;position:relative;width:" + (w * 3)  + "px;left:" + (w * -1) + "px;'><canvas id='" + id + "' /></span>");
                canvas  = document.getElementById(id);
                ctx = canvas.getContext('2d'),
                canvas.width = w * 3;
                canvas.height = h;
                _gritch();
            }

            function _gritch(){
                bc ++;
                if(bc > options.blink_num){
                    originalImg.style.display = options.out ? "none" : "block";
                    $("#" + id + "_con").replaceWith(originalImg);
                    jqueryObj = null; canvas = null; ctx = null; img = null; originalImg = null;
                    options.callback();
                    return;
                }else{
                    setTimeout(function(){
                        _gritch();
                    }, options.blink_spd);
                }
                if(options.out){
                    bn -= bnt;
                }else{
                    bn += bnt;
                }
                ctx.clearRect(0, 0, w * 3, h);
                for(var i = 0; i < options.divide_num; i ++){
                    var min = bn - w / 2;
                    var max = w / 2 - bn;
                    var val = Math.floor(Math.random() * (max - min)) + min + w;
                    ctx.drawImage(img, 0, i * hrH, w, hrH, val, i * hrH, w, hrH);
                }
            }

        });

    }

})(jQuery);
//honeycombBGCanvas
var honeyCombBG = function(_honeycombAnimationMap, canvasIdStr, imgURL){

    var honeycombSideW = 57;
/*
    var _honeycombAnimationMap = [
        [0,2],[1,2],[1,1],[2,2],
        [2,1],[3,3],[2,0],[3,1],
        [3,0],[4,1],[6,2],[4,0],
        [5,1],[5,0],[6,1],[6,0],
        [7,1],[7,2],[7,0],[8,0],
        [8,2],[9,1],[9,0]
    ];
*/

    var dulation = 800; // アニメーショントータルの長さ ms
    var tempo = 10; // アニメーションの実行速度 ms
    var diffTimeEachShow = 0.05; // 次のハニカムが出現するまでの差分%

    var drawNum = Math.floor(dulation / tempo); // 描写の総数
    var honyecombNum = _honeycombAnimationMap.length;
    var eachDulation = Math.floor(drawNum / (diffTimeEachShow * (honyecombNum - 1) + 1));

    var honeycombAnimationMap = new Array();

    var canvas = document.getElementById(canvasIdStr);
	var ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(167,167,167, 0.15)";

    var img = new Image();
        img.src = imgURL + "?t=" + new Date().getTime();
        img.onload = function() {
            setTimeout(function(){
                for(var i = 0; i < drawNum; i++){
                    showHoneycomb(i);
                }
            }, 0);
        }

    var adjX = honeycombSideW * Math.cos(60 * (Math.PI / 180));
    var h =  honeycombSideW * Math.sin(60 * (Math.PI / 180)) * 2;
    var adjYOdd = h / 2;
    var tempoX = adjX + honeycombSideW;

    function showHoneycomb(execCount){
        setTimeout(function(){
            if(execCount >= eachDulation * diffTimeEachShow * honeycombAnimationMap.length && _honeycombAnimationMap.length > honeycombAnimationMap.length){
                var next = honeycombAnimationMap.length;
                honeycombAnimationMap.push(_honeycombAnimationMap[next]);
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // image
            ctx.save();
            drawHoneycombPath(execCount);
            ctx.clip();
            ctx.drawImage(img, 0, 0);
            // line
            ctx.restore();
            drawHoneycombPath(execCount);
            ctx.stroke();
        }, execCount * tempo);
    }

    function drawHoneycombPath(execCount){
        ctx.beginPath();

        for(var i = 0; i < honeycombAnimationMap.length; i++){
            var vLine = honeycombAnimationMap[i][0];
            var hLine = honeycombAnimationMap[i][1];
            if(typeof honeycombAnimationMap[i][2] == "undefined"){
                honeycombAnimationMap[i][2] = 0;
            }
            honeycombAnimationMap[i][2] += honeycombSideW / eachDulation;
            var showPoint = eachDulation * diffTimeEachShow * i;
            if(showPoint <= execCount && showPoint + eachDulation >= execCount){
                honeycombAnimationMap[i][2] = jQuery.easing.easeOutExpo(null, execCount - eachDulation * diffTimeEachShow * i, 0, honeycombSideW, eachDulation);
            }
            if(honeycombAnimationMap[i][2] > honeycombSideW){
                honeycombAnimationMap[i][2] = honeycombSideW;
            }
            var addY = vLine % 2 == 0 ? adjYOdd : 0;
            var diff = (honeycombSideW - honeycombAnimationMap[i][2]) / 2;
            drawCanvas(tempoX * vLine + diff, h * hLine + addY + diff, honeycombAnimationMap[i][2]);
        }

        function drawCanvas(x,y, w){
            x += adjX;
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w + w / 2, y + Math.sqrt(3) * w / 2);
            ctx.lineTo(x + w, y + Math.sqrt(3) * w / 2 + Math.sqrt(3) * w / 2);
            ctx.lineTo(x, y + Math.sqrt(3) * w / 2 + Math.sqrt(3) * w/2);
            ctx.lineTo(x - w / 2, y + Math.sqrt(3) * w/2);
            ctx.lineTo(x, y);
        }
    }

}
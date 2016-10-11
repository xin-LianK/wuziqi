$(function(){
	var canvasQ = $('#canvasQ').get(0);
	var canvasR = $('#canvasR').get(0);
	var canvasL = $('#canvasL').get(0);
	var ctxQ = $('#canvasQ').get(0).getContext('2d');
	// var ctxR = $('#canvasR').get(0).getContext('2d');
	// var ctxL = $('#canvasL').get(0).getContext('2d');
	var ROW = 15;
	var width = canvasQ.width;
	var off = width / ROW;
	var flag=true;
	var ai=false;
	var blocks={};
	var blank={};

	for (var i = 0; i < ROW; i++) {
		for (var j = 0; j < ROW; j++) {
			blank[p2k(i,j)]=true;
		}
	}
//把点简单处理
function v2k(position){
	return position.x+'_'+position.y;
}

function p2k(x,y){
	return x+'_'+y;
}

function k2p(key){
	var arr = key.split('_');
	return {x:parseInt(arr[0]),y:parseInt(arr[1])};
}
//画棋盘上的线；
	function draw(){
		ctxQ.beginPath();
		//0.5是用来消除双像素线
		for(var i = 0; i < 17; i++){
			ctxQ.moveTo(off / 2 + 0.5,off / 2 +0.5 + i*off);
			ctxQ.lineTo((ROW-0.5) * off + 0.5, off / 2 +0.5 + i*off);

			ctxQ.moveTo(off / 2 +0.5 + i*off,off / 2 + 0.5);
			ctxQ.lineTo(off / 2 +0.5 + i*off,(ROW-0.5) * off + 0.5);
		}
		ctxQ.stroke();
		ctxQ.closePath();

		drawCircle(3.5,3.5);
		drawCircle(11.5,3.5);
		drawCircle(3.5,11.5);
		drawCircle(11.5,11.5);
		drawCircle(7.5,7.5);

		// ctxQ.beginPath();
		// ctxQ.arc(3.5*40, 3*40+20+0.5, 2, 0, 2*Math.PI);
		// ctxQ.fill();
		// ctxQ.closePath();
	}

//画定点圆
	function drawCircle(x,y){
		ctxQ.beginPath();
		ctxQ.arc(x * off + 0.5, y * off + 0.5, 2, 0, 2*Math.PI);
		ctxQ.fill();
		ctxQ.closePath();
	}

//画棋子、、、、、、、、、、
	function drawChess(position,color){
		ctxQ.save();
		ctxQ.beginPath();
		ctxQ.translate((position.x + 0.5) * off + 0.5,(position.y + 0.5) * off + 0.5);

		if (color=='white') {
			ctxQ.shadowOffsetX = 2;
	  	ctxQ.shadowOffsetY = 2;
	  	ctxQ.shadowBlur = 4;
			ctxQ.shadowColor = "rgba(0, 0, 0, 0.5)";
			ctxQ.fillStyle = "white";
		}else {
			var radgrad = ctxQ.createRadialGradient(-4,-4,1,1,1,13);
			radgrad.addColorStop(0, '#fff');
			radgrad.addColorStop(1, '#000');
			ctxQ.fillStyle = radgrad;
		}
		ctxQ.arc(0, 0, 15, 0, 2*Math.PI);
		ctxQ.fill();
		ctxQ.closePath();
		ctxQ.restore();
		blocks[ v2k(position) ] = color;  //创建全表
		delete blank[v2k(position)];
	}

function drawText(pos,text,color){
	ctxQ.save();
	ctxQ.font = '15px 微软雅黑';
	ctxQ.textAlign = 'center';
	ctxQ.textBaseline = 'middle';
	if(color=="white"){
		ctxQ.fillStyle = 'black';
	}else{
		ctxQ.fillStyle = 'white';
	}
	ctxQ.fillText(text,(pos.x + 0.5)*off,(pos.y + 0.5)*off);
	ctxQ.restore();
}

//生成棋谱
function view(){
	var i=1;
	for (var pos in blocks) {
		drawText(k2p(pos),i,blocks[pos]);
		i++;
	}
}

function check(pos,color){

	var rowNum=1;
	var colNum=1;
	var leftNum=1;
	var rightNum=1;

	var table={};
	for (var i in blocks) {
		if (blocks[i] === color) {
			table[i]=true;
		}
	}
		var tx=pos.x;
		var ty=pos.y;
		while (table[ p2k(tx + 1,	ty) ]) {
			rowNum++;
			tx++;
		}
		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx - 1,	ty) ]) {
			rowNum++;
			tx--;
		}

		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx,	ty - 1) ]) {
			colNum++;
			ty--;
		}

		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx,	ty + 1) ]) {
			colNum++;
			ty++;
		}

		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx + 1,	ty + 1) ]) {//左下
			leftNum++;
			ty++;
			tx++;
		}

		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx - 1,	ty - 1) ]) {//左上
			leftNum++;
			ty--;
			tx--;
		}

		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx + 1,	ty - 1) ]) {//右上
			rightNum++;
			tx--;
			ty++;
		}

		tx=pos.x;
		ty=pos.y;
		while (table[ p2k(tx - 1,	ty + 1) ]) {//右下
			rightNum++;
			tx--;
			ty++;
		}
		var max = Math.max(rowNum,colNum,leftNum,rightNum);
		return max;
	// return rowNum >= 5 || colNum >= 5 || leftNum >= 5 || rightNum >= 5;
}

function AI(){
	var max1 = -Infinity;
	var max2 = -Infinity;
	var pos1;
	var pos2;
	for (var i in blank) {
		var scor1 = check(k2p(i),'black');
		if (scor1 > max1) {
			max1 = scor1;
			pos1 = k2p(i);
		}
	}
	for (i in blank) {
		var scor2 = check(k2p(i),'white');
		if (scor2 > max2) {
			max2 = scor2;
			pos2 = k2p(i);
		}
	}
	if (max2>=max1) {
		return pos2;
	}else{
		return pos1;
	}
}

function handclick(e){
	var position = {
		x: Math.round((e.offsetX - off / 2) / off),
		y: Math.round((e.offsetY - off / 2) / off)
	};

	if( blocks[ v2k(position) ] ){return;}

	if (ai) {
		drawChess(position,"black");
		drawChess(AI(),"white");
		if ( check(position,"black") > 5) {
			alert("执黑胜");
			$(canvasQ).off('click');
			if (confirm("是否生成棋谱")) {
				view();
			}
			return;
		}
	if(check(AI(),'white') > 5) {
		alert("执白胜");
		$(canvasQ).off('click');
		if (confirm("是否生成棋谱")) {
			view();
		}
		return;
	}
		return;
}

	if (flag) {
		drawChess(position,"white");
		if ( check(position,"white") >= 5) {
			alert("执白胜");
			$(canvasQ).off('click');
			if (confirm("是否生成棋谱")) {
				view();
			}
			return;
		}
	}else {
		drawChess(position,"black");
		if ( check(position,"black") >= 5) {
			alert("执黑胜");
			$(canvasQ).off('click');
			if (confirm("是否生成棋谱")) {
				view();
			}
			return;
		}
	}
	flag=!flag;
}

function res(){
	ctxQ.clearRect(0,0,600,600);
	blocks={};
	flag = true;
	$(canvasQ).off('click').on('click',handclick);
	draw();
}

var index=0;
setInterval(function(){
	index++;
	if (index>6) {
		index=1;
	}
	$('.mask-bg').css({
		backgroundImage:"url(imgs/time"+index+".jpg)"
	});
},2000);

$('.p-vs-c').on('click', function() {
	ai=!ai;
});
$('.res').on('click',res);
$(canvasQ).on('click',handclick);
$('.star').on('click',function(){
	draw();
	audio.play();
});

$('.tuichu').on('click',function(){
	ctxQ.clearRect(0,0,600,600);
	blocks={};
	flag = true;
	$(canvasQ).off('click').on('click',handclick);
});


ctxR.save();
setInterval(clockR,500);
function clockR(){
	ctxR.save();
	ctxR.translate(150,150);
	ctxR.clearRect(-150,-150,300,300);
	ctxR.save();
	ctxR.beginPath();
	for(var i=0;i<60;i++){
		if (i%5){
			ctxR.moveTo(0,-140);
		}else{
			ctxR.moveTo(0,-130);
		}
		ctxR.lineTo(0,-150);

		ctxR.rotate(Math.PI/30);
	}
	ctxR.stroke();
	ctxR.closePath();
	ctxR.restore();


	var data=new Date();
	var s = data.getSeconds();
	ctxR.save();
	ctxR.rotate(2*Math.PI*s/60);
	//秒针
	ctxR.save();
	ctxR.beginPath();

	ctxR.moveTo(0,20);
	ctxR.lineTo(0,5);
	ctxR.moveTo(5,0);
	ctxR.arc(0,0,5,0,2*Math.PI);
	ctxR.moveTo(0,-5);
	ctxR.lineTo(0,-110);

	ctxR.closePath();
	ctxR.stroke();
	ctxR.restore();
	ctxR.restore();
	ctxR.restore();

}
ctxR.restore();


ctxL.save();
setInterval(clockL,500);
function clockL(){
	ctxL.save();
	ctxL.translate(150,150);
	ctxL.clearRect(-150,-150,300,300);
	ctxL.save();
	ctxL.beginPath();
	for(var i=0;i<60;i++){
		if (i%5){
			ctxL.moveTo(0,-140);
		}else{
			ctxL.moveTo(0,-130);
		}
		ctxL.lineTo(0,-150);

		ctxL.rotate(Math.PI/30);
	}
	ctxL.stroke();
	ctxL.closePath();
	ctxL.restore();


	var data=new Date();
	var s = data.getSeconds();
	ctxL.save();
	ctxL.rotate(2*Math.PI*s/60);
	//秒针
	ctxL.save();
	ctxL.beginPath();

	ctxL.moveTo(0,20);
	ctxL.lineTo(0,5);
	ctxL.moveTo(5,0);
	ctxL.arc(0,0,5,0,2*Math.PI);
	ctxL.moveTo(0,-5);
	ctxL.lineTo(0,-110);

	ctxL.closePath();
	ctxL.stroke();
	ctxL.restore();
	ctxL.restore();
	ctxL.restore();

}
ctxL.restore();

clock();
$('.star').on('mouseup',function(){
	$(this).animate({
		top:'-=2',
		left:'-=2'
	},50);
});

$('.star').on('mousedown',function(){
	$(this).animate({
		top:'+=2',
		left:'+=2'
	},50);
});
});

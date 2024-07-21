

function grid(cxt) {
	// the first point is (30, 30)
	for (var i = 0; i < 9; i++) {
		cxt.beginPath();
		cxt.moveTo(0+59,   (i+1)*60);
		cxt.lineTo(600-59, (i+1)*60);
		cxt.stroke();
	}
	for (var i = 0; i < 9; i++) {
		cxt.beginPath();
		cxt.moveTo((i+1)*60,   0+59);
		cxt.lineTo((i+1)*60, 600-59);
		cxt.stroke();
	}

}
function ninePoints(cxt) {
	var np = new Array(
		[180,180],[300,180],[420,180],
		[180,300],[300,300],[420,300],
		[180,420],[300,420],[420,420]
	);
	
	for (var i = 0; i < np.length; i++) {
		//circle
		cxt.beginPath();
		cxt.arc(np[i][0],np[i][1],6,0,2*Math.PI,false);
		cxt.fillStyle="black";
		cxt.fill();
	}
}


var move_count = 0;
function mousedownHandler(e) {
	var x, y;
	if (e.offsetX || e.offsetX == 0) {
		x = e.offsetX; //- imageView.offsetLeft;
		y = e.offsetY; //- imageView.offsetTop;
	}
	if (x < 60-50 || x > 600-60)
		return;
	if (y < 60-50 || y > 600-60)
		return;
	
	var xok = false;
	var yok = false;
	var x_;
	var y_;
	for (var i = 1; i <= 9; i++) {
		if (x > i*60-30 && x < i*60+30) {
			x = i*60;
			xok = true;
			x_ = i - 1;
		}
		if (y > i*60-30 && y < i*60+30) {
			y = i*60;
			yok = true;
			y_ = i - 1;
		}
	}
	if (!xok || !yok)
		return;

	play(x_, y_, move_count);
	showPan();
	// now we put the new stone on the board
	/*
	move_count ++;
	var c = document.getElementById("weiqi");
	var cxt = c.getContext("2d");
	cxt.beginPath();
	cxt.arc(x,y,15,0,2*Math.PI,false);
	if (move_count % 2 == 1)
		cxt.fillStyle="black";
	else
		cxt.fillStyle="white";
	cxt.fill();
	*/
}

function mousemoveHandler(e) {
	var x, y;
	if (e.offsetX || e.offsetX == 0) {
		x = e.offsetX ;//- imageView.offsetLeft;
		y = e.offsetY ;//- imageView.offsetTop;
	}
	if (x < 60-20 || x > 600-60)
		return;
	if (y < 60-20 || y > 600-60)
		return;
	
	var xok = false;
	var yok = false;
	for (var i = 1; i <= 9; i++) {
		if (x > i*60-20 && x < i*60+20) {
			x = i*60;
			xok = true;
		}
		if (y > i*60-20 && y < i*60+20) {
			y = i*60;
			yok = true;
		}
	}
	if (!xok || !yok)
		return;

	var c = document.getElementById("path");
	var cxt = c.getContext("2d");

	// clear the path
	cxt.clearRect(0,0,600,600);

	// put a new Gray stone
	cxt.beginPath();
	cxt.arc(x,y,15,0,2*Math.PI,false);
	cxt.fillStyle="gray";
	cxt.fill();

	cxt.beginPath();
	cxt.arc(x,y,30,0,2*Math.PI,false);
	if (move_count % 2 == 0)
		cxt.fillStyle="black";
	else
		cxt.fillStyle="#e0e0e0";
	cxt.fill();
}

function mouseoutHandler(e) {
	var c = document.getElementById("path");
	var cxt = c.getContext("2d");
	cxt.clearRect(0,0,600,600);
}

function initBoard() {
	var c_path = document.getElementById("path");
	c_path.addEventListener('mousedown', mousedownHandler, false);
	c_path.addEventListener('mousemove', mousemoveHandler, false);
	c_path.addEventListener('mouseout', mouseoutHandler, false);

	var c_weiqi = document.getElementById("weiqi");
	var cxt = c_weiqi.getContext("2d");
	cxt.fillStyle = "silver";
	cxt.fillRect(0,0,600,600);

	grid(cxt);
	ninePoints(cxt);

	showPan();
}

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}
//window.addEventListener("load", initBoard, true);
addLoadEvent(initBoard);

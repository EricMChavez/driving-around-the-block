let path = document.getElementById('path');
let car = document.getElementById('car');
let step = 0;
let speed = 0;
let desiredSpeed = 6;
let direction = 'E'; //North, South, East, West
let velocity;
let velocityAverage;
let tick = null;

function go() {
	document.getElementById('car').style.display = 'none';
	clearInterval(tick);
	step = 0;
	drawPath();
	document.getElementById('car').style.display = 'inline-block';
	tick = setInterval(() => {
		followPath(step);
		undateSpeed();
		step += speed;
	}, 30);
}
function undateSpeed() {
	if (speed < desiredSpeed) {
		speed += (desiredSpeed - speed) / 30;
	} else {
		speed -= (speed - desiredSpeed) / 30;
	}
}
function anticipateSpeed(step) {
	let upcoming = document.elementFromPoint(path.getPointAtLength(step + 90).x, path.getPointAtLength(step + 90).y)
		.classList[1];
	switch (upcoming) {
		case 'turnTR':
		case 'turnBR':
		case 'turnBL':
		case 'turnTL':
			desiredSpeed = 5;
			break;
		case 'start':
		case 'horizontal':
		case 'vertical':
		case 'intersection':
			desiredSpeed = 8;
			break;
		case 'finish':
		case 'grass':
			desiredSpeed = 0;
			break;
	}
}
function setStart() {
	let startPoint = [];
	for (let x = 0; x < 5; x++) {
		startPoint.push([ path.getPointAtLength(step).x, path.getPointAtLength(step).y ]);
	}
	return startPoint;
}
function followPath(step) {
	if (step < path.getTotalLength() - 60) {
		let frontPoint = [ path.getPointAtLength(step + 90).x, path.getPointAtLength(step + 90).y ];
		let backPoint = [ path.getPointAtLength(step).x, path.getPointAtLength(step).y ];
		anticipateSpeed(step);
		velocityCalc(backPoint);
		setCar(backPoint, frontPoint);
	} else {
		clearInterval(tick);
	}
}
function velocityCalc(backPoint) {
	velocity.push([ backPoint[0], backPoint[1] ]);
	velocity.shift();
	let average = [ 0, 0 ];
	for (let point of velocity) {
		average[0] += point[0];
		average[1] += point[1];
	}
	velocityAverage = [ average[0] / 5 - velocity[4][0], average[1] / 5 - velocity[4][1] ];
}
function setCar(backPoint, frontPoint) {
	car.style.left = frontPoint[0] + 'px';
	car.style.top = frontPoint[1] - 18 + 'px';
	let rotation =
		Math.atan2(
			backPoint[1] - velocityAverage[1] * 2.5 - frontPoint[1],
			backPoint[0] - velocityAverage[0] * 2.5 - frontPoint[0]
		) *
		180 /
		Math.PI;
	car.style.transform = `rotate(${rotation}deg)`;
}

//
//  Draw Path
//
function drawPath() {
	let start = [
		document.getElementsByClassName('start')[0].offsetLeft,
		document.getElementsByClassName('start')[0].offsetTop + 50
	];
	let penPath = `M ${start} l 100,0`;
	let nextPoint = findNext(start[0] + 150, start[1]);
	for (;;) {
		penPath += nextPoint[1];
		if (nextPoint[0] == 'stop') break;

		nextPoint = findNext(nextPoint[0][0], nextPoint[0][1]);
	}
	path.setAttribute('d', penPath);
	velocity = setStart();
}
function findNext(currentX, currentY) {
	let nextLoca = [ 0, 0 ];
	let newPath = '';
	let currentBlock = document.elementFromPoint(currentX, currentY).classList[1];
	switch (currentBlock) {
		case 'turnTR':
			if (direction == 'E') {
				newPath = 'c 25,0 50,25 50,50 ';
				direction = 'S';
				nextLoca = [ currentX, currentY + 100 ];
				break;
			} else if (direction == 'N') {
				newPath = 'c 0,-25 -25,-50 -50,-50 ';
				direction = 'W';
				nextLoca = [ currentX - 100, currentY ];
				break;
			}
		case 'turnBR':
			if (direction == 'S') {
				newPath = 'c 0,25 -25,50 -50,50 ';
				direction = 'W';
				nextLoca = [ currentX - 100, currentY ];
				break;
			} else if (direction == 'E') {
				newPath = 'c 25,0 50,-25 50,-50 ';
				direction = 'N';
				nextLoca = [ currentX, currentY - 100 ];
				break;
			}
		case 'turnBL':
			if (direction == 'W') {
				newPath = 'c -25,0 -50,-25 -50,-50 ';
				direction = 'N';
				nextLoca = [ currentX, currentY - 100 ];
				break;
			} else if (direction == 'S') {
				newPath = 'c 0,25 25,50 50,50 ';
				direction = 'E';
				nextLoca = [ currentX + 100, currentY ];
				break;
			}
		case 'turnTL':
			if (direction == 'N') {
				newPath = 'c 0,-25 25,-50 50,-50 ';
				direction = 'E';
				nextLoca = [ currentX + 100, currentY ];
				break;
			} else if (direction == 'W') {
				newPath = 'c -25,0 -50,25 -50,50 ';
				direction = 'S';
				nextLoca = [ currentX, currentY + 100 ];
				break;
			}

		case 'horizontal':
		case 'intersection':
			if (direction == 'E') {
				newPath = 'l 100,0 ';
				nextLoca = [ currentX + 100, currentY ];
				break;
			} else if (direction == 'W') {
				newPath = 'l -100,0 ';
				nextLoca = [ currentX - 100, currentY ];
				break;
			}
		case 'vertical':
		case 'intersection':
			if (direction == 'N') {
				newPath = 'l 0,-100 ';
				nextLoca = [ currentX, currentY - 100 ];
				break;
			} else if (direction == 'S') {
				newPath = 'l 0,100 ';
				nextLoca = [ currentX, currentY + 100 ];
				break;
			}
		case 'grass':
			nextLoca = 'stop';
			newPath = '';
			alert('this is a stupid track!');
			break;
		case 'start':
			nextLoca = 'stop';
			newPath = 'Z';
			break;
		case 'finish':
			nextLoca = 'stop';
			newPath = 'l 100,0 ';
			break;
		default:
			nextLoca = 'stop';
			alert('this is a stupid track!');
	}
	return [ nextLoca, newPath ];
}
//
// Draggable
//
let dragTrack;
let tracks = document.getElementsByClassName('track');
let trackpallets = document.getElementsByClassName('trackpallet');
for (let trackpallet of trackpallets) {
	trackpallet.addEventListener('dragstart', dragStart);
	trackpallet.addEventListener('dragend', dragEnd);
}
for (let track of tracks) {
	track.addEventListener('dragover', dragOver);
	track.addEventListener('dragenter', dragEnter);
	track.addEventListener('dragleave', dragLeave);
	track.addEventListener('drop', drop);
}
function dragStart(e) {
	dragTrack = this.classList[1];
}
function dragEnter(e) {
	e.preventDefault();
}
function dragOver(e) {
	this.style.opacity = 0.5;
	e.preventDefault();
}
function dragLeave(e) {
	this.style.opacity = 1;
	e.preventDefault();
}

function dragEnd() {}
function drop(e) {
	e.preventDefault();
	this.style.opacity = 1;
	this.classList = `track ${dragTrack}`;
}

let path = document.getElementById('path');
let car = document.getElementById('car');
let display = document.getElementById('display');

function setCar(backPoint, frontPoint) {
	let offSet = [ frontPoint[0] - backPoint[0], frontPoint[1] - backPoint[1] ];
	let pointWeight = [ offSet[0] / (offSet[0] + offSet[1]), offSet[1] / (offSet[0] + offSet[1]) ];

	let midPoint = [ frontPoint[0] - 70 * pointWeight[0], frontPoint[1] - 70 * pointWeight[1] ];
	car.style.left = frontPoint[0] + 'px';
	car.style.top = frontPoint[1] - 18 + 'px';

	let rotation = Math.atan2(backPoint[1] - frontPoint[1], backPoint[0] - frontPoint[0]) * 180 / Math.PI;
	car.style.transform = `rotate(${rotation}deg)`;
}
window.onload = init;
function init() {
	if (window.Event) {
		document.captureEvents(Event.MOUSEMOVE);
	}
	document.onmousemove = getCursorXY;
}

function getCursorXY(e) {
	let cursorX = window.Event
		? e.pageX
		: event.clientX +
			(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	let cursorY = window.Event
		? e.pageY
		: event.clientY +
			(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	display.innerHTML = `${cursorX}, ${cursorY}`;
	setCar([ 0, 0 ], [ cursorX, cursorY ]);
}

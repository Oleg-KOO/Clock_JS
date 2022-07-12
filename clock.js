function SetAttr(attr){
	for (let a in attr) this.setAttribute(a, attr[a]);
}
	
function AddSVG(attr){
	let newSvg = this.appendChild(document.createElementNS('http://www.w3.org/2000/svg', attr.tag));
	if (attr.tag == 'text') { newSvg.innerHTML = attr.text; delete attr.text; }
	delete attr.tag; newSvg.SetAttr(attr);
	return newSvg;
}
	
function GetScaleLine (command, radius, count, passThrough, shift = 0, rotation = true){
	let pass = 1;
	for (let i = 360 / count; i <= 360; i += 360 / count)
	{
		if (pass >= passThrough) { pass = 1; continue; }
		pass++;
		let angel = -(i + 180) * Math.PI / 180;
		let line = command(i);
		line.SetAttr({transform: "translate(" + (radius * Math.sin(angel) - shift) + ", " + (radius * Math.cos(angel) + shift) + ")"});
			
		if (rotation)
			line.setAttribute('transform', line.attributes.transform.value + ' rotate(' + i + ', 0, 0)')
	}
}
	
function GetClockFace(draw, radius, radiusText){
	let clock = draw.AddSVG({'tag': 'g', 'class': "clock", 'shape-rendering': "crispEdges", 'stroke': "black", 'stroke-width': "1", 'fill': "none"});
	let circleClock = clock.AddSVG({'tag': 'g', 'class': "circleClock", 'stroke': "white", 'stroke-width': "1", 'fill': "silver"});
	let namber = clock.AddSVG({'tag': 'g', 'class': "namber", 'stroke': "green", 'stroke-width': "3", 'font-size': "200%"});
	let namberHead = clock.AddSVG({'tag': 'g', 'class': "namberHead", 'stroke': "red", 'stroke-width': "3", 'font-size': "250%"});
	let lineHead = clock.AddSVG({'tag': 'g', 'class': "lineHead", 'stroke': "red", 'stroke-width': "4"});
	let lineSecond = clock.AddSVG({'tag': 'g', 'class': "lineSecond", 'stroke': "black", 'stroke-width': "2"});

	let dimentionDivision = 10;
	let dimentionDivisionHead = 30;
	let shiftText = (radiusText - radius) / 6;
		
	let centralCircles = [radiusText + 40, radiusText + 30, radius - 20, radius - 30, 55, 50, 10];
	for (let centralCircle of centralCircles) circleClock.AddSVG({'tag': 'circle', 'r': (centralCircle),});
		
	GetScaleLine(function(){return lineSecond.AddSVG({tag: 'line', x1: 0, y1: -dimentionDivision, x2: 0, y2: 0})}, radius, 60, 5);
	GetScaleLine(function(){return namber.AddSVG({tag: 'line', x1: 0, y1: -dimentionDivisionHead, x2: 0, y2: 0})}, radius, 12, 3);
	GetScaleLine(function(){return lineHead.AddSVG({tag: 'line', x1: 0, y1: -dimentionDivisionHead, x2: 0, y2: 0})}, radius, 4);
	GetScaleLine(function(i){return namber.AddSVG({tag: 'text', text: i/30})}, radiusText, 12, 3, shiftText, false);
	GetScaleLine(function(i){return namberHead.AddSVG({tag: 'text', text: i/30})}, radiusText, 4, 20, shiftText, false);

	return clock;
}
	
function GetClockHands(draw, radius, radiusText){
	let hand = draw.AddSVG({'tag': 'g', 'class': 'hand'});
	let hourHand = hand.AddSVG({'tag': 'g', 'class': 'hourHand', 'stroke': "black", 'stroke-width': "2", 'fill': "red"});
	let minuteHand = hand.AddSVG({'tag': 'g', 'class': 'minuteHand', 'stroke': "black", 'stroke-width': "1", 'fill': "white"});
	let secondHand = hand.AddSVG({'tag': 'g', 'class': 'secondHand', 'stroke': "black", 'stroke-width': "1", 'fill': "black"});
		
	let dimension; let p;
		
	dimension = radius * 0.8;
	p = "-10,50" + " -5," + (-dimension + 25) + " -15," + (-dimension + 25) + " 0," + (-dimension) + " 15," + (- dimension + 25) + " 5," + (- dimension + 25) + " 10,50 -10,50";
	hourHand.AddSVG({tag: 'polyline', points: p});
		
	dimension = radius *0.9;
	p = "-10,50" + " -5," + (-dimension + 25) + " -15," + (-dimension + 25) + " 0," + (-dimension) + " 15," + (- dimension + 25) + " 5," + (- dimension + 25) + " 10,50 -10,50";
	minuteHand.AddSVG({tag: 'polyline', points: p});
	
	dimension = radius;
	p = "-5,80" + " -5," + (-dimension + 30) + " -10," + (-dimension + 30) + " 0," + (-dimension) + " 10," + (- dimension + 30) + " 5," + (- dimension + 30) + " 5,80 -5,80";
	secondHand.AddSVG({tag: 'polyline', points: p});
	
	let dimentionCenter = radius * 0.07; 
	let dim = radius * 0.08;
	secondHand.AddSVG({tag: 'circle', r: dim});
	//secondHand.AddSVG({tag: 'rect', width: dim, height: dim, transform: 'translate(-' + dim /2 + ', ' + (-dim/2) + ') rotate(45,' + dim /2 + ', ' + dim /2 + ')'});
	
	return { Hour: hourHand, Minute: minuteHand, Second: secondHand};	
}

function clockTic(hands) {
	let date = new Date();
	let hour = date.getHours();	if (hour > 12) hour = hour % 12;
	let min = date.getMinutes();
	let sec = date.getSeconds();
	let msec = date.getMilliseconds();
	hands.Hour.setAttribute('transform', "rotate(" + (hour * 30 + min / 2 + sec / 120) + ", 0, 0)");
	hands.Minute.setAttribute('transform', "rotate(" + (min * 6 + sec / 10) + ", 0, 0)");
	hands.Second.setAttribute('transform', "rotate(" + (sec * 6 + msec / 1000 * 6) + ", 0, 0)");
}
	
SVGElement.prototype.SetAttr = SetAttr;
SVGElement.prototype.AddSVG = AddSVG;
HTMLElement.prototype.AddSVG = AddSVG;
let divBox = document.getElementsByClassName('clock')[0];	
let draw1 = divBox.AddSVG({tag: 'svg', width: '100%', height: '100%', viewBox: '0 0 800 800'});
	
let radius = 280;
let radiusText = 350;
let myClock = GetClockFace(draw1, radius, radiusText);
let myHands = GetClockHands(myClock, radius, radiusText);
myClock.SetAttr({transform: "translate(400, 400)"});

clockTic(myHands);
let intervalSetTime = setInterval(function(){clockTic(myHands)}, 100);

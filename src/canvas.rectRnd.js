// Original implementation by http://www.supercalifrigginawesome.com/Extending-Canvas-to-Draw-Rounded-Rectangles "I'm not going to bother adding a license to the code, but if you use it I'd be happy to hear back about it."
// Extended to use different radii for each corner by Arran Schlosberg (https://github.com/aschlosberg/jquery-qrcode)

var canvasContextPrototype = Object.getPrototypeOf(document.createElement('canvas').getContext('2d'));

canvasContextPrototype.getCoordinates =
function(x, y, w, h, r){
	return { //note that tl is different to lt (tl is top line's left, lt is left line's top)
		tl : [x + (w/2)*r.tl, y],
		tr : [x+w - (w/2)*r.tr, y],
		rt : [x+w, y + (h/2)*r.tr],
		rb : [x+w, y+h - (h/2)*r.br],
		br : [x+w - (w/2)*r.br, y+h],
		bl : [x + (w/2)*r.bl, y+h],
		lb : [x, y+h - (h/2)*r.bl],
		lt : [x, y + (h/2)*r.tl],
		corners : { //earlier note is not relevant here
			tl : [x, y],
			tr : [x+w, y],
			br : [x+w, y+h],
			bl : [x, y+h]
		}
	}
}

canvasContextPrototype.parseRadii =
function(r){
	var defaultR = {tl:0, tr:0, br:0, bl:0}
	switch(typeof r){
		case "object":
			r = $.extend( {}, defaultR, r);
			break;
		case "string":
			try {
				r = parseFloat(r);
			}
			catch(e){
				r = 0;
			}
		// deliberately no break
		case "number":
			r = Math.min(Math.max(0, r), 1);
			r = {tl:r, tr:r, br:r, bl:r};
			break;
		default:
			r = defaultR;
			break;
	}
	return r;
}

canvasContextPrototype.fillRectRnd =
function(x, y, w, h, r){
	r = this.parseRadii(r);
	var c = this.getCoordinates(x, y, w, h, r);
	var cnr = c.corners;
	
	this.beginPath();
	this.moveTo(c['tl'][0], c['tl'][1]);
	this.lineTo(c['tr'][0], c['tr'][1]);
	this.quadraticCurveTo(cnr['tr'][0], cnr['tr'][1], c['rt'][0], c['rt'][1]);
	this.lineTo(c['rb'][0], c['rb'][1]);
	this.quadraticCurveTo(cnr['br'][0], cnr['br'][1], c['br'][0], c['br'][1]);
	this.lineTo(c['bl'][0], c['bl'][1]);
	this.quadraticCurveTo(cnr['bl'][0], cnr['bl'][1], c['lb'][0], c['lb'][1]);
	this.lineTo(c['lt'][0], c['lt'][1]);
	this.quadraticCurveTo(cnr['tl'][0], cnr['tl'][1], c['tl'][0], c['tl'][1]);
	this.closePath();
	this.fill();
}

canvasContextPrototype.fillRectRndNeg =
function(x, y, w, h, r){
	r = this.parseRadii(r);
	var c = this.getCoordinates(x, y, w, h, r);
	var cnr = c.corners;
	
	var negatives = [
		[cnr['tl'], c['tl'], c['lt']],
		[cnr['tr'], c['tr'], c['rt']],
		[cnr['br'], c['br'], c['rb']],
		[cnr['bl'], c['bl'], c['lb']]
	];
	
	for(var n in negatives){
		var neg = negatives[n];
		try {
			this.beginPath();
			this.moveTo(neg[0][0], neg[0][1]);
			this.lineTo(neg[1][0], neg[1][1]);
			this.quadraticCurveTo(neg[0][0], neg[0][1], neg[2][0], neg[2][1]);
			this.lineTo(neg[0][0], neg[0][1]);
			this.closePath();
			this.fill();
		}
		catch(e){
			//console.log('Negative rounded rectangle exception (index: '+n+'): '+e);
		}
	}
}

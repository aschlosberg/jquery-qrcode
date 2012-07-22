// Original implementation by http://www.supercalifrigginawesome.com/Extending-Canvas-to-Draw-Rounded-Rectangles "I'm not going to bother adding a license to the code, but if you use it I'd be happy to hear back about it."
// Extended to use different radii for each corner by Arran Schlosberg (https://github.com/aschlosberg/jquery-qrcode)

Object.getPrototypeOf(document.createElement('canvas').getContext('2d')).fillRectRnd =
function(x, y, w, h, r){
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
	this.beginPath();
	this.moveTo(x + (w/2)*r.tl, y);
	this.lineTo(x+w - (w/2)*r.tr, y);
	this.quadraticCurveTo(x+w, y, x+w, y + (h/2)*r.tr);
	this.lineTo(x+w, y+h - (h/2)*r.br);
	this.quadraticCurveTo(x+w, y+h, x+w - (w/2)*r.br, y+h);
	this.lineTo(x + (w/2)*r.bl, y+h);
	this.quadraticCurveTo(x, y+h, x, y+h - (h/2)*r.bl);
	this.lineTo(x, y + (h/2)*r.tl);
	this.quadraticCurveTo(x, y, x + (w/2)*r.tl, y);
	this.closePath();
	this.fill();
}

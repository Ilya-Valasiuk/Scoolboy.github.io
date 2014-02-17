/*This is a helper to set styles in js. We can modify it.*/
function Helper () {
	this.styleHelper = {
		width: 'px',
		height: 'px',
		className: '',
		background: '',
		src: '',
		right: 'px',
		left: 'px',
		bottom: 'px',
		top: 'px',
		position: '',
		webkitTransform: '',
		webkitTransition: '',
		overflow: '',
		cursor: '',
		display: '',
		backgroundImage: '',
		backgroundSize: ''
	};

	this.setProperty = function (obj, el) {
		for(var key in obj){
			if(key == 'className' || key == 'src'){ // we can modify this if if we have got a style that set's with out .style
				el[key] = obj[key] + this.styleHelper[key];
			} else {
				el.style[key] = obj[key] + this.styleHelper[key];
			}
		};
	};
}

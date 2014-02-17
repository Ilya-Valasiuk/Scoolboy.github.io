function Slider (res, configs) {

	var helper = new Helper();
	/*public variables */
	this.imageArr = res.images,
	this.image,
	this.nonVisibleWrapper,
	this.visibleWrapper,
	this.paginationToolBar;
	/*
	 * 	Update and set default settings
	 */
	this.updateSettings = function () {
		this.rotate = 360 / this.imageArr.length;
		this.tz = Math.round( ( configs['image'].width / 2 ) /Math.tan( Math.PI / + this.imageArr.length) );
		this.count = 1;
		this.countPagination = 1;
		this.activeNumber = 1;
	},
	/*
	* 	Create wrapper for slider
	*	@param {obj} conf with styles
	* 	@param {selector} insertInto selector where insert wrapper
	*/
	this.createDom = function (conf, insertInto) {
		this.visibleWrapper = document.createElement('div');
		this.nonVisibleWrapper = this.visibleWrapper.cloneNode();
		insertInto = insertInto || document.body;

		helper.setProperty(conf['visible'], this.visibleWrapper);
		helper.setProperty(conf['nonVisible'], this.nonVisibleWrapper);

		this.visibleWrapper.appendChild(this.nonVisibleWrapper);
		insertInto.appendChild(this.visibleWrapper);
	},
	/*
	*	Create buttons (left and right)
	*	@param {obj} conf with styles
	*/
	this.createButtons = function (conf) {
		var me = this;
		var rigthButton = document.createElement('div');
		var leftButton = rigthButton.cloneNode();
		rigthButton.innerHTML = "&#62";
		leftButton.innerHTML = "&#60";

		helper.setProperty(conf['right'], rigthButton);
		helper.setProperty(conf['left'], leftButton);

		this.visibleWrapper.appendChild(rigthButton);
		this.visibleWrapper.appendChild(leftButton);
		rigthButton.addEventListener('click', function () {
			me.setPrev(me);
		}, false);
		leftButton.addEventListener('click', function () {
			me.setNext(me);
		}, false);
	},
	/*
	*	Create and insert images to wrapper
	*	@param {array} arr with image url's
	*/
	this.createImage = function (arr) {
		var me = this;

		helper.setProperty({'webkitTransform':'translateZ(-'+this.tz+'px) rotateY('+this.rotate * this.activeNumber+'deg)'}, this.nonVisibleWrapper);

		if(!this.image){ // Work at first run. We create one image element. In next image we will clone it.
			this.image = document.createElement('img');
			helper.setProperty(configs['image'], this.image);
		}

		arr.forEach(function (url) {
			clone = me.image.cloneNode();
			helper.setProperty({'src':url, 'webkitTransform': 'rotateY(-'+me.rotate*me.count+'deg) translateZ('+me.tz+'px)'}, clone);
			clone.setAttribute('order', me.count++);
			me.nonVisibleWrapper.appendChild(clone);
		});
	},
	/*
	* 	Create pagination toolbar
	* 	@param {array} arr of images
	* */
	this.createPagination = function (arr) {
		var me = this;
		var item = document.createElement('div');
		this.paginationToolBar = document.createElement('div');
		helper.setProperty(configs['pagination'], this.paginationToolBar);
		helper.setProperty(configs['pagination_button'], item);
		arr.forEach(function (url){
			var paginationButton = item.cloneNode();
			paginationButton.setAttribute('order', me.countPagination++);
			helper.setProperty({'backgroundImage': 'url('+url+')', backgroundSize:'100% 100%'}, paginationButton);
			me.paginationToolBar.appendChild(paginationButton);
		});
		this.visibleWrapper.appendChild(this.paginationToolBar);
		this.paginationToolBar.addEventListener('click', function (e) {
			me.paginationToolBarLister(e, me)
		}, false);
	},
	/*
	* 	Called after adding or deleting image
	*
	* */
	this.updatePagination = function (){
		this.paginationToolBar.remove();
		this.createPagination(this.imageArr);
	},
	/*
	* 	Handling click to pagination toolbar
	* 	@param{obj}	e event
	* 	@param{obj} context of object
	* */
	this.paginationToolBarLister = function (e, context) {
		context = context || this;
		if(e && e.srcElement && e.srcElement.getAttribute('order')){
			context.navigate(Number(e.srcElement.getAttribute('order')));
		}
	},
	/*
	*	Set next image active
	*	@param {obj} context of object
	*/
	this.setNext = function (context) {
		context = context || this;
		var next = context.activeNumber + 1;
		helper.setProperty({'webkitTransform':'translateZ(-'+context.tz+'px) rotateY('+context.rotate * next+'deg)'}, this.nonVisibleWrapper);
		context.activeNumber = next;
	},
	/*
	*	Set previous image active
	*	@param {obj} context of object
	*/
	this.setPrev = function (context) {
		context = context || this;
		var prev = context.activeNumber - 1;
		helper.setProperty({'webkitTransform':'translateZ(-'+context.tz+'px) rotateY('+context.rotate * prev+'deg)'}, this.nonVisibleWrapper);
		context.activeNumber = prev;
	},
	/*
	*	Set active image by index
	*	@param {number} index of image
	*/
	this.navigate = function (index) {
		while(Math.abs(index) > this.imageArr.length)index = Math.abs(index) - this.imageArr.length ;
		index = (parseInt(this.activeNumber / this.imageArr.length) * this.imageArr.length) + index;
		interval = (index) * this.rotate;
		helper.setProperty({'webkitTransform':'translateZ(-'+this.tz+'px) rotateY('+interval+'deg)'}, this.nonVisibleWrapper);
		this.activeNumber = index;
	},
	/*
	*	Add image to slider and do layout
	*	@param {string} url of image
	*/
	this.add = function (url) {
		this.imageArr.push(url);
		this.updateLayout();
	},
	/*
	*	Delete image from slider and do layout
	*	@param {number} index of image
	*/
	this.delete = function (index) {
		this.imageArr.splice((index-1), 1);
		this.updateLayout();
	},
	/*
	*	Update layout
	*/
	this.updateLayout = function () {
		this.updateSettings();
		while(this.nonVisibleWrapper.firstChild) this.nonVisibleWrapper.firstChild.remove();
		this.createImage(this.imageArr);
		this.updatePagination();
	},
	/*
	* Init slider
	* @param {string} selector where we insert slider
	*/
	this.init = function (selector) {
		this.updateSettings();
		this.createDom({
			"visible": configs["visible"],
			"nonVisible": configs["nonVisible"]
		}, selector);
		this.createImage(this.imageArr);
		this.createButtons({
			'right': configs['right'],
			'left': configs['left']
		});
		this.createPagination(this.imageArr);
	}
}

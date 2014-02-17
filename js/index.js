/*The first that we need to do it's to load data */
(function loadData () {
  var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if(req.status == 200) {
				afterLoad(JSON.parse(req.responseText))
			}
		}
	};
	req.open('GET', 'http://scoolboy.github.io/conf.json', true);

	req.send(null);
})();

function afterLoad (response) {
	var conf = response.style;

	slider = new Slider(response, conf);

	slider.init();

//		API
//		slider.add(response.add);
//		slider.navigate(response.navigate);
//		slider.delete(response.delete);

// We can use a lot of sliders. Also we can set a lot of properties such as width, height, color, className...
// We can set styles from conf file (in our case it is conf.json) or from our obj and use it. We don't need to go css or html.
	slider2 = new Slider(response, conf);
	slider2.init();
}

function MenuList(){
	this.init();
}
MenuList.prototype.init = function() {
	var _this = this;
	_this.render();
};
MenuList.prototype.render = function(){
	var receipeDetails = {};
	var eventsArray = JSON.parse(localStorage.getItem('recipes'));
	var events = Object.keys(eventsArray);
	var sessionTitle;
	var renderHtml = [];
	for(var i=0; i<events.length; i++){
		renderHtml += '<div class="col-4 border-right bo">'
						+'<div class="row border-bottom">'
							+'<h4 class="col text-success">' + events[i] + '</h4>'
						+'</div>'
		var recipes = eventsArray[events[i]];
		for(var j=0; j<recipes.length; j++){
			renderHtml +=   '<div class="row border-bottom">'
						  +    '<h6 class="col-6 font-weight-bold"> ' + recipes[j].name + ' </h6>'
						  +    '<h6 class="col-6 font-weight-bold"> ' + recipes[j].count+ ' </h6>'
						  + '</div>'
		}		
	    renderHtml+= '</div>'
	}
	$(".cls_mainContainer").html(renderHtml);
}
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
		renderHtml += '<div class="col-4 border-right">'
						+'<div class="row">'
							+'<h4 class="col">' + events[i] + '</h4>'
						+'</div>'
		var recipes = eventsArray[events[i]];
		for(var j=0; j<recipes.length; j++){
			renderHtml +=   '<div class="row">'
						  +    '<div class="col-6"> ' + recipes[j].name + ' </div>'
						  +    '<div class="col-6"> ' + recipes[j].count+ ' </div>'
						  + '</div>'
		}		
	    renderHtml+= '</div>'
	}
	$(".cls_mainContainer").html(renderHtml);
}
function renderPL(plToGenerate){
	//this.dummy_PLData = {maligai : [{name: "sugar", quantity: 101, unit: "gram"}, {name: "oil", quantity: 404, unit: "ml"}, {name: "ulundhu", quantity: 808, unit: "gram"}], "kaikanigal" : [{name: "maavu", quantity: 20, unit: "kilo"}]};
	this.dummy_PLData = plToGenerate;
	this.init();
}

renderPL.prototype.init = function() {
	var _this = this;
	_this.render();
	_this.registerEvents();
}

renderPL.prototype.render = function() {
	var _this = this;

	var renderHtml = [];
	var cat_maligai = _this.dummy_PLData.maligai;
	var cat_kaikanigal = _this.dummy_PLData.kaikanigal;
	var cat_suppliments = _this.dummy_PLData.suppliments;
	var cat_extras = _this.dummy_PLData.extras;
	
	if(cat_maligai && cat_maligai.length>0){
		renderHtml += "<div class='list-group col-9 text-center'>"
						+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
							+ "Maligai"

					for(var j=0; j<cat_maligai.length ; j++){
						renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_maligai_"+ j +"'>"
										+ "<span class='col-4 px-3'><input type='text' class='col-4 form-control' name='name' value='"+cat_maligai[j].name+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='quantity' value='"+cat_maligai[j].quantity+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='unit' value='"+cat_maligai[j].unit+"' style='display:inline'></span>"
										+ "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
									+ "</a>"
					}
		renderHtml += "</a>"
				   + "</div><br><br>"
	}

	if(cat_kaikanigal && cat_kaikanigal.length>0){
		renderHtml += "<div class='list-group col-9 text-center'>"
						+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
							+ "Kai Kanigal"

					for(var j=0; j<cat_kaikanigal.length ; j++){
						renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_kaikanigal_"+ j +"'>"
										+ "<span class='col-4 px-3'><input type='text' class='col-4 form-control' name='name' value='"+cat_kaikanigal[j].name+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='quantity' value='"+cat_kaikanigal[j].quantity+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='unit' value='"+cat_kaikanigal[j].unit+"' style='display:inline'></span>"
										+ "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
									+ "</a>"
					}
		renderHtml += "</a>"
				   + "</div><br><br>"
	}

	if(cat_suppliments && cat_suppliments.length>0){
		renderHtml += "<div class='list-group col-9 text-center'>"
						+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
							+ "suppliments"

					for(var j=0; j<cat_suppliments.length ; j++){
						renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_suppliments_"+ j +"'>"
										+ "<span class='col-4 px-3'><input type='text' class='col-4 form-control' name='name' value='"+cat_suppliments[j].name+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='quantity' value='"+cat_suppliments[j].quantity+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='unit' value='"+cat_suppliments[j].unit+"' style='display:inline'></span>"
										+ "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
									+ "</a>"
					}
		renderHtml += "</a>"
				   + "</div>"
	}

	if(cat_extras && cat_extras.length>0){
		renderHtml += "<div class='list-group col-9 text-center'>"
						+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
							+ "extras"

					for(var j=0; j<cat_extras.length ; j++){
						renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_extras_"+ j +"'>"
										+ "<span class='col-4 px-3'><input type='text' class='col-4 form-control' name='name' value='"+cat_extras[j].name+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='quantity' value='"+cat_extras[j].quantity+"' style='display:inline'></span>"
										+ "<span class='col-2 px-3'><input type='text' class='col-2 form-control' name='unit' value='"+cat_extras[j].unit+"' style='display:inline'></span>"
										+ "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
									+ "</a>"
					}
		renderHtml += "</a>"
				   + "</div>"
	}

	$("#id_plWrapper").append(renderHtml);
}

renderPL.prototype.registerEvents = function() {
	var _this = this;
	
	$(document).ready(function(){
		$(document).on("click", ".cls_removeCurrentIngMap", function(){
			$(this).parents('.cls_ingredientCont').remove();
		});
	});
	
};
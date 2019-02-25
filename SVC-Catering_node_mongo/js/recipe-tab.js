function RecipeTab(){
	this.recipeCategory = ["Sweet", "HomeSweet", "Kaaram", "Idly", "Dhosa", "Chattni", "Sambar", "Kulambu", "Gravy",
		                  "Rotty", "Biriyani", "Pachadi", "Saadam", "Oorugaai", "Baanam", "Snacks"];
	this.init();
}
RecipeTab.prototype.init = function() {
	var _this = this;
	_this.render();
	_this.registerEvents();
};
RecipeTab.prototype.render = function() {
	var _this = this;
	addOptionsToSelect(_this.recipeCategory, "id_selectRecipeCategory");
	addOptionsToSelect(_this.recipeCategory, "id_recipeCategory");
	addOptionsToSelect(ingredientCategories, "id_ingredientCategory_recipe");

	var recipeJson = {"Snacks" : [
								{
									"id" : 1,
									"name": "samosa", "tamilName": "சம ோசோ",
										"Ingredients": [
										{
										"id" : 7,
										"name" : "oil", "tamilName" : "எண்ணெய்",
										"quantity": "500",
										"unitofmeasure": "millilitre"
										},
										{
										"id" : 6,
										"name" : "onion", "tamilName" : "ணெங்காயம்",
										"quantity": "100",
										"unitofmeasure": "count"
										},
										{
										"id" : 5,
										"name": "potato", "tamilName" : "உருளைக்கிழங்கு",
										"quantity": "200",
										"unitofmeasure": "count"
										}
										],
									"headCount": 100
								},
								{
									"id" : 2,
									"name": "samosa", "tamilName": "சம ோசோ",
										"Ingredients": [
										{
										"id" : 7,
										"name" : "oil", "tamilName" : "எண்ணெய்",
										"quantity": "500",
										"unitofmeasure": "millilitre"
										},
										{
										"id" : 6,
										"name" : "onion", "tamilName" : "ணெங்காயம்",
										"quantity": "100",
										"unitofmeasure": "count"
										},
										{
										"id" : 5,
										"name": "potato", "tamilName" : "உருளைக்கிழங்கு",
										"quantity": "200",
										"unitofmeasure": "count"
										}
										],
									"headCount": 100
								}
								],
								"Sweet" : [
								{
									"id" : 1,
									"name": "samosa", "tamilName": "சம ோசோ",
										"Ingredients": [
										{
										"id" : 7,
										"name" : "oil", "tamilName" : "எண்ணெய்",
										"quantity": "500",
										"unitofmeasure": "millilitre"
										},
										{
										"id" : 6,
										"name" : "onion", "tamilName" : "ணெங்காயம்",
										"quantity": "100",
										"unitofmeasure": "count"
										},
										{
										"id" : 5,
										"name": "potato", "tamilName" : "உருளைக்கிழங்கு",
										"quantity": "200",
										"unitofmeasure": "count"
										}
										],
									"headCount": 100
								},
								{
									"id" : 2,
									"name": "samosa", "tamilName": "சம ோசோ",
										"Ingredients": [
										{
										"id" : 7,
										"name" : "oil", "tamilName" : "எண்ணெய்",
										"quantity": "500",
										"unitofmeasure": "millilitre"
										},
										{
										"id" : 6,
										"name" : "onion", "tamilName" : "ணெங்காயம்",
										"quantity": "100",
										"unitofmeasure": "count"
										},
										{
										"id" : 5,
										"name": "potato", "tamilName" : "உருளைக்கிழங்கு",
										"quantity": "200",
										"unitofmeasure": "count"
										}
										],
									"headCount": 100
								}
								]
							}
    
	var catagoryJson;
	var renderHtml = [];
	for (var i =0; i<_this.recipeCategory.length; i++ ) {
		catagoryJson = recipeJson[_this.recipeCategory[i]];
		if(catagoryJson){
			renderHtml += "<div class='list-group col-11'>"
							+ "<a href='' class='list-group-item list-group-item-action cls_recipeCateory active'>"
								+ _this.recipeCategory[i]

						for(var j=0; j<catagoryJson.length ; j++){
							renderHtml += "<a href='' class='list-group-item list-group-item-action'>"
											+ "<label class='col-4'>" + catagoryJson[j].name +"</label>"
											+ "<label class='col-4'>" + catagoryJson[j].tamilName +"</label>"
											+ "<label class='btn btn-secondary btn-md mr-3 col-2 text-center cls_delete'>Delete</label>"
										+ "</a>"
						}
			renderHtml += "</a>"
					   + "</div>"
		}
	}
	$("#id_recipeContent_tab").append(renderHtml);
};

RecipeTab.prototype.registerEvents = function() {
	var _this = this;
	$(document).ready(function(){
		$(document).on("click", ".cls_addIngredient_sf", function(){
			var elemToAdd = $(_this.getIngredientMapRow());
			cloneDOM(elemToAdd, $('.createRecipeIngredientMap'));
			/*addOptionsToSelectViaElem(_this.dummyRecipies, $('.cls_receipeCategory_sf')[$('.cls_receipeCategory_sf').length-1]);*/
		});
	});
};

RecipeTab.prototype.getIngredientMapRow = function() {
	var _this = this;
	var renderHtmlMapRow = [];
	
	renderHtmlMapRow += '    <div class="row ingredientMapRow mt-2 mb-1">'
		              + '        <div class="col">'
		              + '                <select class="form-control" id="id_ingredientCategory_recipe" name="ingredientCategory"></select>'
		              + '        </div>'
		              + '        <div class="col">'
		              + '            <select class="form-control" id="id_ingredientName_recipe" name="ingredientName"></select>'
		              + '        </div>'
		              + '        <div class="col">'
		              + '            <select class="form-control" id="id_ingredientUnit_recipe" name="ingredientUnit" disabled></select>'
		              + '        </div>'
		              + '		 <div class="col">'
		              + '			 <input type="text" class="form-control" required id="id_qunatity_recipe" placeholder="Enter Quantity" name="qunatity">'
		              + '		 </div>'
		              + '		 <div class="col">'
		              + '		     <button class="btn btn-success cls_addIngredient_sf">Add</button>'
		              + '		 </div>'
		              + '        <div class="col">'
		  			  +             ($('.ingredientMapRow').length>0 ? '<i class="fa fa-minus-circle cls_removeCurrentIngredientMap" style="font-size:25px;color:red"></i>' : '')
		  			  + '        </div>'
		              + '	</div>';
			
	return renderHtmlMapRow;
};

module.exports.RecipeTab = RecipeTab;
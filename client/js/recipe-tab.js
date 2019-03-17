function RecipeTab(){
	this.recipeCategory = ["Sweet", "HomeSweet", "Kaaram", "Idly", "Dhosa", "Chattni", "Sambar", "Kulambu", "Gravy",
		                  "Rotty", "Biriyani", "Pachadi", "Saadam", "Oorugaai", "Baanam", "Snacks"];
	this.recipeFilters = ["All", "Sweet", "HomeSweet", "Kaaram", "Idly", "Dhosa", "Chattni", "Sambar", "Kulambu", "Gravy",
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

	var allIngredientNames = getIngredientNamesByCategory(ingredientJson);
	addOptionsToSelect(_this.recipeFilters, "id_selectRecipeCategory");
	addOptionsToSelect(_this.recipeCategory, "id_recipeCategory");
	addOptionsToSelect(ingredientCategories, "id_ingredientCategory_recipe");
	addOptionsToSelect(allIngredientNames, "id_ingredientName_recipe");
	addOptionsToSelect(ingredientUnits, "id_ingredientUnit_recipe");

	_this.recipeJson = {};

	showLoading();
	$.ajax({
    	url: "/getRecipe?category=all",
    	type: "get",
    	success: function(result){
    		hideLoading();
    		if(result && result[0] && result[0].Recipe && result[0].Recipe.length > 0)
    		{
	    		_this.recipeJson = result[0].Recipe;
	    		//delete _this.recipeJson["_id"];
	    	}
			_this.renderRecipe("All");
		},
		error: function(){
			hideLoading();
		    alert('Failed to fetch Recipe.. Please Try again later..');
		}
	});
};

RecipeTab.prototype.renderRecipe = function(recipeCat) {
	var _this = this;

	$(".cls_recipeList").html('');

	if(recipeCat!="All")
	{
		$(".cls_recipeList").append(_this.renderRecipeByCategory(recipeCat, getRecipeByCategory(_this.recipeJson, recipeCat)));
	}
	else
	{
		_this.renderAllRecipe();
	}
};

RecipeTab.prototype.renderAllRecipe = function() {
	var _this = this;

	var renderHtml = [];
		for (var i =0; i<_this.recipeCategory.length; i++ ) 
		{
			var categoryName = _this.recipeCategory[i];
			catagoryJson = getRecipeByCategory(_this.recipeJson, categoryName);
			renderHtml += _this.renderRecipeByCategory(categoryName, catagoryJson, true);
		}
		$(".cls_recipeList").append(renderHtml);
};

RecipeTab.prototype.renderRecipeByCategory = function(recipeCat, catagoryJson, isAll) {
	var _this = this;

	var renderHtml = [];
	if(catagoryJson){
		renderHtml += "<div class='list-group col-11'>"
						+ "<a class='list-group-item list-group-item-action cls_recipeCateory active text-center h5 text-white font-weight-bold'>"
							+ recipeCat

					for(var j=0; j<catagoryJson.length ; j++){
						renderHtml += "<a class='list-group-item list-group-item-action cls_recipeCont recipe_"+ catagoryJson[j].id +"'>"
										+ "<label class='col-3'>" + catagoryJson[j].name +"</label>"
										+ "<label class='col-3'>" + catagoryJson[j].tamilName +"</label>"
										+ "<label class='col-3'>" + catagoryJson[j].headCount +"</label>"
										+ "<label class='btn btn-primary btn-md mr-3 mb-0 col-1 text-center cls_editRecipe' idx='" + catagoryJson[j].id +"' data-toggle='modal' data-target='#recipeModal'>Edit</label>"
										+ "<label class='btn btn-secondary btn-md mr-3 mb-0 col-1 text-center cls_deleteRecipe' idx='" + catagoryJson[j].id +"' name='" + catagoryJson[j].name +"'>Delete</label>"
									+ "</a>"
					}
		renderHtml += "</a>"
				   + "</div><br><br>"
	}
	else if(!isAll)
	{
		renderHtml += "<a class='list-group-item list-group-item-action cls_recipeCont'>"
						   + "<label class='col-12 text-center'>No Recipe in this Category</label>"
						   + "</a>";
	}
	return renderHtml;
};

RecipeTab.prototype.renderSearchResults = function(searchResRecipe) {
	var _this = this;

	var renderHtml = [];
	renderHtml += "<div class='list-group col-11'>"
					+ "<a class='list-group-item list-group-item-action cls_recipeCateory active text-center h5 text-white font-weight-bold'>"
						+ "Search Results";

			if(searchResRecipe && searchResRecipe.length>0)
			{
				for(var j=0; j<searchResRecipe.length ; j++){
					renderHtml += "<a class='list-group-item list-group-item-action cls_recipeCont recipe_"+ searchResRecipe[j].id +"'>"
									+ "<label class='col-3'>" + searchResRecipe[j].name +"</label>"
									+ "<label class='col-3'>" + searchResRecipe[j].tamilName +"</label>"
									+ "<label class='col-1'>" + searchResRecipe[j].headCount +"</label>"
									+ "<label class='col-2'>" + searchResRecipe[j].itemCategory +"</label>"
									+ "<label class='btn btn-primary btn-md mr-3 mb-0 col-1 text-center cls_editRecipe' idx='" + searchResRecipe[j].id +"' data-toggle='modal' data-target='#recipeModal'>Edit</label>"
									+ "<label class='btn btn-secondary btn-md mr-3 mb-0 col-1 text-center cls_deleteRecipe' idx='" + searchResRecipe[j].id +"' name='" + searchResRecipe[j].name +"'>Delete</label>"
								+ "</a>";
				}
			}
			else
			{
				renderHtml += "<a class='list-group-item list-group-item-action cls_recipeCont'>"
						   + "<label class='col-12 text-center'>No Matching Recipe</label>"
						   + "</a>";
			}
	renderHtml += "</a>"
			   + "</div><br><br>";
	return renderHtml;
};

RecipeTab.prototype.resetRecipeModal = function() {
	var _this = this;

	/*var modal = $("#recipeModal");	
	$("#id_recipeName", modal).val("");
	$("#id_recipeTamilName", modal).val("");
	$('#id_recipeCategory').val($("#id_recipeCategory option:first").val()).trigger('change');
	$("#id_recipeHeadCount", modal).val("");*/

	for(var i=1; i<$('.cls_ingredientMapRow').length; i++)
	{
		$($('.cls_ingredientMapRow')[i]).remove();
	}

	$($('.cls_ingredientCategory_recipe')[0]).val($(".cls_ingredientCategory_recipe option:first").val()).trigger('change');
};	

RecipeTab.prototype.renderIngListForRecipe = function(IngredientsListForRecipe) {
	var _this = this;
	
	if(IngredientsListForRecipe && IngredientsListForRecipe.length>0)
	{
		for(var i=1; i<IngredientsListForRecipe.length; i++)
		{
			$(".cls_addIngredient").click();
		}

		for(var j=0; j<IngredientsListForRecipe.length; j++)
		{
			var curIngredientObj = getIngredientById(ingredientJson, IngredientsListForRecipe[j].id);

			if(curIngredientObj && !$.isEmptyObject(curIngredientObj))
			{
				$($('.cls_ingredientCategory_recipe')[j]).val(curIngredientObj.categoryName).trigger('change');
				$($('.cls_ingredientName_recipe')[j]).val(curIngredientObj.name).trigger('change');
				$($('.cls_ingredientQunatity_recipe')[j]).val(IngredientsListForRecipe[j].quantity);
				$($('.cls_ingredientUnit_recipe')[j]).val(IngredientsListForRecipe[j].unit).trigger('change');
				/*var ingredientUnits = getIngredientUnitsByName(ingredientJson, curIngredientObj.name);
				var unitToPopulate = getSuitableUnit(ingredientUnits, curIngredientObj);
				$('.cls_ingredientUnit_recipe')[j].val(unitToPopulate);*/
			}
		}
	}
};

RecipeTab.prototype.getIngredientMapRow = function() {
	var _this = this;
	var renderHtmlMapRow = [];
	
	renderHtmlMapRow += '    <div class="row cls_ingredientMapRow mt-2 mb-1">'
		              + '        <div class="col-3">'
		              + '                <select class="form-control cls_ingredientCategory_recipe" id="id_ingredientCategory_recipe" name="ingredientCategory">'
		              +'                     <option>--Select All--</option>'
		              +'                 </select>'
		              + '        </div>'
		              + '        <div class="col-4">'
		              + '            <select class="form-control cls_ingredientName_recipe" id="id_ingredientName_recipe" name="ingredientName"></select>'
		              + '        </div>'
		              + '		 <div class="col-2">'
		              + '			 <input type="text" class="form-control cls_ingredientQunatity_recipe" required id="id_ingredientQunatity_recipe" placeholder="Enter Quantity" name="qunatity">'
		              + '		 </div>'
		              + '        <div class="col-2">'
		              + '            <select class="form-control cls_ingredientUnit_recipe" id="id_ingredientUnit_recipe" name="ingredientUnit"></select>'
		              + '        </div>'
		              + '        <div class="col-1">'
		  			  +             ($('.cls_ingredientMapRow').length>0 ? '<i class="fa fa-minus-circle cls_removeCurrentIngredientMap" title= "Remove" style="font-size:25px;color:red;cursor:pointer"></i>' : '')
		  			  + '        </div>'
		              + '	</div>';
			
	return renderHtmlMapRow;
};

RecipeTab.prototype.constructIngArrForRecipe = function() {
	var _this = this;
	var ingMapToReturn = [];
	
	if($('#recipeModal .createRecipeIngredientMap'))
	{
		var elems = $('#recipeModal .createRecipeIngredientMap').find('.cls_ingredientMapRow');

		if(elems && elems.length>0)
		{
			$.each( elems, function( index, elem ) {
				var currIngRow = {};
				var currElem = $(elem);
				currIngRow["category"] = currElem.find('#id_ingredientCategory_recipe').val();
				currIngRow["name"] = currElem.find('#id_ingredientName_recipe').val();
				currIngRow["id"] = getIngredientIdByNameAndCat(ingredientJson, currIngRow["name"], currIngRow["category"]);
				currIngRow["quantity"] = currElem.find('#id_ingredientQunatity_recipe').val();
				currIngRow["unit"] = currElem.find('#id_ingredientUnit_recipe').val();
				ingMapToReturn.push(currIngRow);
			});
		}
	}
			
	return ingMapToReturn;
};

RecipeTab.prototype.registerEvents = function() {
	var _this = this;

	$(document).ready(function(){

		$(document).on("click", ".cls_addIngredient", function(){
			var elemToAdd = $(_this.getIngredientMapRow());
			cloneDOM(elemToAdd, $('.createRecipeIngredientMap'));
			addOptionsToSelectViaElem(ingredientCategories, $('.cls_ingredientCategory_recipe')[$('.cls_ingredientCategory_recipe').length-1]);
			var allIngredientNames = getIngredientNamesByCategory(ingredientJson);
			addOptionsToSelectViaElem(allIngredientNames, $('.cls_ingredientName_recipe')[$('.cls_ingredientName_recipe').length-1]);
			addOptionsToSelectViaElem(ingredientUnits, $('.cls_ingredientUnit_recipe')[$('.cls_ingredientUnit_recipe').length-1]);
		}); 
		
		$(document).on("change", ".cls_ingredientCategory_recipe", function(){
			var category = $(this).val();
			var ingredientNames = getIngredientNamesByCategory(ingredientJson, category);
			$(this).closest('.cls_ingredientMapRow').find("#id_ingredientName_recipe option").remove();
			addOptionsToSelectViaElem(ingredientNames, $($(this).closest('.cls_ingredientMapRow').find("#id_ingredientName_recipe"))[0]);
			$($(this).closest('.cls_ingredientMapRow').find("#id_ingredientName_recipe")).trigger("change");
		});
		
		$(document).on("change", ".cls_ingredientName_recipe", function(){
			var name = $(this).val();
			var ingredientUnits = getIngredientUnitsByName(ingredientJson, name);
			$(this).closest('.cls_ingredientMapRow').find("#id_ingredientUnit_recipe option").remove();
			addOptionsToSelectViaElem(ingredientUnits, $($(this).closest('.cls_ingredientMapRow').find("#id_ingredientUnit_recipe"))[0]);
		});
		
		$(document).on("click", ".cls_removeCurrentIngredientMap", function(){
			$(this).parents('.cls_ingredientMapRow').remove();
		});

		$('#recipeModal').on('hidden.bs.modal', function () {
		    $(this).find('form').trigger('reset');
		    _this.resetRecipeModal();
		});

		$(document).on('click', '.cls_deleteRecipe', function(){
			var idx = $(this).attr("idx");
	        var curRecipeObj = getRecipeObjById(_this.recipeJson, idx);
	        if(curRecipeObj && !$.isEmptyObject(curRecipeObj))
	        {
	    	    var id = curRecipeObj.id;
	    	    var name = curRecipeObj.name;
	    	    var tamilName = curRecipeObj.tamilName;
	    	    $("#confirmationPopup").find('.modal-title').text("Are you sure to delete this Recipe "+ tamilName +" ("+name+")?");
    			$("#confirmationPopup").modal('show');
    			$("#confirmationPopup").data("idToDelete", id);
    			$("#confirmationPopup").data("module", "Recipe");
	        }
	        else
	        {
	        	$("#errorPopup").find('.modal-title').text('Failed to get Recipe details for Delete. Please Try again later.');
			    $("#errorPopup").modal('show');
	        }
		});	

		$("#id_selectRecipeCategory").change(function() {
	    	_this.renderRecipe($("#id_selectRecipeCategory").val());
	    	$("#id_searchRecipeCategory").val("");
		});

		$("#id_searchRecipeCategory").keyup(function() {
	    	var searchKeyword = $(this).val().trim();
	    	if(searchKeyword.length>0)
	    	{
		    	$(".cls_recipeList").html('');
		    	var results = getRecipeByName(_this.recipeJson, searchKeyword);
		    	$(".cls_recipeList").append(_this.renderSearchResults(results));
		    }
		    else
		    {
		    	_this.renderRecipe("All");
		    }
		    $("#id_selectRecipeCategory").val("All");
		});

		$(".cls_saveRecipe").click(function() {
	    	
	    	var dialogName = $(".modal-title", $("#recipeModal")).text();
	    	
	    	if(dialogName.indexOf("Edit")>-1)	//Edit Scenario
	    	{
	    		var recipeJsonToCreate = {};
	    		var targetIndex = getIndexForIdForRecipe(_this.recipeJson, $("#recipeModal").data("idToEdit"));
	    		var reqKey = "Recipe."+targetIndex;

	    		if(targetIndex != -1)
	    		{
	    			showLoading();
		    		recipeJsonToCreate[reqKey] =
		    		{
			    		"id": $("#recipeModal").data("idToEdit"),
				        "name": $("#id_recipeName").val(),
				        "tamilName": $("#id_recipeTamilName").val(),
				        "itemCategory": $("#id_recipeCategory").val(),
				        "headCount": $("#id_recipeHeadCount").val(),
				        "Ingredients": _this.constructIngArrForRecipe()
				    };
			        $.ajax({
			        	url: "/editRecipe",
		            	type: "post",
		            	contentType: 'application/json',
		            	data: JSON.stringify(recipeJsonToCreate),
			        	success: function(result){
			        		hideLoading();
			        		if(result.nModified && result.nModified>0)
			        		{
								$("#successPopup").find('.modal-title').text("Recipe Updated Successfully");
			        			$("#successPopup").modal('show');
				        	}
			        		else
			        		{
				        		$("#errorPopup").find('.modal-title').text('Failed to Modify Recipe. Please Try again later.');
			        			$("#errorPopup").modal('show');
				        	}
			        		$('#recipeModal .close').click();
						},
						error: function(){
							hideLoading();
						    $("#errorPopup").find('.modal-title').text('Failed to Edit Recipe. Please Try again later.');
			        		$("#errorPopup").modal('show');
			        		$('#recipeModal .close').click();
						}
					});
			    }
			    else
			    {
			    	$("#errorPopup").find('.modal-title').text('Failed to Edit Recipe. Please Try again later..!');
	        		$("#errorPopup").modal('show');
	        		$('#recipeModal .close').click();
			    }
	    	}
	    	else	//Create Scenario
	    	{
	    		showLoading();
	    		var recipeJsonToCreate = {};
	    		recipeJsonToCreate["Recipe"] =
	    		{
		    		"id": getNextId(_this.recipeJson, "Recipe"),
			        "name": $("#id_recipeName").val(),
			        "tamilName": $("#id_recipeTamilName").val(),
			        "itemCategory": $("#id_recipeCategory").val(),
			        "headCount": $("#id_recipeHeadCount").val(),
			        "Ingredients": _this.constructIngArrForRecipe()
			    };
		        $.ajax({
		        	url: "/createRecipe",
	            	type: "post",
	            	contentType: 'application/json',
	            	data: JSON.stringify(recipeJsonToCreate),
		        	success: function(result){
		        		hideLoading();
		        		if(result.nModified && result.nModified>0)
		        		{
							$("#successPopup").find('.modal-title').text("Recipe Created Successfully");
		        			$("#successPopup").modal('show');
			        	}
		        		else
		        		{
			        		$("#errorPopup").find('.modal-title').text('Failed to Create New Recipe. Please Try again later.');
		        			$("#errorPopup").modal('show');
			        	}
		        		$('#recipeModal .close').click();
					},
					error: function(){
						hideLoading();
					    $("#errorPopup").find('.modal-title').text('Failed to Create Recipe. Please Try again later.');
		        		$("#errorPopup").modal('show');
		        		$('#recipeModal .close').click();
					}
				});
	    	}
	    });
		
		/*$(".cls_deleteRecipe").click(function() {
	       var idx = $(this).attr("idx");
	       var name = $(this).attr("name");
	       var parent = $(this).parent().parent();
	       var isDelete = confirm("You wish to delete the recipe "+name+" ?");
	       if (isDelete == true) {
	         $(".recipe_"+idx).remove();
	         if(parent.find(".cls_recipeCont").length == 0) {
	        	 parent.remove()
	         }
	       }
	    });*/
			
		$(".cls_createRecipe").click(function() {
			var modal = $("#recipeModal");
	        $(".modal-title", modal).text("Create Recipe");
    	    $(".cls_recipeId", modal).val("");
    	    $(".cls_recipeTamilName", modal).val("");
	    });

		$(document).on('click', '.cls_editRecipe', function(){
			var modal = $("#recipeModal");	        
		    var idx = $(this).attr("idx");
	        var curRecipeObj = getRecipeObjById(_this.recipeJson, idx);
	        if(curRecipeObj && !$.isEmptyObject(curRecipeObj))
	        {
	    	    var name = curRecipeObj.name;
	    	    var tamilName = curRecipeObj.tamilName;
	    	    var categoryName = curRecipeObj.itemCategory;
	    	    var headCount = curRecipeObj.headCount;
	    	    var IngredientsListForRecipe = curRecipeObj.Ingredients;
	    	    var modal = $("#recipeModal");
	    	    $(".modal-title", modal).text("Edit Recipe");
				modal.data("idToEdit",idx);
	    	    $("#id_recipeName", modal).val(name);
	    	    $("#id_recipeTamilName", modal).val(tamilName);
	    	    $("#id_recipeCategory", modal).val(categoryName);
	    	    $("#id_recipeHeadCount", modal).val(headCount);
	    	    _this.renderIngListForRecipe(IngredientsListForRecipe);
	        }
	    });

	});
};
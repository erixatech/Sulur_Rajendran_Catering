function IngredientTab(){
	this.init();
}
IngredientTab.prototype.init = function() {
	var _this = this;
	_this.render();
	_this.registerEvents();
};
IngredientTab.prototype.render = function() {
	var _this = this;
	addOptionsToSelect(ingredientFilters, "id_selectIngredientCategory")
	addOptionsToSelect(ingredientCategories, "id_ingredientCategory");
	addOptionsToSelect(ingredientUnits, "id_ingredientUnit");

	showLoading();
	$.ajax({
    	url: "/getIngredients?category=all",
    	type: "get",
    	success: function(result){
    		hideLoading();
    		if(result && result.length == 1)
    		{	    		
	    		ingredientJson = result[0];
	    		delete ingredientJson["_id"];
	    	}
			_this.renderIngredients("All");
		},
		error: function(){
			hideLoading();
		    alert('Failed to fetch Ingredients.. Please Try again later..');
		}
	});
};

IngredientTab.prototype.renderIngredients = function(ingCat) {
	var _this = this;

	$(".cls_ingredientsList").html('');

	if(ingCat!="All")
	{
		$(".cls_ingredientsList").append(_this.renderIngredientsByCategory(ingCat, ingredientJson[ingCat]));
	}
	else
	{
		_this.renderAllIngredients();
	}
};

IngredientTab.prototype.renderAllIngredients = function() {
	var _this = this;

	var renderHtml = [];
		for (var i =0; i<ingredientCategories.length; i++ ) 
		{
			var categoryName = ingredientCategories[i];
			catagoryJson = ingredientJson[categoryName];
			renderHtml += _this.renderIngredientsByCategory(categoryName, catagoryJson);
		}
		$(".cls_ingredientsList").append(renderHtml);
};

IngredientTab.prototype.renderIngredientsByCategory = function(ingCat, categoryJson) {
	var _this = this;

	var renderHtml = [];
	if(categoryJson){
		renderHtml += "<div class='list-group col-11'>"
						+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-center h5 text-white font-weight-bold'>"
							+ ingCat;

					for(var j=0; j<categoryJson.length ; j++){
						renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ingredient_"+ categoryJson[j].id +"'>"
										+ "<label class='col-4'>" + categoryJson[j].name +"</label>"
										+ "<label class='col-4'>" + categoryJson[j].unit +"</label>"
										+ "<label class='btn btn-primary btn-md mr-4 mb-0 col-1 text-center cls_editIngredient' idx='" + categoryJson[j].id +"' data-toggle='modal' data-target='#ingredientModal'>Edit</label>"
										+ "<label class='btn btn-secondary btn-md mb-0 col-1 text-center cls_deleteIngredient' idx='" + categoryJson[j].id +"' name='" + categoryJson[j].name +"'>Delete</label>"
									+ "</a>";
					}
		renderHtml += "</a>"
				   + "</div><br><br>";
	}
	return renderHtml;
};

IngredientTab.prototype.renderSearchResults = function(searchResIngredients) {
	var _this = this;

	var renderHtml = [];
	renderHtml += "<div class='list-group col-11'>"
					+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-center h5 text-white font-weight-bold'>"
						+ "Search Results";

			if(searchResIngredients && searchResIngredients.length>0)
			{
				for(var j=0; j<searchResIngredients.length ; j++){
					renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ingredient_"+ searchResIngredients[j].id +"'>"
									+ "<label class='col-4'>" + searchResIngredients[j].name +"</label>"
									+ "<label class='col-2'>" + searchResIngredients[j].unit +"</label>"
									+ "<label class='col-2'>" + searchResIngredients[j].category +"</label>"
									+ "<label class='btn btn-primary btn-md mr-4 mb-0 col-1 text-center cls_editIngredient' idx='" + searchResIngredients[j].id +"' data-toggle='modal' data-target='#ingredientModal'>Edit</label>"
									+ "<label class='btn btn-secondary btn-md mb-0 col-1 text-center cls_deleteIngredient' idx='" + searchResIngredients[j].id +"' name='" + searchResIngredients[j].name +"'>Delete</label>"
								+ "</a>";
				}
			}
			else
			{
				renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont'>"
						   + "<label class='col-12 text-center'>No Matching Ingredients</label>"
						   + "</a>";
			}
	renderHtml += "</a>"
			   + "</div><br><br>";
	return renderHtml;
};

IngredientTab.prototype.registerEvents = function() {
	var _this = this;
	$(document).ready(function(){
		$("#id_createIngredientForm").submit(function() {
			var length = _this.ingredientJsonArr&& _this.ingredientJsonArr.length ? _this.ingredientJsonArr.length : 0;
			var id = _this.ingredientJsonArr[length-1].id+1;

			var name = $("#id_name").val().trim();
			var unit = $("#id_unit").val();
			var category = $("#id_category").val();

			var ingredientObj = {
					"id": id,
					"name": name,
					"category": category,
					"unitOfMeasure": unit
					};
			//File write operation
			_this.updateIngredientData(ingredientObj)
		});

		$('#ingredientModal').on('hidden.bs.modal', function () {
		    $(this).find('form').trigger('reset');
		});
		
		/*$(".cls_deleteIngredient").click(function() {
	       var idx = $(this).attr("idx");
	       var name = $(this).attr("name");
	       var isDelete = confirm("You wish to delete the ingredient "+name+" ?");
	       if (isDelete == true) {
	         $(".ingredient_"+idx).remove();
	       }
	    });*/

	    $("#id_selectIngredientCategory").change(function() {
	    	_this.renderIngredients($("#id_selectIngredientCategory").val());
	    	$("#id_searchIngredientCategory").val("");
		});

		$("#id_searchIngredientCategory").keyup(function() {
	    	var searchKeyword = $(this).val().trim();
	    	if(searchKeyword.length>0)
	    	{
		    	$(".cls_ingredientsList").html('');
		    	var results = getIngredientsByName(ingredientJson, searchKeyword);
		    	$(".cls_ingredientsList").append(_this.renderSearchResults(results));
		    }
		    else
		    {
		    	_this.renderIngredients("All");
		    }
		    $("#id_selectIngredientCategory").val("All");
		});

	    $(".cls_saveIngredient").click(function() {
	    	var selCat = $("#id_ingredientCategory").val();
	    	var dialogName = $(".modal-title", $("#ingredientModal")).text();
	    	
	    	if(dialogName.indexOf("Edit")>-1)	//Edit Scenario
	    	{
	    		var ingJson = {};
	    		/*ingJson =
	    		{
		    		"id": $("#ingredientModal").data("idToEdit"),
			        "name": $("#id_tamilName").val(),
			        "unit": $("#id_ingredientUnit").val()
			    };*/
			    var reqKey = selCat+"."+getIndexForId(ingredientJson, selCat, $("#ingredientModal").data("idToEdit"));
			    if(reqKey != -1)
			    {
			    	showLoading();
				    ingJson[reqKey] =
		    		{
			    		"id": $("#ingredientModal").data("idToEdit"),
				        "name": $("#id_tamilName").val(),
				        "unit": $("#id_ingredientUnit").val()
				    };
			        $.ajax({
			        	url: "/editIngredient",
		            	type: "post",
		            	contentType: 'application/json',
		            	data: JSON.stringify(ingJson),
			        	success: function(result){
			        		hideLoading();
			        		if(result.nModified && result.nModified>0)
			        		{
								$("#successPopup").find('.modal-title').text("Ingredient Updated Successfully");
				        		$("#successPopup").modal('show');
								//$('#ingredientModal .close').click();
			        		}
			        		else
			        		{
			        			$("#errorPopup").find('.modal-title').text('Failed to modify Ingredient. Please Try again later.');
			        			$("#errorPopup").modal('show');
			        		}
			        		$('#ingredientModal .close').click();
						},
						error: function(){
							hideLoading();
						    $("#errorPopup").find('.modal-title').text('Failed to edit Ingredient. Please Try again later.');
			        		$("#errorPopup").modal('show');
			        		$('#ingredientModal .close').click();
						}
					});
			    }
			    else
			    {
			    	$("#errorPopup").find('.modal-title').text('Failed to edit Ingredient. Please Try again later.');
			        $("#errorPopup").modal('show');
			        $('#ingredientModal .close').click();
			    }
	    	}
	    	else	//Create Scenario
	    	{
	    		showLoading();
	    		var ingJson = {};
	    		ingJson[selCat] =
	    		{
		    		"id": getNextId(ingredientJson, "Ingredient"),
			        "name": $("#id_tamilName").val(),
			        "unit": $("#id_ingredientUnit").val()
			    };
		        $.ajax({
		        	url: "/createIngredient",
	            	type: "post",
	            	contentType: 'application/json',
	            	data: JSON.stringify(ingJson),
		        	success: function(result){
		        		hideLoading();
		        		if(result.nModified && result.nModified>0)
		        		{
							$("#successPopup").find('.modal-title').text("Ingredient Created Successfully");
		        			$("#successPopup").modal('show');
			        	}
		        		else
		        		{
			        		$("#errorPopup").find('.modal-title').text('Failed to Create New Ingredient. Please Try again later.');
		        			$("#errorPopup").modal('show');
			        	}
		        		$('#ingredientModal .close').click();
					},
					error: function(){
						hideLoading();
					    $("#errorPopup").find('.modal-title').text('Failed to Create Ingredient. Please Try again later.');
		        		$("#errorPopup").modal('show');
		        		$('#ingredientModal .close').click();
					}
				});
	    	}
	    });
		
		$(".cls_createIngredient").click(function() {
			var modal = $("#ingredientModal");
		    $(".modal-title", modal).text("Create Ingredient");
	    	$(".cls_ingredientId", modal).val("");
	    	$(".cls_ingredientTamilName", modal).val("");
	    });

		$(document).on('click', '.cls_editIngredient', function(){
			var idx = $(this).attr("idx");
			var curIngredientObj = getIngredientById(ingredientJson, idx);
			if(curIngredientObj && !$.isEmptyObject(curIngredientObj))
			{
				var id = curIngredientObj.id;
				var name = curIngredientObj.name;
				var categoryName = curIngredientObj.categoryName;
				var unit = curIngredientObj.unit;
				var modal = $("#ingredientModal");
				modal.data("idToEdit",idx);
				$(".modal-title", modal).text("Edit Ingredient");
				$(".cls_ingredientId", modal).val(id);
				$(".cls_ingredientTamilName", modal).val(name);
				$(".cls_ingredientCategory", modal).val(categoryName);
				$(".cls_ingredientUnit", modal).val(unit);
				$(".cls_ingredientCategory", modal).prop('disabled', true);
			}
			else
	        {
	        	$("#errorPopup").find('.modal-title').text('Failed to get Ingredient details for Delete. Please Try again later.');
			    $("#errorPopup").modal('show');
	        }
		});

		$(document).on('click', '.cls_deleteIngredient', function(){
			var idx = $(this).attr("idx");
	        var curIngredientObj = getIngredientById(ingredientJson, idx);
	        if(curIngredientObj && !$.isEmptyObject(curIngredientObj))
	        {
	    	    var id = curIngredientObj.id;
	    	    var name = curIngredientObj.name;
	    	    var categoryName = curIngredientObj.categoryName;
	    	    //var unit = curIngredientObj.unit;
	    	    $("#confirmationPopup").find('.modal-title').text("Are you sure to delete this Ingredient ("+name+")?");
    			$("#confirmationPopup").modal('show');
    			$("#confirmationPopup").data("idToDelete", id);
    			$("#confirmationPopup").data("catForId", categoryName);
    			$("#confirmationPopup").data("module", "Ingredient");
	        }
		});		

	});
}

IngredientTab.prototype.updateIngredientData = function(ingredientObj) {
	//File operation to save the ingredient in appropreate ingredient category
}

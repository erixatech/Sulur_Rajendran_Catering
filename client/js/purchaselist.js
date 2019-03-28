
function renderPL(orderToParse){
    //this.dummy_PLData = {maligai : [{name: "sugar", quantity: 101, unit: "gram"}, {name: "oil", quantity: 404, unit: "ml"}, {name: "ulundhu", quantity: 808, unit: "gram"}], "kaikanigal" : [{name: "maavu", quantity: 20, unit: "kilo"}]};
    this.orderToParse = orderToParse;
    this.init();
};

renderPL.prototype.init = function() {
    var _this = this;
    _this.calculatePL();
};

renderPL.prototype.calculatePL = function(){
	/*var dummyReceipeList = [{"id":1, "name":"jelabi", "Ingredients":[{"tamilName":"sugar","quantity":100,"unit":"gram"},{"tamilName":"oil","quantity":200,"unit":"ml"}]},{"id":1, "name":"idly", "Ingredients":[{"tamilName":"ulundhu","quantity":800,"unit":"gram"},{"tamilName":"maavu","quantity":20,"unit":"kilo"},{"tamilName":"oil","quantity":200,"unit":"ml"}]}];
	var dummyIngredientsList = [{"id": 1,"tamilName": "sugar", "category":"maligai", "unit":"gram"},{"id": 2,"tamilName": "oil", "category":"maligai", "unit":"ml"},{"id": 3,"tamilName": "ulundhu", "category":"maligai", "unit":"gram"},{"id": 4,"tamilName": "maavu", "category":"kaikanigal", "unit":"gram"}];*/
	var _this = this;
	var PLToGenerate = [];
    var serviceFormReceipeMap = _this.orderToParse;
    console.log(_this.orderToParse.orderId);

    for(var ser = 0; ser < _this.orderToParse.serviceForms.length; ser++)
    {
        if(_this.orderToParse.serviceForms[ser] && _this.orderToParse.serviceForms[ser].recipes)
        {
            var currRecipeMap = _this.orderToParse.serviceForms[ser].recipes;
        	for(var i = 0; i < currRecipeMap.length; i++)
            {
                var receipeId = currRecipeMap[i].id;
                var currIngList = getIngredientsList(receipeId, recipeJson);
                for(var j = 0; j < currIngList.length; j++)
            	{
            		var currIngItem = currIngList[j];
            		var qtyToAdd = currIngItem.quantity;
            		var unitToAdd = currIngItem.unit;

            		if(unitToAdd == "kg")
            		{
            			qtyToAdd = qtyToAdd * 1000;
            			unitToAdd = "gram";
            		}
            		else if(unitToAdd == "ltr")
            		{
            			qtyToAdd = qtyToAdd * 1000;
            			unitToAdd = "ml";
            		}
            		else if(unitToAdd == "dozen")
            		{
            			qtyToAdd = qtyToAdd * 12;
            			unitToAdd = "nos";
            		}

                    qtyToAdd = qtyToAdd * currRecipeMap[i].count;

            		var ingItemForPL = {"name" : currIngList[j].name, "quantity" : qtyToAdd, "unit" : unitToAdd};
            		var ingItemIndexInList = isAlreadyPresentInPL(ingItemForPL, PLToGenerate);

            		if(ingItemIndexInList != -1)
            		{
            			PLToGenerate[ingItemIndexInList].quantity = Number(PLToGenerate[ingItemIndexInList].quantity) + Number(qtyToAdd);
            		}
            		else
            		{
            			PLToGenerate[PLToGenerate.length] = ingItemForPL;
            		}
            	}
            }
        }
    }

    PLToGenerate = incByOnePrec(PLToGenerate);
    PLToGenerate = unitConversion(PLToGenerate);
    PLToGenerate = roundOffPL(PLToGenerate);
    PLToGenerate = getCategorizedPL(PLToGenerate, ingredientJson);
    console.log(PLToGenerate);
    //initiatePL(PLToGenerate);
    _this.render(PLToGenerate);
    _this.registerEvents();
};


renderPL.prototype.render = function(plToRender) {
    var _this = this;

    var renderHtml = [];
    var cat_maligai = plToRender.Maligai;
    var cat_kaikanigal = plToRender.KaaiKanigal;
    var cat_extras = plToRender.Extras;
    var cat_suppliments = plToRender.Suppliments;    
    
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
                   + "</div><br><br>"
    }

    $("#id_purchaseListContainer").append(renderHtml);
    $("#id_purchaseListContainer").removeClass("d-none");
    $("#id_mainContentContainer").addClass("d-none");
};

renderPL.prototype.registerEvents = function() {
    var _this = this;
    
    $(document).ready(function(){
        $(document).on("click", ".cls_removeCurrentIngMap", function(){
            $(this).parents('.cls_ingredientCont').remove();
        });
    });
    
};

function getIngredientsList(receipeId, receipeData)
{
    var currRecipe = getRecipeObjById(receipeData, receipeId);
    
    return (currRecipe && currRecipe.Ingredients) ? currRecipe.Ingredients : [];

	/*for(var i = 0; i < receipeList.length; i++)
    {
        if(receipeList[i].id == receipeId)
        {
        	return receipeList[i].Ingredients;
        }

    }
    return [];*/
}

function isAlreadyPresentInPL(ingItemForPL, PLToCheck)
{
	for(var i = 0; i < PLToCheck.length; i++)
    {
        if(PLToCheck[i].name == ingItemForPL.name && PLToCheck[i].unit == ingItemForPL.unit)
        {
        	return i;
        }

    }
    return -1;
}

function incByOnePrec(PLToIncrement)
{
	for(var i = 0; i < PLToIncrement.length; i++)
    {

        PLToIncrement[i].quantity = PLToIncrement[i].quantity + (PLToIncrement[i].quantity/100);
    }
    return PLToIncrement;
}

function unitConversion(PLToConvert)
{
	for(var i = 0; i < PLToConvert.length; i++)
    {
        var qtyToConvert = PLToConvert[i].quantity;
		var unitToConvert = PLToConvert[i].unit;

		if(unitToConvert == "gram" && qtyToConvert>1000)
		{
			PLToConvert[i].quantity = qtyToConvert / 1000;
			PLToConvert[i].unit = "kilo";
		}
		else if(unitToConvert == "ml" && qtyToConvert>1000)
		{
			PLToConvert[i].quantity = qtyToConvert / 1000;
			PLToConvert[i].unit = "litre";
		}
    }
    return PLToConvert;
}

function roundOffPL(PLToRoundOff)
{
	for(var i = 0; i < PLToRoundOff.length; i++)
    {
        if(String(PLToRoundOff[i].quantity).indexOf('.')>-1)
        {
        	if(String(PLToRoundOff[i].quantity).split('.').length == 2)
        	{
        		var qtyToRound = Number(String(PLToRoundOff[i].quantity).split('.')[0]);

        		if(Number((String(PLToRoundOff[i].quantity).split('.')[1]).charAt(0)) > 4)
        		{
        			PLToRoundOff[i].quantity = qtyToRound + 1;
        		}
        		else
        		{
        			PLToRoundOff[i].quantity = qtyToRound;
        		}
        	}
        }
    }
    return PLToRoundOff;
}

function getCategorizedPL(PLToCategorize, ingredientsList)
{
	var categorizedPL = {"Maligai":[],"KaaiKanigal":[],"Extras":[],"Suppliments":[]};
	for(var i = 0; i < PLToCategorize.length; i++)
    {
    	var ingName = PLToCategorize[i].name;

        if(getIngredientIdByNameAndCat(ingredientJson, ingName, ingredientCategories[0]) > -1)
        {
            categorizedPL.Maligai[categorizedPL.Maligai.length] = PLToCategorize[i];
        }
        else if(getIngredientIdByNameAndCat(ingredientJson, ingName, ingredientCategories[1]) > -1)
        {
            categorizedPL.KaaiKanigal[categorizedPL.KaaiKanigal.length] = PLToCategorize[i];
        }
        else if(getIngredientIdByNameAndCat(ingredientJson, ingName, ingredientCategories[2]) > -1)
        {
            categorizedPL.Extras[categorizedPL.Extras.length] = PLToCategorize[i];
        }
        else if(getIngredientIdByNameAndCat(ingredientJson, ingName, ingredientCategories[3]) > -1)
        {
            categorizedPL.Suppliments[categorizedPL.Suppliments.length] = PLToCategorize[i];
        }
    }

    if(categorizedPL.Maligai.length == 0)
	{
		delete categorizedPL.Maligai;
	}
	if(categorizedPL.KaaiKanigal.length == 0)
	{
		delete categorizedPL.KaaiKanigal;
	}
	if(categorizedPL.Extras.length == 0)
	{
		delete categorizedPL.Extras;
	}
	if(categorizedPL.Suppliments.length == 0)
	{
		delete categorizedPL.Suppliments;
	}

	return categorizedPL;
}

function initiatePL(PLToRender)
{
	// TODO: Save PL To DB
	var plWindow = window.open("purchaselistgen.html");
}
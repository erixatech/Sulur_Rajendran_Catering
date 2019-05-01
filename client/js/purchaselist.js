
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
                var currRecipe = getRecipeObjById(recipeJson, receipeId);
                if(currRecipe && currRecipe!=null)
                {
                    var currIngList = getIngredientsListOfRecipe(receipeId, recipeJson);
                    for(var j = 0; j < currIngList.length; j++)
                	{
                		var currIngItem = currIngList[j];
                		var qtyToAdd = currIngItem.quantity / currRecipe.headCount;
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
    }

    for(var sup = 0; sup < _this.orderToParse.suppliments.length; sup++)
    {
        var currIngItem = _this.orderToParse.suppliments[sup];
        var qtyToAdd = currIngItem.qty;
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

        var currIngObj = getIngredientById(ingredientJson, currIngItem.id);
        if(currIngObj){
            var ingItemForPL = {"name" : currIngObj.name, "quantity" : qtyToAdd, "unit" : unitToAdd};
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

    PLToGenerate = incByPrecentage(PLToGenerate);
    PLToGenerate = unitConversion(PLToGenerate);    
    PLToGenerate = roundOffPL(PLToGenerate);
    PLToGenerate = convertToTamilUnits(PLToGenerate);
    PLToGenerate = getCategorizedPL(PLToGenerate);
    PLToGenerate = getSortedPL(PLToGenerate);
    console.log(PLToGenerate);
    //initiatePL(PLToGenerate);
    _this.render(PLToGenerate);
    _this.registerEvents(PLToGenerate);
};

renderPL.prototype.removeAndReRender = function(indexToRemove, PLToGenerate) {
    var _this = this;
    var newPL = PLToGenerate;
    var purchaseListCategory = getValueFromQueryParam('purchaseListCategory');
    var arrToAlter = PLToGenerate[purchaseListCategory];
    var removeNum = indexToRemove-1;
    arrToAlter.splice(removeNum,1);
    newPL[purchaseListCategory] = arrToAlter;
    _this.render(newPL);
};

renderPL.prototype.render = function(plToRender) {
    var _this = this;

    var renderHtml = [];
    var cat_maligai = plToRender.Maligai;
    var cat_kaikanigal = plToRender.KaaiKanigal;
    var cat_extras = plToRender.Extras;
    var cat_suppliments = plToRender.Suppliments;
    var purchaseListCategory = getValueFromQueryParam('purchaseListCategory');
    
    if(purchaseListCategory == "Maligai")
    {
        if(cat_maligai && cat_maligai.length>0){
            renderHtml += "<div class='col-12 text-center'>"
                        + "<div class='col-12 text-center font-weight-bold'>தேதி <input type='text' class='form-control col-2 mx-3' style='display:inline'> <select class='form-control cls_pl_session cls_onehalfcol font-weight-bold' id='id_pl_session' name='plSession' style='display:inline'><option>காலை </option><option>மாலை</option></select> <input type='text' class='form-control col-1 mx-3' style='display:inline'> மணிக்கு தேவை, இடம் <input type='text' class='form-control col-3 ml-3' style='display:inline'></div><br>"
                        + "<div class='col-12 text-center text-danger font-weight-bold'><u>மளிகை சாமான்கள் மீதமாவதை தவிர்க்க அளவு குறைவாக எழுதப்படும், தேவையெனில் வாங்கித்தர வேண்டும்</u></div><br>"
                        + _this.renderPoojaTable()
                        + "</div>"
                            /*+ "<div class='row col-12'>"
                                + "<div class='col-1'></div>"
                                + "<div class='list-group col-10 text-center'>"
                                    + "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
                                        + "Maligai"

                                    for(var j=0; j<cat_maligai.length ; j++){
                                        renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_maligai_"+ j +" mx-0 px-0'>"
                                                        + "<span class='col-1 px-3 cls_rowIndex'>"+Number(j+1)+" . </span>"
                                                        + "<span class='col-6 px-3'><input type='text' class='col-6 form-control' name='name' value='"+cat_maligai[j].name+"' style='display:inline'></span>"
                                                        + "<span class='col-2 px-3'><input type='text' class='col-1 form-control' name='quantity' value='"+_this.getQtyToRender(cat_maligai[j].quantity)+"' style='display:inline'></span>"
                                                        + "<span class='col-2 px-3'><input type='text' class='cls_onehalfcol form-control' name='unit' value='"+cat_maligai[j].unit+"' style='display:inline'></span>"
                                                        + "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
                                                    + "</a>"
                                    }
                                    
                        renderHtml += "</a>"
                           + "</div>"
                           + "<div class='col-1'></div>"
                       + "</div>"
                       +"<br><br>"*/
                       renderHtml += _this.renderItemInPL(cat_maligai, "Maligai");
        }
        else
        {
            renderHtml += "<div class='list-group col-12 py-5 my-5 font-weight-bold text-danger text-center'>No Items in Maligai for this Order</div>"
        }
    }

    if(purchaseListCategory == "KaaiKanigal")
    {
        if(cat_kaikanigal && cat_kaikanigal.length>0){
            renderHtml += "<div class='row col-12 text-center'>"
                            + "<div class='col-12 text-center font-weight-bold'>தேதி <input type='text' class='form-control col-2 mx-3' style='display:inline'> <select class='form-control cls_pl_session cls_onehalfcol font-weight-bold' id='id_pl_session' name='plSession' style='display:inline'><option>காலை </option><option>மாலை</option></select> <input type='text' class='form-control col-1 mx-3' style='display:inline'> மணிக்கு தேவை, இடம் <input type='text' class='form-control col-3 ml-3' style='display:inline'></div><br>"
                            + "<div class='col-12 text-center text-danger font-weight-bold'><u>காய்கறி மீதமாவதை தவிர்க்க அளவு குறைவாக எழுதப்படும், தேவையெனில் வாங்கித்தர வேண்டும்</u></div><br>"
                        + "</div><br>"
                        /*+ "<div class='row col-12'>"
                                + "<div class='col-1'></div>"
                                +"<div class='list-group col-10 text-center'>"
                                    + "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
                                        + "Kaai Kanigal"

                                    for(var j=0; j<cat_kaikanigal.length ; j++){
                                        renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_kaikanigal_"+ j +" mx-0 px-0'>"
                                                        + "<span class='col-1 px-3 cls_rowIndex'>"+Number(j+1)+" . </span>"
                                                        + "<span class='col-6 px-3'><input type='text' class='col-6 form-control' name='name' value='"+cat_kaikanigal[j].name+"' style='display:inline'></span>"
                                                        + "<span class='col-2 px-3'><input type='text' class='col-1 form-control' name='quantity' value='"+_this.getQtyToRender(cat_kaikanigal[j].quantity)+"' style='display:inline'></span>"
                                                        + "<span class='col-2 px-3'><input type='text' class='cls_onehalfcol form-control' name='unit' value='"+cat_kaikanigal[j].unit+"' style='display:inline'></span>"
                                                        + "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
                                                    + "</a>"
                                    }
                                    
                        renderHtml += "</a>"
                            + "</div>"
                           + "<div class='col-1'></div>"
                       + "</div>"
                       + "<br><br>"*/
                       renderHtml += _this.renderItemInPL(cat_kaikanigal, "Kaai Kanigal");
        }
        else
        {
            renderHtml += "<div class='list-group col-12 py-5 my-5 font-weight-bold text-danger text-center'>No Items in KaaiKanigal for this Order</div>"
        }
    }

    if(purchaseListCategory == "Extras")
    {
        if(cat_extras && cat_extras.length>0){
            /*renderHtml += "<div class='row col-12 text-center'>"
                            + "<div class='col-12 text-center font-weight-bold'>தேதி <input type='text' class='form-control col-2 mx-3' style='display:inline'> மாலை <input type='text' class='form-control col-1 mx-3' style='display:inline'> மணிக்கு தேவை, இடம் <input type='text' class='form-control col-3 ml-3' style='display:inline'></div><br>"
                            + "<div class='col-12 text-center text-danger font-weight-bold'><u>மளிகை சாமான்கள் மீதமாவதை தவிர்க்க அளவு குறைவாக எழுதப்படும், தேவையெனில் வாங்கித்தர வேண்டும்</u></div><br>"
                        + "</div><br>"*/
                        /*+ "<div class='row col-12'>"
                            + "<div class='col-1'></div>"
                            + "<div class='list-group col-10 text-center'>"
                                + "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
                                    + "Extras"

                                for(var j=0; j<cat_extras.length ; j++){
                                    renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont ing_extras_"+ j +" mx-0 px-0'>"
                                                    + "<span class='col-1 px-3 cls_rowIndex'>"+Number(j+1)+" . </span>"
                                                    + "<span class='col-6 px-3'><input type='text' class='col-6 form-control' name='name' value='"+cat_extras[j].name+"' style='display:inline'></span>"
                                                    + "<span class='col-2 px-3'><input type='text' class='col-1 form-control' name='quantity' value='"+_this.getQtyToRender(cat_extras[j].quantity)+"' style='display:inline'></span>"
                                                    + "<span class='col-2 px-3'><input type='text' class='cls_onehalfcol form-control' name='unit' value='"+cat_extras[j].unit+"' style='display:inline'></span>"
                                                    + "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
                                                + "</a>"
                                }
                                
                    renderHtml += "</a>"
                            + "</div>"
                           + "<div class='col-1'></div>"
                       + "</div>"
                       + "<br><br>"*/
                       renderHtml += _this.renderItemInPL(cat_extras, "Extras");
        }
        else
        {
            renderHtml += "<div class='list-group col-12 py-5 my-5 font-weight-bold text-danger text-center'>No Items in Extras for this Order</div>"
        }
    }

    if(purchaseListCategory == "Suppliments")
    {
        if(cat_suppliments && cat_suppliments.length>0){
            /*renderHtml += "<div class='row col-12 text-center'>"
                            + "<div class='col-12 text-center font-weight-bold'>தேதி <input type='text' class='form-control col-2 mx-3' style='display:inline'> மாலை <input type='text' class='form-control col-1 mx-3' style='display:inline'> மணிக்கு தேவை, இடம் <input type='text' class='form-control col-3 ml-3' style='display:inline'></div><br>"
                            + "<div class='col-12 text-center text-danger font-weight-bold'><u>மளிகை சாமான்கள் மீதமாவதை தவிர்க்க அளவு குறைவாக எழுதப்படும், தேவையெனில் வாங்கித்தர வேண்டும்</u></div><br>"
                        + "</div><br>"*/
                        /*+ "<div class='row col-12'>"
                            + "<div class='col-1'></div>" 
                            + "<div class='list-group col-10 text-center'>"
                                + "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold'>"
                                    + "Suppliments"

                                for(var j=0; j<cat_suppliments.length ; j++){
                                    renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont mx-0 px-0'>"
                                                    + "<span class='col-1 px-3 cls_rowIndex'>"+Number(j+1)+" . </span>"
                                                    + "<span class='col-6 px-3'><input type='text' class='col-6 form-control' name='name' value='"+cat_suppliments[j].name+"' style='display:inline'></span>"
                                                    + "<span class='col-2 px-3'><input type='text' class='col-1 form-control' name='quantity' value='"+_this.getQtyToRender(cat_suppliments[j].quantity)+"' style='display:inline'></span>"
                                                    + "<span class='col-2 px-3'><input type='text' class='cls_onehalfcol form-control' name='unit' value='"+cat_suppliments[j].unit+"' style='display:inline'></span>"
                                                    + "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
                                                + "</a>"
                                }
                                
                    renderHtml += "</a>"
                            + "</div>"
                           + "<div class='col-1'></div>"
                       + "</div>"
                       + "<br><br>"*/
                       renderHtml += _this.renderItemInPL(cat_suppliments, "Suppliments");
        }
        else
        {
            renderHtml += "<div class='list-group col-12 py-5 my-5 font-weight-bold text-danger text-center'>No Items in Suppliments for this Order</div>"
        }
    }

    $("#id_purchaseListContainer").html(renderHtml);
    $("#id_purchaseListContainer").removeClass("d-none");
    $("#id_mainContentContainer").addClass("d-none");
    _this.renderAddRowToPL();

    /*if(purchaseListCategory == "Maligai")
    {
        setTimeout(function(){
            var plWindow2 = window.open(addUrlParam(window.location.href, "purchaseListCategory", "KaaiKanigal"));
        }, 1000);
    }*/
};

renderPL.prototype.renderItemInPL = function(itemsToRender, headingText) {
    if(itemsToRender && itemsToRender.length>0)
    {
        var _this = this;
        var renderHtml = [];
        var columnLeftItems = [];
        var columnRightItems = [];

        columnLeftItems = _this.getLeftItems(itemsToRender, headingText);
        columnRightItems = _this.getRightItems(itemsToRender, headingText);

        renderHtml  += "<div class='row col-12 mx-0 px-0 border border-dark'>"
                        + "<div class='list-group col-12 text-center mx-0 px-0 mt-2'>"
                            + "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-white font-weight-bold p-2 m-0'>"
                                + headingText
                                
        for(var j=0; j<columnLeftItems.length; j++)
        {
            var currItem = itemsToRender[j];
            var index = Number(j+1);

            for(var k=0; k<2; k++)
            {
                if(k%2 == 0)
                {
                    index = _this.getLeftIndex(j, headingText);
                    renderHtml += "<a class='mx-0 px-0 row'>"
                    currItem = columnLeftItems[j];
                }
                else
                {
                    index = _this.getRightIndex(j, headingText);
                    currItem = (j<columnRightItems.length) ? columnRightItems[j] : null;
                }

                var indexSpaces = " . ";                
                if(index<10)
                {
                    indexSpaces = "&nbsp;&nbsp;&nbsp; . ";
                }
                else if(index<100)
                {
                    indexSpaces = "&nbsp; . ";
                }
                else
                {
                    indexSpaces = ". ";
                }

                if(currItem)
                {
                    renderHtml += "<div class='list-group-item list-group-item-action cls_ingredientCont col-6 p-0 px-0 m-0 pt-1'>"
                                    + "<span class='col-1 px-0 mx-0 cls_rowIndex font-weight-bold'>"+index+indexSpaces+"</span>"
                                    + "<span><input type='text' class='col-7 form-control px-1 p-0 m-0 font-weight-bold' name='name' value='"+currItem.name+"' style='display:inline'></span>"
                                    + "<span><input type='text' class='mx-2 cls_twoshortcol form-control px-1 p-0 m-0 font-weight-bold' name='quantity' value='"+_this.getQtyToRender(currItem.quantity)+"' style='display:inline'></span>"
                                    + "<span><input type='text' class='cls_onehalfcol form-control px-1 p-0 m-0 font-weight-bold' name='unit' value='"+currItem.unit+"' style='display:inline'></span>"
                                    + "<span class='col-1 p-0 m-0'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' data-index='"+index+"' style='font-size:25px;color:red'></i></span>"
                                + "</div>"
                }

                if(k%2 == 1)
                {
                    renderHtml += "</a>"
                    if(headingText.toLowerCase() == "maligai")
                    {
                        if(index == 33 || index == 66)
                        {
                            renderHtml += "<br><br>"
                        }
                    }
                    else if(headingText.toLowerCase().replace(/ /g, '') == "kaaikanigal")
                    {
                        if(index == 36 || index == 72)
                        {
                            renderHtml += "<br><br>"
                        }
                    }
                }
            }
        }

        renderHtml += "</a>"
                   + "</div>"
                   + "</div>"

        return renderHtml;
    }
};

renderPL.prototype.getLeftItems = function(itemsToRender, headingText) {
    var _this = this;
    var columnLeftItems = [];
    var currLen= 0;

    if(headingText.toLowerCase() == "maligai")
    {
        /*for(var i=0; i<18 ; i++)         //old calculation
        {
            if(itemsToRender[i])
            {
                columnLeftItems[i] = itemsToRender[i];
            }
        }
        currLen = columnLeftItems.length;
        for(var i=36; i<63 ; i++)
        {
            if(itemsToRender[i])
            {
                columnLeftItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }
        currLen = columnLeftItems.length;
        for(var i=90; i<117; i++)
        {
            if(itemsToRender[i])
            {
                columnLeftItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }
        currLen = columnLeftItems.length;
        for(var i=144; i<171 ; i++)
        {
            if(itemsToRender[i])
            {
                columnLeftItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }*/

        for(var i=0; i<33 ; i++)         //new calculation
        {
            if(itemsToRender[i])
            {
                columnLeftItems[i] = itemsToRender[i];
            }
        }
        currLen = columnLeftItems.length;
        for(var i=66; i<112 ; i++)
        {
            if(itemsToRender[i])
            {
                columnLeftItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }
    }
    else if(headingText.toLowerCase().replace(/ /g, '') == "kaaikanigal")
    {
        for(var i=0; i<36; i++)
        {
            if(itemsToRender[i])
            {
                columnLeftItems[i] = itemsToRender[i];
            }
        }
    }

    return columnLeftItems;
};

renderPL.prototype.getRightItems = function(itemsToRender, headingText) {
    var _this = this;
    var columnRightItems = [];
    var currLen= 0;

    if(headingText.toLowerCase() == "maligai")
    {
        /*for(var i=18; i<36 ; i++)         //old calculation
        {
            if(itemsToRender[i])
            {
                columnRightItems[i-18] = itemsToRender[i];
            }
        }
        currLen = columnRightItems.length;
        for(var i=63; i<90 ; i++)
        {
            if(itemsToRender[i])
            {
                columnRightItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }
        currLen = columnRightItems.length;
        for(var i=117; i<144 ; i++)
        {
            if(itemsToRender[i])
            {
                columnRightItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }
        currLen = columnRightItems.length;
        for(var i=171; i<198 ; i++)
        {
            if(itemsToRender[i])
            {
                columnRightItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }*/

        for(var i=33; i<66 ; i++)         //new calculation
        {
            if(itemsToRender[i])
            {
                columnRightItems[i-33] = itemsToRender[i];
            }
        }
        currLen = columnRightItems.length;
        for(var i=112; i<158 ; i++)
        {
            if(itemsToRender[i])
            {
                columnRightItems[currLen] = itemsToRender[i];
                currLen++;
            }
        }
    }
    else if(headingText.toLowerCase().replace(/ /g, '') == "kaaikanigal")
    {
        for(var i=36; i<72 ; i++)         //new calculation
        {
            if(itemsToRender[i])
            {
                columnRightItems[i-36] = itemsToRender[i];
            }
        }
    }

    return columnRightItems;
};

renderPL.prototype.getLeftIndex = function(serialNum, headingText) {
    var _this = this;
    serialNum = Number(serialNum);
    var indexToRet = Number(serialNum);

    if(headingText.toLowerCase() == "maligai")
    {
        /*if(serialNum<18)         //old calculation
        {
           indexToRet =  serialNum+1;
        }
        else if(serialNum<45)
        {
           indexToRet =  serialNum+19;
        }
        else if(serialNum<72)
        {
           indexToRet =  serialNum+46;
        }
        else if(serialNum<99)
        {
           indexToRet =  serialNum+73;
        }*/
        if(serialNum<33)         //new calculation
        {
           indexToRet =  serialNum+1;
        }
        else if(serialNum<112)
        {
           indexToRet =  serialNum+34;
        }
    }
    else if(headingText.toLowerCase().replace(/ /g, '') == "kaaikanigal")
    {
        if(serialNum<36)
        {
           indexToRet =  serialNum+1;
        }
    }

    return indexToRet;
};

renderPL.prototype.getRightIndex = function(serialNum, headingText) {
    var _this = this;
    serialNum = Number(serialNum);
    var indexToRet = Number(serialNum);

    if(headingText.toLowerCase() == "maligai")
    {
        /*if(serialNum<18)         //old calculation
        {
           indexToRet =  serialNum+19;
        }
        else if(serialNum<45)
        {
           indexToRet =  serialNum+46;
        }
        else if(serialNum<72)
        {
           indexToRet =  serialNum+73;
        }
        else if(serialNum<99)
        {
           indexToRet =  serialNum+100;
        }*/
        if(serialNum<33)         //new calculation
        {
           indexToRet =  serialNum+34;
        }
        else if(serialNum<158)
        {
           indexToRet =  serialNum+80;
        }
    }
    else if(headingText.toLowerCase().replace(/ /g, '') == "kaaikanigal")
    {
        if(serialNum<36)         //new calculation
        {
           indexToRet =  serialNum+37;
        }
    }

    return indexToRet;
};

renderPL.prototype.renderAddRowToPL = function() {
    var _this = this;
    var renderHtml = [];

    /*renderHtml  += "<div class='row col-12'>"
                        +"<span class='col-7'></span>"
                            +"<span class='col-5'>"
                                +"<span class='cls_addRowPLContainer float-right d-none'>"
                                    +"Add row below number "
                                    +"<input type='text' class='form-control col-2 mx-3 cls_addLineAfterNum' style='display:inline'> "
                                    +"<a class='btn btn-success btn-md text-white cls_addRowInPL'><i class='fa fa-plus-circle'></i>Add </a>"
                                +"</span>"                                
                            +"</span>"
                            +"<br>"
                        +"</span>"
                    +"</div>"
                    +"<i class='fa fa-plus-circle mr-5 pr-5 float-right cls_addRowPLAction' style='font-size:24px;color:green'></i>"*/

    renderHtml  +=  "<br>"
                    +"<div class='row col-12 cls_printReadyContainer'>"
                        +"<span class='col-5'></span>"
                        +"<span class='col-4'>"
                            +"<span class='cls_addRowPLContainer float-right'>"
                                +"Add row below number "
                                +"<input type='text' class='form-control col-2 mx-3 cls_addLineAfterNum' style='display:inline'> "
                                +"<a class='btn btn-success btn-md text-white cls_addRowInPL'><i class='fa fa-plus-circle'></i>Add </a>"
                            +"</span>"
                        +"</span>"
                        +"<span class='col-3 cls_printReadyActionContainer float-right'>"
                            +"<a class='btn btn-success btn-md text-white cls_getPrintReadyBtn'>Get Print Ready</a>"
                        +"</span>"
                    +"</div>"
                    +"<i class='fa fa-plus-circle mr-5 pr-5 float-right cls_addRowPLAction d-none' style='font-size:24px;color:green'></i>"

    $("#id_purchaseListContainer").append(renderHtml);
};

renderPL.prototype.addNewRowToPL = function(addAfterIndex) {
    var _this = this;
    var renderHtml = [];
    var currIndex = Number(addAfterIndex)+1;

    renderHtml += "<a class='list-group-item list-group-item-action cls_ingredientCont mx-0 px-0'>"
                    + "<span class='col-1 px-3 cls_rowIndex'>"+currIndex+" . </span>"
                    + "<span class='col-6 px-3'><input type='text' class='col-6 form-control' name='name' value='' style='display:inline'></span>"
                    + "<span class='col-2 px-3'><input type='text' class='col-1 form-control' name='quantity' value='' style='display:inline'></span>"
                    + "<span class='col-2 px-3'><input type='text' class='cls_onehalfcol form-control' name='unit' value='' style='display:inline'></span>"
                    + "<span class='col-1'> <i class='fa fa-minus-circle mt-2 cls_removeCurrentIngMap' style='font-size:25px;color:red'></i></span>"
                + "</a>"

    $("#id_purchaseListContainer .list-group-item:nth-child("+currIndex+")").after(renderHtml);
    _this.reIndexPL();
};

renderPL.prototype.reIndexPL = function() {
    var elem = $('.cls_rowIndex');
    for(var j=0; j<elem.length ; j++){
        $(elem[j]).text(Number(j+1)+" . ");
    }
};

renderPL.prototype.getQtyToRender = function(qty) {
    var qtyToRet = qty;
    var fracToRet = "";
    var currFraction = "";

    if(qty.toString().indexOf(".")>-1)
    {
        qtyToRet = qty.toString().split(".")[0];
        currFraction = qty.toString().split(".")[1];

        if(currFraction == 25)
        {
            fracToRet = "&frac14;";
        }
        else if(currFraction == 5)
        {
            fracToRet = "&frac12;";
        }
        else if(currFraction == 75)
        {
            fracToRet = "&frac34;";
        }

        qtyToRet = qtyToRet + " " + fracToRet;
    }
    
    return qtyToRet;
};

renderPL.prototype.renderPoojaTable = function() {
    var renderHtml = [];
    renderHtml += "<div class='row col-12'>"
                    + "<div class='col-1'></div>"
                    + "<div class='list-group col-10 text-center'>"
                        + '<table class="table table-bordered">'
                            + '<tbody>'
                                + '<tr>'
                                    + '<td class="font-weight-bold text-center"><u>பூஜை சாமான்கள்</u></td>'
                                    + '<td><span>3. சந்தனம்</span>   <span class="float-right">- 1 பாக்கட்</span> </td>'
                                    + '<td><span>6. தேங்காய்</span>  <span class="float-right">- 2 காய்</span> </td>'
                                + '</tr>'
                                + '<tr>'
                                    + '<td><span>1. மஞ்சத்தூள்</span>    <span class="float-right">- 50 கிராம்</span> </td>'
                                    + '<td><span>4. குங்குமம்</span>   <span class="float-right">- 1 பாக்கட்</span> </td>'
                                    + '<td><span>7. பழம்</span>  <span class="float-right">- 4 பழம்</span> </td>'
                                + '</tr>'
                                + '<tr>'
                                    + '<td><span>2. விபூதி</span>    <span class="float-right">-  1 பாக்கட்</span> </td>'
                                    + '<td><span>5. ஊதுபத்தி</span>   <span class="float-right">- 1 பாக்கட்</span> </td>'
                                    + '<td><span>8. வெற்றிழைபாக்கு</span>  <span class="float-right">- 5 ரூபாய்</span> </td>'
                                + '</tr>'
                            + '</tbody>'
                        + '</table>'
                    + "</div>"
                    + "<div class='col-1'></div>"
                + "</div>"
    return renderHtml;
};

renderPL.prototype.registerEvents = function(PLToGenerate) {
    var _this = this;
    
    $(document).ready(function(){
        $(document).on("click", ".cls_removeCurrentIngMap", function(e){
            /*$(this).parents('.cls_ingredientCont').remove();
            _this.reIndexPL();*/
            _this.removeAndReRender($(this).data('index'), PLToGenerate)
        });

        $(document).on("click", ".cls_addRowPLAction", function(){
            /*if($('.cls_addRowPLContainer').hasClass('d-none'))
            {
                $('.cls_addRowPLContainer').removeClass('d-none');
            }
            else
            {
                $('.cls_addRowPLContainer').addClass('d-none');
            }*/     
            $('.cls_removeCurrentIngMap').attr('hidden',false);
            $(this).addClass('d-none');
            $('.cls_printReadyContainer').removeClass('d-none');
        });

        $(document).on("click", ".cls_getPrintReadyBtn", function(){
            $('.cls_removeCurrentIngMap').attr('hidden',true);
            $('.cls_printReadyContainer').addClass('d-none');
            $('.cls_addRowPLAction').removeClass('d-none');
        });

        $(document).on("click", ".cls_addRowInPL", function(){
            _this.addNewRowToPL($('.cls_addLineAfterNum').val());
        });

    });
    
};

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

function incByPrecentage(PLToIncrement)
{
    var percToIncrease = getUrlParts(window.location.href).inc;
    if(percToIncrease!=undefined && percToIncrease.length>0 && percToIncrease>0)
    {
    	for(var i = 0; i < PLToIncrement.length; i++)
        {

            PLToIncrement[i].quantity = PLToIncrement[i].quantity + ((PLToIncrement[i].quantity*percToIncrease)/100);
        }
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

function convertToTamilUnits(PLToConvert)
{
    for(var i = 0; i < PLToConvert.length; i++)
    {
        var unitToConvert = PLToConvert[i].unit;

        if(unitToConvert == "gram")
        {
            PLToConvert[i].unit = "கிராம்";
        }
        else if(unitToConvert == "kilo")
        {
            PLToConvert[i].unit = "கிலோ";
        }
        else if(unitToConvert == "ml")
        {
            PLToConvert[i].unit = "மில்லி";
        }
        else if(unitToConvert == "litre")
        {
            PLToConvert[i].unit = "லிட்டர்";
        }
        else if(unitToConvert == "pocket")
        {
            PLToConvert[i].unit = "பாக்ட்";
        }
        else if(unitToConvert == "meter")
        {
            PLToConvert[i].unit = "மீட்டர்";
        }
        else if(unitToConvert == "kowli")
        {
            PLToConvert[i].unit = "கவுளி";
        }
        else if(unitToConvert == "kattu")
        {
            PLToConvert[i].unit = "கட்டு";
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
                var fracval = Number((String(PLToRoundOff[i].quantity).split('.')[1]).charAt(0));
                var unitsToCheckForNonFraction = ["nos", "kattu", "kowli", "pocket"];

                if(!isInList(PLToRoundOff[i].unit, unitsToCheckForNonFraction))
                {            		
            		if(fracval > 1 && fracval <4)
            		{
            			PLToRoundOff[i].quantity = qtyToRound + 0.25;
            		}
            		else if(fracval > 3 && fracval <6)
            		{
            			PLToRoundOff[i].quantity = qtyToRound + 0.5;
            		}
                    else if(fracval > 5 && fracval <8)
                    {
                        PLToRoundOff[i].quantity = qtyToRound + 0.75;
                    }
                    else if(fracval > 7)
                    {
                        PLToRoundOff[i].quantity = qtyToRound + 1;
                    }
                    else
                    {
                        PLToRoundOff[i].quantity = qtyToRound;
                    }
                }
                else
                {
                    if(fracval > 4)
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
    }
    return PLToRoundOff;
}

function getCategorizedPL(PLToCategorize)
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

function getSortedPL(PLToCategorize)
{
    var sortedPL = {"Maligai":[],"KaaiKanigal":[],"Extras":[],"Suppliments":[]};

    if(PLToCategorize.Maligai)
    {
        for(var i = 0; i < ingredientJson.Maligai.length; i++)
        {
            for(var j = 0; j < PLToCategorize.Maligai.length; j++)
            {
                if(ingredientJson.Maligai[i].name.toLowerCase() == PLToCategorize.Maligai[j].name.toLowerCase())
                {
                    sortedPL.Maligai[sortedPL.Maligai.length] = PLToCategorize.Maligai[j];
                }
            }
        }
    }

    if(PLToCategorize.KaaiKanigal)
    {
        for(var i = 0; i < ingredientJson.KaaiKanigal.length; i++)
        {
            for(var j = 0; j < PLToCategorize.KaaiKanigal.length; j++)
            {
                if(ingredientJson.KaaiKanigal[i].name.toLowerCase() == PLToCategorize.KaaiKanigal[j].name.toLowerCase())
                {
                    sortedPL.KaaiKanigal[sortedPL.KaaiKanigal.length] = PLToCategorize.KaaiKanigal[j];
                }
            }
        }
    }

    if(PLToCategorize.Extras)
    {
        for(var i = 0; i < ingredientJson.Extras.length; i++)
        {
            for(var j = 0; j < PLToCategorize.Extras.length; j++)
            {
                if(ingredientJson.Extras[i].name.toLowerCase() == PLToCategorize.Extras[j].name.toLowerCase())
                {
                    sortedPL.Extras[sortedPL.Extras.length] = PLToCategorize.Extras[j];
                }
            }
        }
    }

    if(PLToCategorize.Suppliments)
    {
        for(var i = 0; i < ingredientJson.Suppliments.length; i++)
        {
            for(var j = 0; j < PLToCategorize.Suppliments.length; j++)
            {
                if(ingredientJson.Suppliments[i].name.toLowerCase() == PLToCategorize.Suppliments[j].name.toLowerCase())
                {
                    sortedPL.Suppliments[sortedPL.Suppliments.length] = PLToCategorize.Suppliments[j];
                }
            }
        }
    }

    if(sortedPL.Maligai.length == 0)
    {
        delete sortedPL.Maligai;
    }
    if(sortedPL.KaaiKanigal.length == 0)
    {
        delete sortedPL.KaaiKanigal;
    }
    if(sortedPL.Extras.length == 0)
    {
        delete sortedPL.Extras;
    }
    if(sortedPL.Suppliments.length == 0)
    {
        delete sortedPL.Suppliments;
    }

    return sortedPL;
}

function initiatePL(PLToRender)
{
	// TODO: Save PL To DB
	var plWindow = window.open("purchaselistgen.html");
}
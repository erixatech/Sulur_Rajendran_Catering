function addQueryParamToUrlAndReload(param, value, url){
	var url = url ? url :  window.location.href;
	if(url.lastIndexOf('#') == (url.length-1))
	{
		url = url.substring(0, url.length-1)
	}
	if (url.indexOf('?') > -1){
	   url += '&'+param+'='+value;
	}else{
	   url += '?'+param+'='+value;
	}
	window.location.href = url;
}

function addQueryParamToUrl(url, param, value){
	if(url.lastIndexOf('#') == (url.length-1))
	{
		url = url.substring(0, url.length-1)
	}
	if (url.indexOf('?') > -1){
	   url += '&'+param+'='+value;
	}else{
	   url += '?'+param+'='+value;
	}
	return url;
}

function getValueFromQueryParam(paramName){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars[paramName];
}

function addOptionsToSelect(optionsArray, parentId){
	if(optionsArray && optionsArray.length > 0) {
		var select = document.getElementById(parentId);
		for(var i=0; i<optionsArray.length; i++) {
			var option = document.createElement("option");
			option.text = optionsArray[i];
			select.add(option);
	    }
	}
}

function renderOptionsToSelectViaElem(optionsArray, elem){
	var options = [];
	options += "<option value=''> Select </option>"
	if(optionsArray && optionsArray.length > 0) {
		for(var i=0; i<optionsArray.length; i++) {
			options += "<option value=" + optionsArray[i] + ">" + optionsArray[i] + " </option>"
	    }
	}
	elem.html(options);
}

function addOptionsToSelectViaElem(optionsArray, elem){
	if(optionsArray && optionsArray.length > 0) {
		for(var i=0; i<optionsArray.length; i++) {
			var option = document.createElement("option");
			option.text = optionsArray[i];
			elem.add(option);
	    }
	}
}

function addOptionsToDatalistViaElem(optionsArray, elem){
	$(elem).find("option").remove();
	if(optionsArray && optionsArray.length > 0) {
		for(var i=0; i<optionsArray.length; i++) {
			var option = document.createElement("option");
			option.value = optionsArray[i]; 
			elem.append(option);
	    }
	}
}

function addOptionsToSelectViaElemHtml(optionsArray, elem){
	if(optionsArray && optionsArray.length > 0) {
		for(var i=0; i<optionsArray.length; i++) {
			var option = document.createElement("option");
			$(option).html(optionsArray[i]);
			elem.add(option);
	    }
	}
}

function cloneDOM(elemToClone, parentElem){
	parentElem.append(elemToClone.clone());
}

function getFileValue(){
	/*jQuery.get('js/Extras.txt').done(function(txt){
		console.log("txt", txt);
	});*/
	
	$.ajax({
        headers: { "Accept": "application/json"},
        type: 'GET',
        url: 'data/Extras.txt',
        crossDomain: true,
        beforeSend: function(xhr){
            xhr.withCredentials = true;
      },
        success: function(data, textStatus, request){
            console.log("123" + data);
        }
	});

}

function getIngredientNamesByCategory(ingredientJson, categoryName)
{
	var ingredientCategories = Object.keys(ingredientJson);
	var ingArrToRet = [];
	for(var i=0; i<ingredientCategories.length; i++) {
		tempCategorizedIngArr = ingredientJson[ingredientCategories[i]];
		for(var j=0; j<tempCategorizedIngArr.length; j++) {
			var tempIngObj = tempCategorizedIngArr[j];
			if(!$.isEmptyObject(tempIngObj)) {
				if(categoryName) {
					if(categoryName == ingredientCategories[i]) {
						ingArrToRet.push(tempIngObj["name"]);
					}
				}
				else {
					ingArrToRet.push(tempIngObj["name"]);
				}
				
			}
	    }
	}
	return ingArrToRet;
}

function getIngredientById(ingredientJson, id) {
	var toRet = null;
	$.each( ingredientJson, function( categoryName, ingredientsArr ) {
		if(categoryName!="_id" && categoryName!="name")
		{
			$.each(ingredientsArr, function( index, ingredientObj ) {
				  if((ingredientObj.id).toString() == id) {
					  var tempObj = ingredientObj;
					  tempObj.categoryName = categoryName;
					  toRet = tempObj;
					  return false;
			      }
			});
		}
		if(toRet != null) {
			return false;
		}
			
	});
	return toRet;
}

function getIngredientsByName(ingredientJson, name) {		//For Search
	var toRet = [];
	$.each( ingredientJson, function( catName, ingArr ) {
		if(catName!="_id" && catName!="name")
		{
			$.each(ingArr, function( index, ingredientObj ) {
			  	if((ingredientObj.name.toLowerCase()).indexOf(name.toLowerCase())>-1) {
			  		ingredientObj.category = catName;
				  	toRet.push(ingredientObj);
		      	}
			});
		}
	});
	return toRet;
}

function getIngredientIdByNameAndCat(ingredientJson, name, category) {
	var toRet = -1;
	$.each( ingredientJson, function( catName, ingArr ) {
		if(category && catName!="_id" && catName!="name" && category.toLowerCase() == catName.toLowerCase())
		{
			$.each(ingArr, function( index, ingredientObj ) {
			  	if(ingredientObj.name.toLowerCase() == name.toLowerCase()) {
			  		toRet = ingredientObj.id;
			  		return toRet;
		      	}
			});
		}
	});
	return toRet;
}

function getSupplimentIdsFromIngredients(ingredientJson) {
	var toRet = [];
	$.each( ingredientJson, function( categoryName, ingredientsArr ) {
		if(categoryName!="_id" && categoryName!="name")
		{
			$.each(ingredientsArr, function( index, ingredientObj ) {
				  if(ingredientObj.isSuppliment) {
					  toRet[toRet.length] = ingredientObj.id;
			      }
			});
		}			
	});
	return toRet;
}

function getSupplimentIdByName(supplimentIds, name) {
	var toRet = -1;
	$.each( supplimentIds, function( index, id ) {
		var ingredientObj = getIngredientById(ingredientJson, id);
		if(ingredientObj.name.toLowerCase() == name.toLowerCase()) {
	  		toRet = ingredientObj.id;
	  		return toRet;
      	}
	});
	return toRet;
}

function getIngredientUnitsByName(ingredientJson, name) {
	var toRet = null;
	$.each( ingredientJson, function( categoryName, ingredientsArr ) {
		if(categoryName!="_id" && categoryName!="name")
		{
			$.each(ingredientsArr, function( index, ingredientObj ) {
				  if((ingredientObj.name).toString() == name) {
					  var tempArr = [];
					  if(ingredientObj.unit == "gram") {
						  tempArr = ["gram", "kg"]
					  }
					  else if(ingredientObj.unit == "ml") {
						  tempArr = ["ml", "ltr"]
					  }
					  else {
						  tempArr.push(ingredientObj.unit);
					  }
					  toRet = tempArr;
					  return false;
			      }
			});
		}
		if(toRet != null) {
			return false;
		}
			
	});
	return toRet;
}

function getRecipeByCategory(recipeJson, catName) {
	var toRet = null;
	var tempArr = [];
	$.each(recipeJson, function( index, recipeObj ) {
		if(recipeObj.itemCategory && recipeObj.itemCategory.toLowerCase() == catName.toLowerCase()) {
			tempArr.push(recipeObj);
		}
	});
	if(tempArr.length>0)
	{
		toRet = tempArr;
	}
	return toRet;
}

function getCategoryBySession(session){
	var categories= [];
	if(session == "Morning"){
		categories = morning_recipe_category;
	}
	else if(session == "Afternoon"){
		categories = lunch_recipe_category;	
	}
	else if(session == "Night"){
		categories = night_recipe_category;
	}
	else if(session == "Evening"){
		categories = evening_recipe_category;
	}
	else{
		categories = recipeCategory;
	}
	return categories;
}

function getRecipeNamesByCategory(recipeJson, catName) {
	var toRet = null;
	var tempArr = [];
	$.each(recipeJson, function( index, recipeObj ) {
		if(recipeObj.itemCategory && recipeObj.itemCategory.toLowerCase() == catName.toLowerCase()) {
			tempArr.push(recipeObj.name);
		}
	});
	if(tempArr.length>0)
	{
		toRet = tempArr;
	}
	return toRet;
}

function getRecipeByName(recipeJson, recipeName) {		//For Search
	var toRet = null;
	var tempArr = [];
	$.each(recipeJson, function( index, recipeObj ) {
		if((recipeObj.name && (recipeObj.name.toLowerCase().indexOf(recipeName.toLowerCase())>-1)) || (recipeObj.tamilName && (recipeObj.tamilName.toLowerCase().indexOf(recipeName.toLowerCase())>-1)) ) {
			tempArr.push(recipeObj);
		}
	});
	if(tempArr.length>0)
	{
		toRet = tempArr;
	}
	return toRet;
}

function getRecipeIdByName(recipeJson, recipeName) {
	var toRet = null;
	var tempArr = [];
	$.each(recipeJson, function( index, recipeObj ) {
		if(recipeObj.name && recipeName && recipeObj.name.toLowerCase() == recipeName.toLowerCase()) {
			tempArr.push(recipeObj.id);
		}
	});
	if(tempArr.length==1)
	{
		toRet = Number(tempArr[0]);
	}
	else
	{
		toRet = -1;
	}
	return toRet;
}

function getRecipeObjById(recipeJson, idToFind) {
	var toRet = null;
	$.each(recipeJson, function( index, recipeObj ) {
		if(recipeObj.id == idToFind) {
			toRet = recipeObj;
		}
	});
	return toRet;
}

function getIngredientsListOfRecipe(receipeId, receipeData)
{
    var currRecipe = getRecipeObjById(receipeData, receipeId);
    
    return (currRecipe && currRecipe.Ingredients) ? currRecipe.Ingredients : [];
}

function getIndexForIdForIng(ingredientJson, category, id) {
	var indexToRet = 0;
	var toRet = -1;
	$.each( ingredientJson, function( catName, ingArr ) {
		if(catName == category)
		{
			$.each(ingArr, function( index, ingredientObj ) {
			  	if(ingredientObj.id == id)
			  	{
			  		toRet = indexToRet;
			  	}
			  	else
			  	{
			  		indexToRet++;
			  	}
			});
		}
	});

	return toRet;
}

function getIndexForIdForRecipe(recipeJson, id) {
	var indexToRet = 0;
	var toRet = -1;
	
	$.each(recipeJson, function( index, recipeObj ) {
	  	if(recipeObj.id == id)
	  	{
	  		toRet = indexToRet;
	  	}
	  	else
	  	{
	  		indexToRet++;
	  	}
	});

	return toRet;
}

function getOrderObjById(ordersJson, idToFind) {
	var toRet = null;
	$.each(ordersJson, function( index, orderObj ) {
		if(orderObj.orderId == idToFind) {
			toRet = orderObj;
		}
	});
	return toRet;
}

function getCategoriesBySession(session) {
	var toRet = "";

	if(session.toLowerCase() == "morning")
	{
		toRet = morning_recipe_category;
	}
	else if(session.toLowerCase() == "afternoon")
	{
		toRet = lunch_recipe_category;
	}
	else if(session.toLowerCase() == "evening")
	{
		toRet = evening_recipe_category;
	}
	else if(session.toLowerCase() == "night")
	{
		toRet = night_recipe_category;
	}

	return toRet;
}

function fillNumOfPplInEventsWithParent(parentElem) {
	var commonNumOfPplToFill = $(parentElem).find('.cls_commonNumOfPpl_sf').val();
	if(commonNumOfPplToFill!=undefined && commonNumOfPplToFill.length>0 && $(parentElem).find('.cls_receipeCount_sf')!=undefined)
	{
		$(parentElem).find('.cls_receipeCount_sf').val(commonNumOfPplToFill);
	}	
}

function fillNumOfPplInEventsForCurrElem(currElem, parentElem) {
	var commonNumOfPplToFill = $(parentElem).find('.cls_commonNumOfPpl_sf').val();
	if(commonNumOfPplToFill!=undefined && commonNumOfPplToFill.length>0 && currElem.find('#id_receipeCount_sf')!=undefined)
	{
		currElem.find('#id_receipeCount_sf').val(commonNumOfPplToFill);
	}	
}

function getSupplimentNames() {
	var toRet = null;
	var tempArr = [];
	$.each(supplimentIds, function( index, supplimentId ) {
		var currIng = getIngredientById(ingredientJson, supplimentId);
		if(currIng && currIng.name) {
			tempArr.push(currIng.name);
		}
	});
	if(tempArr.length>0)
	{
		toRet = tempArr;
	}
	return toRet;
}

function getNextId(jsonToFind, module) {
	var highestId = 0;
	if(module == "Ingredient")
	{
		$.each( jsonToFind, function( catName, ingArr ) {
			if(catName!="_id" && catName!="name")
			{
				$.each(ingArr, function( index, ingredientObj ) {
				  	if(ingredientObj.id > highestId)
				  	{
				  		highestId = ingredientObj.id;
				  	}
				});
			}
		});
	}
	else if(module == "Recipe")
	{
		$.each(jsonToFind, function( index, receipeObj ) {
		  	if(receipeObj.id > highestId)
		  	{
		  		highestId = receipeObj.id;
		  	}
		});
	}
	return highestId+1;
}

function getUrlParts(url){
	// url contains your data.
	var qs = url.indexOf("?");
	    if(qs==-1) return [];
	    var fr = url.indexOf("#");
	    var q="";
	    q = (fr==-1)? url.substr(qs+1) : url.substr(qs+1, fr-qs-1);
	var parts=q.split("&");
	var vars={};
	for(var i=0;i<parts.length; i++){
	var p = parts[i].split("=");
	        if(p[1]){
	vars[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
	        }else{
	            vars[decodeURIComponent(p[0])] = "";
	        }
	}
	// vars contain all the variables in an array.
	return vars;
}

function addUrlParam(url, paramNameToAdd, paramValueToAdd){
// url contains your data.
	var qs = url.indexOf("?");
    if(qs==-1) return url+"?"+paramNameToAdd+"="+paramValueToAdd;
	var toReturl = url.split("?")[0];
	if(url.split("?")[1].length==0) return url+paramNameToAdd+"="+paramValueToAdd;
    var fr = url.indexOf("#");
    var q="";
    q = (fr==-1)? url.substr(qs+1) : url.substr(qs+1, fr-qs-1);
	var parts=q.split("&");
	var vars={};
	var replaced = false;
	for(var i=0;i<parts.length; i++){
	var p = parts[i].split("=");
        if(p[1]){
			if(paramNameToAdd == decodeURIComponent(p[0]))
			{
				vars[decodeURIComponent(p[0])] = paramValueToAdd;
				replaced = true;
			}
			else
			{
				vars[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
			}
        }
        else{
            vars[decodeURIComponent(p[0])] = "";
        }
	}
	for(var i=0;i<Object.keys(vars).length; i++)
	{
		toReturl += ((i==0 ? "?" : "&") + Object.keys(vars)[i] + "=" + vars[Object.keys(vars)[i]]);
	}
	if(replaced == false)
	{
		toReturl += "&"+paramNameToAdd+"="+paramValueToAdd;
	}
	// vars contain all the variables in an array.
	return toReturl;
}

function removeQueryParamFromUrl(url, paramNameToRemove){
// url contains your data.
	var qs = url.indexOf("?");
    if(qs==-1) return url;
	var toReturl = url.split("?")[0];
	if(url.split("?")[1].length==0) return url;
    var fr = url.indexOf("#");
    var q="";
    q = (fr==-1)? url.substr(qs+1) : url.substr(qs+1, fr-qs-1);
	var parts=q.split("&");
	var vars={};
	for(var i=0;i<parts.length; i++){
	var p = parts[i].split("=");
        if(paramNameToRemove != decodeURIComponent(p[0]))
		{
			vars[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
		}
	}
	for(var i=0;i<Object.keys(vars).length; i++)
	{
		toReturl += ((i==0 ? "?" : "&") + Object.keys(vars)[i] + "=" + vars[Object.keys(vars)[i]]);
	}
	// vars contain all the variables in an array.
	return toReturl;
}

function removeTrailingCharIf(value, ifChar)
{
	var toRet = value;
	if(value && value.length>0)
	{
		var trailingChar = value.substring(value.length-1,value.length);
		if(trailingChar == ifChar)
		{
			toRet = value.substring(0,value.length-1);
		}
	}
	return toRet;
}

function isInList(itemToCheck, listToCheck)
{
	var toRet = false;

	for(var i=0; i<listToCheck.length; i++)
	{
		if(itemToCheck.toLowerCase() == listToCheck[i].toLowerCase())
		{
			toRet = true;
			break;
		}
	}

	return toRet;
}

function getQtyWithDecimalFraction(currQty, currFraction) {
	if(currFraction == "¼")
	{
		currQty = Number(currQty) + Number(.25);
	}
	else if(currFraction == "½")
	{
		currQty = Number(currQty) + Number(.5);
	}
	else if(currFraction == "¾")
	{
		currQty = Number(currQty) + Number(.75);
	}

	return Number(currQty);
};

function getQtyWithoutDecimal(qty) {
	var qtyToRet = qty;

	if(qty.toString().indexOf(".")>-1)
	{
		qtyToRet = qty.toString().split(".")[0];
	}
	
	return Number(qtyToRet);
};

function getFractionFromQty(qty) {
	var fracToRet = "";
	var currFraction = "";

	if(qty.toString().indexOf(".")>-1)
	{
		currFraction = qty.toString().split(".")[1];
	}

	if(currFraction == 25)
	{
		fracToRet = "¼";
	}
	else if(currFraction == 5)
	{
		fracToRet = "½";
	}
	else if(currFraction == 75)
	{
		fracToRet = "¾";
	}

	return fracToRet;
};

function showLoading()
{
	$('.loadingguage').modal('show');
}

function hideLoading()
{
	$('.loadingguage').modal('hide');
}

function registerDatepickerEvent(){
	setTimeout(function(){
		$('.cls_sessionDateTime').datetimepicker({
            //sideBySide: true,
            ignoreReadonly: true,
            //format: "DD/MM/YYYY hh:mm A"
            format: "DD/MM/YYYY"
        });
	}, 200);
}

function registerOrderLevelDatepickerEvent(){
	setTimeout(function(){
		$('.cls_curOrderDate').datetimepicker({
            ignoreReadonly: true,
            format: "DD/MM/YYYY"
        });
	}, 200);
}

Date.prototype.toShortFormat = function() {

    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    
    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();
    
    return "" + month_names[month_index] + " " + day + ", " + year;
}

function toDate(dateStr) {
  const [day, month, year] = dateStr.split("/")
  return new Date(year, month - 1, day);
}

/*function loadFile(file, elem){

	$.ajax({
      crossOrigin: false,
      url: file,
      success: function(data) {
        alert("asd");	
      }
    });

	var headers = new Headers();
	headers.append("Access-Control-Allow-Origin", "*");
	headers.append("Access-Control-Allow-Credentials", true);
	headers.append("Access-Control-Allow-Methods", "GET");
	$.ajax({
      type: "GET",
	  xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
	  headers: {"Access-Control-Allow-Origin": "*"},
      url: file,
      success: function(data) {
        elem.html(data);
      },
      error: function(data) {
      	console.log(data);
      }
    });

	var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
}*/
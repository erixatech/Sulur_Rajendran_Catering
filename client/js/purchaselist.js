function calculatePL(serviceFormReceipeMap){
	var dummyReceipeList = [{"id":1, "name":"jelabi", "Ingredients":[{"tamilName":"sugar","quantity":100,"unit":"gram"},{"tamilName":"oil","quantity":200,"unit":"ml"}]},{"id":1, "name":"idly", "Ingredients":[{"tamilName":"ulundhu","quantity":800,"unit":"gram"},{"tamilName":"maavu","quantity":20,"unit":"kilo"},{"tamilName":"oil","quantity":200,"unit":"ml"}]}];
	var dummyIngredientsList = [{"id": 1,"tamilName": "sugar", "category":"maligai", "unit":"gram"},{"id": 2,"tamilName": "oil", "category":"maligai", "unit":"ml"},{"id": 3,"tamilName": "ulundhu", "category":"maligai", "unit":"gram"},{"id": 4,"tamilName": "maavu", "category":"kaikanigal", "unit":"gram"}];
	
	var PLToGenerate = [];

	for(var i = 0; i < serviceFormReceipeMap.length; i++)
    {
        var receipeToTake = serviceFormReceipeMap[i].name;
        var currIngList = getIngredientsList(receipeToTake, dummyReceipeList);
        for(var j = 0; j < currIngList.length; j++)
    	{
    		var currIngItem = currIngList[j];
    		var qtyToAdd = currIngItem.quantity;
    		var unitToAdd = currIngItem.unit;

    		if(unitToAdd == "kilo")
    		{
    			qtyToAdd = qtyToAdd * 1000;
    			unitToAdd = "gram";
    		}
    		else if(unitToAdd == "litre")
    		{
    			qtyToAdd = qtyToAdd * 1000;
    			unitToAdd = "ml";
    		}
    		else if(unitToAdd == "dozen")
    		{
    			qtyToAdd = qtyToAdd * 12;
    			unitToAdd = "nos";
    		}

    		var ingItemForPL = {"name" : currIngList[j].tamilName, "quantity" : qtyToAdd, "unit" : unitToAdd};
    		var ingItemIndexInList = isAlreadyPresentInPL(ingItemForPL, PLToGenerate);

    		if(ingItemIndexInList != -1)
    		{
    			PLToGenerate[ingItemIndexInList].quantity = PLToGenerate[ingItemIndexInList].quantity + qtyToAdd;
    		}
    		else
    		{
    			PLToGenerate[PLToGenerate.length] = ingItemForPL;
    		}
    	}
    }

    PLToGenerate = incByOnePrec(PLToGenerate);
    PLToGenerate = unitConversion(PLToGenerate);
    PLToGenerate = roundOffPL(PLToGenerate);
    PLToGenerate = getCategorizedPL(PLToGenerate, dummyIngredientsList);
    console.log(PLToGenerate);
    initiatePL(PLToGenerate);
}

function getIngredientsList(receipeToTake, receipeList)
{
	for(var i = 0; i < receipeList.length; i++)
    {
        if(receipeList[i].name == receipeToTake)
        {
        	return receipeList[i].Ingredients;
        }

    }
    return [];
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
	var categorizedPL = {"maligai":[],"kaikanigal":[],"extras":[],"suppliments":[]};
	for(var i = 0; i < PLToCategorize.length; i++)
    {
    	var ingName = PLToCategorize[i].name;

    	for(var j = 0; j < ingredientsList.length; j++)
    	{
    		if(ingredientsList[j].tamilName == ingName)
    		{
    			if(ingredientsList[j].category == "maligai")
    			{
    				categorizedPL.maligai[categorizedPL.maligai.length] = PLToCategorize[i];
    			}
    			else if(ingredientsList[j].category == "kaikanigal")
    			{
    				categorizedPL.kaikanigal[categorizedPL.kaikanigal.length] = PLToCategorize[i];
    			}
    			else if(ingredientsList[j].category == "extras")
    			{
    				categorizedPL.extras[categorizedPL.extras.length] = PLToCategorize[i];
    			}
    			else if(ingredientsList[j].category == "suppliments")
    			{
    				categorizedPL.suppliments[categorizedPL.suppliments.length] = PLToCategorize[i];
    			}
    		}
		}
    }

    if(categorizedPL.maligai.length == 0)
	{
		delete categorizedPL.maligai;
	}
	if(categorizedPL.kaikanigal.length == 0)
	{
		delete categorizedPL.kaikanigal;
	}
	if(categorizedPL.extras.length == 0)
	{
		delete categorizedPL.extras;
	}
	if(categorizedPL.suppliments.length == 0)
	{
		delete categorizedPL.suppliments;
	}

	return categorizedPL;
}

function initiatePL(PLToRender)
{
	// TODO: Save PL To DB
	var plWindow = window.open("purchaselistgen.html");
}
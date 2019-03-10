﻿function IngredientTab(){
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
	_this.ingredientJson = {};

	$.ajax({
    	url: "/getIngredients?category=all",
    	type: "get",
    	success: function(result){
    		if(result && result.length == 1)
    		_this.ingredientJson = result[0];
			_this.renderIngredients("All");
		},
		error: function(){
		    alert('Failed to fetch Ingredients.. Please Try again later..');
		}
	});
	//_this.ingredientJson = {"Maligai":[{"id":1,"name":"மஞ்சத்தூள்","unit":"gram"},{"id":2,"name":"புளி","unit":"gram"},{"id":3,"name":"சக்தி மிளகாய்தூள்","unit":"gram"},{"id":4,"name":"துவரம்பருப்பு","unit":"gram"},{"id":5,"name":"சக்தி மல்லி தூள்","unit":"gram"},{"id":6,"name":"கடலைபருப்பு","unit":"gram"},{"id":7,"name":"சக்தி சாம்பார் தூள்","unit":"gram"},{"id":8,"name":"உடைத்த உளுந்து","unit":"gram"},{"id":9,"name":"சக்தி ரச தூள்","unit":"gram"},{"id":10,"name":"பாசிப்பருப்பு","unit":"gram"},{"id":11,"name":"சக்தி கறிமசால் தூள்","unit":"gram"},{"id":12,"name":"வடைபருப்பு","unit":"gram"},{"id":13,"name":"சக்தி மட்டன் மசாலாதூள்","unit":"gram"},{"id":14,"name":"பச்சைபயிறு","unit":"gram"},{"id":15,"name":"சக்தி சிக்கன் மசாலாதூள்","unit":"gram"},{"id":16,"name":"கருப்புசுண்டல்","unit":"gram"},{"id":17,"name":"சக்தி மீன்குழம்பு மசாலாதூள்","unit":"gram"},{"id":18,"name":"வெள்ளைசுண்டல்","unit":"gram"},{"id":19,"name":"சக்தி இட்லி பொடி","unit":"gram"},{"id":20,"name":"சைனாபூண்டு (பெரியபல்)","unit":"gram"},{"id":21,"name":"சக்தி பிரியாணி மசாலா","unit":"gram"},{"id":22,"name":"உரித்த நாட்டுப்பூண்டு","unit":"gram"},{"id":23,"name":"குருமிளகு தூள்","unit":"gram"},{"id":24,"name":"மொட்டு பொட்டுக்கடலை","unit":"gram"},{"id":25,"name":"சாட் மசாலா தூள்","unit":"gram"},{"id":26,"name":"வருத்தநிலக்கடலை","unit":"gram"},{"id":27,"name":"வெள்ளை மிளகு தூள்","unit":"gram"},{"id":28,"name":"கெட்டிஅவுல்","unit":"gram"},{"id":29,"name":"சீரக தூள்","unit":"gram"},{"id":30,"name":"சாப்பாடு அரிசி (மஹாராஜா)","unit":"gram"},{"id":31,"name":"கரம் மசாலா தூள்","unit":"gram"},{"id":32,"name":"PT பச்சரிசி","unit":"gram"},{"id":33,"name":"சென்னா மசாலா தூள்","unit":"gram"},{"id":34,"name":"இட்லி அரிசி (தோசைக்கு)","unit":"gram"},{"id":35,"name":"பெருங்காயதூள் (200 கிராம் டின்)","unit":"gram"},{"id":36,"name":"உருண்டை உளுந்து (வடைக்கு)","unit":"gram"},{"id":37,"name":"CA ஸ்டார் சில்லிமசாலா தூள்","unit":"gram"},{"id":38,"name":"பாசுமதி பிரியாணி அரிசி","unit":"gram"},{"id":39,"name":"கல்உப்பு","unit":"gram"},{"id":40,"name":"சீரகசம்பா பிரியாணிஅரிசி","unit":"gram"},{"id":41,"name":"பொடிஉப்பு","unit":"gram"},{"id":42,"name":"மயில்மார்க் சம்பாரவை","unit":"gram"},{"id":43,"name":"கடுகு","unit":"gram"},{"id":44,"name":"பட்டணரவை","unit":"gram"},{"id":45,"name":"மிளகு","unit":"gram"},{"id":46,"name":"பாயாச கோதிரவை","unit":"gram"},{"id":47,"name":"சீரகம்","unit":"gram"},{"id":48,"name":"நைலான் ஜல்லரிசி","unit":"gram"},{"id":49,"name":"வெந்தயம்","unit":"gram"},{"id":50,"name":"பிரியா அடைபிரதம்","unit":"gram"},{"id":51,"name":"கொத்து மல்லி","unit":"gram"},{"id":52,"name":"முழு முந்திரி(கேரளா)","unit":"gram"},{"id":53,"name":"உருண்டைவரமிளகாய்","unit":"gram"},{"id":54,"name":"பிளவு முந்திரி(கேரளா)","unit":"gram"},{"id":55,"name":"நீளவரமிளகாய்","unit":"gram"},{"id":56,"name":"திராட்சை","unit":"gram"},{"id":57,"name":"பட்டை","unit":"gram"},{"id":58,"name":"அஸ்கா சர்க்கரை","unit":"gram"},{"id":59,"name":"கிராம்பு","unit":"gram"},{"id":60,"name":"நர சுஸ் காபித்தூள்","unit":"gram"},{"id":61,"name":"ஏலக்காய்","unit":"gram"},{"id":62,"name":"கிரீன்லேபிள் காபித்தூள்","unit":"gram"},{"id":63,"name":"சோம்பு","unit":"gram"},{"id":64,"name":"சன்ரைஸ் காபித்தூள்","unit":"gram"},{"id":65,"name":"சுண்டவத்தல்","unit":"gram"},{"id":66,"name":"திரீரோசஸ் டீ தூள்","unit":"gram"},{"id":67,"name":"சாமை அரிசி","unit":"gram"},{"id":68,"name":"ரெட் சில்லி சாஸ் (பாட்டில்)","unit":"nos"},{"id":69,"name":"வரகு அரிசி","unit":"gram"},{"id":70,"name":"கிரீன் சில்லி சாஸ் (பாட்டில்)","unit":"nos"},{"id":71,"name":"குதிரைவாலிஅரிசி","unit":"gram"},{"id":72,"name":"தக்காளி சூப் மிக்ஸ்","unit":"gram"},{"id":73,"name":"தினை அரிசி","unit":"gram"},{"id":74,"name":"வெஜ் சூப் மிக்ஸ்","unit":"gram"},{"id":75,"name":"கம்புஅரிசி ரவை","unit":"gram"},{"id":76,"name":"கிசான் மேங்கோ (750மிலி)  (பாட்டில்)","unit":"nos"},{"id":77,"name":"கசகசா","unit":"gram"},{"id":78,"name":"கஸ்தூரி மேத்தி  (எவரெஸ்ட்)","unit":"gram"},{"id":79,"name":"வெள்ளை ரஸ்க் தூள்","unit":"gram"},{"id":80,"name":"மில்க்மெய்டு 400கிராம் டின்","unit":"nos"},{"id":81,"name":"அச்சுவெல்லம்","unit":"gram"},{"id":82,"name":"உருளைசிப்ஸ்","unit":"gram"},{"id":83,"name":"உருண்டைவெல்லம்","unit":"gram"},{"id":84,"name":"அரிசி வடகம்","unit":"gram"},{"id":85,"name":"பில்ஸ்பெரி கோதுமைமாவு","unit":"gram"},{"id":86,"name":"பாப்புலர் அப்பளம் (270கிராம்)","unit":"kattu"},{"id":87,"name":"மைதா மாவு(பன்னாரி)","unit":"gram"},{"id":88,"name":"சான் வெஜ் பிரட் (பெரிய சைஸ்)","unit":"nos"},{"id":89,"name":"கிழங்குமாவு","unit":"gram"},{"id":90,"name":"கடலைமாவு","unit":"gram"},{"id":91,"name":"அரிசிமாவு","unit":"gram"},{"id":92,"name":"கார்ன்பிளவர் மாவு","unit":"gram"},{"id":93,"name":"ராகி மாவு","unit":"gram"},{"id":94,"name":"கம்பு மாவு","unit":"gram"},{"id":95,"name":"சோள மாவு","unit":"gram"},{"id":96,"name":"பணங்கற்கண்டு","unit":"gram"},{"id":97,"name":"பாசிப்பருப்பு மாவு","unit":"gram"},{"id":98,"name":"அயிட்ரோஸ்","unit":"gram"},{"id":99,"name":"சாதா நூடுல்ஸ்","unit":"gram"},{"id":100,"name":"கம்பி மஞ்சி","unit":"nos"},{"id":101,"name":"நந்திமார்க் ஜிலேபி பருப்பு","unit":"gram"},{"id":102,"name":"அமுல்யா பால் பவுடர்","unit":"gram"},{"id":103,"name":"பாதாம்பருப்பு","unit":"gram"},{"id":104,"name":"பிஸ்தா பருப்பு","unit":"gram"},{"id":105,"name":"வெள்ளரி விதை","unit":"gram"},{"id":106,"name":"அத்திப்பழம்","unit":"gram"},{"id":107,"name":"செரிப்பழம்","unit":"gram"},{"id":108,"name":"கேசர்அங்கூரி (850கிராம் டின்)","unit":"nos"},{"id":109,"name":"கணபதி ஆயில் (டின்)","unit":"nos"},{"id":110,"name":"நல்லெண்ணெய்","unit":"ml"},{"id":111,"name":"தேங்காய் எண்ணெய்","unit":"ml"},{"id":112,"name":"விளக்கெண்ணெய்","unit":"ml"},{"id":113,"name":"டால்டா","unit":"gram"},{"id":114,"name":"ஐயப்பா நெய் (டின்)","unit":"nos"},{"id":115,"name":"பச்சை கற்பூரம்","unit":"gram"},{"id":116,"name":"ரெட் கலர்","unit":"gram"},{"id":117,"name":"லெமன் கலர்","unit":"gram"},{"id":118,"name":"பச்சை கலர்","unit":"gram"},{"id":119,"name":"சோடா உப்பு","unit":"gram"},{"id":120,"name":"ரோஸ் எசன்ஸ் (பாட்டில்)","unit":"nos"},{"id":121,"name":"பருப்பு ஒப்புட்டு","unit":"nos"},{"id":122,"name":"பைனாப்பிள் எசன்ஸ் (பாட்டில்)","unit":"nos"},{"id":123,"name":"பாதாம்மாஸ் பவுடர்","unit":"gram"},{"id":124,"name":"வினிகர் 750 மிலி (பாட்டில்)","unit":"nos"},{"id":125,"name":"ராஜம் சுக்குகாபி மிக்ஸ்","unit":"gram"},{"id":126,"name":"ஸ்பெஷல் தேன்","unit":"gram"},{"id":127,"name":"சேவரட் சேமியா","unit":"gram"},{"id":128,"name":"தக்காளி சாஸ் (பாட்டில்)","unit":"nos"},{"id":129,"name":"பேனி ரவை","unit":"gram"},{"id":130,"name":"சோயா சாஸ் (பாட்டில்)","unit":"nos"},{"id":131,"name":"கொள்ளு","unit":"gram"}],"KaaiKanigal":[{"id":132,"name":"தேங்காய் (வெள்ளைக்காய் பெரியது)","unit":"nos"},{"id":133,"name":"பட்டர் பீன்ஸ் விதைமட்டும்","unit":"gram"},{"id":134,"name":"பெரிய வெங்காயம் (பெரியது)","unit":"gram"},{"id":135,"name":"பேபிகார்ன் உறித்தது","unit":"gram"},{"id":136,"name":"சின்ன வெங்காயம் (பெரியது)","unit":"gram"},{"id":137,"name":"அமெரிக்கன் சுவீட் கார்ன்","unit":"gram"},{"id":138,"name":"குண்டு பச்சைமிளகாய்","unit":"gram"},{"id":139,"name":"வெற்றிலை","unit":"kowli"},{"id":140,"name":"முருங்கைக்காய்","unit":"gram"},{"id":141,"name":"பிஞ்சு கத்தரிக்காய்","unit":"gram"},{"id":142,"name":"அரசாணிக்காய்","unit":"gram"},{"id":143,"name":"பூசணிக்காய் (பெரிய சைஸ்)","unit":"gram"},{"id":144,"name":"கேரட்","unit":"gram"},{"id":145,"name":"பீன்ஸ்","unit":"gram"},{"id":146,"name":"முட்டைக்கோஸ்","unit":"gram"},{"id":147,"name":"பைனாப்பிள் பழம்","unit":"nos"},{"id":148,"name":"பச்சைப்பட்டாணிக்காய்","unit":"gram"},{"id":149,"name":"மாதுளம்பழம்","unit":"gram"},{"id":150,"name":"காளிபிளவர்","unit":"gram"},{"id":151,"name":"திராட்சைபழம் (பன்னீர்)","unit":"gram"},{"id":152,"name":"புடலங்காய்","unit":"gram"},{"id":153,"name":"வெள்ளை திராட்சை","unit":"gram"},{"id":154,"name":"வெண்டைக்காய்","unit":"gram"},{"id":155,"name":"அல்போன்ஷா மாம்பழம்","unit":"gram"},{"id":156,"name":"டர்னிப்","unit":"gram"},{"id":157,"name":"சப்போட்டா பழம்","unit":"gram"},{"id":158,"name":"நூல்கோஸ்","unit":"gram"},{"id":159,"name":"பீட்ரூட்","unit":"gram"},{"id":160,"name":"அவரைக்காய்","unit":"gram"},{"id":161,"name":"கொத்தவரங்காய்","unit":"gram"},{"id":162,"name":"அரைகீரை","unit":"gram"},{"id":163,"name":"வாழைக்காய்","unit":"nos"},{"id":164,"name":"வாழைப்பூ","unit":"nos"},{"id":165,"name":"மொட்டுக்காளான்","unit":"gram"},{"id":166,"name":"உருளைகிழங்கு","unit":"gram"},{"id":167,"name":"சேனைகிழங்கு (பாலக்காடு)","unit":"gram"},{"id":168,"name":"சிப்பிக்காளான்","unit":"gram"},{"id":169,"name":"கிளிமூக்கு மாங்காய்","unit":"gram"},{"id":170,"name":"முட்டை","unit":"nos"},{"id":171,"name":"ஆப்பிள் தக்காளி (பழமாக)","unit":"gram"},{"id":172,"name":"கோவக்காய்","unit":"gram"},{"id":173,"name":"இஞ்சி","unit":"gram"},{"id":174,"name":"மாங்காய் இஞ்சி","unit":"gram"},{"id":175,"name":"வெள்ளரிப்பிஞ்சு","unit":"gram"},{"id":176,"name":"குடமிளகாய் (பச்சை,மஞ்சள், சிவப்பு)","unit":"gram"},{"id":177,"name":"எலுமிச்சம்பழம் (பெரிய சைஸ்)","unit":"nos"},{"id":178,"name":"புதிய கருவேப்பிலை","unit":"gram"},{"id":179,"name":"புதிய மல்லித்தழை","unit":"kattu"},{"id":180,"name":"புதிய புதினாதழை","unit":"kattu"},{"id":181,"name":"கறி பலாக்காய் (பிஞ்சு)","unit":"gram"},{"id":182,"name":"ஸ்பிரிங் ஆனியன்","unit":"kattu"}],"Extras":[{"id":183,"name":"ஸ்வீட்டுக்கு ஸ்பெஷல் பசும்பால்(தேன்பால்)","unit":"ml"},{"id":184,"name":"அரோமா ஸ்பெஷல் பாக்கெட் பால்","unit":"ml"},{"id":185,"name":"அரோமா ஸ்பெஷல் பாக்கெட் தயிர்","unit":"ml"},{"id":186,"name":"20லி தண்ணீர் கேன் TAP'D Water (AKA aqua farms)","unit":"nos"},{"id":187,"name":"300மிலி குடிநீர் பாட்ல் TAP'D Water (AKA aqua farms)","unit":"nos"},{"id":188,"name":"சர்க்கரை இல்லாத பால்கோவா","unit":"gram"},{"id":189,"name":"ஸ்லீட்நைஸ் பால்கோவா","unit":"gram"},{"id":190,"name":"சிவசக்தி ஸ்பெஷல் நெய் (டின்)","unit":"nos"},{"id":191,"name":"விக்னேஷ் சில்லி மசாலா","unit":"gram"},{"id":192,"name":"ஸ்பெஷல் பால் பனீர்","unit":"gram"},{"id":193,"name":"சர்க்கரை இல்லாத பால்கோவா","unit":"gram"},{"id":194,"name":"மில்க்கிரீம்","unit":"gram"},{"id":195,"name":"வெண்ணெய்","unit":"gram"},{"id":196,"name":"மெது இட்லி மாவு","unit":"gram"},{"id":197,"name":"இளநீர் இட்லி மாவு","unit":"gram"},{"id":198,"name":"தட்டு இட்லி மாவு","unit":"gram"},{"id":199,"name":"ஸ்பெஷல் தோசை மாவு","unit":"gram"},{"id":200,"name":"ஸ்பெஷல் இடியாப்பம் மாவு","unit":"gram"},{"id":201,"name":"ஸ்பெஷல் ஆப்பம் மாவு","unit":"gram"},{"id":202,"name":"ஐஸ்பார் (50கிலோ அளவு)","unit":"nos"}],"Suppliments":[{"id":203,"name":"பெரிய பெட்டிக்கூடை","unit":"nos"},{"id":204,"name":"பெரிய தட்டக்கூடை","unit":"nos"},{"id":205,"name":"சீமாறு (ஈக்கமாறு)","unit":"nos"},{"id":206,"name":"அடுப்புக்கறி (தந்தூரி கறி) (டின்)","unit":"nos"},{"id":207,"name":"பிளாஷ்டிக்குடம்","unit":"nos"},{"id":208,"name":"பழைய பிளக்ஸ்","unit":"nos"},{"id":209,"name":"தலை வாழை இலை","unit":"nos"},{"id":210,"name":"சாப்பாட்டு இலை","unit":"nos"},{"id":211,"name":"ரவுண்டு இலை ( 12 இஞ்சு)","unit":"nos"},{"id":212,"name":"1 யூஸ் ஹாப் டீப் சுவீட்ட்ரே","unit":"nos"},{"id":213,"name":"கேரி பேக் (5 கிலோ அளவு)","unit":"nos"},{"id":214,"name":"முடுச்சு கவர் (10 கிலோ அளவு )","unit":"nos"},{"id":215,"name":"6 இஞ்ச் பேப்பர் பிளேட்","unit":"nos"},{"id":216,"name":"12 இஞ்ச் பாக்கு மட்டை","unit":"nos"},{"id":217,"name":"பட்டர் பேப்பர் (பீஸ்)","unit":"nos"},{"id":218,"name":"அலுமினி பாயில்பேபப்ர்","unit":"nos"},{"id":219,"name":"டஸ்ட்பின் கவர் ( 100கிலோ)","unit":"pocket"},{"id":220,"name":"டிஸ்யூ பேப்பர்","unit":"pocket"},{"id":221,"name":"கை கிளவுஸ்","unit":"pocket"},{"id":222,"name":"சர்வர் கேப்","unit":"pocket"},{"id":223,"name":"குளோப் ஜாமுன் கப் +ஸ்பூன்","unit":"nos"},{"id":224,"name":"சில்லர் கோட்டிங் ஸ்பூன்","unit":"nos"},{"id":225,"name":"சூப் கப் + ஸ்பூன்","unit":"nos"},{"id":226,"name":"அட்டை காபி கப் (110 மிலி )","unit":"nos"},{"id":227,"name":"அட்டை குடிநீர் கப் (210 மிலி)","unit":"nos"},{"id":228,"name":"50 நபர் பேப்பர் ரோல்","unit":"nos"},{"id":229,"name":"டீ வடி ஜல்லடை","unit":"nos"},{"id":230,"name":"பிளாஸ்டிக் ஐல்லடை","unit":"nos"},{"id":231,"name":"நியூஸ் பேப்பர்","unit":"gram"},{"id":232,"name":"பனியன் வேஸ்ட்","unit":"gram"},{"id":233,"name":"காடா துணி(லேஸ்)","unit":"meter"},{"id":234,"name":"வெள்ளைதுண்டு","unit":"nos"},{"id":235,"name":"கொசுவர்தி சுருள்","unit":"nos"},{"id":236,"name":"தீப்பெட்டி","unit":"nos"},{"id":237,"name":"சோப்பு பவுடர்","unit":"gram"},{"id":238,"name":"கிளீனிங் பவுடர்","unit":"gram"}]};	
};

IngredientTab.prototype.renderIngredients = function(ingCat) {
	var _this = this;

	$(".cls_ingredientsList").html('');

	if(ingCat!="All")
	{
		$(".cls_ingredientsList").append(_this.renderIngredientsByCategory(ingCat, _this.ingredientJson[ingCat]));
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
			catagoryJson = _this.ingredientJson[categoryName];
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
	if(searchResIngredients){
		renderHtml += "<div class='list-group col-11'>"
						+ "<a class='list-group-item list-group-item-action cls_ingredientCateory active text-center h5 text-white font-weight-bold'>"
							+ "Search Results";

				if(searchResIngredients.length>0)
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
	}
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
		})
		
		$(".cls_deleteIngredient").click(function() {
	       var idx = $(this).attr("idx");
	       var name = $(this).attr("name");
	       var isDelete = confirm("You wish to delete the ingredient "+name+" ?");
	       if (isDelete == true) {
	         $(".ingredient_"+idx).remove();
	       }
	    });

	    $("#id_selectIngredientCategory").change(function() {
	    	_this.renderIngredients($("#id_selectIngredientCategory").val());
	    	$("#id_searchIngredientCategory").val("");
		});

		$("#id_searchIngredientCategory").keyup(function() {
	    	var searchKeyword = $(this).val().trim();
	    	if(searchKeyword.length>0)
	    	{
		    	$(".cls_ingredientsList").html('');
		    	var results = getIngredientsByName(_this.ingredientJson, searchKeyword);
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
			    var reqKey = selCat+"."+getIndexForId(_this.ingredientJson, selCat, $("#ingredientModal").data("idToEdit"));
			    if(reqKey != -1)
			    {
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
	    		var ingJson = {};
	    		ingJson[selCat] =
	    		{
		    		"id": getNextId(_this.ingredientJson),
			        "name": $("#id_tamilName").val(),
			        "unit": $("#id_ingredientUnit").val()
			    };
		        $.ajax({
		        	url: "/createIngredient",
	            	type: "post",
	            	contentType: 'application/json',
	            	data: JSON.stringify(ingJson),
		        	success: function(result){
		        		if(result.nModified && result.nModified>0)
		        		{
							$("#successPopup").find('.modal-title').text("Ingredient Created Successfully");
		        			$("#successPopup").modal('show');
							//$('#ingredientModal .close').click();
			        	}
		        		else
		        		{
			        		$("#errorPopup").find('.modal-title').text('Failed to Create New Ingredient. Please Try again later.');
		        			$("#errorPopup").modal('show');
			        	}
		        		$('#ingredientModal .close').click();
					},
					error: function(){
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

	    $(".cls_successPopupClose").click(function() {
			location.reload();
	    });

		$(document).on('click', '.cls_editIngredient', function(){
			var idx = $(this).attr("idx");
			var curIngredientObj = getIngredientById(_this.ingredientJson, idx);
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
		});

		$(document).on('click', '.cls_deleteIngredient', function(){
			var idx = $(this).attr("idx");
	        var curIngredientObj = getIngredientById(_this.ingredientJson, idx);
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
	
		$(".cls_confirmPopupDelete").click(function() {

			if($("#confirmationPopup").data("module") == "Ingredient")
			{
				var ingJson = {};
 				var reqKey = $("#confirmationPopup").data("catForId");
			    if(reqKey != -1)
			    {
				    ingJson[reqKey] =
		    		{
			    		"id": $("#confirmationPopup").data("idToDelete")
				    };
			        $.ajax({
			        	url: "/deleteIngredient",
		            	type: "post",
		            	contentType: 'application/json',
		            	data: JSON.stringify(ingJson),
			        	success: function(result){
			        		if(result.nModified && result.nModified>0)
			        		{
								$("#successPopup").find('.modal-title').text("Ingredient Deleted Successfully");
				        		$("#successPopup").modal('show');
			        		}
			        		else
			        		{
			        			$("#errorPopup").find('.modal-title').text('Failed to delete Ingredient at the moment. Please Try again later.');
			        			$("#errorPopup").modal('show');
			        		}
			        		$("#confirmationPopup").modal('hide');
						},
						error: function(){
						    $("#errorPopup").find('.modal-title').text('Failed to delete Ingredient. Please Try again later.');
			        		$("#errorPopup").modal('show');
			        		$("#confirmationPopup").modal('hide');
						}
					});
			    }
			    else
			    {
			    	$("#errorPopup").find('.modal-title').text('Failed to delete Ingredient. Please Try again later.');
			        $("#errorPopup").modal('show');
			        $("#confirmationPopup").modal('hide');
			    }
			}
	    });

	});
}

IngredientTab.prototype.updateIngredientData = function(ingredientObj) {
	//File operation to save the ingredient in appropreate ingredient category
}

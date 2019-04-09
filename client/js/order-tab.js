function OrderTab(){
	this.init();
	var isNewOrder = false;
	var isListServiceForms = false;
	var dummyRecipies = null;
	var ordersList = {};
	var currentOrder = null;
	var isOrdersTabLoaded = false;
	var isGeneratePLWithSave = false;
}
OrderTab.prototype.init = function(){
	var _this = this;
	_this.isNewOrder = getValueFromQueryParam('orderIsNew');
	_this.orderId = getValueFromQueryParam('orderId');
	_this.serviceId= getValueFromQueryParam('serviceId');
	_this.isListServiceForms = getValueFromQueryParam('listServiceForms') ? "true" : "false";
	_this.isCreateServiceForm = getValueFromQueryParam('createServiceForm') ? "true" : "false";
	_this.isPurchaseList = getValueFromQueryParam('purchaseList') ? "true" : "false";
	_this.purchaseListCategory = getValueFromQueryParam('purchaseListCategory');
	_this.waitForDataLoad();
	_this.idIncrementer = 1;
};
OrderTab.prototype.waitForDataLoad = function(){
	var _this = this;
	if(!$.isEmptyObject(ingredientJson) && !$.isEmptyObject(recipeJson) && !_this.isOrdersTabLoaded){
		_this.isOrdersTabLoaded = true;
		_this.render();
		_this.renderEvents();
	}
	else{
		setTimeout(function(){
            _this.waitForDataLoad();
        }, 100);
	}
};	
OrderTab.prototype.render = function(){
	var _this = this;
	var renderHtml = [];

	if(_this.orderId && _this.orderId.length > 0 && _this.isPurchaseList == 'true' && _this.purchaseListCategory && _this.purchaseListCategory.length > 0) {		
		var cbk = function(){
			new renderPL(_this.currentOrder[0]);
		}
		_this.currentOrder = (_this.ordersList && _this.ordersList[_this.orderId]) ? _this.ordersList[_this.orderId] : _this.getOrderByIdFromDB(_this.orderId,cbk);
	}
	else if(_this.orderId && _this.orderId.length > 0 && _this.isListServiceForms == 'true') {
		_this.renderServiceForms();
	}
	else if(_this.isCreateServiceForm && _this.isCreateServiceForm == "true") {
		$(".cls_orderDataCont").append(_this.renderServiceFormCreateOrUpdate());
		$("#id_createOrder").addClass("d-none");
		//$(".backFromServiceFormEdit").removeClass("d-none");
		$('.cls_orderPageTitle').removeClass('d-none');
		$('.cls_orderPageTitle').text("Create Event");
	}
	else if(_this.isNewOrder == 'true'){
		$(".cls_orderMetadataCont, .cls_orderBtnsCont").removeClass("d-none");
		$(".cls_orderMetadataCont, .cls_createEventRow").removeClass("d-none");
		$(".backFromServiceList").removeClass("d-none");
		$(".cls_orderDataCont").append(_this.renderServiceFormCreateOrUpdate(null, true));
		$("#id_createOrder").addClass("d-none");
		//$(".backFromServiceFormEdit").removeClass("d-none");
		$('.cls_orderPageTitle').removeClass('d-none');
		$('.cls_orderPageTitle').text("Create Event");
	}
	else if(_this.orderId && _this.serviceId && _this.serviceId.length > 0){
		showLoading();
		var cbk = function(){
			if(_this.currentOrder && _this.currentOrder.length > 0){
				var serviceForms = _this.currentOrder[0] && _this.currentOrder[0].serviceForms;
				var serviceObj = null;
				for(var i=0; i<serviceForms.length; i++){
					if(_this.serviceId == serviceForms[i].serviceId){
						serviceObj = serviceForms[i];
					}
				}
				$(".cls_orderDataCont").append(_this.renderServiceFormCreateOrUpdate(serviceObj));
				if(serviceObj && serviceObj.sessionNotes) {
					$("#sessionNotes").val(serviceObj.sessionNotes);
				}
			}
	    }
	    _this.getOrderByIdFromDB(_this.orderId, cbk);
	    $("#id_createOrder").addClass("d-none");
	    //$(".backFromServiceFormEdit").removeClass("d-none");
	    $('.purchaseListForEvent').removeClass('d-none');
	    $('.cls_orderPageTitle').removeClass('d-none');
	    $('.cls_orderPageTitle').text("Edit Event");
	}
	else if(_this.orderId && _this.orderId.length > 0){
		showLoading();
		var cbk = function(){
			if(_this.currentOrder && _this.currentOrder.length > 0){
				var currentOrder = _this.currentOrder[0];
				$("#id_orderContent_tab").append(_this.renderCreateOrUpdateOrder(currentOrder));
				//Unable to retrieve text area values in UI, Need to fix this
				$("#clientAddress").val(currentOrder.clientAddress);
				$("#clientNotes").val(currentOrder.clientNotes);
				$(".backFromCreateOrder").removeClass("d-none");
				$('.cls_orderPageTitle').removeClass('d-none');
				$('.cls_orderPageTitle').text("Edit Order");
			}
	    }
	    _this.getOrderByIdFromDB(_this.orderId, cbk);
	}
	else{
		_this.getOrderListFromDB();
		$('.cls_orderPageTitle').text("Orders List");
	}
	hideLoading();
};
OrderTab.prototype.getOrderListFromDB = function(){
	var _this = this;
	$.ajax({
    	url: "/getOrders",
    	type: "get",
    	success: function(result){
    		hideLoading();
    		result = result.reverse();
    		_this.setOrderbyId(result);
    		$("#id_orderContent_tab").append(_this.renderOrderList(result));
    		ordersJsonMain = result;
		},
		error: function(){
			hideLoading();
		    alert('Failed to fetch Receipes.. Please Try again later..');
		}
	});
}
OrderTab.prototype.renderOrderList = function(ordersJsonArr){
	var renderHtml = [];

	$("#id_createOrder").attr('hidden', false);

	if(ordersJsonArr && ordersJsonArr.length > 0){
		for(var i=0; i< ordersJsonArr.length; i++){
			if(i%2 == 0){
				renderHtml += "<div class='row'>"
			}
			var curOrderObj = ordersJsonArr[i];
			renderHtml += "<div class='card border-secondary mb-3 col-5 mx-4 cls_orderDetails' style='cursor:pointer' idx='"+curOrderObj.orderId+"'>"
								+ "<h6 class='card-header text-success bg-transparent border-secondary text-center'>"+ curOrderObj.eventVenue +"</h6>"
								+ "<div class='card-body text-secondary font-weight-bold'>"
							 		+ "<div class='row'>"
							   			+ "<div class='card-title cls_eventName col-6'>" + curOrderObj.eventName +"</div>"
							    		+ "<div class='card-text cls_eventDate col-6 text-right'>"+ toDate(curOrderObj.eventDate).toShortFormat() +"</div>"
							    	+ "</div>"
							 	   	+ "<div class='row'>"
							    		+ "<div class='card-title cls_eventNotes col-6'>"+ curOrderObj.clientNotes.substring(0,50) +"</div>"
							    		+ "<div class='card-text cls_contactNumber col-6 text-right'>"+ curOrderObj.clientPhone +"</div>"
							    	+ "</div>"
							  	+ "</div>"
							  	+ "<div class='card-footer text-center bg-light border-secondary row p-0'>"
							  		+ "<label class='col-6 border-right border-secondary m-0 p-2 cls_editOrder' style='cursor:pointer'>Edit</label>"
							  		+ "<label class='col-6 m-0 p-2 cls_deleteOrder'  data-idx="+curOrderObj.orderId+" data-name='"+curOrderObj.eventName+"' style='cursor:pointer'>Delete</label>"
							  	+ "</div>"
							+ "</div>";
			if(i%2 != 0){
				renderHtml += "</div>"
			}
		}
	}
	else{
		renderHtml += '<div class="cls_noDataFound text-center">'
						+ '<h5> No Orders Found</h5>'
					+ '</div>'
	}
	return renderHtml;
};
OrderTab.prototype.renderCreateOrUpdateOrder = function(orderObj){
	var renderHtml = [];
	$("#id_createOrder").attr('hidden', true);
	var isUpdate = (orderObj && !$.isEmptyObject(orderObj)) ? true : false;
		//getFileValue();
	renderHtml += '<form>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="clientName">Name</label>'
		+ '    			<input type="text" class="form-control" id="clientName" placeholder="Enter Name" value="'+ (isUpdate ? orderObj.clientName : "")+'">'
		+ '  		</div>'
		+ '         <div class="col">'
		+ '    			<label for="clientPhone">Phone Number</label>'
		+ '    			<input type="text" class="form-control" id="clientPhone" placeholder="Enter Phone Number" value="'+ (isUpdate ? orderObj.clientPhone : "")+'">'
		+ '  		</div>'
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="clientAddress">Address</label>'
		+ '    			<textarea class="form-control" id="clientAddress" rows="3" placeholder="Enter Address" value="'+ (isUpdate ? orderObj.clientAddress : "")+'"></textarea>'
		+ '  		</div>'
		+ '         <div class="col">'
		+ '    			<label for="eventName">Function Name</label>'
		+ '    			<input type="text" class="form-control" id="eventName" placeholder="Enter Function Name" value="'+ (isUpdate ? orderObj.eventName : "")+'">'
		+ '  		</div>'
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="eventDate">Function Date</label>'
		+ '    			<input type="text" class="form-control" id="eventDate" placeholder="Enter Function Date" value="'+ (isUpdate ? orderObj.eventDate : "")+'">'
		+ '  		</div>'
		+'          <div class="col">'
		+ '    			<label for="eventVenue">Function Venue</label>'
		+ '    			<input type="text" class="form-control" id="eventVenue" placeholder="Enter Function Venue" value="'+ (isUpdate ? orderObj.eventVenue : "")+'">'
		+ '  		</div>'
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="clientNotes">Notes</label>'
		+ '    			<textarea class="form-control" id="clientNotes" rows="3" placeholder="Enter Any Additional Notes" value="'+ (isUpdate ? orderObj.clientNotes : "")+'"></textarea>'
		+ '  		</div>'
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="row mt-4">'
		+ '  	<div class="col"></div>'
		+ '  	<div class="col text-right">'
		+ '     	<button type="button" id="id_listServiceForms" class="btn btn-primary" isupdate="'+isUpdate+'" orderid="'+ (isUpdate ? orderObj.orderId : "")+'">Save and Proceed To Events</button>'
		+ '       	<button type="button" id="id_listServiceFormsCancel" class="btn btn-secondary ml-3">Cancel</button>'
		+ '  	</div>'		
		+ '  </div>'
		+ '</div>'
		+ '</form>';

		return renderHtml;
};
OrderTab.prototype.setOrderbyId = function(orders) {
	var _this = this;
	_this.ordersList = {};
	if(orders){
		for(var i=0; i<orders.length; i++){
			_this.ordersList[orders[i].orderId] = orders[i];
		};
	}
};
OrderTab.prototype.getOrderByIdFromDB = function(orderId, cbk){
	var _this = this;
	$.ajax({
    	url: "/getOrderById?orderId=" + orderId,
    	type: "get",
    	success: function(result){
    		hideLoading();
    		_this.currentOrder = result;
    		cbk && cbk();
		},
		error: function(res){
			hideLoading();
		    alert('Failed to fetch Order.. Please Try again later..');
		}
	});
}
OrderTab.prototype.renderServiceForms = function(){
	var _this = this;
	$('.cls_orderPageTitle').addClass('d-none');
	$("#id_createOrder").attr('hidden', true);

	var orderId = getValueFromQueryParam("orderId");
	_this.currentOrder = _this.ordersList && _this.ordersList[orderId];

	var cbk = function(){
		if(_this.currentOrder && !$.isEmptyObject(_this.currentOrder)) {
			$(".cls_orderMetadataCont, .cls_orderBtnsCont").removeClass("d-none");
			$(".cls_orderMetadataCont, .cls_createEventRow").removeClass("d-none");
		    $(".cls_curOrderName").val(_this.currentOrder[0].eventName);
		    $(".cls_curOrderVenue").val(_this.currentOrder[0].eventVenue);
		    $("#id_orderDate").val(_this.currentOrder[0].eventDate);
		    $('#id_orderDate').data("DateTimePicker").date(toDate(_this.currentOrder[0].eventDate));
		    $(".cls_curOrderMobileNumber").val(_this.currentOrder[0].clientPhone);
		    $(".cls_curOrderNotes").val(_this.currentOrder[0].clientNotes);
		}

		$(".cls_orderDataCont").append(_this.renderServiceFormList());
		registerDatepickerEvent();
		$(".backFromServiceList").removeClass("d-none");
		$(".cls_serviceListTitle").removeClass("d-none");
		_this.minimiseEmptyRecipeCategories();
	}
	if(!_this.currentOrder){
		_this.getOrderByIdFromDB(orderId, cbk);
	}
	else{
		cbk();
	}
};
OrderTab.prototype.renderServiceFormList = function(){
	var _this = this;
	var renderHtml = [];

	var serviceJson = _this.currentOrder && _this.currentOrder[0] && _this.currentOrder[0].serviceForms;
	renderHtml += '<div class="cls_orderServiceList">'
					+ '<div class="row pb-4" id="id_createEventContainer">'
						+ '<h4 class="col-12 cls_serviceListTitle text-secondary d-none">Events List</h4>'
				   	+ '</div>'
	if(serviceJson && serviceJson.length > 0){
		for(var i=0; i< serviceJson.length; i++){
			var isLast = (i == serviceJson.length -1) ? true : false;
			renderHtml += _this.renderServiceFormCreateOrUpdate(serviceJson[i], isLast)
		}

	}
	renderHtml += '<div class="cls_noDataFound text-center ' + ((serviceJson && serviceJson.length > 0) ? "d-none" : "") +  '">'
					+ '<h5> No Events Found</h5>'
				+ '</div>'
	
	renderHtml += '</div>'

	return renderHtml;
}

OrderTab.prototype.renderServiceFormCreateOrUpdate = function(serviceObj, isLast){
	var _this = this;
	var renderHtml = [];
	if($(".serviceFormDetails_last") && $(".serviceFormDetails_last").length > 0) {
		$(".serviceFormDetails").removeClass("serviceFormDetails_last");
	}

	renderHtml += '<form class="serviceFormDetails">'
		renderHtml += _this.addMoreEvent(serviceObj, isLast);
		//TODO : Add / Remove DOM rows plugin
		if(_this.isCreateServiceForm == "true") {
			renderHtml += + '  <div class="col text-right mt-2">'
			+ '      <button type="button" id="id_createServiceForm" class="btn btn-primary">Save</button>'
			+ '      <button type="button" id="id_createServiceFormCancel" class="btn btn-secondary ml-3">Cancel</button>'
			+ '  </div>'
		}
		+ '</form>';

		return renderHtml;
}
OrderTab.prototype.addMoreEvent = function(serviceObj, isLast) {
	var _this = this;
	var renderHtml = [];
	var isUpdate = (serviceObj && !$.isEmptyObject(serviceObj)) ? true : false;
	renderHtml += ' <div class="cls_orderEvent border border-success p-2 mb-3 pl-4 '+(isLast ? "cls_orderEvent_last" : "")+'"> '
		+ ' <div class="form-group">'
		+ '     <div class="row">'
		+ ' 		<div class="col text-right mt-2">'
		+ '         	<a id="id_deleteEvent" class="btn btn-danger btn-md mr-3 text-white">'
		+ '					<i class="fa fa-remove" aria-hidden="true"></i> Delete'
		+ '				</a>'
		+ ' 		</div>'
		+ ' 	</div>'
		+ '  	<div class="row mb-5">'
		+ '  		<div class="col-4">'
		+ '    			<label for="serviceFormName">Event Session</label>'
		+ '    			<select class="form-control" id="id_session">'
		+ '                 <option value="" '+ ( !isUpdate  ? "selected" : "")+ '> Select </option>'
		+ '                 <option value="Morning" '+ ((isUpdate && serviceObj.session == "Morning")  ? "selected" : "")+ '> Morning </option>'
		+ '                 <option value="Afternoon" '+ ((isUpdate && serviceObj.session == "Afternoon")  ? "selected" : "")+ '> Afternoon </option>'
		+ '                 <option value="Evening" '+ ((isUpdate && serviceObj.session == "Evening")  ? "selected" : "")+ '> Evening </option>'
		+ '                 <option value="Night" '+ ((isUpdate && serviceObj.session == "Night")  ? "selected" : "")+ '> Night </option>'
		+ '             </select>'
		+ '  		</div>'
		+ '         <div class="col-2">'
		+ '         </div>'
		+ '  		<div class="col-4">'
		+ '    			<label for="serviceFormDateTime">Event Date</label>'
		/*+ '    			<input type="text" class="form-control" id="sessionDateTime" value="'+ (isUpdate ? serviceObj.sessionDateTime : "")+'" placeholder="Enter Session Date and Time">'*/
		+ '					<div class="container">'
		+ '        				<div class="row">'
		+ '            				<div class="input-group date" id="datetimepicker1">'
		+ '    							<input type="text" class="form-control cls_sessionDateTime" readOnly id="sessionDateTime" value="'+ (isUpdate ? serviceObj.sessionDateTime : "")+'" placeholder="Enter Event Date">'
		+ '                 			<i class="fa cls_calenderIcon">&#xf073;</i>'
	    + '        					</div>'
		+ '                		</div>'
	    + ' 				</div>'
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="cls_categoriesInEventContainer">'
		if(isUpdate) {
			renderHtml += _this.renderSessionTemplate(serviceObj, serviceObj.session);
		}
	    renderHtml += '</div>'
		//+ '  <h5><u>Add Receipes to Event</u></h5>'		
		+ '</div>'
	return renderHtml;
}
OrderTab.prototype.renderSessionTemplate = function(serviceObj, session) {
	var _this = this;
	var renderHtml = [];
	var sessioncategories = getCategoriesBySession(session);

	if(sessioncategories && sessioncategories.length>0)
	{
		if(serviceObj && serviceObj.recipes && serviceObj.recipes.length > 0){
			serviceObj.recipes = _this.setRecipeCategory(serviceObj.recipes);
		}
		for(var i=0; i<sessioncategories.length;i++)
		{
			renderHtml += '<div class="cls_eventRecipeCat" id="id_eventRecipeCat_'+sessioncategories[i]+'">'
			+ '<h5 class="bg-light p-2">'
			+ '	   <span class="col-1 cls_addRecipeCat d-none">'
			+ '			<a role="button" class="btn p-0"> <i class="fa fa-plus-circle cls_addCurrentReceipeCategory text-success" aria-hidden="true" style="font-size : 20px"></i></a>'
			+ '	   </span>'
			+ '    <u class="col-2">'+sessioncategories[i]+'</u>'
			+ '    <span class="col-1 cls_removeRecipeCat">'
			+ '			<a role="button" class="btn p-0"> <i class="fa fa-minus-circle cls_removeCurrentReceipeCategory text-danger" title= "Remove" style="font-size:20px;cursor:pointer"></i></a>'
			+ '    </span>'
			+ '</h5>'
			renderHtml += _this.getReceipeMapContainer(serviceObj, sessioncategories[i]);
			renderHtml += '</div>'
			renderHtml += '<br>'
		}
	}

	return renderHtml;
}
OrderTab.prototype.setRecipeCategory = function(recipes) {
	if(recipeJson && recipes){
		for(var i=0; i<recipeJson.length > 0; i++){
			for(var j=0; j<recipes.length; j++){
				if(recipeJson[i].id == recipes[j].id){
					recipes[j].category = recipeJson[i].itemCategory;
				}
			}
		}
	}
	return recipes;
};
OrderTab.prototype.minimiseEmptyRecipeCategories = function() {
	$(".cls_removeCurrentReceipeCategory").each(function(index, element) {
		var parentElem = $(this).parents('.cls_eventRecipeCat');
		var recipeNamesInCat = parentElem.find('.cls_receipeName_sf');
		if(recipeNamesInCat && recipeNamesInCat.length==1)
		{
			var recipeVal = $(recipeNamesInCat[0]).val();
			if(recipeVal.length == 0)
			{
				$(this).click();
			}
		}
	});	
};
OrderTab.prototype.getReceipeMapContainer = function(serviceObj, categoryToRender) {
	var _this = this;
	var renderHtml = [];
	renderHtml += '  <div class="form-group receipeMapContainer mb-4">'
		+ '  	<div class="serviceFormReceipeMap mt-4">'
		+ '    		<div class="row">'
		+ '      		<div class="col-1">'
		+ '      		</div>'
		+ '      		<div class="col-4 text-center">'
		+ '			        <label class="font-weight-bold">Name</label>'
		+ '      		</div>'		
		+ '      		<div class="col-2 text-center">'
		+ '        			<label class="font-weight-bold">No. Of People</label>'
		+ '      		</div>'
		+ '      		<div class="col-1">'
		+ '      		</div>'
		+ '    		</div>'
		var isRecipeAddedForCategory = false;
		if(serviceObj && serviceObj.recipes && serviceObj.recipes.length>0){
			for(var i=0; i<serviceObj.recipes.length; i++){
				if(serviceObj.recipes[i].category == categoryToRender){
					isRecipeAddedForCategory = true;
					renderHtml += _this.getReceipeMapRowForSF(serviceObj.recipes[i], i);
				}
			}
		}
		if(!isRecipeAddedForCategory){
			renderHtml += _this.getReceipeMapRowForSF("", 0, categoryToRender);
		}
		renderHtml += '		 </div>'			
		+ '      <div class="row mt-1">'
		+ '      	<div class="col-8">'
		+ '       	</div>'
		+ '      	<div class="col mt-3">'
		+ '        		<a class="btn btn-success btn-md mr-3 text-white cls_addReceipe_sf" data-category="'+categoryToRender+'">'
		+ '					<i class="fa fa-plus-circle" aria-hidden="true"></i> Add'
		+ '				</a>'
		+ '      	</div>'
		+ '      </div>'
		+ '  </div>'
	return renderHtml;
}
OrderTab.prototype.getReceipeMapRowForSF = function(recipeObjInServiceForm, initialRowNum, categoryToRender) {
	var _this = this;
	var renderHtmlMapRow = [];
	_this.idIncrementer += 1;

	if(recipeObjInServiceForm && !$.isEmptyObject(recipeObjInServiceForm))
	{
		var recipeObj = getRecipeObjById(recipeJson, recipeObjInServiceForm.id);
		var isUpdate = (recipeObj && !$.isEmptyObject(recipeObj)) ? true : false;
		var recipeInSameCategory = getRecipeByCategory(recipeJson, recipeObj.itemCategory);
		
		renderHtmlMapRow += '<div class="row recipeMapRowSf '+ (initialRowNum>0 ? 'mt-5"' : 'mt-4"') +'>'
				+ '      <div class="col-1">'
				/*+ '        <select class="form-control cls_receipeCategory_sf" name="receipeCategory">'
							for(var i=0; i<recipeCategory.length; i++){
								renderHtmlMapRow += '<option '+ ((isUpdate && recipeObj.itemCategory && recipeCategory[i] && recipeObj.itemCategory.toLowerCase() == recipeCategory[i].toLowerCase())? "selected" : "")+'>' + recipeCategory[i] +'</option>'
							}
				renderHtmlMapRow += '</select>'*/
				+ '</div>'
				+ '      <div class="col-4">'
				/*+ '        <select class="form-control cls_receipeName_sf" name="receipeName">'
							for(var i=0; i<recipeInSameCategory.length; i++){
								renderHtmlMapRow += '<option '+ ((isUpdate && recipeObj.name && recipeInSameCategory[i].name && recipeObj.name.toLowerCase() == recipeInSameCategory[i].name.toLowerCase())? "selected" : "")+'>' + recipeInSameCategory[i].name +'</option>'
							}
				renderHtmlMapRow += '</select>'*/
				+ '	<input class="form-control cls_receipeName_sf" name="receipeName" list="id_receipeName_sf_s'+_this.idIncrementer+'" value="' + recipeObj.name + '">'
				+ '			<datalist id="id_receipeName_sf_s'+_this.idIncrementer+'">'
					for(var i=0; i<recipeInSameCategory.length; i++){
						renderHtmlMapRow += '<option value="'+ recipeInSameCategory[i].name +'"></option>'
					}
				renderHtmlMapRow += '</datalist>'
				+ '</div>'
				+ '      <div class="col-2">'
				+ '        <input type="number" min="0" class="form-control cls_receipeCount_sf" required id="id_receipeCount_sf" value="'+ (isUpdate ? recipeObjInServiceForm.count : "")+'" placeholder="Enter Head Count" name="receipeCount">'
				+ '      </div>'
				+ '      <div class="col-1">'
				+ (initialRowNum>0 ? '<a role="button" class="btn p-0"> <i class="fa fa-minus-circle mt-2 cls_removeCurrentReceipeMap text-danger" title= "Remove" style="font-size:25px;cursor:pointer"></i></a>' : '')
				+ '      </div>'
				+ '    </div>';
	}
	else
	{
		_this.idIncrementer += 1;
		var recipeInSameCategory = getRecipeByCategory(recipeJson, categoryToRender);
		renderHtmlMapRow += '<div class="row recipeMapRowSf '+ (initialRowNum>0 ? 'mt-5"' : 'mt-4"') +'>'
				+ '      <div class="col-1">'
				+ '      </div>'
				+ '      <div class="col-4">'
				/*+ '        	<select class="form-control cls_receipeName_sf" name="receipeName">'
				if(recipeInSameCategory && recipeInSameCategory.length>0)
				{
					for(var i=0; i<recipeInSameCategory.length; i++)
					{
						renderHtmlMapRow += '<option>' + recipeInSameCategory[i].name +'</option>'
					}
				}
				renderHtmlMapRow += '			</select>'*/
				+ '	<input class="form-control cls_receipeName_sf" name="receipeName" list="id_receipeName_sf_s'+_this.idIncrementer+'">'
				+ '			<datalist id="id_receipeName_sf_s'+_this.idIncrementer+'">'
				if(recipeInSameCategory && recipeInSameCategory.length>0)
				{
					for(var i=0; i<recipeInSameCategory.length; i++)
					{
						renderHtmlMapRow += '<option value="'+recipeInSameCategory[i].name+'"></option>' 
					}
				}
				renderHtmlMapRow += '</datalist>'
				//
				+ '		</div>'
				+ '      <div class="col-2">'
				+ '        <input type="number" min="0" class="form-control cls_receipeCount_sf" required id="id_receipeCount_sf" value="" placeholder="Enter Head Count" name="receipeCount">'
				+ '      </div>'
				+ '      <div class="col-1">'
				+ (initialRowNum>0 ? '<a role="button" class="btn p-0"> <i class="fa fa-minus-circle mt-2 cls_removeCurrentReceipeMap text-danger" title= "Remove" style="font-size:25px;cursor:pointer"></i></a>' : '')
				+ '      </div>'
				+ '    </div>';
	}
			
	return renderHtmlMapRow;
};
OrderTab.prototype.generatePLFromOrder = function() {
	var _this = this;

	var $errorPopup = $("#errorPopup");
	var $errModalTitle = $errorPopup.find('.modal-title');
	
	if(_this.currentOrder && _this.currentOrder[0] && _this.currentOrder[0].serviceForms)
	{
		//new renderPL(_this.currentOrder[0]);
		var plWindow = window.open(window.location.origin + "?orderId=" + _this.orderId + "&purchaseList=true&purchaseListCategory=Maligai");
		setTimeout(function(){
            var plWindow2 = window.open(window.location.origin + "?orderId=" + _this.orderId + "&purchaseList=true&purchaseListCategory=KaaiKanigal");
        }, 100);
        setTimeout(function(){
            var plWindow3= window.open(window.location.origin + "?orderId=" + _this.orderId + "&purchaseList=true&purchaseListCategory=Extras");
        }, 200);
        setTimeout(function(){
            var plWindow4 = window.open(window.location.origin + "?orderId=" + _this.orderId + "&purchaseList=true&purchaseListCategory=Suppliments");
        }, 300);
	}
	else if(_this.currentOrder && _this.currentOrder[0])
	{
		$errModalTitle.text('No Events added for this Order');
		$errorPopup.modal('show');
	}
	else
	{
		$errModalTitle.text('Could not find the specified Order to Generate purchase list');
		$errorPopup.modal('show');
	}
};
OrderTab.prototype.renderEvents = function() {
	var _this = this;
	
	$(document).ready(function(){
		$(document).on("click", ".cls_editOrder", function(){
			var orderId = $(this).parents(".cls_orderDetails").attr("idx");
			(orderId)? addQueryParamToUrlAndReload('orderId', orderId) : "";
		});

		$(document).on("click", ".cls_serviceDetails", function(){
			var serviceId = $(this).attr("idx");
			var url = window.location.href;
			url = removeQueryParamFromUrl(url, "listServiceForms");
			addQueryParamToUrlAndReload('serviceId', serviceId, url);
		});

		$(document).on("click", "#id_createOrder", function(){
			addQueryParamToUrlAndReload('orderIsNew', 'true');
        });

        $(document).on("click", "#id_order-tab", function(){
			var ifTabbed = getValueFromQueryParam('tab');
			if(ifTabbed && ifTabbed.length>0)
			{
				var url = window.location.href;
				url = removeQueryParamFromUrl(url, "tab");
				window.location.href = url;
			}
        });

        //$(document).on("click", ".cls_orderDetails", function(){
		$(document).on("click", ".cls_orderDetails .card-header, .cls_orderDetails .card-body", function(){        	
        	var url = window.location.href;
        	//var orderId = $(this).attr("idx");
        	var orderId = $(this).parent('.cls_orderDetails').attr("idx");
			url = addQueryParamToUrl(url, "orderId", orderId);
        	addQueryParamToUrlAndReload('listServiceForms', "true", url);
        });
		
		$(document).on("click", "#id_listServiceForms", function(){
			showLoading();
			var isUpdate = $(this).attr("isupdate") == "true" ? true : false;
			if(isUpdate) {
				var orderId = $(this).attr("orderid");
				_this.getOrderDataAndUpdate(orderId);
			}
			else {
				_this.getOrderDataAndCreate();
			}
		});
		
		$(document).on("click", "#id_updateOrderData", function(){
			showLoading();
			var orderId = getValueFromQueryParam("orderId");
			var isUpdate = orderId ? true : false;
			if(isUpdate) {
				_this.getOrderDataAndUpdate(orderId);
			}
			else {
				_this.getOrderDataAndCreate();
			}
		});
		
		$(document).on("click", ".cls_addReceipe_sf", function(){
			var elemToAdd = $(_this.getReceipeMapRowForSF("", $('.recipeMapRowSf').length, $(this).data("category")));
			cloneDOM(elemToAdd, $(this).parents('.receipeMapContainer').find('.serviceFormReceipeMap'));
			var $thisParentContainer = $(this).parents(".cls_orderEvent");
			var session = $thisParentContainer.find("#id_session").val();
			var categories = getCategoryBySession(session);
			addOptionsToSelectViaElem(categories, $('.cls_receipeCategory_sf')[$('.cls_receipeCategory_sf').length-1]);
		});

		$(document).on("click", ".cls_removeCurrentReceipeMap", function(){
			$(this).parents('.recipeMapRowSf').remove();
		});

		$(document).on("click", ".cls_removeCurrentReceipeCategory", function(){
			var parentElem = $(this).parents('.cls_eventRecipeCat');
			parentElem.addClass('cls_dontConsider');
			//parentElem.addClass('float-right');
			parentElem.find('.receipeMapContainer').addClass('d-none');
			parentElem.find('.cls_removeRecipeCat').addClass('d-none');
			parentElem.find('.cls_addRecipeCat').removeClass('d-none');
		});

		$(document).on("click", ".cls_addCurrentReceipeCategory", function(){
			var parentElem = $(this).parents('.cls_eventRecipeCat');
			parentElem.removeClass('cls_dontConsider');
			//parentElem.removeClass('float-right');
			parentElem.find('.receipeMapContainer').removeClass('d-none');
			parentElem.find('.cls_removeRecipeCat').removeClass('d-none');
			parentElem.find('.cls_addRecipeCat').addClass('d-none');
		});

		$(document).on("click", ".purchaseListForEvent", function(){
			var plWindow = window.open("purchaselistgen.html");
		});

		$(document).on("click", ".purchaseListForOrder", function(){
			//var plWindow = window.open("purchaselistgen.html");
			_this.isGeneratePLWithSave = true;
			$("#id_updateOrderData").trigger('click');
		});

		$(document).on("click", "#id_createServiceForm", function(){
			showLoading();
			_this.getServiceFormDataAndCreateAndUpdate();
		});
		$('.cls_sessionDateTime').datetimepicker({
            //sideBySide: true,
            ignoreReadonly: true,
            //format: "DD/MM/YYYY hh:mm A"
            format: "DD/MM/YYYY"
        });	
		$('#id_orderDate').datetimepicker({
            ignoreReadonly: true,
            format: "DD/MM/YYYY"
        });

		$(document).on("click", ".cls_calenderIcon", function(){
			$(this).prev('input').data('DateTimePicker').toggle();
		});

		$(document).on("click", "#id_deleteEvent", function(){
			$(this).parents(".cls_orderEvent").remove();
			if(!($(".cls_orderEvent_last") && $(".cls_orderEvent_last").length > 0)){
				if($(".cls_orderEvent").length==0)
				{
					$(".cls_eventAction").addClass("d-none");
					$(".cls_noDataFound").removeClass("d-none");
				}
			}
		});

		$(document).on("change", ".cls_receipeCategory_sf", function(){
			var recipeCategoryChosen = $(this).val();
			var recipeNamesInCategory = getRecipeNamesByCategory(recipeJson, recipeCategoryChosen);
			$(this).closest('.recipeMapRowSf').find(".cls_receipeName_sf option").remove();
			if(recipeNamesInCategory && recipeNamesInCategory.length>0)
			{				
				addOptionsToSelectViaElem(recipeNamesInCategory, $($(this).closest('.recipeMapRowSf').find(".cls_receipeName_sf"))[0]);
			}
		});
		
		if(_this.isCreateServiceForm == "true") {
			addOptionsToSelectViaElem(recipeCategory, $('.cls_receipeCategory_sf')[0]);
		}

		$(document).on("click", "#id_createService", function(){
			/*var url = window.location.href;
			url = removeQueryParamFromUrl(url, "listServiceForms");
			url = addQueryParamToUrl(url, 'createServiceForm', "true");
			window.location.href = url;*/
			$(".cls_noDataFound").addClass("d-none");
			if($(".cls_orderEvent_last") && $(".cls_orderEvent_last").length > 0){ 
				$(".cls_orderEvent_last:last").after(_this.addMoreEvent(null, true));
			}
			else if(_this.isNewOrder == 'true')
			{
				$('.serviceFormDetails').append(_this.addMoreEvent(null, true));
			}
			else {
				$("#id_createEventContainer").after(_this.renderServiceFormCreateOrUpdate(null, true));
			}
			$(".cls_eventAction").removeClass("d-none");
			registerDatepickerEvent();
			var categories = getCategoryBySession("");
			if($('.cls_receipeCategory_sf') && $('.cls_receipeCategory_sf').length>0)
			{
				addOptionsToSelectViaElem(categories, $('.cls_receipeCategory_sf')[$('.cls_receipeCategory_sf').length-1]);
			}
		});
		$(document).on("change", "#id_session", function(){
			var session = $(this).val();
			var $thisParent = $(this).parents('.cls_orderEvent');
			//var categories = getCategoryBySession(session);
			//renderOptionsToSelectViaElem(categories, $thisParent.find('.cls_receipeCategory_sf'));

			$thisParent.find('.cls_categoriesInEventContainer').html(_this.renderSessionTemplate("", session));
		});
		$(document).on('click', '.cls_deleteOrder', function(event){
			event.stopPropagation();

			var idx = $(this).data("idx");
			var orderName = $(this).data("name");
	        if(idx !== undefined)
	        {
	    	    $("#confirmationPopup").find('.modal-title').text("Are you sure to delete this Order ("+orderName+")?");
    			$("#confirmationPopup").modal('show');
    			$("#confirmationPopup").data("idToDelete", idx);
    			$("#confirmationPopup").data("module", "Order");
	        }
		});

		$(document).on('click', '.cls_deleteService', function(event){
			event.stopPropagation();

			var idx = $(this).parents(".cls_serviceDetails").attr("idx");
			var serviceName = $(this).data("name");
	        if(idx !== undefined)
	        {
	    	    $("#confirmationPopup").find('.modal-title').text("Are you sure to delete this Event ("+ serviceName +")?");
    			$("#confirmationPopup").modal('show');
    			$("#confirmationPopup").data("idToDelete", idx);
    			$("#confirmationPopup").data("module", "Service");
	        }
		});
	
		$(".cls_confirmPopupDelete").click(function() {

			var $errorPopup = $("#errorPopup");
			var $errModalTitle = $errorPopup.find('.modal-title');
			var $confirmationPopup = $("#confirmationPopup");
			var $successPopup = $("#successPopup");

			if($confirmationPopup.data("module") == "Order"){
 				var orderJson = {};
 				orderJson["orderId"] = $confirmationPopup.data("idToDelete");
			    if(orderJson["orderId"] != undefined){
			    	showLoading();
			        $.ajax({
			        	url: "/deleteOrder",
		            	type: "delete",
		            	contentType: 'application/json',
		            	data: JSON.stringify(orderJson),
			        	success: function(result){
			        		hideLoading();
							$successPopup.find('.modal-title').text("Order deleted successfully");
			        		$successPopup.modal({backdrop: 'static', keyboard: false});
			        		$confirmationPopup.modal('hide');
			        		/*showLoading();		//not needed - success popup ok - will reload page
			        		location.reload();*/
						},
						error: function(){
							hideLoading();
						    $errModalTitle.text('Failed to delete Order. Please Try again later.');
			        		$errorPopup.modal('show');
			        		$confirmationPopup.modal('hide');
						}
					});
			    }
			    else{
			    	$errModalTitle.text('Failed to delete Order. Please Try again later.');
			        $errorPopup.modal('show');
			        $confirmationPopup.modal('hide');
			    }
			}
			else if($confirmationPopup.data("module") == "Service"){
 				var serviceId = $confirmationPopup.data("idToDelete");
 				var serviceForms = _this.currentOrder && _this.currentOrder[0] && _this.currentOrder[0].serviceForms;
 				for(var i=0; i < serviceForms.length; i++){
 					if(serviceForms[i].serviceId == serviceId){
 						serviceForms.splice(i, 1);
 					}
 				}
 				var serviceObj = {};
 				serviceObj.serviceForms = serviceForms;
 				serviceObj.orderId = _this.currentOrder[0].orderId;
			    if(serviceId){
			    	showLoading();
			       $.ajax({
			        	url: "/updateOrder",
		            	type: "post",
		            	contentType: 'application/json',
		            	data: JSON.stringify(serviceObj),
			        	success: function(result){
			        		hideLoading();
							$successPopup.find('.modal-title').text("Event deleted successfully");
			        		$successPopup.modal({backdrop: 'static', keyboard: false});
			        		$confirmationPopup.modal('hide');
			        		/*showLoading();		//not needed - success popup ok - will reload page
			        		location.reload();*/
						},
						error: function(){
							hideLoading();
						    $errModalTitle.text('Failed to delete Service. Please Try again later.');
			        		$errorPopup.modal('show');
			        		$confirmationPopup.modal('hide');
						}
					});
			    }
			    else{
			    	$errModalTitle.text('Failed to delete Service. Please Try again later.');
			        $errorPopup.modal('show');
			        $confirmationPopup.modal('hide');
			    }
			}
	    });
		
        $(document).on('click', '.backFromCreateOrder, #id_listServiceFormsCancel', function(event){
        	var url = window.location.href;
			url = removeQueryParamFromUrl(url, "orderIsNew");
			url = removeQueryParamFromUrl(url, "orderId");
			window.location.href = url;
		});
		$(document).on('click', '.backFromServiceList, #id_updateOrderDataCancel', function(event){
        	var url = window.location.href;
			url = removeQueryParamFromUrl(url, "listServiceForms");
			url = removeQueryParamFromUrl(url, "orderId");
			url = removeQueryParamFromUrl(url, "orderIsNew");
			window.location.href = url;
		});
		$(document).on('click', '.backFromServiceFormEdit, #id_createServiceFormCancel', function(event){
        	var url = window.location.href;
			url = removeQueryParamFromUrl(url, "serviceId");
			url = removeQueryParamFromUrl(url, "createServiceForm");
			url = addQueryParamToUrl(url, 'listServiceForms', 'true');
			window.location.href = url;
		});
	});
	
};
OrderTab.prototype.getOrderDataAndCreate = function(){
	var _this= this;

	var orderMetaData = {};
	orderMetaData.orderId = "orderid_"+(new Date()).getTime();
	orderMetaData.eventName = $("#id_orderName").val();
	orderMetaData.clientPhone = $("#id_orderMobileNumber").val();
	orderMetaData.eventDate = $("#id_orderDate").val();
	orderMetaData.eventVenue = $("#id_orderVenue").val();
	orderMetaData.clientNotes = $("#id_orderNotes").val();
	orderMetaData.serviceForms = _this.getEventsData();

	$.ajax({
    	url: "/createOrder",
    	type: "post",
    	contentType: 'application/json',
    	data: JSON.stringify(orderMetaData),
    	success: function(result){
    		hideLoading();
			$("#successPopup").find('.modal-title').text("Order Created Successfully");
    		$("#successPopup").modal({backdrop: 'static', keyboard: false});
    		$("#successPopup").data('toRedirect','listservice_from_ordercreate');
    		$("#successPopup").data('orderIdToAppend',orderMetaData.orderId);
    		if(_this.isGeneratePLWithSave)
    		{
    			_this.generatePLFromOrder();
    		}
		},
		error: function(){
			hideLoading();
		    $("#errorPopup").find('.modal-title').text('Failed to create Order. Please Try again later.');
    		$("#errorPopup").modal('show');
    		_this.isGeneratePLWithSave = false;
		}
	});

}
OrderTab.prototype.getEventsData = function(){
	var eventsArray = [];
	$(".cls_orderEvent").each(function(index, element) {
		var serviceForms = {};
		serviceForms.serviceId = "serviceid_"+(new Date()).getTime();
		serviceForms.session = $("#id_session",$(element)).val();
		serviceForms.sessionDateTime = $("#sessionDateTime",$(element)).val();

		var recipes = [];
		$(".recipeMapRowSf",$(element)).each(function(index, rowElement) {
			var categoryList = {};
			var recipeIdToStore;
			var recipeHeadCount;
			recipeIdToStore = getRecipeIdByName(recipeJson, $(".cls_receipeName_sf", this).val());
			recipeHeadCount = $(".cls_receipeCount_sf", this).val()
			if(recipeIdToStore && recipeIdToStore>-1 && recipeHeadCount){
				categoryList.id = recipeIdToStore;
				categoryList.count = recipeHeadCount;
				recipes.push(categoryList);
			}
		});
		serviceForms.recipes = recipes;
		eventsArray.push(serviceForms);
	});
	return eventsArray;
	
}
OrderTab.prototype.getOrderDataAndUpdate = function(orderId){
	var _this= this;
	var eventsArray = [];

	var orderMetaData = {};
	orderMetaData.orderId = orderId;
	orderMetaData.eventName = $("#id_orderName").val();
	orderMetaData.clientPhone = $("#id_orderMobileNumber").val();
	orderMetaData.eventDate = $("#id_orderDate").val();
	orderMetaData.eventVenue = $("#id_orderVenue").val();
	orderMetaData.clientNotes = $("#id_orderNotes").val();
	orderMetaData.serviceForms = _this.getEventsData();
	

	$.ajax({
    	url: "/updateOrder",
    	type: "post",
    	contentType: 'application/json',
    	data: JSON.stringify(orderMetaData),
    	success: function(result){
    		hideLoading();
			$("#successPopup").find('.modal-title').text("Order Updated Successfully");
    		$("#successPopup").modal({backdrop: 'static', keyboard: false});
    		$("#successPopup").data('toRedirect','listservice_from_orderupdate');
    		if(_this.isGeneratePLWithSave)
    		{
    			_this.generatePLFromOrder();
    		}
		},
		error: function(){
			hideLoading();
		    $("#errorPopup").find('.modal-title').text('Failed to update Order. Please Try again later.');
    		$("#errorPopup").modal('show');
    		_this.isGeneratePLWithSave = false;
		}
	});

}
OrderTab.prototype.getServiceFormDataAndCreateAndUpdate = function(){
	var _this= this;

 	var serviceId = getValueFromQueryParam("serviceId");
	var updateOrderData = {};
	updateOrderData.orderId = getValueFromQueryParam("orderId");
	updateOrderData.serviceForms = [];
	var cbk = function(){
		updateOrderData.serviceForms = (_this.currentOrder && _this.currentOrder[0] && _this.currentOrder[0].serviceForms) ? _this.currentOrder[0].serviceForms : [];
		if(serviceId && updateOrderData.serviceForms && updateOrderData.serviceForms.length >0){
			for(var i=0; i<updateOrderData.serviceForms.length; i++){
				if(serviceId == updateOrderData.serviceForms[i].serviceId)
				{
					updateOrderData.serviceForms.splice(i, 1);
					break;
				}
			}
		}
		var serviceForms = {};
		serviceForms.serviceId = "serviceid_"+(new Date()).getTime();
		serviceForms.session = $("#id_session").val();
		serviceForms.sessionDateTime = $("#sessionDateTime").val();

		var recipes = [];
		$(".recipeMapRowSf").each(function(index, element) {
			var categoryList = {};
			var recipeIdToStore;
			var recipeHeadCount;
			recipeIdToStore = getRecipeIdByName(recipeJson, $(".cls_receipeName_sf", this).val());
			recipeHeadCount = $(".cls_receipeCount_sf", this).val()
			if(recipeIdToStore && recipeIdToStore>-1 && recipeHeadCount){
				categoryList.id = recipeIdToStore;
				categoryList.count = recipeHeadCount;
				recipes.push(categoryList);
			}
		});
		serviceForms.recipes = recipes;
		updateOrderData.serviceForms.push(serviceForms);
		$.ajax({
	    	url: "/updateOrder",
	    	type: "post",
	    	contentType: 'application/json',
	    	data: JSON.stringify(updateOrderData),
	    	success: function(result){
	    		hideLoading();
				$("#successPopup").find('.modal-title').text("Event updated Successfully");
	    		$("#successPopup").modal({backdrop: 'static', keyboard: false});
	    		$("#successPopup").data('toRedirect','listservice');
				//calculatePL(recipes);
			},
			error: function(){
				hideLoading();
			    $("#errorPopup").find('.modal-title').text('Failed to update Event. Please Try again later.');
	    		$("#errorPopup").modal('show');
			}
		});
	};
	_this.getOrderByIdFromDB(updateOrderData.orderId, cbk);	

}
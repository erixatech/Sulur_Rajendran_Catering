function OrderTab(){
	this.init();
	var isNewOrder = false;
	var isListServiceForms = false;
	var dummyRecipies = null;
	var ordersList = {};
	var currentOrder = null;
	var isOrdersTabLoaded = false;
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
};
OrderTab.prototype.waitForDataLoad = function(){
	var _this = this;
	if(!$.isEmptyObject(ingredientJson) && !$.isEmptyObject(recipeJson) && !_this.isOrdersTabLoaded)
	{
		_this.isOrdersTabLoaded = true;
		_this.render();
		_this.renderEvents();
	}
	else
	{
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
		$("#id_orderContent_tab").append(_this.renderServiceFormCreateOrUpdate());
		$("#id_createOrder").addClass("d-none");
		$(".backFromServiceFormEdit").removeClass("d-none");
		$('.cls_orderPageTitle').removeClass('d-none');
		$('.cls_orderPageTitle').text("Create Event");
	}
	else if(_this.isNewOrder == 'true'){
		$("#id_orderContent_tab").append(_this.renderCreateOrUpdateOrder());
		$(".backFromCreateOrder").removeClass("d-none");
		$('.cls_orderPageTitle').removeClass('d-none');
		$('.cls_orderPageTitle').text("Create Order");
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
				$("#id_orderContent_tab").append(_this.renderServiceFormCreateOrUpdate(serviceObj));
				if(serviceObj && serviceObj.sessionNotes) {
					$("#sessionNotes").val(serviceObj.sessionNotes);
				}
			}
	    }
	    _this.getOrderByIdFromDB(_this.orderId, cbk);
	    $("#id_createOrder").addClass("d-none");
	    $(".backFromServiceFormEdit").removeClass("d-none");
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
								+ "<h6 class='card-header text-success bg-transparent border-secondary text-center cls_orderName'>"+ curOrderObj.clientName +"</h6>"
								+ "<div class='card-body text-secondary font-weight-bold'>"
							 		+ "<div class='row'>"
							   			+ "<div class='card-title cls_eventName col-6'>" + curOrderObj.eventName +"</div>"
							    		+ "<div class='card-text cls_eventDate col-6 text-right'>"+ curOrderObj.eventDate +"</div>"
							    	+ "</div>"
							 	   	+ "<div class='row'>"
							    		+ "<div class='card-title cls_eventVenue col-6'>"+ curOrderObj.eventVenue +"</div>"
							    		+ "<div class='card-text cls_contactNumber col-6 text-right'>"+ curOrderObj.clientPhone +"</div>"
							    	+ "</div>"
							    	+ "<div class='row'>"
							   			+ "<div class='card-title cls_clientAddress col'>"+ curOrderObj.clientAddress +"</div>"
							    	+ "</div>"
							  	+ "</div>"
							  	+ "<div class='card-footer text-center bg-light border-secondary row p-0'>"
							  		+ "<label class='col-6 border-right border-secondary m-0 p-2 cls_editOrder' style='cursor:pointer'>Edit</label>"
							  		+ "<label class='col-6 m-0 p-2 cls_deleteOrder'  data-idx="+curOrderObj.orderId+" data-name='"+curOrderObj.clientName+"' style='cursor:pointer'>Delete</label>"
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
		    $(".cls_curOrderName").val(_this.currentOrder[0].clientName);
		    $(".cls_curOrderVenue").val(_this.currentOrder[0].eventVenue);
		    $(".cls_curOrderDate").val(_this.currentOrder[0].eventDate);
		    $(".cls_curOrderMobileNumber").val(_this.currentOrder[0].clientPhone);
		}

		$("#id_orderContent_tab").append(_this.renderServiceFormList());
		$(".backFromServiceList").removeClass("d-none");
		$(".cls_serviceListTitle").removeClass("d-none");
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
						+ '<h4 class="col-5 cls_serviceListTitle text-secondary d-none">Events List</h4>'
						+ '<div class="text-right col-7">'
							+ '<a id="id_createService" class="btn btn-primary btn-md mr-3 text-white">'
					          + '<i class="fa fa-plus-circle" aria-hidden="true"></i> Create New Event'
					        + '</a>'
					        + '<a id="id_back" class="btn btn-primary btn-md mr-3 col-1 text-white backFromServiceList d-none">'
					          + '<i aria-hidden="true"></i> Back'
					        + '</a>'
						+ '</div>'
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
	
	renderHtml += "<div class='row cls_eventAction " + (!(serviceJson && serviceJson.length > 0) ? "d-none" : "") + "'>"
					+ '<div class="col-6">'
                    	+ '<button type="button" id="id_updateOrderEvents" class="btn btn-primary">Save</button>'
                    	+ '<button type="button" id="id_updateOrderEventsCancel" class="btn btn-secondary ml-3">Cancel</button>'
                    + '</div>'
			        + "<div class='text-right col-6'>"
				        +"<a id='id_plForOrder' class='btn btn-success btn-md text-white purchaseListForOrder mb-3'><i aria-hidden='true'></i>Save & Generate Purchase List</a>"
			        + "</div>"
		          + "</div>";
	
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
		+ '  	<div class="row">'
		+ '  		<div class="col-4">'
		+ '    			<label for="serviceFormName">Session</label>'
		+ '    			<select class="form-control" id="id_session">'
		+ '                 <option '+ ( !isUpdate  ? "selected" : "")+ '> Select </option>'
		+ '                 <option '+ ((isUpdate && serviceObj.session == "Morning")  ? "selected" : "")+ '> Morning </option>'
		+ '                 <option '+ ((isUpdate && serviceObj.session == "Afternoon")  ? "selected" : "")+ '> Afternoon </option>'
		+ '                 <option '+ ((isUpdate && serviceObj.session == "Evening")  ? "selected" : "")+ '> Evening </option>'
		+ '                 <option '+ ((isUpdate && serviceObj.session == "Night")  ? "selected" : "")+ '> Night </option>'
		+ '             </select>'
		+ '  		</div>'
		+ '         <div class="col-2">'
		+ '         </div>'
		+ '  		<div class="col-4">'
		+ '    			<label for="serviceFormDateTime">Session Date and Time</label>'
		+ '    			<input type="text" class="form-control" id="sessionDateTime" value="'+ (isUpdate ? serviceObj.sessionDateTime : "")+'" placeholder="Enter Session Date and Time">'
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <h5><u>Add Receipes to Event</u></h5>'
		+ '  <div class="form-group receipeMapContainer">'
		+ '  	<div class="serviceFormReceipeMap mt-4">'
		+ '    		<div class="row">'
		+ '      		<div class="col-3 text-center">'
		+ '			        <label class="font-weight-bold">Category</label>'
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
		if(serviceObj && serviceObj.recipes){
			for(var i=0; i<serviceObj.recipes.length; i++){
				renderHtml += _this.getReceipeMapRowForSF(serviceObj.recipes[i], i);
			}
		}
		else{
			renderHtml += _this.getReceipeMapRowForSF("", 0);
		}
		renderHtml += '		 </div>'			
		+ '      <div class="row mt-5 mb-4">'
		+ '      	<div class="col">'
		+ '       	</div>'
		+ '       	<div class="col">'
		+ '      	</div>'
		+ '       	<div class="col">'
		+ '      	</div>'		
		+ '      	<div class="col mt-3">'
		+ '        		<a class="btn btn-success btn-md mr-3 text-white cls_addReceipe_sf">'
		+ '					<i class="fa fa-plus-circle" aria-hidden="true"></i> Add'
		+ '				</a>'
		+ '      	</div>'
		+ '      </div>'
		+ '  </div>'
		+ '</div>'
	return renderHtml;
}
OrderTab.prototype.getReceipeMapRowForSF = function(recipeObjInServiceForm, initialRowNum) {
	var _this = this;
	var renderHtmlMapRow = [];

	if(recipeObjInServiceForm && !$.isEmptyObject(recipeObjInServiceForm))
	{
		var recipeObj = getRecipeObjById(recipeJson, recipeObjInServiceForm.id);
		var isUpdate = (recipeObj && !$.isEmptyObject(recipeObj)) ? true : false;
		var recipeInSameCategory = getRecipeByCategory(recipeJson, recipeObj.itemCategory);
		
		renderHtmlMapRow += '<div class="row recipeMapRowSf '+ (initialRowNum>0 ? 'mt-5"' : 'mt-4"') +'>'
				+ '      <div class="col-3">'
				+ '        <select class="form-control cls_receipeCategory_sf" name="receipeCategory">'
							for(var i=0; i<recipeCategory.length; i++){
								renderHtmlMapRow += '<option '+ ((isUpdate && recipeObj.itemCategory && recipeCategory[i] && recipeObj.itemCategory.toLowerCase() == recipeCategory[i].toLowerCase())? "selected" : "")+'>' + recipeCategory[i] +'</option>'
							}
				renderHtmlMapRow += '</select>'
				+ '</div>'
				+ '      <div class="col-4">'
				+ '        <select class="form-control cls_receipeName_sf" name="receipeName">'
							for(var i=0; i<recipeInSameCategory.length; i++){
								renderHtmlMapRow += '<option '+ ((isUpdate && recipeObj.name && recipeInSameCategory[i].name && recipeObj.name.toLowerCase() == recipeInSameCategory[i].name.toLowerCase())? "selected" : "")+'>' + recipeInSameCategory[i].name +'</option>'
							}
				renderHtmlMapRow += '</select>'
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
		renderHtmlMapRow += '<div class="row recipeMapRowSf '+ (initialRowNum>0 ? 'mt-5"' : 'mt-4"') +'>'
				+ '      <div class="col-3">'
				+ '        <select class="form-control cls_receipeCategory_sf" name="receipeCategory">'
				+ '          <option>Choose Category</option>'
				renderHtmlMapRow += '</select>'
				+ '</div>'
				+ '      <div class="col-4">'
				+ '        <select class="form-control cls_receipeName_sf" name="receipeName">'
				renderHtmlMapRow += '</select>'
				+ '</div>'
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
		
		$(document).on("click", ".cls_addReceipe_sf", function(){
			var elemToAdd = $(_this.getReceipeMapRowForSF("", $('.recipeMapRowSf').length));
			cloneDOM(elemToAdd, $('.serviceFormReceipeMap'));
			addOptionsToSelectViaElem(recipeCategory, $('.cls_receipeCategory_sf')[$('.cls_receipeCategory_sf').length-1]);
		});

		$(document).on("click", ".cls_removeCurrentReceipeMap", function(){
			$(this).parents('.recipeMapRowSf').remove();
		});

		$(document).on("click", ".purchaseListForEvent", function(){
			var plWindow = window.open("purchaselistgen.html");
		});

		$(document).on("click", ".purchaseListForOrder", function(){
			//var plWindow = window.open("purchaselistgen.html");
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
		});

		$(document).on("click", "#id_createServiceForm", function(){
			showLoading();
			_this.getServiceFormDataAndCreateAndUpdate();
		});

		$(document).on("click", "#id_deleteEvent", function(){
			$(this).parents(".cls_orderEvent").remove();
			if(!($(".cls_orderEvent_last") && $(".cls_orderEvent_last").length > 0)){
				$(".cls_eventAction").addClass("d-none");
				$(".cls_noDataFound").removeClass("d-none");
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
			else {
				$("#id_createEventContainer").after(_this.renderServiceFormCreateOrUpdate(null, true));
			}
			$(".cls_eventAction").removeClass("d-none");
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
			        		$successPopup.modal('show');
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
			        		$successPopup.modal('show');
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
		$(document).on('click', '.backFromServiceList', function(event){
        	var url = window.location.href;
			url = removeQueryParamFromUrl(url, "listServiceForms");
			url = removeQueryParamFromUrl(url, "orderId");
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
	orderMetaData.clientName = $("#clientName").val();
	orderMetaData.clientPhone = $("#clientPhone").val();
	orderMetaData.clientAddress = $("#clientAddress").val();
	orderMetaData.eventName = $("#eventName").val();
	orderMetaData.eventDate = $("#eventDate").val();
	orderMetaData.eventVenue = $("#eventVenue").val();
	orderMetaData.clientNotes = $("#clientNotes").val();

	$.ajax({
    	url: "/createOrder",
    	type: "post",
    	contentType: 'application/json',
    	data: JSON.stringify(orderMetaData),
    	success: function(result){
    		hideLoading();
			$("#successPopup").find('.modal-title').text("Order Created Successfully");
    		$("#successPopup").modal('show');
    		$("#successPopup").data('toRedirect','listservice_from_ordercreate');
    		$("#successPopup").data('orderIdToAppend',orderMetaData.orderId);
		},
		error: function(){
			hideLoading();
		    $("#errorPopup").find('.modal-title').text('Failed to create Order. Please Try again later.');
    		$("#errorPopup").modal('show');
		}
	});

}
OrderTab.prototype.getOrderDataAndUpdate = function(orderId){
	var _this= this;

	var orderMetaData = {};
	orderMetaData.orderId = orderId;
	orderMetaData.clientName = $("#clientName").val();
	orderMetaData.clientPhone = $("#clientPhone").val();
	orderMetaData.clientAddress = $("#clientAddress").val();
	orderMetaData.eventName = $("#eventName").val();
	orderMetaData.eventDate = $("#eventDate").val();
	orderMetaData.eventVenue = $("#eventVenue").val();
	orderMetaData.clientNotes = $("#clientNotes").val();

	$.ajax({
    	url: "/updateOrder",
    	type: "post",
    	contentType: 'application/json',
    	data: JSON.stringify(orderMetaData),
    	success: function(result){
    		hideLoading();
			$("#successPopup").find('.modal-title').text("Order Updated Successfully");
    		$("#successPopup").modal('show');
    		$("#successPopup").data('toRedirect','listservice_from_orderupdate');
		},
		error: function(){
			hideLoading();
		    $("#errorPopup").find('.modal-title').text('Failed to update Order. Please Try again later.');
    		$("#errorPopup").modal('show');
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
	    		$("#successPopup").modal('show');
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
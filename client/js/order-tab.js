function OrderTab(){
	this.init();
	var isNewOrder = false;
	var isListServiceForms = false;
	var dummyRecipies = null;
	var ordersList = {};
	var currentOrder = null;
}
OrderTab.prototype.init = function(){
	var _this = this;
	_this.isNewOrder = getValueFromQueryParam('orderIsNew');
	_this.orderId = getValueFromQueryParam('orderId');
	_this.isListServiceForms = getValueFromQueryParam('listServiceForms') ? "true" : "false";
	_this.dummyRecipies = ["Kesari", "Badam Alwa", "Chicken Biriyani", "Sambar"];
	_this.render();
	_this.renderEvents();
}
OrderTab.prototype.render = function(){
	var _this = this;
	var renderHtml = [];
	
	if(_this.isNewOrder == 'true' && _this.isListServiceForms == 'true'){
		_this.renderServiceForm();
	}
	else if(_this.orderId && _this.orderId.length > 0 && _this.isListServiceForms == 'true') {
		_this.renderServiceForm();
	}
	else if(_this.isNewOrder == 'true'){
		$("#id_orderContent_tab").append(_this.renderCreateOrUpdateOrder());
	}
	else if(_this.orderId && _this.orderId.length > 0){
		showLoading();
		var cbk = function(){
			console.log("Clicked Order"+ _this.currentOrder);
			if(_this.currentOrder && _this.currentOrder.length > 0){
				var currentOrder = _this.currentOrder[0];
				$("#id_orderContent_tab").append(_this.renderCreateOrUpdateOrder(currentOrder));
				//Unable to retrieve text area values in UI, Need to fix this
				$("#clientAddress").val(currentOrder.clientAddress);
				$("#clientNotes").val(currentOrder.clientNotes);
			}
	    }
	    _this.getOrderByIdFromDB(_this.orderId, cbk);
	}
	else{
		_this.getOrderListFromDB();
	}
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
						  		+ "<label class='col-6 border-right border-secondary m-0 p-2' style='cursor:pointer'>Complete</label>"
						  		+ "<label class='col-6 m-0 p-2 cls_deleteOrder'  data-idx="+curOrderObj.orderId+" data-name='"+curOrderObj.eventName+"' style='cursor:pointer'>Delete</label>"
						  	+ "</div>"
						+ "</div>";
		if(i%2 != 0){
			renderHtml += "</div>"
		}
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
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="clientPhone">Phone Number</label>'
		+ '    			<input type="text" class="form-control" id="clientPhone" placeholder="Enter Phone Number" value="'+ (isUpdate ? orderObj.clientPhone : "")+'">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="clientAddress">Address</label>'
		+ '    			<textarea class="form-control" id="clientAddress" rows="3" placeholder="Enter Address" value="'+ (isUpdate ? orderObj.clientAddress : "")+'"></textarea>'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="eventName">Event Name</label>'
		+ '    			<input type="text" class="form-control" id="eventName" placeholder="Enter Event Name" value="'+ (isUpdate ? orderObj.eventName : "")+'">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="eventDate">Event Date</label>'
		+ '    			<input type="text" class="form-control" id="eventDate" placeholder="Enter Event Date" value="'+ (isUpdate ? orderObj.eventDate : "")+'">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="eventVenue">Event Venue</label>'
		+ '    			<input type="text" class="form-control" id="eventVenue" placeholder="Enter Event Venue" value="'+ (isUpdate ? orderObj.eventVenue : "")+'">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="clientNotes">Notes</label>'
		+ '    			<textarea class="form-control" id="clientNotes" rows="3" placeholder="Enter Any Additional Notes" value="'+ (isUpdate ? orderObj.clientNotes : "")+'"></textarea>'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		/* + '  <div class="form-group">'
		+ '    <label for="serviceForms">Service Forms</label>'
		+ '    <div class="card w-75" id="serviceForms">'
		+ '      <div class="card-body">'
		+ '        <h5 class="card-title">Card title</h5>'
		+ '        <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>'
		+ '        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>'
		+ '        <a href="#" class="card-link">Card link</a>'
		+ '        <a href="#" class="card-link">Another link</a>'
		+ '      </div>'
		+ '    </div>'
		+ '  </div>' */
		+ '  <div class="row mt-4">'
		+ '  	<div class="col text-right">'
		+ '     	<button type="button" id="id_listServiceForms" class="btn btn-primary" isupdate="'+isUpdate+'" orderid="'+ (isUpdate ? orderObj.orderId : "")+'">Save and Proceed To Service Form</button>'
		+ '       	<button type="button" id="id_listServiceFormsCancel" class="btn btn-secondary ml-3">Cancel</button>'
		+ '  	</div>'
		+ '  	<div class="col"></div>' 
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
    		cbk();
		},
		error: function(res){
			hideLoading();
		    alert('Failed to fetch Order.. Please Try again later..');
		}
	});
}
OrderTab.prototype.renderServiceForm = function(){
	var _this = this;
	$("#id_createOrder").attr('hidden', true);
	var orderId = getValueFromQueryParam("orderid");
	_this.currentOrder = _this.ordersList && _this.ordersList[orderId];

	var cbk = function(){
		$("#id_orderContent_tab").append(_this.renderServiceFormList());
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
					+ '<div class="row">'
						+ '<div class="text-right col-11 pb-4">'
							+ '<a id="id_createService" class="btn btn-primary btn-md mr-3 col-2 text-white">'
					          + '<i class="fa fa-plus-circle" aria-hidden="true"></i> Create New Service'
					        + '</a>'
						+ '</div>'
				   	+ '</div>'
	if(serviceJson){
		for(var i=0; i< serviceJson.length; i++){
			if(i%2 == 0){
				renderHtml += "<div class='row'>"
			}
			renderHtml += "<div class='card border-secondary mb-3 col-5 mx-4 cls_serviceDetails' style='cursor:pointer'>"
								+ "<h6 class='card-header text-success bg-transparent border-secondary text-center cls_serviceName'>"+ serviceJson[i].sessionName +"</h6>"
								+ "<div class='card-body text-secondary font-weight-bold'>"
							 		+ "<div class='row'>"
							 		    + "<div class='card-title cls_eventVenue col-6'>"+ serviceJson[i].sessionVenue +"</div>"
							    		+ "<div class='card-text cls_eventDate col-6'>"+ serviceJson[i].sessionDateTime +"</div>"
							    	+ "</div>"
							  	+ "</div>"
							  	+ "<div class='card-footer text-center bg-light border-secondary row p-0'>"
							  		+ "<label class='col-6 border-right border-secondary m-0 p-2' style='cursor:pointer'>Complete</label>"
							  		+ "<label class='col-6 m-0 p-2' style='cursor:pointer'>Delete</label>"
							  	+ "</div>"
							+ "</div>";
			if(i%2 != 0 || (i == serviceJson.length-1)){
				renderHtml += "</div>"
			}
		}
	}
	renderHtml += '</div>'

	renderHtml += '<form class="serviceFormDetails mb-2 d-none">'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="serviceFormName">Session Name</label>'
		+ '    			<input type="text" class="form-control" id="sessionName" placeholder="Enter Session Name">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="serviceFormDateTime">Session Date and Time</label>'
		+ '    			<input type="text" class="form-control" id="sessionDateTime" placeholder="Enter Session Date and Time">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="sessionVenue">Session Date and Time</label>'
		+ '    			<input type="text" class="form-control" id="sessionVenue" placeholder="Enter Session Venue">'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <div class="form-group">'
		+ '  	<div class="row">'
		+ '  		<div class="col">'
		+ '    			<label for="serviceFormNotes">Session Notes</label>'
		+ '    			<textarea class="form-control" id="sessionNotes" rows="3" placeholder="Enter Any Additional Session Notes"></textarea>'
		+ '  		</div>'
		+ '  		<div class="col"></div>' 
		+ '  		</div>'
		+ '  	</div>'
		+ '  </div>'
		+ '  <h5><u>Add Receipes to Service Form</u></h5>'
		+ '  <div class="form-group receipeMapContainer">'
		+ '  	<div class="serviceFormReceipeMap mt-4">'
		+ '    		<div class="row">'
		+ '      		<div class="col text-center">'
		+ '			        <label class="font-weight-bold">Category</label>'
		+ '      		</div>'
		+ '      		<div class="col text-center">'
		+ '        			<label class="font-weight-bold">No. Of People</label>'
		+ '      		</div>'
		+ '      		<div class="col">'
		+ '      		</div>'
		+ '    		</div>'
		+ _this.getReceipeMapRowForSF()
		+ '		 </div>'			
		+ '      <div class="row mt-4 mb-4">'
		+ '      	<div class="col">'
		+ '       	</div>'
		+ '       	<div class="col">'
		+ '      	</div>'
		+ '      	<div class="col mt-3">'
		+ '        		<button type="button" class="btn btn-success cls_addReceipe_sf">Add</button>'
		+ '      	</div>'
		+ '      </div>'
		+ '  </div>'
		//TODO : Add / Remove DOM rows plugin
		+ '  <div class="col text-right mt-2">'
		+ '      <button type="button" id="id_createServiceForm" class="btn btn-primary">Create Service Form</button>'
		+ '      <button type="button" id="id_createServiceFormCancel" class="btn btn-secondary ml-3">Cancel</button>'
		+ '  </div>'
		+ '</form>';

		return renderHtml;
}
OrderTab.prototype.getReceipeMapRowForSF = function() {
	var _this = this;
	var renderHtmlMapRow = [];
	
	renderHtmlMapRow += '<div class="row recipeMapRowSf mt-4">'
			+ '      <div class="col">'
			+ '        <select class="form-control cls_receipeCategory_sf" name="receipeCategory"></select>'
			+ '      </div>'
			+ '      <div class="col">'
			+ '        <input type="number" min="0" class="form-control cls_receipeCount_sf" required id="id_receipeCount_sf" placeholder="Enter Count / No. Of People" name="receipeCount">'
			+ '      </div>'
			+ '      <div class="col">'
			+ ($('.recipeMapRowSf').length>0 ? '<a role="button" class="btn p-0"> <i class="fa fa-minus-circle mt-2 cls_removeCurrentReceipeMap" title= "Remove" style="font-size:25px;color:red;cursor:pointer"></i></a>' : '')
			+ '      </div>'
			+ '    </div>';
			
	return renderHtmlMapRow;
};
OrderTab.prototype.renderEvents = function() {
	var _this = this;
	
	$(document).ready(function(){
		$(document).on("click", ".cls_orderDetails", function(){
			var orderId = $(this).attr("idx");
			addQueryParamToUrlAndReload('orderId', orderId);
		});

		$(document).on("click", "#id_createOrder", function(){
			addQueryParamToUrlAndReload('orderIsNew', 'true');
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
			var elemToAdd = $(_this.getReceipeMapRowForSF());
			cloneDOM(elemToAdd, $('.serviceFormReceipeMap'));
			addOptionsToSelectViaElem(_this.dummyRecipies, $('.cls_receipeCategory_sf')[$('.cls_receipeCategory_sf').length-1]);
		});

		$(document).on("click", ".cls_removeCurrentReceipeMap", function(){
			$(this).parents('.recipeMapRowSf').remove();
		});

		$(document).on("click", "#id_createServiceForm", function(){
			showLoading();
			_this.getServiceFormDataAndCreate();
		});
		
		if(_this.isListServiceForms == "true") {
			addOptionsToSelectViaElem(_this.dummyRecipies, $('.cls_receipeCategory_sf')[0]);
		}

		$(document).on("click", "#id_createService", function(){
			$(".cls_orderServiceList").addClass("d-none");
			$(".serviceFormDetails").removeClass("d-none");
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
	
		$(".cls_confirmPopupDelete").click(function() {

			if($("#confirmationPopup").data("module") == "Order")
			{
 				var orderJson = {};
 				orderJson["orderId"] = $("#confirmationPopup").data("idToDelete");
			    if(orderJson["orderId"] != undefined)
			    {
			    	showLoading();
			        $.ajax({
			        	url: "/deleteOrder",
		            	type: "delete",
		            	contentType: 'application/json',
		            	data: JSON.stringify(orderJson),
			        	success: function(result){
			        		hideLoading();
							$("#successPopup").find('.modal-title').text("Order" + result);
			        		$("#successPopup").modal('show');
			        		$("#confirmationPopup").modal('hide');
			        		showLoading();
			        		location.reload();
						},
						error: function(){
							hideLoading();
						    $("#errorPopup").find('.modal-title').text('Failed to delete Order. Please Try again later.');
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
    		addQueryParamToUrlAndReload('orderid', orderMetaData.orderId);
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
    		addQueryParamToUrlAndReload('listServiceForms', "true");
		},
		error: function(){
			hideLoading();
		    $("#errorPopup").find('.modal-title').text('Failed to update Order. Please Try again later.');
    		$("#errorPopup").modal('show');
		}
	});

}
OrderTab.prototype.getServiceFormDataAndCreate = function(){
	var _this= this;

	var updateOrderData = {};
	updateOrderData.orderId = getValueFromQueryParam("orderid"	);
	updateOrderData.serviceForms = [];

	var serviceForms = {};
	serviceForms.serviceId = "serviceid_"+(new Date()).getTime();
	serviceForms.sessionName = $("#sessionName").val();
	serviceForms.sessionDateTime = $("#sessionDateTime").val();
	serviceForms.sessionNotes = $("#sessionNotes").val();
	serviceForms.sessionVenue = $("#sessionVenue").val();

	var recipes = [];
	var categoryList = {};
	var category;
	var categoryCount;
	$(".recipeMapRowSf").each(function(index, element) {
		category = $(".cls_receipeCategory_sf", this).val();
		categoryCount = $(".cls_receipeCount_sf", this).val()
		if(category && categoryCount){
			categoryList.name = category;
			categoryList.count = categoryCount;
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
			$("#successPopup").find('.modal-title').text("Service form Created Successfully");
    		$("#successPopup").modal('show');
			calculatePL(recipes);
			window.location.reload();
		},
		error: function(){
			hideLoading();
		    $("#errorPopup").find('.modal-title').text('Failed to Service form. Please Try again later.');
    		$("#errorPopup").modal('show');
		}
	});

}
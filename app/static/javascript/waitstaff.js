
function BuildOrderCardsWaitstaff(orderData, menuItemsData)
{
	//Compare States
	
	// Build the cards
	for(i = 0; i < orderData.length; i++) 
	{
		//If the status of an order is ready, then skip over that card
		if((orderData[i].status).toString() === "paid")
			continue;
		
		var card = $(`#WTSForderID_${orderData[i]._id.$oid}`);
		
		//Search for menu items
		var arrMenuNames = [];
		var arrQty = [];

		for (j = 0; j < menuItemsData.length; j++)
		{
			for (k = 0; k < orderData[i].items.length; k++)
			{
				var str1 = (orderData[i].items[k].item.$oid).toString();
				if (str1 === menuItemsData[j]._id.$oid)
				{
					arrMenuNames.push(menuItemsData[j].name);
					arrQty.push(orderData[i].items[k].count);
				}
			}
		}
		
		// Update time on existing card then exit
		if ( card.length )
		{	
			// Grab the card's current status
			var currsts = (card.find('#status').html()).toString();
			
			// If the new status on the order is ready, but the card says, not ready, then change the elements and update info
			if ((orderData[i].status).toString() === "ready" && currsts != "Ready")
			{
					var object = card.find('#updateBody');
					//This is gonna look real ugly
					const nuCard = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-success mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
									<div class="card-header text-success border-success" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Ready</span></span>
									</div>
									${object[0].outerHTML}
									<div class="card-footer bg-transparent border-success">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-success">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
							
				$(`#WTSForderID_${orderData[i]._id.$oid}`).replaceWith(nuCard);
				$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);	
				
				//Edit the button to include a function
				$(`#btnPayOrder_${orderData[i]._id.$oid}`).click(function() {
					var str = (this.id).split("_");
					$('#WTSF_PayBill').find('#OrderID').html(str[1]);
					
					var cost = $(this).data("cost");
					$('#WTSF_PayBill').find('#Meal_cost').val(cost);
				});
			}
			// If the new status on the order is changed, but the card says something else, then change the elements and update info			
			else if ((orderData[i].status).toString() === "changed")
			{
				var object = card.find('#updateBody');
				
				//This is gonna look real ugly
				const nuCard = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
							<div class="card bg-transparent border-info mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
								<div class="card-header text-info border-info" >
									Order #${orderData[i].order_id}
									<hr>
									<span>Status: <span id="status">Order Changed</span></span>
								</div>
								${object[0].outerHTML}
								<div class="card-footer bg-transparent border-info">
									<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
									<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
								</div>
								<div class="card-footer bg-transparent border-info">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;		

				$(`#WTSForderID_${orderData[i]._id.$oid}`).replaceWith(nuCard);
				$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);								
			
				//Edit the button to include a function
				$(`#btnPayOrder_${orderData[i]._id.$oid}`).click(function() {
					var str = (this.id).split("_");
					$('#WTSF_PayBill').find('#OrderID').html(str[1]);
					
					var cost = $(this).data("cost");
					$('#WTSF_PayBill').find('#Meal_cost').val(cost);
				});
			}
			else if ((orderData[i].status).toString() === "payment_recieved" && currsts != "Payment Received")
			{
				var object = card.find('#updateBody');
				
				//This is gonna look real ugly
				const nuCard = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
							<div class="card bg-transparent border-info mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
								<div class="card-header text-info border-info" >
									Order #${orderData[i].order_id}
									<hr>
									<span>Status: <span id="status">Payment Received</span></span>
								</div>
								${object[0].outerHTML}
								<div class="card-footer bg-transparent border-info">
									<button type="button" class="btn btn-success" disabled id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
									<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
								</div>
								<div class="card-footer bg-transparent border-info">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;		

				$(`#WTSForderID_${orderData[i]._id.$oid}`).replaceWith(nuCard);
				$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);								
			
				//Edit the button to include a function
				$(`#btnPayOrder_${orderData[i]._id.$oid}`).click(function() {
					var str = (this.id).split("_");
					$('#WTSF_PayBill').find('#OrderID').html(str[1]);
					
					var cost = $(this).data("cost");
					$('#WTSF_PayBill').find('#Meal_cost').val(cost);
				});
			}
			
			//Update quanitity of items in menu and push it to the card
			for (j = 0; j < arrMenuNames.length; j++)
			{
				card.find(`#updateQty_${arrMenuNames[j]}`).html(arrQty[j]);			
			}
			
			if (orderData[i].amount_paid == null)
				card.find('#Amount').html(`Amount Owed: $${orderData[i].total_cost}`);	
			else
			{
				var left = orderData[i].total_cost - orderData[i].amount_paid;
				card.find('#Amount').html(`Amount Owed: $${left}`);	
				if (left <= 0)
				{
					card.find(`#btnPayOrder_${orderData[i]._id.$oid}`).attr("disabled", true);
				}
			}
			
			$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#ToGo').html(`To Go: ${orderData[i].to_go}`);	
	
			var elasped = (Date.now() - parseInt(card.find('#lastUpdate').html()))/(60*1000);
			
			$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#integer').html(parseInt(elasped));
			
			continue;
		}

		var cardTemplate;
		
		if ((orderData[i].status).toString() === "ready")
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-success mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
									<div class="card-header text-success border-success" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Ready</span></span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-success">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-success">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;			
		}
		else if ((orderData[i].status).toString() === "changed" && orderData[i].time_modified != null)
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-info mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
									<div class="card-header text-info border-info" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Order Changed</span></span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-info">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-info">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
		}
		else if ((orderData[i].status).toString() === "payment_recieved" && orderData[i].time_modified != null)
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-info mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
									<div class="card-header text-info border-info" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Payment Received</span></span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-info">
										<button type="button" class="btn btn-success" disabled id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-info">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
		}
		else
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-primary mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${orderData[i].time_ordered}</div>
									<div class="card-header text-primary border-primary" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Ordered</span></span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-primary">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}" data-cost="${orderData[i].total_cost}" data-toggle="modal" href="#WTSF_PayBill">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}" data-toggle="modal" href="#WTSF_EditOrder">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-primary">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
		}

		$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
		
		var inject = $('<div class="card-body text-left"/>');
		inject.append($('<h6 class="card-subtitle mb-2 text-muted"/>').html(`Table #${orderData[i].table}`));
		inject.append($('<dt/>').html("Items"));
		
		//Now build and inject the bulleted list into the appended card
		for (j = 0; j < arrMenuNames.length; j++)
		{
			inject.append($(`<dd>${arrMenuNames[j]} | <span id="updateQty_${arrMenuNames[j]}">${arrQty[j]}</span>`));			
		}
		inject.append($('<hr/>'));		
		inject.append($('<dt/>').html("Special Notes"));
		inject.append($('<dd/>').html(orderData[i].special_notes));	
		
		inject.append($('<hr/>'));		
		
		if (orderData[i].amount_paid == null)
			inject.append($('<p id="Amount"/>').html(`Amount Owed: $${orderData[i].total_cost}`));	
		else
		{
			var left = orderData[i].total_cost - orderData[i].amount_paid;
			inject.append($('<p id="Amount"/>').html(`Amount Owed: $${left}`));	
			if (left <= 0)
			{
				$(`#btnPayOrder_${orderData[i]._id.$oid}`).attr("disabled", true);
			}
		}
		
		inject.append($('<hr/>'));		
		inject.append($('<span id="ToGo"/>').html(`To Go: ${orderData[i].to_go}`));
			
		$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateBody').append(inject);
		
		var elasped;
		
		if (orderData[i].time_modified != null)
			elasped = (Date.now() - orderData[i].time_modified)/(60*1000);
		else
			elasped = (Date.now() - orderData[i].time_ordered)/(60*1000);
		
		// Inject last updated text into footer
		$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
		
		//Edit the button to include a function
		$(`#btnPayOrder_${orderData[i]._id.$oid}`).click(function() {
			var str = (this.id).split("_");
			$('#WTSF_PayBill').find('#OrderID').html(str[1]);
			
			var cost = $(this).data("cost");
			$('#WTSF_PayBill').find('#Meal_cost').val(cost);
		});
			
		//Edit the button to include a function
		$(`#btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}`).click(function() {
			var str = (this.id).split("_");
			
			$('#EditMenuItemForm').find('#orderID').val(str[1]);
		});		
	}
}

function BuildNotificationCards(ordersData)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/notifications";

	request.open('GET', url);

	// Handle on load
	request.onload = function()
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			var notifs = JSON.parse(request.responseText)

			//Build notification cards
			for (i = 0; i < notifs.length; i++)
			{
				if (notifs[i].request_refill === true)
				{
					//Don't build cards for neg 1s (default value of table if not set)
					if (notifs[i].table == -1)
						continue;
					
					BuildDrinkNotificationCard(notifs[i]);
					continue;
				}
				
				if (notifs[i].request_help === true)
				{
					//Don't build cards for neg 1s (default value of table if not set)
					if (notifs[i].table == -1)
						continue;
					
					BuildHelpNotificationCard(notifs[i]);
					continue;
				}

				//  Update the card for a specific order if kitchen has called for the waitstaff
				// 	on a specific meal
				if (notifs[i].call_waitstaff === true && notifs[i].order == null)
				{
					BuildGenericCWCard(notifs[i]);
					continue;
				}
				else if (notifs[i].call_waitstaff === true && notifs[i].order != null)
				{
					for (j = 0; j < ordersData.length; j++)
					{
						var str = (ordersData[j]._id.$oid).toString()
						if (str === notifs[i].order.$oid)
						{
							BuildOrderCWAlert(notifs[i], ordersData[j]);	
						}
					}
					continue;
				}
				
				/*
				if (notifs[i].meal_ready)
				{
					BuildOrderReadyAlert(notifs[i], ordersData);
					continue;
				}
				*/
			}
			return;
		}
		else
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
	};

	// Handle on errors
	request.error = function()
	{
		alert("Request Failed!");
	};

	request.send();	
}

function BuildDrinkNotificationCard(notifData)
{
	// Update time on existing card then exit
	if ( $(`#drinkNotifID_${notifData._id.$oid}`).length )
	{
		var elasped = (Date.now() - parseInt($(`#drinkNotifID_${notifData._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
		$(`#drinkNotifID_${notifData._id.$oid}`).find('#integer').html(parseInt(elasped));			
		return;			
	}	
	
	// Prevent case where if no time was submitted, then returns undefined
	var elasped;
	
	if (notifData.time_created != null)
	{
		elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);
		timeCreated = notifData.time_created;
	}
	else
	{
		elasped = (Date.now() - (Date.now() - 60000))/(60*1000);
		timeCreated = elasped;
	}
	
	var cardTemplate = `<div class="SingletonOrderCard" id="drinkNotifID_${notifData._id.$oid}">
						<div class="card bg-transparent border-warning mb-3 w-75 text-center">
							<div style="display:none;" id="lastUpdate">${timeCreated}</div>
							<div class="card-header text-dark border-warning" >
								Table #${notifData.table} Requests Refill
							</div>
							<div id="updateBody"></div>
							<div class="card-footer bg-transparent border-warning">
								<button type="button" class="btn btn-secondary" id="btnClose_${notifData._id.$oid}" style="z-index:2000">Dismiss</button>
							</div>
							<div class="card-footer bg-transparent border-warning">
								<div id="updateTime"></div>
							</div>
						</div>
					</div>`;	
	
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`drinkNotifID_${notifData._id.$oid}`);

	var inject = $('<div class="card-body text-left"/>');
	inject.append($('<dt/>').html("Items"));
	
	//Now build and inject the bulleted list into the appended card
	for (j = 0; j < notifData.refill_list.length; j++)
	{
		inject.append($('<dd/>').html(notifData.refill_list[j]));			
	}
	
	$(`#drinkNotifID_${notifData._id.$oid}`).find('#updateBody').append(inject);					
						
	
	
	//Edit the button to include a function
	$(`#btnClose_${notifData._id.$oid}`).click(function() {
		var str = ($(this).attr('id')).split("_");
		$(`#drinkNotifID_${str[1]}`).remove()
		DeleteNotifications(this);
	});
	
	// Inject last updated text into footer
	$(`#drinkNotifID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
	
	GenerateAlertMessage('#WTSF_Alerts' ,`<strong>Refill Requested!</strong> Table #${notifData.table} requests drink refill!`, 'alert-warning', `alertID_${notifData._id.$oid}`, true)
}

function BuildHelpNotificationCard(notifData)
{
	var elasped;
	
	// Update time on existing card then exit
	if ( $(`#helpNotifID_${notifData._id.$oid}`).length )
	{
		var elasped = (Date.now() - parseInt($(`#helpNotifID_${notifData._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
		$(`#helpNotifID_${notifData._id.$oid}`).find('#integer').html(parseInt(elasped));			
		return;			
	}

	// Prevent case where if no time was submitted, then returns undefined
	if (notifData.time_created != null)
	{
		elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);
		timeCreated = notifData.time_created;
	}
	else
	{
		elasped = 0;
		timeCreated = Date.now();
	}
		
	var cardTemplate = `<div class="SingletonOrderCard" id="helpNotifID_${notifData._id.$oid}">
						<div class="card bg-transparent border-danger mb-3 w-75 text-center">
							<div style="display:none;" id="lastUpdate">${timeCreated}</div>
							<div class="card-header text-danger border-danger" >
								Table #${notifData.table} Requests For Help
							</div>
							<div id="updateBody">
								<div class="card-body text-left">
									Reason: Help button was pressed
								</div>							
							</div>
							<div class="card-footer bg-transparent border-danger">
								<button type="button" class="btn btn-secondary" id="btnClose_${notifData._id.$oid}" style="z-index:2000">Dismiss</button>
							</div>
							<div class="card-footer bg-transparent border-danger">
								<div id="updateTime"></div>
							</div>
						</div>
					</div>`;		
						
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`helpNotifID_${notifData._id.$oid}`);
	
	//Edit the button to include a function
	$(`#btnClose_${notifData._id.$oid}`).click(function() {
		DeleteNotifications(this);
		var str = ($(this).attr('id')).split("_");
		$(`#helpNotifID_${str[1]}`).remove();
	
	});
	
	// Inject last updated text into footer
	$(`#helpNotifID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
						
	GenerateAlertMessage('#WTSF_Alerts' ,`<strong>Waitstaff Requested!</strong> Table #${notifData.table} requests for help!`, 'alert-warning', notifData._id.$oid, true);
}

function BuildGenericCWCard(notifData)
{
	var elasped;
	
	// Update time on existing card then exit
	if ( $(`#callwaitstaffID_${notifData._id.$oid}`).length )
	{
		var elasped = (Date.now() - parseInt($(`#callwaitstaffID_${notifData._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
		$(`#callwaitstaffID_${notifData._id.$oid}`).find('#integer').html(parseInt(elasped));			
		return;			
	}
	
	// Prevent case where if no time was submitted, then returns undefined
	if (notifData.time_created != null)
	{
		elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);
		timeCreated = notifData.time_created;
	}
	else
	{
		elasped = 0;
		timeCreated = Date.now();
	}
	
	var cardTemplate = `<div class="SingletonOrderCard" id="callwaitstaffID_${notifData._id.$oid}">
						<div class="card bg-transparent border-warning mb-3 w-75 text-center">
							<div style="display:none;" id="lastUpdate">${timeCreated}</div>
							<div class="card-header text-dark border-warning" >
								Kitchen Called for Waitstaff
							</div>
							<div id="updateBody">
								<div class="card-body text-left">
									<strong>Reason: Call button pressed</strong>
								</div>
							</div>
							<div class="card-footer bg-transparent border-primary">
								<button type="button" class="btn btn-secondary" id="btnClose_${notifData._id.$oid}" style="z-index:2000">Dismiss</button>
							</div>
							<div class="card-footer bg-transparent border-warning">
								<div id="updateTime"></div>
							</div>
						</div>
					</div>`;
						
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`callwaitstaffID_${notifData._id.$oid}`);
	
	//Edit the button to include a function
	$(`#btnClose_${notifData._id.$oid}`).click(function() {
		DeleteNotifications(this);
		var str = ($(this).attr('id')).split("_");
		$(`#callwaitstaffID_${str[1]}`).remove();
	});
	
	// Inject last updated text into footer
	$(`#callwaitstaffID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
						
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Waitstaff Requested!</strong> Kitchen called for Waitstaff!", 'alert-warning', notifData._id.$oid, true)

}

function BuildOrderCWAlert(notifData, orderData)
{
	var elasped;
	
	// Update time on existing card then exit
	if ( $(`#callwaitstaffOrderID_${notifData._id.$oid}`).length )
	{
		elasped = (Date.now() - parseInt($(`#callwaitstaffOrderID_${notifData._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
		$(`#callwaitstaffOrderID_${notifData._id.$oid}`).find('#integer').html(parseInt(elasped));			
		return;			
	}
	
	// Prevent case where if no time was submitted, then returns undefined
	if (notifData.time_created != null)
	{
		elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);
		timeCreated = notifData.time_created;
	}
	else
	{
		elasped = 0;
		timeCreated = Date.now();
	}

	var cardTemplate = `<div class="SingletonOrderCard" id="callwaitstaffOrderID_${notifData._id.$oid}">
						<div class="card bg-transparent border-warning mb-3 w-75 text-center">
							<div style="display:none;" id="lastUpdate">${timeCreated}</div>
							<div class="card-header text-dark border-warning" >
								Kitchen Called for Waitstaff
							</div>
							<div id="updateBody">
								<div class="card-body text-left">
									<strong>Reason: Input Query for Order #${orderData.order_id}</strong>
								</div>
							</div>
							<div class="card-footer bg-transparent border-warning">
								<button type="button" class="btn btn-secondary" id="btnClose_${notifData._id.$oid}" style="z-index:2000">Dismiss</button>
							</div>
							<div class="card-footer bg-transparent border-warning">
								<div id="updateTime"></div>
							</div>
						</div>
					</div>`;
						
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`callwaitstaffOrderID_${notifData._id.$oid}`);

	//Edit the button to include a function
	$(`#btnClose_${notifData._id.$oid}`).click(function() {
		DeleteNotifications(this);
		var str = ($(this).attr('id')).split("_");
		$(`#callwaitstaffOrderID_${str[1]}`).remove();
	});	
	
	// Inject last updated text into footer
	$(`#callwaitstaffOrderID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
	
	GenerateAlertMessage('#WTSF_Alerts' ,`<strong>Waitstaff Requested!</strong> Kitchen requests waitstaff for Order #${orderData.order_id}`, 'alert-warning', notifData._id.$oid, true)	
}

function PayOrder(id)
{
    var put = new XMLHttpRequest();
	
	var url = "/api/orders/" + id;

    // POST to the API
    put.open('PUT', url);
	
	//Needs to be in JSON format, no other way around it
	var payload =
	{ 
		"amount_paid": $('#WTSF_PayBill').find('#Meal_cost').val(),
		"paid_off":	false,
		"time_modified": Date.now()
	};
	
	var cost = 	$(`#btnPayOrder_${id}`).data('cost');
	
	// Check if the amount paid is greater than or equal to the amount owed
	if (payload['amount_paid'] >= cost)
	{
		payload['paid_off'] = true;
		payload['status'] = "payment_recieved";
	}

	// Handle errors	
	//To Do: Alert user if errors occured, even OnLoad
	put.error = function() 
	{
		alert("Request Failed!");
	};	
	
	// Handle on load
	put.onload = function() 
	{
		//Check for OK or CREATED status
		if (put.status === 200 || put.status === 201 || put.status === 204)
		{
			alert("Payment Successful!");
			RetrieveOrders(true, false, true);
			return;
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(put.responseText)
			console.log(error.message)
			
			alert(`Error ${put.status}: ${error.message}`);
		}
	};

	put.setRequestHeader("Content-Type", "application/json");	
    put.send(JSON.stringify(payload));	
}

function RequestOrder(id)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/orders/" + id;

	request.open('GET', url);

	// Handle on load
	request.onload = function()
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			AutofillEditCategoryFields(JSON.parse(request.responseText))
			PopulateEditOrderTable(JSON.parse(request.responseText), false)
		}
		else
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
	};

	// Handle on errors
	request.error = function()
	{
		alert("Request Failed!");
	};

	request.send();	
}

function PopulateEditOrderTable(orderData, newRow)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/menuitems";

	request.open('GET', url);

	// Handle on load
	request.onload = function(data)
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			var menusData = JSON.parse(request.responseText);
			
			if (newRow === false)
			{
				var orderData = data.target.extraInfo;
				
				// Build the table next
				for (i = 0; i < orderData.items.length; i++)
				{
					var row = $('<tr/>')
					var options = $(`<form class="EO_item_name" id="form_${orderData.items[i].item.$oid}">`);
					var optionsDelta = $(`<select class="form-control" id="orderoptions_${orderData._id.$oid}_${i}" name="menu_item" required>`)
					
					// Build the options array
					for (j = 0; j < menusData.length; j++)
					{
						optionsDelta.append(`<option value="${menusData[j]._id.$oid}" data-cost="${menusData[j].cost}" data-qtyid="qty_${orderData.items[i].item.$oid}">${menusData[j].name}</option>`);
					}
					options.append(optionsDelta);
					
					row.append($('<td/>').html(options));		
	
					var count;
					if (orderData.items[i].count != null)
						count = orderData.items[i].count;
					else
						count = 1;
					
					quantity = $(`<form class="EO_item_qty" id="qty_${orderData.items[i].item.$oid}"><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${count}">`);
	
					row.append($('<td/>').html(quantity));				
					
					$('#WTSF_EditOrder_Table').append(row);
					
					$(`#orderoptions_${orderData._id.$oid}_${i} option[value=${orderData.items[i].item.$oid}]`).attr("selected","selected");
				}
			}
			else
			{
				var row = $('<tr/>')
				var options = $(`<form class="EO_item_name">`);
				var optionsDelta = $(`<select class="form-control" id="orderoptions_new_${window.extraRow}" name="menu_item" required>`)
				
				// Build the options array
				for (j = 0; j < menusData.length; j++)
				{
					if (j == 0)
						optionsDelta.append(`<option value="${menusData[j]._id.$oid}" data-cost="${menusData[j].cost}" data-qtyid="qty_new_${window.extraRow}" selected>${menusData[j].name}</option>`);							
					else
						optionsDelta.append(`<option value="${menusData[j]._id.$oid}" data-cost="${menusData[j].cost}" data-qtyid="qty_new_${window.extraRow}">${menusData[j].name}</option>`);
				}
				options.append(optionsDelta);
				
				row.append($('<td/>').html(options));		
	
				var count = 1;
				
				quantity = $(`<form class="EO_item_qty" id="qty_new_${window.extraRow}"><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${count}">`);
	
				row.append($('<td/>').html(quantity));				
				
				$('#WTSF_EditOrder_Table').append(row);	
				window.extraRow += 1;
			}
		}
		else
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
	};

	// Handle on errors
	request.error = function()
	{
		alert("Request Failed!");
	};
	
	request.extraInfo = orderData;
	request.send();		
}

function SubmitOrderChangesPUT()
{
    event.preventDefault();
	
    var put = new XMLHttpRequest();
	
	var url = "/api/orders/" + $('#EditMenuItemForm').find('#orderID').val();
	
	//Gather all ing_update and inv_update classes, we need the ids of these to push to the API
	var data = document.querySelectorAll('*[class="EO_item_name"]');

    // POST to the API
    put.open('PUT', url);
	
    var formData = new FormData(document.getElementById("EditMenuItemForm"));	
	
	//Needs to be in JSON format, no other way around it
	var payload =
	{ 
		"gratuity": parseFloat(formData.get('gratuity')),
		"special_notes": formData.get('special_notes'),
		"to_go": false,
		"status": "changed",
		"time_modified": Date.now(),
		"total_cost": 0,
		"items": [],
		"amount_paid": parseFloat(formData.get('amount_paid')),
		"paid_off":	false
	};
	
	var realCost = 0;
	
	// Iterate through the data we've gotten from the query
	for (i = 0; i < data.length; i++)
	{
		var value = data[i].elements[0].selectedOptions[0].value;
		if (value != null)
		{
			var count = $(`#${data[i].elements[0].selectedOptions[0].dataset.qtyid}`)[0].elements[0].value;
			payload.items.push( {"item": value, "count": count } );
			//Update the cost
			var cost = parseFloat(data[i].elements[0].selectedOptions[0].dataset.cost);
			realCost += (cost * count);
		}
	}
	
	//Update the amount payed and paid_off
	var paidoff = realCost - payload['amount_paid'];
	
	if (paidoff <= 0)
		payload['paid_off'] = true;
	
	//Here we go, here we go
	if ( formData.get('to_go') != null )
		payload['to_go'] = true;
	
	//Here we go, here we go
	if ( formData.get('comped') != null )
	{
		payload['comped'] = true;
		payload['staff_comped'] = getCookie("username");
	}
	
	// Handle errors	
	//To Do: Alert user if errors occured, even OnLoad
	put.error = function() 
	{
		alert("Request Failed!");
	};	
	
	// Handle on load
	put.onload = function() 
	{
		//Check for OK or CREATED status
		if (put.status === 200 || put.status === 201 || put.status === 204)
		{
			RetrieveOrders(true, false, true); 
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(put.responseText)
			console.log(error.message)
			
			alert(`Error ${put.status}: ${error.message}`);
		}
	};

	put.setRequestHeader("Content-Type", "application/json");	
    put.send(JSON.stringify(payload));	
}

function AutofillEditCategoryFields(orderData)
{
	if (orderData.gratuity != null)
		$('#EditMenuItemForm').find('#EO_gratuity').val(orderData.gratuity);
	else
		$('#EditMenuItemForm').find('#EO_gratuity').val(0.00);
	
	if (orderData.amount_paid != null)
		$('#EditMenuItemForm').find('#amountPayed').val(orderData.amount_paid);
	else
		$('#EditMenuItemForm').find('#amountPayed').val(0.00);
	
	$('#EditMenuItemForm').find('#orderNo').val(orderData.order_id);
	$('#EditMenuItemForm').find('#EO_specialnotes').val(orderData.special_notes);
	$('#EditMenuItemForm').find('#EO_togo').prop("checked", orderData.to_go);
	$('#EditMenuItemForm').find('#EO_comped').prop("checked", orderData.comped);
}

//
// BEGIN Event Listeners
//

// Retrieve order cards on page load
$( document ).ready(function() {
	window.currentState = []

    RetrieveOrders(true, false, true);
});

$('#WTSF_EditOrder').on('shown.bs.modal', function(event) // Create the table once the modal is shown (after it pops up)
{
	var id = $('#EditMenuItemForm').find('#orderID').val();
	RequestOrder(id);
	window.extraRow = 1;
});

$('#WTSF_PayBill_btn_PayBill').click( function()
{
	 //Pay the Bill
	 var id = $('#WTSF_PayBill').find('#OrderID').html();
	
	 PayOrder(id);
});

$('#WTSF_EditOrder_btnAddMenuItem').click( function()
{
	PopulateEditOrderTable(null, true);
});

$('#WTSF_EditOrder_btnSaveChanges').click( function()
{
	SubmitOrderChangesPUT();
	
	var orderNo = $('#EditMenuItemForm').find('#orderNo').val();
	
	GenerateAlertMessage('#WTSF_Alerts' ,`<strong>Order Updated!</strong> Order #${orderNo} was recently updated!`, 'alert-info')	
	$('#WTSF_EditOrder_Table tr td').remove();
	window.extraRow = 1;
});


// Update Orders and Notification Cards
setInterval(function() { 

	RetrieveOrders(true, false, true); 

	// Create our array of XMLHttpRequests
	var requests = [];

	//Retrieve all notification cards and clean them up if they don't exist in the API
	for (i = 0; i < window.currentState.length; i++)
	{
		// Deletion does not modify the array, so check if there's a null element in the array
		if (window.currentState[i] == null)
			continue;
		
		(function (i){
			requests[i] = new XMLHttpRequest();
			
			var url = "/api/notifications/" + ((window.currentState[i]).split("_"))[1];
			requests[i].open('GET', url);

			// Handle on load
			requests[i].onload = function(data)
			{
				//If we got a OK response, then nothing else needs to be done
				if (requests[i].status === 200 || requests[i].status === 201 || requests[i].status === 204)
				{
					return;
				}
				else if (requests[i].status === 404) // We're expecting to get one of these so we can delete notifications
				{
					$(`#${requests[i].extraInfo}`).remove();
					delete window.currentState[i];
				}
				else	// Handle Other unusual errors
				{
					alert(`Error ${requests[i].status}: ${requests[i].statusText}`);
				}
			};

			// Handle on errors
			requests[i].error = function()
			{
				alert("Request Failed!");
			};

			requests[i].extraInfo = window.currentState[i];
			requests[i].send();

		})(i);
	}
	
	
}, 10000);

//
// END Event Listeners
//


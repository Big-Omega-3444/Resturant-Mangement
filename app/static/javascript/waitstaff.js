
function BuildOrderCardsWaitstaff(orderData, menuItemsData)
{
	// Build the table
	for(i = 0; i < orderData.length; i++) 
	{
		//If the status of an order is ready, then skip over that card
		if((orderData[i].status).toString() === "paid")
			continue;
		
		var card = $(`#orderID_${orderData[i]._id.$oid}`);
		
		// Update time on existing card then exit
		if ( card.length )
		{	
			if ((orderData[i].status).toString() === "ready")
			{
				$(`#WTSForderID_${notifData.order.$oid}`).children('border-primary').attr( "border-primary", "border-success" )				

				$(`#WTSForderID_${notifData.order.$oid}`).addClass('border-success');
				
				$(`#WTSForderID_${notifData.order.$oid}`).removeClass('text-primary');
				$(`#WTSForderID_${notifData.order.$oid}`).addClass('text-success');				
				
				GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Meal Ready!</strong> Order #${ordersData.order_id} is ready to serve to the customer!", 'alert-success')	
			}
			
			if ((orderData[i].status).toString() === "changed" && (orderData[i].status).toString())
			{
				
			}
	
			var elasped = (Date.now() - parseInt($(`#orderID_${orderData[i]._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
			
			$(`#orderID_${orderData[i]._id.$oid}`).find('#integer').html(parseInt(elasped));
			
			continue;
		}

		//Search for menu items
		var arrMenuNames = [];

		for (j = 0; j < menuItemsData.length; j++)
		{
			for (k = 0; k < orderData[i].items.length; k++)
			{
				var str1 = (orderData[i].items[k].item.$oid).toString();
				if (str1 === menuItemsData[j]._id.$oid)
					arrMenuNames.push(menuItemsData[j].name);
			}
		}
		
		var cardTemplate;
		
		if ((orderData[i].status).toString() === "ready")
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-success mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${Date.now()}</div>
									<div class="card-header text-success border-success" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: ${orderData[i].status[0][0].toUpperCase() + orderData[i].status.slice(1) }</span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-success">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay for Order</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit Order</button>
									</div>
									<div class="card-footer bg-transparent border-success">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;			
		}
		else
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-primary mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${Date.now()}</div>
									<div class="card-header text-primary border-primary" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: ${orderData[i].status[0][0].toUpperCase() + orderData[i].status.slice(1) }</span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-primary">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay for Order</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit Order</button>
									</div>
									<div class="card-footer bg-transparent border-primary">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
		}

		$('#WTSF_orderNotifications').append(cardTemplate);
		
		var inject = $('<div class="card-body text-left"/>');
		inject.append($('<dt/>').html("Items"));
		
		//Now build and inject the bulleted list into the appended card
		for (j = 0; j < arrMenuNames.length; j++)
		{
			inject.append($('<dd/>').html(arrMenuNames[j]));			
		}
		inject.append($('<hr/>'));		
		inject.append($('<dt/>').html("Special Notes"));
		inject.append($('<dd/>').html(orderData[i].special_notes));	
		
		$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateBody').append(inject);
		
		var elasped = (Date.now() - orderData[i].time_ordered)/(60*1000);
		
		// Inject last updated text into footer
		$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
		
		//Edit the button to include a function
//		$(`#btnReady_${orderData[i]._id.$oid}`).click(function() {
//			SendOrderReadyRequest(this);
//		});
			
		//Edit the button to include a function
//		$(`#btnWaitstaff_${orderData[i]._id.$oid}_${orderData[i].order_id}`).click(function() {
//			SendOrderCallWaitstaffRequest(this);
//		});		
	}
}

function BuildNotificationCards()
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
					BuildDrinkNotificationCard(notifs[i]);
					continue;
				}
				
				if (notifs[i].request_help === true)
				{
					BuildHelpNotificationCard(notifs[i]);
					continue;
				}

				//  Update the card for a specific order if kitchen has called for the waitstaff
				// 	on a specific meal
				if (notifs[i].call_waitstaff === true && notifs[i].order != null)
				{
					//UpdateOrderCardCW(notifs[i]);
					continue;
				}
				else if (notifs[i].call_waitstaff === true && notifs[i].order == null)
				{
					//BuildGenericCWCard(notifs[i]);
					continue;
				}
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
		var cardTemplate = `<div class="SingletonOrderCard" id="drinkNotifID_${notifData._id.$oid}">
							<div class="card bg-transparent border-primary mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${Date.now()}</div>
								<div class="card-header text-dark border-warning" >
									Table ??? Requests Refill
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-warning">
									Drink: drinkID
								</div>
								<div class="card-footer bg-transparent border-warning">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;		
						
	$('#WTSF_orderNotifications').append(cardTemplate);
	
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Refill Requested!<strong> Table ??? requests drink refill of ???", 'alert-warning')
}

function BuildHelpNotificationCard(notifData)
{
		var cardTemplate = `<div class="SingletonOrderCard" id="helpNotifID_${notifData._id.$oid}">
							<div class="card bg-transparent border-danger mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${Date.now()}</div>
								<div class="card-header text-danger border-danger" >
									Table ??? Requests Refill
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-danger">
									Drink: drinkID
								</div>
								<div class="card-footer bg-transparent border-danger">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;		
						
	$('#WTSF_orderNotifications').append(cardTemplate);
	
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Help Requested!<strong> Table ??? requests help!", 'alert-danger')	
}

function BuildCallWaitstaffOnOrderNotificationCard(notifData)
{
		var cardTemplate = `<div class="SingletonOrderCard" id="callwaitstaffID_${notifData._id.$oid}">
							<div class="card bg-transparent border-warning mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${Date.now()}</div>
								<div class="card-header text-dark border-warning" >
									Order #${orderData[i].order_id}
									<hr>
									<span>Status: ${orderData[i].status[0][0].toUpperCase() + orderData[i].status.slice(1) }</span>
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-warning">
									<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay for Order</button>
									<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit Order</button>
								</div>
								<div class="card-footer bg-transparent border-warning">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;	
						
	$('#WTSF_orderNotifications').append(cardTemplate);
						
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Waitstaff Requested!<strong> Kitchen called Waitstaff for Order # ???", 'alert-warning')
}

function BuildGenericCWCard(notifData)
{
		var cardTemplate = `<div class="SingletonOrderCard" id="callwaitstaffID_${notifData._id.$oid}">
							<div class="card bg-transparent border-warning mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${Date.now()}</div>
								<div class="card-header text-dark border-warning" >
									Order #${orderData[i].order_id}
									<hr>
									<span>Status: ${orderData[i].status[0][0].toUpperCase() + orderData[i].status.slice(1) }</span>
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-warning">
									<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay for Order</button>
									<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit Order</button>
								</div>
								<div class="card-footer bg-transparent border-warning">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;	
						
	$('#WTSF_orderNotifications').append(cardTemplate);
						
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Waitstaff Requested!<strong> Kitchen called Waitstaff for Order # ???", 'alert-warning')		
}

//
// BEGIN Event Listeners
//

// Retrieve order cards on page load
$( document ).ready(function() {
    RetrieveOrders(true, false, true);
});

// Outside so the script calls this function repeatedly 10 seconds
setInterval(function() { RetrieveOrders(true, false, true); }, 10000);

//
// END Event Listeners
//


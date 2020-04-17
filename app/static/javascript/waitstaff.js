
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
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-success">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
							
				$(`#WTSForderID_${orderData[i]._id.$oid}`).replaceWith(nuCard);
				$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);	
				
//				GenerateAlertMessage('#WTSF_Alerts' ,`<strong>Order Ready!</strong> Order #${ordersData.order_id} is ready to serve to Table #${ordersData.table}!`, 'alert-success')	
			}
			// If the new status on the order is changed, but the card says something else, then change the elements and update info			
			else if ((orderData[i].status).toString() === "changed" && currsts != "Order Changed")
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
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-info">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;	

				$(`#WTSForderID_${orderData[i]._id.$oid}`).replaceWith(nuCard);		
				$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);				
			}
			// If the new status on the order is waitrequest, but the card says something else, then change the elements and update info
			else if ((orderData[i].status).toString() === "waitrequest" && currsts != "Waitstaff Requested")
			{
				var object = card.find('#updateBody');

				//This is gonna look real ugly				
				cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
									<div class="card bg-transparent border-info mb-3 w-75 text-center">
										<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
										<div class="card-header text-info border-info" >
											Order #${orderData[i].order_id}
											<hr>
											<span>Status: <span id="status">Waitstaff Requested</span></span>
										</div>
										${object[0].outerHTML}
										<div class="card-footer bg-transparent border-info">
											<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
											<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
										</div>
										<div class="card-footer bg-transparent border-info">
											<div id="updateTime"></div>
										</div>
									</div>
								</div>`;

				$(`#WTSForderID_${orderData[i]._id.$oid}`).replaceWith(nuCard);		
				$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);									
			}
	
			var elasped = (Date.now() - parseInt(card.find('#lastUpdate').html()))/(60*1000);
			
			$(`#WTSForderID_${orderData[i]._id.$oid}`).find('#integer').html(parseInt(elasped));
			
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
									<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
									<div class="card-header text-success border-success" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Ready</span></span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-success">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
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
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-info">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
		}
		else if ((orderData[i].status).toString() === "waitrequest" && orderData[i].time_modified != null)
		{
			cardTemplate = `<div class="SingletonOrderCard" id="WTSForderID_${orderData[i]._id.$oid}">
								<div class="card bg-transparent border-info mb-3 w-75 text-center">
									<div style="display:none;" id="lastUpdate">${orderData[i].time_modified}</div>
									<div class="card-header text-info border-info" >
										Order #${orderData[i].order_id}
										<hr>
										<span>Status: <span id="status">Waitstaff Requested</span></span>
									</div>
									<div id="updateBody"></div>
									<div class="card-footer bg-transparent border-info">
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
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
										<button type="button" class="btn btn-success" id="btnPayOrder_${orderData[i]._id.$oid}">Pay</button>
										<button type="button" class="btn btn-secondary" id="btnEditOrder_${orderData[i]._id.$oid}_${orderData[i].order_id}">Edit</button>
									</div>
									<div class="card-footer bg-transparent border-primary">
										<div id="updateTime"></div>
									</div>
								</div>
							</div>`;
		}

		$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
		
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
		
		var elasped;
		
		if (orderData[i].time_modified != null)
			elasped = (Date.now() - orderData[i].time_modified)/(60*1000);
		else
			elasped = (Date.now() - orderData[i].time_ordered)/(60*1000);
		
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
				if (notifs[i].call_waitstaff === true && notifs[i].order == null)
				{
					BuildGenericCWCard(notifs[i]);
					continue;
				}
				/*
				else if (notifs[i].call_waitstaff === true && notifs[i].order != null)
				{
					BuildOrderCWAlert(notifs[i], ordersData);
					continue;
				}
				
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
	
		var cardTemplate = `<div class="SingletonOrderCard" id="drinkNotifID_${notifData._id.$oid}">
							<div class="card bg-transparent border-primary mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${notifData.time_created}</div>
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
						
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`drinkNotifID_${notifData._id.$oid}`);

	var elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);

	// Inject last updated text into footer
	$(`#drinkNotifID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);	

	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Refill Requested!<strong> Table ??? requests drink refill of ???", 'alert-warning', notifData._id.$oid, true)
}

function BuildHelpNotificationCard(notifData)
{
		// Update time on existing card then exit
		if ( $(`#helpNotifID_${notifData._id.$oid}`).length )
		{
			var elasped = (Date.now() - parseInt($(`#helpNotifID_${notifData._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
			$(`#helpNotifID_${notifData._id.$oid}`).find('#integer').html(parseInt(elasped));			
			return;			
		}
		
		var cardTemplate = `<div class="SingletonOrderCard" id="helpNotifID_${notifData._id.$oid}">
							<div class="card bg-transparent border-danger mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${notifData.time_created}</div>
								<div class="card-header text-danger border-danger" >
									Table ??? Requests For Help
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
						
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`helpNotifID_${notifData._id.$oid}`);
	
	var elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);
	
	// Inject last updated text into footer
	$(`#callwaitstaffID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
						
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Waitstaff Requested!<strong> Kitchen called for Waitstaff!", 'alert-warning', notifData._id.$oid, true)	
}

function BuildCallWaitstaffOnOrderNotificationCard(notifData)
{					
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Waitstaff Requested!<strong> Kitchen called Waitstaff for Order # ???", 'alert-warning')
}

function BuildGenericCWCard(notifData)
{

		// Update time on existing card then exit
		if ( $(`#callwaitstaffID_${notifData._id.$oid}`).length )
		{
			var elasped = (Date.now() - parseInt($(`#callwaitstaffID_${notifData._id.$oid}`).find('#lastUpdate').html()))/(60*1000);
			$(`#callwaitstaffID_${notifData._id.$oid}`).find('#integer').html(parseInt(elasped));			
			return;			
		}

	
		var cardTemplate = `<div class="SingletonOrderCard" id="callwaitstaffID_${notifData._id.$oid}">
							<div class="card bg-transparent border-warning mb-3 w-75 text-center">
								<div style="display:none;" id="lastUpdate">${notifData.time_created}</div>
								<div class="card-header text-dark border-warning" >
									Kitchen Called for Waitstaff
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-warning">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;
						
	$('#WTSF_orderNotifications_reverse').prepend(cardTemplate);
	window.currentState.push(`callwaitstaffID_${notifData._id.$oid}`);
	
	var elasped = (Date.now() - parseInt(notifData.time_created))/(60*1000);
	
	// Inject last updated text into footer
	$(`#callwaitstaffID_${notifData._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
						
	GenerateAlertMessage('#WTSF_Alerts' ,"<strong>Waitstaff Requested!<strong> Kitchen called for Waitstaff!", 'alert-warning', notifData._id.$oid, true)

}

function BuildOrderCWAlert(notifData)
{
	
}

function BuildOrderReadyAlert(notifData)
{
	
}

//
// BEGIN Event Listeners
//

// Retrieve order cards on page load
$( document ).ready(function() {
	window.currentState = []

    RetrieveOrders(true, false, true);
});

// Update Orders and Notification Cards
setInterval(function() { 

	RetrieveOrders(true, false, true); 

	// Create our array of XMLHttpRequests
	var requests = [];

	//Retrieve all notification cards and clean them up if they don't exist in the API
	for (i = 0; i < window.currentState.length; i++)
	{
		(function (i){
			requests[i] = new XMLHttpRequest();

			var url = "/api/notifications/" + window.currentState[i];
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


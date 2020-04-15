// Function that does a GET request on the specified API
// This is the primary function that does a GET on specific objects, then based on the selector variable, populates a table
function RetrieveOrders()
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	request.open('GET', '/api/orders');

	// Handle on load
	request.onload = function()
	{
		if (request.status != 200)
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(request.responseText)
			console.log(error.message)
			
			alert(`Error ${request.status}: ${error.message}`);
		}
		else
		{
			var payload = JSON.parse(request.responseText);
			
			//No menu items to work with!
			if (payload == [])
				return;
			
			//Retrieve all menu items
			var request2 = new XMLHttpRequest();
			request2.open('GET', '/api/menuitems');

			// Handle on load
			request2.onload = function(data)
			{
				if (request2.status != 200)
				{		
					//TODO: Create alert in HTML instead of using this to specify error
					var error = JSON.parse(request2.responseText)
					console.log(error.message)
					
					alert(`Error ${request2.status}: ${error.message}`);			
				}
				else
				{
					BuildOrderCards(data.target.extraInfo, JSON.parse(request2.responseText))
				}
			}
			
			// Handle on errors
			request2.error = function()
			{
				alert("Request Failed!");
			};			
			
			request2.extraInfo = JSON.parse(request.responseText);
			request2.send();			
		}
	};

	// Handle on errors
	request.error = function()
	{
		alert("Request Failed!");
	};

	request.send();
}

function BuildOrderCards(orderData, menuItemsData)
{
	// Build the table
	for(i = 0; i < orderData.length; i++) 
	{
		// Update time on existing card then exit
		if ( $(`#orderID_${orderData[i]._id.$oid}`).length)
		{
			var elasped = (Date.now() - orderData[i].time_ordered)/(60*1000);
			
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
		
		var cardTemplate = `<div class="SingletonOrderCard" id="orderID_${orderData[i]._id.$oid}">
							<div class="card bg-transparent border-primary mb-3 w-75 text-center">
								<div class="card-header text-primary border-primary" >
									Order #???
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-primary">
									<button class="btn-success" id="btnReady_${orderData[i]._id.$oid}">Ready</button>
									<button class="btn-secondary" id="btnWaitstaff_${orderData[i]._id.$oid}">Call Waitstaff</button>
								</div>
								<div class="card-footer bg-transparent border-primary">
									<div id="updateTime"></div>
								</div>
							</div>
						</div>`;

		$('#orderNotifications').append(cardTemplate);
		
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
		
		$(`#orderID_${orderData[i]._id.$oid}`).find('#updateBody').append(inject);
		
		var elasped = (Date.now() - orderData[i].time_ordered)/(60*1000);
		
		// Inject last updated text into footer
		$(`#orderID_${orderData[i]._id.$oid}`).find('#updateTime').append(`<small>Last updated <span id="integer">${parseInt(elasped)}</span> mins ago</small>`);
		
		//Edit the button to include a function
		$(`#btnReady_${orderData[i]._id.$oid}`).click(function() {
			removeOrderCard(this);
		});		
	}
}

// TO DO: do something else besides delete card
function removeOrderCard(button)
{
	var splitstr = (button.id).split("_");
	
	$('#orderNotifications').find(`#orderID_${splitstr[1]}`).remove();
}

// Outside so the script calls this function repeatedly every minute
setInterval(RetrieveOrders, 10000);

//
// BEGIN Event Listeners
//

// Retrieve order cards on page load
$( document ).ready(function() {
    RetrieveOrders();
});
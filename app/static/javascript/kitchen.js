function populateOrdersTable(orderData, menuItemsData)
{
	// Build the table
	for(i = 0; i < orderData.length; i++) 
	{
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
		
		var row = $('<tr id="tbl_orderID_${orderData[i]._id.$oid}"/>');

		// Append first and last name into one variable
//		var fullname = data[i].firstname + " " + data[i].lastname;
		row.append($('<td/>').html("???"));
		
		var inject = $('<ul/>');
		
		//Now build and inject the bulleted list into the appended card
		for (j = 0; j < arrMenuNames.length; j++)
		{
			inject.append($('<li/>').html(arrMenuNames[j]));			
		}

		row.append($('<td/>').html(inject));
		
		var time = new Date(orderData[i].time_ordered);
		var suffix = (time.getHours() >= 12) ? "AM" : "PM";
		var minutes = (time.getMinutes() < 10) ? "0"+time.getMinutes() : time.getMinutes();
		
		row.append($('<td/>').html(`${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${minutes} ${suffix}`));

		var readyButton = $(`<button class="btn btn-success" id="btnReady_${orderData[i]._id.$oid}"/>`).click(function() {
			//removeOrderCard(this);
			void(0);
		}).html("RDY");
		
		var callButton = $(`<button class="btn btn-secondary" id="btnCall_${orderData[i]._id.$oid}" data-toggle="modal" href=""/>`).click(function() {
//			requestUser(this);
			void(0);
		}).html("CALL");

		row.append($('<td/>').html(readyButton).append(callButton));

		$('#KTCH_OrderHistoryTable_Body').append(row);			
	}	
}

//Separate function because it's very messy
// Does two XHRs to retrieve data from the database, then moves onto the BuildOrderCards
function RetrieveOrders(BuildCards)
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
					// Check if we are building cards or a table
					if (BuildCards === true)
						BuildOrderCards(data.target.extraInfo, JSON.parse(request2.responseText))
					else
						populateOrdersTable(data.target.extraInfo, JSON.parse(request2.responseText))
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
setInterval(RetrieveOrders(true), 10000);

//
// BEGIN Event Listeners
//

// Retrieve order cards on page load
$( document ).ready(function() {
    RetrieveOrders(true);
});

$('#KCHN_Orders').on('shown.bs.modal', function(event)
{
    RetrieveOrders(false);
});

$('#KCHN_Orders').on('hide.bs.modal', function(event)
{
	$('#KTCH_OrderHistoryTable_Body tr td').remove();
});


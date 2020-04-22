
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
		row.append($('<td/>').html(orderData[i].order_id));
		
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
			SendOrderReadyRequest(this);
		}).html("RDY");
		
		var callButton = $(`<button class="btn btn-secondary" id="btnCall_${orderData[i]._id.$oid}" data-toggle="modal" href=""/>`).click(function() {
			SendOrderCallWaitstaffRequest(this);
		}).html("CALL");
	
		row.append($('<td/>').html(readyButton).append(callButton));
		
		$('#KTCH_OrderHistoryTable_Body').append(row);		
	}	
}
function TimeTable() {
	// Open a XHR request to retrieve employee database
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/employees";

	request.open('GET', url);

	// Handle on load
	request.onload = function () {
		if (request.status === 200 || request.status === 201 || request.status === 204) {
			employeeData = JSON.parse(request.responseText);

			populateTimeTable(employeeData); //send employee data to use in timesheets

		}
		else{
			alert(`Error ${request.status}: ${request.statusText}`);
		}


		// Handle on errors	
		
		};
		request.error = function () {
			alert("Request Failed!");
	}
	request.send();
}

//Time records for reports
function populateTimeTable(employeeData) {
	// Open a XHR request to retrieve employee database
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/timesheets";

	request.open('GET', url);

	// Handle on load
	request.onload = function () {
		if (request.status === 200 || request.status === 201 || request.status === 204) {
			timesheetData = JSON.parse(request.responseText);
			results = new Array(employeeData.length);

			// Build the table
			for (i = 0; i < employeeData.length; i++) {
				temp_p = 0
				//Search through all timesheets
				for (j = 0; j < timesheetData.length; j++) {

					if (timesheetData[j].ongoing == false) {

						if (employeeData[i]._id.$oid == timesheetData[j].employee.$oid) {
							temp = timesheetData[j].utc_end_time - timesheetData[j].utc_start_time;
						temp_p = temp_p + temp;
						}
					}
				}

				//Append row for timesheets username | first | Last | total hours
				var row = $('<tr id="tbl_employeeID_${employeeData[i]._id.$oid}"/>');

				row.append($('<td/>').html(employeeData[i].username));

				row.append($('<td/>').html(employeeData[i].firstname));

				row.append($('<td/>').html(employeeData[i].lastname));

				temp_p = temp_p/3600000;

				row.append($('<td/>').html(temp_p));

				$('#KTCH_TimeTable_Body').append(row);
			}
			return;
		}
		else {
			alert(`Error ${request.status}: ${request.statusText}`);
		}
	};

	// Handle on errors	
	request.error = function () {
		alert("Request Failed!");
	};

	request.send();
}

function populateOrdersHistoryTable(orderData, menuItemsData)
{
	// Open a XHR request to retrieve employee database
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	
	// Create the url to retrieve user
	var url = "/api/employees";	
	
	request.open('GET', url);
	
	// Handle on load
	request.onload = function(data) 
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{	
			employeeData = JSON.parse(request.responseText);
						
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
				
				if (orderData[i].comped)
					var row = $('<tr class="table-danger" id="tbl_orderID_${orderData[i]._id.$oid}"/>');
				else
					var row = $('<tr id="tbl_orderID_${orderData[i]._id.$oid}"/>');
				
				// Append first and last name into one variable
//				var fullname = data[i].firstname + " " + data[i].lastname;
				row.append($('<td/>').html(orderData[i].order_id));
				
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
		
				if (orderData[i].total_cost != null)
					row.append($('<td/>').html(`$${orderData[i].total_cost}`));
				else
					row.append($('<td/>').html('$0.00'));
				
				if (orderData[i].gratuity != null)				
					row.append($('<td/>').html(`$${orderData[i].gratuity}`));
				else
					row.append($('<td/>').html('$0.00'));
				
				if (orderData[i].comped)
				{
					for (j = 0; j < employeeData.length; j++)
					{
						var str = (employeeData[j]._id.$oid).toString();
						if (str === orderData[i].staff_comped._id.$oid) {
							row.append($('<td/>').html(`${employeeData[j].firstname} ${employeeData[j].lastname}`));
							j = employeeData.length;
							
						}
					}
				}								
				else
					row.append($('<td/>').html("NO"));

				
		
				$('#KTCH_OrderHistoryTable_Body').append(row);	
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
	
	request.send();	
}
//Separate function because it's very messy
// Does two XHRs to retrieve data from the database, then moves onto the BuildOrderCards
function RetrieveOrders(BuildCards, Management, Waitstaff)
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
					
					alert(`Error ${request2.status}: ${error.message}`);			
				}
				else
				{
					// Do a third XHR and retrieve employee table
					if (Management === true)
					{						
						TimeTable();
						populateOrdersHistoryTable(data.target.extraInfo, JSON.parse(request2.responseText))
						return;
					}
					
					if (Waitstaff == true)
					{
						BuildOrderCardsWaitstaff(data.target.extraInfo, JSON.parse(request2.responseText))
						BuildNotificationCards(data.target.extraInfo);
						return;
					}
				

					// Check if we are building cards or a table
					if (BuildCards === true)
						BuildOrderCards(data.target.extraInfo, JSON.parse(request2.responseText))
					else
						populateOrdersTable(data.target.extraInfo, JSON.parse(request2.responseText), Management)

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
		//If the status of an order is ready, then skip over that card
		if((orderData[i].status).toString() === "ready")
			continue;
		
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
									Order #${orderData[i].order_id}
								</div>
								<div id="updateBody"></div>
								<div class="card-footer bg-transparent border-primary">
									<button type="button" class="btn btn-success" id="btnReady_${orderData[i]._id.$oid}">Ready</button>
									<button type="button" class="btn btn-secondary" id="btnWaitstaff_${orderData[i]._id.$oid}_${orderData[i].order_id}">Call Waitstaff</button>
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
			SendOrderReadyRequest(this);
		});
			
		//Edit the button to include a function
		$(`#btnWaitstaff_${orderData[i]._id.$oid}_${orderData[i].order_id}`).click(function() {
			SendOrderCallWaitstaffRequest(this);
		});		
	}
}


function SendOrderReadyRequest(button)
{
	var splitstr = (button.id).split("_");
	
	$('#orderNotifications').find(`#orderID_${splitstr[1]}`).remove();
	
	//Create Alert
	GenerateAlertMessage('#KTCH_Alerts', "Waitstaff will be in momentarily to pick up Order #" + splitstr[1], "alert-success");
	
	//Generate XHR
	var post = new XMLHttpRequest();
	
	// Create a notification to database
	var url = "/api/notifications";
	
	var payload = {
		"order": splitstr[1],
		"meal_ready": true
	}
	
	// Open a socket to the url
	post.open('POST', url);
	
	// Handle on load
	post.onload = function(data) 
	{
		if (post.status === 200 || post.status === 201 || post.status === 204)
		{
			//Submit a second request
			var putOrders = new XMLHttpRequest();
		
			var url = "/api/orders/" + splitstr[1];
			
			var payloadOrders = {
				"status": "ready"
			}
		
			// POST to the API
			putOrders.open('PUT', url);
		
			// Handle errors
			//To Do: Alert user if errors occured, even OnLoad
			putOrders.error = function()
			{
				alert("Request Failed!");
			};
		
			// Handle on load
			putOrders.onload = function()
			{
				//Check for OK or CREATED status
				if (putOrders.status === 200 || putOrders.status === 201 || putOrders.status === 204)
				{
					//Generate XHR
					var menuPut = new XMLHttpRequest();
					
					// Open a socket to the url
					menuPut.open('PUT', "/api/orders/" + splitstr[1]);
					
					var payload = {
						"status": "ready",
						"time_modified": Date.now()
					}
					
					menuPut.onload = function()
					{
						if (post.status === 200 || post.status === 201 || post.status === 204)
							return;
						else
							alert(`Error ${request.status}: ${request.statusText}`);
					}
					
					menuPut.setRequestHeader("Content-Type", "application/json");
					menuPut.send(JSON.stringify(payload));	
				}
				else
				{
					//TODO: Create alert in HTML instead of using this to specify error
					var error = JSON.parse(putOrders.responseText)
					console.log(error.message)
		
					alert(`Error ${putOrders.status}: ${error.message}`);
				}
			};
		
			putOrders.setRequestHeader("Content-Type", "application/json");
			putOrders.send(JSON.stringify(payloadOrders));			
		}
		else
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
	};
	
	// Handle on errors	
	post.error = function() 
	{
		alert("Request Failed!");
	};
	
	post.setRequestHeader("Content-Type", "application/json");
	post.send(JSON.stringify(payload));		
}


function SendOrderCallWaitstaffRequest(button)
{
	var splitstr = (button.id).split("_");
	
	//Create Alert
	GenerateAlertMessage('#KTCH_Alerts', "Waitstaff was notified of request for Order #" + splitstr[2] + ". Stand-by.", "alert-info");
	
	//Generate XHR
	var post = new XMLHttpRequest();
	
	// Create a notification to database
	var url = "/api/notifications";
	
	var payload = {
		"order": (splitstr[1]).toString(),
		"call_waitstaff": true,
		"time_created": Date.now()
	}
	
	// Open a socket to the url
	post.open('POST', url);
	
	// Handle on load
	post.onload = function() 
	{
		if (post.status === 200 || post.status === 201 || post.status === 204)
		{
			return;
		}
		else
		{
			alert(`Error ${post.status}: ${post.statusText}`);
		}
	};
	
	// Handle on errors	
	post.error = function() 
	{
		alert("Request Failed!");
	};
	
	post.setRequestHeader("Content-Type", "application/json");
	post.send(JSON.stringify(payload));		
}

// Outside so the script calls this function repeatedly 10 seconds
setInterval(function() { RetrieveOrders(true, false, false); }, 10000);

function getCookie(cname) {


	var name = cname + "=";
	var decodedCookie = document.cookie;

	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";

}

function checkRole() {

	// Open a XHR request to retrieve employee database
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	user = getCookie("username")
	// Create the url to retrieve user
	var url = "/api/employees";

	request.open('GET', url);

	// Handle on load
	request.onload = function () {
		if (request.status === 200 || request.status === 201 || request.status === 204) {
			employeeData = JSON.parse(request.responseText);

			for (i = 0; i < employeeData.length; i++) {

				if (employeeData[i]._id.$oid == user) {
					
					if (employeeData[i].assignment == 'manager') {

						$('#last').append('<li class="list - inline - item"><a type="button" onclick="go()" class="btn btn-primary text-white"><i class="fas fa-sign-out-alt"></i>Back to Management</a></li>')
					}
					else {
						break;
					}
                }

			
			}
		}
		else {
			alert(`Error ${request.status}: ${request.statusText}`);
		}


		// Handle on errors	

	};
	request.error = function () {
		alert("Request Failed!");
	}
	request.send();
}

//
// BEGIN Event Listeners
//

// Retrieve order cards on page load
$(document).ready(function () {
	checkRole();
    RetrieveOrders(true, false, false);
});

$('#KCHN_Orders').on('shown.bs.modal', function(event)
{
    RetrieveOrders(false, false, false);
});

$('#KCHN_Orders').on('hide.bs.modal', function(event)
{
	$('#KTCH_OrderHistoryTable_Body tr td').remove();
});

$('#btn_callWaitstaff').click( function()
{
	$(this).prop('disabled', true);
	setTimeout(function(){
		$('#btn_callWaitstaff').attr('disabled', false);
	},15000);
	
	var payload = { 
	"call_waitstaff": true,
	"time_created": Date.now()
	};
	
	PostNotifications(payload);
	GenerateAlertMessage('#KTCH_Alerts', "Waitstaff has been called!", "alert-danger");


});

$('#btn_callManagement').click( function()
{
	$(this).prop('disabled', true);
	setTimeout(function(){
		$('#btn_callManagement').attr('disabled', false);
	},15000);	
	
	var payload = { 
	"call_management": true,
	"time_created": Date.now()
	};
	
	PostNotifications(payload);
	GenerateAlertMessage('#KTCH_Alerts', "Management has been called!", "alert-danger");
});

//
// END Event Listeners
//


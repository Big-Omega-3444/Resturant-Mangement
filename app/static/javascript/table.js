$(document).ready ( function(){
  window.table = {
      number: parseInt(getCookie("tablenumber")), // This will update with a cookie
      needs_help: "False", // This will update with the help button
      needs_refill: "False", // This will update with the refill button
      orders: [] // This updates when
  };
  id = "test";
  requestTables(); // Check if a table exists for our cookie's value

});

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
        return -1;

}

function scanForTable(data) {
    var found = false;

    for(i = 0; i < data.length; i++) // iterate through table list
    {
        if(data[i].number == table.number) // if we find an entry corresponding to our cookie
        {
            table.needs_help = data[i].needs_help; // set our local table object equal to the database object
			table.needs_refill = data[i].needs_refill;

			id = data[i]._id.$oid;

			for(j = 0; j < data[i].orders.length; j++) // step through orders
			{

				var order = data[i].orders[j].order.$oid;
				var orderID = {order};
				table.orders.push(orderID);
			}

            found = true;
            break;
        }
    }

    if(!found)
    {
        postNewTable(); // if a table is not found with our number, create a new one!
    }

}

// Request Help Function
function getHelp(helpVal) { 
  if (document.getElementById(helpVal).innerHTML === "Help?") {
      postNotif("help");
      document.getElementById(helpVal).innerHTML = "Your host is on the way!";
    // Alert waiter
  }

  setTimeout(function() { revertText(helpVal); }, 1000);
  function revertText(helpVal){ if(document.getElementById(helpVal)) document.getElementById(helpVal).innerHTML = "Help?"; }
}

// Refill Drink Function
function needRefill(drinkId) { 
  if (document.getElementById(drinkId).innerHTML === "Refill") {
      postNotif("refill", drinkId);
      document.getElementById(drinkId).innerHTML = "Please wait...";
    // Alert waiter
  }

  setTimeout(function() { revertText(drinkId); }, 1000);
  function revertText(drinkId){ if(document.getElementById(drinkId)) document.getElementById(drinkId).innerHTML = "Refill"; }
}

function requestTables() {
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	request.open('GET', "/api/tables");

	// Handle on load
	request.onload = function()
	{
		if (request.status != 200)
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
		else
		{
			scanForTable(JSON.parse(request.responseText)); // Look through our tables
		}
	};

	// Handle on errors
	request.error = function()
	{
		alert("Request Failed!");
	};

	request.send();
}

function postNewTable() {
    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/tables");

	// Handle errors
	//To Do: Alert user if errors occured, even OnLoad
	post.error = function()
	{
		alert("Request Failed!");
	};

	// Handle on load
	post.onload = function()
	{
		//Check for OK or CREATED status
		if (post.status === 200 || post.status === 201)
		{
		    id = JSON.parse(post.responseText);
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(table));
}

function postNotif(type, data) {
	var post = new XMLHttpRequest();

	var payload = {};
	switch(type) {
		case "refill":
			payload = {table:table.number,
						time_created: Date.now(),
						request_refill:"True",
						refill_list:[data.replace("refill","")]};
			break;
		case "help":
			payload = {table:table.number,
						time_created: Date.now(),
						request_help:"True"};
			break;
		case "cash":
			payload = {table:table.number,
						time_created: Date.now(),
						request_cash_payment:"True"};
	}

    // POST to the API
    post.open('POST', "/api/notifications");

	// Handle errors
	//To Do: Alert user if errors occured, even OnLoad
	post.error = function()
	{
		alert("Request Failed!");
	};

	// Handle on load
	post.onload = function()
	{
		//Check for OK or CREATED status
		if (!(post.status === 200 || post.status === 201))
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(payload));
}

function updateTable() {
    var put = new XMLHttpRequest();

	var url = "/api/tables/" + id;

    // POST to the API
    put.open('PUT', url);

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
		if (!(put.status === 200 || put.status === 201 || put.status === 204))
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(put.responseText)
			console.log(error.message)

			alert(`Error ${put.status}: ${error.message}`);
		}
	};

	put.setRequestHeader("Content-Type", "application/json");
    put.send(JSON.stringify(table));
}

function submitReservationForm()
{
    event.preventDefault();

    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/reservations");

	// Handle errors
	//To Do: Alert user if errors occured, even OnLoad
	post.error = function()
	{
		alert("Request Failed!");
	};

	// Handle on load
	post.onload = function()
	{
		//Check for OK or CREATED status
		if (post.status === 200 || post.status === 201)
		{
			alert("Reservation Created!"); // TODO: create waitstaff notification
			location.reload();
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("reservationForm"));
    post.send(formData);
}
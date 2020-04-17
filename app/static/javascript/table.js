$(document).ready ( function(){
  window.table = {
      number: 25, // This will update with a cookie
      needs_help: "False", // This will update with the help button
      needs_refill: "False", // This will update with the refill button
      orders: [] // This updates when
  };
  id = "test";
  requestTables(); // Check if a table exists for our cookie's value

});

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

            console.log(table);
            found = true;
            break;
        }
    }

    if(!found)
    {
        postNewTable(); // if a table is not found with our number, create a new one!
		scanForTable(data);
    }

}

// Request Help Function
function getHelp(helpVal) { 
  if (document.getElementById(helpVal).innerHTML === "Help?") {
      table.needs_help = "True";
      document.getElementById(helpVal).innerHTML = "Your host is on the way!";
    // Alert waiter
  } else {
      table.needs_help = "False";
      document.getElementById(helpVal).innerHTML = "Help?";
    // Cancel Request
  }
  updateTable();
}

// Refill Drink Function
function needRefill(drinkId) { 
  if (document.getElementById(drinkId).innerHTML === "Refill") {
      table.needs_refill = "True";
      document.getElementById(drinkId).innerHTML = "Please wait...";
    // Alert waiter
  } else {
      table.needs_refill = "False";
      document.getElementById(drinkId).innerHTML = "Refill";
    // Cancel Request
  }
  updateTable();
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
    //event.preventDefault();

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
		    console.log("Table Created");
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    console.log(JSON.stringify(table));
    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(table));
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
		if (put.status === 200 || put.status === 201 || put.status === 204)
		{
			console.log("Table Updated");
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
    put.send(JSON.stringify(table));
}
// Retrieve order cards on page load
$( document ).ready(function() {
  var request = new XMLHttpRequest();
  request.open('GET', "/api/tables");

});

function CreateTableButtons(data) {

    for(i = 0; i < data.length; i++) // iterate through table list
    {
        console.log(data.length)
    }
}

function GetTable() {
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

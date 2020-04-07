(function verifySubmission() {
	'use strict';
	window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('addEmployee');
	// Loop over them and prevent submission
	var validation = Array.prototype.filter.call(forms, function(form) {
		form.addEventListener('submit', function(event) {
			if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			}
			form.classList.add('was-validated');
			window.location.href = "#MGMT_AddEmployee";
		}, false);
		});
	}, false);
})();

// Function that does a GET request on the specified API
function requestData(url, selector)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	request.open('GET', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status != 200)
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
		else
		{
//			alert(`Done, got ${request.response.length} bytes`); // responseText is the server	
			if (selector == '#EmployeesTable')
				populateEmployeesTable(JSON.parse(request.responseText), selector)
		}
	};
	
	// Handle on errors	
	request.error = function() 
	{
		alert("Request Failed!");
	};

	request.send();	
}

// Function that builds the table in #MGMT_Employees
// data argument requires an JSON-ified data (Use JSON.Parse() before passing it in!)
function populateEmployeesTable(data, selector)
{
	// Build the table
	for(i = 0; i < data.length; i++)
	{
		var row = $('<tr/>')
		// Append first and last name into one variable
		var fullname = data[i].firstname + " " + data[i].lastname;
		row.append($('<td/>').html(fullname));

		$(selector).append(row);
	}
}

// Event listener for specific modal
// This one listens for the Employee page and executes code when opened

// Create the table once the modal is shown (after it pops up)
$('#MGMT_Employees').on('shown.bs.modal', function(event)
{
	requestData('/api/employees', '#EmployeesTable');
});

// Remove the table's elements after the model is hidden
$('#MGMT_Employees').on('hide.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
});

$('#MGMT_Reports').on('show.bs.modal', function(){
   alert("Hello World!");
});
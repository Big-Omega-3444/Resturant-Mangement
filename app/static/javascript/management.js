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
		}, false);
		});
	}, false);
})();


//On submit, post a form to the api
function SubmitForm()
{
    event.preventDefault();
	
    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/employees");
	
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
			//Close modal
			$('#MGMT_AddEmployee').modal('hide');
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)
			
			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("addEmployee"));
    post.send(formData);
}

//On submit, PUT a form to the api
//Not to be confused with SubmitForm(), which does a POST request
function SubmitFormPUT()
{
    event.preventDefault();
	
    var put = new XMLHttpRequest();
	
	var url = "/api/employees/" + $('#editEmployee').find('#userID').val();

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
			//Close modal
			$('#MGMT_EditEmployee').modal('hide');
			$('#EmployeesTable tr td').remove();
			requestData('/api/employees', '#EmployeesTable');
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(put.responseText)
			console.log(error.message)
			
			alert(`Error ${put.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("editEmployee"));
	formData.delete('uid');		//This was just so we can retrieve it again in the future (which we did)
    put.send(formData);
}

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

// Function that does a GET request on the specified API
// This grabs a specific user using the same method as the deletion function
function requestUser(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	
	// Create the url to retrieve user
	var url = "/api/users/" + object.id;	
	
	request.open('GET', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{	
			autofillEditEmployeeForm(JSON.parse(request.responseText))
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

// Sample function that deletes a user from the API
// Requires an HTML element WITH the ID filled in
// Trust me, it's stupid, but it works
function deleteUser(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the deletion url for user
	var url = "/api/users/" + object.id;
	
	// Open a socket to the url
	request.open('DELETE', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			alert("Deletion Successful!");
	        $('#EmployeesTable tr td').remove();
	        requestData('/api/employees', '#EmployeesTable');
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
		
		// Append assignment
		var assignment = $('<div class="captialOneWord"/>').html(data[i].assignment);
		row.append($('<td/>').html(assignment));
		
		//Create buttons for specific ID
		var uid = data[i]._id.$oid;
		
		var editButton = $(`<button class="btn btn-secondary" id=${uid} data-toggle="modal" href="#MGMT_EditEmployee"/>`).click(function() {
			requestUser(this);
		}).html("EDIT");

		var deleteButton = $(`<button class="btn btn-danger" id=${uid}/>`).click(function() {
			deleteUser(this);
		}).html("DEL");
		
		row.append($('<td/>').html(editButton).append(deleteButton));
		
		$(selector).append(row);
	}
}

// Simple function that autofills a selected form
// data must be in JSON format
function autofillEditEmployeeForm(data)
{
	$('#editEmployee').find('#userID').val(data._id.$oid);
	$('#editEmployee').find('#firstnameTxtBox').val(data.firstname);
	$('#editEmployee').find('#lastnameTxtBox').val(data.lastname);
	$('#editEmployee').find('#address_streetTxtBox').val(data.address_street);
	$('#editEmployee').find('#address_numberTxtBox').val(data.address_number);
	$('#editEmployee').find('#address_cityTxtBox').val(data.address_city);
	$('#editEmployee').find('#address_stateDropDown').val(data.address_state);
	$('#editEmployee').find('#address_zipTxtBox').val(data.address_zip);
	$('#editEmployee').find('#phone_numberTxtBox').val(data.phone_number);
	$('#editEmployee').find('#emailTxtBox').val(data.email);	
	$('#editEmployee').find('#assignmentDropDown').val(data.assignment);	
	$('#editEmployee').find('#usernameTxtBox').val(data.username);	
	$('#editEmployee').find('#pinTxtBox').val(data.pin);	
}


// Event listener for specific modals and other stuff
// These listens for certain events on the management page and executes code when opened

// Create the table once the modal is shown (after it pops up)
$('#MGMT_Employees').on('shown.bs.modal', function(event)
{
	requestData('/api/employees', '#EmployeesTable');
});

$('#MGMT_AddEmployee').on('hide.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
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

$('#MGMT_EditEmployee_btnSaveChanges').click( function()
{
	SubmitFormPUT();
});

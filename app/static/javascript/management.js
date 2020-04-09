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
function SubmitFormUser()
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

//On submit, post a form to the api
function SubmitFormMenu()
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

//On submit, post a form to the api
function SubmitFormIngredient()
{
    event.preventDefault();
	
    var ingpost = new XMLHttpRequest();

    // POST to the API
    ingpost.open('POST', "/api/ingredients");
	
	// Handle errors	
	//To Do: Alert user if errors occured, even OnLoad
	ingpost.error = function() 
	{
		alert("Request Failed!");
	};	
	
	// Handle on load
	ingpost.onload = function() 
	{
		//Check for OK or CREATED status
		if (ingpost.status === 200 || ingpost.status === 201 || ingpost.status === 204)
		{
			//Perform a second post
			SubmitFormInventory(JSON.parse(ingpost.responseText))
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(ingpost.responseText)
			console.log(error.message)
			
			alert(`Error ${ingpost.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("addIngredient"));
    ingpost.send(formData);
}

//On submit, post a form to the api
function SubmitFormInventory(OID)
{
    var post = new XMLHttpRequest();

    // POST to the API
    post.open("POST", "/api/inventory");
	
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
		if (post.status === 200 || post.status === 201 || post.status === 204)
		{
			updateTables();
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)
			
			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    // Manually create Form with 0 count
	var data = new FormData();
	data.append("ingredient", OID);
	data.append("count", 5);
	
    post.send(data);
}


//On submit, PUT a form to the api
//Not to be confused with SubmitForm(), which does a POST request
function SubmitFormUserPUT()
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
			updateTables();
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

// Same as above, but does it for Ingredients
function SubmitFormIngredientPUT()
{
    event.preventDefault();
	
    var put = new XMLHttpRequest();
	
	var url = "/api/ingredients/" + $('#editIngredientForm').find('#ingID').val();

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
			updateTables();
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(put.responseText)
			console.log(error.message)
			
			alert(`Error ${put.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("editIngredientForm"));
	formData.delete('uid');		//This was just so we can retrieve it again in the future (which we did)
	
	console.log(formData);	

    put.send(formData);
}

// Function that does a GET request on the specified API
// This is the primary function that does a GET on specific objects, then based on the selector variable, populates a table
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
			else if (selector == '#InventoryTable')
				populateInventoryTable(JSON.parse(request.responseText), selector)
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


// Same as above but grabs the ingredient data instead
function requestIngredient(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	
	// Create the url to retrieve user
	var url = "/api/ingredients/" + object.id;	
	
	request.open('GET', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{	
			autofillEditIngredientForm(JSON.parse(request.responseText))
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
			updateTables();
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

// Same as above function but deletes an ingredient from the API
function deleteIngredient(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the deletion url for user
	var url = "/api/ingredients/" + object.id;
	
	// Open a socket to the url
	request.open('DELETE', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			alert("Deletion Successful!");
			updateTables();
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

//
// Function that builds the table in #MGMT_Ingredients
// data argument requires an JSON-ified data (Use JSON.Parse() before passing it in!)
//
// Example of handling multiple XHR requests with extraInfo parameter!
// Plus Closures: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
//
function populateInventoryTable(data, selector)
{
	// Create our array of XMLHttpRequests
	var requests = []
	
	// Build the table
	for(i = 0; i < data.length; i++) {
		(function (i){
			requests[i] = new XMLHttpRequest();		
			
			var url = "/api/ingredients/" + data[i].ingredient.$oid;
			requests[i].open('GET', url);
	
			// Handle on load
			requests[i].onload = function(data)
			{
				if (requests[i].status === 200 || requests[i].status === 201 || requests[i].status === 204)
				{
					var row = $('<tr/>')
					var ingredient = JSON.parse(requests[i].responseText)
					
					row.append($('<td/>').html(ingredient.name));
					
					// Append assignment
					var quantity = $(`<form class="ing_update" id=${uid}/><input type="text" maxlength="4" class="form-control" id="ingredientQtyField" name="count" value="${data.target.extraInfo.count}" required>`);
					row.append($('<td/>').html(quantity));
					
					
					//Create buttons for specific ID
					var uid = ingredient._id.$oid;
					
					var editButton = $(`<button class="btn btn-secondary" id=${uid} data-toggle="modal" href="#MGMT_EditIngredient"/>`).click(function() {
						requestIngredient(this);
					}).html("EDIT");
			
					var deleteButton = $(`<button class="btn btn-danger" id=${uid}/>`).click(function() {
						deleteIngredient(this);
					}).html("DEL");
					
					row.append($('<td/>').html(editButton).append(deleteButton));
					
					$(selector).append(row);
		
					return;
				}
				else 
				{	
					alert(`Error ${requests[i].status}: ${requests[i].statusText}`);
				}
			};
		
			// Handle on errors	
			requests[i].error = function() 
			{
				alert("Request Failed!");
			};	
		
			requests[i].send();	
			requests[i].extraInfo = data[i];	
		})(i);
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

// Same as above, but autofills the ingredient page
// data must be in JSON format
function autofillEditIngredientForm(data)
{
	$('#editIngredientForm').find('#ingID').val(data._id.$oid);
	$('#editIngredientForm').find('#ingredientNameField').val(data.name);	
	$('#editIngredientForm').find('#ingredientAllergenField').val(data.allergen);	
}

// TODO: Filter for certain tables (or not)
//		 And add boolean to decide whether or not to request data from API
function updateTables()
{
	$('#EmployeesTable tr td').remove();
	requestData('/api/employees', '#EmployeesTable');	

	$('#InventoryTable tr td').remove();
	requestData('/api/inventory', '#InventoryTable');		
}

// Event listener for specific modals and other stuff
// These listens for certain events on the management page and executes code when opened

//
// BEGIN EMPLOYEE LISTENERS
//

// Create the table once the modal is shown (after it pops up)
$('#MGMT_Employees').on('shown.bs.modal', function(event)
{
	requestData('/api/employees', '#EmployeesTable');
});

$('#MGMT_AddEmployee').on('hide.bs.modal', function(event)
{
	updateTables()
});

// Remove the table's elements after the model is hidden
$('#MGMT_Employees').on('hide.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
});

$('#MGMT_Reports').on('show.bs.modal', function(){
   alert("Hello World!");
});

$('#MGMT_AddEmployee_btnSaveChanges').click( function()
{
	SubmitFormUser();
});

$('#MGMT_EditEmployee_btnSaveChanges').click( function()
{
	SubmitFormUserPUT();
});

//
// END EMPLOYEE LISTENERS
//

//
// BEGIN INGREDIENT LISTENERS
//

$('#MGMT_Inventory').on('shown.bs.modal', function(event)
{
	requestData('/api/inventory', '#InventoryTable');
});

// Remove the table's elements after the model is hidden
$('#MGMT_Inventory').on('hide.bs.modal', function(event)
{
	$('#InventoryTable tr td').remove();
});

$('#MGMT_AddIngredient_btnSaveChanges').click( function()
{
	SubmitFormIngredient();
});

$('#MGMT_EditIngredient_btnSaveChanges').click( function()
{
	SubmitFormIngredientPUT();
});

//
// END INGREDIENT LISTENERS
//

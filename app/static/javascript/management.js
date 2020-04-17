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
			$('#addIngredient').find('#ingredientNameField').val('');
			$('#addIngredient').find('#ingredientAllergenField').val(false);
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
	data.append("count", 0);

    post.send(data);
}


//On submit, post a form to the api
function SubmitFormMenuCategory()
{
    event.preventDefault();

    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/menus");

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

    var formData = new FormData(document.getElementById("addMenuCategoryForm"));
	var payload = {
		"name": formData.get('name'),
		"description": formData.get('description'),
		"drinks": false,
		"timeslots": []
	}

	var daysOfweek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var arrTimeSlots = []

	//Time Stuff
	// Gather time and push to timeslots
	for (i = 0; i < daysOfweek.length; i++)
	{
		var timeSlot = {};

		if ( formData.get(daysOfweek[i]) != null )
		{
			timeSlot['day'] = formData.get(daysOfweek[i]);
			if ( formData.get('startTime') != null )
			{
				var startTime = (formData.get('startTime')).split(":");
				timeSlot.start_hour = startTime[0];
				timeSlot.start_min = startTime[1];
			}

			if ( formData.get('endTime') != null )
			{
				var endTime = (formData.get('endTime')).split(":");
				timeSlot.end_hour = endTime[0];
				timeSlot.end_min = endTime[1];
			}
		}

		arrTimeSlots.push(timeSlot);
	}

	payload['timeslots'] = arrTimeSlots;

	// If we got null here, then don't change the value to true
	if (formData.get('drinks') != null)
		payload['drinks'] = true;

	if (formData.get('image') != "")
		payload['image'] = formData.get('image');

	console.log(payload);

	post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(payload));
}

//On submit, post a form to the api
function SubmitFormMenuItem()
{
    event.preventDefault();

    var post = new XMLHttpRequest();

	// Ingredients selection
	// Gather all ing_update and inv_update classes, we need the ids of these to push to the API
	var data = document.querySelectorAll('*[class="AMI_ing_update"]');
	var origin =  document.querySelectorAll('*[class="AMI_inv_update"]');

    // POST to the API
    post.open('POST', "/api/menuitems");

    var formData = new FormData(document.getElementById("addMenuItem"));
    var formDataHealth = new FormData(document.getElementById("addMenuItem_Health"));
//    var formDataCustomization = new FormData(document.getElementById("addMenuItem_Customization"));

	//Needs to be in JSON format, no other way around it
	var payload =
	{
		"name": formData.get('name'),
		"description": formData.get('description'),
		"cost": parseFloat(formData.get('cost')),
		"image": formData.get('image'),
		"ingredients": [],
		"calories": parseInt(formDataHealth.get('calories')),
		"allergens": []
	};

	for (i = 0; i < data.length; i++)
	{
		var value = parseInt(data[i].nextSibling.value);
		if (value > 0)
		{
			payload.ingredients.push( {"ingredient": data[i].id, "count": data[i].nextSibling.value} );
		}
	}

	//Here we go, here we go
	if ( formDataHealth.get('wheat') != null )
		payload.allergens.push(formDataHealth.get('wheat'));

	if ( formDataHealth.get('peanut') != null )
		payload.allergens.push(formDataHealth.get('peanut'));

	if ( formDataHealth.get('egg') != null )
		payload.allergens.push(formDataHealth.get('egg'));

	if ( formDataHealth.get('soy') != null )
		payload.allergens.push(formDataHealth.get('soy'));

	if ( formDataHealth.get('milk') != null )
		payload.allergens.push(formDataHealth.get('milk'));

	if ( formDataHealth.get('fish') != null )
		payload.allergens.push(formDataHealth.get('fish'));

	if ( formDataHealth.get('shellfish') != null )
		payload.allergens.push(formDataHealth.get('shellfish'));

	if ( formDataHealth.get('treenut') != null )
		payload.allergens.push(formDataHealth.get('treenut'));

	console.log(payload);

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

	post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(payload));
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


// Same as above, but does it for Menu Categories
function SubmitFormMenuCategoryPUT()
{
    event.preventDefault();

    var put = new XMLHttpRequest();

	var url = "/api/menus/" + $('#editMenuCategoryForm').find('#mcID').val();

    // POST to the API
    put.open('PUT', url);

    var formData = new FormData(document.getElementById("editMenuCategoryForm"));

	//Needs to be in JSON format, no other way around it
	var payload =
	{
		"name": formData.get('name'),
		"description": formData.get('description'),
		"drinks": false
	};

	var daysOfweek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var arrTimeSlots = []

	//Time Stuff
	// Gather time and push to timeslots
	for (i = 0; i < daysOfweek.length; i++)
	{
		var timeSlot = {};

		if ( formData.get(daysOfweek[i]) != null )
		{
			timeSlot['day'] = formData.get(daysOfweek[i]);
			if ( formData.get('startTime') != null )
			{
				var startTime = (formData.get('startTime')).split(":");
				timeSlot.start_hour = startTime[0];
				timeSlot.start_min = startTime[1];
			}

			if ( formData.get('endTime') != null )
			{
				var endTime = (formData.get('endTime')).split(":");
				timeSlot.end_hour = endTime[0];
				timeSlot.end_min = endTime[1];
			}
		}

		arrTimeSlots.push(timeSlot);
	}

	payload['timeslots'] = arrTimeSlots;

	// Not sure why but this works
	if (formData.get('drinks') != null)
		payload['drinks'] = true;

	if (formData.get('image') != "")
		payload['image'] = formData.get('image');

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
			$('#editMenuCategoryForm').find('#checkDrinks').prop("checked", false);
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

	console.log(payload);

	put.setRequestHeader("Content-Type", "application/json");
    put.send(JSON.stringify(payload));
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

    put.send(formData);
}

// Same as above, but does it for MenuItems
function SubmitFormMenuItemPUT()
{
    event.preventDefault();

    var put = new XMLHttpRequest();

	var url = "/api/menuitems/" + $('#EditMenuItemForm').find('#miID').val();

	//Gather all ing_update and inv_update classes, we need the ids of these to push to the API
	var data = document.querySelectorAll('*[class="EMI_ing_update"]');
	var origin =  document.querySelectorAll('*[class="EMI_inv_update"]');

    // POST to the API
    put.open('PUT', url);

    var formData = new FormData(document.getElementById("EditMenuItemForm"));
    var formDataHealth = new FormData(document.getElementById("editMenuItem_Health"));

	//Needs to be in JSON format, no other way around it
	var payload =
	{
		"name": formData.get('name'),
		"description": formData.get('description'),
		"cost": parseFloat(formData.get('cost')),
		"image": formData.get('image'),
		"ingredients": [],
		"calories": parseInt(formDataHealth.get('calories')),
		"allergens": []
	};

	for (i = 0; i < data.length; i++)
	{
		var value = parseInt(data[i].nextSibling.value);
		if (value > 0)
		{
			payload.ingredients.push( {"ingredient": data[i].id, "count": data[i].nextSibling.value} );
		}
	}

	//Here we go, here we go
	if ( formDataHealth.get('wheat') != null )
		payload.allergens.push(formDataHealth.get('wheat'));

	if ( formDataHealth.get('peanut') != null )
		payload.allergens.push(formDataHealth.get('peanut'));

	if ( formDataHealth.get('egg') != null )
		payload.allergens.push(formDataHealth.get('egg'));

	if ( formDataHealth.get('soy') != null )
		payload.allergens.push(formDataHealth.get('soy'));

	if ( formDataHealth.get('milk') != null )
		payload.allergens.push(formDataHealth.get('milk'));

	if ( formDataHealth.get('fish') != null )
		payload.allergens.push(formDataHealth.get('fish'));

	if ( formDataHealth.get('shellfish') != null )
		payload.allergens.push(formDataHealth.get('shellfish'));

	if ( formDataHealth.get('treenut') != null )
		payload.allergens.push(formDataHealth.get('treenut'));

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

	put.setRequestHeader("Content-Type", "application/json");
    put.send(JSON.stringify(payload));
}


// Unique function that gathers all of the new inputs from the generated forms then POSTs to the Inventory API
function SubmitFormInventoryUpdateAll()
{
	// Create our array of XMLHttpRequests
	var requests = []

	//Gather all ing_update and inv_update classes, we need the ids of these to push to the API
	var origin = document.getElementsByClassName('inv_update');

	// Build the table
	for(i = 0; i < origin.length; i++) {
		(function (i){
			requests[i] = new XMLHttpRequest();

			// Inventory ID | Ingredient ID
			var ids = origin[i].id.split("|");

			var url = "/api/inventory/" + ids[0];


			//Retrieve the ingredient form
			var object = document.getElementById(`ingQty_${ids[1]}`);

			//Generate data
			var formData = new FormData();
			formData.append("count", parseInt(object[0].value));

			requests[i].open('PUT', url);

			// Handle on load
			requests[i].onload = function()
			{
				if (requests[i].status === 200 || requests[i].status === 201 || requests[i].status === 204)
				{
					return;
				}
				else
				{
					//TODO: Create alert in HTML instead of using this to specify error
					var error = JSON.parse(requests[i].responseText)
					console.log(error.message)
					alert(`Error ${requests[i].status}: ${error.message}`);
				}
			};

			// Handle on errors
			requests[i].error = function()
			{
				alert("Request Failed!");
			};

			requests[i].send(formData);
		})(i);
	}
}

// Unique function that gathers all of the new inputs from the generated forms then POSTs to the Inventory API
function SubmitFormMenuUpdateAll(menuDatas)
{
	// Create our array of XMLHttpRequests
	var requests = []

	//Gather all classes, we need the ids of these to push to the API
	var data = document.getElementsByClassName('MenuItemCategory');

	// Build requests
	for(i = 0; i < menuDatas.length; i++) {
		//Exit out if there's no data sent in
		if (data.length == 0)
			return;

		var o = menuDatas[i];
		var p = data;
		(function (i, menuData, MIC_data){
			requests[i] = new XMLHttpRequest();

			var url = "";

			//Generate data
			var payload = {
				"items": [],
			}

			//Use Regex to remove spaces from the name parameter
			var findName = menuData.name;
			findName = findName.replace(/\s/g, '_');


			url = "/api/menus/" + menuData._id.$oid;

			//Go through each checkbox form and figure out our values that we're gonna send to the API
			for (j = 0; j < MIC_data.length; j++)
			{
				var formData = new FormData(MIC_data[j])

				if (formData.get(`${findName}`) != null)
				{
					//Split the string apart to get the menu item id that we will send
					var str = MIC_data[j].id.split("_");
					payload.items.push({"item": str[1]});
				}
			}

			console.log(payload)

			requests[i].open('PUT', url);

			// Handle on load
			requests[i].onload = function()
			{
				if (requests[i].status === 200 || requests[i].status === 201 || requests[i].status === 204)
				{
					return;
				}
				else
				{
					//TODO: Create alert in HTML instead of using this to specify error
					var error = JSON.parse(requests[i].responseText)
					console.log(error.message)
					alert(`Error ${requests[i].status}: ${error.message}`);
				}
			};

			// Handle on errors
			requests[i].error = function()
			{
				alert("Request Failed!");
			};

			requests[i].setRequestHeader("Content-Type", "application/json");
			requests[i].send(JSON.stringify(payload));
		})(i, o, p);
	}
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
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(request.responseText)
			console.log(error.message)

			alert(`Error ${request.status}: ${error.message}`);
		}
		else
		{
//			alert(`Done, got ${request.response.length} bytes`); // responseText is the server
			switch(selector)
			{
				case '#EmployeesTable':
					populateEmployeesTable(JSON.parse(request.responseText), selector)
					break;
				case '#InventoryTable':
					populateInventoryTable(JSON.parse(request.responseText), selector)
					break;
				case '#MGMT_MenuItem_InventoryTable_Body':
					populateAddMenuItems(JSON.parse(request.responseText), selector)
					break;
				case '#MGMT_EditMenuItem_InventoryTable_Body':
					populateEditMenuItems(JSON.parse(request.responseText), selector)
					break;
				case '#MGMT_AddMenuItem_IngredientSelector_InventoryTable_Body':
					populateAddMenuIngredientSelectorItems(JSON.parse(request.responseText), selector, false)
					break;
				case '#MGMT_EditMenuItem_IngredientSelector_InventoryTable_Body':
					populateEditMenuIngredientSelectorItems(JSON.parse(request.responseText), selector)
					break;
				case '#MenuCategoryTable':
				{
					var test = JSON.parse(request.responseText);
					//if (test.length == 0)
					//	$('#MGMT_Menu_btnAddMenuItem').attr('disabled', true);
					//else
						populateMenuCategoryTable(JSON.parse(request.responseText), selector);
					break;
				}
				case '#MGMT_MenuItemsTable_Body':
					populateMenuItemTable(JSON.parse(request.responseText), selector)
					break;
				case '#MGMT_DummySelector_MenuItemUpdate':
					SubmitFormMenuUpdateAll(JSON.parse(request.responseText));
					break;
				default:
					break;
			}
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


// Function that does a GET request on the specified API
// This grabs a specific user using the same method as the deletion function
function requestMenuItem(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/menuitems/" + object.id;

	request.open('GET', url);

	// Handle on load
	request.onload = function()
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			autofillEditMenuItemForm(JSON.parse(request.responseText))
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

// Function that does a GET request on the specified API
// This grabs a specific user using the same method as the deletion function
function requestMenuCategory(object, id)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve menu category
	var url = "/api/menus/" + object.id;

	request.open('GET', url);

	// Handle on load
	request.onload = function()
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			autofillEditMenuCategoryForm(JSON.parse(request.responseText))
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

	//Split id string in half
	var str = object.id.split("|")

	// Create the deletion url for user
	var url = "/api/ingredients/" + str[0];

	// Open a socket to the url
	request.open('DELETE', url);

	// Handle on load
	request.onload = function(data)
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			deleteInventory(data.target.extraInfo);
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
	request.extraInfo = str[1];

}

// Same as above function but deletes the inventory item from the API
function deleteInventory(OID)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the deletion url for user
	var url = "/api/inventory/" + OID;

	// Open a socket to the url
	request.open('DELETE', url);

	// Handle on load
	request.onload = function()
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
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
function deleteMenuCategory(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the deletion url for user
	var url = "/api/menus/" + object.id;

	// Open a socket to the url
	request.open('DELETE', url);

	// Handle on load
	request.onload = function(data)
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
function deleteMenuItem(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the deletion url for user
	var url = "/api/menuitems/" + object.id;

	// Open a socket to the url
	request.open('DELETE', url);

	// Handle on load
	request.onload = function(data)
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
					var ingredient = JSON.parse(requests[i].responseText);	//Ingredient
																			//extraInfo contains Inventory stuff

					//Create buttons for specific ID
					var uid = ingredient._id.$oid;

					var name = $(`<div class="inv_update" id=${data.target.extraInfo._id.$oid}|${uid}/>`).html(ingredient.name);

					row.append($('<td/>').html(name));

					// Append assignment
					var quantity = $(`<form id="ingQty_${uid}"><input type="number" min=0 step=1 maxlength="4" class="form-control" id="ingredientQtyField" name="count" value="${data.target.extraInfo.count}" required></form>`);
					row.append($('<td/>').html(quantity));

					var editButton = $(`<button class="btn btn-secondary" id=${uid} data-toggle="modal" href="#MGMT_EditIngredient"/>`).click(function() {
						requestIngredient(this);
					}).html("EDIT");

					var deleteButton = $(`<button class="btn btn-danger" id=${uid}|${data.target.extraInfo._id.$oid}/>`).click(function() {
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

			requests[i].extraInfo = data[i];
			requests[i].send();

		})(i);
	}
}

//Same as above but creates a table of menu categories
function populateMenuCategoryTable(data, selector)
{
	// Create our array of XMLHttpRequests
	var requests = []

	// Build the table
	for(i = 0; i < data.length; i++) {

//		if (data[i].items.length == 0)
//		{
			var row = $('<tr/>')
			var name = $(`<div class="menuCategoryTableClass" id=${data[i]._id.$oid}/>`).html(data[i].name);

			row.append($('<td/>').html(name));
			row.append($('<td/>'));

			//Create buttons for specific ID
			var uid = data[i]._id.$oid;

			var editButton = $(`<button class="btn btn-secondary" id=${uid} data-toggle="modal" href="#MGMT_EditMenuCategory"/>`).click(function() {
				requestMenuCategory(this);
			}).html("EDIT");

			var deleteButton = $(`<button class="btn btn-danger" id=${uid}/>`).click(function() {
				deleteMenuCategory(this);
			}).html("DEL");

			row.append($('<td/>').html(editButton).append(deleteButton));

			$(selector).append(row);

			continue;
//		}
//		(function (i){
//			requests[i] = new XMLHttpRequest();
//
//			// We don't have any items to request just yet, so just skip
//
//			var url = "/api/menuitems/" + data[i].items.$oid;
//			requests[i].open('GET', url);
//
//			// Handle on load
//			requests[i].onload = function(data)
//			{
//				if (requests[i].status === 200 || requests[i].status === 201 || requests[i].status === 204)
//				{
//					var row = $('<tr/>')
//					var ingredient = JSON.parse(requests[i].responseText);
//
//					var name = $(`<div class="inv_update" id=${data.target.extraInfo._id.$oid}/>`).html(ingredient.name);
//
//					row.append($('<td/>').html(name));
//
//					//Create buttons for specific ID
//					var uid = ingredient._id.$oid;
//
//					// Append assignment
//					var quantity = $(`<form class="ing_update" id=${uid}/><input type="text" maxlength="4" class="form-control" id="ingredientQtyField" name="count" value="${data.target.extraInfo.count}" required>`);
//					row.append($('<td/>').html(quantity));
//
//					var editButton = $(`<button class="btn btn-secondary" id=${uid} data-toggle="modal" href="#MGMT_EditIngredient"/>`).click(function() {
//						requestIngredient(this);
//					}).html("EDIT");
//
//					var deleteButton = $(`<button class="btn btn-danger" id=${uid}|${data.target.extraInfo._id.$oid}/>`).click(function() {
//						deleteIngredient(this);
//					}).html("DEL");
//
//					row.append($('<td/>').html(editButton).append(deleteButton));
//
//					$(selector).append(row);
//
//					return;
//				}
//				else
//				{
//					alert(`Error ${requests[i].status}: ${requests[i].statusText}`);
//				}
//			};
//
//			// Handle on errors
//			requests[i].error = function()
//			{
//				alert("Request Failed!");
//			};
//
//			requests[i].send();
//			requests[i].extraInfo = data[i];
//		})(i);
	}
}


//Same as above but creates a table of
function populateMenuItemTable(menuItemsData, selector)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the url to retrieve user
	var url = "/api/menus";

	request.open('GET', url);

	// Handle on load
	request.onload = function(data)
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			menuCategory = JSON.parse(request.responseText);
			menuItems = data.target.extraInfo;

			// Build the table
			for(i = 0; i < menuItems.length; i++)
			{
				var row = $('<tr/>')

				//Build media object
				var media = $('<div class="media"/>');
				media.append($(`<img width="64" height="64" class="mr-3 d-none d-lg-block d-xl-block" src="${menuItems[i].image}" alt="${menuItems[i].name}"/>`));
				media.append($(`<div class="media-body"><h5 class="mt-0"> ${menuItems[i].name}</h5><p>${menuItems[i].description}</p></div>`));

				// Menu Item name
				row.append($('<td/>').html(media));

				// Menu Item cost
				row.append($('<td/>').html(menuItems[i].cost));

				//Create buttons for specific ID
				var uid = ""
				uid = menuItems[i]._id.$oid;

				// Do a shallow copy of the options and tie a unique id to the elements
				var checkboxes = $(`<form class="MenuItemCategory" id="MenuItemCat_${uid}"/>`);

				//Build input selector tied to the menu item's ID
				var options = [];

				// We need to gather which menu categories holds our item
				var find = [];

				// Build the menu items category checkboxes
				for (j = 0; j < menuCategory.length; j++)
				{
					options[j] = $('<div class="form-group row"/>');
					//Use Regex to remove spaces from the name parameter
					var inputName = menuCategory[j].name;
					inputName = inputName.replace(/\s/g, '_');
					//Tie the menu category ID to the value
					options[j].append($(`<div class="form-check"><input type="checkbox" id="CAT_${inputName}_${uid}" name="${inputName}" value="${menuCategory[j]._id.$oid}"><label class="form-check-label" for="CAT_${menuCategory[j].name}_${uid}">${menuCategory[j].name}</label></div>`));
				}

				// Handle case if there is no menus that exist (if we end up at this point)
				if (menuCategory.length == 0)
				{
					var cosmeticOption = $(`<input type="checkbox" id="" value="none"/>`).html("None");
					cosmeticOption.attr('disabled', true)
					options[j].append(cosmeticOption);
				}

				checkboxes.append(options);

				row.append($('<td/>').html(checkboxes));

				var editButton = $(`<button class="btn btn-secondary" id=${uid} data-toggle="modal" href="#MGMT_EditMenuItem"/>`).click(function() {
					requestMenuItem(this);
				}).html("EDIT");

				var deleteButton = $(`<button class="btn btn-danger" id=${uid}/>`).click(function() {
					deleteMenuItem(this);
				}).html("DEL");

				row.append($('<td/>').html(editButton).append(deleteButton));

				$(selector).append(row);

				//We need to enable the checkboxes now that they exist
				for (j = 0; j < menuCategory.length; j++)
				{
					for (k = 0; k < menuCategory[j].items.length; k++)
					{
						if (menuCategory[j].items[k].item.$oid == uid)
						{
							//Use Regex to remove spaces from the name parameter
							var inputName = menuCategory[j].name;
							inputName = inputName.replace(/\s/g, '_');

							$(`#MenuItemCat_${uid}`).find(`#CAT_${inputName}_${uid}`).prop("checked", true);
						}
					}
				}
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
	request.extraInfo = menuItemsData;
}

function populateAddMenuItems(data, selector)
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
					var row = $('<tr/><div class="addScrollbar"/>')
					var ingredient = JSON.parse(requests[i].responseText);

					var name = $(`<div class="AMI_inv_update" id=${data.target.extraInfo._id.$oid}/>`).html(ingredient.name);

					row.append($('<td/>').html(name));

					//Create buttons for specific ID
					var uid = ingredient._id.$oid;

					// Append assignment
					var quantity = $(`<form class="AMI_ing_update" id=${uid}/><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="0" required>`);
					row.append($('<td/>').html(quantity));

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

function populateEditMenuItems(data, selector)
{
	// Create our array of XMLHttpRequests
	var requests = []

	// Build the table
	for(i = 0; i < data.ingredients.length; i++) {
		(function (i){
			requests[i] = new XMLHttpRequest();

			var url = "/api/ingredients/" + data.ingredients[i].ingredient.$oid;
			requests[i].open('GET', url);

			// Handle on load
			requests[i].onload = function(data)
			{
				if (requests[i].status === 200 || requests[i].status === 201 || requests[i].status === 204)
				{
					var row = $('<tr/><div class="addScrollbar"/>')
					var ingredient = JSON.parse(requests[i].responseText);

					// For inventory items
					var name = $(`<div class="EMI_inv_update" id=${data.target.extraInfo.ingredient.$oid}/>`).html(ingredient.name);

					row.append($('<td/>').html(name));

					//Create buttons for specific ID
					var uid = ingredient._id.$oid;

					var count = parseInt(data.target.extraInfo.count);

					// For ingredients
					var quantity = $(`<form class="EMI_ing_update" id=${uid}/><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${count}" readonly>`);
					row.append($('<td/>').html(quantity));

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
			requests[i].extraInfo = data.ingredients[i];
		})(i);
	}
}


function populateAddMenuIngredientSelectorItems(data, selector, edit)
{
	// Create our array of XMLHttpRequests
	var requests = []

	if (edit === false)
	{
		//Scrub the data and change the counts to 0
		for (i = 0; i < data.length; i++)
		{
			data[i].count = 0;
		}
	}

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
					var row = $('<tr/><div class="addScrollbar"/>')
					var ingredient = JSON.parse(requests[i].responseText);

					var name;
					if (edit === true)
						name = $(`<div class="EMI_IS_inv_update" id=${data.target.extraInfo._id.$oid}/>`).html(ingredient.name);
					else
						name = $(`<div class="AMI_IS_inv_update" id=${data.target.extraInfo._id.$oid}/>`).html(ingredient.name);


					row.append($('<td/>').html(name));

					//Create buttons for specific ID
					var uid = ingredient._id.$oid;

					// Append assignment
					var quantity;
					if (edit === true)
						quantity = $(`<form class="EMI_IS_ing_update" id=${uid}/><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${data.target.extraInfo.count}" required>`);
					else
						quantity = $(`<form class="AMI_IS_ing_update" id=${uid}/><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${data.target.extraInfo.count}" required>`);

					row.append($('<td/>').html(quantity));

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


function populateEditMenuIngredientSelectorItems(data, selector)
{

	var ingdata = document.querySelectorAll('*[class="EMI_ing_update"]');

	//We want to grab the data we got and modify it before populating the table
	for (i = 0; i < data.length; i++)
	{
		for (j = 0; j < ingdata.length; j++)
		{
			//Different data types, so we need to convert both to strings
			var str1 = (data[i].ingredient.$oid).toString();
			var str2 = (ingdata[j].id).toString();
			if (str1 === str2)
			{
				data[i].count = parseInt(ingdata[j].nextSibling.value);
				i++;
				j = 0;
			}
			else
				data[i].count = 0;
		}
	}

	populateAddMenuIngredientSelectorItems(data, selector, true)
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
	$('#editIngredientForm').find('#ingredientAllergenField').prop("checked", data.allergen);
}

// Same as above, but autofills the ingredient page
// data must be in JSON format
function autofillEditMenuCategoryForm(data)
{
	$('#editMenuCategoryForm').find('#mcID').val(data._id.$oid);
	$('#editMenuCategoryForm').find('#MC_name').val(data.name);
	$('#editMenuCategoryForm').find('#MC_desc').val(data.description);
	$('#editMenuCategoryForm').find('#MC_imageURL').val(data.image);
	$('#editMenuCategoryForm').find('#checkDrinks').prop("checked", data.drinks);

	var timeSet = false;
	if (data.timeslots.length == 0)
	{
		$('#editMenuCategoryForm').find('#MC_EDIT_startTime').val("--:--:--");
		$('#editMenuCategoryForm').find('#MC_EDIT_endTime').val("--:--:--");

		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Sun').prop("checked", false);
		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Mon').prop("checked", false);
		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Tue').prop("checked", false);
		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Wed').prop("checked", false);
		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Thu').prop("checked", false);
		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Fri').prop("checked", false);
		$('#editMenuCategoryForm').find('#MC_EDIT_Day_Sat').prop("checked", false);
	}

	for (i = 0; i < data.timeslots.length; i++)
	{
		if ( data.timeslots[i].day != null )
		{
			if (timeSet === false)
			{
				var hours		= (data.timeslots[i].start_hour < 10) ? "0" + data.timeslots[i].start_hour : data.timeslots[i].start_hour;
				var minutes		= (data.timeslots[i].start_min < 10) ? "0" + data.timeslots[i].start_min : data.timeslots[i].start_min;
				var startTime 	= hours + ":" + minutes + ":00";
				$('#editMenuCategoryForm').find('#MC_EDIT_startTime').val(startTime.toString());

				hours			= (data.timeslots[i].end_hour < 10) ? "0" + data.timeslots[i].end_hour : data.timeslots[i].end_hour;
				minutes			= (data.timeslots[i].end_min < 10) ? "0" + data.timeslots[i].end_min : data.timeslots[i].end_min;
				var endTime		= hours + ":" + minutes + ":00";
				$('#editMenuCategoryForm').find('#MC_EDIT_endTime').val(endTime.toString());

				timeSet = true;
			}

			switch (data.timeslots[i].day)
			{
				case "Su":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Sun').prop("checked", true);
					break;
				case "M":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Mon').prop("checked", true);
					break;
				case "Tu":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Tue').prop("checked", true);
					break;
				case "W":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Wed').prop("checked", true);
					break;
				case "Th":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Thu').prop("checked", true);
					break;
				case "F":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Fri').prop("checked", true);
					break;
				case "Sa":
					$('#editMenuCategoryForm').find('#MC_EDIT_Day_Sat').prop("checked", true);
					break;
				default:
					break;
			}

		}
	}

}

// Same as above, but autofills the ingredient page
// data must be in JSON format
function autofillEditMenuItemForm(data)
{
	$('#EditMenuItemForm').find('#miID').val(data._id.$oid);
	$('#EditMenuItemForm').find('#MI_name').val(data.name);
	$('#EditMenuItemForm').find('#MI_cost').val(data.cost);
	$('#EditMenuItemForm').find('#MI_desc').val(data.description);
	$('#EditMenuItemForm').find('#imageURL').val(data.image);

	$('#editMenuItem_Health').find('#MI_calories').val(data.calories);

	for (i = 0; i < data.allergens.length; i++)
	{
		switch (data.allergens[i])
		{
			case "wheat":
				$('#editMenuItem_Health').find('#MI_wheat').prop("checked", true);
				break;
			case "peanut":
				$('#editMenuItem_Health').find('#MI_peanut').prop("checked", true);
				break;
			case "egg":
				$('#editMenuItem_Health').find('#MI_egg').prop("checked", true);
				break;
			case "soy":
				$('#editMenuItem_Health').find('#MI_soy').prop("checked", true);
				break;
			case "milk":
				$('#editMenuItem_Health').find('#MI_milk').prop("checked", true);
				break;
			case "fish":
				$('#editMenuItem_Health').find('#MI_fish').prop("checked", true);
				break;
			case "shellfish":
				$('#editMenuItem_Health').find('#MI_shellfish').prop("checked", true);
				break;
			case "treenut":
				$('#editMenuItem_Health').find('#MI_treenut').prop("checked", true);
				break;
		}
	}


//	$('#editMenuItem_Customization').find('#imageURL').val(data.image);

	populateEditMenuItems(data, '#MGMT_EditMenuItem_InventoryTable_Body');
}

// TODO: Filter for certain tables (or not)
//		 And add boolean to decide whether or not to request data from API
function updateTables()
{
	$('#EmployeesTable tr td').remove();
	requestData('/api/employees', '#EmployeesTable');

	$('#InventoryTable tr td').remove();
	requestData('/api/inventory', '#InventoryTable');

	$('#MenuCategoryTable tr td').remove();
	requestData('/api/menus', '#MenuCategoryTable');

	$('#MGMT_MenuItemsTable_Body tr td').remove();
	requestData('/api/menuitems', '#MGMT_MenuItemsTable_Body');
}

function UpdateAlerts()
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
			for (i = 0; i < notifs.length; i++)
			{
				if (notifs[i].call_management === true)
				{
					//Create Alert
					GenerateAlertMessage('#MGMT_Alerts',`<strong>ALERT!</strong> Kitchen called for help!`, "alert-danger", `${notifs[i]._id.$oid}`);
				}
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

setInterval(UpdateAlerts, 5000)

//Taken from JSFunctions but made specifically for Inventory Table
$(document).ready(function(){
  $("#MGMT_Inventory_Search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#InventoryTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

//Taken from JSFunctions but made specifically for Employee Table
$(document).ready(function(){
  $("#MGMT_Employees_Search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#EmployeesTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

function SaveChangesIS (selector, edit)
{
	//Gather all ing_update and inv_update classes, we need the ids of these to push to the API
	var data = []
	var origin = []
	if (edit === true)
	{
		data = document.querySelectorAll('*[class="EMI_IS_ing_update"]');		//Quantity
		origin =  document.querySelectorAll('*[class="EMI_IS_inv_update"]');	//Names
	}
	else
	{
		data = document.querySelectorAll('*[class="AMI_IS_ing_update"]');		//Quantity
		origin =  document.querySelectorAll('*[class="AMI_IS_inv_update"]');	//Names
	}

	for (i = 0; i < data.length; i++)
	{
		var value = parseInt(data[i].nextSibling.value);

		// Skip over any values that are less than or equal to 0
		if (value <= 0)
			continue;

		//Construct the table for the Add
		var row = $('<tr/>')
		var name;
		if (edit)
			name = $(`<div class="EMI_inv_update" id=${origin[i].id}/>`).html(origin[i].innerHTML);
		else
			name = $(`<div class="AMI_inv_update" id=${origin[i].id}/>`).html(origin[i].innerHTML);

		row.append($('<td/>').html(name));

		var quantity;
		if (edit)
			quantity = $(`<form class="EMI_ing_update" id=${data[i].id}/><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${value}" readonly>`);
		else
			quantity = $(`<form class="AMI_ing_update" id=${data[i].id}/><input type="number" min=0 step=1 maxlength="4" class="form-control" name="count" value="${value}" readonly>`);

		row.append($('<td/>').html(quantity));

		$(selector).append(row);
	}
}

// Helper functions
// Uses jquery to target a specific cell, and replaces the contents of that cell
function replaceCellContent(selector, find, cell, replace)
{
	$(`${selector} td:contains('${find}')`).eq(cell).hmtl(replace);
}



// Event listener for specific modals and other stuff
// These listens for certain events on the management page and executes code when opened

//
// BEGIN EMPLOYEE LISTENERS
//

// Create the table once the modal is shown (after it pops up)
$('#MGMT_Employees').on('shown.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
	requestData('/api/employees', '#EmployeesTable');
});

$('#MGMT_AddEmployee').on('hide.bs.modal', function(event)
{
	updateTables();
});

// Remove the table's elements after the model is hidden
$('#MGMT_Employees').on('hide.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
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
// BEGIN REPORT LISTENERS
//

$('#MGMT_Reports').on('show.bs.modal', function(){
	//Create chart
	createChart("Day");
    RetrieveOrders(false, true);
});

$('#MGMT_Reports').on('hide.bs.modal', function(event)
{
	$('#KTCH_OrderHistoryTable_Body tr td').remove();
});


$('#chartDay').click(function (){

	var time = document.getElementById("chartDay").value

	createChart(time);
});

$('#chartWeek').click(function () {

	var time = document.getElementById("chartWeek").value

	createChart(time);
});

$('#chartMonth').click(function () {

	var time = document.getElementById("chartMonth").value

	createChart(time);
});

$('#chartYear').click(function () {

	var time = document.getElementById("chartYear").value

	createChart(time);

});

$('#chartDecade').click(function () {

	var time = document.getElementById("chartDecade").value
	createChart(time);
});

function createChart(pick) {


	var title_text = pick;
	var requests = new XMLHttpRequest();

	requests.open('GET', "/api/orders");

	var i,t; //for loop variables, re-used


	requests.onload = function () {

		if (requests.status === 200 || requests.status === 201 || requests.status === 204) {
			var myChart = document.getElementById('myChart').getContext('2d'); //was let instead of var

			var orders = JSON.parse(requests.responseText);
			var date_temp = new Date();
			var current_date;

			//Calculating this Days orders
			if (pick == "Day") {

				current_date = new Date();
				var data_arr = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
				var labels_arr = new Array("00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00");

				for (t = 0; t < labels_arr.length; t++) {

					for (i = 0; i < orders.length; i++) {
						date_temp = new Date(orders[i].time_ordered * 1000);

						if (date_temp.toDateString() == current_date.toDateString()) {
							if (t == date_temp.getHours()) {

								data_arr[t] = data_arr[t] + orders[i].total_cost;

							}
						}
					}
				}

			}

			//Calculating this Weeks orders
			else if (pick == "Week") {
				current_date = new Date();

				var day_temp = current_date.getDay();
				var temp = current_date.valueOf() - (86400000 * day_temp);
				var first_sun = new Date(temp);
				//alert(first_sun);

				var data_arr = new Array(0,0,0,0,0,0,0);
				var labels_arr = new Array('Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

				for (t = 0; t < labels_arr.length; t++) {

					for (i = 0; i < orders.length; i++) {
						date_temp = new Date(orders[i].time_ordered * 1000);
						if (first_sun.toDateString() == date_temp.toDateString()) {
							data_arr[t] = data_arr[t] + orders[i].total_cost;

						}

					}
					temp = first_sun.valueOf() + 86400000;
					first_sun = new Date(temp);

				}

			}

			//Calculating this Months orders
			else if (pick == "Month") {
				current_date = new Date();
				var month = current_date.getMonth();

				var month30th = new Array(3, 5, 8, 10);
				var month31th = new Array(0, 2, 4, 6, 7, 9, 11);

				//Set labels and size of data array equal to that months
				if (-1 != month30th.indexOf(month)) {
					var labels_arr = new Array('1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th');
					var data_arr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
				}
				else if (-1 != month31th.indexOf(month)) {
					var labels_arr = new Array('1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31th');
					var data_arr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
				}
				else {
					var labels_arr = new Array('1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th');
					var data_arr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                }

				for (t = 0; t < labels_arr.length; t++) {
					for (i = 0; i < orders.length; i++) {
						date_temp = new Date(orders[i].time_ordered * 1000);
						if (date_temp.getFullYear() == current_date.getFullYear()) {
							if (date_temp.getMonth() == current_date.getMonth()) {
								if ((t + 1) == date_temp.getDate()) {

									data_arr[t] = data_arr[t] + orders[i].total_cost;
								}
							}
						}
                    }

				}

			}

			//Calculating past Years orders
			else if (pick == "Year") {
				var labels_arr = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
				var data_arr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
				current_date = new Date();

				for (t = 0; t < labels_arr.length; t++) {
					for (i = 0; i < orders.length; i++) {
						date_temp = new Date(orders[i].time_ordered * 1000);
						if (date_temp.getFullYear() == current_date.getFullYear()) {
							if (t == date_temp.getMonth()) {
								data_arr[t] = data_arr[t] + orders[i].total_cost;
							}
						}
					}
				}
            }

			//Calculating past Decades orders
			else if (pick == "Decade") {

				current_date = new Date();

				var labels_arr = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
				var data_arr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
				var year_temp = current_date.getFullYear();
				var iter_arr;


				for (iter_arr = 0; iter_arr < 10; iter_arr++) {

					labels_arr[9-iter_arr] = year_temp - iter_arr;

                }

				var temp = current_date.valueOf() - (31556952000 * 9);
				var first_year = new Date(temp);

				for (t = 0; t < labels_arr.length; t++) {
					for (i = 0; i < orders.length; i++) {
						date_temp = new Date(orders[i].time_ordered * 1000);

						if (first_year.getFullYear() == date_temp.getFullYear()) {
							data_arr[t] = data_arr[t] + orders[i].total_cost;

						}

					}
					temp = first_year.valueOf() + 31556952000;
					first_year = new Date(temp);

				}
			}


		}
		else {
			alert(`Error ${requests.status}: ${requests.statusText}`);
		}

		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';

		//fixes hovering issue by destroying previous chart
		if (window.stuff != undefined) {
			window.stuff.destroy();
		}
		//create chart based on calculated data
		window.stuff = new Chart(myChart, {
			type: 'line',
			data: {
				labels: labels_arr,
				datasets: [{
					label: 'Sales', data: data_arr, borderColor: "#3e95cd", fill: false, yAxisID: 'y-axis-1'

				}]
			},
			options: {
				scales: {
					yAxes: [
						{
							id: 'y-axis-1',
							type: 'linear',
							display: true,
							position: 'left',
							ticks: {
								beginAtZero: true
							}
						}
					]
				},
				title: {
					display: true,
					text: title_text + " Sales",
					fontSize: 25
				},
				legend: {
					display: true,
					position: 'right',
					labels: {
						fontColor: '#000'
					}
				},
				layout: {
					padding: {
						left: 50,
						right: 0,
						bottom: 0,
						top: 0
					}
				}
			}
		});
		Chart.scaleService.updateScaleDefaults('linear', {
			ticks: {
				min: 0
			}
		});
    }




		/*// Global Options
		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';
		let massPopChart = new Chart(myChart, {
			type: 'line',
			data: {
				labels: labels_arr,
				datasets: [{
					label: 'Sales', data: data_arr, borderColor: "#3e95cd", fill: false

				}]
			},
			options: {

				title: {
					display: true,
					text: title_text + " Sales",
					fontSize: 25
				},
				legend: {
					display: true,
					position: 'right',
					labels: {
						fontColor: '#000'
					}
				},
				layout: {
					padding: {
						left: 50,
						right: 0,
						bottom: 0,
						top: 0
					}
				},
				tooltips: {
					enabled: true
				}
			}
		});*/
	requests.send()
}

//
// EMD REPORT LISTENERS
//

//
// BEGIN MENU LISTENERS
//

$('#MGMT_AddMenuItem_btnSaveChanges').click( function()
{
	SubmitFormMenuItem();
});

$('#MGMT_AddMenuCategory_btnSaveChanges').click( function()
{
	SubmitFormMenuCategory();
});

$('#MGMT_AddMenuItem_IngredientSelector').on('show.bs.modal', function(){
	requestData('/api/inventory', '#MGMT_AddMenuItem_IngredientSelector_InventoryTable_Body');
});

$('#MGMT_EditMenuItem_IngredientSelector').on('show.bs.modal', function(){
	requestData('/api/inventory', '#MGMT_EditMenuItem_IngredientSelector_InventoryTable_Body');
});

$('#MGMT_AddMenuItem_IngredientSelector').on('hide.bs.modal', function(){
	$('#MGMT_AddMenuItem_IngredientSelector_InventoryTable_Body tr td').remove();
});

$('#MGMT_EditMenuItem_IngredientSelector').on('hide.bs.modal', function(){
	$('#MGMT_EditMenuItem_IngredientSelector_InventoryTable_Body tr td').remove();
});

$('#MGMT_AddMenuItem').on('show.bs.modal', function(event)
{
	$('#MGMT_MenuItem_InventoryTable_Body tr td').remove();
});

$('#MGMT_EditMenuItem').on('show.bs.modal', function(event)
{
	$('#MGMT_EditMenuItem_InventoryTable_Body tr td').remove();
});

$('#MGMT_AddMenuItem_IS_btnSaveChanges').click( function()
{
	$('#MGMT_MenuItem_InventoryTable_Body tr td').remove();
	SaveChangesIS('#MGMT_MenuItem_InventoryTable_Body', false);
	$('#MGMT_AddMenuItem_IngredientSelector_InventoryTable_Body tr td').remove();
});

$('#MGMT_EditMenuItem_btnSaveChanges').click( function()
{
	SubmitFormMenuItemPUT();
});

$('#MGMT_EditMenuCategory_btnSaveChanges').click( function()
{
	SubmitFormMenuCategoryPUT();
});

$('#MGMT_EditMenuItem_IS_btnSaveChanges').click( function()
{
	$('#MGMT_EditMenuItem_InventoryTable_Body tr td').remove();
	SaveChangesIS('#MGMT_EditMenuItem_InventoryTable_Body', true);
});

// This menu cannot have it's table destroyed after it is hidden,
// as it would be too late to update some of it's elements to the server
$('#MGMT_Menu').on('show.bs.modal', function(event)
{
	$('#MenuCategoryTable tr td').remove();
	$('#MGMT_MenuItemsTable_Body tr td').remove();
	requestData('/api/menus', '#MenuCategoryTable');
	requestData('/api/menuitems', '#MGMT_MenuItemsTable_Body');
});

$('#MGMT_Menu_btnSaveChanges1').click( function()
{
	requestData('/api/menus', '#MGMT_DummySelector_MenuItemUpdate');
});

$('#MGMT_Menu_btnSaveChanges2').click( function()
{
	requestData('/api/menus', '#MGMT_DummySelector_MenuItemUpdate');
});


//
// END MENU LISTENERS
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

// We need this here so we don't lose changes we've made to the inventory
$('#MGMT_Inventory_btnAddIngredient').click( function()
{
	SubmitFormInventoryUpdateAll();
	updateTables();
});


$('#MGMT_AddIngredient_btnSaveChanges').click( function()
{
	SubmitFormIngredient();
});

$('#MGMT_EditIngredient_btnSaveChanges').click( function()
{
	SubmitFormIngredientPUT();
});

$('#MGMT_Inventory_btnSaveChanges').click( function()
{
	SubmitFormInventoryUpdateAll();
});

//
// END INGREDIENT LISTENERS
//

//
// Deny All forms from triggering something when pressing enter
//
//Taken from JSFunctions but made specifically for Employee Table
$(document).ready(function(){
  $(window).on("keydown", function(event) {
	if (event.keyCode == 13) {
		event.preventDefault();
	}
  });
});

/*TODO:
   Substitutions?
*/

function checkIfActive(data)
{
	var active = true;


	if(!data[i].ignore_timeslots) // if this menu is time dependent
	{
		var today = new Date();

		switch(today.getDay()) // Check the day of the week
		{
			case 0: if(data[i].timeslots[0].day === 'Su')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // Su
			case 1: if(data[i].timeslots[1].day === 'M')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // M
			case 2: if(data[i].timeslots[2].day === 'Tu')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // Tu
			case 3: if(data[i].timeslots[3].day === 'W')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // W
			case 4: if(data[i].timeslots[4].day === 'Th')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // Th
			case 5: if(data[i].timeslots[5].day === 'F')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // F
			case 6: if(data[i].timeslots[6].day === 'Sa')
			{
				if(!(today.getHours() >= data[i].timeslots[0].start_hour && today.getHours() < data[i].timeslots[0].end_hour || today.getHours() >= data[i].timeslots[0].start_hour && data[i].timeslots[0].end_hour == 0)) //if current hour is NOT between start and end
					active = false;
			} else active = false; break; // Sa
			default: active = false; break;
		}
	}

	return active;
}

//Creates Tabs for food menu
function populateFoodTabs(data, selector)
{
	var first = true;
	//populate Food
	for(i = 0; i < data.length; i++)
	{
		// check if the menu is for drinks or not
		if(data[i].drinks)
			continue;

		if(!checkIfActive(data)) // returns true if active
			continue;

		var tab = $('<li class="nav-item"/>')

		var tabName = data[i].name;
		var refName = tabName.replace(/ |\!|\?/g, "_");
		if (first){
			tab.append($(`<a href="${"#" + refName}" data-toggle="tab" class="nav-link active"/>`).html(tabName));
			first = false;
		} else {
			tab.append($(`<a href="${"#" + refName}" data-toggle="tab" class="nav-link"/>`).html(tabName));
		}

		$(selector).append(tab);
	}
}

//Creates the Pane on which the cards will display
function populateFoodPane(data, selector)
{
	var first = true;
	for(i = 0; i < data.length; i++) // iterate through menus
	{
		// check if the menu is for drinks or not
		if(data[i].drinks)
			continue;

		if(!checkIfActive(data)) // returns true if active
			continue;


		var pane;
		var tabName = data[i].name;
		var refName = tabName.replace(/ /g, "_")

		if (first){ // first food tab gets the active pane
			pane = $(`<div role="tabpanel" class="tab-pane active" id="${refName}"/>`);
			first = false;
		} else {
			pane = $(`<div role="tabpanel" class="tab-pane" id="${refName}"/>`);
		}
		row = $('<div class="row"/>')
		pane.append(row);

		// append our pane and request our cards
		$(selector).append(pane);
		for(j=0; j < data[i].items.length; j++)
		{
			var itemID = data[i].items[j].item.$oid;
			var url = "/api/menuitems/" + itemID;

			requestData(url, "#"+refName, "fooditem");
		}
	}
}

//Creates the Cards for our menu items
function populateFoodCards(menuItem, selector)
{
	//populate food pane with items

	var allergenTemplate = "";

	if(menuItem.allergens.length > 0) // create our allergens list, if need be
	{
		allergenTemplate = 	`<div class="container">
									  <ul class="list-group">
										<li class="list-group-item list-group-item-danger" style="padding-top: 0.25rem;padding-bottom: 0.25rem">Allergens</li>`;

		for(i = 0; i < menuItem.allergens.length; i++)
		{
			allergenTemplate += `<li class="list-group-item list-group-item-warning" style="padding-top: 0.0rem;padding-bottom: 0.0rem">${menuItem.allergens[i]}</li>`
		}

		allergenTemplate += `</ul>
						</div>`;
	}

	//Card Template
	const cardTemplate = `<div id=${menuItem.name.replace(/ |\!|\?/g,"_")} class="col-sm-4 d-flex align-items-stretch">
							<div class="card-container manual-flip">
								<div class="card">
									<div class="front">
										<div class="content">
											<div class="main">
												<img class="card-img-top img-fluid" src=${menuItem.image} style="width:50%">
												<div class="card-body">
													<h4 class="card-title">${menuItem.name} | <strong style="color:darkgreen; font-style:oblique"> $${menuItem.cost.toFixed(2)}</strong></h4>
													<p class="card-text">${menuItem.description}</p>
													<button type="button" id='${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"btn"}' onclick="addItemToOrder('${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"btn"}','${menuItem._id.$oid}')" class="btn btn-primary">Order</button>
												</div>
											</div>
											<div class="footer">
												<button class="btn btn-simple" onclick="rotateCard(this)">
													<i class="fas fa-info-circle"></i> Health Facts
												</button>
											</div>
										</div>
									</div>
									<div class="back">
										<div class="header">
											<h5 class="card-title">${menuItem.name}</h5>
										</div>
										<div class="content">
											<div class="main">`
												+ allergenTemplate +
												`<p class="text-center" id=${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"ing"}></p>
												<div class="stats-container" style="margin-top: 0px">
													<div class="stats"><h4></h4><p></p></div>
													<div class="stats"><h4>Calories</h4><p>${menuItem.calories}</p></div>
													<div class="stats"><h4></h4><p></p></div>
												</div>
											</div>
										</div>
										<div class="footer">
												<button type="button" class="btn btn-light" onclick="healthFacts(this)">
													<i class="fas fa-backward"></i> Back
												</button>
										</div>
									</div>
								</div>
							</div>
						</div>`;

	//append our template to the pane
	$(selector).find('div.row').append(cardTemplate);


	for (k = 0; k < menuItem.ingredients.length; k++) {
		var ingID = menuItem.ingredients[k].ingredient.$oid;
		var url = "/api/ingredients/" + ingID;

		requestData(url, selector+menuItem.name.replace(/ |\!|\?/g,"_")+"ing", "ingredient");
	}
}


//Creates Tabs for food menu
function populateDrinkTabs(data, selector)
{
	var first = true;
	//populate Food
	for(i = 0; i < data.length; i++)
	{
		// check if the menu is for drinks or not
		if(!data[i].drinks)
			continue;

		if(!checkIfActive(data)) // returns true if active
			continue;

		var tab = $('<li class="nav-item"/>')

		var tabName = data[i].name;
		var refName = tabName.replace(/ /g, "_");
		if (first){
			tab.append($(`<a href="${"#" + refName}" data-toggle="tab" class="nav-link active"/>`).html(tabName));
			first = false;
		} else {
			tab.append($(`<a href="${"#" + refName}" data-toggle="tab" class="nav-link"/>`).html(tabName));
		}

		$(selector).append(tab);
	}
}

//Creates the Pane on which the cards will display
function populateDrinkPane(data, selector)
{
	var first = true;
	for(i = 0; i < data.length; i++) // iterate through menus
	{
		// check if the menu is for drinks or not
		if(!data[i].drinks)
			continue;

		if(!checkIfActive(data)) // returns true if active
			continue;


		var pane;
		var tabName = data[i].name;
		var refName = tabName.replace(/ |\!|\?/g, "_");

		if (first){ // first drink tab gets the active pane
			pane = $(`<div role="tabpanel" class="tab-pane active" id="${refName}"/>`);
			first = false;
		} else {
			pane = $(`<div role="tabpanel" class="tab-pane" id="${refName}"/>`);
		}
		row = $('<div class="row"/>')
		pane.append(row);

		// append our pane and request our cards
		$(selector).append(pane);
		for(j=0; j < data[i].items.length; j++)
		{
			var itemID = data[i].items[j].item.$oid;
			var url = "/api/menuitems/" + itemID;

			requestData(url, "#"+refName, "drinkitem");
		}
	}
}

//Creates the Cards for our menu items
function populateDrinkCards(menuItem, selector)
{
	//populate drinks pane with items
	var allergenTemplate = "";

	if(menuItem.allergens.length > 0) // create our allergens list, if need be
	{
		allergenTemplate = 	`<div class="container">
									  <ul class="list-group">
										<li class="list-group-item list-group-item-danger" style="padding-top: 0.25rem;padding-bottom: 0.25rem">Allergens</li>`;

		for(i = 0; i < menuItem.allergens.length; i++)
		{
			allergenTemplate += `<li class="list-group-item list-group-item-warning" style="padding-top: 0.0rem;padding-bottom: 0.0rem">${menuItem.allergens[i]}</li>`
		}

		allergenTemplate += `</ul>
						</div>`;
	}



	//Card Template
	const cardTemplate = `<div id=${menuItem.name.replace(/ |\!|\?/g,"_")} class="col-sm-4 d-flex align-items-stretch">
							<div class="card-container manual-flip">
								<div class="card">
									<div class="front">
										<div class="content">
											<div class="main">
												<img class="card-img-top img-fluid" src=${menuItem.image} style="width:50%">
												<div class="card-body">
													<h4 class="card-title">${menuItem.name} | <strong style="color:darkgreen; font-style:oblique"> $${menuItem.cost.toFixed(2)}</strong></h4>
													<p class="card-text">${menuItem.description}</p>
													<button type="button" id='${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"btn"}' onclick="addItemToOrder('${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"btn"}','${menuItem._id.$oid}')" class="btn btn-primary">Order</button>
													<button type="button" id='${menuItem.name+"refill"}' onclick="needRefill('${menuItem.name+"refill"}')" class="btn btn-primary">Refill</button>
												</div>
											</div>
											<div class="footer">
												<button class="btn btn-simple" onclick="rotateCard(this)">
													<i class="fas fa-info-circle"></i> Health Facts
												</button>
											</div>
										</div>
									</div>
									<div class="back">
										<div class="header">
											<h5 class="card-title">${menuItem.name}</h5>
										</div>
										<div class="content">
											<div class="main">`
												+ allergenTemplate +
												`<p class="text-center" id=${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"ing"}></p>
												<div class="stats-container" style="margin-top: 0px">
													<div class="stats"><h4></h4><p></p></div>
													<div class="stats"><h4>Calories</h4><p>${menuItem.calories}</p></div>
													<div class="stats"><h4></h4><p></p></div>
												</div>
											</div>
										</div>
										<div class="footer">
												<button type="button" class="btn btn-light" onclick="healthFacts(this)">
													<i class="fas fa-backward"></i> Back
												</button>
										</div>
									</div>
								</div>
							</div>
						</div>`;

	//append our template to the pane
	$(selector).find('div.row').append(cardTemplate);


	for (k = 0; k < menuItem.ingredients.length; k++) {
		var ingID = menuItem.ingredients[k].ingredient.$oid;
		var url = "/api/ingredients/" + ingID;

		requestData(url, selector+menuItem.name.replace(/ |\!|\?/g,"_")+"ing", "ingredient");
	}
}

//Populates the ingredients section of the menuitem Card
function populateIngredients(ingredient, selector)
{
	var ingList;

	if($(selector).html() === "")
		ingList = ingredient.name;
	else
		ingList = $(selector).html().substr(12) + ", " + ingredient.name; // concatenate; // concatenate ingredients

	$(selector).html("Ingredients: " + ingList); // replace the ingredients with the added ingredient (comma is to remove the last comma)
}

function requestData(url, selector, type)
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
			switch(selector)
			{
				case'#foodTabs': populateFoodTabs(JSON.parse(request.responseText), selector); break;
				case'#foodPane': populateFoodPane(JSON.parse(request.responseText), selector); break;
				case'#drinkTabs': populateDrinkTabs(JSON.parse(request.responseText), selector); break;
				case'#drinkPane': populateDrinkPane(JSON.parse(request.responseText), selector); break;
				case'#orderList': populateOrders(JSON.parse(request.responseText), selector); break;
				default:
					switch(type)
					{
						case'fooditem': populateFoodCards(JSON.parse(request.responseText), selector); break;
						case'drinkitem': populateDrinkCards(JSON.parse(request.responseText), selector); break;
						case'ingredient': populateIngredients(JSON.parse(request.responseText), selector); break;
					} break;
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

//--- LISTENERS -----------------------------------------------------------------------------------------//

//--- Food -----------------------------------------------------------//
$('#_Food_').on('shown.bs.modal', function(event) // Create the table once the modal is shown (after it pops up)
{
	requestData('/api/menus', '#foodTabs', "UI");
	requestData('/api/menus', '#foodPane', "UI");
});

$('#_Food_').on('hide.bs.modal', function(event) // Remove the table's elements after the model is hidden
{
	$('#foodTabs li').remove();
	$('#foodPane div').remove();
});

//--- Drinks ----------------------------------------------------------//
$('#_Drinks_').on('shown.bs.modal', function(event) // Create the table once the modal is shown (after it pops up)
{
	requestData('/api/menus', '#drinkTabs', "UI");
	requestData('/api/menus', '#drinkPane', "UI");
});

$('#_Drinks_').on('hide.bs.modal', function(event) // Remove the table's elements after the model is hidden
{
	$('#drinkTabs li').remove();
	$('#drinkPane div').remove();
})


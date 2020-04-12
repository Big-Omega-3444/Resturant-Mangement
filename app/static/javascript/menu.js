function populateFoodTabs(data, selector)
{
	//populate Food
	for(i = 0; i < data.length; i++)
	{
		// check if the menu is active




		var tab = $('<li class="nav-item"/>')

		var tabName = data[i].name;
		var refName = tabName.replace(" ", "_");
		if (i == 0){
			tab.append($(`<a href="${"#" + refName}" data-toggle="tab" class="nav-link active"/>`).html(tabName));
		} else {
			tab.append($(`<a href="${"#" + refName}" data-toggle="tab" class="nav-link"/>`).html(tabName));
		}

		$(selector).append(tab);
	}
}

function populateFoodPane(data, selector)
{
	for(i = 0; i < data.length; i++) // iterate through menus
	{
		// check if the menu is active



		var pane;
		var tabName = data[i].name;
		var refName = tabName.replace(" ", "_")

		if (i == 0){ // first food tab gets the active pane
			pane = $(`<div role="tabpanel" class="tab-pane active" id="${refName}"/>`);
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

			requestData(url, "#"+refName, "menuitem");
		}
	}
}

function populateFoodCards(menuItem, selector)
{
	//populate food pane with items

	//Card Template
	const cardTemplate = `<div id=${menuItem.name.replace(" ","_")} class="col-sm-4">
							<div class="card-container manual-flip">
								<div class="card">
									<div class="front">
										<div class="content">
											<div class="main">
												<img class="card-img-top" src=${menuItem.image} style="width:50%">
												<div class="card-body">
													<h4 class="card-title">${menuItem.name}</h4>
													<p class="card-text">${menuItem.description}</p>
													<button type="button" id='${menuItem.name}' onclick="addOrder('${menuItem.name}')" class="btn btn-primary">Order</button>
												</div>
											</div>
											<div class="footer">
												<button class="btn btn-simple" onclick="healthFacts(this)">
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
											<div class="main">
												<h4 class="text-center">${menuItem.allergens}</h4>
												<p class="text-center">Ingredients</p>
												<div class="stats-container">
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

	 /* Example card
	const cardTemplate = `<div id="Title" class="col-sm-4">
									<div class="card-container manual-flip">
										<div class="card">
											<div class="front">
												<div class="content">
													<div class="main">
														<img class="card-img-top" src="https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg" style="width:100%">
														<div class="card-body">
															<h4 class="card-title">Title</h4>
															<p class="card-text">Description</p>
															<button type="button" id="Test" onclick="addOrder('Test')" class="btn btn-primary">Order</button>
														</div>
													</div>
													<div class="footer">
														<button class="btn btn-simple" onclick="healthFacts(this)">
															<i class="fas fa-info-circle"></i> Health Facts
														</button>
													</div>
												</div>
											</div>
											<div class="back">
												<div class="header">
													<h5 class="card-title">Title</h5>
												</div>
												<div class="content">
													<div class="main">
														<h4 class="text-center"></h4>
														<p class="text-center">Ingredient, ingredient, ingredient</p>
			
														<div class="stats-container">
															<div class="stats"><h4>Calories</h4><p>000</p></div>
															<div class="stats"><h4>Fat</h4><p>000 grams</p></div>
															<div class="stats"><h4>Protein</h4><p>000 grams</p></div>
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
	  */

	//append our template to the pane
	$(selector).find('div.row').append(cardTemplate);


	for (k = 0; k < menuItem.ingredients.length; k++) {
		var ingID = menuItem.ingredients[k].ingredient.$oid;
		var url = "/api/ingredients/" + ingID;

		requestData(url, selector, "ingredient");
	}

	//For later to fill in ingredients
	//
}

function populateIngredients(ingredient, selector)
{
	var ingList = ingredient.name + ","; // concatenate ingredients
	if($(selector).find('div div div.back div.content div p').innerHTML != undefined)
		ingList = ingList + $(selector).find('div div div.back div.content div p').innerHTML;
	alert(ingList);

	$(selector).find('div div div.back div.content div.main p.text-center').replaceWith($(`<p class="text-center"/>`).html(ingList));
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
				default:
					switch(type)
					{
						case'menuitem': populateFoodCards(JSON.parse(request.responseText), selector); break; // if we're not doing the other things we must be doing cards
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

// LISTENERS

// Create the table once the modal is shown (after it pops up)
$('#Food').on('shown.bs.modal', function(event)
{
	requestData('/api/menus', '#foodTabs', "UI");
	requestData('/api/menus', '#foodPane', "UI");
});

// Remove the table's elements after the model is hidden
$('#Food').on('hide.bs.modal', function(event)
{
	$('#foodTabs li a').remove();
	$('#foodPane div').remove();
});
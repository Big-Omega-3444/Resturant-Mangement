function populateFoodTabs(data, selector)
{
	//populate Food
	for(i = 0; i < data.length; i++)
	{
		var tab = $('<li class="nav-item"/>')

		var tabName = data[i].name;
		if (i == 0){
			tab.append($(`<a href=${"#" + tabName} data-toggle="tab" class="nav-link active"/>`).html(tabName));
		} else {
			tab.append($(`<a href=${"#" + tabName} data-toggle="tab" class="nav-link"/>`).html(tabName));
		}

		$(selector).append(tab);

		var pSelector = '#foodPane'; // selector for the food pane
		var pane;

		if (i == 0){ // first food tab gets the active pane
			pane = $(`<div role="tabpanel" class="tab-pane active" id=${tabName} <div class="row"/>/>`);
		} else {
			pane = $(`<div role="tabpanel" class="tab-pane" id=${tabName} <div class="row"/>/>`);
		}
		var pSelector = '#foodPane'; // selector for the food pane
		var pane;

		if (i == 0){ // first food tab gets the active pane
			pane = $(`<div role="tabpanel" class="tab-pane active" id=${tabName}/>`);
		} else {
			pane = $(`<div role="tabpanel" class="tab-pane" id=${tabName}/>`);
		}
		row = $('<div class="row"/>')

		const cardTemplate = `<div class="col-sm-4">
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

		//append our template to the pane
		row.append(cardTemplate);

		pane.append(row);

		/*
		//populate food pane
		for(j = 0; j < data[i].items.length; i++)
		{
			var ingList = ""; // concatenate ingredients
			for(l = 0; l < data[i].items[j].ingredients.length; l++)
				ingList = ingList + data[i].items[j].ingredients[l].name + ",";

			// hopefully I can just use this template for the cards
			const cardTemplate = `<div class="col-sm-4">
									<div class="card-container manual-flip">
										<div class="card">
											<div class="front">
												<div class="content">
													<div class="main">
														<img class="card-img-top" src=${data[i].items[j].image} style="width:100%">
														<div class="card-body">
															<h4 class="card-title">${data[i].items[j].name}</h4>
															<p class="card-text">${data[i].items[j].description}</p>
															<button type="button" id=${data[i].items[j].name} onclick="addOrder(${data[i].items[j].name})" class="btn btn-primary">Order</button>
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
													<h5 class="card-title">${data[i].items[j].name}</h5>
												</div>
												<div class="content">
													<div class="main">
														<h4 class="text-center"></h4>
														<p class="text-center">${ingList}</p>
			
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

			//append our template to the pane
			row.append(cardTemplate);

			pane.append(row);
		}
		 */

		// append our cards to the food panes
		$(pSelector).append(pane);
	}
}



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
			switch(selector)
			{
				case'#foodTabs': populateFoodTabs(JSON.parse(request.responseText), selector); break;
				case'#drinkTabs': populateDrinksTabs(JSON.parse(request.responseText), selector); break;
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

function updateMenus()
{
	$('#foodTabs li a').remove();
	requestData('/api/menus', '#foodTabs');

	$('#drinkTabs li a').remove();
	requestData('/api/menus', '#drinkTabs');
}

// LISTENERS

// Create the table once the modal is shown (after it pops up)
$('#Food').on('shown.bs.modal', function(event)
{
	requestData('/api/menus', '#foodTabs');
	requestData('/api/menus', '#foodPane');
});

// Remove the table's elements after the model is hidden
$('#Food').on('hide.bs.modal', function(event)
{
	$('#foodTabs li a').remove();
	$('#foodPane div').remove();
});
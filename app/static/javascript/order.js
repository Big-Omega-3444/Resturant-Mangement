 $(document).ready ( function(){
  window.localOrder = {
    time_ordered: 0, // updated on submission
    table: 0, // updates on given cookie
    gratuity: 0,
    special_notes: "", // updates at checkout
    items: [], // updates when item is added to cart
    to_go: "False", // I don't know when this changes
    status: 'ordered', // This will be ordered when ordered and changed by kitchen
    comped: "False" // Waitstaff modify this
  };
  window.bill = 0;
});

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

function updateBill() {
	if (document.getElementById("subtotal"))
	    document.getElementById("subtotal").innerHTML = "$"+bill.toFixed(2);
	if (document.getElementById("tax"))
	    document.getElementById("tax").innerHTML = "$"+(bill * .0625).toFixed(2);

	if (document.getElementById("totalBill"))
	    document.getElementById("totalBill").innerHTML = "$"+((bill * 1.0625)).toFixed(2);
}

setInterval(function(){
    var tip = parseFloat(document.getElementById("tip").value);

    if (isNaN(tip))
        tip = parseFloat(0);


    document.getElementById("totalBill").innerHTML = "$"+((bill * 1.0625) + tip ).toFixed(2)
}, 1000);

function countNumInOrder(itemID) {
  var count = 0;

  for(i = 0; i < localOrder.items.length; i++)
    if(localOrder.items[i].item === itemID) {
      count++;
    }
  return count;
}

// Add to Order Function
function addItemToOrder(buttonID, item) {
  // add item foodId to an array
  var item = {item};
  localOrder.items.push(item);

  if (document.getElementById(buttonID).innerHTML === "Order")
    document.getElementById(buttonID).innerHTML = "Item Added!";

  setTimeout(function() { revertText(buttonID); }, 1000);
  function revertText(buttonID){ if(document.getElementById(buttonID)) document.getElementById(buttonID).innerHTML = "Order"; }
}

// Remove from Order Function
function removeItemFromOrder(buttonID, foodID) {
  // add item foodId to an array
  for(i = 0; i < localOrder.items.length; i++)
  {
    if(localOrder.items[i].item === foodID) {
      localOrder.items.splice(i,1);
      break;
    }
  }

  $('#orderList tr.order').remove();

  bill = 0;
  updateBill();
  requestOrderedItems();
}

function populateOrders(menuItem, selector) {

  var count = countNumInOrder(menuItem._id.$oid);

  const orderTemplate = `<tr class="order">
                          <td class="col-md-1"><a href="#" id='${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"rmv"}' onclick="removeItemFromOrder('${selector.replace("#","")+menuItem.name.replace(/ |\!|\?/g,"_")+"rmv"}','${menuItem._id.$oid}')" class="text-dark"><i class="fa fa-trash"></i></a></td>
                          <td class="col-md-5"><em>${menuItem.name}</em></h4><br><span class="text-muted font-weight-normal font-italic">${menuItem.description}</span></td>
                          <td class="col-md-1" style="text-align: center"> ${count} </td>
                          <td class="col-md-1 text-center">\$${(menuItem.cost*count).toFixed(2)}</td>
                        </tr>`

  $(selector).prepend(orderTemplate);

  priceofItem = menuItem.cost*count;
  bill = bill + priceofItem;

  updateBill();
}

function SubmitOrder() {
    event.preventDefault();

    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/orders");

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
			var order = JSON.parse(post.responseText); // I don't know why I had to split this up
			var orderID = {order};
			table.orders.push(orderID);

			var orders = table.orders;
			var thisIsSoStupid = {orders};
			updateTable();

			// apply gratuities to waitstaff
            scanTimesheets("tip");

		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

	localOrder.time_ordered = Date.now();
    localOrder.special_notes = document.getElementById('specialRequests').value;
    localOrder.gratuity = parseFloat(document.getElementById("tip").value);
    localOrder.table = table.number;

    if(document.getElementById('ToGo').checked)
        localOrder.to_go = "True";

    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(localOrder));
}

function requestOrderedItems() {

  var orders = [];
  for(i=0; i < localOrder.items.length; i++)
  {
    orders.push(localOrder.items[i].item);
  }
  var unique = orders.unique();

  for(i = 0; i < unique.length; i++)
  {
	requestData('/api/menuitems/'+ unique[i], '#orderList');
  }
}

function scanTimesheets(cmd) {
    // Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	request.open('GET', "/api/timesheets");

	// Handle on load
	request.onload = function()
	{
		if (request.status != 200)
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
		else
		{
			switch(cmd) {
                case "tip": tipWaitstaff(JSON.parse(request.responseText));
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

function tipWaitstaff(data) {

    var count = 0;
    var employeesFound = [];

    // scan through all timesheets
    for(i = 0; i < data.length; i++)
    {
        if(data[i].ongoing) {
            count++;
            employeesFound.push(i);
        }
    }

    if (count > 0) {
        var splitTip = table.gratuity / count;

        for(i = 0; i < employeesFound; i++)
        {
            data[employeesFound[i]].accrued_tips += splitTip;
        }
    }


}

$('#MyCart').on('shown.bs.modal', function(event) // Create the table once the modal is shown (after it pops up)
{
  requestOrderedItems();
});

$('#MyCart').on('hide.bs.modal', function(event) // Remove the table's elements after the model is hidden
{
	$('#orderList tr.order').remove()
    bill = 0;
});

$('#PayNow').click( function()
{
    if(localOrder.items.length == 0) {
      alert("Please order something before giving us your money");
    } else {
	  SubmitOrder();
	  $("#PayBill").modal();
    }

});
$(document).ready ( function(){
  window.order = {
    time_ordered: 0,
    table: 1,
    special_notes: "Why doesn't this work",
    items: [],
    to_go: "False",
    status: 'ordered',
    comped: "False"
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
	    document.getElementById("totalBill").innerHTML = "$"+(bill * 1.0625).toFixed(2);
}

function countNumInOrder(itemID) {
  var count = 0;

  for(i = 0; i < order.items.length; i++)
    if(order.items[i].item === itemID) {
      count++;
    }
  return count;
}

// Add to Order Function
function addItemToOrder(buttonID, item) {
  // add item foodId to an array
  var item = {item};
  order.items.push(item);

  if (document.getElementById(buttonID).innerHTML === "Order")
    document.getElementById(buttonID).innerHTML = "Item Added!";

  setTimeout(function() { revertText(buttonID); }, 1000);
  function revertText(buttonID){ if(document.getElementById(buttonID)) document.getElementById(buttonID).innerHTML = "Order"; }

  console.log(JSON.stringify(order));
}

// Remove from Order Function
function removeItemFromOrder(buttonID, foodID) {
  // add item foodId to an array
  for(i = 0; i < order.items.length; i++)
  {
    if(order.items[i].item === foodID) {
      order.items.splice(i,1);
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

  bill += menuItem.cost*count;
  updateBill();
}

function SubmitOrder()
{
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
			console.log("Order Submitted");
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

	order.time_ordered = Date.now();

    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(order));
}

function requestOrderedItems() {

  var orders = [];
  for(i=0; i < order.items.length; i++)
  {
    orders.push(order.items[i].item);
  }
  var unique = orders.unique();

  for(i = 0; i < unique.length; i++)
  {
	requestData('/api/menuitems/'+ unique[i], '#orderList');
  }
}

$('#MyCart').on('shown.bs.modal', function(event) // Create the table once the modal is shown (after it pops up)
{
  requestOrderedItems();
});

$('#MyCart').on('hide.bs.modal', function(event) // Remove the table's elements after the model is hidden
{
	$('#orderList tr.order').remove();
});

$('#PayNow').click( function()
{
    if(order.items.length == 0) {
      alert("Please order something before giving us your money");
    } else {
	  SubmitOrder();
	  $("#PayBill").modal();
    }

});
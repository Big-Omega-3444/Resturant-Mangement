// Run on page load, update clock
$( document ).ready(function() {
    if (document.getElementById("date") || 	document.getElementById("time"))
		updateClock();
});

//Generate alert message
function GenerateAlertMessage(bodyText, divclass)
{
	//There's nothing to display
	if (bodyText == "")
		return;
	
	// If there's no div class sent in, revert to default: alert-primary
	if (divclass == "")
		divclass = "alert-primary";
	
	var AlertMessage = `<div class="alert ${divclass} alert-dismissible fade show alert-messages" role="alert">
	${bodyText}
	<button type="button" class="close" data-dismiss="alert" aria-label="Close">
		<span aria-hidden="true">&times;</span>
	</button>	
	</div>`
	
//	AlertMessage = setTimeout(function() { $(this).fadeTo(500, 0).slideUp(500, 
//		function(){ $(this).remove(); });
//	}, 2000);

	AlertMessage;
	
	$('#Alerts').append(AlertMessage);
	$('.alert-messages').delay(4000).slideUp(200, function() { $(this).remove(); })
}

// This function simply posts a Notification to the API
// 	If you want special functions when the notification is posted, then
// 	you'll need to copy this function for your own purposes
function PostNotifications(JSONObject)
{
	// Don't do anything if JSONObject is empty
	if (JSONObject == {})
		return;
	
	//Generate XHR
	var post = new XMLHttpRequest();
	
	// Create a notification to database
	var url = "/api/notifications";
	
	// Open a socket to the url
	post.open('POST', url);
	
	// Handle on load
	post.onload = function(data) 
	{
		if (post.status === 200 || post.status === 201 || post.status === 204)
		{
			return;
		}
		else
		{
			alert(`Error ${request.status}: ${request.statusText}`);
			return;
		}
	};
	
	// Handle on errors	
	post.error = function() 
	{
		alert("Request Failed!");
		return;
	};
	
	post.setRequestHeader("Content-Type", "application/json");
	post.send(JSON.stringify(JSONObject));		
}

// Request Help Function
function getHelp(helpVal) { 
  if (document.getElementById(helpVal).innerHTML === "Help?") {
    document.getElementById(helpVal).innerHTML = "Your host is on the way!";
    // Alert waiter
  } else {
    document.getElementById(helpVal).innerHTML = "Help?";
    // Cancel Request
  }
}

// Refill Drink Function
function needRefill(drinkId) { 
  if (document.getElementById(drinkId).innerHTML === "Refill") {
    document.getElementById(drinkId).innerHTML = "Please wait...";
    // Alert waiter
  } else {
    document.getElementById(drinkId).innerHTML = "Refill";
    // Cancel Request
  }
}

//Management search function
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

//Print function
function printFunction() {
    window.print();
}

// Aaron's JS functions
// updateClock: gets the time and prints it to two elements: date and time
function updateClock() {
	var now = new Date();
	if (document.getElementById("date"))
	    document.getElementById("date").innerHTML = now.toLocaleDateString();
	if (document.getElementById("time"))
	    document.getElementById("time").innerHTML = now.toLocaleTimeString();
}
// Outside so the script calls this function repeatedly
setInterval(updateClock, 1000);

// Paypal Function
/*
paypal.Buttons({

	// Set up the transaction
	createOrder: function(data, actions) {
		return actions.order.create({
			purchase_units: [{
				amount: {
					value: '0.01'
				}
			}]
		});
	},

	// Finalize the transaction
	onApprove: function(data, actions) {
		return actions.order.capture().then(function(details) {
			// Show a success message to the buyer
			alert('Transaction completed by ' + details.payer.name.given_name + '!');
		});
	}


}).render('#paypal-button-container');
*/
// Phone Number Function
$("input[type='tel']").each(function(){
  $(this).on("change keyup paste", function (e) {
    var output,
      $this = $(this),
      input = $this.val();

    if(e.keyCode != 8) {
      input = input.replace(/[^0-9]/g, '');
      var area = input.substr(0, 3);
      var pre = input.substr(3, 3);
      var tel = input.substr(6, 4);
      if (area.length < 3) {
        output = "(" + area;
      } else if (area.length == 3 && pre.length < 3) {
        output = "(" + area + ")" + pre;
      } else if (area.length == 3 && pre.length == 3) {
        output = "(" + area + ")" + pre + "-" + tel;
      }
      $this.val(output);
    }
  });
});

// Nutrition Facts
function healthFacts(btn){
	var $card = $(btn).closest('.card-container');
	console.log($card);
	if($card.hasClass('hover')){
		$card.removeClass('hover');
	} else {
		$card.addClass('hover');
	}
}

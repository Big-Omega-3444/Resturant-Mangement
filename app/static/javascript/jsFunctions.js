// Run on page load, update clock
$( document ).ready(function() {
    if (document.getElementById("date") || 	document.getElementById("time"))
		updateClock();

    window.canRotate = true;
});

//Generate alert message
function GenerateAlertMessage(selector, bodyText, divclass, divID = "", bRemoveAlertOnly = false)
{
	//There's nothing to display
	if (bodyText == "")
		return;

	// If there's no div class sent in, revert to default: alert-primary
	if (divclass == "")
		divclass = "alert-primary";

	var AlertMessage;

	if (divID != "")
	{
		AlertMessage = `<div class="alert ${divclass} alert-dismissible fade show alert-messages" id="alert_${divID}" role="alert">
		${bodyText}
		<button type="button" id="btnClose_${divID}" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		</div>`
	}
	else
	{
		AlertMessage = `<div class="alert ${divclass} alert-dismissible fade show alert-messages" role="alert">
		${bodyText}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		</div>`
	}

	// Tie the alert to <div id="Alerts"/>
	$(selector).append(AlertMessage);

	//Only works if there's an ID that was passed in
	if (divID != "")
	{
		//Add a function that should remove the notification after 4000 ms
		$('.alert-messages').delay(4000).slideUp(200, function(bRemoveAlertOnly)
		{
			if (bRemoveAlertOnly === false)
				DeleteNotifications(this);
			$(this).remove();
		});

		//Intentional, this will get the ID properly when splitting the string into two parts
		$(`btnClose_${divID}`).delay(4000).slideUp(200, function(bRemoveAlertOnly)
		{
			if (bRemoveAlertOnly === false)
				DeleteNotifications(this);
			$(this).remove();
		});
	}
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


//
// This function simply posts a Notification to the API
// 	If you want special functions when the notification is posted, then
// 	you'll need to copy this function for your own purposes
//
// Notifications need to follow this rule for IDs when submitting objects: <name>_$oid.
function DeleteNotifications(object, id = "")
{
	// Create a notification to database
	var url = "/api/notifications/"

	//Determine if ID was submitted or was blank
	if (id == "")
	{
		if (object == null) 	//Check if an object is null
			return;				//Exit the function, there's nothing to pass in
		else
		{
			//For any object that comes in here, we need to split the string into two parts

			var splitstr = (object.id).split("_");
			if (splitstr[1] != null)
				url = url + splitstr[1];
			else
				return;
		}
	}
	else
	{
		url = url + id;
	}

	//Generate XHR
	var post = new XMLHttpRequest();

	// Open a socket to the url
	post.open('DELETE', url);

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

	post.send();
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

      // Authorize the transaction
      actions.order.authorize().then(function(authorization) {

        // Get the authorization id
        var authorizationID = authorization.purchase_units[0].payments.authorizations[0].id

        // Call your server to validate and capture the transaction
        return fetch('/paypal-transaction-complete', {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            orderID: data.orderID,
            authorizationID: authorizationID
          })
        });
      });
    }


}).render('#paypal-button-container');

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
	if($card.hasClass('hover')){
		$card.removeClass('hover');
	} else {
		$card.addClass('hover');
	}
}

//Rotate Card
function rotateCard(btn){
	var $card = $(btn).closest('.card-container');
	if($card.hasClass('hover')){
		$card.removeClass('hover');
	} else {
		$card.addClass('hover');
	}
}

function rotateGameCard(btn){
	var $card = $(btn).closest('.card-container');

	var res = Math.round(Math.random()*5);
	switch(res)
	{
		case 1: document.getElementById(btn.id+"Res").innerHTML = "You Win!" + String.fromCodePoint(0x1f370); break;
		default: document.getElementById(btn.id+"Res").innerHTML = "You Lose... " + String.fromCodePoint(0x1f641); break;
	}

	if(canRotate){
		if($card.hasClass('hover')){
			$card.removeClass('hover');
		} else {
			$card.addClass('hover');
		}

		if(res == 1)
			alert("A coupon has been added to your Account!");

		canRotate = false;

		setTimeout(function() { reloadPage(); }, 1500);
		function reloadPage(){ window.location=""; }
	}
}

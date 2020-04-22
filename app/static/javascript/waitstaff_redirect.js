//Check if logged in as valid user
$(document).ready(function () {

	if (getCookie("username") == "") {
		alert("Must be logged in to access this page.");
		window.location = '/welcome';

	}
	else if (getCookieEmployee() == "kitchen") {
		alert("Must be manager/waistaff to access this page.");
		window.location = '/kitchen';
	}
});

function getCookieEmployee() {

	var requests = new XMLHttpRequest();

	requests.open('GET', "/api/employees", false);

	var check = "";


	requests.onload = function () {

		if (requests.status === 200 || requests.status === 201 || requests.status === 204) {
			var employee_data = JSON.parse(requests.responseText);
			console.log(employee_data);
			var id = getCookie("username");

			for (var i = 0; i < employee_data.length; i++) {

				if (id == employee_data[i]._id.$oid) {

					check = employee_data[i].assignment;
					break;
				}
			}

		}
		else {
			alert(`Error ${requests.status}: ${requests.statusText}`);
		}


	}

	requests.send()
	console.log(check);
	return check;
}

//Reference to w3school, decoding cookie contents, chanegd some lines to work with our code
function getCookie(cname) {


	var name = cname + "=";
	var decodedCookie = document.cookie;

	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";

}

function recordOut() { //Record sign out

	findTime();

	removeCookies();

	window.location = '/';
}

function findTime() {


	var request = new XMLHttpRequest();
	var employee_id = getCookie("username");

	var i;

	request.open('GET', '/api/timesheets');

	//Handle errors
	request.error = function () {
		alert("Request Failed!");
	};

	request.onload = function () {

		var timesheets = JSON.parse(request.responseText);
		var newest = 0;
		var result;

		if (request.status === 200 || request.status === 201 || request.status === 204) {

			for (i = 0; i < timesheets.length; i++) {


				if (timesheets[i].employee.$oid == employee_id) {
					if (timesheets[i].utc_start_time > newest) {

						result = timesheets[i]._id.$oid;
						newest = timesheets[i].utc_start_time;

					}
				}
			}



			recordSignIn(result);

		}
		else {


			var error = JSON.parse(request.responseText);
			console.log(error.message);
			alert(`Error ${request.status}: ${error.message}`);

		}

	}
	request.send();

}

function recordSignIn(res) {


	var post = new XMLHttpRequest();

	post.open('PUT', '/api/timesheets/' + res);

	//Handle errors
	post.error = function () {
		alert("Request Failed!");
	};

	post.onload = function () {

		if (post.status === 200 || post.status === 201 || post.status === 204) {

			//???

		}
		else {


			var error = JSON.parse(post.responseText)
			console.log(error.message)
			alert(`Error ${post.status}: ${error.message}`);
		}

	}

	var end = Date.now();
	var input_data = {
		"utc_end_time": end,
		"ongoing": false
	};

	post.setRequestHeader("Content-Type", "application/json");
	post.send(JSON.stringify(input_data));
}


//Remove cookies function, credit goes to Mateen
function removeCookies() {

	var res = document.cookie;
	var arr = res.split(";");
	for (var i = 0; i < arr.length; i++) {
		var results = arr[i].split("=");
		document.cookie = results[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
}
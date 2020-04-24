//Check if logged in as valid user
$(document).ready(function () {

	if (getCookie("username") == "") {
		alert("Must be logged in to access this page.");
		window.location = '/welcome';

	}
	else if (getCookieEmployee() == "waitstaff") {
		alert("Must be manager to access this page.");
		window.location = '/waitstaff';
	}
	else if (getCookieEmployee() == "kitchen") {
		alert("Must be manager to access this page.");
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
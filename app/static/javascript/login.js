function checkCredentials(data, selector)
{
    var fail = true;
    var user = document.getElementById("eID").value.toString();
    var pass = document.getElementById("ePass").value.toString();

    for(i=0; i < data.length; i++) // step through users
    {
        if(data[i].username.toString() === user && data[i].pin.toString() === pass) // same user, same pass
        {
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            document.cookie = 'username=' + user + "path=/";
            recordSignIn(user);
            fail = false;
            switch(data[i].assignment) // redirect accordingly
            {
                case "manager": window.location='/management'; break;
                case "kitchen": window.location='/kitchen'; break;
                case "waitstaff": window.location='/waitstaff'; break;
                default: alert("Woah... Something isn't right..."); break;
            }

        }
    }
    if(fail){
        alert("Nice try, kid");
        user = "fail";
        pass = "stupid";
        document.getElementById("eID").value = "";
        document.getElementById("ePass").value = "";
    }

}

$('#signOut').click(function () {

    recordSignOut()
    
});

function recordSignIn(id) {

    var request = new XMLHttpRequest();

    var employee_id = getEmployee(id);
    request.open('PUT', '/api/timesheets/' + employee_id);

    request.onload = function () {

        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        }
        else {

            start = Date.now();

            var input_data =
            {
                "utc_start_time": start,
                "employee": employee_id
            };

             


        }

    }

}


function recordSignOut(id) {



}

function getEmployee(username) {

    var request = new XMLHttpRequest();
    var i;
    getEmployee(id);
    request.open('GET', "/api/employees");

    request.onload = function () {

        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        }
        else {

            var employees = JSON.parse(requests.responseText);

            for (i = 0; i < employees.length; i++) {

                if (employees[i].username == username) {

                    return employees.id;

                }
            }
        }

    }

}
function checkCoupon(data, selector)
{
    code = document.getElementById("couponForm").value;

    for(i=0; i < data.length; i++) // step through data
    {
        if(data[i].entry_code === code)
        {
            alert("Coupon Accepted!");
        }
    }
    alert("Invalid Coupon");
}

function requestInputText(url, selector)
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
                case '#couponForm':
                    checkCoupon(JSON.parse(request.responseText), selector);
                    break;
                case '#loginForm':
                    checkCredentials(JSON.parse(request.responseText), selector);
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
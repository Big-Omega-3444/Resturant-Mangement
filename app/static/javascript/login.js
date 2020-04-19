function checkCredentials(data, selector)
{
    var fail = true;
    switch(selector){
        case '#loginForm': // staff members
            var user = document.getElementById("eID").value.toString();
            var pass = document.getElementById("ePass").value.toString();
            break;
        case '#loyLogin': // loyalty members
            var user = document.getElementById("llemail").value.toString();
            var pass = document.getElementById("llPass").value.toString();
            break;
    }

    for(i=0; i < data.length; i++) // step through users
    {
        switch(selector)
        {
            case '#loginForm': // staff members
                if(data[i].username.toString() === user && data[i].pin.toString() === pass) // same user, same pass
                {

                    fail = false;
                    switch(data[i].assignment) // redirect accordingly
                    {

                        //Added timesheet creator for relevant employee
                        case "manager": recordSignIn(user, data[i].assignment);  break;
                        case "kitchen": recordSignIn(user, data[i].assignment);  break;
                        case "waitstaff": recordSignIn(user, data[i].assignment); break;
                        default: alert("Uh oh. Something broke..."); break;
                    }
                }
                break;

            case '#loyLogin': // loyalty members
                if(data[i].email.toString() === user && data[i].pin.toString() === pass) // same user, same pass
                {
                    fail = false;
                    alert("Welcome back, "+data[i].firstname+"!"); // this happens when a loyal customer logs in
                }
                break;
        }

    }
    if(fail){ // if we fail to log in
        alert("Invalid Login Credentials");
        user = "fail"; 
        pass = "stupid";
        document.getElementById("eID").value = "";
        document.getElementById("ePass").value = "";
        document.getElementById("llemail").value = "";
        document.getElementById("llPass").value = "";
    }

}

//From w3school, decode cookie
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


/*$('#signIn').click(function () { //Record sign in on click function may not be needed

    var username = getCookie("username");
    if (username != "") {
        recordSignIn(username);
    }
});*/

//Make a new timesheet with relevant employee id and recorded time
function recordSignIn(id, go) {

    console.log("in recordSignIn");

    var post = new XMLHttpRequest();

    var employee_id = getCookie("username");

    post.open('POST', '/api/timesheets',false);

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

    var start = Date.now();
    var input_data = {
        "utc_start_time": start,
        "employee": employee_id
    };

    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(input_data));
    if (go == "manager") {
        window.location = '/management';
    }
    else {
        window.location = '/' + go;

    }
}


function recordSignOut(id) {



}

//Fetch employee_id with username
function getEmployee(username) {
    console.log("in getEmployee");

    var request = new XMLHttpRequest();
    var i,temp;
    request.open('GET', "/api/employees",false);

    request.onload = function () {

        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        }
        else {

            var employees = JSON.parse(request.responseText);


            for (i = 0; i < employees.length; i++) {

                if (employees[i].username == username) {

                    var temp = employees[i]._id.$oid;
                    document.cookie = "username=" + temp + ";" + " path=/";

                }
            }
        }
        
    }

    request.send()

}

/* ***MAY BE UNNEEDED*** Returns timesheet_id if a timesheets for employee at employee_id exists, if not run function emptyTimesheet and make one
function Exists(employee_id) {
    console.log("in Exists");

    var request = new XMLHttpRequest();
    var i;
    request.open('GET', "/api/timesheets");
    console.log(">>>>>>>>>>");
    console.log(request.responseText);
    console.log("<<<<<<<<<<");
    request.onload = function () {
        console.log("in Exists onload");

        if (request.status != 200) {
            console.log("in Exists error handling");
            alert(`Error ${request.status}: ${request.statusText}`);
        }
        else {

            var timesheets = JSON.parse(request.responseText);

            for (i = 0; i < timesheets.length; i++) {

                if (timesheets[i].employee == employee_id) {

                    return timesheets._id;

                }
            }
            //Create Empty timesheet
            emptyTimesheet(employee_id);

            //Return result of timesheets_id
            var result_id = Exists(employee_id);

            //Return the timesheet_id back to signIn/signOut
            return result_id;
        }

    }

    request.send()
}


//Create empty timesheet if one doesn't exist
function emptyTimesheet(employee_id) {
    console.log("in emptyTimesheet");

    var post = new XMLHttpRequest();
    post.open('POST', '/api/timesheets');

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

    var input_data = {
        "utc_start_time": 0,
        "employee": employee_id
    };
    post.setRequestHeader("Content-Type", "application/json");
    post.send(JSON.stringify(input_data));

} */
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

    if (selector == '#loginForm') {

        getEmployee(document.getElementById("eID").value.toString());
        
    }
  
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
                case '#loyLogin':
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

function SubmitLoyaltyMemberForm()
{
    event.preventDefault();

    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/loyaltymembers");

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
			alert("Thanks for joining!");
			window.location('/');
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)

			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("loyaltySignup"));
    post.send(formData);
}

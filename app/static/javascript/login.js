function checkCredentials(data, selector)
{
    var fail = true;
    var user = document.getElementById("eID").value.toString();
    var pass = document.getElementById("ePass").value.toString();

    for(i=0; i < data.length; i++) // step through users
    {
        if(data[i].username.toString() === user && data[i].pin.toString() === pass) // same user, same pass
        {

            fail = false;
            switch(data[i].assignment) // redirect accordingly
            {
                case "manager": recordSignIn(user); break;
                case "kitchen": recordSignIn(user); break;
                case "waitstaff": recordSignIn(user); break;
                default: alert("Woah... Something isn't right..."); break;


                /*case "manager": window.location='/management'; break;
                case "kitchen": window.location='/kitchen'; break;
                case "waitstaff": window.location='/waitstaff'; break;
                default: alert("Woah... Something isn't right..."); break;*/
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

function Simulation(url, selector) {

    getEmployee(user);
    requestInputText(url, selector);
}

//from w3school, decode cookie
function getCookie(cname) {

    var Cookie_var = document.cookie;
    console.log("decode=" + decodeURIComponent(document.cookie));
    var ca = Cookie_var.split('=');
    console.log("ca[0] = " + ca[0] + "ca[1] = " + ca[1]);
    
    return "";
}

$('#signOut').click(function () {

    var username = getCookie("username");
    if (username != "") {
        recordSignOut(username);
    }
   
});

/*$('#signIn').click(function () { //Record sign in on click function may not be needed

    var username = getCookie("username");
    if (username != "") {
        recordSignIn(username);
    }
});*/

function recordSignIn(id) {

    console.log("in recordSignIn");

    var post = new XMLHttpRequest();

    var employee_id = getCookie("username");
    console.log(employee_id);
    post.open('POST', '/api/timesheets');

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
}


function recordSignOut(id) {



}

//Fetch employee_id with username
function getEmployee(username) {
    console.log("in getEmployee");

    var request = new XMLHttpRequest();
    var i,temp;
    request.open('GET', "/api/employees");

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
                    console.log(document.cookie);
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

    /*if (selector == '#loginForm') { // Work around orderings of onload

        getEmployee(user);

    } */
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
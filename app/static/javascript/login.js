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
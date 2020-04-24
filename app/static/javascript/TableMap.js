function RequestTableOrder(){
  console.log("sups")
  var request = new XMLHttpRequest();
  request.open('GET', '/api/orders');
  // Build the table
	for(i = 0; i < orderData.length; i++)
	{
		//Search for menu items
		var arrMenuNames = [];

		for (j = 0; j < menuItemsData.length; j++)
		{
			for (k = 0; k < orderData[i].items.length; k++)
			{
				var str1 = (orderData[i].items[k].item.$oid).toString();
				if (str1 === menuItemsData[j]._id.$oid)
					arrMenuNames.push(menuItemsData[j].name);
			}
		}

		var row = $('<tr id="tbl_orderID_${orderData[i]._id.$oid}"/>');

		// Append first and last name into one variable
//		var fullname = data[i].firstname + " " + data[i].lastname;
		row.append($('<td/>').html(orderData[i].order_id));

		var inject = $('<ul/>');

		//Now build and inject the bulleted list into the appended card
		for (j = 0; j < arrMenuNames.length; j++)
		{
			inject.append($('<li/>').html(arrMenuNames[j]));
		}

		row.append($('<td/>').html(inject));

		var time = new Date(orderData[i].time_ordered);
		var suffix = (time.getHours() >= 12) ? "AM" : "PM";
		var minutes = (time.getMinutes() < 10) ? "0"+time.getMinutes() : time.getMinutes();

		row.append($('<td/>').html(`${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${minutes} ${suffix}`));

		var readyButton = $(`<button class="btn btn-success" id="btnReady_${orderData[i]._id.$oid}"/>`).click(function() {
			SendOrderReadyRequest(this);
		}).html("RDY");

		var callButton = $(`<button class="btn btn-secondary" id="btnCall_${orderData[i]._id.$oid}" data-toggle="modal" href=""/>`).click(function() {
			SendOrderCallWaitstaffRequest(this);
		}).html("CALL");

		row.append($('<td/>').html(readyButton).append(callButton));

		$('#KTCH_OrderHistoryTable_Body').append(row);
	}
}

$('#TableOrder').on('shown.bs.modal', function(event))
{
  console.log("sup")
  RequestTableOrder();
}

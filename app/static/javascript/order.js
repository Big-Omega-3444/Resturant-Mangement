// Add to Order Function
function addOrder(foodId) { 
  if (document.getElementById(foodId).innerHTML === "Order") {
    document.getElementById(foodId).innerHTML = "&#9989;";
    // Alert waiter
  } else {
    document.getElementById(foodId).innerHTML = "Order";
    // Cancel Request
  }
}
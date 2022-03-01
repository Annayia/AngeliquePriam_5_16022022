// ---------- Cleaning the localStorage------------------///
localStorage.clear();
// ------------ Getting the OrderId in the URL to get the order number----------//
let orderId = new URL(document.location).searchParams.get('id')
// -----------Injection of the order ID in the HTML text---------//
document.getElementById("orderId").innerHTML += `<span id="orderId">${orderId}</span>`
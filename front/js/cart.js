// ------main function contains all the functions of the cart pages------//
main ();
async function main (){
    // Getting the cart of the localStorage///
  const basket = getCart()
    //Getting the API's results to create my cart with all the products with//
    // a loop for each of the products and displaying the products in the HTML to make them appear////
  for( i = 0 ; i < basket.length ; i++ ){
    let productApi = await getProducts(basket[i].id)
    displayProducts(basket,i, productApi)  
  }
    // ---With the input I can change the quantity dynamically in the localStorage---//
  changeQuantity();
    // ---- With the delete button I can delete the products from the cart and from the localStorage//
  deleteProduct();
    // ---- this function calculate the total Price with the price of each products that I get from the API///
  productPrice();
    // ---- with getForm, I control the entries in the form and send him with a Post Request---///
  getForm();
}
// Getting the products from the localStorage with getItem et return it in JSONparse to get an array///
function getCart () {
  let cart = localStorage.getItem("basket")
    // Condition if the cart is empty then the button can't be used and an alert appears---////
  if (cart === null || cart === "[]" ) {
    document.getElementById("order").setAttribute("disabled", true)
    document.getElementById("order").style.opacity = "0.5";
    alert("votre panier est vide!")
  }
  else {
    return JSON.parse(cart)
  }
}
// ---- Getting the id of my products in the API with the Id of the products---------//
function getProducts(id) {
  return fetch( `http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    return res.json()
  })
  .catch(function(error) {
    console.log(error);
  })
}
// ----------------Displaying the products from the cart in the HTML --------//
function displayProducts(basket,a, productApi){
  //Adding HTML with innerHTML by replacing the values with the values from the API and from the localStorage//
  document.getElementById("cart__items").innerHTML +=
    `<article class="cart__item" data-id="${basket[a].id}" data-color="${basket[a].color}">
      <div class="cart__item__img">
        <img src="${productApi.imageUrl}" alt="${productApi.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${productApi.name}</h2>
          <p>${basket[a].color}</p>
          <p>${productApi.price}</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <br><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[a].quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
}
// -------------------Being able ton change quantity, from the cart with the input------//
// -----Getting the index of the products quantity which is changed then for the value gotten turning into a number//
function changeQuantity(){
  document.querySelectorAll(".itemQuantity").forEach(el => {
    el.addEventListener('change',(e) => {
      let newCart = JSON.parse(localStorage.getItem("basket"));
      let articleId = el.closest("article").getAttribute("data-id");
      let articleColor = el.closest("article").getAttribute("data-color");
      let index = newCart.findIndex(cart => cart.id === articleId && cart.color === articleColor)
      newCart[index].quantity = parseInt(e.target.value)
      localStorage.setItem("basket",JSON.stringify(newCart))
      window.location.reload()
  })}) 
}
// --------------Delete product with the delete button, using addEventListener---------//
// --------As for changeQuantity, getting the index of the products to delete only this one-///
function deleteProduct(){
  document.querySelectorAll(".deleteItem").forEach(el => {
    el.addEventListener('click',(e) => {
      let newCart = JSON.parse(localStorage.getItem("basket"));
      let articleId = el.closest("article").getAttribute("data-id");
      let articleColor = el.closest("article").getAttribute("data-color");
      let index = newCart.findIndex(cart => cart.id === articleId && cart.color === articleColor)
      newCart.splice(index,1)
      localStorage.setItem("basket",JSON.stringify(newCart))
      document.querySelector(".cart__item").remove();
      window.location.reload()
    })
  })
}
// ---------------------Calculate the total price---------------//
// ---- Creating 2 arrays to push the prices of all the products, //
// before that multiply each product quantity with it price// 
function productPrice(){
  let basket = JSON.parse(localStorage.getItem("basket"));
  let prices = [];
  let totalQuantity = []
  for ( i=0 ; i< basket.length; i++){
    let element = document.querySelectorAll(".cart__item__content__description");
    let priceApi = parseInt(element[i].children[2].textContent);
    let quantity = parseInt(basket[i].quantity);
    let productPrice = quantity*priceApi;
    prices.push(productPrice)
    totalQuantity.push(quantity)
  }
  // -----Getting my quantities and my prices to add all of them-----//
  const totalPrices = prices;
  const allQuantity = totalQuantity;
  let sumPrice = 0;
  let sumQuantity = 0;
  for(let i=0; i<prices.length; i++){
    sumPrice += prices[i];
  }
  for(let i=0; i<totalQuantity.length; i++){
    sumQuantity += totalQuantity[i];
  }
  // ----- Putting the total price in the HTML to change each time either quantity change---///
  document.querySelector("#totalQuantity").innerHTML += `${sumQuantity}`;
  document.querySelector("#totalPrice").innerHTML +=`${sumPrice}`;
}
// ---getForm create objects to send to API and control if the form fields are valid------------------------///
function getForm(){
  let basket = JSON.parse(localStorage.getItem("basket"));
  let products= []
  for(let i=0; i< basket.length; i++){
    let productsId = basket[i].id
    products.push(productsId)   
  }
  localStorage.setItem("products",JSON.stringify(products))
  dataUser();
}
function dataUser(){
  //Create an object with the users data//
  document.querySelector("#order").addEventListener('click', (e) => {
    e.preventDefault();
    const contact = {
      firstName: document.getElementById("firstName").value, 
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    }
    //Using regex to control the user data////// send the user data in the localStorage to save them and POST to API//
    if(firstNameControl() && lastNameControl() && adressControl() && cityControl() && EmailControl()){
      localStorage.setItem("contact",JSON.stringify(contact)) ;
      sendToApi();
    }
    else {
      alert("Veuillez remplir les champs invalides")
    }
    // Conditions to respect with Regex if not valid message under the field concerned/////
    function firstNameControl(){
      let reFirstName = /^[a-zA-Z-]+$/;
      if(reFirstName.test(contact.firstName)){
        return true;
      }
      else{
        document.getElementById("firstNameErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer un Prenom valide"
        return false;
      }
    }
    function lastNameControl(){
      let reLastName = /^[a-zA-Z-]+$/;
      if(reLastName.test(contact.lastName)){
        return true
      }
      else{
        document.getElementById("lastNameErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer un Nom valide"
        return false;
      }
    }
    function adressControl(){
      let reAdress = /^[a-zA-Z0-9\s,.'-]{3,}$/;
      if(reAdress.test(contact.address)){
        return true
      }
      else{
        document.getElementById("addressErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer une adresse valide"
        return false;
      }
    }
    function cityControl(){
      let reCity = /^[a-zA-Z-]+$/;
      if(reCity.test(contact.city)){
       return true
      }
      else{
        document.getElementById("cityErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer une ville valide"
      }
    }
    function EmailControl(){
      let reEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
      if(reEmail.test(contact.email)){
        return true
      }
      else{
        document.getElementById("emailErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer une adresse email valide"
      }
    }
    // ----Getting all the elements to send, putting the correct objects and stringify it to send to the API--//
    function sendToApi(){
      const products = JSON.parse(localStorage.getItem("products"))
      const promise =  fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify({
          contact : {
            firstName: document.getElementById("firstName").value, 
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
          }, 
          products: products,  
        }),
        headers:{
          "Content-type": "application/json",
        }
      })
      // ---Getting back the response, especially the Id and redirect the URL with the orderId--//
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('orderId', data.orderId);
        document.location.href = 'confirmation.html?id='+ data.orderId;
      })
    }
    
})}

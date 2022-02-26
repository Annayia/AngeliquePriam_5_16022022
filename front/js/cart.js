main ();
async function main (){
    // Je recupere le panier de mon localStorage///
    const basket = getCart()
    // je recupere les donnees de mon API et de mon panier grace a l'id avec une//
    // boucle pour chaque produit de mon panier et je deploie mes produits avec la fonction Display////
    for( i = 0 ; i < basket.length ; i++ ){
      let productApi = await getProducts(basket[i].id)
      displayProducts(basket,i, productApi)  
    }
    changeQuantity();
    deleteProduct();
    productPrice();
    getForm();
}
// ma fonction recupere mon localStorage avec getItem et la retourne en JSONparse pour avoir le tableau///
function getCart () {
    let cart = localStorage.getItem("basket")
    if (cart === null) {
        return []
    }
    else {
        return JSON.parse(cart)
    }
}
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
  // j'ajoute le HTML avec innerHTML en remplacant les valeurs par les valeurs de mon panier et mon api//
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
function changeQuantity(){
  document.querySelectorAll(".itemQuantity").forEach(el => {
    el.addEventListener('click',(e) => {
      let newCart = JSON.parse(localStorage.getItem("basket"));
      let articleId = el.closest("article").getAttribute("data-id");
      let articleColor = el.closest("article").getAttribute("data-color");
      let index = newCart.findIndex(cart => cart.id === articleId && cart.color === articleColor)
      newCart[index].quantity = parseInt(e.target.value)
      localStorage.setItem("basket",JSON.stringify(newCart))
  })}) 
}
// --------------Delete product with the delete button, using addEventListener---------//
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
    })
  })
}
// ---------------------Calculate the total price---------------//
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
  document.querySelector("#totalQuantity").innerHTML += `${sumQuantity}`;
  document.querySelector("#totalPrice").innerHTML +=`${sumPrice}`;
}
// -------------Form------------------------///
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
  // creation de l'objet contact avec les elements remplis dans le formulaire//
  document.querySelector("#order").addEventListener('click', (e) => {
  e.preventDefault();
  const contact = {
    firstName: document.getElementById("firstName").value, 
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value
  }
  // gestion des Regex, validation du formulaire////// envoi de l'objet contact dans le localStorage//
  if(firstNameControl() && lastNameControl() && adressControl() && cityControl() && EmailControl()){
    localStorage.setItem("contact", JSON.stringify(contact));
  }else {
  alert("Veuillez remplir les champs invalides")
  }
  // conditions de controle/////
  function firstNameControl(){
    let reFirstName = /^[a-zA-Z-]+$/;
    if(reFirstName.test(contact.firstName)){
      return true;
    }else{
      document.getElementById("firstNameErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer un Prenom valide"
      return false;
    }
  }
  function lastNameControl(){
    let reLastName = /^[a-zA-Z-]+$/;
    if(reLastName.test(contact.lastName)){
      return true
    }else{
      document.getElementById("lastNameErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer un Nom valide"
      return false;
    }
  }
  function adressControl(){
    let reAdress = /^[a-zA-Z0-9\s,.'-]{3,}$/;
      if(reAdress.test(contact.address)){
        return true
      }else{
        document.getElementById("addressErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer une adresse valide"
        return false;
      }
    }
  function cityControl(){
    let reCity = /^[a-zA-Z-]+$/;
    if(reCity.test(contact.city)){
      return true
    }else{
      document.getElementById("cityErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer une ville valide"
    }
  }
  function EmailControl(){
    let reEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
    if(reEmail.test(contact.email)){
      return true
    }else{
      document.getElementById("emailErrorMsg").innerHTML += "valeur incorrecte, veuillez entrer une adresse email valide"
    }
  }
// fonction pour envoyer avec fetch et post le tableau products et l'objet contact//////
  
})}




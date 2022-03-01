// ---Main function contains all the functions for the Product page--///
main();
// ----Async function allows to await a response from another function before executing the others---//
async function main() {
    const productId = getProductId()
    const product = await getProducts(productId)
    displayProducts(product)
    createBasket(productId)
}
// ---Getting back the product Id by searching it in the URL of the product page--//
function getProductId () {
    return new URL(document.location).searchParams.get('id')
}
// ------Getting the data of this particular product with the id in the API---///
function getProducts(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (res) {
        return res.json()
    })
    .then(function(products) {
        return products
    })
    .catch(function(error) {
        console.log(error);
    })
}
// ----With the data gotten in the API, inject it in the HTML to see the product on the page especially the array of colors---//
function displayProducts(product) {
    document.querySelector('.item__img').innerHTML = (`<img src="${product.imageUrl}" alt="${product.altTxt}">`)
    document.getElementById("title").innerHTML = `${product.name}`
    document.getElementById("price").innerHTML = `${product.price}`
    document.getElementById("description").innerHTML = `${product.description}`
    for(let color of product.colors){
        document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`
    };
}
// -----function to create the basket in the localStorage----///
function createBasket (productId) {
    document.getElementById('addToCart').addEventListener('click', () => {
        let color = (document.getElementById("colors").value)
        let quantity = (document.getElementById("quantity").value)
        let productName = (document.getElementById("title").textContent)
        let id = productId
        let basket = {
            color,
            quantity : parseInt(quantity),
            id
        }
    // ----Changing the quantity of the products by adding them in the localStorage for the same product///
    // ---With the same color---///
        if(quantity >=1 && quantity <= 100 &&color !== null && color !== "") {
            if(localStorage.getItem("basket")) {
                let getBasket = JSON.parse(localStorage.getItem("basket"));
                const index = getBasket.findIndex(cart => cart.id === basket.id && cart.color === basket.color);
            if (index >= 0) {
                getBasket[index].quantity = basket.quantity + getBasket[index].quantity;
                localStorage.setItem("basket",JSON.stringify(getBasket))
            }
            else{
                getBasket.push(basket)
                localStorage.setItem("basket",JSON.stringify(getBasket))
            }
        }
        else{
            basketTab = new Array( basket)
            localStorage.setItem("basket",JSON.stringify(basketTab))
        }
        alert(`Vous avez bien ajouté ${quantity} ${productName} ${color}`)
        }
        else{
            alert("Erreur, la selection n'est pas valide")
        } 
    })
}   
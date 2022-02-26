main()

async function main() {
    const productId = getProductId()
    const product = await getProducts(productId)
    displayProducts(product)
    createBasket(productId)
}
function getProductId () {
    return new URL(document.location).searchParams.get('id')
}
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
    function displayProducts(product) {
        document.querySelector('.item__img').innerHTML = (`<img src="${product.imageUrl}" alt="${product.altTxt}">`)
        document.getElementById("title").innerHTML = `${product.name}`
        document.getElementById("price").innerHTML = `${product.price}`
        document.getElementById("description").innerHTML = `${product.description}`
        for(let color of product.colors){
        document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`
        };
    }

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
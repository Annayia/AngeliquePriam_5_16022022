main()

async function main() {
    const productId = getProductId()
    const product = await getProducts(productId)
    console.log(product)
    displayProducts(product)
}

function getProductId () {
    return new URL(location.href).searchParams.get('id')
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
        document.getElementsByClassName("item__img").innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`
        document.getElementById("title").innerHTML += `${product.name}`
        document.getElementById("price").innerHTML += `${product.price}`
        document.getElementById("description").innerHTML += `${product.description}`
        document.getElementById("colors").innerHTML += `<option value="${product.colors}">${product.colors}</option>`
    }
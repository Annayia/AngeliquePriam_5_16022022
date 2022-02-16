main()

async function main() {
    const products = await getProducts()
    for ( product of products) {
        displayProducts(product)
    }
}

 function getProducts() {
return fetch(" http://localhost:3000/api/products")
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

function displayProducts() {
    document.getElementById("items").innerHTML += ` <a href="./product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>`
}



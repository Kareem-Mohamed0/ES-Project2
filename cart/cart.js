const product = JSON.parse(localStorage.getItem("selectedProduct"));

if (product) {
  document.querySelector(".main-image img").src = product.image1;
  document.querySelector(".image:nth-child(1) img").src = product.image2;
  document.querySelector(".image:nth-child(2) img").src = product.image3;
  document.querySelector(".image:nth-child(3) img").src = product.image4;

  document.querySelector(".name").textContent = product.name;
  document.querySelector(".price").textContent = `$${product.price}`;
}

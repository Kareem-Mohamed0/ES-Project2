document.querySelectorAll(".product-card").forEach((product) =>
  product.addEventListener("click", function (e) {
    const item = {
      name: product.dataset.name,
      price: product.dataset.price,
      rate: product.dataset.rate,
      image1: product.dataset.image1,
      image2: product.dataset.image2,
      image3: product.dataset.image3,
      image4: product.dataset.image4,
    };
    localStorage.setItem("selectedProduct", JSON.stringify(item));
    window.location.assign("/cart/cart.html");
  }),
);
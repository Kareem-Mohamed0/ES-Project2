import { getProduct } from "../js/shared.js";
async function loadProduct() {
  let id = new URLSearchParams(window.location.search).get("id");
  let product = await getProduct(id);

  if (product) {
    document.querySelector(".main-image img").src = product.image;
    document.querySelector(".image:nth-child(1) img").src = product.image;
    document.querySelector(".image:nth-child(2) img").src = product.image1;
    document.querySelector(".image:nth-child(3) img").src = product.image2;

    document.querySelector(".name").textContent = product.name;

    document.querySelector(".price").textContent = `$${product.price}`;

    let productEl = document.querySelector(".add-to-cart");
    productEl.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const sizeEl = document.querySelector(".sizes span.active");
      const colorEl = document.querySelector(".colors span.active");
      const quantityEl = document.querySelector(".quantity-btn span");
      if (!sizeEl) {
        alert("Please select a size");
        return;
      }
      if (!colorEl) {
        alert("please select a color");
        return;
      }

      let bs = new bootstrap.Modal(document.getElementById("ChoosingModal"));
      bs.show();

      const cartItem = {
        id: Number(product.id) + Math.random() * 100,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: Number(quantityEl.textContent),
        size: sizeEl.textContent,
        color: colorEl.getAttribute("data-color"),
      };
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  }
}
loadProduct();

const loader = document.querySelector(".loading-spinner");
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (link) {
    loader.classList.remove("d-none");
  }
});

window.addEventListener("load", () => {
  loader.classList.add("d-none");
});

//---------------------------
const sizesBtns = document.querySelectorAll(".sizes span");
sizesBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sizesBtns.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
  });
});
//---------------------------
const colorsBtns = document.querySelectorAll(".colors span");
colorsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    colorsBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");
  });
});

//---------------------------
const quantityNum = document.querySelector(".quantity-btn span");
document
  .querySelector(".quantity-btn :first-child")
  .addEventListener("click", () => {
    let currentValue = parseInt(quantityNum.textContent);
    quantityNum.textContent = currentValue > 1 ? currentValue - 1 : 1;
  });
document
  .querySelector(".quantity-btn :last-child")
  .addEventListener("click", () => {
    let currentValue = parseInt(quantityNum.textContent);
    console.log(currentValue);
    quantityNum.textContent = currentValue + 1;
  });
//---------------------------

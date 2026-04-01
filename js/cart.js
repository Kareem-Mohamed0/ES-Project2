document.addEventListener("DOMContentLoaded", () => {
  displayCart();
});

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items-container");

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-cart-shopping fs-1 text-secondary mb-3"></i>
                <h3>Your cart is empty</h3>
                <p class="text-secondary">Looks like you haven't added anything yet.</p>
                <a href="product.html" class="btn btn-black mt-3 px-5 py-2">Shop Now</a>
            </div>`;
    calculateTotal([]); // Use this instead of updateSummary
    return;
  }

  container.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item d-flex align-items-center gap-3 mb-3 pb-3 ${index !== cart.length - 1 ? "border-bottom" : ""}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img rounded-3" style="width: 100px; height: 100px; object-fit: cover;">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                    <h6 class="fw-bold mb-0">${item.name}</h6>
                    <button class="btn text-danger p-0" onclick="removeItem(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <p class="small text-secondary mb-1">Size: <span class="text-dark">${item.size}</span></p> 
                <p class="small text-secondary mb-2">Color: <span class="text-dark">${item.color}</span></p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold fs-5">$${item.price}</span>
                    <div class="quantity-control d-flex align-items-center gap-3 bg-light rounded-pill px-3 py-1">
                        <button class="btn btn-sm p-0 border-0" onclick="changeQty(${item.id}, -1)">-</button>
                        <span class="fw-bold">${item.quantity ?? 1}</span>
                        <button class="btn btn-sm p-0 border-0" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  calculateTotal(cart);
}

// Global functions attached to window for HTML onclick access
window.removeItem = (id) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id != id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
};

  window.changeQty = (id, change) => {
    // 2. Get the latest data from storage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 3. Use == to handle string vs number ID issues
    const item = cart.find((i) => i.id == id);

    if (item) {
      // Apply the change
      console.log(item.quantity);

      item.quantity = (Number(item.quantity) || 1) + Number(change);
      console.log(item.quantity);
      

      // 4. Safety: Don't allow less than 1 item
      if (item.quantity < 1) {
        item.quantity = 1;
      }

      // 5. Save the updated array back to storage
      localStorage.setItem("cart", JSON.stringify(cart));

      // 6. CRITICAL: Re-render the UI to show the new number
      displayCart();
    } else {
      console.error("Product not found in cart for ID:", id);
    }
  };

function calculateTotal(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0,
  );
  const discount = subtotal * 0.2;
  const delivery = subtotal > 0 ? 15 : 0; // Only charge delivery if items exist
  const total = subtotal - discount + delivery;

  // Update UI
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

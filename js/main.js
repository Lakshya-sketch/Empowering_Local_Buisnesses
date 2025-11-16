document.addEventListener("DOMContentLoaded", () => {
  const cartTable = document.getElementById("cartTable");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const orderMsg = document.getElementById("orderMsg");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();

  function renderCart() {
    if (cart.length === 0) {
      cartTable.innerHTML = "<p>Your cart is empty.</p>";
      placeOrderBtn.style.display = "none";
      orderMsg.classList.add("hidden");
      return;
    }

    let total = 0;
    cartTable.innerHTML = "";
    cart.forEach((item, idx) => {
      total += item.price;
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <img src="${item.image}" />
        <span>${item.name} (${item.shop})</span>
        <span class="cart-price">₹${item.price}</span>
        <button class="remove-btn" data-idx="${idx}">Remove</button>
      `;
      cartTable.appendChild(row);
    });

    // Total row
    const totalRow = document.createElement("div");
    totalRow.className = "cart-row";
    totalRow.innerHTML = `
      <span><strong>Total</strong></span>
      <span></span>
      <span class="cart-price"><strong>₹${total}</strong></span>
      <span></span>
    `;
    cartTable.appendChild(totalRow);

    placeOrderBtn.style.display = "";
  }

  cartTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const idx = +e.target.dataset.idx;
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    localStorage.setItem("lastOrder", JSON.stringify(cart));
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    orderMsg.classList.remove("hidden");
    orderMsg.innerHTML = `Your order has been placed!<br>Thank you for shopping with LocalBizConnect.`;
    setTimeout(() => orderMsg.classList.add("hidden"), 8000);
  });
});
